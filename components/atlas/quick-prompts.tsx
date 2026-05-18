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
      <div className="flex lg:hidden gap-2 px-4 pb-2">
        {promptsMobile.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent",
              color: "#A1A1AA",
              fontSize: "13px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
      <div className="hidden lg:flex justify-center gap-2 px-6 pb-2">
        {promptsDesktop.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent",
              color: "#A1A1AA",
              fontSize: "13px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </>
  )
}
