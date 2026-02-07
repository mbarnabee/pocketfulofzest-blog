interface RecipeNotesProps {
  notes: string[]
}

export default function RecipeNotes({ notes }: RecipeNotesProps) {
  if (!notes || notes.length === 0) return null

  return (
    <div className="bg-yellow/10 border-l-4 border-yellow p-4 rounded-r-lg mt-4">
      <h3 className="text-lg font-bold text-accent-emphasis mb-3 flex items-center gap-2">
        <span className="text-xl">💡</span>
        Notes
      </h3>
      <ul className="space-y-2">
        {notes.map((note, index) => (
          <li key={index} className="text-sm italic text-gray-700 leading-relaxed">
            {note}
          </li>
        ))}
      </ul>
    </div>
  )
}
