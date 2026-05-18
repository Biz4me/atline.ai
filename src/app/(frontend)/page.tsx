import { DashboardShell } from "@/components/dashboard/shell"
import { DailyBriefing } from "@/components/dashboard/daily-briefing"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { HotProspects } from "@/components/dashboard/hot-prospects"
import { QuickActions } from "@/components/dashboard/quick-actions"

const stats = [
  { label: "Sessions ce mois", value: 24 },
  { label: "Prospects actifs", value: 8 },
  { label: "Score moyen", value: "7.4", suffix: "/10" },
  { label: "Streak", value: "12 jours 🔥" },
]

const hotProspects = [
  {
    id: "1",
    name: "Marie",
    score: 8,
    lastActivity: "A liké ton post",
  },
  {
    id: "2",
    name: "Thomas",
    score: 7,
    lastActivity: "A commenté hier",
  },
]

export default function HomePage() {
  return (
    <DashboardShell breadcrumbs={[{ label: "Accueil" }]}>
      <div className="mx-auto max-w-4xl space-y-6">
        <DailyBriefing
          userName="Patrice"
          message="Tu as 2 prospects chauds à suivre et une formation à compléter."
        />

        <StatsGrid stats={stats} />

        <HotProspects prospects={hotProspects} />

        <QuickActions />
      </div>
    </DashboardShell>
  )
}
