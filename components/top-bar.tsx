'use client'

import { useState } from 'react'
import { Sparkles, CalendarDays, MessageSquare } from 'lucide-react'
import { BusinessSwitcher } from '@/components/business-switcher'
import { MessagesSheet } from '@/components/messages-sheet'
import Link from 'next/link'

export function TopBar() {
  const [messagesOpen, setMessagesOpen] = useState(false)

  return (
    <>
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <BusinessSwitcher />

        <div className="flex items-center gap-1">
          {/* Nova */}
          <Link
            href="/nova"
            aria-label="Nova"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-muted"
          >
            <Sparkles className="size-5 stroke-[1.5]" />
          </Link>

          {/* Agenda */}
          <Link
            href="/agenda"
            aria-label="Agenda"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-muted"
          >
            <CalendarDays className="size-5 stroke-[1.5]" />
          </Link>

          {/* Messages → sheet */}
          <button
            type="button"
            aria-label="Messages"
            onClick={() => setMessagesOpen(true)}
            className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-muted"
          >
            <MessageSquare className="size-5 stroke-[1.5]" />
            <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white ring-2 ring-background">
              3
            </span>
          </button>
        </div>
      </header>

      <MessagesSheet open={messagesOpen} onClose={() => setMessagesOpen(false)} />
    </>
  )
}
