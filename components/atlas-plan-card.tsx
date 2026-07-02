'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

type PlanItem = { contactId: string; name: string; initials: string; accent: string; level: number; headline: string; reason: string }

// Carte « Plan du jour » rendue DANS le chat Atlas (concept AI-first : l'action vit dans la conversation).
// Chaque ligne est un raccourci vers la fiche (là où l'on agit).
export function AtlasPlanCard() {
  const [items, setItems] = useState<PlanItem[] | null>(null)
  useEffect(() => {
    fetch('/api/plan/today').then((r) => (r.ok ? r.json() : null)).then((d) => setItems(d?.items ?? [])).catch(() => setItems([]))
  }, [])

  if (items === null) return <p className="text-lg text-muted-foreground lg:text-sm">Je prépare ton plan…</p>
  if (items.length === 0) return <p className="text-lg text-muted-foreground lg:text-sm">Rien d&apos;urgent aujourd&apos;hui — profites-en pour prospecter et enrichir ta liste.</p>

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="border-b border-border px-4 py-2.5 text-sm font-bold text-foreground">
        Ton plan du jour · {items.length} priorité{items.length > 1 ? 's' : ''}
      </div>
      <div className="divide-y divide-border">
        {items.map((it) => (
          <Link
            key={it.contactId}
            href={`/contacts/${it.contactId}`}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30 active:bg-muted/50"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: it.accent }}>{it.initials}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{it.headline}</p>
              <p className="truncate text-xs text-muted-foreground">{it.reason}</p>
            </div>
            {it.level === 1 && <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">Urgent</span>}
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  )
}
