"use client"

import Link from "next/link"
import { IconFlame, IconChevronRight, IconCalendar, IconUsers, IconSparkles, IconBarbell, IconSchool, IconUpload } from "@tabler/icons-react"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"
import type { AtlineUser } from "@/hooks/use-user"

// ─── Mission generation ───────────────────────────────────────────────────────

interface Mission {
  id: string
  label: string
  priority: "urgent" | "normal"
  href: string
  icon: React.FC<{ className?: string }>
}

function buildMissions(user: AtlineUser | null): Mission[] {
  if (!user) return []

  const missions: Mission[] = []

  // 1. Import liste si pas encore fait
  if (!user.hasProspectList) {
    missions.push({
      id: "import",
      label: "Importe ta première liste de prospects",
      priority: "urgent",
      href: "/reseau?tab=ma-liste",
      icon: IconUpload,
    })
  }

  // 2. Simulation (toujours proposée si pas encore beaucoup)
  if ((user.lastSimScore ?? 0) < 8) {
    missions.push({
      id: "simulation",
      label: "Simulation du jour — améliore ton score",
      priority: (user.lastSimScore ?? 0) === 0 ? "urgent" : "normal",
      href: "/simulations",
      icon: IconBarbell,
    })
  }

  // 3. Formation si pas encore commencée ou en cours
  if ((user.modulesCompleted ?? 0) < 8) {
    missions.push({
      id: "formation",
      label: (user.modulesCompleted ?? 0) === 0
        ? "Démarre ta première leçon de formation"
        : `Continue la formation — module ${(user.modulesCompleted ?? 0) + 1}/8`,
      priority: "normal",
      href: "/formation",
      icon: IconSchool,
    })
  }

  // 4. Réseau — rappel si liste importée
  if (user.hasProspectList) {
    missions.push({
      id: "reseau",
      label: "Vérifie tes prospects à relancer aujourd'hui",
      priority: "normal",
      href: "/reseau",
      icon: IconUsers,
    })
  }

  // Max 3 missions
  return missions.slice(0, 3)
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AujourdHuiPage() {
  const { user, loading } = useUser()

  const firstName = user?.firstName ?? ""
  const streak = user?.streak ?? 0
  const missions = buildMissions(user)

  const greeting = loading
    ? "Bonjour 👋"
    : firstName
    ? `Bonjour ${firstName} 👋`
    : "Bonjour 👋"

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto lg:max-w-none">
      {/* Greeting */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{greeting}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? " " : "Voici ce que tu dois faire aujourd'hui."}
          </p>
        </div>
        {streak > 0 && (
          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1.5 text-sm font-semibold text-orange-500">
            <IconFlame className="h-4 w-4" />
            {streak}j
          </div>
        )}
      </div>

      {/* Missions du jour */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Missions du jour
        </h2>

        {loading ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : missions.length === 0 ? (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-4">
            <span className="text-lg">🎉</span>
            <p className="text-sm text-foreground">Toutes tes missions sont terminées — excellent travail !</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {missions.map((m) => {
              const Icon = m.icon
              return (
                <Link
                  key={m.id}
                  href={m.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors hover:bg-accent",
                    m.priority === "urgent"
                      ? "border-red-500/30 bg-red-500/5"
                      : "border-border bg-card"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", m.priority === "urgent" ? "text-red-500" : "text-violet-500")} />
                  <span className="flex-1 text-sm text-foreground">{m.label}</span>
                  <IconChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Atlas card */}
      <Link
        href="/atlas"
        className="group relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-violet-600/5 px-6 py-5 transition-colors hover:border-violet-500/50 hover:from-violet-500/15"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 shadow-lg">
            <IconSparkles className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">Démarrer une conversation</p>
            <p className="mt-0.5 text-sm text-muted-foreground">Atlas · Coach IA 24h/24</p>
          </div>
          <IconChevronRight className="h-5 w-5 shrink-0 text-violet-500 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>

      {/* Quick access */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Link
          href="/reseau"
          className="flex flex-col gap-2 rounded-xl border border-border bg-card px-4 py-4 transition-colors hover:bg-accent"
        >
          <IconUsers className="h-5 w-5 text-cyan-500" />
          <div>
            <p className="text-sm font-medium text-foreground">Réseau</p>
            <p className="text-xs text-muted-foreground">Pipeline & prospects</p>
          </div>
        </Link>
        <Link
          href="/reseau?tab=agenda"
          className="flex flex-col gap-2 rounded-xl border border-border bg-card px-4 py-4 transition-colors hover:bg-accent"
        >
          <IconCalendar className="h-5 w-5 text-emerald-500" />
          <div>
            <p className="text-sm font-medium text-foreground">Agenda</p>
            <p className="text-xs text-muted-foreground">Prochains RDV</p>
          </div>
        </Link>
        <Link
          href="/moi"
          className="col-span-2 flex flex-col gap-2 rounded-xl border border-border bg-card px-4 py-4 transition-colors hover:bg-accent lg:col-span-1"
        >
          <span className="text-lg">🏆</span>
          <div>
            <p className="text-sm font-medium text-foreground">Croissance</p>
            <p className="text-xs text-muted-foreground">XP, badges & défis</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
