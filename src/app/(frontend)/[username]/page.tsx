import { notFound } from "next/navigation"
import { Metadata } from "next"
import { PublicProfileCard } from "@/components/profile/public-profile-card"

interface Props {
  params: Promise<{ username: string }>
}

async function getProfile(username: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://atline.ai"
    const res = await fetch(`${baseUrl}/api/public-profile/${username}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.profile ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const profile = await getProfile(username)
  if (!profile) return { title: "Profil introuvable — Atline" }

  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || username
  return {
    title: `${name} — Atline`,
    description: `Prends rendez-vous avec ${name}${profile.mlmCompany ? ` · ${profile.mlmCompany}` : ""}`,
    openGraph: {
      title: `${name} — Atline`,
      images: profile.avatarUrl ? [profile.avatarUrl] : [],
    },
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params
  const profile = await getProfile(username)
  if (!profile) notFound()

  return <PublicProfileCard profile={profile} />
}
