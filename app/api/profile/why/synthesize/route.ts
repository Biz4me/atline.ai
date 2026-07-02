import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { readAtlas } from '@/lib/atlas'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Synthèse d'une SESSION « le pourquoi » : Atlas relit l'échange et formule le pourquoi
// profond de l'utilisateur (1ère personne, prêt à enregistrer). Modèle = Sonnet (readAtlas).
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const conversationId = typeof body?.conversationId === 'string' ? body.conversationId : null
  const attempt = Number(body?.attempt ?? 0)
  if (!conversationId) return NextResponse.json({ error: 'conversationId requis' }, { status: 400 })

  // Propriété vérifiée + on ne garde que l'échange utile (on saute le cadre de session initial).
  const owned = await db.atlasConversation.findFirst({ where: { id: conversationId, userId: session.user.id }, select: { id: true } })
  if (!owned) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const msgs = await db.atlasMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    select: { role: true, content: true },
  })
  // Ce qui compte pour le pourquoi = les réponses de l'utilisateur (on garde aussi les relances d'Atlas pour le contexte).
  const transcript = msgs
    .filter((m) => !(m.role === 'USER' && m.content.startsWith('[SESSION_POURQUOI]')))
    .map((m) => `${m.role === 'USER' ? 'Utilisateur' : 'Atlas'} : ${m.content}`)
    .join('\n')

  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { firstName: true } })
  const variation = attempt > 0
    ? "C'est une NOUVELLE formulation : change l'angle et les mots par rapport à avant, garde le fond mais surprends-le agréablement."
    : ''

  const query = `Tu es Atlas. Voici l'échange d'une courte session où j'aide ${user?.firstName ?? "l'utilisateur"} à formuler SON POURQUOI profond (sa motivation de fond derrière son activité) :

${transcript}

Formule maintenant SON pourquoi, à la PREMIÈRE personne (comme si c'était lui/elle qui l'écrivait : « Je… »), en 2 à 4 phrases. Ça doit être sincère, incarné, ancré dans ce qu'il a dit — pas générique. Va au fond (au-delà de l'argent : la liberté, la famille, la fierté, la transmission… selon ce qu'il a exprimé). ${variation}
Réponds UNIQUEMENT avec le texte du pourquoi, sans guillemets, sans préambule, sans titre.`

  let statement = ''
  try {
    statement = await readAtlas(query, session.user.id, 'Atline')
    statement = statement.replace(/^["«»\s]+|["«»\s]+$/g, '').trim()
  } catch {
    return NextResponse.json({ error: 'synthese_indisponible' }, { status: 502 })
  }
  if (!statement) return NextResponse.json({ error: 'synthese_vide' }, { status: 502 })
  return NextResponse.json({ statement })
}
