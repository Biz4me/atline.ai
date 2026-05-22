"use client"

import Link from "next/link"
import {
  IconSchool,
  IconBarbell,
  IconBroadcast,
  IconChartBar,
  IconTrophy,
  IconMessages,
  IconUpload,
  IconChevronRight,
  IconStar,
} from "@tabler/icons-react"
import { useUser } from "@/hooks/use-user"
import { MoiFab } from "@/components/dashboard/navigation"

const GRID_ITEMS = [
  {
    href: "/formation",
    icon: IconSchool,
    label: "Formation",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    stat: "8 modules",
  },
  {
    href: "/simulations",
    icon: IconBarbell,
    label: "Simulations",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    stat: "Entraînement vocal",
  },
  {
    href: "/contenu",
    icon: IconBroadcast,
    label: "Contenu",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    badge: "Markline",
    stat: "Publications & leads",
  },
  {
    href: "/mon-plan",
    icon: IconChartBar,
    label: "Mon plan",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    badge: "Proline",
    stat: "Plan & revenus",
  },
]

const LIST_ITEMS = [
  { href: "/croissance", icon: IconTrophy, label: "Croissance", sub: "XP, badges & classement" },
  { href: "/communaute", icon: IconMessages, label: "Communauté", sub: "Forum & partage" },
  { href: "/enrichir-atlas", icon: IconUpload, label: "Enrichir Atlas", sub: "Docs indexés" },
]

export default function MoiPage() {
  const { user, loading } = useUser()

  const xp = user?.xp ?? 0

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto lg:max-w-none">
      {/* XP Stats bar */}
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
        <IconStar className="h-4 w-4 text-yellow-500" />
        <span className="text-sm font-semibold text-foreground">
          {loading ? "—" : `${xp.toLocaleString("fr-FR")} XP`}
        </span>
        <span className="ml-1 text-xs text-muted-foreground">· Niveau {Math.floor(xp / 500) + 1}</span>
      </div>

      {/* 2x2 grid */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Mes outils
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {GRID_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.bg}`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-violet-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-violet-400">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.stat}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Secondary list */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Plus
        </h2>
        <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {LIST_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-accent"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
                <IconChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            )
          })}
        </div>
      </section>

      {/* FAB for account/profile actions */}
      <MoiFab />
    </div>
  )
}
