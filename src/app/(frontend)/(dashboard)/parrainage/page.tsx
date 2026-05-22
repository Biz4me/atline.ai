"use client"

import { useState, useEffect } from "react"
import { IconGift, IconCopy, IconCheck, IconUsers, IconTrophy, IconStar } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface Referral {
  id: number
  status: "registered" | "active" | "paying"
  rewardGiven: boolean
  createdAt: string
  firstName?: string
  lastName?: string
  email: string
}

const STATUS_LABELS: Record<Referral["status"], string> = {
  registered: "Inscrit",
  active: "Actif",
  paying: "Pro ✓",
}
const STATUS_COLORS: Record<Referral["status"], string> = {
  registered: "text-muted-foreground bg-muted",
  active: "text-amber-500 bg-amber-500/10",
  paying: "text-emerald-500 bg-emerald-500/10",
}

export default function ParrainagePage() {
  const [code, setCode] = useState<string | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch("/api/referral")
      .then((r) => r.json())
      .then((data) => {
        setCode(data.code ?? null)
        setReferrals(data.referrals ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const inviteUrl = code ? `https://atline.ai/invite/${code}` : null
  const qrUrl = inviteUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(inviteUrl)}&bgcolor=09090B&color=FFFFFF&format=png`
    : null

  const handleCopy = () => {
    if (!inviteUrl) return
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleShare = () => {
    if (navigator.share && inviteUrl) {
      navigator.share({ title: "Rejoins-moi sur Atline", url: inviteUrl })
    } else {
      handleCopy()
    }
  }

  const payingCount = referrals.filter((r) => r.status === "paying").length
  const activeCount = referrals.filter((r) => r.status === "active").length
  const totalCount = referrals.length

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Hero */}
      <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-violet-600/5 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
            <IconGift className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-foreground">Parraine tes contacts</p>
            <p className="text-sm text-muted-foreground">Gagne 1 mois Pro offert par filleul actif</p>
          </div>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>🎁 <span className="text-foreground font-medium">1 filleul actif</span> = 1 mois Pro offert</p>
          <p>🏆 <span className="text-foreground font-medium">3 filleuls actifs</span> = Plan Pro à vie</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-4">
          <IconUsers className="h-5 w-5 text-violet-500" />
          <p className="text-2xl font-bold text-foreground">{loading ? "—" : totalCount}</p>
          <p className="text-xs text-muted-foreground">Filleuls</p>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-4">
          <IconStar className="h-5 w-5 text-amber-500" />
          <p className="text-2xl font-bold text-foreground">{loading ? "—" : activeCount}</p>
          <p className="text-xs text-muted-foreground">Actifs</p>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-4">
          <IconTrophy className="h-5 w-5 text-emerald-500" />
          <p className="text-2xl font-bold text-foreground">{loading ? "—" : payingCount}</p>
          <p className="text-xs text-muted-foreground">Pro</p>
        </div>
      </div>

      {/* Lien + QR */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <p className="text-sm font-semibold text-foreground">Ton lien de parrainage</p>

        {loading ? (
          <div className="h-10 animate-pulse rounded-lg bg-muted" />
        ) : (
          <>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <p className="flex-1 truncate text-sm text-foreground font-mono">
                {inviteUrl ?? "Chargement…"}
              </p>
              <button
                onClick={handleCopy}
                className="shrink-0 text-muted-foreground hover:text-foreground transition"
              >
                {copied ? <IconCheck className="h-4 w-4 text-emerald-400" /> : <IconCopy className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                {copied ? <IconCheck className="h-4 w-4 text-emerald-400" /> : <IconCopy className="h-4 w-4" />}
                {copied ? "Copié !" : "Copier"}
              </button>
              <button
                onClick={handleShare}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
              >
                Partager
              </button>
            </div>

            {/* QR */}
            {qrUrl && (
              <div className="flex flex-col items-center gap-2 pt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="QR Code parrainage" width={140} height={140} className="rounded-xl" />
                <p className="text-xs text-muted-foreground">Montre ce QR en face à face</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Liste filleuls */}
      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">
          Mes filleuls <span className="text-muted-foreground font-normal">({totalCount})</span>
        </p>

        {loading ? (
          <div className="space-y-2">
            {[0, 1].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />)}
          </div>
        ) : referrals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
            <IconGift className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">Partage ton lien pour voir tes filleuls ici.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {referrals.map((r) => {
              const name = [r.firstName, r.lastName].filter(Boolean).join(" ") || r.email
              return (
                <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", STATUS_COLORS[r.status])}>
                      {STATUS_LABELS[r.status]}
                    </span>
                    {r.rewardGiven && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                        Récompense reçue
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
