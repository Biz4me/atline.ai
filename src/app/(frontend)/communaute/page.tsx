"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { AccordionBlock } from "@/components/ui/accordion-block"
import { IconMessages, IconEdit, IconUsers } from "@tabler/icons-react"

function ComingSoon({ description }: { description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-2xl">
        🚧
      </div>
      <p className="mt-3 font-medium text-foreground">Bientôt disponible</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export default function CommunautePage() {
  const [openId, setOpenId] = useState<string | null>("forum")
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <DashboardShell>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">Communauté</h1>
          <p className="mt-1 text-sm text-muted-foreground">Forum, posts et groupes par société</p>
        </div>

        <div className="space-y-3">
          <AccordionBlock
            icon={<IconMessages className="h-5 w-5" style={{ color: "#8B5CF6" }} />}
            iconBg="rgba(139,92,246,0.12)"
            title="Forum"
            subtitle="Questions · Conseils · Entraide"
            badge="Bientôt"
            isOpen={openId === "forum"}
            onToggle={() => toggle("forum")}
          >
            <ComingSoon description="Un espace d'entraide entre distributeurs MLM. Pose tes questions, partage tes victoires et apprends des autres." />
          </AccordionBlock>

          <AccordionBlock
            icon={<IconEdit className="h-5 w-5" style={{ color: "#F97316" }} />}
            iconBg="rgba(249,115,22,0.12)"
            title="Posts"
            subtitle="Fil d'actualité · Partages · Inspirations"
            badge="Bientôt"
            isOpen={openId === "posts"}
            onToggle={() => toggle("posts")}
          >
            <ComingSoon description="Le fil de la communauté Atline — partage tes progrès, tes scripts qui marchent et tes tips business." />
          </AccordionBlock>

          <AccordionBlock
            icon={<IconUsers className="h-5 w-5" style={{ color: "#06B6D4" }} />}
            iconBg="rgba(6,182,212,0.12)"
            title="Groupes par société"
            subtitle="Herbalife · Amway · Forever Living · ..."
            badge="Bientôt"
            isOpen={openId === "groupes"}
            onToggle={() => toggle("groupes")}
          >
            <ComingSoon description="Rejoins le groupe de ta société MLM pour des conseils spécifiques, des ressources et un réseau de pairs qui comprennent ton contexte." />
          </AccordionBlock>
        </div>
      </div>
    </DashboardShell>
  )
}
