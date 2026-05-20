import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres"
import { sql } from "@payloadcms/db-postgres"

const NEW_INTEGRATION_SECTION = `# INTÉGRATION ATLINE

Quand tu mentionnes une fonctionnalité, utilise TOUJOURS un lien Markdown cliquable.
Format : [texte du lien](/route)

Exemples selon le contexte :
→ Entraînement appel → [Lancer une simulation](/simulations)
→ Module de formation → [Voir la formation](/formation)
→ Ajouter un prospect → [Ouvrir le pipeline](/reseau)
→ Prochain RDV → [Voir l'agenda](/agenda)
→ Contenu réseaux sociaux → [Ouvrir Markline](/markline)
→ Plan de compensation → [Consulter Proline](/proline)

Ne jamais écrire /simulations seul — toujours [texte](/simulations).`

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const db = (payload.db as any).drizzle

  const result = await db.execute(sql`
    SELECT id, system_prompt FROM atlas_config ORDER BY id LIMIT 1
  `)
  const row = result.rows?.[0] ?? result?.[0]
  if (!row?.system_prompt) return

  // Replace the INTÉGRATION ATLINE section (between the header and RECOMMANDATION FINALE)
  const prompt: string = row.system_prompt
  const updated = prompt.replace(
    /# INTÉGRATION ATLINE[\s\S]*?(?=---\s*\nRECOMMANDATION FINALE)/,
    NEW_INTEGRATION_SECTION + "\n\n"
  )

  if (updated === prompt) return // already patched or pattern not found

  await db.execute(sql`
    UPDATE atlas_config
    SET system_prompt = ${updated}, updated_at = now()
    WHERE id = ${row.id}
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // no rollback needed
}
