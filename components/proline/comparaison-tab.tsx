"use client"

import { useState } from "react"
import { IconChevronDown } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const comparisonData = [
  { label: "Investissement départ", herbalife: "$99", forever: "$150" },
  { label: "Commission base", herbalife: "25%", forever: "30%" },
  { label: "Bonus équipe", herbalife: "5-12%", forever: "3-13%" },
  { label: "Produits", herbalife: "Nutrition", forever: "Aloe & beauté" },
  { label: "Marché cible", herbalife: "Fitness", forever: "Bien-être" },
]

export function ComparaisonTab() {
  const [society1, setSociety1] = useState("Herbalife")
  const [society2, setSociety2] = useState("Forever Living")

  return (
    <div className="space-y-6">
      {/* Society selectors */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <select
            value={society1}
            onChange={(e) => setSociety1(e.target.value)}
            className="h-11 w-full appearance-none rounded-lg border border-border bg-card px-3 pr-10 text-sm font-medium text-white focus:border-primary focus:outline-none"
          >
            <option value="Herbalife">Herbalife</option>
            <option value="Forever Living">Forever Living</option>
            <option value="Amway">Amway</option>
          </select>
          <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <span className="text-sm text-muted-foreground">vs</span>
        <div className="relative flex-1">
          <select
            value={society2}
            onChange={(e) => setSociety2(e.target.value)}
            className="h-11 w-full appearance-none rounded-lg border border-border bg-card px-3 pr-10 text-sm font-medium text-white focus:border-primary focus:outline-none"
          >
            <option value="Forever Living">Forever Living</option>
            <option value="Herbalife">Herbalife</option>
            <option value="Amway">Amway</option>
          </select>
          <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* Comparison table */}
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="flex border-b border-border bg-background">
          <div className="w-1/3 p-3 text-xs font-medium text-muted-foreground">Critère</div>
          <div className="w-1/3 border-l border-border p-3 text-center text-xs font-medium text-primary">
            {society1}
          </div>
          <div className="w-1/3 border-l border-border p-3 text-center text-xs font-medium text-accent">
            {society2}
          </div>
        </div>

        {/* Rows */}
        {comparisonData.map((row, index) => (
          <div
            key={row.label}
            className={`flex ${index < comparisonData.length - 1 ? "border-b border-border" : ""}`}
          >
            <div className="w-1/3 p-3 text-sm text-muted-foreground">{row.label}</div>
            <div className="w-1/3 border-l border-border p-3 text-center text-sm font-medium text-white">
              {row.herbalife}
            </div>
            <div className="w-1/3 border-l border-border p-3 text-center text-sm font-medium text-white">
              {row.forever}
            </div>
          </div>
        ))}
      </Card>

      {/* Add comparison button */}
      <Button variant="outline" className="w-full">
        Comparer avec une autre société
      </Button>
    </div>
  )
}
