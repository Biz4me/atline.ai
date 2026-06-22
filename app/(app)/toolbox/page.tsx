'use client'

import { AppHeader } from '@/components/app-header'
import { Card, SectionTitle } from '@/components/card'
import {
  ShoppingBag, Share2, CalendarCheck, MessageSquare, Video,
  FileText, Link2, Bot, Copy, Check, ExternalLink,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const quickLinks = [
  {
    id: 'boutique',
    icon: ShoppingBag,
    label: 'Ma boutique',
    desc: 'Partage tes produits',
    color: 'bg-primary/10 text-primary',
    url: 'https://boutique.atline.ai/lea-moreau',
  },
  {
    id: 'parrainage',
    icon: Share2,
    label: 'Lien parrainage',
    desc: 'Recrute ton équipe',
    color: 'bg-success/10 text-success',
    url: 'https://atline.ai/rejoindre/lea-moreau',
  },
  {
    id: 'rdv',
    icon: CalendarCheck,
    label: 'Prendre RDV',
    desc: 'Calendly intégré',
    color: 'bg-violet-50 text-violet-600',
    url: 'https://calendly.com/lea-moreau',
  },
  {
    id: 'whatsapp',
    icon: MessageSquare,
    label: 'WhatsApp',
    desc: 'Message direct',
    color: 'bg-emerald-50 text-emerald-600',
    url: 'https://wa.me/33612345678',
  },
  {
    id: 'zoom',
    icon: Video,
    label: 'Zoom',
    desc: 'Démonstration live',
    color: 'bg-blue-50 text-blue-600',
    url: 'https://zoom.us/j/lea-moreau',
  },
]

const supports = [
  { id: 's1', icon: FileText, label: 'Présentation Atline', type: 'PDF · 2.4 MB', color: 'text-primary' },
  { id: 's2', icon: FileText, label: 'Catalogue produits 2026', type: 'PDF · 5.1 MB', color: 'text-amber-500' },
  { id: 's3', icon: FileText, label: 'Témoignages clients', type: 'PDF · 1.8 MB', color: 'text-success' },
  { id: 's4', icon: Link2, label: 'Vidéo présentation 3 min', type: 'Lien vidéo', color: 'text-violet-500' },
]

const botLinks = [
  { id: 'wa-bot', platform: 'WhatsApp', desc: 'Bot de prospection automatique', active: true },
  { id: 'tg-bot', platform: 'Telegram', desc: 'Bot qualif + réponses FAQs', active: false },
]

function CopyableLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Lien copié !')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2">
      <span className="flex-1 truncate text-xs font-medium text-foreground">{url}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 rounded-lg p-1 text-primary transition-colors active:bg-primary/10"
      >
        {copied ? <Check className="size-3.5 stroke-2" /> : <Copy className="size-3.5 stroke-[1.5]" />}
      </button>
    </div>
  )
}

function ToolboxContent() {
  return (
    <div className="flex flex-col gap-5">
      {/* Liens rapides */}
      <section>
        <SectionTitle>Liens rapides</SectionTitle>
        <div className="flex flex-col gap-2">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Card key={link.id} className="p-4">
                <div className="flex items-center gap-3">
                  <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', link.color)}>
                    <Icon className="size-5 stroke-[1.5]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground">{link.label}</p>
                    <p className="text-xs text-muted-foreground">{link.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.info(`Ouvrir ${link.label}`)}
                    className="shrink-0 rounded-xl border border-border bg-surface p-2 transition-colors active:bg-muted"
                  >
                    <ExternalLink className="size-4 stroke-[1.5] text-muted-foreground" />
                  </button>
                </div>
                <CopyableLink url={link.url} />
              </Card>
            )
          })}
        </div>
      </section>

      {/* Supports */}
      <section>
        <SectionTitle>Supports de vente</SectionTitle>
        <Card className="divide-y divide-border p-0">
          {supports.map((s) => {
            const Icon = s.icon
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toast.info(`Ouvrir ${s.label}`)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-muted"
              >
                <Icon className={cn('size-5 shrink-0 stroke-[1.5]', s.color)} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.type}</p>
                </div>
                <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
              </button>
            )
          })}
        </Card>
      </section>

      {/* Bot prospect */}
      <section>
        <SectionTitle>Bot de prospection</SectionTitle>
        <div className="flex flex-col gap-2">
          {botLinks.map((bot) => (
            <Card key={bot.id} className="flex items-center gap-3 p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                <Bot className="size-5 stroke-[1.5] text-muted-foreground" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground">{bot.platform}</p>
                <p className="text-xs text-muted-foreground">{bot.desc}</p>
              </div>
              <span className={cn(
                'rounded-full px-2.5 py-1 text-[11px] font-bold',
                bot.active
                  ? 'bg-success/15 text-success'
                  : 'bg-muted text-muted-foreground'
              )}>
                {bot.active ? 'Actif' : 'Inactif'}
              </span>
            </Card>
          ))}
          <button
            type="button"
            onClick={() => toast.info('Configurer le bot')}
            className="rounded-2xl border border-dashed border-border py-3 text-sm font-semibold text-muted-foreground transition-colors active:bg-muted"
          >
            + Configurer un nouveau bot
          </button>
        </div>
      </section>
    </div>
  )
}

export default function ToolboxPage() {
  return (
    <>
      {/* ── MOBILE ONLY ── */}
      <div className="lg:hidden">
        <AppHeader title="Boîte à outils" back />
        <div className="px-4 pt-4 pb-8">
          <ToolboxContent />
        </div>
      </div>

      {/* ── DESKTOP ONLY ── */}
      <div className="hidden lg:block">
        <div className="px-8 pt-8 pb-8 max-w-2xl mx-auto">
          <ToolboxContent />
        </div>
      </div>
    </>
  )
}
