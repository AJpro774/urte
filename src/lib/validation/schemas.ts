import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email().max(255),
    password: z.string().min(12).max(128),
    handle: z
      .string()
      .min(3)
      .max(40)
      .regex(/^[a-z0-9_]+$/, "Handle must be lowercase alphanumeric/underscore"),
    displayName: z.string().min(1).max(120),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().email().max(255),
    password: z.string().min(1).max(128),
  })
  .strict();

export const askSchema = z
  .object({
    question: z.string().min(20).max(500),
    scopeNotes: z.string().max(2000).optional(),
    fieldSlug: z.enum([
      "aerospace",
      "marine",
      "energy",
      "astronomy",
      "materials",
      "physics",
    ]),
    acceptTerms: z.literal(true),
  })
  .strict();

export const voteSchema = z
  .object({
    value: z.union([z.literal(1), z.literal(-1), z.literal(0)]),
  })
  .strict();

export const commentSchema = z
  .object({
    body: z.string().min(2).max(4000),
    parentId: z.string().uuid().optional(),
  })
  .strict();

export const searchSchema = z
  .object({
    q: z.string().max(300).default(""),
    field: z.string().max(80).optional(),
    origin: z.enum(["human", "ai_assisted", "ai_generated"]).optional(),
  })
  .strict();

const citationSchema = z.object({
  title: z.string().min(3).max(500),
  type: z.enum(["journal", "government", "standard", "manufacturer", "book", "web"]),
  authors: z.string().max(300).optional(),
  year: z.number().int().min(1800).max(2100).optional(),
  doi: z.string().max(128).optional(),
  url: z.string().url().optional(),
  reliabilityTier: z.enum(["primary", "authoritative", "secondary"]),
});

export const submissionSchema = z
  .object({
    title: z.string().min(10).max(120),
    question: z.string().min(20).max(800),
    answerSummary: z.string().min(100).max(2000),
    background: z.string().min(150).max(8000),
    methodology: z.object({
      software: z.string().min(2).max(120),
      softwareVersion: z.string().min(1).max(40),
      modelType: z.string().min(2).max(80),
      settings: z.string().min(10).max(2000),
      validation: z.string().min(10).max(2000),
      approach: z.string().min(20).max(4000),
    }),
    assumptions: z.array(z.string().min(5).max(500)).min(3),
    limitations: z.array(z.string().min(5).max(500)).min(3),
    equations: z
      .array(
        z.object({
          latex: z.string().min(1).max(1000),
          symbols: z
            .array(
              z.object({
                symbol: z.string(),
                meaning: z.string(),
                unit: z.string(),
              }),
            )
            .min(1),
        }),
      )
      .min(1),
    parameters: z
      .array(
        z.object({
          name: z.string(),
          symbol: z.string(),
          value: z.number(),
          unit: z.string().min(1),
          source: z.string().min(1),
          uncertainty: z.string().optional(),
        }),
      )
      .min(1),
    positives: z.array(z.string().min(3)).min(2),
    negatives: z.array(z.string().min(3)).min(2),
    neutrals: z.array(z.string().min(3)).min(2),
    comparisons: z
      .array(
        z.object({
          label: z.string(),
          value: z.number(),
          unit: z.string(),
          reference: z.string().optional(),
          pctDiff: z.number().optional(),
        }),
      )
      .min(1),
    conclusion: z.string().min(40).max(4000),
    citations: z.array(citationSchema).min(5),
    disclosure: z.string().min(10).max(2000),
    hasReproBundle: z.literal(true),
    hasDiagram: z.literal(true),
    acceptContributorAgreement: z.literal(true),
  })
  .strict()
  .superRefine((val, ctx) => {
    const primaryish = val.citations.filter((c) =>
      ["primary", "authoritative"].includes(c.reliabilityTier),
    );
    if (primaryish.length < 3) {
      ctx.addIssue({
        code: "custom",
        message: "At least 3 primary or authoritative citations are required",
        path: ["citations"],
      });
    }
    const words = val.answerSummary.trim().split(/\s+/).length;
    if (words < 100 || words > 250) {
      ctx.addIssue({
        code: "custom",
        message: "Abstract must be 100–250 words",
        path: ["answerSummary"],
      });
    }
  });

export const botDraftSchema = z
  .object({
    title: z.string().min(10).max(200),
    question: z.string().min(10).max(800),
    fieldSlug: z.string().min(2).max(80),
    content: z.record(z.string(), z.unknown()),
    headlineValue: z.number(),
    headlineUnit: z.string().min(1).max(40),
    uncertainty: z.string().max(80),
    computationRecordIds: z.array(z.string()).min(1),
    proseBlocks: z.array(z.string()).default([]),
  })
  .strict();

export const mcpSearchSchema = z
  .object({
    query: z.string().min(1).max(300),
    field: z.string().max(80).optional(),
    origin: z.enum(["human", "ai_assisted", "ai_generated"]).optional(),
    reviewed_only: z.boolean().default(true),
    limit: z.number().int().min(1).max(20).default(10),
  })
  .strict();

export type SubmissionInput = z.infer<typeof submissionSchema>;
