"use client";

import { useEffect } from "react";
import { isThemeId, type ModeId } from "@/lib/themes/tokens";

/** Re-apply stored theme after hydration so React does not wipe the boot script. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const themeRaw = localStorage.getItem("urte-theme") ?? "fox";
    const mode = (localStorage.getItem("urte-mode") as ModeId) || "system";
    const theme = isThemeId(themeRaw) ? themeRaw : "fox";
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute(
      "data-mode",
      mode === "system" ? (dark ? "dark" : "light") : mode,
    );
  }, []);

  return children;
}
