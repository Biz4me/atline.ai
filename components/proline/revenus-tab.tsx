"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { IconCheck, IconTrendingUp, IconTarget } from "@tabler/icons-react"
import { useRevenueTracking } from "@/hooks/use-revenue-tracking"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"

const MONTH_LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]

const GOAL_AMOUNTS: Record<string, number> = {
  "+200€/mois": 200,
  "+500€/mois": 500,
  "+1000€/mois": 1000,
  "Remplacer salaire": 2500,
  "Leader réseau": 5000,
}

type Period = "3" | "6" | "12"

function formatEuro(amount: number) {
  return amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
}

function buildChartData(
  entries: { year: number; month: number; amount: number }[],
  months: number
) {
  const now = new Date()
  const result = []

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const y = d.getFullYear()
    const m = d.getMonth() + 1
    const entry = entries.find((e) => e.year === y && e.month === m)
    result.push({
      label: MONTH_LABELS[m - 1],
      amount: entry?.amount ?? 0,
      isCurrent: i === 0,
    })
  }

  return result
}

function computeProjection(data: { amount: number }[]) {
  const nonZero = data.filter((d) => d.amount > 0)
  if (nonZero.length < 2) return null

  // Simple linear regression on last 3 non-zero months
  const recent = nonZero.slice(-3)
  const avg = recent.reduce((s, d) => s + d.amount, 0) / recent.length
  const last = recent[recent.length - 1].amount
  const growthRate = recent.length >= 2
    ? (last - recent[0].amount) / (recent.length - 1)
    : 0

  return Array.from({ length: 6 }, (_, i) => ({
    label: `M+${i + 1}`,
    amount: Math.max(0, Math.round(last + growthRate * (i + 1))),
  }))
}

export function RevenusTab() {
  const { user } = useUser()
  const { entries, loading, saveEntry, totalThisMonth } = useRevenueTracking()
  const [period, setPeriod] = useState<Period>("6")
  const [inputAmount, setInputAmount] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const goalLabel = user?.financialGoal ?? null
  const goalAmount = goalLabel ? (GOAL_AMOUNTS[goalLabel] ?? null) : null

  const now = new Date()
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth() + 1

  const chartData = buildChartData(entries, parseInt(period))
  const projection = computeProjection(chartData)

  const totalAllTime = entries.reduce((s, e) => s + e.amount, 0)
  const maxMonth = entries.length > 0 ? Math.max(...entries.map((e) => e.amount)) : 0

  const handleSave = async () => {
    const amount = parseFloat(inputAmount.replace(",", "."))
    if (isNaN(amount) || amount < 0) return
    setSaving(true)
    try {
      await saveEntry(thisYear, thisMonth, amount)
      setSaved(true)
      setInputAmount("")
      setTimeout(() => setSaved(false), 3000)
    } catch {}
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Ce mois</p>
          <p className="text-xl font-bold text-foreground">{formatEuro(totalThisMonth)}</p>
          {goalAmount && totalThisMonth > 0 && (
            <p className={cn("text-[10px] font-semibold", totalThisMonth >= goalAmount ? "text-emerald-500" : "text-amber-500")}>
              {totalThisMonth >= goalAmount ? "✓ Objectif atteint" : `${Math.round((totalThisMonth / goalAmount) * 100)}% de l'objectif`}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Meilleur mois</p>
          <p className="text-xl font-bold text-foreground">{formatEuro(maxMonth)}</p>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total cumulé</p>
          <p className="text-xl font-bold text-foreground">{formatEuro(totalAllTime)}</p>
        </div>
      </div>

      {/* Saisie mensuelle */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="mb-3 text-sm font-semibold text-foreground">
          Saisir mes commissions — {MONTH_LABELS[thisMonth - 1]} {thisYear}
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Montant en €"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !inputAmount}
            className={cn(
              "flex h-10 items-center gap-1.5 rounded-lg px-4 text-sm font-medium transition disabled:opacity-50",
              saved
                ? "bg-emerald-500 text-white"
                : "bg-primary text-white hover:bg-primary/90"
            )}
          >
            {saving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : saved ? (
              <><IconCheck className="h-4 w-4" /> Sauvegardé</>
            ) : (
              "Enregistrer"
            )}
          </button>
        </div>
        {totalThisMonth > 0 && !saved && (
          <p className="mt-2 text-xs text-muted-foreground">
            Valeur actuelle : <span className="font-semibold text-foreground">{formatEuro(totalThisMonth)}</span>
          </p>
        )}
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconTrendingUp className="h-4 w-4 text-violet-500" />
            <p className="text-sm font-semibold text-foreground">Progression des revenus</p>
          </div>
          <div className="flex gap-1">
            {(["3", "6", "12"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  period === p ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p}M
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="h-48 animate-pulse rounded-lg bg-muted" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}€`}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value) => [formatEuro(Number(value ?? 0)), "Commissions"]}
                cursor={{ fill: "hsl(var(--accent))" }}
              />
              {goalAmount && (
                <ReferenceLine
                  y={goalAmount}
                  stroke="hsl(var(--primary))"
                  strokeDasharray="4 4"
                  label={{ value: "Objectif", position: "insideTopRight", fontSize: 10, fill: "hsl(var(--primary))" }}
                />
              )}
              <Bar
                dataKey="amount"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                opacity={0.85}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Objectif + projection */}
      {goalLabel && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <IconTarget className="h-4 w-4 text-violet-500" />
            <p className="text-sm font-semibold text-foreground">Objectif & projection</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Objectif onboarding</p>
              <p className="font-semibold text-foreground">{goalLabel}</p>
            </div>
            {goalAmount && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Cible mensuelle</p>
                <p className="font-semibold text-foreground">{formatEuro(goalAmount)}</p>
              </div>
            )}
          </div>

          {projection && (
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Projection 6 mois (tendance actuelle)</p>
              <div className="grid grid-cols-6 gap-1">
                {projection.map((p, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <p className="text-[11px] font-semibold text-foreground">{formatEuro(p.amount)}</p>
                    <p className="text-[9px] text-muted-foreground">{p.label}</p>
                  </div>
                ))}
              </div>
              {goalAmount && projection[projection.length - 1].amount >= goalAmount && (
                <p className="mt-2 text-xs font-semibold text-emerald-500">
                  ✓ Objectif atteint à M+{projection.findIndex((p) => p.amount >= goalAmount) + 1} selon la tendance
                </p>
              )}
            </div>
          )}

          {!projection && entries.length < 2 && (
            <p className="text-xs text-muted-foreground">
              Saisis au moins 2 mois de données pour voir la projection.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
