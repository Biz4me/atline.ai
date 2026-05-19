import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "is_admin" boolean DEFAULT false;
  ALTER TABLE "users" ADD COLUMN "user_memory" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN "is_admin";
  ALTER TABLE "users" DROP COLUMN "user_memory";`)
}
