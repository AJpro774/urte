import Link from "next/link";
import { FoxLogo } from "@/components/FoxLogo";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { getSessionUser } from "@/lib/auth/session";

const LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/search", label: "Search" },
  { href: "/ask", label: "Ask" },
  { href: "/submit", label: "Submit" },
  { href: "/about", label: "About" },
  { href: "/credits", label: "Credits" },
];

export async function SiteHeader() {
  const user = await getSessionUser();
  return (
    <header className="site-header">
      <div className="inner">
        <Link href="/" className="brand">
          <FoxLogo size={36} variant="full" />
          <span className="brand-wordmark">URTE</span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          {user && (user.role === "owner" || user.role === "moderator") ? (
            <Link href="/admin">Admin</Link>
          ) : null}
          {user ? (
            <Link href="/account">{user.handle}</Link>
          ) : (
            <Link href="/login">Sign in</Link>
          )}
        </nav>
        <ThemeSwitcher currentTheme={(user?.themePref as "fox") || "fox"} />
      </div>
    </header>
  );
}
