interface RecipeMetaProps {
  yield?: string
  prepTime?: string
  cookTime?: string
  totalTime?: string
}

export default function RecipeMeta({ yield: recipeYield, prepTime, cookTime, totalTime }: RecipeMetaProps) {
  const metaItems = [
    { label: 'Yield', value: recipeYield },
    { label: 'Prep Time', value: prepTime },
    { label: 'Cook Time', value: cookTime },
    { label: 'Total Time', value: totalTime },
  ].filter(item => item.value)

  if (metaItems.length === 0) return null

  return (
    <div className="flex flex-wrap gap-4 p-3 bg-gradient-to-br from-bg-1 to-bg-2 rounded-lg">
      {metaItems.map((item) => (
        <div key={item.label} className="flex flex-col items-center min-w-[90px]">
          <strong className="text-xs uppercase tracking-wide text-gray-600 mb-1">
            {item.label}
          </strong>
          <span className="text-base font-semibold text-accent-emphasis">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}
