import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres"
import { sql } from "@payloadcms/db-postgres"

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const db = (payload.db as any).drizzle
  await db.execute(sql`
    ALTER TABLE conversations ADD COLUMN IF NOT EXISTS module_id text;
    ALTER TABLE conversations ADD COLUMN IF NOT EXISTS messages_json jsonb DEFAULT '[]'::jsonb;
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  const db = (payload.db as any).drizzle
  await db.execute(sql`
    ALTER TABLE conversations DROP COLUMN IF EXISTS module_id;
    ALTER TABLE conversations DROP COLUMN IF EXISTS messages_json;
  `)
}
