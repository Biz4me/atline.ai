'use client'

import { use } from 'react'
import { AppHeader } from '@/components/app-header'
import { Card } from '@/components/card'
import { CheckCircle2, Play, Lock, Clock, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const modulesData: Record<string, {
  title: string
  category: string
  duration: string
  description: string
  color: string
  lessons: { id: string; title: string; duration: string; done: boolean; locked: boolean }[]
}> = {
  m1: {
    title: 'Les bases du MLM',
    category: 'Fondamentaux',
    duration: '18 min',
    color: 'bg-success',
    description: 'Comprends le modèle MLM, ses avantages et les clés du succès à long terme.',
    lessons: [
      { id: 'l1', title: 'Qu\'est-ce que le marketing de réseau ?', duration: '4 min', done: true, locked: false },
      { id: 'l2', title: 'Les avantages du MLM vs emploi classique', duration: '5 min', done: true, locked: false },
      { id: 'l3', title: 'Les erreurs communes des débutants', duration: '5 min', done: true, locked: false },
      { id: 'l4', title: 'Ton plan d\'action pour les 30 premiers jours', duration: '4 min', done: true, locked: false },
    ],
  },
  m2: {
    title: 'Maîtriser la méthode DISC',
    category: 'Communication',
    duration: '24 min',
    color: 'bg-primary',
    description: 'Adapte ton discours à chaque profil de personnalité pour maximiser ton impact.',
    lessons: [
      { id: 'l1', title: 'Introduction au modèle DISC', duration: '4 min', done: true, locked: false },
      { id: 'l2', title: 'Profil D — Le Dominant', duration: '4 min', done: true, locked: false },
      { id: 'l3', title: 'Profil I — L\'Influent', duration: '4 min', done: true, locked: false },
      { id: 'l4', title: 'Profil S — Le Stable', duration: '4 min', done: false, locked: false },
      { id: 'l5', title: 'Profil C — Le Consciencieux', duration: '4 min', done: false, locked: false },
      { id: 'l6', title: 'Identifier le profil en 2 minutes', duration: '4 min', done: false, locked: false },
    ],
  },
  m3: {
    title: 'Construire ton script d\'invitation',
    category: 'Prospection',
    duration: '32 min',
    color: 'bg-violet-500',
    description: 'Structure tes invitations pour maximiser les acceptations et réduire les refus.',
    lessons: [
      { id: 'l1', title: 'Pourquoi la plupart des scripts échouent', duration: '4 min', done: false, locked: false },
      { id: 'l2', title: 'La structure en 5 étapes', duration: '5 min', done: false, locked: false },
      { id: 'l3', title: 'Adapter le script à Instagram', duration: '4 min', done: false, locked: false },
      { id: 'l4', title: 'Adapter le script à LinkedIn', duration: '4 min', done: false, locked: false },
      { id: 'l5', title: 'Les mots à éviter absolument', duration: '3 min', done: false, locked: false },
      { id: 'l6', title: 'Script pour les contacts froids', duration: '5 min', done: false, locked: false },
      { id: 'l7', title: 'Script pour les recommandations', duration: '4 min', done: false, locked: false },
      { id: 'l8', title: 'Quiz et mise en pratique', duration: '3 min', done: false, locked: false },
    ],
  },
}

export default function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const mod = modulesData[id] ?? modulesData['m3']
  const done = mod.lessons.filter((l) => l.done).length
  const progress = Math.round((done / mod.lessons.length) * 100)

  const nextLesson = mod.lessons.find((l) => !l.done && !l.locked)

  return (
    <>
      <AppHeader title={mod.title} back />

      <div className="flex flex-col gap-5 px-4 pt-4">
        {/* Module header */}
        <Card className="p-4">
          <span className="eyebrow mb-1 text-muted-foreground">{mod.category}</span>
          <h2 className="font-display text-xl font-semibold text-foreground">{mod.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">{mod.description}</p>
          <div className="mt-3 flex items-center gap-3">
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{mod.duration}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{mod.lessons.length} leçons</span>
          </div>
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{done}/{mod.lessons.length} leçons</span>
              <span className="text-xs font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </Card>

        {/* CTA continuer */}
        {nextLesson && (
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground"
          >
            <Play className="size-4 stroke-2 fill-primary-foreground" />
            Continuer — {nextLesson.title}
          </button>
        )}

        {/* Leçons */}
        <section>
          <h3 className="eyebrow mb-3">Contenu du module</h3>
          <Card className="divide-y divide-border p-0">
            {mod.lessons.map((lesson, i) => (
              <button
                key={lesson.id}
                type="button"
                disabled={lesson.locked}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-muted disabled:opacity-50"
              >
                <span className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  lesson.done
                    ? 'bg-success/15 text-success'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {lesson.done ? <CheckCircle2 className="size-4 stroke-2" /> : i + 1}
                </span>
                <span className={cn('flex-1 text-sm font-medium', lesson.done && 'text-muted-foreground')}>
                  {lesson.title}
                </span>
                <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                {lesson.locked ? (
                  <Lock className="size-4 text-muted-foreground" />
                ) : lesson.done ? null : (
                  <ChevronRight className="size-4 text-muted-foreground" />
                )}
              </button>
            ))}
          </Card>
        </section>
      </div>
    </>
  )
}
