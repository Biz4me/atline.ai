"use client"
import { Button } from "@/components/ui/button"

interface QuickPromptsProps {
  onSelect: (prompt: string) => void
}

const prompts = [
  "Script WhatsApp",
  "Plan semaine",
  "Mon pitch",
]

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        gap: "8px",
        padding: "4px 16px 8px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          style={{
            flexShrink: 0,
            whiteSpace: "nowrap",
            padding: "6px 14px",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "transparent",
            color: "#A1A1AA",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
