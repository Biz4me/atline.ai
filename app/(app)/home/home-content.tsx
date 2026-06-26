'use client'

import { TopBar } from '@/components/top-bar'
import { Card } from '@/components/card'
import {
  ChevronRight,
  Flame,
  PhoneCall,
  BookOpen,
  CalendarDays,
  History,
  Search,
  Users,
  Check,
  Rocket,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// ── Données mobiles (inchangées) ─────────────────────────────────────────────

const dailyTasks = [
  {
    id: 't1',
    icon: Flame,
    iconBg: 'bg-muted',
    iconColor: 'text-muted-foreground',
    label: 'Relancer 3 prospects chauds',
    cta: '/contacts',
    ctaLabel: 'Préparer',
    ctaPrimary: true,
    done: false,
  },
  {
    id: 't2',
    icon: PhoneCall,
    iconBg: 'bg-muted',
    iconColor: 'text-muted-foreground',
    label: 'Appeler Sophie pour son closing',
    cta: '/aria',
    ctaLabel: 'Script',
    ctaPrimary: false,
    done: false,
  },
  {
    id: 't3',
    icon: BookOpen,
    iconBg: 'bg-muted',
    iconColor: 'text-muted-foreground',
    label: 'Module 3 — Formation',
    cta: '/formation/m3',
    ctaLabel: 'Reprendre',
    ctaPrimary: false,
    done: true,
  },
]

const agenda = [
  { time: '14:00', stage: 'Closing', stageColor: 'bg-red-100 text-red-600', name: 'Sophie Laurent', href: '/contacts/c1' },
  { time: '16:30', stage: 'Découverte', stageColor: 'bg-blue-100 text-blue-600', name: 'Julie Moreau', href: '/contacts' },
]

const ariaPhases = ['Invitation', 'Suivi', 'Démarrage', 'Coaching']

// ── Données desktop ───────────────────────────────────────────────────────────

type FeedAction = {
  kind: 'action'
  id: string
  tag: string
  tagColor: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  label: string
  cta: string
  ctaLabel: string
  ctaPrimary: boolean
}

type FeedNetwork = {
  kind: 'network'
  id: string
  initials: string
  avatarBg: string
  name: string
  label: string
  sub: string
  trigger: string
  cta: string
  ctaLabel: string
}

type FeedItem = FeedAction | FeedNetwork

const feedItems: FeedItem[] = [
  {
    kind: 'action',
    id: 'f1',
    tag: 'AGIS',
    tagColor: 'bg-primary/10 text-primary',
    icon: Flame,
    iconBg: 'bg-muted',
    iconColor: 'text-muted-foreground',
    label: 'Relancer Sophie — prospect chaud depuis 5 jours',
    cta: '/contacts/c1',
    ctaLabel: 'Préparer',
    ctaPrimary: true,
  },
  {
    kind: 'network',
    id: 'f2',
    initials: 'TH',
    avatarBg: 'bg-muted',
    name: 'Thomas',
    label: 'a signé son premier closing',
    sub: 'il y a 2h · ton N1',
    trigger: 'Appelle tes prospects chauds',
    cta: '/contacts',
    ctaLabel: 'Féliciter',
  },
  {
    kind: 'action',
    id: 'f3',
    tag: 'HONORE',
    tagColor: 'bg-amber-100 text-amber-700',
    icon: CalendarDays,
    iconBg: 'bg-muted',
    iconColor: 'text-muted-foreground',
    label: '14:00 — Closing avec Sophie Laurent',
    cta: '/agenda',
    ctaLabel: 'Agenda',
    ctaPrimary: false,
  },
  {
    kind: 'network',
    id: 'f4',
    initials: 'MA',
    avatarBg: 'bg-muted',
    name: 'Marie',
    label: 'a terminé le module 2',
    sub: 'il y a 4h · ta partenaire',
    trigger: 'Tu es au module 3 — continue',
    cta: '/network',
    ctaLabel: 'Voir',
  },
  {
    kind: 'action',
    id: 'f5',
    tag: 'APPRENDS',
    tagColor: 'bg-green-100 text-green-700',
    icon: BookOpen,
    iconBg: 'bg-muted',
    iconColor: 'text-muted-foreground',
    label: 'Module 3 — 4 leçons restantes',
    cta: '/formation',
    ctaLabel: 'Reprendre',
    ctaPrimary: false,
  },
  {
    kind: 'network',
    id: 'f6',
    initials: 'LU',
    avatarBg: 'bg-muted',
    name: 'Lucas',
    label: 'a ajouté 3 contacts cette semaine',
    sub: 'hier · ton N2',
    trigger: 'Tu as 2 prospects en attente de relance',
    cta: '/network',
    ctaLabel: 'Motiver',
  },
  {
    kind: 'action',
    id: 'f7',
    tag: 'AGIS',
    tagColor: 'bg-primary/10 text-primary',
    icon: PhoneCall,
    iconBg: 'bg-muted',
    iconColor: 'text-muted-foreground',
    label: 'Appeler Julie Moreau — suivi à J+7',
    cta: '/contacts',
    ctaLabel: 'Script',
    ctaPrimary: false,
  },
]

// ── Contacts Aria (simulés) ───────────────────────────────────────────────────

const JOURNAL = [
  { label: 'Simulation Aria — score 82/100', time: "Aujourd'hui · 10h14", agent: 'aria' },
  { label: 'Contact ajouté — Marie Dupont (prospect)', time: 'Hier · 16h32', agent: null },
  { label: 'Formation Module 2 terminé', time: 'Hier · 09h05', agent: null },
  { label: 'Simulation Aria — score 71/100', time: 'Lundi · 14h20', agent: 'aria' },
]

const JOURNAL_DOT: Record<string, string> = {
  aria:  '#14B8A6',
  atlas: '#F97316',
  nova:  '#8B5CF6',
}

// ── Carte partagée — Plan du jour (mobile + desktop, source unique) ────────────

function PlanDuJourCard() {
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set(['t3']))
  const allDone = checkedTasks.size >= dailyTasks.length

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex h-14 items-center justify-between px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Rocket className="size-4 stroke-[1.5] text-muted-foreground" />
          <span className="text-sm font-bold text-foreground">Plan du jour</span>
        </div>
        <Link
          href="/atlas"
          className="flex items-center gap-1.5 rounded-xl bg-primary/10 text-primary px-3.5 py-2 text-xs font-bold hover:bg-primary/20 transition-colors shrink-0"
        >
          Discuter
        </Link>
      </div>
      {allDone ? (
        <div className="flex items-center gap-3 px-4 py-5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#22c55e]/10">
            <Check className="size-5 text-[#22c55e] stroke-[2.5]" />
          </span>
          <div>
            <p className="text-sm font-bold text-foreground">Plan du jour bouclé</p>
            <button type="button" onClick={() => setCheckedTasks(new Set())}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5">
              Tout décocher
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {dailyTasks.map((task) => {
            const Icon = task.icon
            const done = checkedTasks.has(task.id)
            return (
              <div key={task.id} className={cn(
                'flex h-[60px] items-center gap-3 px-4 transition-colors hover:bg-muted/20',
                done && 'opacity-50'
              )}>
                <button
                  type="button"
                  onClick={() => setCheckedTasks((prev) => {
                    const next = new Set(prev)
                    next.has(task.id) ? next.delete(task.id) : next.add(task.id)
                    return next
                  })}
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    done ? 'border-primary bg-primary' : 'border-border hover:border-primary'
                  )}
                >
                  {done && <Check className="size-3 text-primary-foreground stroke-[3]" />}
                </button>
                <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', task.iconBg)}>
                  <Icon className={cn('size-4 stroke-[1.5]', task.iconColor)} />
                </span>
                <p className={cn('flex-1 text-sm font-medium text-foreground', done && 'line-through text-muted-foreground')}>
                  {task.label}
                </p>
                {!done && (
                  <Link
                    href={task.cta}
                    className="shrink-0 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    {task.ctaLabel}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function HomeContent({ mantra }: { mantra: string }) {
  // Mobile state
  const [ariaPhase, setAriaPhase] = useState('Invitation')
  const [ariaSearch, setAriaSearch] = useState('')

  return (
    <>
      <TopBar />

      {/* ══════════════ MOBILE — NE PAS TOUCHER ══════════════ */}
      <div className="lg:hidden px-4 pt-6 pb-8">
        <div className="flex flex-col gap-6">

          {/* Mantra */}
          {mantra ? (
            <div className="px-2 py-1 text-center leading-snug">
              <span className="text-primary font-semibold text-base">« </span>
              <span className="text-base font-semibold text-foreground">{mantra}</span>
              <span className="text-primary font-semibold text-base"> »</span>
            </div>
          ) : null}

          {/* Plan du jour */}
          <PlanDuJourCard />

          {/* Agenda */}
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 stroke-[1.5] text-muted-foreground" />
                <span className="text-sm font-bold text-foreground">Agenda du jour</span>
              </div>
              <Link href="/nova" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Voir tout →</Link>
            </div>
            <div className="divide-y divide-border">
              {agenda.map((item) => (
                <div key={item.time} className="flex items-center gap-3 px-4 py-3.5">
                  <span className="w-12 shrink-0 text-sm font-bold text-foreground tabular-nums">{item.time}</span>
                  <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', item.stageColor)}>{item.stage}</span>
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Rapport Atlas */}
          <Link href="/network">
            <Card className="flex items-center gap-3 p-4 transition-colors active:bg-muted/50 hover:bg-muted/40">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <span className="font-display text-base font-bold text-primary">A</span>
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">Ton rapport hebdo est prêt</p>
                <p className="text-xs text-muted-foreground">9 — 15 juin</p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </Card>
          </Link>

          {/* Simulateur Aria */}
          <section>
            <p className="mb-3 px-0.5 text-xs font-extrabold uppercase tracking-widest text-primary">Simulateur Aria</p>
            <Card className="p-4 flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {ariaPhases.map((phase) => (
                  <button key={phase} type="button" onClick={() => setAriaPhase(phase)}
                    className={cn('rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors', ariaPhase === phase ? 'bg-primary/10 text-primary border border-primary/30' : 'border border-border bg-surface text-muted-foreground')}>
                    {phase}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground stroke-[1.5]" />
                <input type="search" value={ariaSearch} onChange={(e) => setAriaSearch(e.target.value)} placeholder="Rechercher un contact..."
                  className="w-full rounded-xl border border-border bg-muted py-2.5 pl-9 pr-4 text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/40" />
              </div>
              <Link href={`/aria?phase=${ariaPhase}`} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]">
                Simuler — {ariaPhase}
              </Link>
              <button type="button" onClick={() => toast.info('Sessions précédentes')} className="flex items-center gap-2 text-sm text-muted-foreground transition-colors active:opacity-70">
                <History className="size-4 stroke-[1.5]" />
                <span className="flex-1 text-left">Mes sessions précédentes</span>
                <ChevronRight className="size-4" />
              </button>
              <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success text-white font-display text-base font-bold">82</span>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">Dernière session</p>
                  <p className="text-xs text-foreground leading-relaxed italic">« Bonne accroche — travaille ta relance sur l'objection prix. »</p>
                </div>
              </div>
            </Card>
          </section>

          {/* Communauté */}
          <Link href="/communaute">
            <Card className="flex flex-col items-start gap-3 p-4 transition-colors active:bg-muted/50 hover:bg-muted/40">
              <span className="flex size-10 items-center justify-center rounded-xl bg-violet-100">
                <Users className="size-5 stroke-[1.5] text-violet-600" />
              </span>
              <p className="text-sm font-bold text-foreground">Ma communauté</p>
            </Card>
          </Link>

        </div>
      </div>

      {/* ══════════════ DESKTOP ══════════════ */}
      <div className="hidden lg:block px-8 pt-8 pb-10 max-w-6xl mx-auto">

        {/* ── Mantra ── */}
        {mantra ? (
          <div className="text-center mb-8 leading-snug">
            <span className="text-primary font-semibold text-base">« </span>
            <span className="text-base font-semibold text-foreground">{mantra}</span>
            <span className="text-primary font-semibold text-base"> »</span>
          </div>
        ) : null}

        {/* ── KPI Strip ── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Liste de noms',       value: '12', sub: '+2 cette semaine'  },
            { label: 'Score Aria',         value: '82', sub: 'Moyenne 30 jours'  },
            { label: 'Partenaires actifs', value: '4',  sub: 'sur 7 partenaires' },
          ].map((kpi) => (
            <Card key={kpi.label} className="px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
              <p className="text-xl font-bold text-foreground mt-1 tabular-nums">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 items-start">

          {/* ── Colonne gauche — 3 zones ── */}
          <div className="flex flex-col gap-5">

            {/* Plan du jour — carte partagée */}
            <PlanDuJourCard />


          </div>

          {/* ── Colonne droite ── */}
          <div className="flex flex-col gap-5">

            {/* Agenda du jour */}
            <Card className="p-0 overflow-hidden">
              <div className="flex h-14 items-center justify-between px-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 stroke-[1.5] text-muted-foreground" />
                  <span className="text-sm font-bold text-foreground">Agenda du jour</span>
                </div>
                <Link href="/agenda" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Voir tout →</Link>
              </div>
              <div className="divide-y divide-border">
                {agenda.map((item) => (
                  <div key={item.time} className="flex h-[60px] items-center gap-3 px-4">
                    <span className="w-12 shrink-0 text-sm font-bold text-foreground tabular-nums">{item.time}</span>
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', item.stageColor)}>{item.stage}</span>
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </>
  )
}
