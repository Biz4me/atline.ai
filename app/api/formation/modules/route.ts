import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const DEMO_USER_ID = 'demo'

export async function GET() {
  const course = await db.lmsCourse.findFirst({
    include: {
      modules: {
        orderBy: { position: 'asc' },
        include: {
          _count: { select: { lessons: true } },
          progress: {
            where: { userId: DEMO_USER_ID },
            select: { pct: true, status: true },
          },
        },
      },
    },
  })
  return NextResponse.json(course)
}
