'use client'

import { useRef, useState, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, MoreHorizontal, User, CreditCard } from 'lucide-react'
import { BusinessSwitcher } from '@/components/business-switcher'

const PLUS_ITEMS = [
  { href: '/profile',        label: 'Profil',     icon: User },
  { href: '/mon-abonnement', label: 'Abonnement', icon: CreditCard },
]

export function TopBar() {
  const router = useRouter()
  const headerRef = useRef<HTMLElement>(null)

  // Menu Plus — même navigation slide-in que le switcher
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [dropTop, setDropTop] = useState(0)
  const [dropBottom, setDropBottom] = useState(0)
  const dropRef = useRef<HTMLDivElement>(null)

  function openMenu() {
    if (open) { closeMenu(); return }
    if (headerRef.current) setDropTop(headerRef.current.getBoundingClientRect().bottom)
    setOpen(true)
    setMounted(true)
    requestAnimationFrame(() => setVisible(true))
  }

  function closeMenu() {
    setVisible(false)
    setTimeout(() => { setMounted(false); setOpen(false) }, 300)
  }

  useLayoutEffect(() => {
    if (mounted && dropRef.current) setDropBottom(dropTop + dropRef.current.offsetHeight)
  }, [mounted, dropTop])

  return (
    <>
      <header
        ref={headerRef}
        className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-background/90 px-4 py-3 backdrop-blur"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <BusinessSwitcher variant="popover" fullWidth />

        <div className="flex items-center gap-1">
          {/* Notifications */}
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-muted"
          >
            <Bell className="size-5 stroke-[1.5]" />
            <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white ring-2 ring-background">
              3
            </span>
          </Link>

          {/* Plus */}
          <button
            type="button"
            aria-label="Plus"
            onClick={openMenu}
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-muted"
          >
            <MoreHorizontal className="size-5 stroke-[1.5]" />
          </button>
        </div>
      </header>

      {/* Backdrop — sous la zone du menu */}
      {mounted && typeof window !== 'undefined' && createPortal(
        <div
          className="lg:hidden fixed inset-x-0 bottom-0 z-[59] bg-black/40 transition-opacity duration-300"
          style={{ top: dropBottom, opacity: visible ? 1 : 0 }}
          onClick={closeMenu}
        />,
        document.body
      )}

      {/* Menu slide-in — même pattern que le switcher */}
      {mounted && (
        <div className="lg:hidden fixed left-0 right-0 z-[60]" style={{ top: dropTop, clipPath: 'inset(0 0 0 0)' }}>
          <div
            ref={dropRef}
            className="bg-background border-b border-border transition-transform duration-300 ease-out"
            style={{ transform: visible ? 'translateY(0)' : 'translateY(-100%)' }}
          >
            <div className="divide-y divide-border">
              {PLUS_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => { closeMenu(); router.push(item.href) }}
                    className="flex h-[52px] w-full items-center gap-4 px-6 active:bg-muted transition-colors"
                  >
                    <Icon className="size-5 text-muted-foreground stroke-[1.5]" />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
