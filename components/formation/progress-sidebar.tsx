import { Card } from "@/components/ui/card"

interface ProgressSidebarProps {
  streak: number
  totalXP: number
  nextBadge: string
  badgeRequirement: string
  atlasRecommendation: string
}

export function ProgressSidebar({
  streak,
  totalXP,
  nextBadge,
  badgeRequirement,
  atlasRecommendation,
}: ProgressSidebarProps) {
  return (
    <Card className="hidden w-60 shrink-0 p-4 lg:block">
      <h3 className="text-sm font-medium text-white">Votre progression</h3>

      <div className="mt-4 space-y-4">
        {/* Streak */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Streak</span>
          <span className="text-[13px] font-medium text-white">{streak} jours</span>
        </div>

        {/* XP total */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">XP total</span>
          <span className="font-mono text-[13px] font-medium text-primary">{totalXP}</span>
        </div>

        {/* Next badge */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Prochain badge</span>
          <div className="text-right">
            <span className="text-[13px] font-medium text-white">{nextBadge}</span>
            <p className="text-[10px] text-muted-foreground">{badgeRequirement}</p>
          </div>
        </div>

        {/* Atlas recommendation */}
        <div className="rounded-[8px] border border-primary/20 bg-primary/5 p-3">
          <p className="text-[11px] text-muted-foreground">Recommandation Atlas</p>
          <p className="mt-1 text-[12px] text-white">{atlasRecommendation}</p>
        </div>
      </div>
    </Card>
  )
}
