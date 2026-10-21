import DOMPurify from "isomorphic-dompurify";

const MD_ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "code",
  "pre",
  "blockquote",
  "a",
  "h3",
  "h4",
];

const MD_ALLOWED_ATTR = ["href", "title", "rel", "target"];

/** Minimal Markdown → sanitized HTML (bold/italic/links/lists/code). */
export function sanitizeUserMarkdown(md: string): string {
  const escaped = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  let html = escaped
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>')
    .replace(/^\- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (block) => `<ul>${block}</ul>`)
    .replace(/\n\n+/g, "</p><p>")
    .replace(/\n/g, "<br/>");

  html = `<p>${html}</p>`;

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: MD_ALLOWED_TAGS,
    ALLOWED_ATTR: MD_ALLOWED_ATTR,
  });
}

const SVG_FORBIDDEN = /script|foreignObject|onload|onclick|onerror|xlink:href\s*=\s*["']\s*https?:|javascript:/i;

/** Reject dangerous SVG constructs; return sanitized markup or null. */
export function sanitizeSvg(svg: string): string | null {
  if (SVG_FORBIDDEN.test(svg)) return null;
  const cleaned = DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ["svg", "path", "g", "circle", "rect", "line", "polyline", "polygon", "text", "defs", "use"],
  });
  if (!cleaned || SVG_FORBIDDEN.test(cleaned)) return null;
  return cleaned;
}

export function stripBareNumeralsOutsideCitations(prose: string): {
  ok: boolean;
  violations: string[];
} {
  const withoutCitations = prose.replace(/\[\d+\]/g, " ");
  const withoutYears = withoutCitations.replace(/\b(19|20)\d{2}\b/g, " ");
  const withoutCalcRefs = withoutYears.replace(/\{\{calc:[^}]+\}\}/g, " ");
  const matches = withoutCalcRefs.match(/\b\d+(\.\d+)?\b/g) ?? [];
  return { ok: matches.length === 0, violations: matches.slice(0, 20) };
}
