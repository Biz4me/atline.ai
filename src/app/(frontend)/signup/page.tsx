"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AtlineLogo } from "@/components/dashboard/logo"
import { IconChevronLeft } from "@tabler/icons-react"

type Step = "account" | "profile"

const MLM_COMPANIES = [
  "Herbalife",
  "Amway",
  "Forever Living",
  "4Life",
  "Zinzino",
  "Nu Skin",
  "QNET",
  "Autre",
]

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("account")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [mlmCompany, setMlmCompany] = useState("")
  const [mlmLevel, setMlmLevel] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleAccountSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères")
      return
    }
    setError("")
    setStep("profile")
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          mlmCompany: mlmCompany || undefined,
          mlmLevel: mlmLevel || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.errors?.[0]?.message || "Erreur lors de la création du compte")
        return
      }

      const loginRes = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (loginRes.ok) {
        router.push("/")
        router.refresh()
      } else {
        router.push("/login")
      }
    } catch {
      setError("Erreur réseau. Réessaie.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
  const selectClass =
    "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <AtlineLogo size="lg" showText />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          {step === "account" ? (
            <>
              <h1 className="mb-1 font-heading text-xl font-semibold text-foreground">Créer un compte</h1>
              <p className="mb-6 text-sm text-muted-foreground">Étape 1 / 2 · Accès</p>

              <form onSubmit={handleAccountSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="toi@example.com"
                    required
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Mot de passe</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 caractères"
                    required
                    minLength={8}
                    className={inputClass}
                  />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <button
                  type="submit"
                  className="h-11 w-full rounded-lg bg-primary text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                  Continuer →
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Déjà un compte ?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Se connecter
                </Link>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep("account")}
                className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <IconChevronLeft className="h-4 w-4" />
                Retour
              </button>

              <h1 className="mb-1 font-heading text-xl font-semibold text-foreground">Ton profil</h1>
              <p className="mb-6 text-sm text-muted-foreground">Étape 2 / 2 · Identité MLM</p>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Prénom</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Patrice"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Nom</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Haure"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Société MLM</label>
                  <select
                    value={mlmCompany}
                    onChange={(e) => setMlmCompany(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Choisir (optionnel)</option>
                    {MLM_COMPANIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Niveau</label>
                  <select
                    value={mlmLevel}
                    onChange={(e) => setMlmLevel(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Choisir (optionnel)</option>
                    <option value="debutant">Débutant</option>
                    <option value="intermediaire">Intermédiaire</option>
                    <option value="senior">Senior</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-lg bg-primary text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? "Création..." : "Créer mon compte"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
