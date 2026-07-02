'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, Mic } from 'lucide-react'

export type PlanItem = {
  contactId: string
  name: string
  prenom: string
  initials: string
  accent: string
  level: number
  action: string
  headline: string
  reason: string
  channel: string | null
  stage: string
}

// Carte « Plan du jour » dans le chat. Un tap sur une action n'ouvre PAS la fiche :
// il déclenche l'annonce conversationnelle d'Atlas (coaching participatif), via onPick.
export function AtlasPlanCard({ onPick }: { onPick: (item: PlanItem) => void }) {
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
          <button
            key={it.contactId}
            type="button"
            onClick={() => onPick(it)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/30 active:bg-muted/50"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: it.accent }}>{it.initials}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{it.headline}</p>
              <p className="truncate text-xs text-muted-foreground">{it.reason}</p>
            </div>
            {it.level === 1 && <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">Urgent</span>}
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  )
}

// Actions « humaines » qui méritent une préparation (simulation Aria) avant le lien.
const HUMAN = new Set(['MESSAGE', 'RDV'])

// Carte d'action : Atlas ANNONCE à sa voix (streamé) → propose de préparer → tend le lien au bout.
export function AtlasActionCard({ item }: { item: PlanItem }) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    let full = ''
    ;(async () => {
      try {
        const r = await fetch('/api/plan/announce', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: item.action, headline: item.headline, reason: item.reason, prenom: item.prenom, stage: item.stage }),
        })
        if (!r.ok || !r.body) throw new Error('no stream')
        const reader = r.body.getReader(); const dec = new TextDecoder(); let buf = ''
        for (;;) {
          const { done: d, value } = await reader.read(); if (d) break
          buf += dec.decode(value, { stream: true })
          let idx: number
          while ((idx = buf.indexOf('\n\n')) >= 0) {
            const ln = buf.slice(0, idx).trim(); buf = buf.slice(idx + 2)
            if (!ln.startsWith('data:')) continue
            const pl = ln.slice(5).trim(); if (pl === '[DONE]') continue
            try { const j = JSON.parse(pl); if (j.text) { full += j.text; if (!cancelled) setText(full) } } catch { /* ignore */ }
          }
        }
        if (!full && !cancelled) setText(item.reason)
      } catch { if (!cancelled) setText(item.reason) }
      finally { if (!cancelled) setDone(true) }
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex w-full flex-col gap-3">
      {/* L'annonce d'Atlas, à sa voix */}
      <p className="whitespace-pre-line text-lg leading-[1.65] text-foreground lg:text-sm">{text || '…'}</p>

      {done && (
        <>
          {/* Branche de préparation (participatif) */}
          {HUMAN.has(item.action) && (
            <button
              type="button"
              onClick={() => router.push(`/aria?contact=${item.contactId}`)}
              className="flex items-center gap-2 self-start rounded-full border border-[#14B8A6]/40 bg-[#14B8A6]/10 px-3.5 py-1.5 text-sm font-semibold text-[#14B8A6] transition-colors hover:bg-[#14B8A6]/20"
            >
              <Mic className="size-3.5" /> Je m&apos;entraîne d&apos;abord avec Aria
            </button>
          )}
          {/* Le lien d'action, au bout */}
          <Link
            href={`/contacts/${item.contactId}`}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            {item.headline} <ChevronRight className="size-4" />
          </Link>
        </>
      )}
    </div>
  )
}
