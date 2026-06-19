'use client'

import { AppHeader } from '@/components/app-header'
import { Card, SectionTitle } from '@/components/card'
import { Bell, Moon, Globe, Lock, Trash2, ChevronRight, Smartphone, Eye } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={cn(
        'relative h-6 w-10 rounded-full transition-colors',
        value ? 'bg-primary' : 'bg-muted'
      )}
    >
      <span className={cn(
        'absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform',
        value ? 'left-4' : 'left-0.5'
      )} />
    </button>
  )
}

export default function SettingsPage() {
  const [notifs, setNotifs] = useState({
    atlas: true,
    contacts: true,
    commissions: true,
    aria: false,
    nova: true,
  })
  const { theme, setTheme } = useTheme()
  const dark = theme === 'dark'
  const [lang, setLang] = useState('fr')

  return (
    <>
      <AppHeader title="Paramètres" back showActions={false} />

      <div className="flex flex-col gap-5 px-4 pt-4 lg:px-8 lg:pt-8 lg:max-w-2xl lg:mx-auto">
        {/* Notifications */}
        <section>
          <SectionTitle>Notifications</SectionTitle>
          <Card className="divide-y divide-border p-0">
            {[
              { key: 'atlas' as const, icon: Bell, label: 'Atlas — Rappels quotidiens' },
              { key: 'contacts' as const, icon: Smartphone, label: 'Nouveaux messages contacts' },
              { key: 'commissions' as const, icon: Bell, label: 'Nouvelles commissions' },
              { key: 'aria' as const, icon: Bell, label: 'ARIA — Rappels d\'entraînement' },
              { key: 'nova' as const, icon: Bell, label: 'Nova — Posts à publier' },
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-3 px-4 py-3.5">
                <item.icon className="size-5 shrink-0 text-muted-foreground stroke-[1.5]" />
                <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
                <Toggle value={notifs[item.key]} onChange={(v) => setNotifs((p) => ({ ...p, [item.key]: v }))} />
              </div>
            ))}
          </Card>
        </section>

        {/* Apparence */}
        <section>
          <SectionTitle>Apparence</SectionTitle>
          <Card className="divide-y divide-border p-0">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Moon className="size-5 shrink-0 text-muted-foreground stroke-[1.5]" />
              <span className="flex-1 text-sm font-medium text-foreground">Mode sombre</span>
              <Toggle value={dark} onChange={(v) => setTheme(v ? 'dark' : 'light')} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Globe className="size-5 shrink-0 text-muted-foreground stroke-[1.5]" />
              <span className="flex-1 text-sm font-medium text-foreground">Langue</span>
              <span className="text-sm text-muted-foreground">Français</span>
            </div>
          </Card>
        </section>

        {/* Confidentialité */}
        <section>
          <SectionTitle>Confidentialité & sécurité</SectionTitle>
          <Card className="divide-y divide-border p-0">
            {[
              { icon: Lock, label: 'Changer mon mot de passe' },
              { icon: Eye, label: 'Qui peut voir mon profil' },
              { icon: Smartphone, label: 'Sessions actives' },
            ].map((row) => (
              <button
                key={row.label}
                type="button"
                onClick={() => toast.info(row.label)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-muted"
              >
                <row.icon className="size-5 shrink-0 text-muted-foreground stroke-[1.5]" />
                <span className="flex-1 text-sm font-medium text-foreground">{row.label}</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </Card>
        </section>

        {/* Danger zone */}
        <section>
          <SectionTitle>Zone sensible</SectionTitle>
          <Card className="divide-y divide-border p-0">
            <button
              type="button"
              onClick={() => toast.error('Suppression de compte — contacter le support')}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-muted"
            >
              <Trash2 className="size-5 shrink-0 text-destructive stroke-[1.5]" />
              <span className="flex-1 text-sm font-medium text-destructive">Supprimer mon compte</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          </Card>
        </section>
      </div>
    </>
  )
}
