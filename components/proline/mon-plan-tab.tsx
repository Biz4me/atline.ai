"use client"

import { useState } from "react"
import { IconCheck, IconUpload, IconChevronDown } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const levels = [
  { name: "Distributeur", percentage: "25%", current: true },
  { name: "Senior", percentage: "35%", current: false },
  { name: "Gold", percentage: "42%", current: false },
  { name: "Lapis", percentage: "46%", current: false },
  { name: "Ruby", percentage: "50%", current: false },
  { name: "Président", percentage: "50% + bonus", current: false },
]

export function MonPlanTab() {
  const [society, setSociety] = useState("Herbalife")
  const [personalSales, setPersonalSales] = useState(1500)
  const [teamSize, setTeamSize] = useState(5)

  const estimatedRevenue = Math.round(personalSales * 0.25 + teamSize * 80)

  return (
    <div className="space-y-6">
      {/* Society selector */}
      <div className="relative">
        <select
          value={society}
          onChange={(e) => setSociety(e.target.value)}
          className="h-11 w-full appearance-none rounded-lg border border-border bg-card px-3 pr-10 text-sm font-medium text-white focus:border-primary focus:outline-none"
        >
          <option value="Herbalife">Herbalife</option>
          <option value="Forever Living">Forever Living</option>
          <option value="Amway">Amway</option>
        </select>
        <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {/* Plan summary */}
      <Card className="p-4">
        <h3 className="font-heading text-base font-medium text-white">
          Plan de compensation {society}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <IconCheck className="h-4 w-4 text-success" />
          Uploaded
          <span className="text-muted-foreground">·</span>
          Mis à jour il y a 3j
        </div>
      </Card>

      {/* Level progression */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Progression des niveaux</h3>
        <div className="space-y-2">
          {levels.map((level, index) => (
            <div key={level.name} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                  level.current
                    ? "bg-primary text-white"
                    : "border border-border text-muted-foreground"
                )}
              >
                {level.current ? "●" : "○"}
              </div>
              <div className="flex flex-1 items-center justify-between">
                <span className={cn(
                  "text-sm",
                  level.current ? "font-medium text-white" : "text-muted-foreground"
                )}>
                  {level.name}
                </span>
                <span className={cn(
                  "font-mono text-sm",
                  level.current ? "text-primary" : "text-muted-foreground"
                )}>
                  {level.percentage}
                </span>
              </div>
              {level.current && (
                <span className="text-xs text-primary">← actuel</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Revenue simulator */}
      <Card className="p-4">
        <h3 className="mb-4 font-heading text-base font-medium text-white">
          Simule tes revenus
        </h3>

        {/* Personal sales slider */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Ventes personnelles</span>
            <span className="font-mono text-sm font-medium text-white">${personalSales}</span>
          </div>
          <input
            type="range"
            min="500"
            max="5000"
            step="100"
            value={personalSales}
            onChange={(e) => setPersonalSales(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>$500</span>
            <span>$5000</span>
          </div>
        </div>

        {/* Team size slider */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Distributeurs dans équipe</span>
            <span className="font-mono text-sm font-medium text-white">{teamSize}</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={teamSize}
            onChange={(e) => setTeamSize(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>20</span>
          </div>
        </div>

        {/* Result */}
        <div className="rounded-lg bg-primary/10 p-3 text-center">
          <p className="text-sm text-muted-foreground">Estimation mensuelle</p>
          <p className="font-mono text-2xl font-bold text-primary">~${estimatedRevenue}</p>
        </div>

        <Button variant="ghost" className="mt-3 w-full" size="sm">
          Voir le détail
        </Button>
      </Card>

      {/* Upload plan */}
      <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
        <IconUpload className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 font-medium text-white">Uploader mon plan de compensation PDF</p>
        <p className="mt-1 text-xs text-muted-foreground">Atlas analysera automatiquement</p>
      </div>
    </div>
  )
}
