'use client'

import { useCallback, useEffect, useState } from 'react'
import { RefreshCw, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// Carte de synthèse d'une session profonde (« le pourquoi ») : Atlas propose une formulation,
// l'utilisateur la régénère jusqu'à la bonne, puis valide → Atlas l'enregistre dans le profil.
export function WhyDraftCard({ conversationId, onSaved }: { conversationId: string; onSaved: (statement: string) => void }) {
  const [statement, setStatement] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [regensLeft, setRegensLeft] = useState(2)
  const [busy, setBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const load = useCallback(async (att: number) => {
    setBusy(true)
    try {
      const r = await fetch('/api/profile/why/synthesize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ conversationId, attempt: att }) })
      const d = r.ok ? await r.json() : null
      setStatement(d?.statement ?? "Je n'arrive pas à le formuler là — réessaie dans un instant.")
    } catch { setStatement('Souci réseau — réessaie.') }
    finally { setBusy(false) }
  }, [conversationId])
  useEffect(() => { load(0) }, [load])

  const regen = () => { const n = attempt + 1; setAttempt(n); setRegensLeft((x) => x - 1); load(n) }

  const validate = async () => {
    if (!statement || saving) return
    setSaving(true)
    try {
      // /api/me remplace tout l'objet coaching → on récupère l'existant et on fusionne le why.
      const meRes = await fetch('/api/me')
      const me = meRes.ok ? await meRes.json() : {}
      const coaching = { ...(me?.coaching && typeof me.coaching === 'object' ? me.coaching : {}), why: statement }
      const r = await fetch('/api/me', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ coaching }) })
      if (r.ok) {
        // La page profil garde un brouillon en sessionStorage → on l'invalide pour qu'elle réaffiche le nouveau pourquoi.
        try { sessionStorage.removeItem('profile_draft_v1') } catch { /* ignore */ }
        setDone(true); onSaved(statement)
      }
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="border-b border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground">Ton pourquoi</div>
      <div className="min-h-[64px] whitespace-pre-wrap px-4 py-3 text-lg italic leading-relaxed text-foreground lg:text-sm">
        {busy ? 'Je le formule…' : (statement ?? '…')}
      </div>
      {done ? (
        <div className="flex items-center gap-1.5 border-t border-border px-4 py-3 text-sm font-semibold text-primary">
          <Check className="size-4" strokeWidth={3} /> Enregistré dans ton profil
        </div>
      ) : (
        <div className="flex flex-col gap-2 border-t border-border px-4 py-2.5">
          <button
            type="button"
            onClick={validate}
            disabled={saving || busy || !statement}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? "J'enregistre…" : "C'est exactement ça — enregistre"}
          </button>
          {regensLeft > 0 ? (
            <button type="button" disabled={busy || saving} onClick={regen} className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground disabled:opacity-40">
              <RefreshCw className={cn('size-3.5', busy && 'animate-spin')} /> Pas tout à fait — reformule · {regensLeft}
            </button>
          ) : (
            <span className="text-center text-xs text-muted-foreground">Dernière version — dis-m&apos;en plus dans le chat si tu veux l&apos;affiner</span>
          )}
        </div>
      )}
    </div>
  )
}
