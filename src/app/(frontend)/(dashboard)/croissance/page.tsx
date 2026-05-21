"use client"

import { useState } from "react"
import { TabsNav } from "@/components/reseau/tabs-nav"
import { XpNiveauTab } from "@/components/croissance/xp-niveau-tab"
import { BadgesTab } from "@/components/croissance/badges-tab"
import { DefisTab } from "@/components/croissance/defis-tab"
import { LeaderboardTab } from "@/components/croissance/leaderboard-tab"

const tabs = ["XP & Niveau", "Badges", "Défis", "Leaderboard"]

export default function CroissancePage() {
  const [activeTab, setActiveTab] = useState("XP & Niveau")

  return (
    <div>
        <TabsNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-6">
          {activeTab === "XP & Niveau" && <XpNiveauTab />}
          {activeTab === "Badges" && <BadgesTab />}
          {activeTab === "Défis" && <DefisTab />}
          {activeTab === "Leaderboard" && <LeaderboardTab />}
        </div>
    </div>
  )
}
