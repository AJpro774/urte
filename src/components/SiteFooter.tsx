import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="inner">
        <div>
          <strong style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
            URTE
          </strong>
          <div>Unified Research Technology Encyclopedia</div>
          <div>Non-commercial · Evidence over opinion</div>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/status">Status</Link>
          <Link href="/developers">Developers / MCP</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/credits">Credits</Link>
        </div>
      </div>
    </footer>
  );
}
