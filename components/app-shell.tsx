'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { DesktopSidebar } from '@/components/desktop-sidebar'
import { BottomNav } from '@/components/bottom-nav'

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    setCollapsed(localStorage.getItem('sidebar-collapsed') === '1')
  }, [])

  const toggle = () => {
    setCollapsed((v) => {
      const next = !v
      localStorage.setItem('sidebar-collapsed', next ? '1' : '0')
      return next
    })
  }

  return (
    <>
      <DesktopSidebar collapsed={collapsed} onToggle={toggle} />
      <div
        className={cn(
          'app-shell pb-[110px] lg:pb-0 lg:max-w-none lg:mx-0',
          'transition-[padding-left] duration-200 ease-out',
          collapsed ? 'lg:pl-16' : 'lg:pl-60',
        )}
      >
        {children}
        <BottomNav />
      </div>
    </>
  )
}
