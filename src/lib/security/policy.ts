export type Role = "guest" | "user" | "trusted_contributor" | "moderator" | "owner";

const ROLE_RANK: Record<Role, number> = {
  guest: 0,
  user: 1,
  trusted_contributor: 2,
  moderator: 3,
  owner: 4,
};

export function hasMinRole(role: Role | null | undefined, min: Role): boolean {
  const r = role ?? "guest";
  return ROLE_RANK[r] >= ROLE_RANK[min];
}

export function canModerate(role: Role | null | undefined): boolean {
  return hasMinRole(role, "moderator");
}

export function canAdmin(role: Role | null | undefined): boolean {
  return hasMinRole(role, "owner");
}

export function canSubmitAsk(role: Role | null | undefined, emailVerified: boolean): boolean {
  return hasMinRole(role, "user") && emailVerified;
}

export function canSubmitResearch(
  role: Role | null | undefined,
  emailVerified: boolean,
  accountAgeDays: number,
  totpEnabled: boolean,
): boolean {
  return (
    hasMinRole(role, "user") &&
    emailVerified &&
    accountAgeDays >= 7 &&
    totpEnabled
  );
}

export function deny(message = "Forbidden"): never {
  throw new Response(JSON.stringify({ title: message, status: 403 }), {
    status: 403,
    headers: { "content-type": "application/problem+json" },
  });
}
