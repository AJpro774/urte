import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { Role } from "@/lib/security/policy";

export type SessionUser = {
  id: string;
  email: string;
  handle: string;
  displayName: string;
  role: Role;
  emailVerified: boolean;
  totpEnabled: boolean;
  createdAt: string;
  themePref?: string;
};

type SessionRecord = {
  id: string;
  userId: string;
  expiresAt: number;
  user: SessionUser;
};

const SESSION_COOKIE = "urte_session";
const memorySessions = new Map<string, SessionRecord>();
const memoryUsers = new Map<string, SessionUser & { passwordHash: string }>();

function sessionSecret(): string {
  return process.env.AUTH_SECRET ?? "dev-only-urte-auth-secret-change-me";
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt + sessionSecret(), 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt + sessionSecret(), 64);
  const prev = Buffer.from(hash, "hex");
  if (prev.length !== next.length) return false;
  return timingSafeEqual(prev, next);
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function ensureSeedAdmin(): void {
  if (memoryUsers.size > 0) return;
  const email = process.env.OWNER_EMAIL ?? "alexander@urte.local";
  const password = process.env.OWNER_PASSWORD ?? "ChangeMe-Owner-2026!";
  const id = "owner-alexander";
  memoryUsers.set(email.toLowerCase(), {
    id,
    email,
    handle: "apatton",
    displayName: "Alexander Patton",
    role: "owner",
    emailVerified: true,
    totpEnabled: true,
    createdAt: "2025-01-01T00:00:00.000Z",
    themePref: "fox",
    passwordHash: hashPassword(password),
  });
}

ensureSeedAdmin();

export async function registerUser(input: {
  email: string;
  password: string;
  handle: string;
  displayName: string;
}): Promise<{ ok: true; user: SessionUser } | { ok: false; error: string }> {
  ensureSeedAdmin();
  const key = input.email.toLowerCase();
  if (memoryUsers.has(key)) {
    return { ok: false, error: "Unable to create account" };
  }
  for (const u of memoryUsers.values()) {
    if (u.handle === input.handle) {
      return { ok: false, error: "Unable to create account" };
    }
  }
  const user: SessionUser & { passwordHash: string } = {
    id: randomBytes(16).toString("hex"),
    email: input.email,
    handle: input.handle,
    displayName: input.displayName,
    role: "user",
    emailVerified: false,
    totpEnabled: false,
    createdAt: new Date().toISOString(),
    themePref: "fox",
    passwordHash: hashPassword(input.password),
  };
  memoryUsers.set(key, user);
  const { passwordHash: _pw, ...publicUser } = user;
  void _pw;
  return { ok: true, user: publicUser };
}

export async function authenticate(
  email: string,
  password: string,
): Promise<SessionUser | null> {
  ensureSeedAdmin();
  const user = memoryUsers.get(email.toLowerCase());
  if (!user) {
    verifyPassword(password, hashPassword("timing-pad"));
    return null;
  }
  if (!verifyPassword(password, user.passwordHash)) return null;
  const { passwordHash: _pw, ...publicUser } = user;
  void _pw;
  return publicUser;
}

export async function createSession(user: SessionUser): Promise<string> {
  const id = randomBytes(32).toString("hex");
  const isAdmin = user.role === "owner" || user.role === "moderator";
  const ttlMs = isAdmin ? 30 * 60 * 1000 : 14 * 24 * 60 * 60 * 1000;
  memorySessions.set(id, {
    id,
    userId: user.id,
    expiresAt: Date.now() + ttlMs,
    user,
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(ttlMs / 1000),
  });
  return id;
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (id) memorySessions.delete(id);
  jar.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const rec = memorySessions.get(id);
  if (!rec || rec.expiresAt < Date.now()) {
    memorySessions.delete(id);
    return null;
  }
  return rec.user;
}

export function getMemoryUserById(id: string): SessionUser | null {
  for (const u of memoryUsers.values()) {
    if (u.id === id) {
      const { passwordHash: _pw, ...pub } = u;
      void _pw;
      return pub;
    }
  }
  return null;
}

/** Dev helper: mark email verified (admin tools / tests). */
export function markEmailVerified(email: string): void {
  const u = memoryUsers.get(email.toLowerCase());
  if (u) u.emailVerified = true;
}
