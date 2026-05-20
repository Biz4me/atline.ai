import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres"
import { sql } from "@payloadcms/db-postgres"

const VOICE_MODE_SECTION = `# MODE DE SORTIE

## Si outputMode = "text" (chat Atlas)
→ Utilise le Markdown complet (##, **gras**, \`\`\`, ✅ ❌, →)
→ Structure visuelle riche
→ Scripts entre blocs de code
→ Émojis autorisés

## Si outputMode = "voice" (simulations vocales)
→ ZERO Markdown — aucun symbole
→ Phrases courtes, 15 mots maximum
→ Langage naturel parlé, pas écrit
→ Pas d'émojis, pas de tirets, pas de flèches
→ Ponctuation naturelle pour guider le débit
→ Pauses indiquées par "..."
→ Ton plus chaud, plus humain
→ Jamais de listes — tout en prose fluide

---

`

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const db = (payload.db as any).drizzle

  const result = await db.execute(sql`
    SELECT id, system_prompt FROM atlas_config ORDER BY id LIMIT 1
  `)
  const row = result.rows?.[0] ?? result?.[0]
  if (!row?.system_prompt) return

  let prompt: string = row.system_prompt

  // Add outputMode variable in CONTEXTE UTILISATEUR
  if (!prompt.includes("Mode de sortie : {{outputMode}}")) {
    prompt = prompt.replace(
      "Prochain RDV : {{nextAppointment}}",
      "Prochain RDV : {{nextAppointment}}\nMode de sortie : {{outputMode}}"
    )
  }

  // Insert MODE DE SORTIE section before # MISSION
  if (!prompt.includes("# MODE DE SORTIE")) {
    prompt = prompt.replace("# MISSION", VOICE_MODE_SECTION + "# MISSION")
  }

  await db.execute(sql`
    UPDATE atlas_config
    SET system_prompt = ${prompt}, updated_at = now()
    WHERE id = ${row.id}
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // no rollback needed
}
