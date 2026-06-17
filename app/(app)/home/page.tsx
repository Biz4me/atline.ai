'use client'

import { AppHeader } from '@/components/app-header'
import { BusinessSwitcher } from '@/components/business-switcher'
import { Card, SectionTitle } from '@/components/card'
import { DiscAvatar } from '@/components/disc-avatar'
import { currentUser, euro, networkStats } from '@/lib/data'
import { ArrowRight, Sparkles, Users, CalendarClock, Wallet, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const today = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  return (
    <>
      <AppHeader title="Parcours" showNova />

      <div className="flex flex-col gap-6 px-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Bonjour {currentUser.firstName}
            </h2>
            <p className="text-sm capitalize text-muted-foreground">{today}</p>
          </div>
          <BusinessSwitcher />
        </div>

        {/* Atlas coach card */}
        <Card accent className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-sm font-bold">
              A
            </span>
            <span className="eyebrow text-primary">Atlas · ton coach</span>
          </div>
          <p className="text-[15px] font-semibold leading-relaxed text-foreground text-pretty">
            Tu as 3 contacts chauds sans relance depuis 2 jours. On les recontacte
            aujourd’hui pour ne pas perdre l’élan.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href="/contacts?filter=chaud"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
            >
              Voir mes contacts chauds
              <ArrowRight className="size-4 stroke-2" />
            </Link>
            <Link
              href="/aria"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-fg-2 transition-colors active:bg-muted"
            >
              M’entraîner
            </Link>
          </div>
        </Card>

        {/* Metrics */}
        <section>
          <div className="grid grid-cols-3 gap-3">
            <Metric icon={Users} value="24" label="Contacts actifs" />
            <Metric icon={CalendarClock} value="4" label="Posts planifiés" />
            <Metric
              icon={Wallet}
              valueNode={<span className="money text-lg">{euro(networkStats.monthCommission)}</span>}
              label="Commissions"
            />
          </div>
        </section>

        {/* Network events */}
        <section>
          <SectionTitle
            action={
              <Link href="/network" className="text-xs font-semibold text-primary">
                Voir le réseau
              </Link>
            }
          >
            Mon réseau
          </SectionTitle>
          <Card className="divide-y divide-border">
            <NetworkRow
              first="Sophie"
              last="Lefèvre"
              disc="C"
              text="a parrainé un nouveau filleul"
              time="2 h"
            />
            <NetworkRow
              first="Nadia"
              last="Benali"
              disc="I"
              text="a atteint 18 pts de volume"
              time="5 h"
            />
            <NetworkRow
              first="Karim"
              last="Haddad"
              disc="S"
              text="a validé son plan Pro"
              time="Hier"
            />
          </Card>
        </section>

        {/* Nova next post */}
        <section>
          <SectionTitle
            action={
              <Link href="/nova" className="text-xs font-semibold text-primary">
                Ouvrir Nova
              </Link>
            }
          >
            Prochain post Nova
          </SectionTitle>
          <Link href="/nova">
            <Card className="flex items-center gap-3 p-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Sparkles className="size-5 stroke-[1.5]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">
                  Ma routine matinale pour rester focus
                </p>
                <p className="text-xs text-muted-foreground">
                  Instagram · Reel · Aujourd’hui 18:00
                </p>
              </div>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
            </Card>
          </Link>
        </section>
      </div>
    </>
  )
}

function Metric({
  icon: Icon,
  value,
  valueNode,
  label,
}: {
  icon: typeof Users
  value?: string
  valueNode?: React.ReactNode
  label: string
}) {
  return (
    <Card className="flex flex-col gap-1.5 p-3">
      <Icon className="size-4 stroke-[1.5] text-muted-foreground" />
      {valueNode ?? (
        <span className="font-display text-2xl font-semibold leading-none text-foreground">
          {value}
        </span>
      )}
      <span className="text-[11px] leading-tight text-muted-foreground">{label}</span>
    </Card>
  )
}

function NetworkRow({
  first,
  last,
  disc,
  text,
  time,
}: {
  first: string
  last: string
  disc: 'D' | 'I' | 'S' | 'C'
  text: string
  time: string
}) {
  return (
    <div className="flex items-center gap-3 p-3.5">
      <DiscAvatar firstName={first} lastName={last} disc={disc} size="sm" />
      <p className="flex-1 text-sm text-fg-2">
        <span className="font-bold text-foreground">{first}</span> {text}
      </p>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  )
}
