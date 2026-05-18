"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  "Être pressé",
  "Compliment sincère",
  "L'invitation",
  "Confirmer le RDV",
  "Raccrocher",
]

export function EricWorréSteps() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-[8px] border border-border bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-3 text-left"
      >
        <span className="text-[13px] font-medium text-white">
          Les 5 étapes — Méthode Eric Worre
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-[200px]" : "max-h-0"
        )}
      >
        <div className="border-t border-border px-3 pb-3 pt-2">
          <ol className="space-y-1.5">
            {steps.map((step, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
                  {index + 1}
                </span>
                <span className="text-[12px] text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
