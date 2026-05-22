"use client"

import Image from "next/image"
import { useState } from "react"
import { IconCalendar, IconBrandWhatsapp, IconCopy, IconCheck, IconDownload } from "@tabler/icons-react"
import { AtlineLogo } from "@/components/dashboard/logo"

interface PublicProfile {
  username: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  mlmCompany?: string
  mlmLevel?: string
  calcomLink?: string
  whatsappNumber?: string
}

const MLM_LEVEL_LABELS: Record<string, string> = {
  debutant: "Distributeur",
  intermediaire: "Distributeur Senior",
  senior: "Manager",
  expert: "Directeur",
}

interface Props {
  profile: PublicProfile
}

export function PublicProfileCard({ profile }: Props) {
  const [copied, setCopied] = useState(false)

  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.username
  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : "https://atline.ai"}/${profile.username}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}&bgcolor=09090B&color=FFFFFF&format=png`

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `${name} — Atline`, url: profileUrl })
    } else {
      handleCopy()
    }
  }

  const handleDownloadQR = () => {
    const a = document.createElement("a")
    a.href = qrUrl
    a.download = `atline-${profile.username}-qr.png`
    a.click()
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111113]">
          {/* Header gradient */}
          <div className="relative h-28 bg-gradient-to-br from-violet-600/30 to-violet-900/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.15)_0%,_transparent_70%)]" />
          </div>

          {/* Avatar — chevauchement */}
          <div className="relative -mt-14 flex justify-center">
            <div className="relative">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={name}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full border-4 border-[#111113] object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#111113] bg-violet-600 text-2xl font-bold text-white">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Atline badge */}
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#111113] bg-[#09090B]">
                <AtlineLogo showText={false} size="sm" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="px-6 pb-6 pt-4 text-center">
            <h1 className="text-xl font-bold text-white">{name}</h1>
            {(profile.mlmCompany || profile.mlmLevel) && (
              <p className="mt-1 text-sm text-white/60">
                {[profile.mlmCompany, profile.mlmLevel ? MLM_LEVEL_LABELS[profile.mlmLevel] : null]
                  .filter(Boolean).join(" · ")}
              </p>
            )}

            {/* CTA buttons */}
            <div className="mt-6 flex flex-col gap-3">
              {profile.calcomLink && (
                <a
                  href={profile.calcomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500 active:scale-95"
                >
                  <IconCalendar className="h-4 w-4" />
                  Prendre rendez-vous
                </a>
              )}
              {profile.whatsappNumber && (
                <a
                  href={`https://wa.me/${profile.whatsappNumber.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-95"
                >
                  <IconBrandWhatsapp className="h-4 w-4 text-emerald-400" />
                  Me contacter sur WhatsApp
                </a>
              )}
            </div>

            {/* QR code */}
            <div className="mt-6 flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt="QR Code"
                width={140}
                height={140}
                className="rounded-xl"
              />
              <button
                onClick={handleDownloadQR}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition"
              >
                <IconDownload className="h-3.5 w-3.5" />
                Télécharger le QR code
              </button>
            </div>

            {/* Share row */}
            <div className="mt-5 flex gap-2">
              <button
                onClick={handleCopy}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-white/70 transition hover:bg-white/10"
              >
                {copied ? <IconCheck className="h-4 w-4 text-emerald-400" /> : <IconCopy className="h-4 w-4" />}
                {copied ? "Copié !" : "Copier le lien"}
              </button>
              <button
                onClick={handleShare}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-white/70 transition hover:bg-white/10"
              >
                Partager
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col items-center gap-1">
          <p className="text-xs text-white/25">Propulsé par</p>
          <AtlineLogo showText size="sm" className="opacity-30" />
        </div>
      </div>
    </div>
  )
}
