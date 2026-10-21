import { describe, expect, it } from "vitest";
import { EXAMPLE_STUDIES, getStudyBySlug, searchStudies } from "./seed-studies";

describe("seed studies", () => {
  it("labels examples and publishes three studies", () => {
    expect(EXAMPLE_STUDIES.length).toBeGreaterThanOrEqual(3);
    expect(EXAMPLE_STUDIES.every((s) => s.isExample)).toBe(true);
  });

  it("finds by slug and search", () => {
    expect(getStudyBySlug("delta-v-to-pluto-chemical-vs-ntp-vs-ion")?.field).toBe(
      "Astronomy",
    );
    expect(searchStudies("pluto").length).toBeGreaterThan(0);
    expect(searchStudies("zzzz-no-match").length).toBe(0);
  });
});
