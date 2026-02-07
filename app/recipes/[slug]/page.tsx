import { client } from '@/lib/sanity'
import { recipeBySlugQuery, recipeSlugQuery } from '@/lib/queries'
import RecipeCard from '@/components/RecipeCard'
import Link from 'next/link'
import type { Recipe } from '@/lib/sanity'
import { notFound } from 'next/navigation'

interface RecipePageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all recipes
export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(recipeSlugQuery)
  return slugs.map((item) => ({
    slug: item.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: RecipePageProps) {
  const { slug } = await params
  const recipe = await client.fetch<Recipe>(recipeBySlugQuery, { slug })

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
    }
  }

  return {
    title: `${recipe.title} | Pocketful of Zest`,
    description: recipe.introduction || `Learn how to make ${recipe.title}`,
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params
  const recipe = await client.fetch<Recipe>(recipeBySlugQuery, { slug })

  if (!recipe) {
    notFound()
  }

  return (
    <main className="min-h-screen py-12 px-4">
      {/* Back Link */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-accent-emphasis hover:text-accent font-medium transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to all recipes
        </Link>
      </div>

      {/* Recipe Card */}
      <RecipeCard recipe={recipe} />
    </main>
  )
}
