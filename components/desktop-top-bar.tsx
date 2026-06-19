'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Users, BookOpen, Zap, GitFork, MessageSquare, CalendarDays, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BusinessSwitcher } from '@/components/business-switcher'

const NAV_TABS = [
  { href: '/home',       icon: Compass,      label: 'Parcours'   },
  { href: '/contacts',   icon: Users,        label: 'CRM'        },
  { href: '/formation',  icon: BookOpen,     label: 'Formation'  },
  { href: '/nova',       icon: Zap,          label: 'Nova'       },
  { href: '/network',    icon: GitFork,      label: 'Réseau'     },
]

export function DesktopTopBar() {
  const pathname = usePathname()

  return (
    <header className="hidden lg:flex fixed top-0 left-0 right-0 h-14 z-50 items-center border-b border-border bg-background/95 backdrop-blur px-4">
      {/* Left — company switcher aligned with left sidebar width */}
      <div className="w-60 flex-shrink-0">
        <BusinessSwitcher />
      </div>

      {/* Center — section tabs */}
      <div className="flex flex-1 items-center justify-center gap-1">
        {NAV_TABS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-5 py-2 rounded-lg transition-colors',
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className={cn('size-5', active ? 'stroke-[2]' : 'stroke-[1.5]')} />
              <span className={cn('text-[10px] font-medium', active && 'font-bold')}>{label}</span>
            </Link>
          )
        })}
      </div>

      {/* Right — utilities */}
      <div className="w-60 flex-shrink-0 flex items-center justify-end gap-1">
        <Link
          href="/messages"
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
        >
          <MessageSquare className="size-5 stroke-[1.5]" />
        </Link>
        <Link
          href="/agenda"
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
        >
          <CalendarDays className="size-5 stroke-[1.5]" />
        </Link>
        <Link
          href="/atlas"
          className={cn(
            'flex size-9 items-center justify-center rounded-full transition-colors',
            pathname.startsWith('/atlas')
              ? 'bg-primary text-primary-foreground'
              : 'text-primary hover:bg-accent'
          )}
        >
          <Sparkles className="size-5 stroke-[1.5]" />
        </Link>
      </div>
    </header>
  )
}
