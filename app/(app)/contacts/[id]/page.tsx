'use client'

import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { DiscAvatar } from '@/components/disc-avatar'
import { StagePill, DiscBadge } from '@/components/pills'
import { Card } from '@/components/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { contacts } from '@/lib/data'
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  PhoneCall,
  StickyNote,
  CalendarPlus,
  Link2,
  Package,
  CalendarClock,
} from 'lucide-react'
import { toast } from 'sonner'

const timelineIcons = {
  message: MessageSquare,
  call: PhoneCall,
  note: StickyNote,
  stage: CalendarClock,
  meeting: CalendarPlus,
}

export default function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const contact = contacts.find((c) => c.id === id)
  if (!contact) notFound()

  const [inCrm, setInCrm] = useState(contact.inCrm)

  return (
    <>
      <AppHeader title="Fiche contact" back showActions={false} />

      <div className="flex flex-col gap-5 px-4 pt-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <DiscAvatar
            firstName={contact.firstName}
            lastName={contact.lastName}
            disc={contact.disc}
            size="xl"
          />
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              {contact.firstName} {contact.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">Source : {contact.source}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <StagePill stage={contact.stage} />
            {contact.disc && <DiscBadge disc={contact.disc} />}
          </div>

          {!inCrm && (
            <button
              type="button"
              onClick={() => {
                setInCrm(true)
                toast.success('Ajouté à ton CRM')
              }}
              className="mt-1 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
            >
              Ajouter au CRM
            </button>
          )}
        </div>

        <Tabs defaultValue="infos">
          <TabsList className="grid w-full grid-cols-4 rounded-xl bg-muted p-1">
            <TabsTrigger value="infos">Infos</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="atlas">Atlas</TabsTrigger>
          </TabsList>

          {/* Infos */}
          <TabsContent value="infos" className="mt-4">
            <Card className="divide-y divide-border">
              <InfoRow icon={Phone} label="Téléphone" value={contact.phone ?? 'Non renseigné'} />
              <InfoRow icon={Mail} label="Email" value={contact.email ?? 'Non renseigné'} />
              <InfoRow icon={MapPin} label="Ville" value={contact.city ?? 'Non renseignée'} />
            </Card>
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline" className="mt-4">
            {contact.timeline.length === 0 ? (
              <EmptyBlock text="Aucune interaction pour le moment." />
            ) : (
              <ol className="relative flex flex-col gap-4 pl-2">
                {contact.timeline.map((ev) => {
                  const Icon = timelineIcons[ev.type]
                  return (
                    <li key={ev.id} className="flex gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <Icon className="size-4 stroke-[1.5]" />
                      </span>
                      <div className="flex-1 pt-0.5">
                        <p className="text-sm font-semibold text-foreground">{ev.label}</p>
                        <p className="text-xs text-muted-foreground">{ev.date}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            )}
          </TabsContent>

          {/* Notes */}
          <TabsContent value="notes" className="mt-4">
            {contact.notes ? (
              <Card className="p-4">
                <p className="text-sm leading-relaxed text-fg-2">{contact.notes}</p>
              </Card>
            ) : (
              <EmptyBlock text="Aucune note. Ajoute un contexte pour mieux le suivre." />
            )}
          </TabsContent>

          {/* Atlas */}
          <TabsContent value="atlas" className="mt-4">
            <div className="flex flex-col gap-2">
              <p className="px-1 text-sm text-muted-foreground text-pretty">
                Atlas te suggère la prochaine action selon le profil
                {contact.disc ? ` ${contact.disc}` : ''} de {contact.firstName}.
              </p>
              <AtlasAction
                icon={Link2}
                title="Envoyer le lien opportunité"
                desc="Présente le business avec une page dédiée"
              />
              <AtlasAction
                icon={Package}
                title="Envoyer un lien produit"
                desc="Partage le produit phare adapté à son besoin"
              />
              <AtlasAction
                icon={CalendarPlus}
                title="Proposer un rendez-vous"
                desc="Cale un appel découverte de 15 min"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <Icon className="size-4 stroke-[1.5] text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="ml-auto text-sm font-semibold text-foreground">{value}</span>
    </div>
  )
}

function AtlasAction({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Link2
  title: string
  desc: string
}) {
  return (
    <button
      type="button"
      onClick={() => toast.success(`Atlas : ${title}`)}
      className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3.5 text-left shadow-card transition-colors active:bg-muted"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Icon className="size-5 stroke-[1.5]" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-bold text-foreground">{title}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
    </button>
  )
}

function EmptyBlock({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center">
      <p className="text-sm text-muted-foreground text-pretty">{text}</p>
    </div>
  )
}
