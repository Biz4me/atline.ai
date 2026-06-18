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
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const dailyTasks = [
  {
    id: 't1',
    icon: Flame,
    iconBg: 'bg-orange-100',
    iconColor: 'text-primary',
    label: 'Relancer 3 prospects chauds',
    cta: '/contacts',
    ctaLabel: 'Préparer',
    ctaPrimary: true,
  },
  {
    id: 't2',
    icon: PhoneCall,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    label: 'Appeler Sophie pour son closing',
    cta: '/aria',
    ctaLabel: 'Script',
    ctaPrimary: false,
  },
  {
    id: 't3',
    icon: BookOpen,
    iconBg: 'bg-green-100',
    iconColor: 'text-success',
    label: 'Module 3 — Formation',
    cta: '/formation/m3',
    ctaLabel: 'Reprendre',
    ctaPrimary: false,
  },
]

const agenda = [
  { time: '14:00', stage: 'Closing', stageColor: 'bg-red-100 text-red-600', name: 'Sophie Laurent' },
  { time: '16:30', stage: 'Découverte', stageColor: 'bg-blue-100 text-blue-600', name: 'Julie Moreau' },
]

const ariaPhases = ['Invitation', 'Suivi', 'Démarrage', 'Coaching']

export default function HomePage() {
  const [ariaPhase, setAriaPhase] = useState('Invitation')
  const [ariaSearch, setAriaSearch] = useState('')

  return (
    <>
      <TopBar />

      <div className="px-4 pt-5 pb-8 lg:px-8 lg:pt-8 lg:max-w-6xl lg:mx-auto">
        <h1 className="font-display text-[32px] font-extrabold leading-tight tracking-[-0.025em] text-foreground">
          Mon parcours
        </h1>

        <div className="mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-[3fr_2fr] lg:gap-8 lg:items-start">

          {/* ── Colonne gauche : actions prioritaires ── */}
          <div className="flex flex-col gap-6">

            {/* Plan du jour */}
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-xs font-bold">
                  A
                </span>
                <span className="text-sm font-bold text-foreground">Plan du jour</span>
              </div>
              <div className="divide-y divide-border">
                {dailyTasks.map((task) => {
                  const Icon = task.icon
                  return (
                    <Link
                      key={task.id}
                      href={task.cta}
                      className="flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-muted hover:bg-muted/40"
                    >
                      <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-xl', task.iconBg)}>
                        <Icon className={cn('size-4 stroke-[1.5]', task.iconColor)} />
                      </span>
                      <span className="flex-1 text-sm font-medium text-foreground leading-snug">
                        {task.label}
                      </span>
                      <span className={cn(
                        'shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors',
                        task.ctaPrimary
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border bg-surface text-foreground'
                      )}>
                        {task.ctaLabel}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </Card>

            {/* Rapport Atlas hebdo */}
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

            {/* Agenda du jour */}
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 stroke-[1.5] text-muted-foreground" />
                  <span className="text-sm font-bold text-foreground">Agenda du jour</span>
                </div>
                <Link href="/nova" className="text-xs font-semibold text-primary">
                  Voir tout →
                </Link>
              </div>
              <div className="divide-y divide-border">
                {agenda.map((item) => (
                  <div key={item.time} className="flex items-center gap-3 px-4 py-3">
                    <span className="w-12 shrink-0 text-sm font-bold text-foreground tabular-nums">
                      {item.time}
                    </span>
                    <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', item.stageColor)}>
                      {item.stage}
                    </span>
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* ── Colonne droite : outils ── */}
          <div className="flex flex-col gap-6">

            {/* Simulateur ARIA */}
            <section>
              <p className="mb-3 px-0.5 text-[11px] font-extrabold uppercase tracking-widest text-primary">
                Simulateur ARIA
              </p>
              <Card className="p-4 flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {ariaPhases.map((phase) => (
                    <button
                      key={phase}
                      type="button"
                      onClick={() => setAriaPhase(phase)}
                      className={cn(
                        'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
                        ariaPhase === phase
                          ? 'bg-primary/10 text-primary border border-primary/30'
                          : 'border border-border bg-surface text-muted-foreground'
                      )}
                    >
                      {phase}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground stroke-[1.5]" />
                  <input
                    type="search"
                    value={ariaSearch}
                    onChange={(e) => setAriaSearch(e.target.value)}
                    placeholder="Rechercher un contact..."
                    className="w-full rounded-xl border border-border bg-muted py-2.5 pl-9 pr-4 text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/40"
                  />
                </div>

                <Link
                  href={`/aria?phase=${ariaPhase}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
                >
                  Simuler — {ariaPhase}
                </Link>

                <button
                  type="button"
                  onClick={() => toast.info('Sessions précédentes')}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors active:opacity-70"
                >
                  <History className="size-4 stroke-[1.5]" />
                  <span className="flex-1 text-left">Mes sessions précédentes</span>
                  <ChevronRight className="size-4" />
                </button>

                <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success text-white font-display text-base font-bold">
                    82
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Dernière session</p>
                    <p className="text-xs text-foreground leading-relaxed italic">
                      « Bonne accroche — travaille ta relance sur l'objection prix. »
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            {/* Formation + Communauté */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/formation">
                <Card className="flex flex-col items-start gap-3 p-4 transition-colors active:bg-muted/50 hover:bg-muted/40 h-full">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-blue-100">
                    <BookOpen className="size-5 stroke-[1.5] text-blue-600" />
                  </span>
                  <p className="text-sm font-bold text-foreground">Ma formation</p>
                </Card>
              </Link>
              <Link href="/communaute">
                <Card className="flex flex-col items-start gap-3 p-4 transition-colors active:bg-muted/50 hover:bg-muted/40 h-full">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-violet-100">
                    <Users className="size-5 stroke-[1.5] text-violet-600" />
                  </span>
                  <p className="text-sm font-bold text-foreground">Ma communauté</p>
                </Card>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </>
  )
}
