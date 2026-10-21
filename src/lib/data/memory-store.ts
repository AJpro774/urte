import type { PublicAsk } from "./types";

/** In-memory asks created during this process (dev / demo without Neon). */
export const memoryAsks = new Map<string, PublicAsk>();

export const memoryVotes = new Map<string, { likeCount: number; dislikeCount: number; byUser: Map<string, number> }>();

export const memoryComments: {
  id: string;
  slug: string;
  author: string;
  body: string;
  createdAt: string;
}[] = [];

export const memorySubmissions: {
  id: string;
  userId: string;
  status: string;
  payload: Record<string, unknown>;
  checks: Record<string, unknown>;
  createdAt: string;
}[] = [];

export const memoryDrafts: {
  id: string;
  batchItemId: string;
  title: string;
  status: "pending_review";
  createdAt: string;
  payload: Record<string, unknown>;
}[] = [];

export const adminQueue = {
  asks: [] as { id: string; question: string; status: string; createdAt: string }[],
  drafts: memoryDrafts,
  submissions: memorySubmissions,
};
