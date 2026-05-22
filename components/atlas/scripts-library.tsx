"use client"

import { useState } from "react"
import { Copy, Trash2, Check, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useScriptsLibrary } from "@/hooks/use-scripts-library"
import type { SavedScript } from "@/hooks/use-scripts-library"

type Category = SavedScript["category"] | "all"

const CATEGORY_LABELS: Record<SavedScript["category"], string> = {
  invitation: "Invitation",
  objection: "Objection",
  closing: "Closing",
  suivi: "Suivi",
}

const CATEGORY_COLORS: Record<SavedScript["category"], string> = {
  invitation: "text-violet-500 bg-violet-500/10",
  objection: "text-amber-500 bg-amber-500/10",
  closing: "text-emerald-500 bg-emerald-500/10",
  suivi: "text-cyan-500 bg-cyan-500/10",
}

const FILTERS: { value: Category; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "invitation", label: "Invitation" },
  { value: "objection", label: "Objection" },
  { value: "closing", label: "Closing" },
  { value: "suivi", label: "Suivi" },
]

function ScriptCard({ script, onDelete, onIncrementUse }: {
  script: SavedScript
  onDelete: (id: number) => void
  onIncrementUse: (id: number) => void
}) {
  const [copied, setCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(script.content)
    setCopied(true)
    onIncrementUse(script.id)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(script.content)
    window.open(`https://wa.me/?text=${encoded}`, "_blank")
    onIncrementUse(script.id)
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">{script.title}</span>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", CATEGORY_COLORS[script.category])}>
              {CATEGORY_LABELS[script.category]}
            </span>
          </div>
          {script.useCount > 0 && (
            <p className="mt-0.5 text-[10px] text-muted-foreground">Utilisé {script.useCount} fois</p>
          )}
        </div>
        <button
          onClick={() => setConfirmDelete(!confirmDelete)}
          className="shrink-0 text-muted-foreground hover:text-red-400 transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{script.content}</p>

      {confirmDelete && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
          <p className="flex-1 text-xs text-foreground">Supprimer ce script ?</p>
          <button onClick={() => onDelete(script.id)} className="text-xs font-semibold text-red-400 hover:text-red-300">Oui</button>
          <button onClick={() => setConfirmDelete(false)} className="text-xs text-muted-foreground hover:text-foreground">Non</button>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background py-2 text-xs font-medium text-foreground transition hover:bg-muted"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copié !" : "Copier"}
        </button>
        <button
          onClick={handleWhatsApp}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-2 text-xs font-medium text-emerald-500 transition hover:bg-emerald-500/15"
        >
          <Share2 className="h-3.5 w-3.5" />
          WhatsApp
        </button>
      </div>
    </div>
  )
}

interface ScriptsLibraryProps {
  className?: string
}

export function ScriptsLibrary({ className }: ScriptsLibraryProps) {
  const { scripts, loading, deleteScript, incrementUse } = useScriptsLibrary()
  const [filter, setFilter] = useState<Category>("all")

  const filtered = filter === "all"
    ? scripts
    : scripts.filter((s) => s.category === filter)

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Bibliothèque de scripts</h3>
        <span className="text-xs text-muted-foreground">{scripts.length} scripts</span>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              filter === f.value
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center">
          <p className="text-sm text-muted-foreground">
            {scripts.length === 0
              ? "Sauvegarde un script depuis une conversation Atlas — bouton 🔖"
              : "Aucun script dans cette catégorie."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((script) => (
            <ScriptCard
              key={script.id}
              script={script}
              onDelete={deleteScript}
              onIncrementUse={incrementUse}
            />
          ))}
        </div>
      )}
    </div>
  )
}
