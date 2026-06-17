'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, Sparkles, RotateCcw, ChevronRight, Star, Mic } from 'lucide-react'
import { contacts } from '@/lib/data'
import { DiscAvatar } from '@/components/disc-avatar'
import { DiscBadge } from '@/components/pills'
import { cn } from '@/lib/utils'
import type { DiscType } from '@/lib/types'

type Msg = { id: string; role: 'me' | 'them'; text: string }

type Phase = 'INVITATION' | 'SUIVI' | 'DEMARRAGE' | 'COACHING'

const phases: { id: Phase; label: string; desc: string; color: string }[] = [
  { id: 'INVITATION', label: 'Invitation', desc: 'Découvrir et inviter', color: 'bg-blue-500' },
  { id: 'SUIVI', label: 'Suivi', desc: 'Relancer et qualifier', color: 'bg-amber-500' },
  { id: 'DEMARRAGE', label: 'Démarrage', desc: 'Conclure et enrôler', color: 'bg-primary' },
  { id: 'COACHING', label: 'Coaching', desc: 'Former et accompagner', color: 'bg-success' },
]

const phaseReplies: Record<Phase, Record<DiscType, string[]>> = {
  INVITATION: {
    D: ["Concrètement, ça me rapporte quoi ?", "OK, mais en deux phrases.", "Envoie les chiffres."],
    I: ["Ah super intéressant ! Raconte-moi.", "J'adore l'idée ! On en parle ?", "Tu connais qui d'autre ?"],
    S: ["Je comprends, laisse-moi y réfléchir.", "C'est gentil de penser à moi.", "Je peux prendre le temps ?"],
    C: ["Tu as des données sur ce point ?", "Quelle est la méthodologie ?", "Je veux vérifier les détails."],
  },
  SUIVI: {
    D: ["Bon, j'ai réfléchi. C'est quoi le prochain pas ?", "Tu peux me garantir quoi exactement ?", "On signe quand ?"],
    I: ["J'ai un peu oublié, tu peux me re-pitcher ?", "Mes amis pourraient être intéressés non ?", "On se fait un café cette semaine ?"],
    S: ["J'ai besoin encore d'un peu de temps.", "Ma famille n'est pas sûre...", "C'est risqué comme investissement ?"],
    C: ["J'ai fait des recherches. J'ai des questions.", "Quels sont les vrais chiffres de succès ?", "Puis-je parler à quelqu'un qui l'a déjà fait ?"],
  },
  DEMARRAGE: {
    D: ["OK je veux démarrer vite. Qu'est-ce que je fais là maintenant ?", "Je veux les chiffres de mon potentiel.", "Qu'est-ce que ça coûte vraiment ?"],
    I: ["Je suis trop motivé ! C'est par où ?", "Qui sont les stars de ton réseau ?", "J'adore ça, on fête ça comment ?"],
    S: ["Je veux comprendre exactement chaque étape.", "Je peux commencer doucement ?", "Tu seras là pour m'accompagner ?"],
    C: ["Je veux voir le contrat en détail.", "Quelles sont mes obligations légales ?", "Quel est le plan B si ça ne marche pas ?"],
  },
  COACHING: {
    D: ["Mon équipe n'avance pas assez vite.", "Comment je double mes résultats ce mois ?", "Quels sont les leviers clés ?"],
    I: ["Comment je motive mes filleuls ?", "Ils sont découragés, qu'est-ce que je fais ?", "On peut faire un événement d'équipe ?"],
    S: ["Un de mes filleuls pense à arrêter...", "Comment je gère les conflits dans l'équipe ?", "Je veux pas les brusquer."],
    C: ["Analyse ma structure de réseau.", "Comment optimiser mon plan de compensation ?", "Quelles métriques suivre en priorité ?"],
  },
}

const discProfiles: Record<DiscType, string> = {
  D: 'Direct, orienté résultat. Va droit au but, déteste perdre du temps.',
  I: 'Enthousiaste, relationnel. Aime les histoires et la reconnaissance.',
  S: 'Posé, prudent. Cherche la confiance et déteste la pression.',
  C: 'Analytique, factuel. Veut des données, des preuves, des détails.',
}

const phaseHints: Record<Phase, Record<DiscType, string>> = {
  INVITATION: {
    D: "Sois direct et chiffré. Une question puissante suffit. Pas de blabla.",
    I: "Parle d'abord de la communauté et du style de vie. Les chiffres viennent après.",
    S: "Prends ton temps, montre que tu t'intéresses à lui/elle d'abord.",
    C: "Prépare des faits concrets. Il/elle voudra vérifier par lui-même.",
  },
  SUIVI: {
    D: "Sois factuel et concis. Propose un prochain pas clair et limité dans le temps.",
    I: "Re-crée l'émotion. Partage un témoignage enthousiaste.",
    S: "Montre de la patience. Ne force pas. Propose une ressource rassurante.",
    C: "Prépare des réponses aux objections avec preuves à l'appui.",
  },
  DEMARRAGE: {
    D: "Propose un plan d'action rapide en 3 étapes maximum.",
    I: "Célèbre la décision ! Parle de la communauté qui l'attend.",
    S: "Décompose le démarrage en micro-étapes non menaçantes.",
    C: "Montre le plan complet, les documents, les formations disponibles.",
  },
  COACHING: {
    D: "Donne des objectifs chiffrés et des délais clairs.",
    I: "Mise sur la motivation collective et les challenges d'équipe.",
    S: "Accompagne individuellement. Valorise chaque petit progrès.",
    C: "Analyse les données ensemble. Propose une stratégie structurée.",
  },
}

export default function AriaPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('INVITATION')
  const [target, setTarget] = useState(contacts[0])
  const [messages, setMessages] = useState<Msg[]>([])
  const [draft, setDraft] = useState('')
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [showPhaseSelect, setShowPhaseSelect] = useState(false)

  const disc = (target.disc ?? 'D') as DiscType
  const replies = phaseReplies[phase][disc]
  const hint = phaseHints[phase][disc]
  const currentPhaseData = phases.find((p) => p.id === phase)!

  function send() {
    if (!draft.trim()) return
    const mine: Msg = { id: crypto.randomUUID(), role: 'me', text: draft.trim() }
    const replyText = replies[messages.filter(m => m.role === 'them').length % replies.length]
    const reply: Msg = { id: crypto.randomUUID(), role: 'them', text: replyText }
    setMessages((m) => [...m, mine, reply])
    setDraft('')
    // Score heuristic: longer messages score better
    if (draft.trim().length > 20) setScore((s) => Math.min(100, s + 12))
    else setScore((s) => Math.min(100, s + 5))
  }

  function reset() {
    if (messages.length > 0) setSessionCount((n) => n + 1)
    setMessages([])
    setScore(0)
    setShowHint(false)
  }

  const scoreLabel = score >= 80 ? 'Excellent !' : score >= 50 ? 'Bien' : score >= 20 ? 'À améliorer' : '—'
  const scoreColor = score >= 80 ? 'text-success' : score >= 50 ? 'text-amber-400' : 'text-white/40'

  return (
    <div className="flex h-[100dvh] flex-col bg-[#0F0F0F] text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/10 bg-[#0F0F0F]/95 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Retour"
          className="grid size-9 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/10"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex flex-1 items-center gap-2">
          <Sparkles className="size-4 text-[#F97316]" />
          <h1 className="font-display text-lg font-semibold text-white">ARIA</h1>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/60 uppercase tracking-wide">
            {currentPhaseData.label}
          </span>
        </div>
        {messages.length > 0 && (
          <div className={cn('text-sm font-bold', scoreColor)}>{score}pts</div>
        )}
        <button
          type="button"
          onClick={reset}
          aria-label="Réinitialiser"
          className="grid size-9 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/10"
        >
          <RotateCcw className="size-4" />
        </button>
      </header>

      {/* Phase selector */}
      {showPhaseSelect ? (
        <div className="border-b border-white/10 bg-[#141414] px-4 py-3">
          <p className="mb-2 text-xs font-medium text-white/40">Choisir une phase d'entraînement</p>
          <div className="grid grid-cols-2 gap-2">
            {phases.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => { setPhase(p.id); setShowPhaseSelect(false); reset() }}
                className={cn(
                  'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors',
                  phase === p.id ? 'border-[#F97316] bg-[#F97316]/10' : 'border-white/10 bg-black/20 hover:bg-white/5'
                )}
              >
                <span className={cn('size-2.5 shrink-0 rounded-full', p.color)} />
                <div>
                  <p className="text-sm font-bold text-white">{p.label}</p>
                  <p className="text-[10px] text-white/40">{p.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Phase strip */}
          <button
            type="button"
            onClick={() => setShowPhaseSelect(true)}
            className="flex items-center gap-3 border-b border-white/10 bg-[#141414] px-4 py-2 text-left"
          >
            <div className="flex flex-1 items-center gap-2">
              {phases.map((p) => (
                <div key={p.id} className="flex items-center gap-1">
                  <span className={cn('size-1.5 rounded-full', p.id === phase ? p.color : 'bg-white/20')} />
                  <span className={cn('text-[11px] font-semibold', p.id === phase ? 'text-white' : 'text-white/30')}>
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
            <ChevronRight className="size-4 text-white/30" />
          </button>

          {/* Contact selector */}
          <div className="border-b border-white/10 bg-[#141414] px-4 py-2.5">
            <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
              {contacts.slice(0, 6).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { setTarget(c); reset() }}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-full border py-1 pl-1 pr-3 transition-colors',
                    c.id === target.id ? 'border-[#F97316] bg-[#F97316]/10' : 'border-white/10 bg-[#0F0F0F] hover:bg-white/5',
                  )}
                >
                  <DiscAvatar firstName={c.firstName} lastName={c.lastName} disc={c.disc} size="sm" />
                  <span className="text-sm font-medium text-white">{c.firstName}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* DISC context */}
      <div className="flex items-start gap-2 bg-white/5 px-4 py-2.5">
        <DiscBadge disc={disc} />
        <p className="flex-1 text-pretty text-xs leading-relaxed text-white/50">{discProfiles[disc]}</p>
        <button
          type="button"
          onClick={() => setShowHint((v) => !v)}
          className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors', showHint ? 'bg-[#F97316]/20 text-[#F97316]' : 'bg-white/10 text-white/40')}
        >
          Conseil
        </button>
      </div>

      {/* Hint banner */}
      {showHint && (
        <div className="flex items-start gap-2 border-b border-white/10 bg-[#F97316]/5 px-4 py-2.5">
          <Sparkles className="size-4 shrink-0 text-[#F97316] mt-0.5" />
          <p className="text-xs text-white/70 leading-relaxed">{hint}</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <div className="grid size-14 place-items-center rounded-full bg-[#F97316]/10">
              <Mic className="size-7 text-[#F97316]" />
            </div>
            <p className="max-w-[260px] text-pretty text-sm text-white/40">
              Phase <span className="font-bold text-white">{currentPhaseData.label}</span> avec {target.firstName} (DISC {disc}).<br />
              Écris ton message pour commencer la simulation.
            </p>
            {sessionCount > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5">
                <Star className="size-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-white">{sessionCount} session{sessionCount > 1 ? 's' : ''} complétée{sessionCount > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div key={m.id} className={cn('flex', m.role === 'me' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                m.role === 'me' ? 'rounded-br-md bg-[#F97316] text-white' : 'rounded-bl-md bg-white/10 text-white/90',
              )}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Score card après 3 échanges */}
        {messages.length >= 6 && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="mb-1 text-xs text-white/40">Score de cet échange</p>
            <p className={cn('font-display text-3xl font-bold', scoreColor)}>{score}</p>
            <p className={cn('text-sm font-semibold', scoreColor)}>{scoreLabel}</p>
            <div className="mt-3 flex justify-center gap-2">
              <button
                type="button"
                onClick={reset}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors active:bg-white/20"
              >
                Réessayer
              </button>
              <button
                type="button"
                onClick={() => { setPhase(phases[(phases.findIndex(p => p.id === phase) + 1) % phases.length].id); reset() }}
                className="rounded-xl bg-[#F97316] px-4 py-2 text-sm font-semibold text-white"
              >
                Phase suivante
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Compose */}
      <div className="sticky bottom-0 flex items-end gap-2 border-t border-white/10 bg-[#0F0F0F]/95 px-4 py-3 backdrop-blur pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          rows={1}
          placeholder={`Écris ton message à ${target.firstName}…`}
          className="max-h-28 flex-1 resize-none rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#F97316]"
        />
        <button
          type="button"
          onClick={send}
          disabled={!draft.trim()}
          aria-label="Envoyer"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-[#F97316] text-white transition-opacity disabled:opacity-40 active:scale-95"
        >
          <Send className="size-5" />
        </button>
      </div>
    </div>
  )
}
