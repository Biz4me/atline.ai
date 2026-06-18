'use client'

import {
  ContactRound,
  Mic,
  CalendarPlus,
  Crown,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { TopBar } from '@/components/top-bar'
import { DiscAvatar } from '@/components/disc-avatar'
import { currentUser } from '@/lib/data'
import { toast } from 'sonner'
import Link from 'next/link'

const stats = [
  { icon: ContactRound, value: '14', label: 'Contacts' },
  { icon: Mic, value: '8', label: 'Simulations' },
  { icon: CalendarPlus, value: '5', label: 'RDV' },
]

export default function ProfilePage() {
  return (
    <div className="flex flex-col">
      <TopBar />

      <div className="flex flex-col gap-6 px-4 pt-5 pb-8">
        {/* Titre */}
        <h1 className="font-display text-[32px] font-extrabold leading-tight tracking-[-0.025em] text-foreground">
          Moi
        </h1>

        {/* Mon activité */}
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-primary">Mon activité</p>
          <div className="grid grid-cols-3 gap-2.5">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-surface px-3 py-4 text-center shadow-card">
                <Icon className="size-4 stroke-[1.5] text-muted-foreground" />
                <span className="font-display text-xl font-extrabold tabular-nums text-foreground">{value}</span>
                <span className="text-[11px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compte */}
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-primary">Compte</p>

          {/* Card profil */}
          <button
            type="button"
            onClick={() => toast.info('Mon profil — bientôt')}
            className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left shadow-card transition-colors active:bg-muted"
          >
            <DiscAvatar
              firstName={currentUser.firstName}
              lastName={currentUser.lastName}
              disc="I"
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[15px] text-foreground">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                  <Crown className="size-3" />
                  Pro
                </span>
                <span className="text-xs text-muted-foreground">Voir mon profil</span>
              </div>
            </div>
            <ChevronRight className="size-5 shrink-0 stroke-[1.5] text-muted-foreground" />
          </button>

          {/* Menu list */}
          <div className="mt-2.5 overflow-hidden rounded-2xl border border-border bg-surface shadow-card divide-y divide-border">
            <Link
              href="/abonnement"
              className="flex items-center gap-3.5 px-4 py-3.5 transition-colors active:bg-muted"
            >
              <CreditCard className="size-5 shrink-0 stroke-[1.5] text-amber-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">Abonnement</p>
                <p className="text-xs text-muted-foreground">Pro · renouvellement le 3 juil.</p>
              </div>
              <ChevronRight className="size-4 shrink-0 stroke-[1.5] text-muted-foreground" />
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3.5 px-4 py-3.5 transition-colors active:bg-muted"
            >
              <Settings className="size-5 shrink-0 stroke-[1.5] text-muted-foreground" />
              <span className="flex-1 text-sm font-bold text-foreground">Réglages</span>
              <ChevronRight className="size-4 shrink-0 stroke-[1.5] text-muted-foreground" />
            </Link>

            <button
              type="button"
              onClick={() => toast.error('Déconnexion')}
              className="flex w-full items-center gap-3.5 px-4 py-3.5 transition-colors active:bg-muted"
            >
              <LogOut className="size-5 shrink-0 stroke-[1.5] text-destructive" />
              <span className="text-sm font-bold text-destructive">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
