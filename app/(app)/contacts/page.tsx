'use client'

import { useMemo, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AppHeader } from '@/components/app-header'
import { BusinessSwitcher } from '@/components/business-switcher'
import { useBusiness } from '@/components/business-provider'
import { DiscAvatar } from '@/components/disc-avatar'
import { StagePill } from '@/components/pills'
import { contacts } from '@/lib/data'
import type { ContactStage } from '@/lib/types'
import { Search, UserPlus, Users } from 'lucide-react'
import { AddContactSheet } from '@/components/add-contact-sheet'

const filters: { id: string; label: string; stages?: ContactStage[] }[] = [
  { id: 'tous', label: 'Tous' },
  { id: 'chaud', label: 'Chauds', stages: ['chaud'] },
  { id: 'prospect', label: 'Prospects', stages: ['prospect', 'nouveau'] },
  { id: 'client', label: 'Clients', stages: ['client'] },
  { id: 'partenaire', label: 'Partenaires', stages: ['partenaire'] },
]

function ContactsContent() {
  const searchParams = useSearchParams()
  const { current } = useBusiness()
  const initialFilter = searchParams.get('filter') ?? 'tous'
  const [active, setActive] = useState(initialFilter)
  const [query, setQuery] = useState('')
  const [addOpen, setAddOpen] = useState(false)

  const list = useMemo(() => {
    const filterDef = filters.find((f) => f.id === active)
    return contacts
      .filter((c) => c.businessId === current.id)
      .filter((c) => (filterDef?.stages ? filterDef.stages.includes(c.stage) : true))
      .filter((c) =>
        query
          ? `${c.firstName} ${c.lastName}`.toLowerCase().includes(query.toLowerCase())
          : true,
      )
  }, [active, query, current.id])

  return (
    <>
      <AppHeader title="Contacts" />

      <div className="flex flex-col gap-4 px-4 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {list.length} contact{list.length > 1 ? 's' : ''}
          </p>
          <BusinessSwitcher />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un contact"
            className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
        </div>

        {/* Filters */}
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                active === f.id
                  ? 'bg-primary/10 text-primary'
                  : 'border border-border bg-surface text-fg-2'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List or empty */}
        {list.length === 0 ? (
          <EmptyContacts onAdd={() => setAddOpen(true)} />
        ) : (
          <ul className="flex flex-col gap-2 pt-1">
            {list.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/contacts/${c.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 shadow-sm transition-colors active:bg-muted"
                >
                  <DiscAvatar firstName={c.firstName} lastName={c.lastName} disc={c.disc} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-foreground">
                        {c.firstName} {c.lastName}
                      </p>
                      <StagePill stage={c.stage} />
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.source} · {c.lastInteraction}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Floating add button */}
      <button
        type="button"
        onClick={() => setAddOpen(true)}
        aria-label="Ajouter un contact"
        className="fixed bottom-[96px] left-1/2 z-30 inline-flex -translate-x-[calc(50%-150px)] items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
      >
        <UserPlus className="size-4 stroke-2" />
        Ajouter
      </button>

      <AddContactSheet open={addOpen} onOpenChange={setAddOpen} />
    </>
  )
}

function EmptyContacts({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Users className="size-7 stroke-[1.5]" />
      </span>
      <div>
        <p className="font-display text-lg font-semibold text-foreground">
          Aucun contact ici
        </p>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">
          Ajoute ton premier contact pour que Atlas commence à te coacher.
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
      >
        <UserPlus className="size-4 stroke-2" />
        Ajouter ton premier contact
      </button>
    </div>
  )
}

export default function ContactsPage() {
  return (
    <Suspense fallback={null}>
      <ContactsContent />
    </Suspense>
  )
}
