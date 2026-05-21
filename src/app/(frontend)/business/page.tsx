"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { DashboardShell } from "@/components/dashboard/shell"
import { AccordionBlock } from "@/components/ui/accordion-block"
import { IconUsers, IconCalendar, IconBroadcast } from "@tabler/icons-react"

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

export default function BusinessPage() {
  const [openId, setOpenId] = useState<string | null>("reseau")
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <DashboardShell>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">Mon Business</h1>
          <p className="mt-1 text-sm text-muted-foreground">Réseau, agenda et contenu</p>
        </div>

        <div className="space-y-3">
          <AccordionBlock
            icon={<IconUsers className="h-5 w-5" style={{ color: "#10B981" }} />}
            iconBg="rgba(16,185,129,0.12)"
            title="Réseau"
            subtitle="Pipeline prospects · Liste de noms · Équipe"
            isOpen={openId === "reseau"}
            onToggle={() => toggle("reseau")}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <StatChip label="Prospects actifs" value="24" />
                <StatChip label="À relancer" value="8" />
                <StatChip label="Convertis ce mois" value="3" />
              </div>
              <div className="rounded-lg border border-border bg-background px-4 py-3">
                <p className="text-xs text-muted-foreground">Prochaine relance</p>
                <p className="mt-0.5 font-medium text-foreground">Julien M. — Intéressé</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">À contacter aujourd'hui</p>
              </div>
              <OpenButton href="/reseau" label="Ouvrir le Réseau" />
            </div>
          </AccordionBlock>

          <AccordionBlock
            icon={<IconCalendar className="h-5 w-5" style={{ color: "#F59E0B" }} />}
            iconBg="rgba(245,158,11,0.12)"
            title="Agenda"
            subtitle="RDV, suivi et planification"
            isOpen={openId === "agenda"}
            onToggle={() => toggle("agenda")}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <StatChip label="RDV cette semaine" value="4" />
                <StatChip label="Prochain RDV" value="Demain 14h" />
              </div>
              <div className="rounded-lg border border-border bg-background px-4 py-3">
                <p className="text-xs text-muted-foreground">Prochain événement</p>
                <p className="mt-0.5 font-medium text-foreground">Présentation business · Marie L.</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Demain à 14h00</p>
              </div>
              <OpenButton href="/agenda" label="Ouvrir l'Agenda" />
            </div>
          </AccordionBlock>

          <AccordionBlock
            icon={<IconBroadcast className="h-5 w-5" style={{ color: "#06B6D4" }} />}
            iconBg="rgba(6,182,212,0.12)"
            title="Markline"
            subtitle="Contenus · Réseaux sociaux · Posts"
            isOpen={openId === "markline"}
            onToggle={() => toggle("markline")}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <StatChip label="Posts publiés" value="5" />
                <StatChip label="En brouillon" value="2" />
                <StatChip label="Portée estimée" value="1.2k" />
              </div>
              <div className="rounded-lg border border-border bg-background px-4 py-3">
                <p className="text-xs text-muted-foreground">Contenu suggéré par Atlas</p>
                <p className="mt-0.5 font-medium text-foreground">Témoignage client — format Reel</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Haute performance ce type de contenu cette semaine</p>
              </div>
              <OpenButton href="/markline" label="Ouvrir Markline" />
            </div>
          </AccordionBlock>
        </div>
      </div>
    </DashboardShell>
  )
}
