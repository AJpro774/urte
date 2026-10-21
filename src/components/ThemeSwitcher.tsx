"use client";

import { useEffect, useState } from "react";
import { isThemeId, THEME_META, THEMES, type ModeId, type ThemeId } from "@/lib/themes/tokens";

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
  const [theme, setTheme] = useState<ThemeId>(currentTheme);
  const [mode, setMode] = useState<ModeId>(currentMode);

  useEffect(() => {
    const storedTheme = localStorage.getItem("urte-theme");
    const storedMode = (localStorage.getItem("urte-mode") as ModeId) || currentMode;
    if (isThemeId(storedTheme)) setTheme(storedTheme);
    setMode(storedMode);
  }, [currentMode]);

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
            aria-pressed={theme === id}
            onClick={() => {
              apply(id, mode);
              setTheme(id);
            }}
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
          const next = order[(order.indexOf(mode) + 1) % order.length];
          apply(theme, next);
          setMode(next);
        }}
        aria-label="Toggle light and dark mode"
      >
        Mode
      </button>
    </div>
  );
}
