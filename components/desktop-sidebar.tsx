'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Mic, CalendarDays, Users, UserCheck, Handshake,
  BookOpen, Library, PenLine, Inbox, BarChart2, GitFork,
  ChevronLeft, ChevronRight,
  Settings, User, TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface SidebarItem {
  href: string
  label: string
  icon: LucideIcon
  color?: string
}

interface SidebarSection {
  title: string
  items: SidebarItem[]
  bottom?: SidebarItem[]
}

function getSidebarSection(pathname: string): SidebarSection | null {
  if (pathname.startsWith('/home') || pathname === '/') {
    return {
      title: 'Mon parcours',
      items: [
        { href: '/home',    label: 'Accueil',    icon: Home },
        { href: '/aria',    label: 'Simulateur', icon: Mic,        color: '#14B8A6' },
        { href: '/agenda',  label: 'Agenda',     icon: CalendarDays },
        { href: '/rapport', label: 'Rapport',    icon: TrendingUp },
      ],
    }
  }
  if (pathname.startsWith('/contacts')) {
    return {
      title: 'Mon CRM',
      items: [
        { href: '/contacts',              label: 'Prospects',   icon: Users },
        { href: '/contacts?view=clients', label: 'Clients',     icon: UserCheck },
        { href: '/contacts?view=partenaires', label: 'Partenaires', icon: Handshake },
      ],
    }
  }
  if (pathname.startsWith('/formation')) {
    return {
      title: 'Formation',
      items: [
        { href: '/formation',          label: 'Mes modules',  icon: BookOpen },
        { href: '/formation/library',  label: 'Bibliothèque', icon: Library },
      ],
    }
  }
  if (pathname.startsWith('/nova')) {
    return {
      title: 'Nova — Contenu',
      items: [
        { href: '/nova',        label: 'Accueil',    icon: BarChart2, color: '#8B5CF6' },
        { href: '/nova/create', label: 'Créer',      icon: PenLine,   color: '#8B5CF6' },
        { href: '/nova/inbox',  label: 'Inbox',      icon: Inbox,     color: '#8B5CF6' },
      ],
    }
  }
  if (pathname.startsWith('/network')) {
    return {
      title: 'Réseau Atline',
      items: [
        { href: '/network', label: 'Mon réseau', icon: GitFork },
      ],
    }
  }
  return null
}

interface Props {
  collapsed: boolean
  onToggle: () => void
}

export function DesktopSidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname()
  const section = getSidebarSection(pathname)

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  if (!section) return null

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col fixed left-0 top-14 h-[calc(100dvh-3.5rem)] z-40',
        'bg-background border-r border-border overflow-hidden',
        'transition-[width] duration-200 ease-out',
        collapsed ? 'w-14' : 'w-56',
      )}
    >
      {/* Section title + collapse toggle */}
      <div className={cn(
        'flex items-center shrink-0 h-12 px-4',
        collapsed && 'justify-center px-0',
      )}>
        {!collapsed && (
          <span className="flex-1 text-sm font-bold text-foreground truncate">
            {section.title}
          </span>
        )}
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? 'Développer' : 'Réduire'}
          className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      <div className="mx-3 h-px bg-border shrink-0" />

      {/* Contextual nav */}
      <nav className="flex flex-col gap-0.5 px-2 pt-3 flex-1 overflow-y-auto overflow-x-hidden">
        {section.items.map((item) => (
          <NavItem key={item.href} {...item} active={isActive(item.href)} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom — settings + profil toujours accessibles */}
      <div className="shrink-0 flex flex-col gap-0.5 px-2 pb-3 pt-1">
        <div className="mx-1 mb-1 h-px bg-border" />
        <NavItem href="/settings" label="Paramètres" icon={Settings} active={isActive('/settings')} collapsed={collapsed} />
        <NavItem href="/profile"  label="Mon profil" icon={User}     active={isActive('/profile')}  collapsed={collapsed} />
      </div>
    </aside>
  )
}

function NavItem({
  href, label, icon: Icon, active, collapsed, color,
}: {
  href: string
  label: string
  icon: LucideIcon
  active: boolean
  collapsed: boolean
  color?: string
}) {
  const activeColor = active && color ? color : undefined
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
        active
          ? 'font-bold'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        collapsed && 'justify-center px-0',
      )}
      style={active ? {
        color: activeColor ?? 'var(--primary)',
        backgroundColor: activeColor ? `${activeColor}1a` : 'var(--primary-soft, color-mix(in srgb, var(--primary) 10%, transparent))',
      } : undefined}
    >
      <Icon className="size-[18px] shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}
