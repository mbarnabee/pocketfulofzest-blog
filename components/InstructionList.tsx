interface InstructionListProps {
  instructions: string[]
}

export default function InstructionList({ instructions }: InstructionListProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-accent-emphasis border-b-2 border-lime pb-2 flex items-center gap-2">
        <span className="text-xl">👨‍🍳</span>
        Instructions
      </h3>
      <div className="space-y-3">
        {instructions.map((instruction, index) => (
          <div
            key={index}
            className="flex gap-3 p-3 bg-gradient-to-r from-bg-1 to-white border-l-4 border-lime rounded-r-lg"
          >
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-accent to-lime flex items-center justify-center text-sm font-bold text-gray-800">
              {index + 1}
            </div>
            <p className="text-sm leading-relaxed text-gray-800 pt-0.5">
              {instruction}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
