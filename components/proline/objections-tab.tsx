"use client"

import { useState } from "react"
import { IconSearch, IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Objection {
  id: string
  question: string
  answer: string
  category: string
}

const objections: Objection[] = [
  {
    id: "1",
    question: "C'est trop cher",
    answer: "Je comprends. Laisse-moi te montrer le ROI — combien économises-tu sur les alternatives chaque mois ?",
    category: "Prix",
  },
  {
    id: "2",
    question: "C'est une pyramide",
    answer: "Excellente question. La différence est simple : dans un schéma pyramidal, il n'y a pas de produit réel. Ici, 80% de nos ventes sont à des clients finaux.",
    category: "Pyramide",
  },
  {
    id: "3",
    question: "Je n'ai pas le temps",
    answer: "C'est exactement pour ça que ce business est parfait — tu travailles quand tu veux, où tu veux. 30 minutes par jour suffisent pour démarrer.",
    category: "Temps",
  },
  {
    id: "4",
    question: "Les produits ne marchent pas",
    answer: "Je comprends ton scepticisme. Voici 3 témoignages de clients qui ont vu des résultats en 30 jours. Tu veux les voir ?",
    category: "Produit",
  },
]

const categories = ["Toutes", "Prix", "Pyramide", "Temps", "Produit"]

export function ObjectionsTab() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Toutes")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredObjections = objections.filter((obj) => {
    const matchesSearch = obj.question.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "Toutes" || obj.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une objection..."
          className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              selectedCategory === cat
                ? "bg-primary text-white"
                : "border border-border text-muted-foreground hover:border-primary hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Objection cards */}
      <div className="space-y-2">
        {filteredObjections.map((obj) => {
          const isExpanded = expandedId === obj.id
          return (
            <Card key={obj.id} className="overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : obj.id)}
                className="flex w-full items-center justify-between p-3 text-left"
              >
                <span className="font-medium text-white">&quot;{obj.question}&quot;</span>
                {isExpanded ? (
                  <IconChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <IconChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </button>
              {isExpanded && (
                <div className="border-t border-border px-3 pb-3 pt-2">
                  <p className="text-sm text-muted-foreground">{obj.answer}</p>
                  <Link href="/simulations">
                    <Button className="mt-3 w-full" size="sm">
                      Simuler cette objection
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
