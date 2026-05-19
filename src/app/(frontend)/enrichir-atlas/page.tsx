"use client"

import { useState } from "react"
import { IconUpload, IconFile, IconMusic, IconCheck, IconX, IconLink, IconSparkles } from "@tabler/icons-react"
import { DashboardShell } from "@/components/dashboard/shell"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Upload {
  id: string
  name: string
  type: "formation" | "podcast" | "plan"
  date: string
  status: "integrated"
}

const uploads: Upload[] = [
  { id: "1", name: "Go Pro - Eric Worre.pdf", type: "formation", date: "il y a 2j", status: "integrated" },
  { id: "2", name: "MLM Nation Ep.142.mp3", type: "podcast", date: "il y a 5j", status: "integrated" },
  { id: "3", name: "Plan Herbalife 2026.pdf", type: "plan", date: "hier", status: "integrated" },
]

const typeLabels = {
  formation: { label: "Formation", color: "bg-success/20 text-success" },
  podcast: { label: "Podcast", color: "bg-primary/20 text-primary" },
  plan: { label: "Plan de comp", color: "bg-accent/20 text-accent" },
}

interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        enabled ? "bg-accent" : "bg-border"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
          enabled ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  )
}

export default function EnrichirAtlasPage() {
  const [url, setUrl] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [shareCommunity, setShareCommunity] = useState(false)

  return (
    <DashboardShell>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-xl font-semibold text-white">Enrichir Atlas</h1>
        <p className="text-sm text-muted-foreground">Donne plus de connaissances à ton coach</p>
      </div>

      {/* Upload zone */}
      <div className="mb-6 cursor-pointer rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary/50">
        <IconUpload className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-3 font-medium text-white">Glisse ton fichier ici ou clique pour choisir</p>
        <p className="mt-1 text-xs text-muted-foreground">
          PDF / DOCX / MP3 / MP4 / URL YouTube
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Max 500MB</p>
      </div>

      {/* URL input */}
      <div className="mb-6">
        <p className="mb-2 text-sm text-muted-foreground">Ou colle une URL</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <IconLink className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Colle une URL YouTube ou Loom..."
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <Button onClick={() => setShowPreview(true)} disabled={!url}>
            Analyser
          </Button>
        </div>
      </div>

      {/* Classification preview (mock) */}
      {showPreview && (
        <Card className="mb-6 border-l-2 border-l-primary p-4">
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20">
              <IconMusic className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">Podcast détecté — 47 minutes</p>
              <p className="mt-1 text-sm text-muted-foreground">Transcription en cours...</p>
            </div>
          </div>

          <div className="space-y-2 rounded-lg bg-background p-3">
            <div className="flex items-center gap-2">
              <IconCheck className="h-4 w-4 text-success" />
              <span className="text-sm text-white">Contenu identifié: Techniques closing (3 scripts)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Collection cible:</span>
              <span className="text-white">Atlas Coach</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Score qualité:</span>
              <span className="font-mono text-primary">8/10</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button className="flex-1" onClick={() => setShowPreview(false)}>
              Confirmer
            </Button>
            <Button variant="ghost" className="flex-1" onClick={() => setShowPreview(false)}>
              Annuler
            </Button>
          </div>
        </Card>
      )}

      {/* My uploads */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Mes uploads</h3>
        <div className="space-y-2">
          {uploads.map((upload) => {
            const typeInfo = typeLabels[upload.type]
            return (
              <Card key={upload.id} className="flex items-center gap-3 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card">
                  <IconFile className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{upload.name}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className={cn("rounded-[4px] px-1.5 py-0.5 text-[10px] font-medium", typeInfo.color)}>
                      {typeInfo.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{upload.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-success">
                  <IconCheck className="h-4 w-4" />
                  <span className="text-xs">Intégré</span>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Community section */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white">Proposer à la communauté</p>
            <p className="text-xs text-muted-foreground">Partage tes uploads avec les autres utilisateurs</p>
          </div>
          <Toggle enabled={shareCommunity} onChange={setShareCommunity} />
        </div>
        <button className="mt-3 text-sm text-primary hover:underline">
          3 documents communautaires disponibles →
        </button>
      </Card>
    </DashboardShell>
  )
}
