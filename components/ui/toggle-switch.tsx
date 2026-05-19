"use client"

import { cn } from "@/lib/utils"

interface ToggleSwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
}

export function ToggleSwitch({ enabled, onChange, disabled }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
        enabled ? "bg-primary" : "bg-muted-foreground/30",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
          enabled ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  )
}
