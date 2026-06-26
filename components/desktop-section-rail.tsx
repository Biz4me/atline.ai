'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, MessageSquare, BookOpen, Settings, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePageVisibility } from '@/components/page-visibility-context'

const SECTIONS = [
  { href: '/home',      icon: Home,          label: 'Accueil',   visKey: 'home',      match: ['/home', '/rapport'] },
  { href: '/contacts',  icon: Users,         label: 'Terrain',   visKey: 'contacts',  match: ['/contacts', '/network'] },
  { href: '/messages',  icon: MessageSquare, label: 'Échanges',  visKey: 'messages',  match: ['/messages', '/agenda'] },
  { href: '/formation', icon: BookOpen,      label: 'Formation', visKey: 'formation', match: ['/formation', '/communaute'] },
]

const BOTTOM = [
  { href: '/profile',  icon: User,     label: 'Profil'   },
  { href: '/settings', icon: Settings, label: 'Réglages' },
]

export function DesktopSectionRail({ hidden = false }: { hidden?: boolean }) {
  const pathname = usePathname()
  const vis = usePageVisibility()
  const sections = SECTIONS.filter((s) => vis[s.visKey] !== false)

  const isActive = (match: string[]) =>
    match.some((m) => pathname === m || pathname.startsWith(m + '/'))

  const RailItem = ({ href, icon: Icon, label, match }: { href: string; icon: LucideIcon; label: string; match?: string[] }) => {
    const active = isActive(match ?? [href])
    return (
      <Link
        href={href}
        title={label}
        className={cn(
          'mx-2 flex h-11 items-center justify-center rounded-xl transition-colors',
          active
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        <Icon className={cn('size-5', active ? 'stroke-[2]' : 'stroke-[1.5]')} />
      </Link>
    )
  }

  return (
    <aside
      style={{ transform: hidden ? 'translateX(-320px)' : 'translateX(0)' }}
      className="hidden lg:flex flex-col fixed left-0 top-14 h-[calc(100dvh-3.5rem)] w-16 z-40 bg-background border-r border-border pb-3 transition-transform duration-200 ease-out"
    >
      {/* Sections — alignées avec les items de la sidebar 2 (pt-3, gap-0.5, h-11) */}
      <nav className="flex flex-col gap-0.5 pt-3">
        {sections.map((s) => <RailItem key={s.href} {...s} />)}
      </nav>

      {/* Bas — Réglages + Profil */}
      <div className="mt-auto flex flex-col gap-0.5">
        <div className="mx-3 mb-1 h-px bg-border" />
        {BOTTOM.map((s) => <RailItem key={s.href} {...s} />)}
      </div>
    </aside>
  )
}
