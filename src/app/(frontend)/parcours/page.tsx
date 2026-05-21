"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { DashboardShell } from "@/components/dashboard/shell"
import { AccordionBlock } from "@/components/ui/accordion-block"
import { IconSchool, IconBarbell } from "@tabler/icons-react"

function OpenButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
    >
      {label}
      <ArrowUpRight className="h-3.5 w-3.5" />
    </Link>
  )
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-center">
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
}

export default function ParcoursPage() {
  const [openId, setOpenId] = useState<string | null>("formation")
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <DashboardShell>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">Mon Parcours</h1>
          <p className="mt-1 text-sm text-muted-foreground">Formation et entraînements pour progresser</p>
        </div>

        <div className="space-y-3">
          <AccordionBlock
            icon={<IconSchool className="h-5 w-5" style={{ color: "#7C6FE8" }} />}
            iconBg="rgba(124,111,232,0.12)"
            title="Formation"
            subtitle="Méthode Go Pro · 8 modules · Éric Worre"
            isOpen={openId === "formation"}
            onToggle={() => toggle("formation")}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <StatChip label="Modules complétés" value="1 / 8" />
                <StatChip label="Progression" value="37%" />
                <StatChip label="XP gagné" value="225" />
              </div>
              <div className="rounded-lg border border-border bg-background px-4 py-3">
                <p className="text-xs text-muted-foreground">Module en cours</p>
                <p className="mt-0.5 font-medium text-foreground">02 · Prospection</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: "50%" }} />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">4 / 8 leçons · 12 min restantes</p>
              </div>
              <OpenButton href="/formation" label="Ouvrir Formation" />
            </div>
          </AccordionBlock>

          <AccordionBlock
            icon={<IconBarbell className="h-5 w-5" style={{ color: "#06B6D4" }} />}
            iconBg="rgba(6,182,212,0.12)"
            title="Simulations"
            subtitle="Entraînements IA · Calls, objections, closing"
            isOpen={openId === "simulations"}
            onToggle={() => toggle("simulations")}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <StatChip label="Simulations faites" value="7" />
                <StatChip label="Meilleur score" value="8.4 / 10" />
                <StatChip label="Dernière session" value="Il y a 2j" />
              </div>
              <div className="rounded-lg border border-border bg-background px-4 py-3">
                <p className="text-xs text-muted-foreground">Scénario recommandé</p>
                <p className="mt-0.5 font-medium text-foreground">Objection — C'est une pyramide</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Niveau difficile · avec Laura · 4-6 min</p>
              </div>
              <OpenButton href="/simulations" label="Ouvrir Simulations" />
            </div>
          </AccordionBlock>
        </div>
      </div>
    </DashboardShell>
  )
}
