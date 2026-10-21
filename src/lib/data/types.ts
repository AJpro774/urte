import type { StudyContent } from "@/lib/db/schema";

export type PublicStudy = {
  id: string;
  slug: string;
  title: string;
  question: string;
  field: string;
  fieldSlug: string;
  tags: string[];
  origin: "human" | "ai_assisted" | "ai_generated";
  status: "published" | "pending_review" | "draft" | "retracted";
  isExample: boolean;
  readingTimeMin: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  publishedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  versionNo: number;
  headlineValue: number;
  headlineUnit: string;
  uncertainty: string;
  confidence: string;
  keyAssumption: string;
  content: StudyContent;
  citations: {
    ordinal: number;
    type: string;
    title: string;
    authors?: string;
    year?: number;
    doi?: string;
    url?: string;
    reliabilityTier: string;
  }[];
  charts: {
    id: string;
    kind: string;
    title: string;
    x: number[];
    y: number[];
    xLabel: string;
    yLabel: string;
  }[];
  comments: {
    id: string;
    author: string;
    body: string;
    createdAt: string;
    helpfulCount: number;
  }[];
};

export type PublicAsk = {
  id: string;
  question: string;
  scopeNotes?: string;
  field: string;
  status: string;
  voteCount: number;
  createdAt: string;
  scheduledFriday?: string;
  timeline: { status: string; at: string; note?: string }[];
};

export type PublicCredit = {
  personName: string;
  role: string;
  description: string;
};
