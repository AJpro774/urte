import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { EXAMPLE_STUDIES, FIELDS, getStudyBySlug, searchStudies } from "@/lib/data/seed-studies";
import { LIMITS, rateLimit } from "@/lib/security/rate-limit";

function publishedOnly() {
  return EXAMPLE_STUDIES.filter((s) => s.status === "published");
}

function meta() {
  return {
    license: "CC BY 4.0 (planned)",
    origin_note: "Drafts and unreviewed content are never exposed",
    retrieved_at: new Date().toISOString(),
  };
}

const handler = createMcpHandler((server) => {
  server.registerTool(
    "search_studies",
    {
      title: "Search studies",
      description: "Full-text search over published, reviewed URTE studies.",
      inputSchema: z.object({
        query: z.string().max(300),
        field: z.string().optional(),
        origin: z.enum(["human", "ai_assisted", "ai_generated"]).optional(),
        reviewed_only: z.boolean().default(true),
        limit: z.number().int().min(1).max(20).default(10),
      }),
    },
    async ({ query, field, origin, limit }) => {
      let results = searchStudies(query);
      if (field) results = results.filter((s) => s.fieldSlug === field);
      if (origin) results = results.filter((s) => s.origin === origin);
      results = results.slice(0, limit);
      const payload = {
        ...meta(),
        results: results.map((s) => ({
          id: s.id,
          slug: s.slug,
          title: s.title,
          answer_summary: s.content.answerSummary.slice(0, 280),
          headline_value: {
            value: s.headlineValue,
            unit: s.headlineUnit,
            uncertainty: s.uncertainty,
          },
          origin: s.origin,
          review_status: "reviewed",
          published_at: s.publishedAt,
          url: `/study/${s.slug}`,
          is_example: s.isExample,
        })),
      };
      return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
    },
  );

  server.registerTool(
    "get_study",
    {
      title: "Get study",
      description: "Retrieve a published study by slug or id.",
      inputSchema: z.object({
        id: z.string().optional(),
        slug: z.string().optional(),
        version: z.number().int().optional(),
      }),
    },
    async ({ id, slug }) => {
      const study =
        (slug ? getStudyBySlug(slug) : undefined) ??
        publishedOnly().find((s) => s.id === id);
      if (!study || study.status !== "published") {
        return {
          content: [{ type: "text", text: JSON.stringify({ error: "not_found" }) }],
          isError: true,
        };
      }
      const payload = {
        ...meta(),
        canonical_url: `/study/${study.slug}`,
        origin_label: study.origin,
        review_status: "reviewed",
        study: {
          id: study.id,
          slug: study.slug,
          title: study.title,
          question: study.question,
          headline: {
            value: study.headlineValue,
            unit: study.headlineUnit,
            uncertainty: study.uncertainty,
          },
          content: study.content,
          citations: study.citations,
          version: study.versionNo,
          is_example: study.isExample,
        },
      };
      return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
    },
  );

  server.registerTool(
    "get_study_data",
    {
      title: "Get study datasets",
      description: "Chart and table datasets with units.",
      inputSchema: z.object({
        id: z.string(),
        dataset_id: z.string().optional(),
      }),
    },
    async ({ id, dataset_id }) => {
      const study = publishedOnly().find((s) => s.id === id || s.slug === id);
      if (!study) {
        return {
          content: [{ type: "text", text: JSON.stringify({ error: "not_found" }) }],
          isError: true,
        };
      }
      const charts = dataset_id
        ? study.charts.filter((c) => c.id === dataset_id)
        : study.charts;
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ...meta(), charts, parameters: study.content.parameters }, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "get_citations",
    {
      title: "Get citations",
      description: "Citations for a published study.",
      inputSchema: z.object({ id: z.string() }),
    },
    async ({ id }) => {
      const study = publishedOnly().find((s) => s.id === id || s.slug === id);
      if (!study) {
        return {
          content: [{ type: "text", text: JSON.stringify({ error: "not_found" }) }],
          isError: true,
        };
      }
      return {
        content: [
          { type: "text", text: JSON.stringify({ ...meta(), citations: study.citations }, null, 2) },
        ],
      };
    },
  );

  server.registerTool(
    "get_computation_records",
    {
      title: "Get computation records",
      description: "Provenance records for deterministic computations (seed summary for examples).",
      inputSchema: z.object({ id: z.string() }),
    },
    async ({ id }) => {
      const study = publishedOnly().find((s) => s.id === id || s.slug === id);
      if (!study) {
        return {
          content: [{ type: "text", text: JSON.stringify({ error: "not_found" }) }],
          isError: true,
        };
      }
      const records = [
        {
          tool_name: study.content.methodology.software,
          tool_version: study.content.methodology.softwareVersion,
          output_value: study.headlineValue,
          output_unit: study.headlineUnit,
          uncertainty: study.uncertainty,
          note: study.isExample ? "Example seed summary — full records attach after compute pipeline" : undefined,
        },
      ];
      return {
        content: [{ type: "text", text: JSON.stringify({ ...meta(), records }, null, 2) }],
      };
    },
  );

  server.registerTool(
    "list_fields",
    {
      title: "List fields",
      description: "Field taxonomy with published study counts.",
      inputSchema: z.object({}),
    },
    async () => {
      const counts = FIELDS.map((f) => ({
        ...f,
        count: publishedOnly().filter((s) => s.fieldSlug === f.slug).length,
      }));
      return {
        content: [{ type: "text", text: JSON.stringify({ ...meta(), fields: counts }, null, 2) }],
      };
    },
  );

  server.registerTool(
    "find_related",
    {
      title: "Find related studies",
      description: "Related published studies by shared field/tags.",
      inputSchema: z.object({
        id: z.string(),
        limit: z.number().int().min(1).max(10).default(5),
      }),
    },
    async ({ id, limit }) => {
      const study = publishedOnly().find((s) => s.id === id || s.slug === id);
      if (!study) {
        return {
          content: [{ type: "text", text: JSON.stringify({ error: "not_found" }) }],
          isError: true,
        };
      }
      const related = publishedOnly()
        .filter((s) => s.id !== study.id)
        .filter(
          (s) =>
            s.fieldSlug === study.fieldSlug ||
            s.tags.some((t) => study.tags.includes(t)),
        )
        .slice(0, limit)
        .map((s) => ({ id: s.id, slug: s.slug, title: s.title, url: `/study/${s.slug}` }));
      return {
        content: [{ type: "text", text: JSON.stringify({ ...meta(), related }, null, 2) }],
      };
    },
  );
});

async function gated(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const rl = await rateLimit({ key: `mcp:${ip}`, ...LIMITS.mcpAnon, name: "mcp" });
  if (!rl.success) {
    return new Response(JSON.stringify({ title: "Rate limited", status: 429 }), {
      status: 429,
      headers: { "content-type": "application/problem+json" },
    });
  }
  return handler(request);
}

export { gated as GET, gated as POST, gated as DELETE };
