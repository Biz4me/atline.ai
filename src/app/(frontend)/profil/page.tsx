"use client"

import { useRef, useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { DashboardShell } from "@/components/dashboard/shell"
import { TabsNav } from "@/components/reseau/tabs-nav"
import { IconFileText, IconCheck, IconX, IconCamera, IconPhoto } from "@tabler/icons-react"
import { useUser } from "@/hooks/use-user"
import { ToggleSwitch } from "@/components/ui/toggle-switch"
import { cn } from "@/lib/utils"

const tabs = ["Mon Profil", "Abonnement", "Préférences", "Mes Documents", "Zone Danger"]

const MLM_LEVEL_OPTIONS = [
  { value: "debutant", label: "Débutant" },
  { value: "intermediaire", label: "Intermédiaire" },
  { value: "senior", label: "Senior" },
  { value: "expert", label: "Expert" },
]

const MLM_LEVEL_LABELS: Record<string, string> = Object.fromEntries(
  MLM_LEVEL_OPTIONS.map((o) => [o.value, o.label])
)

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/50"

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState("Mon Profil")
  const [notifSuivi, setNotifSuivi] = useState(true)
  const [notifFilleuls, setNotifFilleuls] = useState(true)
  const [notifResume, setNotifResume] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user, loading, initials, displayName, updateProfile } = useUser()

  // Avatar upload
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const avatarMenuRef = useRef<HTMLDivElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)

  // Close avatar menu on outside click
  useEffect(() => {
    if (!avatarMenuOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target as Node)) {
        setAvatarMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [avatarMenuOpen])

  // Edit mode
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    mlmCompany: "",
    mlmLevel: "",
  })

  const avatarSrc = avatarPreview ?? (user as any)?.avatarUrl ?? null

  function startEditing() {
    setForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phone: (user as any)?.phone ?? "",
      mlmCompany: user?.mlmCompany ?? "",
      mlmLevel: user?.mlmLevel ?? "",
    })
    setFeedback(null)
    setEditing(true)
  }

  function cancelEditing() {
    setEditing(false)
    setFeedback(null)
  }

  async function handleSave() {
    setSaving(true)
    setFeedback(null)
    try {
      await updateProfile(form)
      setEditing(false)
      setFeedback({ type: "success", message: "Profil mis à jour avec succès" })
      setTimeout(() => setFeedback(null), 3000)
    } catch (e: unknown) {
      setFeedback({ type: "error", message: e instanceof Error ? e.message : "Erreur inconnue" })
    } finally {
      setSaving(false)
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarPreview(URL.createObjectURL(file))
    setUploadingAvatar(true)
    setFeedback(null)
    setAvatarMenuOpen(false)

    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/user/avatar", { method: "POST", body: fd })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? "Erreur upload")
      }
      const { url } = await res.json()
      setAvatarPreview(url)
      setFeedback({ type: "success", message: "Photo mise à jour" })
      setTimeout(() => setFeedback(null), 3000)
    } catch (e: unknown) {
      setAvatarPreview(null)
      setFeedback({ type: "error", message: e instanceof Error ? e.message : "Erreur upload" })
    } finally {
      setUploadingAvatar(false)
      if (cameraInputRef.current) cameraInputRef.current.value = ""
      if (galleryInputRef.current) galleryInputRef.current.value = ""
    }
  }

  return (
    <DashboardShell>
      <div>
        <div className="mb-6">
          <h1 className="font-heading text-xl font-semibold text-foreground">Profil</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tes informations et paramètres</p>
        </div>
        <TabsNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "Mon Profil" && (
          <div className="space-y-4">
            {/* Avatar + nom */}
            <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-6">
              {/* Avatar with action menu */}
              <div ref={avatarMenuRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => !uploadingAvatar && setAvatarMenuOpen((v) => !v)}
                  disabled={uploadingAvatar}
                  className="group relative h-16 w-16 overflow-hidden rounded-full bg-primary focus:outline-none"
                >
                  {avatarSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarSrc} alt="Avatar" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xl font-bold text-white">
                      {loading ? "…" : initials}
                    </span>
                  )}
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    {uploadingAvatar ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <IconCamera className="h-5 w-5 text-white" />
                    )}
                  </span>
                </button>

                {/* Action menu */}
                {avatarMenuOpen && (
                  <div className="absolute left-0 top-[72px] z-20 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <IconCamera className="h-4 w-4 text-primary" />
                      Prendre une photo
                    </button>
                    <div className="mx-4 border-t border-border" />
                    <button
                      onClick={() => galleryInputRef.current?.click()}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <IconPhoto className="h-4 w-4 text-accent" />
                      Choisir depuis la galerie
                    </button>
                  </div>
                )}

                {/* Hidden inputs */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div>
                <p className="font-semibold text-foreground">{loading ? "Chargement…" : displayName}</p>
                <p className="text-sm text-muted-foreground">
                  {user?.email ?? "—"} · {user?.plan === "pro" ? "Plan Pro" : "Plan Gratuit"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground/60">Clique sur la photo pour changer</p>
              </div>
            </div>

            {/* Feedback banner */}
            {feedback && (
              <div className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm",
                feedback.type === "success"
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-destructive/30 bg-destructive/10 text-destructive"
              )}>
                {feedback.type === "success"
                  ? <IconCheck className="h-4 w-4 shrink-0" />
                  : <IconX className="h-4 w-4 shrink-0" />}
                {feedback.message}
              </div>
            )}

            {/* Infos */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h2 className="text-sm font-medium text-foreground">Informations personnelles</h2>

              {editing ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Prénom</p>
                    <input value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} className={inputClass} placeholder="Prénom" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Nom</p>
                    <input value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} className={inputClass} placeholder="Nom" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <div className="rounded-lg border border-white/[0.04] bg-background/50 px-3 py-2 text-sm text-muted-foreground">
                      {user?.email ?? "—"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Téléphone</p>
                    <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputClass} placeholder="+33 6 00 00 00 00" type="tel" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Société MLM</p>
                    <input value={form.mlmCompany} onChange={(e) => setForm((f) => ({ ...f, mlmCompany: e.target.value }))} className={inputClass} placeholder="Ex: Herbalife, Proline…" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Niveau MLM</p>
                    <select value={form.mlmLevel} onChange={(e) => setForm((f) => ({ ...f, mlmLevel: e.target.value }))} className={inputClass}>
                      <option value="">— Choisir —</option>
                      {MLM_LEVEL_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Prénom", value: user?.firstName ?? "—" },
                    { label: "Nom", value: user?.lastName ?? "—" },
                    { label: "Email", value: user?.email ?? "—" },
                    { label: "Téléphone", value: (user as any)?.phone ?? "—" },
                    { label: "Société MLM", value: user?.mlmCompany ?? "—" },
                    { label: "Niveau MLM", value: user?.mlmLevel ? MLM_LEVEL_LABELS[user.mlmLevel] ?? user.mlmLevel : "—" },
                  ].map((field) => (
                    <div key={field.label} className="space-y-1">
                      <p className="text-xs text-muted-foreground">{field.label}</p>
                      <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 mt-2">
                {editing ? (
                  <>
                    <button onClick={handleSave} disabled={saving} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 transition-colors">
                      {saving ? "Sauvegarde…" : "Sauvegarder"}
                    </button>
                    <button onClick={cancelEditing} disabled={saving} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                      Annuler
                    </button>
                  </>
                ) : (
                  <button onClick={startEditing} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
                    Modifier
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Abonnement" && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{user?.plan === "pro" ? "Plan Pro" : "Plan Gratuit"}</p>
                <p className="text-sm text-muted-foreground">
                  {user?.plan === "pro" ? "$49/mois · Renouvellement le 19 Juin 2026" : "Passe au Pro pour débloquer toutes les fonctionnalités"}
                </p>
              </div>
              <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                {user?.plan === "pro" ? "Actif" : "Gratuit"}
              </span>
            </div>
            <div className="border-t border-border pt-4">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {user?.plan === "pro" ? "Gérer mon abonnement →" : "Passer au Pro →"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "Préférences" && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-sm font-medium text-foreground">Apparence</h2>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Thème</p>
              <div className="flex rounded-lg border border-border bg-muted p-1 gap-1">
                <button
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    theme === "dark"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Moon className="h-3.5 w-3.5" />
                  Sombre
                </button>
                <button
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    theme === "light"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Sun className="h-3.5 w-3.5" />
                  Clair
                </button>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <h2 className="text-sm font-medium text-foreground mb-3">Notifications</h2>
              {[
                { label: "Rappels de suivi", value: notifSuivi, setter: setNotifSuivi },
                { label: "Alertes filleuls", value: notifFilleuls, setter: setNotifFilleuls },
                { label: "Résumé hebdomadaire", value: notifResume, setter: setNotifResume },
              ].map((notif) => (
                <div key={notif.label} className="flex items-center justify-between py-2">
                  <p className="text-sm text-muted-foreground">{notif.label}</p>
                  <ToggleSwitch enabled={notif.value} onChange={notif.setter} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Mes Documents" && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
            <IconFileText className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium text-foreground">Aucun document exporté</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Exporte tes sessions Atlas en PDF depuis le chat.
            </p>
          </div>
        )}

        {activeTab === "Zone Danger" && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 space-y-4">
            <h2 className="text-sm font-medium text-red-400">Zone de danger</h2>
            <p className="text-sm text-muted-foreground">
              La suppression de ton compte est irréversible. Toutes tes données seront effacées.
            </p>
            <button className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
              Supprimer mon compte
            </button>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
