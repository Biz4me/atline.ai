interface GlobalProgressBarProps {
  percentage: number
  modulesRemaining: number
}

export function GlobalProgressBar({ percentage, modulesRemaining }: GlobalProgressBarProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* Progress bar */}
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-[rgba(124,111,232,0.2)]">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Label */}
      <p className="text-right text-[10px] text-primary">
        {percentage}% · {modulesRemaining} modules restants
      </p>
    </div>
  )
}
