'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { DesktopSidebar } from '@/components/desktop-sidebar'
import { AtlasSidebar } from '@/components/atlas-sidebar'
import { DesktopTopBar } from '@/components/desktop-top-bar'
import { BottomNav } from '@/components/bottom-nav'

const SECTIONS_WITH_SIDEBAR = ['/home', '/contacts', '/formation', '/nova', '/network']

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const hasSidebar = SECTIONS_WITH_SIDEBAR.some(s => pathname.startsWith(s))
  const atlasHidden = pathname === '/atlas' || pathname.startsWith('/atlas/')

  // Read from html classes set by the blocking script — matches SSR correction
  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== 'undefined' ? document.documentElement.classList.contains('sc') : false
  )
  const [atlasCollapsed, setAtlasCollapsed] = useState(() =>
    typeof window !== 'undefined' ? document.documentElement.classList.contains('ac') : false
  )

  // Re-enable transitions after hydration
  useEffect(() => {
    document.documentElement.classList.remove('no-transitions')
  }, [])

  const toggle = () => {
    setCollapsed((v) => {
      const next = !v
      localStorage.setItem('sidebar-collapsed', next ? '1' : '0')
      if (next) document.documentElement.classList.add('sc')
      else document.documentElement.classList.remove('sc')
      return next
    })
  }

  const toggleAtlas = () => {
    setAtlasCollapsed((v) => {
      const next = !v
      localStorage.setItem('atlas-sidebar-collapsed', next ? '1' : '0')
      if (next) document.documentElement.classList.add('ac')
      else document.documentElement.classList.remove('ac')
      return next
    })
  }

  return (
    <>
      <DesktopTopBar />
      <DesktopSidebar collapsed={collapsed} onToggle={toggle} />
      <AtlasSidebar collapsed={atlasCollapsed} onToggle={toggleAtlas} />
      {/* app-shell-layout: padding driven by CSS rules keyed on html.sc / html.ac */}
      <div
        className={cn(
          'app-shell-layout app-shell pb-[110px] lg:pb-0 lg:max-w-none lg:mx-0 lg:pt-14',
          !hasSidebar && 'no-sidebar',
          atlasHidden && 'atlas-hidden',
        )}
      >
        {children}
        <BottomNav />
      </div>
    </>
  )
}
