"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { TabsNav } from "@/components/reseau/tabs-nav"
import { IconFileText } from "@tabler/icons-react"
import { useUser } from "@/hooks/use-user"

const tabs = ["Mon Profil", "Abonnement", "Préférences", "Mes Documents", "Zone Danger"]

const MLM_LEVEL_LABELS: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  senior: "Senior",
  expert: "Expert",
}

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState("Mon Profil")
  const { user, loading, initials, displayName } = useUser()

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

            {/* Infos */}
            <div className="rounded-xl border border-white/[0.08] bg-card p-6 space-y-4">
              <h2 className="text-sm font-medium text-white">Informations personnelles</h2>
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
              <button className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
                Modifier
              </button>
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
              {["Rappels de suivi", "Alertes filleuls", "Résumé hebdomadaire"].map((notif) => (
                <div key={notif} className="flex items-center justify-between py-2">
                  <p className="text-sm text-muted-foreground">{notif}</p>
                  <div className="h-5 w-9 rounded-full bg-primary" />
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
