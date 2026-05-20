import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "rag_documents" (
      "id" serial PRIMARY KEY,
      "title" varchar NOT NULL,
      "file_name" varchar,
      "agent" varchar NOT NULL,
      "doc_type" varchar NOT NULL,
      "language" varchar,
      "status" varchar DEFAULT 'indexed',
      "chunks_count" integer,
      "uploaded_by_id" integer REFERENCES "users"("id") ON DELETE SET NULL,
      "updated_at" timestamp(3) WITH TIME ZONE DEFAULT now() NOT NULL,
      "created_at" timestamp(3) WITH TIME ZONE DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "atlas_config" (
      "id" serial PRIMARY KEY,
      "system_prompt" text,
      "temperature" numeric DEFAULT 0.7,
      "max_tokens" integer DEFAULT 2048,
      "updated_at" timestamp(3) WITH TIME ZONE DEFAULT now() NOT NULL,
      "created_at" timestamp(3) WITH TIME ZONE DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "markline_config" (
      "id" serial PRIMARY KEY,
      "system_prompt" text,
      "temperature" numeric DEFAULT 0.7,
      "max_tokens" integer DEFAULT 2048,
      "updated_at" timestamp(3) WITH TIME ZONE DEFAULT now() NOT NULL,
      "created_at" timestamp(3) WITH TIME ZONE DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "proline_config" (
      "id" serial PRIMARY KEY,
      "system_prompt" text,
      "temperature" numeric DEFAULT 0.7,
      "max_tokens" integer DEFAULT 2048,
      "updated_at" timestamp(3) WITH TIME ZONE DEFAULT now() NOT NULL,
      "created_at" timestamp(3) WITH TIME ZONE DEFAULT now() NOT NULL
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "rag_documents";
    DROP TABLE IF EXISTS "atlas_config";
    DROP TABLE IF EXISTS "markline_config";
    DROP TABLE IF EXISTS "proline_config";
  `)
}
