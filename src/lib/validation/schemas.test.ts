import { describe, expect, it } from "vitest";
import { askSchema, submissionSchema } from "./schemas";

describe("askSchema", () => {
  it("requires terms and length", () => {
    const bad = askSchema.safeParse({
      question: "too short",
      fieldSlug: "aerospace",
      acceptTerms: true,
    });
    expect(bad.success).toBe(false);

    const good = askSchema.safeParse({
      question: "How does seawater temperature affect submarine drag at 5 m/s?",
      fieldSlug: "marine",
      acceptTerms: true,
    });
    expect(good.success).toBe(true);
  });
});

describe("submissionSchema", () => {
  it("enforces citation and abstract minimums", () => {
    const base = {
      title: "Neutral title about a system variable studied carefully",
      question: "What is the effect of temperature on drag for a generic hull?",
      answerSummary: Array.from({ length: 120 }, () => "word").join(" "),
      background: Array.from({ length: 160 }, () => "background").join(" "),
      methodology: {
        approach: "Analytic model with TEOS-10 density lookup and quadratic drag.",
        software: "gsw",
        softwareVersion: "3.6",
        modelType: "analytic",
        settings: "T 2-20 C, S 35, U 5 m/s",
        validation: "Compare density to TEOS-10 reference points.",
      },
      assumptions: ["a1xxxx", "a2xxxx", "a3xxxx"],
      limitations: ["l1xxxx", "l2xxxx", "l3xxxx"],
      equations: [
        {
          latex: "D=0.5*rho*Cd*A*U^2",
          symbols: [{ symbol: "D", meaning: "drag", unit: "N" }],
        },
      ],
      parameters: [
        { name: "Speed", symbol: "U", value: 5, unit: "m/s", source: "scenario" },
      ],
      positives: ["p1x", "p2x"],
      negatives: ["n1x", "n2x"],
      neutrals: ["u1x", "u2x"],
      comparisons: [{ label: "case", value: 1, unit: "1" }],
      conclusion: "Temperature shifts power by a few percent under these assumptions.",
      citations: [
        { title: "TEOS-10", type: "standard", reliabilityTier: "primary" },
        { title: "NOAA", type: "government", reliabilityTier: "primary" },
        { title: "PNA", type: "book", reliabilityTier: "authoritative" },
        { title: "Blog", type: "web", reliabilityTier: "secondary" },
        { title: "Wiki", type: "web", reliabilityTier: "secondary" },
      ],
      disclosure: "No conflicts; no generative AI used for numbers.",
      hasReproBundle: true as const,
      hasDiagram: true as const,
      acceptContributorAgreement: true as const,
    };

    expect(submissionSchema.safeParse(base).success).toBe(true);

    const weakCites = {
      ...base,
      citations: base.citations.map((c, i) =>
        i < 3 ? { ...c, reliabilityTier: "secondary" as const } : c,
      ),
    };
    expect(submissionSchema.safeParse(weakCites).success).toBe(false);
  });
});
