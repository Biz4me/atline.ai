import { after, NextRequest } from "next/server"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import Anthropic from "@anthropic-ai/sdk"

export const runtime = "nodejs"

const DEFAULT_ATLAS_PROMPT = `# IDENTITÉ

Tu es Atlas, le coach IA d'Atline.ai — un expert MLM chaleureux,
direct et orienté résultats. Tu combines la profondeur d'un mentor
de 20 ans d'expérience MLM avec la précision d'un coach moderne.

Tu n'es PAS un simple chatbot. Tu es le meilleur upline que
{{firstName}} n'a jamais eu — disponible 24h/24, sans jugement,
toujours dans son coin.

---

# CONTEXTE UTILISATEUR

Prénom : {{firstName}}
Société MLM : {{company}}
Niveau : {{level}}
Streak actuel : {{streak}} jours
XP total : {{xp}}
Modules complétés : {{modulesCompleted}}/8
Dernier score simulation : {{lastSimScore}}/10
Points forts identifiés : {{strength_1}}, {{strength_2}}, {{strength_3}}
Axes d'amélioration : {{improvement_1}}, {{improvement_2}}
Défi actif aujourd'hui : {{dailyChallenge}}
Prospects actifs : {{activeProspects}}
Prochain RDV : {{nextAppointment}}

Contexte base de connaissance :
{{context}}

---

# MISSION

Tu accompagnes {{firstName}} à progresser dans son business MLM
sur 3 axes :

1. **COMPÉTENCES** — maîtriser les techniques d'invitation, closing,
   objections et présentation
2. **ACTION** — passer à l'action concrète chaque jour
3. **MINDSET** — rester motivé face aux rejets et aux doutes

---

# RÈGLES ABSOLUES

✅ Toujours utiliser {{firstName}} dans la réponse
✅ Maximum 3 conseils par message — pas plus
✅ Chaque conseil = une action concrète et mesurable
✅ Célébrer chaque victoire, même petite
✅ Répondre TOUJOURS en français
✅ S'appuyer sur {{context}} quand disponible
✅ Adapter le vocabulaire au niveau {{level}}
✅ Terminer chaque réponse par UNE question ou UN défi

❌ Jamais de listes interminables
❌ Jamais de réponses génériques sans personnalisation
❌ Jamais dénigrer {{company}} ou une autre société MLM
❌ Jamais donner plus de 3 étapes à la fois
❌ Jamais terminer sans donner une prochaine action claire

---

# STYLE DE COMMUNICATION PAR NIVEAU

**RECRUE** (0-500 XP) :
→ Langage simple, beaucoup d'encouragements
→ 1 action à la fois maximum
→ Analogies du quotidien

**APPRENTI** (500-2000 XP) :
→ Introduire les techniques officielles (Feel-Felt-Found, FORM...)
→ Scripts concrets entre guillemets

**PROSPECTEUR** (2000-5000 XP) :
→ Stratégie + optimisation
→ Analyser les patterns de {{firstName}}
→ Référencer {{lastSimScore}} et {{strength_1}}

**RECRUTEUR / LEADER** (5000+ XP) :
→ Leadership d'équipe, duplication
→ Vision long terme
→ Référencer {{activeProspects}} et équipe

---

# FORMAT DE RÉPONSE

Structure chaque réponse ainsi et utilise le Markdown :

## [Titre accrocheur personnalisé avec {{firstName}}]

[CÉLÉBRATION si victoire — 1 ligne max, sincère]

### Ce qui fonctionne bien
✅ {{strength_1}}
✅ {{strength_2}}

### Ce qu'on améliore
❌ {{improvement_1}}
❌ {{improvement_2}}

### Script ou technique (si pertinent)
\`\`\`
"Script concret entre guillemets
prêt à utiliser immédiatement"
\`\`\`

→ Action immédiate en 1 ligne

### Ton défi aujourd'hui
> {{dailyChallenge}}

---

**Règles Markdown :**
- ## pour les grandes sections
- **gras** pour ce qui compte vraiment
- \`\`\` pour isoler les scripts
- > pour les défis et citations
- → pour les actions concrètes
- ✅ ❌ pour les listes oui/non
- Ligne vide entre chaque bloc

---

# INTÉGRATION ATLINE

Suggère naturellement les fonctionnalités selon le contexte :

→ Score simulation faible → "On simule cet appel ?" → /simulations
→ Objection technique → "Le module Invitation couvre ça" → /formation
→ Nouveau prospect → "Ajoute-le dans ton pipeline" → /reseau
→ RDV à venir → "Tu veux préparer cet appel ?" → /agenda
→ Contenu à publier → "Markline peut t'aider" → /markline
→ Plan de comp → "Vérifie dans Proline" → /proline

---

RECOMMANDATION FINALE
Relis ce prompt 2 fois avant d'écrire.`

interface UserMemory {
  objectif_revenu?: number
  points_forts?: string[]
  axes_travail?: string[]
  last_session_summary?: string
  dailyChallenge?: string
  dailyChallengeDate?: string
}

function getAtlasLevel(xp: number): string {
  if (xp < 500) return "Recrue"
  if (xp < 2000) return "Apprenti"
  if (xp < 5000) return "Prospecteur"
  if (xp < 10000) return "Recruteur"
  return "Leader"
}

function fillTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    key in vars ? String(vars[key]) : `{{${key}}}`
  )
}

function buildMemoryContext(memory: UserMemory): string {
  const lines: string[] = []
  if (memory.objectif_revenu) lines.push(`Objectif revenu : ${memory.objectif_revenu}€/mois`)
  if (memory.last_session_summary) lines.push(`Dernière session : ${memory.last_session_summary}`)
  return lines.length ? "[Mémoire utilisateur]\n" + lines.join("\n") : ""
}

async function getDailyChallenge(
  payloadInstance: Awaited<ReturnType<typeof getPayload>>,
  userId: string,
  memory: UserMemory,
  level: string,
  company: string,
  client: Anthropic
): Promise<string> {
  const today = new Date().toISOString().slice(0, 10)
  if (memory.dailyChallengeDate === today && memory.dailyChallenge) {
    return memory.dailyChallenge
  }
  try {
    const res = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 80,
      messages: [
        {
          role: "user",
          content: `Génère UN défi MLM concret pour aujourd'hui.
Niveau: ${level}. Société: ${company || "MLM"}.
Format: 1 phrase courte, action précise et mesurable.
Exemples: "Contacte 3 prospects chauds avant 18h" / "Envoie ton script d'invitation à 5 personnes"
Réponds UNIQUEMENT avec le défi, sans explication ni ponctuation finale.`,
        },
      ],
    })
    const challenge =
      res.content[0].type === "text"
        ? res.content[0].text.trim().replace(/\.$/, "")
        : "Contacte 3 prospects aujourd'hui"

    const user = await payloadInstance.findByID({ collection: "users", id: userId, depth: 0 })
    const existing: UserMemory = (user as any)?.userMemory ?? {}
    await payloadInstance.update({
      collection: "users",
      id: userId,
      data: {
        userMemory: { ...existing, dailyChallenge: challenge, dailyChallengeDate: today },
      } as any,
    })
    return challenge
  } catch {
    return memory.dailyChallenge ?? "Contacte 3 prospects aujourd'hui"
  }
}

async function searchAgent(
  vpsUrl: string,
  vpsKey: string,
  query: string,
  agent: string,
  topK: number,
  userId?: string
): Promise<string[]> {
  try {
    const form = new FormData()
    form.append("query", query)
    form.append("agent", agent)
    form.append("top_k", String(topK))
    if (userId && agent === "atlas") form.append("user_id", userId)

    const res = await fetch(`${vpsUrl}/search`, {
      method: "POST",
      headers: { Authorization: `Bearer ${vpsKey}` },
      body: form,
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return []
    const json = await res.json()
    return (json.chunks as string[]) ?? []
  } catch {
    return []
  }
}

async function getRagContext(query: string, userId?: string): Promise<string> {
  const vpsUrl = process.env.VPS_INGEST_URL
  const vpsKey = process.env.VPS_INGEST_KEY
  if (!vpsUrl || !vpsKey) return ""

  const [atlasChunks, prolineChunks, marklineChunks] = await Promise.all([
    searchAgent(vpsUrl, vpsKey, query, "atlas", 4, userId),
    searchAgent(vpsUrl, vpsKey, query, "proline", 3),
    searchAgent(vpsUrl, vpsKey, query, "markline", 3),
  ])

  const sections: string[] = []
  if (atlasChunks.length)
    sections.push(`[Base Atlas]\n${atlasChunks.join("\n\n---\n\n")}`)
  if (prolineChunks.length)
    sections.push(`[Proline — Plan de rémunération]\n${prolineChunks.join("\n\n---\n\n")}`)
  if (marklineChunks.length)
    sections.push(`[Markline — Compétences]\n${marklineChunks.join("\n\n---\n\n")}`)

  return sections.join("\n\n")
}

async function getProspectsData(
  payloadInstance: Awaited<ReturnType<typeof getPayload>>,
  userId: string
): Promise<{ activeProspects: number; nextAppointment: string }> {
  try {
    const [activeRes, apptRes] = await Promise.all([
      payloadInstance.find({
        collection: "prospects",
        where: {
          and: [
            { owner: { equals: userId } },
            { status: { not_in: ["converti", "non-interesse"] } },
          ],
        },
        depth: 0,
        overrideAccess: true,
        limit: 0,
      }),
      payloadInstance.find({
        collection: "prospects",
        where: {
          and: [
            { owner: { equals: userId } },
            { nextFollowUp: { greater_than: new Date().toISOString() } },
          ],
        },
        sort: "nextFollowUp",
        depth: 0,
        overrideAccess: true,
        limit: 1,
      }),
    ])

    const activeProspects = activeRes.totalDocs

    const nextDoc = apptRes.docs[0]
    const nextAppointment = nextDoc?.nextFollowUp
      ? new Date(nextDoc.nextFollowUp as string).toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Aucun RDV planifié"

    return { activeProspects, nextAppointment }
  } catch {
    return { activeProspects: 0, nextAppointment: "Aucun RDV planifié" }
  }
}

async function updateUserMemory(
  userId: string,
  userMessage: string,
  assistantText: string
): Promise<void> {
  const vpsUrl = process.env.VPS_INGEST_URL
  const vpsKey = process.env.VPS_INGEST_KEY
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  let extracted: Partial<UserMemory> = {}
  try {
    const extraction = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `Analyse cet échange de coaching MLM et extrait les informations sur l'utilisateur.
Retourne UNIQUEMENT un JSON valide (pas de markdown, pas d'explication).
N'inclus que les champs pour lesquels tu as des informations claires.

Champs possibles :
{
  "objectif_revenu": number (mensuel en euros),
  "points_forts": ["string"],
  "axes_travail": ["string"],
  "last_session_summary": "string (1-2 phrases résumant ce dont on a parlé)"
}

Message utilisateur : ${userMessage}
Réponse Atlas : ${assistantText}`,
        },
      ],
    })

    const raw = extraction.content[0].type === "text" ? extraction.content[0].text : ""
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) extracted = JSON.parse(match[0])
  } catch {
    // extraction failed — skip
  }

  if (Object.keys(extracted).length > 0) {
    try {
      const payload = await getPayload({ config: configPromise })
      const user = await payload.findByID({ collection: "users", id: userId, depth: 0 })
      const existing: UserMemory = (user as any)?.userMemory ?? {}
      const merged: UserMemory = { ...existing, ...extracted }

      if (extracted.points_forts && existing.points_forts) {
        merged.points_forts = [...new Set([...existing.points_forts, ...extracted.points_forts])]
      }
      if (extracted.axes_travail && existing.axes_travail) {
        merged.axes_travail = [...new Set([...existing.axes_travail, ...extracted.axes_travail])]
      }

      await payload.update({
        collection: "users",
        id: userId,
        data: { userMemory: merged } as any,
      })
    } catch {
      // non-blocking
    }
  }

  if (vpsUrl && vpsKey) {
    try {
      const form = new FormData()
      form.append("user_id", userId)
      form.append("agent", "atlas")
      form.append("text", `Utilisateur: ${userMessage}\n\nAtlas: ${assistantText}`)
      await fetch(`${vpsUrl}/store`, {
        method: "POST",
        headers: { Authorization: `Bearer ${vpsKey}` },
        body: form,
        signal: AbortSignal.timeout(15000),
      })
    } catch {
      // non-blocking
    }
  }
}

export async function POST(req: NextRequest) {
  const { message, userId } = await req.json()

  if (!message?.trim()) {
    return new Response("Message requis", { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  // Load atlas-config global
  let promptTemplate = DEFAULT_ATLAS_PROMPT
  let temperature = 0.7
  let maxTokens = 1024
  try {
    const config = await payload.findGlobal({ slug: "atlas-config" } as any)
    if ((config as any)?.systemPrompt) promptTemplate = (config as any).systemPrompt
    if ((config as any)?.temperature != null) temperature = Number((config as any).temperature)
    if ((config as any)?.maxTokens) maxTokens = Number((config as any).maxTokens)
  } catch {
    // use defaults
  }

  // Defaults
  let templateVars: Record<string, string | number> = {
    firstName: "toi",
    company: "ta société",
    level: "Recrue",
    streak: 0,
    xp: 0,
    modulesCompleted: 0,
    lastSimScore: 0,
    strength_1: "—",
    strength_2: "—",
    strength_3: "—",
    improvement_1: "—",
    improvement_2: "—",
    dailyChallenge: "Contacte 3 prospects aujourd'hui",
    activeProspects: 0,
    nextAppointment: "Aucun RDV planifié",
    context: "",
  }

  if (userId) {
    try {
      const user = await payload.findByID({ collection: "users", id: userId, depth: 0 })
      const u = user as any
      const xp = Number(u?.xp ?? 0)
      const memory: UserMemory = u?.userMemory ?? {}
      const level = getAtlasLevel(xp)
      const company = u?.mlmCompany || "ta société"

      const [dailyChallenge, { activeProspects, nextAppointment }] = await Promise.all([
        getDailyChallenge(payload, userId, memory, level, company, client),
        getProspectsData(payload, userId),
      ])

      const strengths = memory.points_forts ?? []
      const improvements = memory.axes_travail ?? []

      templateVars = {
        firstName: u?.firstName || "toi",
        company,
        level,
        streak: Number(u?.streak ?? 0),
        xp,
        modulesCompleted: Number(u?.modulesCompleted ?? 0),
        lastSimScore: Number(u?.lastSimScore ?? 0),
        strength_1: strengths[0] ?? "—",
        strength_2: strengths[1] ?? "—",
        strength_3: strengths[2] ?? "—",
        improvement_1: improvements[0] ?? "—",
        improvement_2: improvements[1] ?? "—",
        dailyChallenge,
        activeProspects,
        nextAppointment,
        context: "",
      }

      const memoryContext = buildMemoryContext(memory)
      const ragContext = await getRagContext(message, userId)
      const contextParts: string[] = []
      if (memoryContext) contextParts.push(memoryContext)
      if (ragContext) contextParts.push(ragContext)
      templateVars.context = contextParts.join("\n\n") || "Aucun document disponible."
    } catch {
      // use defaults, still try RAG
      const ragContext = await getRagContext(message)
      templateVars.context = ragContext || "Aucun document disponible."
    }
  } else {
    const ragContext = await getRagContext(message)
    templateVars.context = ragContext || "Aucun document disponible."
  }

  const systemPrompt = fillTemplate(promptTemplate, templateVars)

  const encoder = new TextEncoder()
  let capturedFullText = ""

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: maxTokens,
          temperature,
          system: systemPrompt,
          messages: [{ role: "user", content: message }],
        })

        for await (const chunk of anthropicStream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            const token = chunk.delta.text
            capturedFullText += token
            controller.enqueue(
              encoder.encode(`data:${JSON.stringify({ event: "token", data: token })}\n\n`)
            )
          }
        }

        controller.enqueue(encoder.encode("data:[DONE]\n\n"))
      } catch (err) {
        console.error("Atlas stream error:", err)
        controller.enqueue(
          encoder.encode(`data:${JSON.stringify({ event: "error", data: "Erreur" })}\n\n`)
        )
      } finally {
        controller.close()
      }
    },
  })

  if (userId) {
    after(async () => {
      if (capturedFullText) {
        await updateUserMemory(userId, message, capturedFullText)
      }
    })
  }

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
