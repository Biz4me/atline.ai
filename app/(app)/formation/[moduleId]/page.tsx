'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Clock, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/card'
import { cn } from '@/lib/utils'

type Lesson = {
  id: string
  title: string
  position: number
  kind: 'LESSON' | 'QUIZ'
  durationMin: number | null
  _count: { questions: number }
}

type LmsModule = {
  id: string
  title: string
  description: string | null
  position: number
  course: { _count: { modules: number } }
  _count: { lessons: number }
  progress: { pct: number; status: string }[]
}

type LessonProgress = {
  lessonId: string
  done: boolean
}

function stripPrefix(title: string) {
  return title.replace(/^Module \d+\s*[—–-]\s*/, '')
}

export default function ModulePage() {
  const router = useRouter()
  const params = useParams()
  const moduleId = params.moduleId as string

  const [mod, setMod] = useState<LmsModule | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progress, setProgress] = useState<LessonProgress[]>([])

  useEffect(() => {
    Promise.all([
      fetch(`/api/formation/modules/${moduleId}`).then(r => r.json()),
      fetch(`/api/formation/modules/${moduleId}/lessons`).then(r => r.json()),
      fetch('/api/formation/progress').then(r => r.json()),
    ]).then(([m, l, p]) => { setMod(m); setLessons(l); setProgress(p) })
  }, [moduleId])

  const doneIds = new Set(progress.filter(p => p.done).map(p => p.lessonId))
  const doneCount = lessons.filter(l => doneIds.has(l.id)).length
  const pct = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0
  const totalModules = mod?.course?._count?.modules ?? 11
  const moduleNum = (mod?.position ?? 0) + 1

  const firstIncomplete = lessons.find(l => l.kind === 'LESSON' && !doneIds.has(l.id))
  const ctaTarget = firstIncomplete ?? lessons[0]
  const ctaLabel = doneCount === 0 ? 'Commencer' : doneCount === lessons.length ? 'Revoir' : 'Reprendre'

  return (
    <div
      className="fixed inset-0 z-[55] overflow-y-auto bg-background animate-slide-in-right"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Header sticky */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-9 items-center justify-center rounded-full text-foreground active:bg-muted"
        >
          <ChevronLeft className="size-5 stroke-[1.5]" />
        </button>
        <p className="max-w-[55%] truncate text-sm font-semibold text-foreground">
          {mod ? stripPrefix(mod.title) : ''}
        </p>
        <span className="text-xs text-muted-foreground">{moduleNum} / {totalModules}</span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5 px-4 pt-6 pb-10">

        {/* Titre + description */}
        {mod ? (
          <div>
            <h1 className="font-display text-[32px] font-extrabold leading-tight tracking-[-0.025em] text-foreground">
              {stripPrefix(mod.title)}
            </h1>
            {mod.description && (
              <p className="mt-2 text-sm text-muted-foreground">{mod.description}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {mod._count.lessons} leçons · {pct}% complété
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="h-8 w-3/4 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
          </div>
        )}

        {/* Barre de progression */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Skeleton leçons */}
        {lessons.length === 0 && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[68px] animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        )}

        {/* Liste leçons */}
        {lessons.length > 0 && (
          <div className="flex flex-col gap-2">
            {lessons.map((lesson) => {
              const done = doneIds.has(lesson.id)
              const isQuiz = lesson.kind === 'QUIZ'

              return (
                <Link key={lesson.id} href={`/formation/${moduleId}/${lesson.id}`}>
                  <Card className="transition-colors active:bg-muted/50">
                    <div className="flex items-center gap-3 p-3.5">

                      {/* Badge */}
                      <span className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-xl',
                        done ? 'bg-success' : isQuiz ? 'bg-primary/10' : 'bg-muted'
                      )}>
                        {done ? (
                          <CheckCircle2 className="size-5 stroke-2 text-white" />
                        ) : isQuiz ? (
                          <span className="text-xs font-bold text-primary">Quiz</span>
                        ) : (
                          <span className="text-base font-bold text-muted-foreground">
                            {lesson.position + 1}
                          </span>
                        )}
                      </span>

                      {/* Contenu */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {lesson.title}
                        </p>
                        {lesson.durationMin ? (
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <Clock className="size-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{lesson.durationMin} min</span>
                          </div>
                        ) : (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {isQuiz ? `${lesson._count.questions} questions` : 'Lecture'}
                          </p>
                        )}
                      </div>

                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}

        {/* CTA */}
        {ctaTarget && (
          <Link href={`/formation/${moduleId}/${ctaTarget.id}`}>
            <button
              type="button"
              className="w-full rounded-2xl bg-primary py-3 text-base font-semibold text-white transition-transform active:scale-[0.98]"
            >
              {ctaLabel}
            </button>
          </Link>
        )}

      </div>
    </div>
  )
}
