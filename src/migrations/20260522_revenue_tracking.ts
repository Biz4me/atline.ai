import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "revenue_tracking" (
      "id"          serial          PRIMARY KEY,
      "owner_id"    integer         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      "year"        integer         NOT NULL,
      "month"       integer         NOT NULL CHECK (month BETWEEN 1 AND 12),
      "amount"      numeric(10, 2)  NOT NULL DEFAULT 0,
      "updated_at"  timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"  timestamp(3) with time zone DEFAULT now() NOT NULL,
      UNIQUE("owner_id", "year", "month")
    );
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "revenue_tracking_owner_idx" ON "revenue_tracking" ("owner_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "revenue_tracking";`)
}
