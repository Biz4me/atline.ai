'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { BusinessSwitcher } from '@/components/business-switcher'
import { Card, SectionTitle } from '@/components/card'
import { DiscAvatar } from '@/components/disc-avatar'
import { network, networkStats, planLabels, euro } from '@/lib/data'
import type { NetworkMember } from '@/lib/types'
import {
  Users, BarChart3, Wallet, ChevronDown, BadgeCheck, ChevronRight,
  ShoppingBag, Share2, CalendarCheck, MessageSquare, Video,
  ArrowUpRight, Clock, TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const toolboxLinks = [
  { id: 'boutique', icon: ShoppingBag, label: 'Boutique', color: 'bg-primary/10 text-primary', href: '/toolbox' },
  { id: 'parrainage', icon: Share2, label: 'Parrainage', color: 'bg-success/10 text-success', href: '/toolbox' },
  { id: 'rdv', icon: CalendarCheck, label: 'Prendre RDV', color: 'bg-violet-50 text-violet-600', href: '/toolbox' },
  { id: 'whatsapp', icon: MessageSquare, label: 'WhatsApp', color: 'bg-emerald-50 text-emerald-600', href: '/toolbox' },
  { id: 'zoom', icon: Video, label: 'Zoom', color: 'bg-blue-50 text-blue-600', href: '/toolbox' },
  { id: 'more', icon: ChevronRight, label: 'Tout voir', color: 'bg-muted text-muted-foreground', href: '/toolbox' },
]

const commissions = [
  { label: 'N1 — Filleuls directs', amount: 1420, rate: '15%', count: 8 },
  { label: 'N2 — Équipe filleuls', amount: 856, rate: '7%', count: 21 },
  { label: 'Fast Start', amount: 400, rate: 'Bonus', count: 2 },
  { label: 'Rétention', amount: 171.5, rate: '5%', count: null },
]

const placements = [
  { id: 'p1', firstName: 'Julie', lastName: 'Fontaine', disc: 'I' as const, daysLeft: 18, status: 'En attente de placement' },
  { id: 'p2', firstName: 'Marc', lastName: 'Lemaire', disc: 'C' as const, daysLeft: 6, status: 'Place avant expiration !' },
]

export default function NetworkPage() {
  return (
    <>
      <AppHeader title="Réseau" />
      <div className="flex flex-col gap-5 px-4 pt-4">
        <div className="flex justify-end">
          <BusinessSwitcher />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <Stat icon={Users} value={String(networkStats.directReferrals)} label="Filleuls directs" />
          <Stat icon={BarChart3} value={String(networkStats.teamVolume)} label="Volume équipe" />
          <Stat
            icon={Wallet}
            valueNode={<span className="money text-base">{euro(networkStats.monthCommission)}</span>}
            label="Commission"
          />
        </div>

        {/* Boîte à outils */}
        <section>
          <SectionTitle
            action={
              <Link href="/toolbox" className="text-xs font-semibold text-primary">
                Tout voir
              </Link>
            }
          >
            Boîte à outils
          </SectionTitle>
          <div className="grid grid-cols-3 gap-2">
            {toolboxLinks.map((tool) => {
              const Icon = tool.icon
              return (
                <Link key={tool.id} href={tool.href}>
                  <Card className="flex flex-col items-center gap-2 p-3 text-center transition-colors active:bg-muted/50">
                    <span className={cn('flex size-10 items-center justify-center rounded-xl', tool.color)}>
                      <Icon className="size-5 stroke-[1.5]" />
                    </span>
                    <span className="text-xs font-semibold text-foreground">{tool.label}</span>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Placements filleuls */}
        {placements.length > 0 && (
          <section>
            <SectionTitle>Placements filleuls</SectionTitle>
            <div className="flex flex-col gap-2">
              {placements.map((p) => (
                <Card key={p.id} className={cn('flex items-center gap-3 p-3.5', p.daysLeft <= 7 && 'border-destructive/30 bg-destructive/5')}>
                  <DiscAvatar firstName={p.firstName} lastName={p.lastName} disc={p.disc} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className={cn('text-xs', p.daysLeft <= 7 ? 'font-semibold text-destructive' : 'text-muted-foreground')}>
                      {p.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                    <Clock className="size-3 text-muted-foreground" />
                    <span className={cn('text-xs font-bold', p.daysLeft <= 7 ? 'text-destructive' : 'text-foreground')}>
                      {p.daysLeft}j
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Commissions détail */}
        <section>
          <SectionTitle
            action={
              <div className="flex items-center gap-1 text-xs font-semibold text-success">
                <TrendingUp className="size-3.5" />
                +18% vs M-1
              </div>
            }
          >
            Mes commissions du mois
          </SectionTitle>
          <Card className="divide-y divide-border p-0">
            {commissions.map((c) => (
              <div key={c.label} className="flex items-center px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{c.label}</p>
                  {c.count !== null && (
                    <p className="text-xs text-muted-foreground">{c.count} personnes · {c.rate}</p>
                  )}
                </div>
                <span className="money text-base">{euro(c.amount)}</span>
              </div>
            ))}
            <div className="flex items-center bg-muted/50 px-4 py-3">
              <p className="flex-1 text-sm font-bold text-foreground">Total</p>
              <span className="money text-lg">{euro(networkStats.monthCommission)}</span>
            </div>
          </Card>
        </section>

        {/* Mon équipe */}
        <section>
          <SectionTitle>Mon équipe</SectionTitle>
          <ul className="flex flex-col gap-2">
            {network.map((m) => (
              <MemberNode key={m.id} member={m} />
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

function Stat({
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
        <span className="font-display text-2xl font-semibold leading-none text-foreground">{value}</span>
      )}
      <span className="text-[11px] leading-tight text-muted-foreground">{label}</span>
    </Card>
  )
}

function MemberNode({ member }: { member: NetworkMember }) {
  const [open, setOpen] = useState(false)
  const hasChildren = (member.children?.length ?? 0) > 0

  return (
    <li>
      <Card className="overflow-hidden">
        <button
          type="button"
          onClick={() => hasChildren && setOpen((o) => !o)}
          className="flex w-full items-center gap-3 p-3.5 text-left"
        >
          <DiscAvatar firstName={member.firstName} lastName={member.lastName} disc={member.disc} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-foreground">
                {member.firstName} {member.lastName}
              </p>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-fg-2">
                {planLabels[member.plan]}
              </span>
              {member.isAtlineLicensee && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  <BadgeCheck className="size-3" />
                  Atline Licensee
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{member.teamVolume} pts de volume</p>
          </div>
          {hasChildren && (
            <ChevronDown className={cn('size-5 text-muted-foreground transition-transform', open && 'rotate-180')} />
          )}
        </button>

        {hasChildren && open && (
          <ul className="border-t border-border bg-muted/30 px-3.5 py-2">
            {member.children!.map((child) => (
              <li key={child.id} className="flex items-center gap-3 py-2">
                <DiscAvatar firstName={child.firstName} lastName={child.lastName} disc={child.disc} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-semibold text-foreground">
                      {child.firstName} {child.lastName}
                    </p>
                    {child.isAtlineLicensee && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                        <BadgeCheck className="size-2.5" />
                        Licensee
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {planLabels[child.plan]} · {child.teamVolume} pts
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </li>
  )
}
