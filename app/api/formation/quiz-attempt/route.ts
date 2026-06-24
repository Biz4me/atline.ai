import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const DEMO_USER_ID = 'c7a0c77a-0881-4361-91aa-75cc7076b8aa'

export async function POST(req: Request) {
  const { lessonId, score, passed, answers } = await req.json()

  if (!lessonId) return NextResponse.json({ error: 'Missing lessonId' }, { status: 400 })

  await db.userQuizAttempt.create({
    data: {
      userId: DEMO_USER_ID,
      lessonId,
      score,
      passed,
      answers,
    },
  })

  return NextResponse.json({ ok: true })
}
