'use client'

import { AppHeader } from '@/components/app-header'
import { Card } from '@/components/card'
import { DiscAvatar } from '@/components/disc-avatar'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const conversations = [
  {
    id: 'c1',
    firstName: 'Thomas',
    lastName: 'Bernard',
    disc: 'D' as const,
    lastMessage: 'Oui je suis disponible vendredi matin, ça marche pour moi !',
    time: 'Il y a 2 h',
    unread: 2,
    stage: 'chaud',
  },
  {
    id: 'c7',
    firstName: 'Nadia',
    lastName: 'Benali',
    disc: 'I' as const,
    lastMessage: 'Énergie incroyable dans ton dernier vocal. Je suis partante pour en savoir plus !',
    time: 'Il y a 4 h',
    unread: 1,
    stage: 'chaud',
  },
  {
    id: 'c2',
    firstName: 'Camille',
    lastName: 'Dubois',
    disc: 'I' as const,
    lastMessage: 'Adore le côté communauté. À bientôt !',
    time: 'Hier',
    unread: 0,
    stage: 'prospect',
  },
  {
    id: 'c4',
    firstName: 'Sophie',
    lastName: 'Lefèvre',
    disc: 'C' as const,
    lastMessage: 'J\'ai besoin des chiffres de volume pour ce mois. Tu peux m\'envoyer ?',
    time: 'Hier',
    unread: 0,
    stage: 'partenaire',
  },
  {
    id: 'c3',
    firstName: 'Karim',
    lastName: 'Haddad',
    disc: 'S' as const,
    lastMessage: 'Merci pour le suivi, tout se passe bien de mon côté.',
    time: 'Il y a 3 j',
    unread: 0,
    stage: 'client',
  },
  {
    id: 'c5',
    firstName: 'Lucas',
    lastName: 'Petit',
    disc: null as null,
    lastMessage: 'Salut, c\'est quoi exactement Atline ?',
    time: 'Il y a 5 j',
    unread: 0,
    stage: 'nouveau',
  },
]

const stageColors: Record<string, string> = {
  nouveau: 'bg-muted text-muted-foreground',
  chaud: 'bg-amber-50 text-amber-600',
  prospect: 'bg-blue-50 text-blue-600',
  client: 'bg-success/10 text-success',
  partenaire: 'bg-primary/10 text-primary',
}

export default function MessagesPage() {
  const [search, setSearch] = useState('')
  const filtered = conversations.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
  )
  const totalUnread = conversations.reduce((acc, c) => acc + c.unread, 0)

  return (
    <>
      <AppHeader title="Messages" back showActions={false} />

      <div className="flex flex-col gap-4 px-4 pt-4">
        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5">
          <Search className="size-4 shrink-0 text-muted-foreground stroke-[1.5]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une conversation…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>

        {totalUnread > 0 && (
          <p className="text-sm font-semibold text-foreground">
            {totalUnread} message{totalUnread > 1 ? 's' : ''} non lu{totalUnread > 1 ? 's' : ''}
          </p>
        )}

        <Card className="divide-y divide-border p-0">
          {filtered.map((conv) => (
            <Link key={conv.id} href={`/messages/${conv.id}`}>
              <div className={cn('flex items-start gap-3 px-4 py-3.5 transition-colors active:bg-muted', conv.unread > 0 && 'bg-primary/[0.03]')}>
                <DiscAvatar firstName={conv.firstName} lastName={conv.lastName} disc={conv.disc} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={cn('text-sm', conv.unread > 0 ? 'font-bold text-foreground' : 'font-semibold text-foreground')}>
                      {conv.firstName} {conv.lastName}
                    </p>
                    <span className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide', stageColors[conv.stage])}>
                      {conv.stage}
                    </span>
                  </div>
                  <p className={cn('mt-0.5 truncate text-xs', conv.unread > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
                    {conv.lastMessage}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">{conv.time}</span>
                  {conv.unread > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </Card>
      </div>
    </>
  )
}
