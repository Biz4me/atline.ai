import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS xp integer DEFAULT 0;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS streak integer DEFAULT 0;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS modules_completed integer DEFAULT 0;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS last_sim_score numeric DEFAULT 0;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE users DROP COLUMN IF EXISTS xp;
    ALTER TABLE users DROP COLUMN IF EXISTS streak;
    ALTER TABLE users DROP COLUMN IF EXISTS modules_completed;
    ALTER TABLE users DROP COLUMN IF EXISTS last_sim_score;
  `)
}
