'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { BusinessSwitcher } from '@/components/business-switcher'
import { Card } from '@/components/card'
import { DiscAvatar } from '@/components/disc-avatar'
import { network, networkStats, planLabels, euro } from '@/lib/data'
import type { NetworkMember } from '@/lib/types'
import { Users, BarChart3, Wallet, ChevronDown, BadgeCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

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

        {/* Tree */}
        <section>
          <h2 className="eyebrow mb-3">Mon équipe</h2>
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
