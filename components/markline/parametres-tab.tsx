"use client"

import { useState } from "react"
import { IconBrandInstagram, IconBrandFacebook, IconBrandTiktok, IconLock } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Account {
  platform: "instagram" | "facebook" | "tiktok"
  connected: boolean
  username?: string
}

const accounts: Account[] = [
  { platform: "instagram", connected: true, username: "@patrice.mlm" },
  { platform: "facebook", connected: true, username: "Patrice Haure-Pallesi" },
  { platform: "tiktok", connected: false },
]

const platformIcons = {
  instagram: IconBrandInstagram,
  facebook: IconBrandFacebook,
  tiktok: IconBrandTiktok,
}

const platformNames = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
}

interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
}

function Toggle({ enabled, onChange, disabled }: ToggleProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        enabled ? "bg-accent" : "bg-border",
        disabled && "opacity-50"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
          enabled ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  )
}

export function ParametresTab() {
  const [bestTime, setBestTime] = useState(true)
  const [autoHashtags, setAutoHashtags] = useState(true)
  const [watermark, setWatermark] = useState(false)
  const [autoDM, setAutoDM] = useState(false)

  return (
    <div className="space-y-6">
      {/* Connected accounts */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Comptes connectés</h3>
        <div className="space-y-2">
          {accounts.map((account) => {
            const Icon = platformIcons[account.platform]
            return (
              <Card key={account.platform} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-white">{platformNames[account.platform]}</p>
                    {account.username && (
                      <p className="text-xs text-muted-foreground">{account.username}</p>
                    )}
                  </div>
                </div>
                {account.connected ? (
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    <span className="text-xs text-success">Connecté</span>
                  </div>
                ) : (
                  <Button size="sm" variant="outline">
                    Connecter
                  </Button>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      {/* Posting preferences */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Préférences de publication</h3>
        <div className="space-y-2">
          <Card className="flex items-center justify-between p-3">
            <div>
              <p className="text-sm font-medium text-white">Meilleur moment</p>
              <p className="text-xs text-muted-foreground">Publie aux heures optimales</p>
            </div>
            <Toggle enabled={bestTime} onChange={setBestTime} />
          </Card>

          <Card className="flex items-center justify-between p-3">
            <div>
              <p className="text-sm font-medium text-white">Auto-hashtags</p>
              <p className="text-xs text-muted-foreground">Ajoute des hashtags pertinents</p>
            </div>
            <Toggle enabled={autoHashtags} onChange={setAutoHashtags} />
          </Card>

          <Card className="flex items-center justify-between p-3">
            <div>
              <p className="text-sm font-medium text-white">Filigrane</p>
              <p className="text-xs text-muted-foreground">Ajoute ton logo sur les images</p>
            </div>
            <Toggle enabled={watermark} onChange={setWatermark} />
          </Card>
        </div>
      </div>

      {/* DMs automatiques */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          DMs automatiques
          <span className="rounded-[4px] bg-gold/20 px-1.5 py-0.5 text-[10px] font-medium text-gold">
            Elite
          </span>
        </h3>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconLock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Réponds automatiquement aux DMs</p>
            </div>
            <Toggle enabled={autoDM} onChange={setAutoDM} disabled />
          </div>
          <Button variant="outline" className="mt-3 w-full" size="sm">
            Passer à Elite
          </Button>
        </Card>
      </div>
    </div>
  )
}
