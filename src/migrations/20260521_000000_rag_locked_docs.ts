import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "rag_documents_id" integer REFERENCES "rag_documents"("id") ON DELETE CASCADE,
      ADD COLUMN IF NOT EXISTS "rag_tags_id" integer REFERENCES "rag_tags"("id") ON DELETE CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "rag_documents_id",
      DROP COLUMN IF EXISTS "rag_tags_id";
  `)
}
