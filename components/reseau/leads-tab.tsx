"use client"

import { useState } from "react"
import { IconSparkles, IconBrandInstagram, IconBrandFacebook, IconBrandTiktok, IconBrandLinkedin, IconChevronRight } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface Lead {
  id: string
  name: string
  initials: string
  action: string
  platform: "instagram" | "facebook" | "tiktok" | "linkedin"
  score: number
  time: string
  atlasSuggestion: string
}

const leads: Lead[] = [
  {
    id: "1",
    name: "Sophie M.",
    initials: "SM",
    action: "a liké 3 posts + commenté 'ça m'intéresse'",
    platform: "instagram",
    score: 9,
    time: "Il y a 2h",
    atlasSuggestion: "Lead chaud — contacte-la maintenant en DM",
  },
  {
    id: "2",
    name: "Marc L.",
    initials: "ML",
    action: "a partagé ton post business",
    platform: "facebook",
    score: 7,
    time: "Il y a 5h",
    atlasSuggestion: "Remercie-le puis propose un appel de découverte",
  },
  {
    id: "3",
    name: "Aya K.",
    initials: "AK",
    action: "a regardé ton Reel 4 fois",
    platform: "tiktok",
    score: 6,
    time: "Hier",
    atlasSuggestion: "Envoie un DM avec le script d'invitation",
  },
  {
    id: "4",
    name: "Romain B.",
    initials: "RB",
    action: "a cliqué sur ton lien bio",
    platform: "instagram",
    score: 5,
    time: "Hier",
    atlasSuggestion: "Prospect tiède — relance dans 3 jours",
  },
]

const PLATFORM_ICONS: Record<Lead["platform"], React.FC<{ className?: string }>> = {
  instagram: IconBrandInstagram,
  facebook: IconBrandFacebook,
  tiktok: IconBrandTiktok,
  linkedin: IconBrandLinkedin,
}

const PLATFORM_COLORS: Record<Lead["platform"], string> = {
  instagram: "text-pink-500",
  facebook: "text-blue-500",
  tiktok: "text-foreground",
  linkedin: "text-blue-600",
}

function scoreColor(score: number) {
  if (score >= 8) return "text-emerald-500 bg-emerald-500/10"
  if (score >= 5) return "text-amber-500 bg-amber-500/10"
  return "text-red-500 bg-red-500/10"
}

export function LeadsTab() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="mt-4 space-y-3">
      {/* Header info */}
      <div className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
        <IconSparkles className="h-4 w-4 text-cyan-500" />
        <p className="text-sm text-foreground">
          <span className="font-semibold">Markline</span> détecte les prospects chauds depuis tes réseaux sociaux.
        </p>
      </div>

      {/* Leads list */}
      {leads.map((lead) => {
        const PlatformIcon = PLATFORM_ICONS[lead.platform]
        const isExpanded = expanded === lead.id

        return (
          <button
            key={lead.id}
            onClick={() => setExpanded(isExpanded ? null : lead.id)}
            className="w-full rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-foreground">
                  {lead.initials}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-background">
                  <PlatformIcon className={cn("h-3.5 w-3.5", PLATFORM_COLORS[lead.platform])} />
                </div>
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{lead.name}</span>
                  <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold", scoreColor(lead.score))}>
                    {lead.score}/10
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{lead.action}</p>
              </div>

              {/* Time + chevron */}
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-[10px] text-muted-foreground">{lead.time}</span>
                <IconChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", isExpanded && "rotate-90")} />
              </div>
            </div>

            {/* Expanded Atlas suggestion */}
            {isExpanded && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-primary/10 px-3 py-2.5">
                <IconSparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <p className="text-xs text-foreground">{lead.atlasSuggestion}</p>
              </div>
            )}
          </button>
        )
      })}

      {/* Empty state */}
      {leads.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
          <IconSparkles className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 font-medium text-foreground">Aucun lead détecté</p>
          <p className="mt-1 text-sm text-muted-foreground">Publie du contenu et Markline détectera tes prospects chauds.</p>
        </div>
      )}
    </div>
  )
}
