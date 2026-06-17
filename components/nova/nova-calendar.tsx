'use client'

import { Card, SectionTitle } from '@/components/card'
import { PlatformBadge } from '@/components/pills'
import { posts, contentBalance } from '@/lib/data'
import type { PostType, PostStatus } from '@/lib/types'
import { Sparkles, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const typeLabels: Record<PostType, string> = {
  lifestyle: 'Lifestyle',
  produit: 'Produit',
  opportunite: 'Opportunité',
}

const typeColors: Record<PostType, string> = {
  lifestyle: 'bg-success/10 text-success',
  produit: 'bg-info/10 text-info',
  opportunite: 'bg-primary/10 text-primary',
}

const statusLabels: Record<PostStatus, string> = {
  brouillon: 'Brouillon',
  planifie: 'Planifié',
  publie: 'Publié',
}

export function NovaCalendar() {
  const unbalanced = contentBalance.opportunite > 10 || contentBalance.lifestyle < 60

  return (
    <div className="flex flex-col gap-5">
      {/* Balance card */}
      <Card className="p-4">
        <SectionTitle>Équilibre 70 / 20 / 10</SectionTitle>
        <div className="flex h-3 w-full overflow-hidden rounded-full">
          <span className="bg-success" style={{ width: `${contentBalance.lifestyle}%` }} />
          <span className="bg-info" style={{ width: `${contentBalance.produit}%` }} />
          <span className="bg-primary" style={{ width: `${contentBalance.opportunite}%` }} />
        </div>
        <div className="mt-3 flex justify-between text-xs">
          <Legend color="bg-info" label="Lifestyle" value={contentBalance.lifestyle} />
          <Legend color="bg-success" label="Produit" value={contentBalance.produit} />
          <Legend color="bg-primary" label="Opportunité" value={contentBalance.opportunite} />
        </div>
        {unbalanced && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-accent p-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-xs leading-relaxed text-accent-foreground">
              Léger déséquilibre : ajoute du contenu lifestyle pour rester sous les
              10 % d’opportunité.
            </p>
          </div>
        )}
      </Card>

      {/* Plan week CTA */}
      <Link
        href="/nova/create"
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-surface py-3 text-sm font-bold text-primary transition-colors active:bg-accent"
      >
        <Sparkles className="size-4" />
        Planifier ma semaine
      </Link>

      {/* Posts list */}
      <section>
        <SectionTitle>Mes posts</SectionTitle>
        <ul className="flex flex-col gap-2">
          {posts.map((p) => (
            <li key={p.id}>
              <Card className="p-3.5">
                <div className="flex items-center gap-2">
                  <PlatformBadge platform={p.platform} />
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${typeColors[p.type]}`}
                  >
                    {typeLabels[p.type]}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">{p.date}</span>
                </div>
                <p className="mt-2 text-sm font-bold text-foreground text-pretty">{p.title}</p>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{p.format}</span>
                  <span>·</span>
                  <span
                    className={
                      p.status === 'planifie' ? 'font-semibold text-success' : 'text-muted-foreground'
                    }
                  >
                    {statusLabels[p.status]}
                  </span>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function Legend({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <span className={`size-2 rounded-full ${color}`} />
      {label} <span className="font-bold text-foreground">{value}%</span>
    </span>
  )
}
