import { describe, expect, it } from "vitest";
import { canAdmin, canModerate, canSubmitAsk, hasMinRole } from "./policy";

describe("RBAC policy", () => {
  it("orders roles", () => {
    expect(hasMinRole("user", "user")).toBe(true);
    expect(hasMinRole("user", "moderator")).toBe(false);
    expect(canModerate("owner")).toBe(true);
    expect(canAdmin("moderator")).toBe(false);
    expect(canSubmitAsk("user", true)).toBe(true);
    expect(canSubmitAsk("user", false)).toBe(false);
  });
});
