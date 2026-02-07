import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  fields: [
    // Basic Info
    defineField({
      name: 'title',
      type: 'string',
      title: 'Recipe Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedDate',
      type: 'datetime',
      title: 'Published Date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      title: 'Cover Image',
      options: {
        hotspot: true,
      },
    }),

    // Blog Content (narrative before recipe)
    defineField({
      name: 'introduction',
      type: 'text',
      title: 'Introduction',
      description: 'Short intro text (before the <!--more--> marker)',
      rows: 3,
    }),
    defineField({
      name: 'body',
      type: 'array',
      title: 'Article Body',
      description: 'Main blog content before the recipe card',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),

    // Recipe Metadata
    defineField({
      name: 'yield',
      type: 'string',
      title: 'Yield',
      description: 'e.g., "6-8 servings" or "4 servings"',
    }),
    defineField({
      name: 'prepTime',
      type: 'string',
      title: 'Prep Time',
      description: 'e.g., "15 minutes"',
    }),
    defineField({
      name: 'cookTime',
      type: 'string',
      title: 'Cook Time',
      description: 'e.g., "1 hour"',
    }),
    defineField({
      name: 'totalTime',
      type: 'string',
      title: 'Total Time',
      description: 'e.g., "1 hour 15 minutes"',
    }),

    // Ingredient Sections (multiple sections support)
    defineField({
      name: 'ingredientSections',
      type: 'array',
      title: 'Ingredient Sections',
      description: 'Multiple sections for complex recipes (e.g., salad + dressing)',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Section Title',
              description: 'Optional: leave blank for single section recipes',
            },
            {
              name: 'ingredients',
              type: 'array',
              title: 'Ingredients',
              of: [{ type: 'string' }],
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'title',
              ingredients: 'ingredients',
            },
            prepare({ title, ingredients }) {
              return {
                title: title || 'Ingredients',
                subtitle: `${ingredients?.length || 0} ingredients`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    // Instructions
    defineField({
      name: 'instructions',
      type: 'array',
      title: 'Instructions',
      description: 'Step-by-step cooking instructions',
      of: [{ type: 'text' }],
      validation: (Rule) => Rule.required().min(1),
    }),

    // Notes
    defineField({
      name: 'notes',
      type: 'array',
      title: 'Recipe Notes',
      description: 'Additional tips, substitutions, storage info, etc.',
      of: [{ type: 'text' }],
    }),

    // Taxonomy
    defineField({
      name: 'categories',
      type: 'array',
      title: 'Categories',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      publishedDate: 'publishedDate',
    },
    prepare({ title, media, publishedDate }) {
      return {
        title: title,
        subtitle: publishedDate
          ? new Date(publishedDate).toLocaleDateString()
          : 'No date',
        media: media,
      }
    },
  },
})
