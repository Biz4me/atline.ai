"use client"

import { useState, useRef } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { useUser } from "@/hooks/use-user"
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react"

const AGENTS = [
  { value: "atlas",    label: "Atlas — Techniques MLM" },
  { value: "markline", label: "Markline — Marketing" },
  { value: "proline",  label: "Proline — Plans de comp" },
]

const DOC_TYPES = [
  { value: "livre",      label: "Livre" },
  { value: "formation",  label: "Formation" },
  { value: "script",     label: "Script de vente" },
  { value: "plan_comp",  label: "Plan de compensation" },
  { value: "technique",  label: "Technique" },
  { value: "autre",      label: "Autre" },
]

const LANGUAGES = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
]

const ACCEPTED = ".pdf,.docx,.doc,.txt,.md,.html,.htm,.xlsx,.xls"

interface IngestResult {
  status: string
  chunks: number
  points_inserted: number
  agent: string
}

export default function AdminPage() {
  const { user, loading } = useUser()
  const [file, setFile] = useState<File | null>(null)
  const [agent, setAgent] = useState("atlas")
  const [docType, setDocType] = useState("livre")
  const [title, setTitle] = useState("")
  const [language, setLanguage] = useState("fr")
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<IngestResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (loading) return null
  if (!(user as any)?.isAdmin) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <XCircle className="h-10 w-10 text-red-400" />
          <p className="mt-4 font-semibold text-white">Accès refusé</p>
          <p className="mt-1 text-sm text-muted-foreground">Cette page est réservée aux administrateurs.</p>
        </div>
      </DashboardShell>
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    if (f && !title) setTitle(f.name.replace(/\.[^.]+$/, ""))
    setResult(null)
    setError(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0] ?? null
    setFile(f)
    if (f && !title) setTitle(f.name.replace(/\.[^.]+$/, ""))
    setResult(null)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !user?.id) return

    setIsUploading(true)
    setResult(null)
    setError(null)

    const form = new FormData()
    form.append("file", file)
    form.append("agent", agent)
    form.append("doc_type", docType)
    form.append("title", title || file.name)
    form.append("language", language)
    form.append("uploaded_by", user.id)

    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "x-user-id": user.id },
        body: form,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Erreur inconnue")
      setResult(json)
      setFile(null)
      setTitle("")
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <DashboardShell>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="font-heading text-xl font-semibold text-white">Administration — Documents RAG</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload un document pour l&apos;indexer dans la base de connaissances d&apos;un agent.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/20 bg-card p-10 transition-colors hover:border-primary/60 hover:bg-primary/5"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <>
                <FileText className="h-8 w-8 text-primary" />
                <p className="font-medium text-white">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Glisse un fichier ici ou <span className="text-primary">clique pour sélectionner</span>
                </p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, TXT, MD, HTML, XLSX</p>
              </>
            )}
          </div>

          {/* Metadata */}
          <div className="rounded-xl border border-white/[0.08] bg-card p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Agent cible */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Agent cible</label>
                <select
                  value={agent}
                  onChange={(e) => setAgent(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  {AGENTS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>

              {/* Type de document */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Type de document</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  {DOC_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>

              {/* Titre */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Titre</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre du document"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* Langue */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Langue</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!file || isUploading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Traitement en cours…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Indexer le document
              </>
            )}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <CheckCircle className="h-5 w-5 shrink-0 text-green-400 mt-0.5" />
            <div>
              <p className="font-medium text-green-300">Document indexé avec succès</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {result.points_inserted} chunks insérés dans Qdrant pour l&apos;agent <span className="text-white">{result.agent}</span>.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <XCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
            <div>
              <p className="font-medium text-red-300">Erreur</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
