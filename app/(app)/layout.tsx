import type { ReactNode } from 'react'
import { BusinessProvider } from '@/components/business-provider'
import { BottomNav } from '@/components/bottom-nav'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <BusinessProvider>
      <div className="app-shell pb-[110px]">
        {children}
        <BottomNav />
      </div>
    </BusinessProvider>
  )
}
