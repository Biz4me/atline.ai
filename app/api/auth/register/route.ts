import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const { firstName, lastName, email, password } = await req.json()

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

  const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 9000 + 1000)
  const passwordHash = await bcrypt.hash(password, 12)

  await db.user.create({
    data: { firstName, lastName, email, username, passwordHash },
  })

  return NextResponse.json({ ok: true })
}
