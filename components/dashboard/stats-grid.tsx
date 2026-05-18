import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  suffix?: string
  trend?: "up" | "down" | "neutral"
}

export function StatCard({ label, value, suffix }: StatCardProps) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-2xl font-semibold tracking-tight">
        {value}
        {suffix && (
          <span className="text-base text-muted-foreground">{suffix}</span>
        )}
      </p>
    </Card>
  )
}

interface StatsGridProps {
  stats: StatCardProps[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}
