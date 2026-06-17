'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { businesses } from '@/lib/data'
import type { Business } from '@/lib/types'

interface BusinessCtx {
  current: Business
  all: Business[]
  setCurrent: (b: Business) => void
}

const Ctx = createContext<BusinessCtx | null>(null)

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Business>(businesses[0])
  return (
    <Ctx.Provider value={{ current, all: businesses, setCurrent }}>
      {children}
    </Ctx.Provider>
  )
}

export function useBusiness() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useBusiness must be used within BusinessProvider')
  return ctx
}
