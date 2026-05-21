import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Enums — ignore if already exist
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_users_experience_level" AS ENUM('beginner', 'developing', 'experienced');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_users_weekly_hours" AS ENUM('lt5', '5to10', 'gt10', 'fulltime');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // Onboarding columns on users — IF NOT EXISTS
  await db.execute(sql`
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "experience_level" "enum_users_experience_level";
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "financial_goal" varchar;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "weekly_hours" "enum_users_weekly_hours";
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "social_platforms" jsonb;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "has_prospect_list" boolean DEFAULT false;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "onboarding_completed" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" DROP COLUMN IF EXISTS "experience_level";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "financial_goal";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "weekly_hours";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "social_platforms";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "has_prospect_list";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "onboarding_completed";
  `)
}
