"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DebriefScreenProps {
  scenarioName: string
  characterName: string
  score: number
  xpEarned: number
  badgeUnlocked?: string
  strengths: string[]
  improvements: string[]
  atlasAdvice: string
  onReplay: () => void
  onNewScenario: () => void
}

export function DebriefScreen({
  scenarioName,
  characterName,
  score,
  xpEarned,
  badgeUnlocked,
  strengths,
  improvements,
  atlasAdvice,
  onReplay,
  onNewScenario,
}: DebriefScreenProps) {
  const scoreColor = score >= 7 ? "text-success border-success" : score >= 5 ? "text-gold border-gold" : "text-destructive border-destructive"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-foreground">Rapport Atlas</h2>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          {scenarioName} · {characterName}
        </p>
      </div>

      {/* Score circle */}
      <div className="flex flex-col items-center">
        <div className={cn("flex h-16 w-16 items-center justify-center rounded-full border-2", scoreColor)}>
          <div className="text-center">
            <span className={cn("text-2xl font-bold", scoreColor.split(" ")[0])}>{score.toFixed(1)}</span>
            <span className="block text-[9px] text-muted-foreground">/10</span>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-success">
          +{xpEarned} XP{badgeUnlocked && ` · Badge "${badgeUnlocked}" débloqué !`}
        </p>
      </div>

      {/* Points forts & À améliorer */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Points forts */}
        <div className="rounded-[8px] border border-border bg-card p-4">
          <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Points forts
          </h3>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                <span className="text-[12px] leading-relaxed text-muted-foreground">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* À améliorer */}
        <div className="rounded-[8px] border border-border bg-card p-4">
          <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            À améliorer
          </h3>
          <ul className="space-y-2">
            {improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                <span className="text-[12px] leading-relaxed text-muted-foreground">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Conseil Atlas */}
      <div className="rounded-[8px] border border-border bg-card p-4">
        <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Conseil Atlas
        </h3>
        <p className="text-[12px] italic leading-relaxed text-muted-foreground">&quot;{atlasAdvice}&quot;</p>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button onClick={onReplay} className="w-full">
          Rejouer
        </Button>
        <Button onClick={onNewScenario} variant="ghost" className="w-full">
          Voir transcription
        </Button>
        <Button onClick={onNewScenario} variant="ghost" className="w-full">
          Analyser ma présentation
        </Button>
      </div>
    </div>
  )
}
