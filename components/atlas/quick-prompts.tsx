"use client"

interface QuickPromptsProps {
  onSelect: (prompt: string) => void
}

const promptsMobile = [
  "Script WhatsApp",
  "Plan semaine",
]

const promptsDesktop = [
  "Générer un script WhatsApp",
  "Plan d'action semaine",
  "Analyser mon pitch",
]

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <>
      <div className="flex gap-2 px-4 pb-2 lg:hidden">
        {promptsMobile.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="flex-1 whitespace-nowrap rounded-full border border-border bg-transparent px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {prompt}
          </button>
        ))}
      </div>
      <div className="hidden justify-center gap-2 px-6 pb-2 lg:flex">
        {promptsDesktop.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="whitespace-nowrap rounded-full border border-border bg-transparent px-4 py-2 text-[13px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {prompt}
          </button>
        ))}
      </div>
    </>
  )
}
