"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { TabsNav } from "@/components/reseau/tabs-nav"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"
import {
  IconUpload,
  IconFile,
  IconCheck,
  IconX,
  IconLoader2,
  IconSparkles,
  IconBroadcast,
  IconChartBar,
  IconDeviceFloppy,
} from "@tabler/icons-react"

// ─── Constants ───────────────────────────────────────────────────

const AGENTS = [
  { value: "atlas",    label: "Atlas — Techniques MLM" },
  { value: "markline", label: "Markline — Marketing" },
  { value: "proline",  label: "Proline — Plans de comp" },
]

const DOC_TYPES = [
  { value: "livre",     label: "Livre" },
  { value: "formation", label: "Formation" },
  { value: "script",    label: "Script de vente" },
  { value: "plan_comp", label: "Plan de compensation" },
  { value: "technique", label: "Technique" },
  { value: "autre",     label: "Autre" },
]

const LANGUAGES = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
]

const ACCEPTED = ".pdf,.docx,.doc,.txt,.md,.html,.htm,.xlsx,.xls"

const AGENT_META = {
  atlas:    { label: "Atlas",    icon: IconSparkles,  color: "#7C6FE8", bg: "rgba(124,111,232,0.15)" },
  markline: { label: "Markline", icon: IconBroadcast, color: "#06B6D4", bg: "rgba(6,182,212,0.15)"   },
  proline:  { label: "Proline",  icon: IconChartBar,  color: "#10B981", bg: "rgba(16,185,129,0.15)"  },
}

const DOC_TYPE_LABELS: Record<string, string> = {
  livre:     "Livre",
  formation: "Formation",
  script:    "Script",
  plan_comp: "Plan de comp",
  technique: "Technique",
  autre:     "Autre",
}

// ─── Types ───────────────────────────────────────────────────────

interface RagDoc {
  id: string
  title: string
  fileName?: string
  agent: string
  docType: string
  language?: string
  status: string
  chunksCount?: number
  createdAt: string
}

interface AgentConfig {
  systemPrompt: string
  temperature: number
  maxTokens: number
}

type AgentKey = "atlas" | "markline" | "proline"

// ─── Tab: Enrichir ───────────────────────────────────────────────

function EnrichirTab({ userId }: { userId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [agent, setAgent] = useState("atlas")
  const [docType, setDocType] = useState("livre")
  const [title, setTitle] = useState("")
  const [language, setLanguage] = useState("fr")
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{ points_inserted: number; agent: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

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
    if (!file) return
    setUploading(true)
    setResult(null)
    setError(null)

    const form = new FormData()
    form.append("file", file)
    form.append("agent", agent)
    form.append("doc_type", docType)
    form.append("title", title || file.name)
    form.append("language", language)

    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "x-user-id": userId },
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
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-card p-10 transition-colors hover:border-primary/60 hover:bg-primary/5"
      >
        <input ref={fileInputRef} type="file" accept={ACCEPTED} onChange={handleFileChange} className="hidden" />
        {file ? (
          <>
            <IconFile className="h-8 w-8 text-primary" />
            <p className="font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </>
        ) : (
          <>
            <IconUpload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Glisse un fichier ici ou <span className="text-primary">clique pour sélectionner</span>
            </p>
            <p className="text-xs text-muted-foreground">PDF, DOCX, TXT, MD, HTML, XLSX</p>
          </>
        )}
      </div>

      {/* Metadata */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Agent cible</label>
            <select value={agent} onChange={(e) => setAgent(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
              {AGENTS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Type de document</label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
              {DOC_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">Titre</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du document"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Langue</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
              {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <button type="submit" disabled={!file || uploading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
        {uploading ? <><IconLoader2 className="h-4 w-4 animate-spin" /> Traitement en cours…</> : <><IconUpload className="h-4 w-4" /> Indexer le document</>}
      </button>

      {result && (
        <div className="flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
          <div>
            <p className="font-medium text-green-300">Document indexé avec succès</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {result.points_inserted} chunks insérés pour l'agent <span className="text-foreground">{result.agent}</span>.
            </p>
          </div>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <IconX className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          <div>
            <p className="font-medium text-red-300">Erreur</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      )}
    </form>
  )
}

// ─── Tab: Bibliothèque RAG ────────────────────────────────────────

function BibliothèqueTab() {
  const [docs, setDocs] = useState<RagDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/rag-documents?limit=200&sort=-createdAt")
      .then((r) => r.json())
      .then((data) => {
        setDocs(data.docs ?? [])
        setLoading(false)
      })
      .catch(() => {
        setError("Impossible de charger les documents")
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="flex items-center gap-2 py-12 text-muted-foreground">
      <IconLoader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">Chargement…</span>
    </div>
  )

  if (error) return <p className="py-8 text-sm text-red-400">{error}</p>

  if (docs.length === 0) return (
    <div className="py-16 text-center text-sm text-muted-foreground">
      Aucun document indexé pour l'instant.
    </div>
  )

  // Group by agent → docType
  const grouped: Record<string, Record<string, RagDoc[]>> = {}
  for (const doc of docs) {
    if (!grouped[doc.agent]) grouped[doc.agent] = {}
    if (!grouped[doc.agent][doc.docType]) grouped[doc.agent][doc.docType] = []
    grouped[doc.agent][doc.docType].push(doc)
  }

  return (
    <div className="space-y-8">
      {(["atlas", "markline", "proline"] as AgentKey[]).map((agentKey) => {
        const group = grouped[agentKey]
        if (!group) return null
        const meta = AGENT_META[agentKey]
        const Icon = meta.icon
        const totalDocs = Object.values(group).flat().length

        return (
          <div key={agentKey}>
            {/* Agent header */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: meta.bg }}>
                <Icon className="h-5 w-5" style={{ color: meta.color }} />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{meta.label}</h2>
                <p className="text-xs text-muted-foreground">{totalDocs} document{totalDocs > 1 ? "s" : ""}</p>
              </div>
            </div>

            {/* DocType groups */}
            <div className="space-y-4 pl-12">
              {Object.entries(group).map(([docType, typeDocs]) => (
                <div key={docType}>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {DOC_TYPE_LABELS[docType] ?? docType}
                  </p>
                  <div className="space-y-2">
                    {typeDocs.map((doc) => (
                      <div key={doc.id}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                        <IconFile className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{doc.title}</p>
                          {doc.fileName && doc.fileName !== doc.title && (
                            <p className="truncate text-xs text-muted-foreground">{doc.fileName}</p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          {doc.chunksCount != null && (
                            <span className="text-xs text-muted-foreground">{doc.chunksCount} chunks</span>
                          )}
                          <span className={cn(
                            "rounded-[4px] px-1.5 py-0.5 text-[10px] font-medium",
                            doc.status === "indexed" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                          )}>
                            {doc.status === "indexed" ? "Indexé" : "Erreur"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Tab: Configuration ───────────────────────────────────────────

const CONFIG_AGENTS: { key: AgentKey; label: string; icon: typeof IconSparkles; color: string }[] = [
  { key: "atlas",    label: "Atlas",    icon: IconSparkles,  color: "#7C6FE8" },
  { key: "markline", label: "Markline", icon: IconBroadcast, color: "#06B6D4" },
  { key: "proline",  label: "Proline",  icon: IconChartBar,  color: "#10B981" },
]

function ConfigurationTab() {
  const [configs, setConfigs] = useState<Record<AgentKey, AgentConfig>>({
    atlas:    { systemPrompt: "", temperature: 0.7, maxTokens: 2048 },
    markline: { systemPrompt: "", temperature: 0.7, maxTokens: 2048 },
    proline:  { systemPrompt: "", temperature: 0.7, maxTokens: 2048 },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<AgentKey | null>(null)
  const [saved, setSaved] = useState<AgentKey | null>(null)

  useEffect(() => {
    Promise.all(
      (["atlas", "markline", "proline"] as AgentKey[]).map((key) =>
        fetch(`/api/globals/${key}-config`).then((r) => r.json())
      )
    ).then(([atlas, markline, proline]) => {
      setConfigs({
        atlas:    { systemPrompt: atlas.systemPrompt ?? "", temperature: atlas.temperature ?? 0.7, maxTokens: atlas.maxTokens ?? 2048 },
        markline: { systemPrompt: markline.systemPrompt ?? "", temperature: markline.temperature ?? 0.7, maxTokens: markline.maxTokens ?? 2048 },
        proline:  { systemPrompt: proline.systemPrompt ?? "", temperature: proline.temperature ?? 0.7, maxTokens: proline.maxTokens ?? 2048 },
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSave = async (key: AgentKey) => {
    setSaving(key)
    try {
      await fetch(`/api/globals/${key}-config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configs[key]),
      })
      setSaved(key)
      setTimeout(() => setSaved(null), 2000)
    } finally {
      setSaving(null)
    }
  }

  const update = (key: AgentKey, field: keyof AgentConfig, value: string | number) => {
    setConfigs((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }))
  }

  if (loading) return (
    <div className="flex items-center gap-2 py-12 text-muted-foreground">
      <IconLoader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">Chargement des configurations…</span>
    </div>
  )

  return (
    <div className="max-w-2xl space-y-6">
      {CONFIG_AGENTS.map(({ key, label, icon: Icon, color }) => (
        <div key={key} className="rounded-xl border border-border bg-card">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5" style={{ color }} />
              <span className="font-semibold text-foreground">{label}</span>
            </div>
            <button
              onClick={() => handleSave(key)}
              disabled={saving === key}
              className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
            >
              {saving === key ? (
                <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
              ) : saved === key ? (
                <IconCheck className="h-3.5 w-3.5" />
              ) : (
                <IconDeviceFloppy className="h-3.5 w-3.5" />
              )}
              {saved === key ? "Sauvegardé" : "Sauvegarder"}
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-4 p-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">System Prompt</label>
              <textarea
                value={configs[key].systemPrompt}
                onChange={(e) => update(key, "systemPrompt", e.target.value)}
                rows={6}
                placeholder={`Tu es ${label}, un assistant IA spécialisé…`}
                className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Température (0–1)</label>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  value={configs[key].temperature}
                  onChange={(e) => update(key, "temperature", parseFloat(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Max tokens</label>
                <input
                  type="number"
                  min={256}
                  max={8192}
                  step={256}
                  value={configs[key].maxTokens}
                  onChange={(e) => update(key, "maxTokens", parseInt(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export default function EnrichirAtlasPage() {
  const { user, loading } = useUser()
  const isAdmin = !!(user as any)?.isAdmin
  const allTabs = ["Enrichir", ...(isAdmin ? ["Bibliothèque RAG", "Configuration"] : [])]
  const [activeTab, setActiveTab] = useState("Enrichir")

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-xl font-semibold text-foreground">Enrichir Atlas</h1>
        <p className="mt-1 text-sm text-muted-foreground">Donne plus de connaissances à tes agents IA</p>
      </div>

      <TabsNav tabs={allTabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center gap-2 py-12 text-muted-foreground">
            <IconLoader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Chargement…</span>
          </div>
        ) : (
          <>
            {activeTab === "Enrichir" && <EnrichirTab userId={user?.id ?? ""} />}
            {activeTab === "Bibliothèque RAG" && isAdmin && <BibliothèqueTab />}
            {activeTab === "Configuration" && isAdmin && <ConfigurationTab />}
          </>
        )}
      </div>
    </div>
  )
}
