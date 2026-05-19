import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_mlm_level') THEN
        CREATE TYPE "public"."enum_users_mlm_level" AS ENUM('debutant', 'intermediaire', 'senior', 'expert');
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_plan') THEN
        CREATE TYPE "public"."enum_users_plan" AS ENUM('free', 'pro');
      END IF;
    END $$;

    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "first_name" varchar;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_name" varchar;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "mlm_company" varchar;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "mlm_level" "enum_users_mlm_level";
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "plan" "enum_users_plan" DEFAULT 'free';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" DROP COLUMN IF EXISTS "first_name";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "last_name";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "mlm_company";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "mlm_level";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "plan";
    DROP TYPE IF EXISTS "public"."enum_users_mlm_level";
    DROP TYPE IF EXISTS "public"."enum_users_plan";
  `)
}
