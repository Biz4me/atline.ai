"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { useUser } from "@/hooks/use-user"
import { Upload, FileText, CheckCircle, XCircle, Loader2, Trash2, RefreshCw, Tag, X } from "lucide-react"
import { cn } from "@/lib/utils"

const AGENTS = [
  { value: "atlas",    label: "Atlas" },
  { value: "markline", label: "Markline" },
  { value: "proline",  label: "Proline" },
]

const DOC_TYPES = [
  { value: "livre",      label: "Livre" },
  { value: "formation",  label: "Formation" },
  { value: "script",     label: "Script de vente" },
  { value: "plan_comp",  label: "Plan de comp" },
  { value: "technique",  label: "Technique" },
  { value: "autre",      label: "Autre" },
]

const LANGUAGES = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
]

const ACCEPTED = ".pdf,.docx,.doc,.txt,.md,.html,.htm,.xlsx,.xls"

const FORMAT_COLORS: Record<string, string> = {
  pdf:  "bg-red-500/15 text-red-400",
  docx: "bg-blue-500/15 text-blue-400",
  doc:  "bg-blue-500/15 text-blue-400",
  txt:  "bg-zinc-500/15 text-zinc-400",
  md:   "bg-purple-500/15 text-purple-400",
  html: "bg-orange-500/15 text-orange-400",
  htm:  "bg-orange-500/15 text-orange-400",
  xlsx: "bg-green-500/15 text-green-400",
  xls:  "bg-green-500/15 text-green-400",
}

const AGENT_COLORS: Record<string, string> = {
  atlas:    "bg-primary/15 text-primary",
  markline: "bg-amber-500/15 text-amber-400",
  proline:  "bg-cyan-500/15 text-cyan-400",
}

interface IngestResult {
  status: string
  chunks: number
  points_inserted: number
  agent: string
}

interface RagTag {
  id: string | number
  name: string
}

interface RagDoc {
  id: string
  title: string
  fileName: string
  agent: string
  docType: string
  language: string
  status: string
  chunksCount: number
  theme?: RagTag | null
  createdAt: string
}

function getExt(fileName: string): string {
  return (fileName?.split(".").pop() ?? "").toLowerCase()
}

// ── Autocomplete thème ──
function ThemeAutocomplete({
  userId,
  allTags,
  value,
  onChange,
  onTagsChange,
}: {
  userId: string
  allTags: RagTag[]
  value: RagTag | null
  onChange: (tag: RagTag | null) => void
  onTagsChange: (tags: RagTag[]) => void
}) {
  const [input, setInput] = useState("")
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [])

  const filtered = input.trim()
    ? allTags.filter((t) => t.name.toLowerCase().includes(input.toLowerCase()))
    : allTags

  const canCreate = input.trim() && !allTags.some((t) => t.name.toLowerCase() === input.toLowerCase())

  const selectTag = (tag: RagTag) => {
    onChange(tag)
    setInput("")
    setOpen(false)
  }

  const createTag = async () => {
    const name = input.trim()
    if (!name) return
    const res = await fetch("/api/rag-tags", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-id": userId },
      body: JSON.stringify({ name }),
    })
    const data = await res.json()
    if (data.tag) {
      onTagsChange([...allTags, data.tag].sort((a, b) => a.name.localeCompare(b.name)))
      selectTag(data.tag)
    }
  }

  if (value) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
        <Tag className="h-3.5 w-3.5 text-primary flex-shrink-0" />
        <span className="flex-1 text-sm text-foreground">{value.name}</span>
        <button onClick={() => onChange(null)} className="text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        value={input}
        onChange={(e) => { setInput(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder="Rechercher ou créer un thème…"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
      {open && (filtered.length > 0 || canCreate) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
          {filtered.map((tag) => (
            <button
              key={tag.id}
              onMouseDown={() => selectTag(tag)}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition"
            >
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              {tag.name}
            </button>
          ))}
          {canCreate && (
            <button
              onMouseDown={createTag}
              className="flex w-full items-center gap-2 border-t border-border px-3 py-2 text-sm text-primary hover:bg-muted transition"
            >
              <Tag className="h-3.5 w-3.5" />
              Créer &ldquo;{input.trim()}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  const { user, loading } = useUser()

  // ── Upload state ──
  const [file, setFile] = useState<File | null>(null)
  const [agent, setAgent] = useState("atlas")
  const [docType, setDocType] = useState("livre")
  const [title, setTitle] = useState("")
  const [language, setLanguage] = useState("fr")
  const [theme, setTheme] = useState<RagTag | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<IngestResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Tags ──
  const [allTags, setAllTags] = useState<RagTag[]>([])

  // ── Documents list state ──
  const [docs, setDocs] = useState<RagDoc[]>([])
  const [docsLoading, setDocsLoading] = useState(false)
  const [filterAgent, setFilterAgent] = useState("")
  const [filterDocType, setFilterDocType] = useState("")
  const [filterTheme, setFilterTheme] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchTags = useCallback(async () => {
    if (!user?.id) return
    const res = await fetch("/api/rag-tags", { headers: { "x-user-id": user.id } })
    if (!res.ok) return
    const data = await res.json()
    setAllTags(data.tags ?? [])
  }, [user?.id])

  const fetchDocs = useCallback(async () => {
    if (!user?.id) return
    setDocsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterAgent)   params.set("agent", filterAgent)
      if (filterDocType) params.set("docType", filterDocType)
      if (filterTheme)   params.set("themeId", filterTheme)
      const res = await fetch(`/api/rag-documents?${params}`, {
        headers: { "x-user-id": user.id },
      })
      const data = await res.json()
      if (!res.ok) { console.error("rag-documents error:", data); return }
      setDocs(data.docs ?? [])
    } finally {
      setDocsLoading(false)
    }
  }, [user?.id, filterAgent, filterDocType, filterTheme])

  useEffect(() => { fetchTags() }, [fetchTags])
  useEffect(() => { fetchDocs() }, [fetchDocs])

  const handleDelete = async (id: string) => {
    if (!user?.id) return
    setDeletingId(id)
    try {
      await fetch(`/api/rag-documents?id=${id}`, {
        method: "DELETE",
        headers: { "x-user-id": user.id },
      })
      setDocs((prev) => prev.filter((d) => d.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

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
    if (theme) form.append("theme_id", String(theme.id))

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
      setTheme(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      fetchDocs()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="font-heading text-xl font-semibold text-white">Administration — Documents RAG</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Indexe des documents dans la base de connaissances et consulte la bibliothèque.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* ── Colonne gauche : Upload ── */}
        <div className="flex flex-col gap-4">
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

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Thème</label>
                  <ThemeAutocomplete
                    userId={user!.id}
                    allTags={allTags}
                    value={theme}
                    onChange={setTheme}
                    onTagsChange={setAllTags}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!file || isUploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Traitement en cours…</>
              ) : (
                <><Upload className="h-4 w-4" />Indexer le document</>
              )}
            </button>
          </form>

          {result && (
            <div className="flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <CheckCircle className="h-5 w-5 shrink-0 text-green-400 mt-0.5" />
              <div>
                <p className="font-medium text-green-300">Document indexé avec succès</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {result.points_inserted} chunks insérés pour l&apos;agent <span className="text-white">{result.agent}</span>.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <XCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
              <div>
                <p className="font-medium text-red-300">Erreur</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Colonne droite : Bibliothèque ── */}
        <div className="flex flex-col gap-4">
          {/* Header + filtres */}
          <div className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Bibliothèque RAG
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    {docs.reduce((sum, d) => sum + (d.chunksCount ?? 0), 0).toLocaleString()} chunks
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{docs.length} document{docs.length !== 1 ? "s" : ""}</p>
              </div>
              <button
                onClick={fetchDocs}
                disabled={docsLoading}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition disabled:opacity-50"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", docsLoading && "animate-spin")} />
                Actualiser
              </button>
            </div>

            {/* Filtres */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filterAgent}
                onChange={(e) => setFilterAgent(e.target.value)}
                className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Tous les agents</option>
                {AGENTS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>

              <select
                value={filterDocType}
                onChange={(e) => setFilterDocType(e.target.value)}
                className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Tous les types</option>
                {DOC_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>

              <select
                value={filterTheme}
                onChange={(e) => setFilterTheme(e.target.value)}
                className="col-span-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Tous les thèmes</option>
                {allTags.map((t) => <option key={t.id} value={String(t.id)}>{t.name}</option>)}
              </select>
            </div>
          </div>

          {/* Liste */}
          <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 340px)" }}>
            {docsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : docs.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-12 text-center">
                <FileText className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Aucun document trouvé</p>
              </div>
            ) : (
              docs.map((doc) => {
                const ext = getExt(doc.fileName)
                return (
                  <div
                    key={doc.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-white/[0.06] bg-card px-4 py-3 hover:border-white/[0.12] transition"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{doc.title}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{doc.fileName}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          AGENT_COLORS[doc.agent] ?? "bg-white/10 text-white"
                        )}>
                          {doc.agent}
                        </span>
                        {ext && (
                          <span className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                            FORMAT_COLORS[ext] ?? "bg-white/10 text-white"
                          )}>
                            {ext}
                          </span>
                        )}
                        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-muted-foreground">
                          {DOC_TYPES.find((d) => d.value === doc.docType)?.label ?? doc.docType}
                        </span>
                        {doc.theme && (
                          <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                            <Tag className="h-2.5 w-2.5" />
                            {doc.theme.name}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground/60">
                          {doc.chunksCount} chunks
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(doc.id)}
                      disabled={deletingId === doc.id}
                      className="mt-0.5 flex-shrink-0 rounded-md p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-40"
                    >
                      {deletingId === doc.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Trash2 className="h-3.5 w-3.5" />
                      }
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </DashboardShell>
  )
}
