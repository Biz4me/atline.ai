"use client"

import { IconUserPlus, IconSparkles } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Lead {
  id: string
  name: string
  action: string
  score: number
}

const detectedLeads: Lead[] = [
  { id: "1", name: "Sophie M.", action: "A liké 3 posts produits", score: 7 },
  { id: "2", name: "Marc D.", action: "A commenté \"combien ça coûte?\"", score: 9 },
  { id: "3", name: "Julie T.", action: "Suit ton compte depuis 2 semaines", score: 5 },
]

export function LeadsTab() {
  return (
    <div className="space-y-6">
      {/* Section header */}
      <p className="text-sm text-muted-foreground">
        Détectés automatiquement via tes publications
      </p>

      {/* Lead cards */}
      <div className="space-y-3">
        {detectedLeads.map((lead) => (
          <Card key={lead.id} className="border-l-2 border-l-accent p-3">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-medium text-accent">
                {lead.name.split(" ").map(n => n[0]).join("")}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{lead.name}</span>
                  <span className="rounded-[4px] bg-accent px-1.5 py-0.5 font-mono text-xs font-medium text-white">
                    {lead.score}/10
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{lead.action}</p>
              </div>

              {/* Action */}
              <Button size="sm" variant="outline" className="shrink-0 gap-1.5">
                <IconUserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Ajouter</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Atlas suggestion */}
      <Card className="border-l-2 border-l-primary p-4">
        <div className="mb-3 flex items-start gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
            <IconSparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Suggestion Atlas</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Marc a demandé le prix — c&apos;est le bon moment pour le contacter.
            </p>
            <p className="mt-2 rounded-lg bg-background p-2 text-sm italic text-muted-foreground">
              Script suggéré: &quot;Marc, je t&apos;envoie les infos en privé...&quot;
            </p>
          </div>
        </div>
        <Button className="w-full">Simuler avec Marc</Button>
      </Card>
    </div>
  )
}
