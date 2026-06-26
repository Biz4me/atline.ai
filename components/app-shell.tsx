'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DesktopSidebar } from '@/components/desktop-sidebar'
import { AtlasSidebar } from '@/components/atlas-sidebar'
import { DesktopTopBar } from '@/components/desktop-top-bar'
import { DesktopSectionRail } from '@/components/desktop-section-rail'
import { BottomNav } from '@/components/bottom-nav'
import { PageVisibilityProvider } from '@/components/page-visibility-context'

interface Props {
  children: ReactNode
  initialCollapsed: boolean
  initialAtlasCollapsed: boolean
}

export function AppShell({ children, initialCollapsed, initialAtlasCollapsed }: Props) {
  const pathname = usePathname()
  // Pages où le rail droit reste mais réduit aux agents (jamais déplié)
  const railCollapsedOnly = ['/atlas', '/aria', '/nova', '/messages'].some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )
  // Pages agent : sidebar 2 = historique, élargie à 256px (bord à 64+256 = 320)
  const isAgentPage = ['/atlas', '/aria', '/nova'].some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )
  const sidebarEdge = isAgentPage ? 320 : 256

  const [collapsed, setCollapsed] = useState(initialCollapsed)
  const [atlasCollapsed, setAtlasCollapsed] = useState(initialAtlasCollapsed)

  useEffect(() => {
    if (pathname.startsWith('/contacts')) {
      setAtlasCollapsed(false)
    }
  }, [pathname])

  const toggle = () => {
    setCollapsed((v) => {
      const next = !v
      localStorage.setItem('sidebar-collapsed', next ? '1' : '0')
      document.cookie = `sidebar-collapsed=${next ? '1' : '0'};path=/;max-age=31536000;samesite=lax`
      return next
    })
  }

  const toggleAtlas = () => {
    setAtlasCollapsed((v) => {
      const next = !v
      localStorage.setItem('atlas-sidebar-collapsed', next ? '1' : '0')
      document.cookie = `atlas-sidebar-collapsed=${next ? '1' : '0'};path=/;max-age=31536000;samesite=lax`
      return next
    })
  }

  return (
    <PageVisibilityProvider>
      <DesktopTopBar />
      <DesktopSectionRail hidden={collapsed} />
      <DesktopSidebar hidden={collapsed} />
      <AtlasSidebar collapsed={atlasCollapsed} onToggle={toggleAtlas} />

      {/* Toggle nav (focus) — masque/affiche rail + sidebar 2, hauteur fixe */}
      <button
        type="button"
        onClick={toggle}
        title={collapsed ? 'Afficher la navigation' : 'Masquer la navigation'}
        style={{ left: collapsed ? 32 : sidebarEdge }}
        className="hidden lg:flex fixed top-[78px] z-[45] -translate-x-1/2 size-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-all duration-200 hover:text-foreground hover:bg-muted"
      >
        {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
      </button>

      <div
        className={cn(
          'app-shell pb-[60px] lg:pb-0 lg:max-w-none lg:mx-0 lg:pt-14',
          'transition-[padding-left,padding-right] duration-200 ease-out',
          collapsed ? (railCollapsedOnly ? 'lg:pl-14' : 'lg:pl-0') : (isAgentPage ? 'lg:pl-[320px]' : 'lg:pl-[256px]'),
          railCollapsedOnly ? 'lg:pr-16' : atlasCollapsed ? 'lg:pr-16' : 'lg:pr-[360px]',
        )}
      >
        {children}
        <BottomNav />
      </div>
    </PageVisibilityProvider>
  )
}
