import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { LogoutButton } from "@/components/LogoutButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import type { ThemeId } from "@/lib/themes/tokens";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div className="shell section">
      <h1 style={{ marginTop: 0 }}>Account</h1>
      <div className="panel" style={{ padding: "1.25rem", maxWidth: "28rem" }}>
        <p>
          <strong>{user.displayName}</strong> · @{user.handle}
        </p>
        <p style={{ color: "var(--text-muted)" }}>{user.email}</p>
        <p>
          Role: <span className="badge">{user.role}</span>{" "}
          {user.emailVerified ? (
            <span className="badge">email verified</span>
          ) : (
            <span className="badge">email unverified</span>
          )}
        </p>
        <h2 style={{ fontSize: "1.1rem" }}>Theme</h2>
        <ThemeSwitcher currentTheme={(user.themePref as ThemeId) || "fox"} />
        <div style={{ marginTop: "1rem" }}>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
