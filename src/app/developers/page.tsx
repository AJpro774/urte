export const metadata = { title: "Developers" };

export default function DevelopersPage() {
  return (
    <div className="shell section prose-col" style={{ marginInline: "auto" }}>
      <h1>API & MCP</h1>
      <p>
        URTE exposes a read-only Model Context Protocol server at{" "}
        <code className="mono">/api/mcp</code> (Streamable HTTP) and a versioned REST API under{" "}
        <code className="mono">/api/v1</code>.
      </p>
      <h2>MCP tools</h2>
      <ul>
        <li>
          <code>search_studies</code>
        </li>
        <li>
          <code>get_study</code>
        </li>
        <li>
          <code>get_study_data</code>
        </li>
        <li>
          <code>get_citations</code>
        </li>
        <li>
          <code>get_computation_records</code>
        </li>
        <li>
          <code>list_fields</code>
        </li>
        <li>
          <code>find_related</code>
        </li>
      </ul>
      <p>
        Drafts and unreviewed content are never exposed. Anonymous MCP: 20 calls/min per IP.
        Register an API key (coming soon in /account) for higher limits.
      </p>
      <h2>Bot API</h2>
      <p>
        Write-scoped <code>bot:drafts</code> key at <code>/api/v1/bot/*</code>, only during Friday
        00:00–Saturday 12:00 America/Los_Angeles. Cannot publish.
      </p>
    </div>
  );
}
