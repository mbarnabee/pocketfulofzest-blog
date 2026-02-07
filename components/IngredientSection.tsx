'use client'

import { useState } from 'react'

interface IngredientSectionProps {
  title?: string
  ingredients: string[]
}

export default function IngredientSection({ title, ingredients }: IngredientSectionProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())

  const toggleIngredient = (index: number) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-3">
      {title && (
        <h3 className="text-lg font-bold text-accent-emphasis border-b-2 border-lime pb-2 flex items-center gap-2">
          <span className="text-xl">🥘</span>
          {title}
        </h3>
      )}
      <div className="bg-gradient-to-br from-white to-bg-1 p-4 rounded-lg border border-border-muted space-y-2">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex items-start gap-3 py-2 border-b border-dashed border-border-muted last:border-0 cursor-pointer hover:bg-bg-2/50 px-2 rounded transition-colors"
            onClick={() => toggleIngredient(index)}
          >
            <input
              type="checkbox"
              checked={checkedItems.has(index)}
              onChange={() => toggleIngredient(index)}
              className="mt-1 w-5 h-5 cursor-pointer accent-accent flex-shrink-0"
              aria-label={`Check off ${ingredient}`}
            />
            <span
              className={`text-sm leading-relaxed ${
                checkedItems.has(index) ? 'line-through text-gray-400' : 'text-gray-800'
              }`}
            >
              {ingredient}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
