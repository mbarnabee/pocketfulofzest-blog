import { client } from '@/lib/sanity'
import { recipesListQuery } from '@/lib/queries'
import RecipeGrid from '@/components/RecipeGrid'
import type { Recipe } from '@/lib/sanity'
import Image from 'next/image'

export default async function Home() {
  const recipes = await client.fetch<Recipe[]>(recipesListQuery)

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="flex items-center justify-center mb-6">
          <Image
            src="/pockefulofzest_logo.png"
            alt="Pocketful of Zest Logo"
            width={200}
            height={200}
            className="w-48 h-auto"
            priority
          />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Pocketful of Zest
        </h1>
        <p className="text-xl text-gray-600">
          Delicious recipes you can make anytime, anywhere
        </p>
      </header>

      {/* Recipe Grid */}
      {recipes && recipes.length > 0 ? (
        <RecipeGrid recipes={recipes} />
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600">No recipes found.</p>
        </div>
      )}
    </main>
  )
}
