import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

const PROFILE_SELECT = {
  id: true,
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  gender: true,
  phone: true,
  phone2: true,
  photoUrl: true,
  address: true,
  address2: true,
  postal: true,
  city: true,
  country: true,
  bio: true,
  socials: true,
  coaching: true,
  birthDate: true,
  personality: true,
  profession: true,
  education: true,
  locale: true,
  plan: true,
  planBillingCycle: true,
  planStartedAt: true,
  planExpiresAt: true,
  trialEndsAt: true,
  level: true,
  onboardingCompleted: true,
  createdAt: true,
} as const

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { ...PROFILE_SELECT, passwordHash: true },
  })

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const { passwordHash, ...rest } = user
  return NextResponse.json({ ...rest, hasPassword: !!passwordHash })
}

// Mise à jour des champs profil (Familles 1/2/3 : identité, adresse, perso)
const TEXT_FIELDS = ['firstName', 'lastName', 'gender', 'phone', 'phone2', 'address', 'address2', 'postal', 'city', 'country', 'bio', 'profession', 'education', 'locale'] as const
const PERSONALITIES = ['ROUGE', 'VERT', 'BLEU', 'JAUNE']

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Bad request' }, { status: 400 })

  const data: Record<string, unknown> = {}
  for (const k of TEXT_FIELDS) {
    if (typeof body[k] === 'string') {
      const v = body[k].trim()
      // firstName/lastName ne peuvent pas être vidés
      if ((k === 'firstName' || k === 'lastName') && !v) continue
      data[k] = v || null
    }
  }
  if (typeof body.photoUrl === 'string') {
    const v = body.photoUrl.trim()
    if (v.length > 1_500_000) return NextResponse.json({ error: 'Image trop lourde' }, { status: 413 })
    data.photoUrl = v || null
  }

  if (body.socials && typeof body.socials === 'object' && !Array.isArray(body.socials)) {
    const clean: Record<string, string> = {}
    for (const [k, v] of Object.entries(body.socials)) {
      if (typeof v === 'string' && v.trim()) clean[k] = v.trim()
    }
    data.socials = clean
  }

  if (body.coaching && typeof body.coaching === 'object' && !Array.isArray(body.coaching)) {
    const clean: Record<string, string> = {}
    for (const [k, v] of Object.entries(body.coaching)) {
      if (typeof v === 'string' && v.trim()) clean[k] = v.trim()
    }
    data.coaching = clean
  }

  if (typeof body.personality === 'string' && PERSONALITIES.includes(body.personality)) data.personality = body.personality
  else if (body.personality === null || body.personality === '') data.personality = null

  if (typeof body.birthDate === 'string' && body.birthDate) {
    const d = new Date(body.birthDate)
    if (!isNaN(d.getTime())) data.birthDate = d
  } else if (body.birthDate === null || body.birthDate === '') {
    data.birthDate = null
  }

  // Username : format + dispo re-vérifiés serveur (un check client peut être contourné)
  if (typeof body.username === 'string') {
    const u = body.username.trim().toLowerCase()
    if (!/^[a-z0-9._]{3,20}$/.test(u)) return NextResponse.json({ error: 'username_invalid' }, { status: 400 })
    const existing = await db.user.findUnique({ where: { username: u }, select: { id: true } })
    if (existing && existing.id !== session.user.id) return NextResponse.json({ error: 'username_taken' }, { status: 409 })
    data.username = u
  }

  // Email : format + unicité (s'exclut soi-même)
  if (typeof body.email === 'string') {
    const e = body.email.trim().toLowerCase()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return NextResponse.json({ error: 'email_invalid' }, { status: 400 })
    const existing = await db.user.findUnique({ where: { email: e }, select: { id: true } })
    if (existing && existing.id !== session.user.id) return NextResponse.json({ error: 'email_taken' }, { status: 409 })
    data.email = e
  }

  const user = await db.user.update({
    where: { id: session.user.id },
    data,
    select: PROFILE_SELECT,
  })
  return NextResponse.json(user)
}

// Suppression définitive du compte (déclenchée par l'utilisateur, avec confirmation côté UI)
export async function DELETE() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await db.user.delete({ where: { id: session.user.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'delete_failed' }, { status: 500 })
  }
}
