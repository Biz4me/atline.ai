import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Changer (ou définir, pour les comptes Google sans mot de passe) le mot de passe.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const current = typeof body?.current === 'string' ? body.current : ''
  const next = typeof body?.next === 'string' ? body.next : ''
  if (next.length < 8) return NextResponse.json({ error: 'weak' }, { status: 400 })

  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { passwordHash: true } })
  if (!user) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  // Compte avec mot de passe → on exige l'actuel. Compte Google (sans hash) → on le définit directement.
  if (user.passwordHash) {
    if (!current) return NextResponse.json({ error: 'current_required' }, { status: 400 })
    const ok = await bcrypt.compare(current, user.passwordHash)
    if (!ok) return NextResponse.json({ error: 'current_wrong' }, { status: 403 })
  }

  const hash = await bcrypt.hash(next, 10)
  await db.user.update({ where: { id: session.user.id }, data: { passwordHash: hash } })
  return NextResponse.json({ ok: true })
}
