'use client'

import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Recipe } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'
import RecipeMeta from './RecipeMeta'
import IngredientSection from './IngredientSection'
import InstructionList from './InstructionList'
import RecipeNotes from './RecipeNotes'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Cover Image */}
      {recipe.coverImage && (
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-8 shadow-lg">
          <Image
            src={urlFor(recipe.coverImage).width(1200).height(600).url()}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6">{recipe.title}</h1>

      {/* Introduction */}
      {recipe.introduction && (
        <div className="text-lg text-gray-700 mb-6 leading-relaxed">
          {recipe.introduction}
        </div>
      )}

      {/* Article Body Content */}
      {recipe.body && recipe.body.length > 0 && (
        <div className="prose prose-lg max-w-none mb-12">
          <PortableText
            value={recipe.body}
            components={{
              types: {
                image: ({ value }) => (
                  <div className="relative w-full h-96 my-8 rounded-lg overflow-hidden">
                    <Image
                      src={urlFor(value).width(800).height(600).url()}
                      alt={value.alt || 'Recipe image'}
                      fill
                      className="object-cover"
                    />
                  </div>
                ),
              },
              block: {
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">{children}</h3>
                ),
                normal: ({ children }) => (
                  <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
                ),
              },
              marks: {
                strong: ({ children }) => (
                  <strong className="font-bold text-gray-900">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                link: ({ children, value }) => (
                  <a
                    href={value?.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-emphasis hover:text-accent underline"
                  >
                    {children}
                  </a>
                ),
              },
            }}
          />
        </div>
      )}

      {/* Recipe Card */}
      <div
        id="recipe"
        className="bg-white border-2 border-accent rounded-xl p-6 shadow-lg"
      >
        {/* Header */}
        <div className="border-b-3 border-accent pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            {recipe.title}
          </h1>
        </div>

        {/* Metadata */}
        {(recipe.yield || recipe.prepTime || recipe.cookTime || recipe.totalTime) && (
          <div className="mb-6">
            <RecipeMeta
              yield={recipe.yield}
              prepTime={recipe.prepTime}
              cookTime={recipe.cookTime}
              totalTime={recipe.totalTime}
            />
          </div>
        )}

        {/* Ingredients */}
        <div className="mb-8">
          {recipe.ingredientSections.map((section, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <IngredientSection
                title={section.title || (index === 0 ? 'Ingredients' : undefined)}
                ingredients={section.ingredients}
              />
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <InstructionList instructions={recipe.instructions} />
        </div>

        {/* Notes */}
        {recipe.notes && recipe.notes.length > 0 && (
          <RecipeNotes notes={recipe.notes} />
        )}

        {/* Print Button */}
        <button
          onClick={() => window.print()}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-lime text-gray-800 font-semibold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
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
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print Recipe
        </button>
      </div>
    </article>
  )
}
