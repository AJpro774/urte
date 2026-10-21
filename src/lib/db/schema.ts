import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "guest",
  "user",
  "trusted_contributor",
  "moderator",
  "owner",
]);

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "muted",
  "suspended",
  "banned",
]);

export const studyOriginEnum = pgEnum("study_origin", [
  "human",
  "ai_assisted",
  "ai_generated",
]);

export const studyStatusEnum = pgEnum("study_status", [
  "draft",
  "in_review",
  "pending_review",
  "published",
  "retracted",
]);

export const askStatusEnum = pgEnum("ask_status", [
  "submitted",
  "under_review",
  "approved",
  "scheduled",
  "researching",
  "draft_pending_review",
  "published",
  "needs_revision",
  "rejected",
  "merged",
  "carried_over",
]);

export const batchStatusEnum = pgEnum("batch_status", [
  "open",
  "frozen",
  "running",
  "closed",
  "delayed",
  "cancelled",
]);

export const citationTypeEnum = pgEnum("citation_type", [
  "journal",
  "government",
  "standard",
  "manufacturer",
  "book",
  "web",
]);

export const commentStatusEnum = pgEnum("comment_status", [
  "visible",
  "held",
  "hidden",
  "deleted",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    handle: varchar("handle", { length: 40 }).notNull(),
    displayName: varchar("display_name", { length: 120 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    role: userRoleEnum("role").notNull().default("user"),
    reputation: integer("reputation").notNull().default(0),
    themePref: varchar("theme_pref", { length: 32 }).default("fox"),
    modePref: varchar("mode_pref", { length: 16 }).default("system"),
    status: userStatusEnum("status").notNull().default("active"),
    totpEnabled: boolean("totp_enabled").notNull().default(false),
    passwordHash: text("password_hash"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("users_email_uidx").on(t.email),
    uniqueIndex("users_handle_uidx").on(t.handle),
  ],
);

export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipHash: varchar("ip_hash", { length: 64 }),
  userAgent: text("user_agent"),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 120 }).notNull(),
  keyHash: varchar("key_hash", { length: 128 }).notNull(),
  keyPrefix: varchar("key_prefix", { length: 12 }).notNull(),
  scopes: jsonb("scopes").$type<string[]>().notNull().default([]),
  rateTier: varchar("rate_tier", { length: 32 }).notNull().default("free"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
});

export const fields = pgTable(
  "fields",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 80 }).notNull(),
    slug: varchar("slug", { length: 80 }).notNull(),
    parentId: uuid("parent_id"),
    description: text("description"),
  },
  (t) => [uniqueIndex("fields_slug_uidx").on(t.slug)],
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 80 }).notNull(),
    slug: varchar("slug", { length: 80 }).notNull(),
  },
  (t) => [uniqueIndex("tags_slug_uidx").on(t.slug)],
);

export const studies = pgTable(
  "studies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    question: text("question").notNull(),
    fieldId: uuid("field_id").references(() => fields.id),
    origin: studyOriginEnum("origin").notNull().default("human"),
    status: studyStatusEnum("status").notNull().default("draft"),
    currentVersionId: uuid("current_version_id"),
    authorId: uuid("author_id").references(() => users.id),
    isExample: boolean("is_example").notNull().default(false),
    readingTimeMin: integer("reading_time_min").notNull().default(8),
    likeCount: integer("like_count").notNull().default(0),
    dislikeCount: integer("dislike_count").notNull().default(0),
    commentCount: integer("comment_count").notNull().default(0),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    searchVector: text("search_vector"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("studies_slug_uidx").on(t.slug),
    index("studies_status_idx").on(t.status),
    index("studies_field_idx").on(t.fieldId),
  ],
);

export type StudyContent = {
  answerSummary: string;
  methodology: {
    approach: string;
    software: string;
    softwareVersion: string;
    modelType: string;
    settings: string;
    validation: string;
  };
  assumptions: string[];
  limitations: string[];
  equations: { latex: string; symbols: { symbol: string; meaning: string; unit: string }[] }[];
  positives: string[];
  negatives: string[];
  neutrals: string[];
  comparisons: {
    label: string;
    value: number;
    unit: string;
    reference?: string;
    pctDiff?: number;
  }[];
  parameters: {
    name: string;
    symbol: string;
    value: number;
    unit: string;
    source: string;
    uncertainty?: string;
  }[];
  conclusion: string;
  disclosure?: string;
  diagramKind?: "aircraft" | "submarine" | "trajectory";
};

export const studyVersions = pgTable(
  "study_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studyId: uuid("study_id")
      .notNull()
      .references(() => studies.id, { onDelete: "cascade" }),
    versionNo: integer("version_no").notNull(),
    contentJson: jsonb("content_json").$type<StudyContent>().notNull(),
    headlineValue: numeric("headline_value", { precision: 24, scale: 8 }),
    headlineUnit: varchar("headline_unit", { length: 40 }),
    uncertainty: varchar("uncertainty", { length: 80 }),
    confidence: varchar("confidence", { length: 40 }),
    keyAssumption: text("key_assumption"),
    changelog: text("changelog"),
    reviewedBy: uuid("reviewed_by").references(() => users.id),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    contentHash: varchar("content_hash", { length: 64 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("study_versions_study_ver_uidx").on(t.studyId, t.versionNo)],
);

export const studyTags = pgTable(
  "study_tags",
  {
    studyId: uuid("study_id")
      .notNull()
      .references(() => studies.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.studyId, t.tagId] })],
);

export const citations = pgTable("citations", {
  id: uuid("id").defaultRandom().primaryKey(),
  studyVersionId: uuid("study_version_id")
    .notNull()
    .references(() => studyVersions.id, { onDelete: "cascade" }),
  ordinal: integer("ordinal").notNull(),
  type: citationTypeEnum("type").notNull().default("web"),
  title: text("title").notNull(),
  authors: text("authors"),
  year: integer("year"),
  doi: varchar("doi", { length: 128 }),
  url: text("url"),
  accessedAt: timestamp("accessed_at", { withTimezone: true }),
  reliabilityTier: varchar("reliability_tier", { length: 32 }).notNull().default("secondary"),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
});

export const datasets = pgTable("datasets", {
  id: uuid("id").defaultRandom().primaryKey(),
  studyVersionId: uuid("study_version_id")
    .notNull()
    .references(() => studyVersions.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 120 }).notNull(),
  columnsJson: jsonb("columns_json")
    .$type<{ name: string; unit: string; description: string }[]>()
    .notNull(),
  rowsJson: jsonb("rows_json").$type<Record<string, number | string>[]>().notNull(),
  storageKey: text("storage_key"),
  rowCount: integer("row_count").notNull().default(0),
  checksum: varchar("checksum", { length: 64 }),
});

export const chartSpecs = pgTable("chart_specs", {
  id: uuid("id").defaultRandom().primaryKey(),
  studyVersionId: uuid("study_version_id")
    .notNull()
    .references(() => studyVersions.id, { onDelete: "cascade" }),
  datasetId: uuid("dataset_id").references(() => datasets.id),
  kind: varchar("kind", { length: 40 }).notNull(),
  title: varchar("title", { length: 200 }),
  specJson: jsonb("spec_json").$type<Record<string, unknown>>().notNull(),
});

export const diagrams = pgTable("diagrams", {
  id: uuid("id").defaultRandom().primaryKey(),
  studyVersionId: uuid("study_version_id")
    .notNull()
    .references(() => studyVersions.id, { onDelete: "cascade" }),
  kind: varchar("kind", { length: 40 }).notNull().default("generic"),
  svgMarkup: text("svg_markup"),
  svgStorageKey: text("svg_storage_key"),
  sanitizedAt: timestamp("sanitized_at", { withTimezone: true }),
  animationMeta: jsonb("animation_meta").$type<Record<string, unknown>>(),
});

export const computationRecords = pgTable("computation_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  studyVersionId: uuid("study_version_id").references(() => studyVersions.id, {
    onDelete: "cascade",
  }),
  batchItemId: uuid("batch_item_id"),
  computeRunId: uuid("compute_run_id"),
  toolName: varchar("tool_name", { length: 80 }).notNull(),
  toolVersion: varchar("tool_version", { length: 40 }).notNull(),
  inputsJson: jsonb("inputs_json").$type<Record<string, unknown>>().notNull(),
  outputValue: numeric("output_value", { precision: 24, scale: 8 }),
  outputUnit: varchar("output_unit", { length: 40 }),
  uncertainty: varchar("uncertainty", { length: 80 }),
  hash: varchar("hash", { length: 64 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const votes = pgTable(
  "votes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    studyId: uuid("study_id")
      .notNull()
      .references(() => studies.id, { onDelete: "cascade" }),
    value: integer("value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.studyId] })],
);

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  studyId: uuid("study_id")
    .notNull()
    .references(() => studies.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id"),
  bodyMd: text("body_md").notNull(),
  bodyHtmlSanitized: text("body_html_sanitized").notNull(),
  status: commentStatusEnum("status").notNull().default("visible"),
  helpfulCount: integer("helpful_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  editedAt: timestamp("edited_at", { withTimezone: true }),
});

export const asks = pgTable("asks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  scopeNotes: text("scope_notes"),
  fieldId: uuid("field_id").references(() => fields.id),
  status: askStatusEnum("status").notNull().default("submitted"),
  rejectReasonCode: varchar("reject_reason_code", { length: 16 }),
  rejectNote: text("reject_note"),
  mergedIntoId: uuid("merged_into_id"),
  pinned: boolean("pinned").notNull().default(false),
  voteCount: integer("vote_count").notNull().default(0),
  followerCount: integer("follower_count").notNull().default(0),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  studyId: uuid("study_id").references(() => studies.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const askVotes = pgTable(
  "ask_votes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    askId: uuid("ask_id")
      .notNull()
      .references(() => asks.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.askId] })],
);

export const batches = pgTable("batches", {
  id: uuid("id").defaultRandom().primaryKey(),
  fridayDate: timestamp("friday_date", { withTimezone: true }).notNull(),
  cap: integer("cap").notNull().default(5),
  freezeAt: timestamp("freeze_at", { withTimezone: true }),
  status: batchStatusEnum("status").notNull().default("open"),
  summaryJson: jsonb("summary_json").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const batchItems = pgTable("batch_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  batchId: uuid("batch_id")
    .notNull()
    .references(() => batches.id, { onDelete: "cascade" }),
  askId: uuid("ask_id")
    .notNull()
    .references(() => asks.id),
  position: integer("position").notNull(),
  status: varchar("status", { length: 40 }).notNull().default("queued"),
  attempts: integer("attempts").notNull().default(0),
  notes: text("notes"),
  draftStudyId: uuid("draft_study_id").references(() => studies.id),
});

export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  studyId: uuid("study_id").references(() => studies.id),
  status: varchar("status", { length: 40 }).notNull().default("draft"),
  reviewRound: integer("review_round").notNull().default(0),
  payloadJson: jsonb("payload_json").$type<Record<string, unknown>>().notNull(),
  automatedChecksJson: jsonb("automated_checks_json").$type<Record<string, unknown>>(),
  decision: varchar("decision", { length: 40 }),
  rejectionCodes: jsonb("rejection_codes").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorId: uuid("actor_id").references(() => users.id),
  action: varchar("action", { length: 80 }).notNull(),
  target: varchar("target", { length: 160 }),
  beforeHash: varchar("before_hash", { length: 64 }),
  afterHash: varchar("after_hash", { length: 64 }),
  ip: varchar("ip", { length: 64 }),
  userAgent: text("user_agent"),
  requestId: varchar("request_id", { length: 64 }),
  prevHash: varchar("prev_hash", { length: 64 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const credits = pgTable("credits", {
  id: uuid("id").defaultRandom().primaryKey(),
  personName: varchar("person_name", { length: 120 }).notNull(),
  role: varchar("role", { length: 200 }).notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const botKeys = pgTable("bot_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 80 }).notNull().default("friday-bot"),
  keyHash: varchar("key_hash", { length: 128 }).notNull(),
  keyPrefix: varchar("key_prefix", { length: 12 }).notNull(),
  scopes: jsonb("scopes").$type<string[]>().notNull().default(["bot:drafts"]),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
});

export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 80 }).primaryKey(),
  valueJson: jsonb("value_json").$type<unknown>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
