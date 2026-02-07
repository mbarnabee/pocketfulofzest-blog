# Pocketful of Zest - Setup Guide

This guide will walk you through setting up and running your new PWA food blog.

## 🎯 Current Status

✅ Next.js 15 project initialized with TypeScript and Tailwind CSS
✅ Sanity Studio configured with recipe and category schemas
✅ PWA configuration with offline caching and manifest
✅ Fresh-inspired color scheme applied
✅ Migration script ready to transfer recipes from Zola
⏳ **Next step: Create Sanity project and run migration**

## 📋 Prerequisites

- Node.js 18+ installed
- A Sanity.io account (free tier is perfect)

## 🚀 Step 1: Create Your Sanity Project

### 1. Visit Sanity.io
Go to [https://www.sanity.io](https://www.sanity.io) and sign up or log in.

### 2. Create a New Project
1. Click "Create new project"
2. Name it "Pocketful of Zest" (or your preferred name)
3. Choose "Production" for the dataset name
4. Select a region (US recommended)

### 3. Get Your Project Credentials
After creating the project, you'll see:
- **Project ID** - Copy this
- Go to **API** section in project settings
- Create a new token with **Editor** permissions
- Copy the token

## 🔐 Step 2: Configure Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values:

```bash
# Replace with your actual values from Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-02-01

# Your API token from Sanity (Editor permissions)
SANITY_API_TOKEN=skAbcDefGhiJklMnoPqrStuVwxYz123456789

# Generate a random secret for revalidation
REVALIDATION_SECRET=your-random-secret-here
```

💡 **Tip:** To generate a random secret, run: `openssl rand -base64 32`

## 📦 Step 3: Run the Migration

Now that Sanity is configured, migrate your recipes from Zola:

```bash
npm run migrate
```

This will:
- Read all 22 recipe markdown files from the old Zola blog
- Parse ingredients, instructions, and metadata
- Upload cover images to Sanity's CDN
- Create recipe documents in Sanity

**Expected output:**
```
🚀 Starting Zola to Sanity migration...
Source: /Users/mbarnabee/Projects/rust/blog/content
Target: Sanity project abc123xyz / production

📄 Processing: instant-pot-crispy-pork-carnitas
  📸 Uploading cover image...
  ☁️  Uploading to Sanity...
  ✅ Successfully migrated: Instant Pot Crispy Pork Carnitas

... (continues for all recipes)

✨ Migration complete!
  ✅ Succeeded: 22
  ❌ Failed: 0
  📊 Total: 22
```

## 🎨 Step 4: Open Sanity Studio

After migration, review your content in Sanity Studio:

```bash
npm run studio
```

This will open Sanity Studio at [http://localhost:3000/studio](http://localhost:3000/studio)

### What to Check:
- [ ] All 22 recipes are visible
- [ ] Cover images loaded correctly
- [ ] Ingredient sections are properly structured
- [ ] Instructions are numbered and complete
- [ ] Categories are created (e.g., "Main Dish", "Appetizers")

## 🏗️ Step 5: Development

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run studio` - Open Sanity Studio
- `npm run migrate` - Run migration script (one-time use)
- `npm run lint` - Run ESLint

## 📱 Step 6: Generate PWA Icons

You'll need app icons for the PWA functionality. Place your logo in the `public` directory and generate icons:

### Option 1: Online Tool (Easiest)
1. Visit [https://realfavicongenerator.net/](https://realfavicongenerator.net/)
2. Upload your logo
3. Download generated icons
4. Place them in the `public` directory

### Option 2: Command Line
If you have ImageMagick installed:

```bash
convert logo.png -resize 192x192 public/icon-192.png
convert logo.png -resize 512x512 public/icon-512.png
convert logo.png -resize 180x180 public/apple-touch-icon.png
convert logo.png -resize 32x32 public/favicon.ico
```

### Option 3: PWA Asset Generator

```bash
npx pwa-asset-generator logo.svg ./public --icon-only
```

## 🎯 Next Steps (Already Planned)

The following components will be built next:

1. **Recipe Components**
   - RecipeCard component with print functionality
   - RecipeList for homepage
   - IngredientSection with checkboxes
   - InstructionList with numbered steps

2. **Pages**
   - Homepage (recipe list)
   - Individual recipe pages (`/recipes/[slug]`)
   - Category pages (`/categories/[slug]`)

3. **GitHub & Deployment**
   - Initialize Git repository
   - Connect to GitHub
   - Deploy to Vercel
   - Set up automatic deployments

4. **Final Polish**
   - Integrate your new logo
   - Apply design refinements
   - Test PWA functionality
   - Run performance audits

## 🐛 Troubleshooting

### Migration fails with "Missing Sanity configuration"
- Make sure you've updated `.env.local` with your actual Sanity credentials
- Restart your terminal after updating environment variables

### "ERESOLVE unable to resolve dependency tree"
- Use `npm install --legacy-peer-deps` for package installations
- This is due to React version differences and is expected

### Images not uploading
- Check that image files exist in the Zola content directories
- Verify Sanity token has Editor permissions
- Check file paths in the migration script output

### Sanity Studio won't start
- Make sure port 3000 is not already in use
- Check that Sanity packages installed correctly
- Verify `.env.local` has correct project ID

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)

## 🎉 Ready to Migrate?

Once you've completed Steps 1-2 above, run:

```bash
npm run migrate
```

Then check Sanity Studio to verify everything migrated correctly!
