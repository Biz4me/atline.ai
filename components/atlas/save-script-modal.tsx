"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Category = "invitation" | "objection" | "closing" | "suivi"

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "invitation", label: "Invitation" },
  { value: "objection", label: "Objection" },
  { value: "closing", label: "Closing" },
  { value: "suivi", label: "Suivi" },
]

interface SaveScriptModalProps {
  content: string
  onClose: () => void
  onSaved: () => void
}

export function SaveScriptModal({ content, onClose, onSaved }: SaveScriptModalProps) {
  const [title, setTitle] = useState(content.slice(0, 60).trim())
  const [category, setCategory] = useState<Category>("invitation")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!title.trim()) { setError("Donne un titre à ce script"); return }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/scripts-library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content, category }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Erreur lors de la sauvegarde")
      }
      onSaved()
    } catch (e: any) {
      setError(e.message)
      setSaving(false)
    }
  }

  return (
    <div className="mt-3 rounded-xl border border-border bg-card p-4 shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Sauvegarder le script</p>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={120}
        placeholder="Titre du script..."
        className="mb-3 h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />

      {/* Category */}
      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              category === cat.value
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {error && <p className="mb-2 text-xs text-red-400">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
      >
        {saving ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <Check className="h-4 w-4" />
        )}
        Sauvegarder
      </button>
    </div>
  )
}
