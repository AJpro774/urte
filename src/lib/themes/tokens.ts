export const THEMES = ["fox", "lagoon", "admiralty"] as const;
export type ThemeId = (typeof THEMES)[number];
export type ModeId = "light" | "dark" | "system";

export const THEME_META: Record<
  ThemeId,
  { label: string; description: string; swatches: [string, string, string] }
> = {
  fox: {
    label: "Fox Daylight",
    description: "White / orange / cyan",
    swatches: ["#FFFFFF", "#F26B1D", "#00B8D4"],
  },
  lagoon: {
    label: "Lagoon",
    description: "Light grey / turquoise / yellow",
    swatches: ["#F1F3F5", "#1ABC9C", "#F5C518"],
  },
  admiralty: {
    label: "Admiralty",
    description: "White / navy / gold",
    swatches: ["#FFFFFF", "#14284B", "#C9A227"],
  },
};

export function isThemeId(v: string | null | undefined): v is ThemeId {
  return THEMES.includes(v as ThemeId);
}
