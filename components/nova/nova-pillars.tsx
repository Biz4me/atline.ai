'use client'

import { Card, SectionTitle } from '@/components/card'
import { pillars, strategyGuides } from '@/lib/data'
import { GripVertical, BookOpen, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

export function NovaPillars() {
  return (
    <div className="flex flex-col gap-5">
      <section>
        <SectionTitle>Mes piliers éditoriaux</SectionTitle>
        <ul className="flex flex-col gap-2">
          {pillars.map((p) => (
            <li key={p.id}>
              <Card className="flex items-center gap-3 p-3.5">
                <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                </div>
                <GripVertical className="size-5 text-muted-foreground" />
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle>Stratégie</SectionTitle>
        <ul className="flex flex-col gap-2">
          {strategyGuides.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => toast('Guide bientôt disponible', { description: g.title })}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-3.5 text-left shadow-sm transition-colors active:bg-muted"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <BookOpen className="size-5 stroke-[1.5]" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-foreground">{g.title}</span>
                  <span className="block text-xs text-muted-foreground">{g.desc}</span>
                </span>
                <ChevronRight className="size-5 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
