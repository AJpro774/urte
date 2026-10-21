import { describe, expect, it } from "vitest";
import {
  sanitizeSvg,
  sanitizeUserMarkdown,
  stripBareNumeralsOutsideCitations,
} from "./sanitize";

describe("sanitizeUserMarkdown", () => {
  it("allows basic formatting and escapes raw HTML tags", () => {
    const html = sanitizeUserMarkdown("Hello **world** <script>alert(1)</script>");
    expect(html).toContain("<strong>world</strong>");
    expect(html).not.toMatch(/<script\b/i);
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("sanitizeSvg", () => {
  it("rejects script-bearing SVG", () => {
    expect(sanitizeSvg('<svg><script>alert(1)</script></svg>')).toBeNull();
  });

  it("allows a simple path", () => {
    const out = sanitizeSvg('<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L10 10"/></svg>');
    expect(out).toBeTruthy();
  });
});

describe("stripBareNumeralsOutsideCitations", () => {
  it("allows calc refs and years", () => {
    const r = stripBareNumeralsOutsideCitations(
      "In 2024 the result was {{calc:42 | unit:km/s | sig:3}} as cited [1].",
    );
    expect(r.ok).toBe(true);
  });

  it("flags bare numerals", () => {
    const r = stripBareNumeralsOutsideCitations("The speed was 16.2 km/s.");
    expect(r.ok).toBe(false);
    expect(r.violations.length).toBeGreaterThan(0);
  });
});
