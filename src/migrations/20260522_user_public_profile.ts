import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "username"          varchar UNIQUE;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "calcom_link"       varchar;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "whatsapp_number"   varchar;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "users_username_idx" ON "users" ("username");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" DROP COLUMN IF EXISTS "username";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "calcom_link";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "whatsapp_number";
  `)
}
