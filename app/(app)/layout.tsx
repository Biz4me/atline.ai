import type { ReactNode } from 'react'
import { BusinessProvider } from '@/components/business-provider'
import { AppShell } from '@/components/app-shell'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <BusinessProvider>
      <AppShell>{children}</AppShell>
    </BusinessProvider>
  )
}
