import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Category enum
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_scripts_library_category"
        AS ENUM('invitation', 'objection', 'closing', 'suivi');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "scripts_library" (
      "id"          serial          PRIMARY KEY,
      "title"       varchar         NOT NULL,
      "content"     text            NOT NULL,
      "category"    "enum_scripts_library_category" DEFAULT 'invitation',
      "use_count"   integer         DEFAULT 0 NOT NULL,
      "owner_id"    integer         REFERENCES users(id) ON DELETE CASCADE,
      "updated_at"  timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"  timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "scripts_library_owner_idx" ON "scripts_library" ("owner_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "scripts_library";`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_scripts_library_category";`)
}
