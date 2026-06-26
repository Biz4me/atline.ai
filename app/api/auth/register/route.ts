import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

const FORMAT = /^[a-z0-9._]{3,20}$/

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '')
}

async function freeUsername(base: string): Promise<string> {
  const root = base || 'membre'
  for (let i = 0; i < 15; i++) {
    const candidate = i === 0 ? root : `${root}${Math.floor(Math.random() * 99999)}`
    if (FORMAT.test(candidate)) {
      const taken = await db.user.findUnique({ where: { username: candidate }, select: { id: true } })
      if (!taken) return candidate
    }
  }
  return `membre${Date.now().toString().slice(-6)}`
}

export async function POST(req: Request) {
  const { firstName, lastName, email, password, username: rawUsername } = await req.json()

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Mot de passe trop court (8 car. min)' }, { status: 400 })
  }

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 })
  }

  // Identifiant : celui choisi (validé) sinon généré disponible
  let username = (rawUsername ?? '').toLowerCase().trim()
  if (username) {
    if (!FORMAT.test(username)) {
      return NextResponse.json({ error: 'Identifiant invalide (3-20 car. : lettres, chiffres, . _)' }, { status: 400 })
    }
    const taken = await db.user.findUnique({ where: { username }, select: { id: true } })
    if (taken) {
      return NextResponse.json({ error: 'Identifiant déjà pris' }, { status: 409 })
    }
  } else {
    username = await freeUsername(norm(`${firstName}${lastName}`))
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await db.user.create({
    data: { firstName, lastName, email, username, passwordHash },
  })

  return NextResponse.json({ ok: true })
}
