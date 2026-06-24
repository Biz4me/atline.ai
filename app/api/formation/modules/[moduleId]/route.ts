import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const DEMO_USER_ID = 'c7a0c77a-0881-4361-91aa-75cc7076b8aa'

export async function GET(_req: Request, props: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await props.params
  const mod = await db.lmsModule.findUnique({
    where: { id: moduleId },
    include: {
      course: { select: { _count: { select: { modules: true } } } },
      _count: { select: { lessons: true } },
      progress: {
        where: { userId: DEMO_USER_ID },
        select: { pct: true, status: true },
      },
    },
  })
  return NextResponse.json(mod)
}
