CREATE TYPE "public"."user_role" AS ENUM('guest', 'user', 'trusted_contributor', 'moderator', 'owner');
CREATE TYPE "public"."user_status" AS ENUM('active', 'muted', 'suspended', 'banned');
CREATE TYPE "public"."study_origin" AS ENUM('human', 'ai_assisted', 'ai_generated');
CREATE TYPE "public"."study_status" AS ENUM('draft', 'in_review', 'pending_review', 'published', 'retracted');
CREATE TYPE "public"."ask_status" AS ENUM('submitted', 'under_review', 'approved', 'scheduled', 'researching', 'draft_pending_review', 'published', 'needs_revision', 'rejected', 'merged', 'carried_over');
CREATE TYPE "public"."batch_status" AS ENUM('open', 'frozen', 'running', 'closed', 'delayed', 'cancelled');
CREATE TYPE "public"."citation_type" AS ENUM('journal', 'government', 'standard', 'manufacturer', 'book', 'web');
CREATE TYPE "public"."comment_status" AS ENUM('visible', 'held', 'hidden', 'deleted');

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "handle" varchar(40) NOT NULL,
  "display_name" varchar(120) NOT NULL,
  "email" varchar(255) NOT NULL,
  "email_verified_at" timestamptz,
  "avatar_url" text,
  "bio" text,
  "role" "user_role" DEFAULT 'user' NOT NULL,
  "reputation" integer DEFAULT 0 NOT NULL,
  "theme_pref" varchar(32) DEFAULT 'fox',
  "mode_pref" varchar(16) DEFAULT 'system',
  "status" "user_status" DEFAULT 'active' NOT NULL,
  "totp_enabled" boolean DEFAULT false NOT NULL,
  "password_hash" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "users_email_uidx" ON "users" ("email");
CREATE UNIQUE INDEX "users_handle_uidx" ON "users" ("handle");

CREATE TABLE "sessions" (
  "id" varchar(64) PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "expires_at" timestamptz NOT NULL,
  "ip_hash" varchar(64),
  "user_agent" text,
  "revoked_at" timestamptz,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE "api_keys" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "name" varchar(120) NOT NULL,
  "key_hash" varchar(128) NOT NULL,
  "key_prefix" varchar(12) NOT NULL,
  "scopes" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "rate_tier" varchar(32) DEFAULT 'free' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "last_used_at" timestamptz,
  "revoked_at" timestamptz
);

CREATE TABLE "fields" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(80) NOT NULL,
  "slug" varchar(80) NOT NULL,
  "parent_id" uuid,
  "description" text
);
CREATE UNIQUE INDEX "fields_slug_uidx" ON "fields" ("slug");

CREATE TABLE "tags" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(80) NOT NULL,
  "slug" varchar(80) NOT NULL
);
CREATE UNIQUE INDEX "tags_slug_uidx" ON "tags" ("slug");

CREATE TABLE "studies" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" varchar(160) NOT NULL,
  "title" varchar(200) NOT NULL,
  "question" text NOT NULL,
  "field_id" uuid REFERENCES "fields"("id"),
  "origin" "study_origin" DEFAULT 'human' NOT NULL,
  "status" "study_status" DEFAULT 'draft' NOT NULL,
  "current_version_id" uuid,
  "author_id" uuid REFERENCES "users"("id"),
  "is_example" boolean DEFAULT false NOT NULL,
  "reading_time_min" integer DEFAULT 8 NOT NULL,
  "like_count" integer DEFAULT 0 NOT NULL,
  "dislike_count" integer DEFAULT 0 NOT NULL,
  "comment_count" integer DEFAULT 0 NOT NULL,
  "published_at" timestamptz,
  "search_vector" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "studies_slug_uidx" ON "studies" ("slug");
CREATE INDEX "studies_status_idx" ON "studies" ("status");
CREATE INDEX "studies_field_idx" ON "studies" ("field_id");

CREATE TABLE "study_versions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "study_id" uuid NOT NULL REFERENCES "studies"("id") ON DELETE cascade,
  "version_no" integer NOT NULL,
  "content_json" jsonb NOT NULL,
  "headline_value" numeric(24, 8),
  "headline_unit" varchar(40),
  "uncertainty" varchar(80),
  "confidence" varchar(40),
  "key_assumption" text,
  "changelog" text,
  "reviewed_by" uuid REFERENCES "users"("id"),
  "reviewed_at" timestamptz,
  "published_at" timestamptz,
  "content_hash" varchar(64),
  "created_at" timestamptz DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "study_versions_study_ver_uidx" ON "study_versions" ("study_id", "version_no");

CREATE TABLE "study_tags" (
  "study_id" uuid NOT NULL REFERENCES "studies"("id") ON DELETE cascade,
  "tag_id" uuid NOT NULL REFERENCES "tags"("id") ON DELETE cascade,
  PRIMARY KEY ("study_id", "tag_id")
);

CREATE TABLE "citations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "study_version_id" uuid NOT NULL REFERENCES "study_versions"("id") ON DELETE cascade,
  "ordinal" integer NOT NULL,
  "type" "citation_type" DEFAULT 'web' NOT NULL,
  "title" text NOT NULL,
  "authors" text,
  "year" integer,
  "doi" varchar(128),
  "url" text,
  "accessed_at" timestamptz,
  "reliability_tier" varchar(32) DEFAULT 'secondary' NOT NULL,
  "verified_at" timestamptz
);

CREATE TABLE "datasets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "study_version_id" uuid NOT NULL REFERENCES "study_versions"("id") ON DELETE cascade,
  "name" varchar(120) NOT NULL,
  "columns_json" jsonb NOT NULL,
  "rows_json" jsonb NOT NULL,
  "storage_key" text,
  "row_count" integer DEFAULT 0 NOT NULL,
  "checksum" varchar(64)
);

CREATE TABLE "chart_specs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "study_version_id" uuid NOT NULL REFERENCES "study_versions"("id") ON DELETE cascade,
  "dataset_id" uuid REFERENCES "datasets"("id"),
  "kind" varchar(40) NOT NULL,
  "title" varchar(200),
  "spec_json" jsonb NOT NULL
);

CREATE TABLE "diagrams" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "study_version_id" uuid NOT NULL REFERENCES "study_versions"("id") ON DELETE cascade,
  "kind" varchar(40) DEFAULT 'generic' NOT NULL,
  "svg_markup" text,
  "svg_storage_key" text,
  "sanitized_at" timestamptz,
  "animation_meta" jsonb
);

CREATE TABLE "computation_records" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "study_version_id" uuid REFERENCES "study_versions"("id") ON DELETE cascade,
  "batch_item_id" uuid,
  "compute_run_id" uuid,
  "tool_name" varchar(80) NOT NULL,
  "tool_version" varchar(40) NOT NULL,
  "inputs_json" jsonb NOT NULL,
  "output_value" numeric(24, 8),
  "output_unit" varchar(40),
  "uncertainty" varchar(80),
  "hash" varchar(64) NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE "votes" (
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "study_id" uuid NOT NULL REFERENCES "studies"("id") ON DELETE cascade,
  "value" integer NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY ("user_id", "study_id")
);

CREATE TABLE "comments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "study_id" uuid NOT NULL REFERENCES "studies"("id") ON DELETE cascade,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "parent_id" uuid,
  "body_md" text NOT NULL,
  "body_html_sanitized" text NOT NULL,
  "status" "comment_status" DEFAULT 'visible' NOT NULL,
  "helpful_count" integer DEFAULT 0 NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "edited_at" timestamptz
);

CREATE TABLE "asks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "question" text NOT NULL,
  "scope_notes" text,
  "field_id" uuid REFERENCES "fields"("id"),
  "status" "ask_status" DEFAULT 'submitted' NOT NULL,
  "reject_reason_code" varchar(16),
  "reject_note" text,
  "merged_into_id" uuid,
  "pinned" boolean DEFAULT false NOT NULL,
  "vote_count" integer DEFAULT 0 NOT NULL,
  "follower_count" integer DEFAULT 0 NOT NULL,
  "approved_by" uuid REFERENCES "users"("id"),
  "approved_at" timestamptz,
  "study_id" uuid REFERENCES "studies"("id"),
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE "ask_votes" (
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "ask_id" uuid NOT NULL REFERENCES "asks"("id") ON DELETE cascade,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY ("user_id", "ask_id")
);

CREATE TABLE "batches" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "friday_date" timestamptz NOT NULL,
  "cap" integer DEFAULT 5 NOT NULL,
  "freeze_at" timestamptz,
  "status" "batch_status" DEFAULT 'open' NOT NULL,
  "summary_json" jsonb,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE "batch_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "batch_id" uuid NOT NULL REFERENCES "batches"("id") ON DELETE cascade,
  "ask_id" uuid NOT NULL REFERENCES "asks"("id"),
  "position" integer NOT NULL,
  "status" varchar(40) DEFAULT 'queued' NOT NULL,
  "attempts" integer DEFAULT 0 NOT NULL,
  "notes" text,
  "draft_study_id" uuid REFERENCES "studies"("id")
);

CREATE TABLE "submissions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "study_id" uuid REFERENCES "studies"("id"),
  "status" varchar(40) DEFAULT 'draft' NOT NULL,
  "review_round" integer DEFAULT 0 NOT NULL,
  "payload_json" jsonb NOT NULL,
  "automated_checks_json" jsonb,
  "decision" varchar(40),
  "rejection_codes" jsonb DEFAULT '[]'::jsonb,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE "audit_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "actor_id" uuid REFERENCES "users"("id"),
  "action" varchar(80) NOT NULL,
  "target" varchar(160),
  "before_hash" varchar(64),
  "after_hash" varchar(64),
  "ip" varchar(64),
  "user_agent" text,
  "request_id" varchar(64),
  "prev_hash" varchar(64),
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE "credits" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "person_name" varchar(120) NOT NULL,
  "role" varchar(200) NOT NULL,
  "description" text,
  "sort_order" integer DEFAULT 0 NOT NULL
);

CREATE TABLE "bot_keys" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(80) DEFAULT 'friday-bot' NOT NULL,
  "key_hash" varchar(128) NOT NULL,
  "key_prefix" varchar(12) NOT NULL,
  "scopes" jsonb DEFAULT '["bot:drafts"]'::jsonb NOT NULL,
  "revoked_at" timestamptz,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "last_used_at" timestamptz
);

CREATE TABLE "site_settings" (
  "key" varchar(80) PRIMARY KEY NOT NULL,
  "value_json" jsonb NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

-- Full-text search support (Neon Postgres)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
ALTER TABLE studies ADD COLUMN IF NOT EXISTS fts tsvector;
CREATE INDEX IF NOT EXISTS studies_fts_idx ON studies USING GIN (fts);
CREATE INDEX IF NOT EXISTS studies_title_trgm_idx ON studies USING GIN (title gin_trgm_ops);
