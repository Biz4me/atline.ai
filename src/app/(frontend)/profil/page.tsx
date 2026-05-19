"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { TabsNav } from "@/components/reseau/tabs-nav"
import { IconFileText, IconCheck, IconX } from "@tabler/icons-react"
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

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState("Mon Profil")
  const [notifSuivi, setNotifSuivi] = useState(true)
  const [notifFilleuls, setNotifFilleuls] = useState(true)
  const [notifResume, setNotifResume] = useState(false)
  const { user, loading, initials, displayName, updateProfile } = useUser()

  // Edit mode
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mlmCompany: "",
    mlmLevel: "",
  })

  function startEditing() {
    setForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
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

  return (
    <DashboardShell>
      <div>
        <div className="mb-6">
          <h1 className="font-heading text-xl font-semibold text-white">Profil</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tes informations et paramètres</p>
        </div>
        <TabsNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "Mon Profil" && (
          <div className="space-y-4">
            {/* Avatar + nom */}
            <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-card p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                {loading ? "…" : initials}
              </div>
              <div>
                <p className="font-semibold text-white">{loading ? "Chargement…" : displayName}</p>
                <p className="text-sm text-muted-foreground">
                  {user?.email ?? "—"} · {user?.plan === "pro" ? "Plan Pro" : "Plan Gratuit"}
                </p>
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
                {feedback.type === "success" ? <IconCheck className="h-4 w-4 shrink-0" /> : <IconX className="h-4 w-4 shrink-0" />}
                {feedback.message}
              </div>
            )}

            {/* Infos */}
            <div className="rounded-xl border border-white/[0.08] bg-card p-6 space-y-4">
              <h2 className="text-sm font-medium text-white">Informations personnelles</h2>

              {editing ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Prénom */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Prénom</p>
                    <input
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                      className="w-full rounded-lg border border-white/[0.12] bg-background px-3 py-2 text-sm text-white outline-none focus:border-primary/60 transition-colors"
                      placeholder="Prénom"
                    />
                  </div>
                  {/* Nom */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Nom</p>
                    <input
                      value={form.lastName}
                      onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                      className="w-full rounded-lg border border-white/[0.12] bg-background px-3 py-2 text-sm text-white outline-none focus:border-primary/60 transition-colors"
                      placeholder="Nom"
                    />
                  </div>
                  {/* Email (readonly) */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <div className="rounded-lg border border-white/[0.04] bg-background/50 px-3 py-2 text-sm text-muted-foreground">
                      {user?.email ?? "—"}
                    </div>
                  </div>
                  {/* Société MLM */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Société MLM</p>
                    <input
                      value={form.mlmCompany}
                      onChange={(e) => setForm((f) => ({ ...f, mlmCompany: e.target.value }))}
                      className="w-full rounded-lg border border-white/[0.12] bg-background px-3 py-2 text-sm text-white outline-none focus:border-primary/60 transition-colors"
                      placeholder="Ex: Herbalife, Proline…"
                    />
                  </div>
                  {/* Niveau MLM */}
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Niveau MLM</p>
                    <select
                      value={form.mlmLevel}
                      onChange={(e) => setForm((f) => ({ ...f, mlmLevel: e.target.value }))}
                      className="w-full rounded-lg border border-white/[0.12] bg-background px-3 py-2 text-sm text-white outline-none focus:border-primary/60 transition-colors"
                    >
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
                    { label: "Société MLM", value: user?.mlmCompany ?? "—" },
                    { label: "Niveau MLM", value: user?.mlmLevel ? MLM_LEVEL_LABELS[user.mlmLevel] ?? user.mlmLevel : "—" },
                  ].map((field) => (
                    <div key={field.label} className="space-y-1">
                      <p className="text-xs text-muted-foreground">{field.label}</p>
                      <div className="rounded-lg border border-white/[0.08] bg-background px-3 py-2 text-sm text-white">
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 mt-2">
                {editing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {saving ? "Sauvegarde…" : "Sauvegarder"}
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={saving}
                      className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                    >
                      Annuler
                    </button>
                  </>
                ) : (
                  <button
                    onClick={startEditing}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                  >
                    Modifier
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Abonnement" && (
          <div className="rounded-xl border border-white/[0.08] bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{user?.plan === "pro" ? "Plan Pro" : "Plan Gratuit"}</p>
                <p className="text-sm text-muted-foreground">
                  {user?.plan === "pro" ? "$49/mois · Renouvellement le 19 Juin 2026" : "Passe au Pro pour débloquer toutes les fonctionnalités"}
                </p>
              </div>
              <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                {user?.plan === "pro" ? "Actif" : "Gratuit"}
              </span>
            </div>
            <div className="border-t border-white/[0.08] pt-4">
              <button className="text-sm text-muted-foreground hover:text-white transition-colors">
                {user?.plan === "pro" ? "Gérer mon abonnement →" : "Passer au Pro →"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "Préférences" && (
          <div className="rounded-xl border border-white/[0.08] bg-card p-6 space-y-4">
            <h2 className="text-sm font-medium text-white">Apparence</h2>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Thème</p>
              <span className="text-sm text-white">Dark (défaut)</span>
            </div>
            <div className="border-t border-white/[0.08] pt-4">
              <h2 className="text-sm font-medium text-white mb-3">Notifications</h2>
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
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-card py-16 text-center">
            <IconFileText className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium text-white">Aucun document exporté</p>
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
