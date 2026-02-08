import { client } from '@/lib/sanity'
import { recipesListQuery } from '@/lib/queries'
import RecipeGrid from '@/components/RecipeGrid'
import type { Recipe } from '@/lib/sanity'
import Logo from '@/components/Logo'

export default async function Home() {
  const recipes = await client.fetch<Recipe[]>(recipesListQuery)

  return (
    <main className="min-h-screen flex flex-col items-center pt-12 md:pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

      {/* 1. Header Section with Logo */}
      <header className="mb-16 sm:mb-24 text-center">
        <Logo />
      </header>

      {/* 2. Hero Content Section */}
      <section className="w-full max-w-3xl mx-auto">
        {/* Main Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-zest-green-dark text-center mb-8 sm:mb-12 leading-tight">
          Fresh Flavors, Zesty Stories.
        </h1>

        {/* Introduction Text */}
        <p className="text-lg md:text-xl text-zest-green-body leading-relaxed text-center mb-20">
          Welcome to Pocketful of Zest! Explore vibrant, easy-to-make recipes that
          bring a burst of flavor to your kitchen, all crafted with a touch of citrus magic.
        </p>

        {/* Decorative line */}
        <div className="w-full h-px bg-zest-green-pale mb-20 max-w-md mx-auto"></div>
      </section>

      {/* Recipe Grid */}
      <section id="recipes" className="w-full">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-zest-green-dark text-center mb-12">
          Recent Recipes
        </h2>
        {recipes && recipes.length > 0 ? (
          <RecipeGrid recipes={recipes} />
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-zest-green-body">No recipes found.</p>
          </div>
        )}
      </section>
    </main>
  )
}
