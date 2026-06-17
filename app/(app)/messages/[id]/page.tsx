'use client'

import { use, useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Send, Mic, Sparkles, Phone, Video } from 'lucide-react'
import { DiscAvatar } from '@/components/disc-avatar'
import { contacts } from '@/lib/data'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type Msg = { id: string; from: 'me' | 'them'; text: string; time: string }

const mockMessages: Record<string, Msg[]> = {
  c1: [
    { id: '1', from: 'them', text: 'Salut ! J\'ai vu ta story hier, c\'est exactement ce que je cherche.', time: '14:10' },
    { id: '2', from: 'me', text: 'Super Thomas ! Qu\'est-ce qui t\'a le plus intéressé ?', time: '14:12' },
    { id: '3', from: 'them', text: 'Le côté liberté financière. J\'en ai marre de mon boulot actuel.', time: '14:15' },
    { id: '4', from: 'me', text: 'Je comprends totalement. On pourrait se faire un appel de 20 min pour que je t\'explique tout ça ?', time: '14:18' },
    { id: '5', from: 'them', text: 'Oui je suis disponible vendredi matin, ça marche pour moi !', time: '14:20' },
  ],
  c7: [
    { id: '1', from: 'them', text: 'Hey ! Ton vocal de ce matin m\'a trop motivée !', time: '12:30' },
    { id: '2', from: 'me', text: 'Trop contente ! Tu veux qu\'on échange sur comment ça marche ?', time: '12:35' },
    { id: '3', from: 'them', text: 'Énergie incroyable dans ton dernier vocal. Je suis partante pour en savoir plus !', time: '12:40' },
  ],
}

const atlasHints: Record<string, string> = {
  c1: 'Thomas est D — direct et orienté résultats. Propose un RDV court et chiffré.',
  c7: 'Nadia est I — enthousiaste. Parle de la communauté et du style de vie avant les chiffres.',
}

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const contact = contacts.find((c) => c.id === id)
  const [messages, setMessages] = useState<Msg[]>(mockMessages[id] ?? [])
  const [input, setInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!contact) return null

  const handleSend = () => {
    if (!input.trim()) return
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), from: 'me', text: input, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) },
    ])
    setInput('')
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur">
        <button type="button" onClick={() => router.back()} className="-ml-1 flex size-9 items-center justify-center rounded-full text-fg-2 active:bg-muted">
          <ChevronLeft className="size-5 stroke-[1.5]" />
        </button>
        <Link href={`/contacts/${contact.id}`} className="flex flex-1 items-center gap-3 min-w-0">
          <DiscAvatar firstName={contact.firstName} lastName={contact.lastName} disc={contact.disc} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground">{contact.firstName} {contact.lastName}</p>
            <p className="text-xs text-muted-foreground capitalize">{contact.stage}</p>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <button type="button" className="flex size-9 items-center justify-center rounded-full text-fg-2 active:bg-muted">
            <Phone className="size-5 stroke-[1.5]" />
          </button>
          <button type="button" className="flex size-9 items-center justify-center rounded-full text-fg-2 active:bg-muted">
            <Video className="size-5 stroke-[1.5]" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-2">
          {messages.map((msg) => (
            <div key={msg.id} className={cn('flex', msg.from === 'me' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-[80%] rounded-2xl px-3.5 py-2.5',
                msg.from === 'me'
                  ? 'rounded-br-sm bg-primary text-primary-foreground'
                  : 'rounded-bl-sm bg-surface shadow-card text-foreground'
              )}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={cn('mt-1 text-right text-[10px]', msg.from === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Atlas hint */}
      {showHint && atlasHints[id] && (
        <div className="mx-4 mb-2 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-xs font-bold">A</span>
          <p className="flex-1 text-xs text-foreground">{atlasHints[id]}</p>
          <button type="button" onClick={() => setShowHint(false)} className="text-xs text-muted-foreground">✕</button>
        </div>
      )}

      {/* Compose */}
      <div className="border-t border-border bg-surface/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            className={cn('flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors', showHint ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-muted-foreground')}
          >
            <Sparkles className="size-4 stroke-[1.5]" />
          </button>
          <div className="flex flex-1 items-end gap-2 rounded-2xl border border-border bg-muted px-3 py-2.5">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
              }}
              placeholder="Message…"
              className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              style={{ maxHeight: 120 }}
            />
          </div>
          {input.trim() ? (
            <button
              type="button"
              onClick={handleSend}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground active:scale-95 transition-transform"
            >
              <Send className="size-4 stroke-2" />
            </button>
          ) : (
            <button type="button" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground">
              <Mic className="size-4 stroke-[1.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
