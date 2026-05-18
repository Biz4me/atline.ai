"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CurrentLessonCardProps {
  lessonNumber: number
  title: string
  moduleNumber: number
  moduleName: string
  minutesRemaining: number
}

export function CurrentLessonCard({
  lessonNumber,
  title,
  moduleNumber,
  moduleName,
  minutesRemaining,
}: CurrentLessonCardProps) {
  return (
    <div className="rounded-[10px] border border-[rgba(124,111,232,0.3)] bg-card p-4">
      {/* EN COURS label */}
      <span className="text-[10px] font-medium uppercase tracking-wider text-primary">
        En cours
      </span>

      {/* Lesson title */}
      <h3 className="mt-2 text-[13px] font-medium text-white">
        Lecon {lessonNumber} — {title}
      </h3>

      {/* Meta info */}
      <p className="mt-1 text-[11px] text-muted-foreground">
        Module {moduleNumber} · {moduleName} · {minutesRemaining} min restantes
      </p>

      {/* CTA button */}
      <Button className="mt-4 h-10 w-full rounded-[8px] text-sm font-medium text-white" style={{ backgroundColor: "#7C6FE8" }}>
        Reprendre
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  )
}
