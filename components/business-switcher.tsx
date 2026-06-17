'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useBusiness } from '@/components/business-provider'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export function BusinessSwitcher() {
  const { current, all, setCurrent } = useBusiness()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-3 text-sm font-semibold shadow-sm transition-colors active:bg-muted"
      >
        <span
          className="flex size-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ backgroundColor: current.color }}
        >
          {current.initials}
        </span>
        {current.name}
        <ChevronsUpDown className="size-3.5 text-muted-foreground" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="mx-auto max-w-[480px] rounded-t-3xl">
          <SheetHeader className="text-left">
            <SheetTitle className="font-display text-lg">Mes business</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 px-4 pb-6">
            {all.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setCurrent(b)
                  setOpen(false)
                }}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors',
                  current.id === b.id ? 'border-primary bg-accent' : 'border-border bg-surface active:bg-muted',
                )}
              >
                <span
                  className="flex size-9 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: b.color }}
                >
                  {b.initials}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-foreground">{b.name}</span>
                  {b.isAtline && (
                    <span className="block text-xs text-primary">Licence Atline</span>
                  )}
                </span>
                {current.id === b.id && <Check className="size-5 text-primary" />}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
