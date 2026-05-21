"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { AccordionBlock } from "@/components/ui/accordion-block"
import { IconChartBar, IconUpload } from "@tabler/icons-react"

function OpenButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
    >
      {label}
      <ArrowUpRight className="h-3.5 w-3.5" />
    </Link>
  )
}

export default function OutilsPage() {
  const [openId, setOpenId] = useState<string | null>("proline")
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <div className="max-w-2xl space-y-3">
          <AccordionBlock
            icon={<IconChartBar className="h-5 w-5" style={{ color: "#10B981" }} />}
            iconBg="rgba(16,185,129,0.12)"
            title="Proline"
            subtitle="Plan de compensation · Calcul de revenus · Qualification"
            isOpen={openId === "proline"}
            onToggle={() => toggle("proline")}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Consulte ton plan de rémunération en détail, simule tes revenus et comprends les niveaux de qualification de ta société MLM.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Niveau actuel", value: "Apprenti" },
                  { label: "Commission", value: "25%" },
                  { label: "Prochain palier", value: "2 000 pts" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-background px-3 py-2 text-center">
                    <p className="font-bold text-foreground">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              <OpenButton href="/proline" label="Ouvrir Proline" />
            </div>
          </AccordionBlock>

          <AccordionBlock
            icon={<IconUpload className="h-5 w-5" style={{ color: "#7C6FE8" }} />}
            iconBg="rgba(124,111,232,0.12)"
            title="Enrichir Atlas"
            subtitle="Ajouter des documents · Formation · Produits · Stratégie"
            isOpen={openId === "enrichir"}
            onToggle={() => toggle("enrichir")}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Upload tes propres ressources (catalogues produits, plans de compensation, scripts) pour qu'Atlas puisse s'en servir dans ses réponses.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Documents ajoutés", value: "6" },
                  { label: "Dernier ajout", value: "Il y a 3j" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-background px-3 py-2 text-center">
                    <p className="font-bold text-foreground">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              <OpenButton href="/enrichir-atlas" label="Enrichir Atlas" />
            </div>
          </AccordionBlock>
    </div>
  )
}
