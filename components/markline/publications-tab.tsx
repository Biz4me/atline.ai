"use client"

import { useState } from "react"
import { IconBrandInstagram, IconBrandFacebook, IconBrandTiktok, IconEdit, IconTrash, IconSparkles, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Post {
  id: string
  platform: "instagram" | "facebook" | "tiktok"
  time: string
  preview: string
  status: "scheduled" | "published"
}

const samplePosts: Post[] = [
  { id: "1", platform: "instagram", time: "Demain 9h", preview: "Découvrez comment j'ai transformé ma routine en 30 jours...", status: "scheduled" },
  { id: "2", platform: "facebook", time: "Aujourd'hui 18h", preview: "3 raisons pour lesquelles j'ai choisi ce business...", status: "scheduled" },
  { id: "3", platform: "instagram", time: "Hier 10h", preview: "Résultats de ce mois — je suis tellement fière!", status: "published" },
]

const platformIcons = {
  instagram: IconBrandInstagram,
  facebook: IconBrandFacebook,
  tiktok: IconBrandTiktok,
}

const platformColors = {
  instagram: "#E4405F",
  facebook: "#1877F2",
  tiktok: "#000000",
}

export function PublicationsTab() {
  const [showModal, setShowModal] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"])

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  return (
    <div className="space-y-6">
      {/* Create post button */}
      <Button onClick={() => setShowModal(true)} className="w-full">
        Créer un post
      </Button>

      {/* Stats row */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
        <div className="text-center">
          <p className="font-mono text-lg font-bold text-foreground">12</p>
          <p className="text-xs text-muted-foreground">Posts ce mois</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="text-center">
          <p className="font-mono text-lg font-bold text-foreground">847</p>
          <p className="text-xs text-muted-foreground">Likes totaux</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="text-center">
          <p className="font-mono text-lg font-bold text-accent">5</p>
          <p className="text-xs text-muted-foreground">Leads générés</p>
        </div>
      </div>

      {/* Scheduled posts */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Publications</h3>
        {samplePosts.map((post) => {
          const Icon = platformIcons[post.platform]
          return (
            <Card key={post.id} className="p-3">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${platformColors[post.platform]}20` }}
                >
                  <Icon className="h-5 w-5" style={{ color: platformColors[post.platform] }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{post.time}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        post.status === "scheduled"
                          ? "bg-warning/20 text-warning"
                          : "bg-success/20 text-success"
                      )}
                    >
                      {post.status === "scheduled" ? "Programmé" : "Publié"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {post.preview}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button className="rounded p-1.5 text-muted-foreground hover:bg-card hover:text-foreground">
                    <IconEdit className="h-4 w-4" />
                  </button>
                  <button className="rounded p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive">
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Create post modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 lg:items-center">
          <div className="w-full max-w-lg rounded-t-2xl bg-card p-4 lg:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-medium">Créer un post</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-background"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>

            <textarea
              placeholder="Décris ton post ou laisse Atlas générer..."
              className="mb-4 h-32 w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />

            <div className="mb-4">
              <p className="mb-2 text-xs text-muted-foreground">Plateformes</p>
              <div className="flex gap-2">
                {(["instagram", "facebook", "tiktok"] as const).map((platform) => {
                  const Icon = platformIcons[platform]
                  const isSelected = selectedPlatforms.includes(platform)
                  return (
                    <button
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-lg border transition-colors",
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background hover:border-primary/50"
                      )}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: isSelected ? platformColors[platform] : "#71717A" }}
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 gap-2">
                <IconSparkles className="h-4 w-4" />
                Générer avec Atlas
              </Button>
              <Button variant="ghost" className="flex-1">
                Programmer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
