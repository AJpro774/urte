import { describe, expect, it } from "vitest";
import { isBotWindowOpen, nextFridayPacificDate, verifyBotKey } from "./window";

describe("bot window", () => {
  it("returns an ISO-like Friday date string", () => {
    const d = nextFridayPacificDate(new Date("2026-10-21T12:00:00Z"));
    expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("respects BOT_WINDOW_BYPASS", () => {
    const prev = process.env.BOT_WINDOW_BYPASS;
    process.env.BOT_WINDOW_BYPASS = "true";
    expect(isBotWindowOpen(new Date("2026-10-21T12:00:00Z"))).toBe(true);
    process.env.BOT_WINDOW_BYPASS = prev;
  });

  it("verifies bot key against BOT_API_KEY when set", () => {
    const prevKey = process.env.BOT_API_KEY;
    process.env.BOT_API_KEY = "secret-bot-key-value-xx";
    expect(verifyBotKey("secret-bot-key-value-xx")).toBe(true);
    expect(verifyBotKey("wrong")).toBe(false);
    if (prevKey === undefined) delete process.env.BOT_API_KEY;
    else process.env.BOT_API_KEY = prevKey;
  });
});
