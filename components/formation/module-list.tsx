"use client"

import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"

type ModuleStatus = "done" | "active" | "locked"

interface Module {
  number: string
  name: string
  lessons: number
  duration: number
  status: ModuleStatus
  progress?: number // 0-100 for active modules
  xp?: number
}

interface ModuleListProps {
  modules: Module[]
}

function ModuleRow({ module }: { module: Module }) {
  const isDone = module.status === "done"
  const isActive = module.status === "active"
  const isLocked = module.status === "locked"

  return (
    <div className="flex items-center gap-3 py-3">
      {/* Number badge */}
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] font-mono text-xs font-medium",
          isDone && "bg-success/10 text-success",
          isActive && "bg-primary/12 text-primary",
          isLocked && "bg-card text-[#52525B]"
        )}
      >
        {module.number}
      </div>

      {/* Center content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span
          className={cn(
            "truncate text-[13px] font-medium",
            isLocked ? "text-[#52525B]" : "text-foreground"
          )}
        >
          {module.name}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {module.lessons} lecons · {module.duration} min
        </span>
        {/* Progress bar for done/active */}
        {(isDone || isActive) && (
          <div className="mt-0.5 h-[2px] w-full overflow-hidden rounded-full bg-border">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isDone ? "bg-success" : "bg-primary"
              )}
              style={{ width: `${isDone ? 100 : module.progress || 0}%` }}
            />
          </div>
        )}
      </div>

      {/* Right side: status badge + XP or lock */}
      <div className="flex shrink-0 items-center gap-2">
        {isDone && (
          <>
            <span className="rounded-[4px] bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
              Termine
            </span>
            <span className="text-[10px] font-medium text-success">+{module.xp} XP</span>
          </>
        )}
        {isActive && (
          <>
            <span className="rounded-[4px] border border-primary bg-transparent px-2 py-0.5 text-[10px] font-medium text-primary">
              En cours
            </span>
            <span className="text-[10px] font-medium text-primary">{module.xp} XP</span>
          </>
        )}
        {isLocked && <Lock className="h-4 w-4 text-[#52525B]" />}
      </div>
    </div>
  )
}

export function ModuleList({ modules }: ModuleListProps) {
  return (
    <div className="divide-y divide-border">
      {modules.map((module) => (
        <ModuleRow key={module.number} module={module} />
      ))}
    </div>
  )
}

export type { Module, ModuleStatus }
