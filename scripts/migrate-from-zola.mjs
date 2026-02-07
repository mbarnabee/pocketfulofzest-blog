#!/usr/bin/env node
/**
 * Migration script to transfer recipes from Zola blog to Sanity CMS
 *
 * This script:
 * 1. Reads all recipe markdown files from the Zola content directory
 * 2. Parses YAML frontmatter and HTML recipe cards
 * 3. Extracts ingredients, instructions, and notes
 * 4. Uploads images to Sanity's CDN
 * 5. Creates Sanity documents via API
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { JSDOM } from 'jsdom';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configuration
const ZOLA_CONTENT_DIR = '/Users/mbarnabee/Projects/rust/blog/content';
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const SANITY_TOKEN = process.env.SANITY_API_TOKEN;

// Validate configuration
if (!SANITY_PROJECT_ID || !SANITY_TOKEN) {
  console.error('❌ Error: Missing Sanity configuration.');
  console.error('Please set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN in your .env.local file');
  process.exit(1);
}

// Initialize Sanity client
const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-02-01',
  useCdn: false,
  token: SANITY_TOKEN,
});

/**
 * Extract ingredient sections from recipe HTML
 */
function parseIngredientSections(recipeCard) {
  const sections = [];
  const ingredientDivs = recipeCard.querySelectorAll('.recipe-card__section');

  ingredientDivs.forEach((div) => {
    const title = div.querySelector('.recipe-card__section-title--ingredients');
    if (!title) return;

    const sectionTitle = title.textContent.trim();
    const ingredientElements = div.querySelectorAll('.recipe-card__ingredient');
    const ingredients = Array.from(ingredientElements).map(el => el.textContent.trim());

    if (ingredients.length > 0) {
      sections.push({
        title: sectionTitle === 'Ingredients' ? null : sectionTitle,
        ingredients,
      });
    }
  });

  return sections;
}

/**
 * Extract instructions from recipe HTML
 */
function parseInstructions(recipeCard) {
  const instructionElements = recipeCard.querySelectorAll('.recipe-card__instruction');
  return Array.from(instructionElements).map(el => el.textContent.trim());
}

/**
 * Extract notes from recipe HTML
 */
function parseNotes(recipeCard) {
  const notes = [];
  const notesDiv = recipeCard.querySelector('.recipe-card__notes');

  if (notesDiv) {
    const listItems = notesDiv.querySelectorAll('li');
    if (listItems.length > 0) {
      // If there are list items, extract them
      Array.from(listItems).forEach(li => {
        const text = li.textContent.trim();
        if (text) notes.push(text);
      });
    } else {
      // Otherwise, get paragraph text
      const paragraphs = notesDiv.querySelectorAll('p');
      Array.from(paragraphs).forEach(p => {
        const text = p.textContent.trim();
        if (text) notes.push(text);
      });
    }
  }

  return notes;
}

/**
 * Extract metadata from recipe HTML
 */
function parseMetadata(recipeCard) {
  const metadata = {};
  const metaItems = recipeCard.querySelectorAll('.recipe-card__meta-item');

  metaItems.forEach((item) => {
    const label = item.querySelector('strong')?.textContent.trim().toLowerCase();
    const value = item.querySelector('span')?.textContent.trim();

    if (label && value) {
      if (label.includes('yield')) metadata.yield = value;
      else if (label.includes('prep')) metadata.prepTime = value;
      else if (label.includes('cook')) metadata.cookTime = value;
      else if (label.includes('total')) metadata.totalTime = value;
    }
  });

  return metadata;
}

/**
 * Upload an image to Sanity
 */
async function uploadImage(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const ext = path.extname(imagePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };

    const mimeType = mimeTypes[ext] || 'image/jpeg';

    const asset = await sanityClient.assets.upload('image', imageBuffer, {
      filename: path.basename(imagePath),
      contentType: mimeType,
    });

    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (error) {
    console.error(`  ❌ Failed to upload image ${imagePath}:`, error.message);
    return null;
  }
}

/**
 * Convert markdown content to Portable Text blocks (simplified)
 */
function convertMarkdownToBlocks(markdown) {
  // Remove recipe card HTML
  const withoutRecipeCard = markdown.replace(/<div class="recipe-card"[\s\S]*?<\/div>\s*$/m, '');

  // Remove more marker
  const withoutMore = withoutRecipeCard.replace(/<!--more-->/g, '');

  // Split into paragraphs
  const paragraphs = withoutMore
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p && !p.startsWith('#') && !p.startsWith('<') && !p.startsWith('!['));

  // Convert to Portable Text blocks
  return paragraphs.map(text => ({
    _type: 'block',
    _key: Math.random().toString(36).substr(2, 9),
    style: 'normal',
    children: [
      {
        _type: 'span',
        text,
        marks: [],
      },
    ],
  }));
}

/**
 * Get existing categories or create new ones
 */
const categoryCache = {};

async function getOrCreateCategory(categorySlug) {
  if (categoryCache[categorySlug]) {
    return categoryCache[categorySlug];
  }

  // Check if category exists
  const existing = await sanityClient.fetch(
    `*[_type == "category" && slug.current == $slug][0]`,
    { slug: categorySlug }
  );

  if (existing) {
    categoryCache[categorySlug] = { _type: 'reference', _ref: existing._id };
    return categoryCache[categorySlug];
  }

  // Create new category
  const title = categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const newCategory = await sanityClient.create({
    _type: 'category',
    title,
    slug: { current: categorySlug, _type: 'slug' },
  });

  categoryCache[categorySlug] = { _type: 'reference', _ref: newCategory._id };
  return categoryCache[categorySlug];
}

/**
 * Process a single recipe file
 */
async function processRecipe(recipeDir) {
  const recipeName = path.basename(recipeDir);
  const indexPath = path.join(recipeDir, 'index.md');

  if (!fs.existsSync(indexPath)) {
    return null;
  }

  console.log(`\n📄 Processing: ${recipeName}`);

  try {
    // Read and parse markdown
    const fileContent = fs.readFileSync(indexPath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    // Parse HTML recipe card
    const dom = new JSDOM(content);
    const recipeCard = dom.window.document.querySelector('.recipe-card');

    if (!recipeCard) {
      console.error(`  ⚠️  No recipe card found in ${recipeName}`);
      return null;
    }

    // Extract recipe data
    const ingredientSections = parseIngredientSections(recipeCard);
    const instructions = parseInstructions(recipeCard);
    const notes = parseNotes(recipeCard);
    const metadata = parseMetadata(recipeCard);

    if (ingredientSections.length === 0 || instructions.length === 0) {
      console.error(`  ⚠️  Missing ingredients or instructions in ${recipeName}`);
      return null;
    }

    // Upload cover image
    let coverImage = null;
    if (frontmatter.extra?.coverImage) {
      const imagePath = path.join(recipeDir, 'images', frontmatter.extra.coverImage);
      if (fs.existsSync(imagePath)) {
        console.log(`  📸 Uploading cover image...`);
        coverImage = await uploadImage(imagePath);
      }
    }

    // Process categories
    const categoryRefs = [];
    if (frontmatter.categories) {
      for (const catSlug of frontmatter.categories) {
        const catRef = await getOrCreateCategory(catSlug);
        categoryRefs.push(catRef);
      }
    }

    // Convert body content
    const body = convertMarkdownToBlocks(content);

    // Extract introduction (content before <!--more-->)
    const moreMatch = content.match(/([\s\S]*?)<!--more-->/);
    const introduction = moreMatch ? moreMatch[1].replace(/^#.*\n/gm, '').trim() : null;

    // Create Sanity document
    const recipeDoc = {
      _type: 'recipe',
      title: frontmatter.title,
      slug: {
        current: recipeName,
        _type: 'slug',
      },
      publishedDate: new Date(frontmatter.date).toISOString(),
      coverImage,
      introduction,
      body,
      ...metadata,
      ingredientSections,
      instructions,
      notes: notes.length > 0 ? notes : undefined,
      categories: categoryRefs.length > 0 ? categoryRefs : undefined,
      tags: frontmatter.tags || undefined,
    };

    // Upload to Sanity
    console.log(`  ☁️  Uploading to Sanity...`);
    const created = await sanityClient.create(recipeDoc);
    console.log(`  ✅ Successfully migrated: ${frontmatter.title}`);

    return created;
  } catch (error) {
    console.error(`  ❌ Error processing ${recipeName}:`, error.message);
    return null;
  }
}

/**
 * Main migration function
 */
async function main() {
  console.log('🚀 Starting Zola to Sanity migration...\n');
  console.log(`Source: ${ZOLA_CONTENT_DIR}`);
  console.log(`Target: Sanity project ${SANITY_PROJECT_ID} / ${SANITY_DATASET}\n`);
  console.log('='.repeat(60));

  // Get all recipe directories
  const entries = fs.readdirSync(ZOLA_CONTENT_DIR, { withFileTypes: true });
  const recipeDirs = entries
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(ZOLA_CONTENT_DIR, entry.name))
    .filter(dir => fs.existsSync(path.join(dir, 'index.md')));

  console.log(`\n📚 Found ${recipeDirs.length} recipe directories\n`);

  let succeeded = 0;
  let failed = 0;

  // Process each recipe
  for (const recipeDir of recipeDirs) {
    const result = await processRecipe(recipeDir);
    if (result) {
      succeeded++;
    } else {
      failed++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Migration complete!');
  console.log(`  ✅ Succeeded: ${succeeded}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  📊 Total: ${recipeDirs.length}`);
  console.log('\n' + '='.repeat(60));

  if (succeeded > 0) {
    console.log('\n🎉 Next steps:');
    console.log('  1. Run `npm run studio` to open Sanity Studio');
    console.log('  2. Review the migrated recipes');
    console.log('  3. Make any necessary adjustments');
    console.log('  4. Start building your Next.js pages!');
  }
}

// Run migration
main().catch((error) => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
