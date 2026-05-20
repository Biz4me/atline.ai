import { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres"
import { sql } from "@payloadcms/db-postgres"

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const db = (payload.db as any).drizzle
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "rag_tags" (
      "id" serial PRIMARY KEY,
      "name" varchar NOT NULL UNIQUE,
      "updated_at" timestamp(3) WITH TIME ZONE DEFAULT now() NOT NULL,
      "created_at" timestamp(3) WITH TIME ZONE DEFAULT now() NOT NULL
    );
    ALTER TABLE "rag_documents" ADD COLUMN IF NOT EXISTS "theme_id" integer REFERENCES "rag_tags"("id") ON DELETE SET NULL;
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  const db = (payload.db as any).drizzle
  await db.execute(sql`
    ALTER TABLE "rag_documents" DROP COLUMN IF EXISTS "theme_id";
    DROP TABLE IF EXISTS "rag_tags";
  `)
}
