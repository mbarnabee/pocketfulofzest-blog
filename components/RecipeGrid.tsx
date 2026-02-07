import Image from 'next/image'
import Link from 'next/link'
import { Recipe } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'

interface RecipeGridProps {
  recipes: Recipe[]
}

export default function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {recipes.map((recipe) => (
        <Link
          key={recipe._id}
          href={`/recipes/${recipe.slug.current}`}
          className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-accent"
        >
          {/* Image */}
          {recipe.coverImage && (
            <div className="relative w-full h-64 overflow-hidden">
              <Image
                src={urlFor(recipe.coverImage).width(600).height(400).url()}
                alt={recipe.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-5">
            <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-accent-emphasis transition-colors">
              {recipe.title}
            </h2>

            {recipe.introduction && (
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                {recipe.introduction}
              </p>
            )}

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {recipe.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-2 py-1 text-xs font-medium bg-accent/20 text-accent-emphasis rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {recipe.tags.length > 3 && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-200 text-gray-600 rounded-full">
                    +{recipe.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
