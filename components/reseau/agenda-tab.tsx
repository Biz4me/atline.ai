"use client"

import { Button } from "@/components/ui/button"
import { IconCalendar, IconVideo, IconUser, IconExternalLink, IconBarbell } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface RDV {
  id: string
  prospect: string
  initials: string
  type: "Présentation" | "Suivi" | "Closing" | "Découverte"
  date: string
  time: string
  duration: string
  isToday: boolean
  isTomorrow: boolean
  isVirtual: boolean
}

const rdvData: RDV[] = [
  {
    id: "1",
    prospect: "Marie T.",
    initials: "MT",
    type: "Présentation",
    date: "Aujourd'hui",
    time: "14h00",
    duration: "30 min",
    isToday: true,
    isTomorrow: false,
    isVirtual: true,
  },
  {
    id: "2",
    prospect: "Jean P.",
    initials: "JP",
    type: "Suivi",
    date: "Demain",
    time: "10h30",
    duration: "15 min",
    isToday: false,
    isTomorrow: true,
    isVirtual: false,
  },
  {
    id: "3",
    prospect: "Sophie L.",
    initials: "SL",
    type: "Closing",
    date: "Ven 24 mai",
    time: "16h00",
    duration: "45 min",
    isToday: false,
    isTomorrow: false,
    isVirtual: true,
  },
  {
    id: "4",
    prospect: "Pierre D.",
    initials: "PD",
    type: "Découverte",
    date: "Lun 27 mai",
    time: "09h00",
    duration: "20 min",
    isToday: false,
    isTomorrow: false,
    isVirtual: false,
  },
]

const TYPE_COLORS: Record<string, string> = {
  "Présentation": "text-violet-500 bg-violet-500/10",
  "Suivi": "text-amber-500 bg-amber-500/10",
  "Closing": "text-emerald-500 bg-emerald-500/10",
  "Découverte": "text-cyan-500 bg-cyan-500/10",
}

export function AgendaTab() {
  return (
    <div className="mt-4 space-y-4">
      {/* Cal.com link */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
        <div>
          <p className="text-sm font-medium text-foreground">Lien de réservation</p>
          <p className="text-xs text-muted-foreground">cal.com/ton-lien</p>
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-primary">
          <IconExternalLink className="h-3.5 w-3.5" />
          Ouvrir
        </Button>
      </div>

      {/* RDV list */}
      <div className="space-y-2">
        {rdvData.map((rdv) => (
          <div
            key={rdv.id}
            className={cn(
              "flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center",
              rdv.isToday ? "border-violet-500/30" : "border-border"
            )}
          >
            {/* Date badge */}
            <div className="flex w-24 shrink-0 flex-col items-center justify-center rounded-lg bg-accent/30 py-2 text-center">
              <span className={cn(
                "text-xs font-semibold",
                rdv.isToday ? "text-violet-500" : rdv.isTomorrow ? "text-amber-500" : "text-muted-foreground"
              )}>
                {rdv.date}
              </span>
              <span className="text-lg font-bold text-foreground">{rdv.time}</span>
              <span className="text-[10px] text-muted-foreground">{rdv.duration}</span>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  {rdv.initials}
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">{rdv.prospect}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", TYPE_COLORS[rdv.type])}>
                      {rdv.type}
                    </span>
                    {rdv.isVirtual && (
                      <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                        <IconVideo className="h-3 w-3" />
                        Visio
                      </span>
                    )}
                    {!rdv.isVirtual && (
                      <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                        <IconUser className="h-3 w-3" />
                        En personne
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action */}
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 self-start text-xs sm:self-center">
              <IconBarbell className="h-3.5 w-3.5" />
              Simuler avant
            </Button>
          </div>
        ))}
      </div>

      {/* Empty state if no rdv */}
      {rdvData.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
          <IconCalendar className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 font-medium text-foreground">Aucun RDV planifié</p>
          <p className="mt-1 text-sm text-muted-foreground">Partage ton lien Cal.com pour recevoir des réservations.</p>
        </div>
      )}
    </div>
  )
}
