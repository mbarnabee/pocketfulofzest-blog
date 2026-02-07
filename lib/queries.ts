// GROQ queries for fetching data from Sanity

// Fetch all recipes with basic info for listing pages
export const recipesListQuery = `
  *[_type == "recipe"] | order(publishedDate desc) {
    _id,
    title,
    slug,
    publishedDate,
    coverImage,
    introduction,
    "categories": categories[]->{ title, slug },
    tags
  }
`

// Fetch a single recipe by slug
export const recipeBySlugQuery = `
  *[_type == "recipe" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedDate,
    coverImage,
    introduction,
    body,
    yield,
    prepTime,
    cookTime,
    totalTime,
    ingredientSections,
    instructions,
    notes,
    "categories": categories[]->{ title, slug },
    tags
  }
`

// Fetch all recipe slugs (for static generation)
export const recipeSlugQuery = `
  *[_type == "recipe"] {
    "slug": slug.current
  }
`

// Fetch all categories
export const categoriesQuery = `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`

// Fetch recipes by category
export const recipesByCategoryQuery = `
  *[_type == "recipe" && $categoryId in categories[]._ref] | order(publishedDate desc) {
    _id,
    title,
    slug,
    publishedDate,
    coverImage,
    introduction,
    "categories": categories[]->{ title, slug },
    tags
  }
`

// Fetch category by slug
export const categoryBySlugQuery = `
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description
  }
`

// Fetch all category slugs (for static generation)
export const categorySlugQuery = `
  *[_type == "category"] {
    "slug": slug.current
  }
`
