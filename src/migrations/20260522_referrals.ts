import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Referral code on users table
  await db.execute(sql`
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "referral_code" varchar(16) UNIQUE;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "referred_by_id" integer REFERENCES users(id) ON DELETE SET NULL;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "users_referral_code_idx" ON "users" ("referral_code");
  `)

  // Referrals tracking table
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_referral_status" AS ENUM('registered', 'active', 'paying');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "referrals" (
      "id"            serial          PRIMARY KEY,
      "referrer_id"   integer         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      "referred_id"   integer         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      "status"        "enum_referral_status" DEFAULT 'registered' NOT NULL,
      "reward_given"  boolean         DEFAULT false NOT NULL,
      "updated_at"    timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"    timestamp(3) with time zone DEFAULT now() NOT NULL,
      UNIQUE("referrer_id", "referred_id")
    );
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "referrals_referrer_idx" ON "referrals" ("referrer_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "referrals";`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_referral_status";`)
  await db.execute(sql`ALTER TABLE "users" DROP COLUMN IF EXISTS "referral_code";`)
  await db.execute(sql`ALTER TABLE "users" DROP COLUMN IF EXISTS "referred_by_id";`)
}
