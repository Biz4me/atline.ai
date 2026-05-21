"use client"

import { cn } from "@/lib/utils"
import { Phone, Clock, AlertTriangle, Target, Sparkles } from "lucide-react"

type Difficulty = "easy" | "medium" | "hard" | "pro"

interface ScenarioCardProps {
  id: string
  name: string
  character: string
  duration: string
  difficulty: Difficulty
  icon: "phone" | "clock" | "alert" | "target" | "sparkles"
  isFreeform?: boolean
  onClick: (id: string) => void
}

const difficultyConfig = {
  easy: { label: "Facile", bg: "bg-success/10", text: "text-success" },
  medium: { label: "Moyen", bg: "bg-gold/10", text: "text-gold" },
  hard: { label: "Difficile", bg: "bg-destructive/10", text: "text-destructive" },
  pro: { label: "Pro", bg: "bg-primary/10", text: "text-primary" },
}

const iconConfig = {
  phone: { icon: Phone, easy: "bg-success/10 text-success", medium: "bg-gold/10 text-gold", hard: "bg-destructive/10 text-destructive", pro: "bg-primary/10 text-primary" },
  clock: { icon: Clock, easy: "bg-success/10 text-success", medium: "bg-gold/10 text-gold", hard: "bg-destructive/10 text-destructive", pro: "bg-primary/10 text-primary" },
  alert: { icon: AlertTriangle, easy: "bg-success/10 text-success", medium: "bg-gold/10 text-gold", hard: "bg-destructive/10 text-destructive", pro: "bg-primary/10 text-primary" },
  target: { icon: Target, easy: "bg-success/10 text-success", medium: "bg-gold/10 text-gold", hard: "bg-destructive/10 text-destructive", pro: "bg-primary/10 text-primary" },
  sparkles: { icon: Sparkles, easy: "bg-success/10 text-success", medium: "bg-gold/10 text-gold", hard: "bg-destructive/10 text-destructive", pro: "bg-primary/10 text-primary" },
}

export function ScenarioCard({
  id,
  name,
  character,
  duration,
  difficulty,
  icon,
  isFreeform,
  onClick,
}: ScenarioCardProps) {
  const diffConfig = difficultyConfig[difficulty]
  const IconComponent = iconConfig[icon].icon
  const iconClasses = iconConfig[icon][difficulty]

  return (
    <button
      onClick={() => onClick(id)}
      className={cn(
        "flex h-full w-full items-center gap-3 rounded-[8px] border bg-card p-3 text-left transition-colors hover:border-primary/30",
        isFreeform ? "border-dashed border-border" : "border-border"
      )}
    >
      {/* Icon */}
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]", iconClasses)}>
        <IconComponent className="h-4 w-4" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium text-foreground">{name}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          {character} · {duration}
        </div>
      </div>

      {/* Difficulty badge */}
      <span className={cn("shrink-0 rounded-[4px] px-2 py-0.5 text-[10px] font-medium", diffConfig.bg, diffConfig.text)}>
        {diffConfig.label}
      </span>
    </button>
  )
}
