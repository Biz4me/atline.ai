import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_modules_category" AS ENUM('invitation', 'presentation', 'suivi', 'closing', 'leadership', 'mindset', 'reseaux-sociaux');
  CREATE TYPE "public"."enum_lecons_type" AS ENUM('video', 'text', 'quiz', 'audio');
  CREATE TYPE "public"."enum_prospects_source" AS ENUM('instagram', 'facebook', 'linkedin', 'tiktok', 'recommandation', 'evenement', 'autre');
  CREATE TYPE "public"."enum_prospects_status" AS ENUM('nouveau', 'contacte', 'interesse', 'presentation', 'reflexion', 'converti', 'non-interesse');
  CREATE TYPE "public"."enum_scripts_category" AS ENUM('invitation', 'suivi', 'relance', 'closing', 'recrutement');
  CREATE TYPE "public"."enum_scripts_platform" AS ENUM('whatsapp', 'instagram', 'sms', 'email');
  CREATE TYPE "public"."enum_conversations_messages_role" AS ENUM('user', 'assistant');
  CREATE TYPE "public"."enum_conversations_agent" AS ENUM('atlas', 'markline', 'proline');
  CREATE TYPE "public"."enum_societes_mlm_sector" AS ENUM('sante', 'bien-etre', 'finance', 'energie', 'technologie', 'autre');
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"status" "enum_pages_status" DEFAULT 'draft',
  	"content" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"version_content" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "modules" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"category" "enum_modules_category",
  	"thumbnail_id" integer,
  	"order" numeric DEFAULT 0,
  	"duration" varchar,
  	"published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lecons_key_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"point" varchar
  );
  
  CREATE TABLE "lecons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"module_id" integer NOT NULL,
  	"order" numeric DEFAULT 0,
  	"type" "enum_lecons_type" DEFAULT 'video',
  	"content" jsonb,
  	"video_url" varchar,
  	"duration" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "prospects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"source" "enum_prospects_source",
  	"status" "enum_prospects_status" DEFAULT 'nouveau',
  	"score" numeric,
  	"notes" varchar,
  	"next_follow_up" timestamp(3) with time zone,
  	"owner_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "scripts_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "scripts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"category" "enum_scripts_category",
  	"platform" "enum_scripts_platform" DEFAULT 'whatsapp',
  	"content" varchar NOT NULL,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "conversations_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" "enum_conversations_messages_role",
  	"content" varchar,
  	"timestamp" timestamp(3) with time zone
  );
  
  CREATE TABLE "conversations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"agent" "enum_conversations_agent" DEFAULT 'atlas',
  	"user_id" integer NOT NULL,
  	"flowise_session_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "societes_mlm" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"sector" "enum_societes_mlm_sector",
  	"logo_id" integer,
  	"website" varchar,
  	"compensation_plan" varchar,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "modules_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lecons_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "prospects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "scripts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "conversations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "societes_mlm_id" integer;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "modules" ADD CONSTRAINT "modules_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lecons_key_points" ADD CONSTRAINT "lecons_key_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lecons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lecons" ADD CONSTRAINT "lecons_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prospects" ADD CONSTRAINT "prospects_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "scripts_tags" ADD CONSTRAINT "scripts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."scripts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conversations_messages" ADD CONSTRAINT "conversations_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "societes_mlm" ADD CONSTRAINT "societes_mlm_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "modules_thumbnail_idx" ON "modules" USING btree ("thumbnail_id");
  CREATE INDEX "modules_updated_at_idx" ON "modules" USING btree ("updated_at");
  CREATE INDEX "modules_created_at_idx" ON "modules" USING btree ("created_at");
  CREATE INDEX "lecons_key_points_order_idx" ON "lecons_key_points" USING btree ("_order");
  CREATE INDEX "lecons_key_points_parent_id_idx" ON "lecons_key_points" USING btree ("_parent_id");
  CREATE INDEX "lecons_module_idx" ON "lecons" USING btree ("module_id");
  CREATE INDEX "lecons_updated_at_idx" ON "lecons" USING btree ("updated_at");
  CREATE INDEX "lecons_created_at_idx" ON "lecons" USING btree ("created_at");
  CREATE INDEX "prospects_owner_idx" ON "prospects" USING btree ("owner_id");
  CREATE INDEX "prospects_updated_at_idx" ON "prospects" USING btree ("updated_at");
  CREATE INDEX "prospects_created_at_idx" ON "prospects" USING btree ("created_at");
  CREATE INDEX "scripts_tags_order_idx" ON "scripts_tags" USING btree ("_order");
  CREATE INDEX "scripts_tags_parent_id_idx" ON "scripts_tags" USING btree ("_parent_id");
  CREATE INDEX "scripts_updated_at_idx" ON "scripts" USING btree ("updated_at");
  CREATE INDEX "scripts_created_at_idx" ON "scripts" USING btree ("created_at");
  CREATE INDEX "conversations_messages_order_idx" ON "conversations_messages" USING btree ("_order");
  CREATE INDEX "conversations_messages_parent_id_idx" ON "conversations_messages" USING btree ("_parent_id");
  CREATE INDEX "conversations_user_idx" ON "conversations" USING btree ("user_id");
  CREATE INDEX "conversations_updated_at_idx" ON "conversations" USING btree ("updated_at");
  CREATE INDEX "conversations_created_at_idx" ON "conversations" USING btree ("created_at");
  CREATE INDEX "societes_mlm_logo_idx" ON "societes_mlm" USING btree ("logo_id");
  CREATE INDEX "societes_mlm_updated_at_idx" ON "societes_mlm" USING btree ("updated_at");
  CREATE INDEX "societes_mlm_created_at_idx" ON "societes_mlm" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_modules_fk" FOREIGN KEY ("modules_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lecons_fk" FOREIGN KEY ("lecons_id") REFERENCES "public"."lecons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_prospects_fk" FOREIGN KEY ("prospects_id") REFERENCES "public"."prospects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_scripts_fk" FOREIGN KEY ("scripts_id") REFERENCES "public"."scripts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_conversations_fk" FOREIGN KEY ("conversations_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_societes_mlm_fk" FOREIGN KEY ("societes_mlm_id") REFERENCES "public"."societes_mlm"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_modules_id_idx" ON "payload_locked_documents_rels" USING btree ("modules_id");
  CREATE INDEX "payload_locked_documents_rels_lecons_id_idx" ON "payload_locked_documents_rels" USING btree ("lecons_id");
  CREATE INDEX "payload_locked_documents_rels_prospects_id_idx" ON "payload_locked_documents_rels" USING btree ("prospects_id");
  CREATE INDEX "payload_locked_documents_rels_scripts_id_idx" ON "payload_locked_documents_rels" USING btree ("scripts_id");
  CREATE INDEX "payload_locked_documents_rels_conversations_id_idx" ON "payload_locked_documents_rels" USING btree ("conversations_id");
  CREATE INDEX "payload_locked_documents_rels_societes_mlm_id_idx" ON "payload_locked_documents_rels" USING btree ("societes_mlm_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "modules" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lecons_key_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lecons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "prospects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "scripts_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "scripts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "conversations_messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "conversations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "societes_mlm" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "modules" CASCADE;
  DROP TABLE "lecons_key_points" CASCADE;
  DROP TABLE "lecons" CASCADE;
  DROP TABLE "prospects" CASCADE;
  DROP TABLE "scripts_tags" CASCADE;
  DROP TABLE "scripts" CASCADE;
  DROP TABLE "conversations_messages" CASCADE;
  DROP TABLE "conversations" CASCADE;
  DROP TABLE "societes_mlm" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_modules_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lecons_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_prospects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_scripts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_conversations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_societes_mlm_fk";
  
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_modules_id_idx";
  DROP INDEX "payload_locked_documents_rels_lecons_id_idx";
  DROP INDEX "payload_locked_documents_rels_prospects_id_idx";
  DROP INDEX "payload_locked_documents_rels_scripts_id_idx";
  DROP INDEX "payload_locked_documents_rels_conversations_id_idx";
  DROP INDEX "payload_locked_documents_rels_societes_mlm_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "modules_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lecons_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "prospects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "scripts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "conversations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "societes_mlm_id";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_modules_category";
  DROP TYPE "public"."enum_lecons_type";
  DROP TYPE "public"."enum_prospects_source";
  DROP TYPE "public"."enum_prospects_status";
  DROP TYPE "public"."enum_scripts_category";
  DROP TYPE "public"."enum_scripts_platform";
  DROP TYPE "public"."enum_conversations_messages_role";
  DROP TYPE "public"."enum_conversations_agent";
  DROP TYPE "public"."enum_societes_mlm_sector";`)
}
