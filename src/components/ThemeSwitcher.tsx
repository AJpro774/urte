"use client";

import { THEME_META, THEMES, type ModeId, type ThemeId } from "@/lib/themes/tokens";

function apply(theme: ThemeId, mode: ModeId) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  const resolved =
    mode === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : mode;
  root.setAttribute("data-mode", resolved);
  localStorage.setItem("urte-theme", theme);
  localStorage.setItem("urte-mode", mode);
}

export function ThemeSwitcher({
  currentTheme = "fox",
  currentMode = "system",
}: {
  currentTheme?: ThemeId;
  currentMode?: ModeId;
}) {
  return (
    <div className="theme-switcher" role="group" aria-label="Theme">
      {THEMES.map((id) => {
        const meta = THEME_META[id];
        return (
          <button
            key={id}
            type="button"
            className="theme-swatch"
            title={`${meta.label} — ${meta.description}`}
            aria-label={meta.label}
            aria-pressed={currentTheme === id}
            onClick={() => apply(id, currentMode)}
          >
            {meta.swatches.map((c) => (
              <span key={c} style={{ background: c }} />
            ))}
          </button>
        );
      })}
      <button
        type="button"
        className="btn btn-ghost"
        style={{ padding: "0.25rem 0.55rem", fontSize: "0.75rem" }}
        onClick={() => {
          const order: ModeId[] = ["system", "light", "dark"];
          const stored = (localStorage.getItem("urte-mode") as ModeId) || currentMode;
          const next = order[(order.indexOf(stored) + 1) % order.length];
          const theme = (localStorage.getItem("urte-theme") as ThemeId) || currentTheme;
          apply(theme, next);
        }}
        aria-label="Toggle light and dark mode"
      >
        Mode
      </button>
    </div>
  );
}
