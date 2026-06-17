'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { toast } from 'sonner'

const stages = [
  { id: 'nouveau', label: 'Nouveau' },
  { id: 'chaud', label: 'Chaud' },
  { id: 'prospect', label: 'Prospect' },
  { id: 'client', label: 'Client' },
]

export function AddContactSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [name, setName] = useState('')
  const [stage, setStage] = useState('nouveau')

  function submit() {
    if (!name.trim()) {
      toast.error('Ajoute au moins un nom')
      return
    }
    toast.success(`${name} ajouté à ton CRM`)
    setName('')
    setStage('nouveau')
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-w-[480px] rounded-t-3xl">
        <SheetHeader className="text-left">
          <SheetTitle className="font-display text-lg">Nouveau contact</SheetTitle>
          <SheetDescription>Ajoute-le à ton CRM en quelques secondes.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 pb-8">
          <div className="flex flex-col gap-1.5">
            <label className="eyebrow" htmlFor="contact-name">
              Nom complet
            </label>
            <input
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex. Marie Dupont"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="eyebrow">Étape</span>
            <div className="flex flex-wrap gap-2">
              {stages.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStage(s.id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    stage === s.id
                      ? 'bg-primary/10 text-primary'
                      : 'border border-border bg-surface text-fg-2'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={submit}
            className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            Ajouter au CRM
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
