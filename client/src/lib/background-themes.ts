export const BACKGROUND_THEMES = [
  {
    id: "midnight",
    label: "夜幕藍",
    color: "#0b1020",
    panel: "#121a2d",
    panel2: "#151f36",
    panel3: "#192640",
    line: "rgba(151, 169, 207, 0.16)",
    lineBright: "rgba(168, 184, 221, 0.28)",
    accent: "#8b7cff",
    accentStrong: "#b0a8ff",
    accentRgb: "139, 124, 255",
  },
  {
    id: "forest",
    label: "森林綠",
    color: "#0b1e1a",
    panel: "#102821",
    panel2: "#14332b",
    panel3: "#193c32",
    line: "rgba(111, 220, 171, 0.16)",
    lineBright: "rgba(143, 240, 195, 0.28)",
    accent: "#4fc89c",
    accentStrong: "#95f0ca",
    accentRgb: "79, 200, 156",
  },
  {
    id: "ember",
    label: "熔岩紅",
    color: "#24151a",
    panel: "#2e1a21",
    panel2: "#3a2027",
    panel3: "#47262d",
    line: "rgba(255, 151, 126, 0.16)",
    lineBright: "rgba(255, 177, 154, 0.28)",
    accent: "#ef876d",
    accentStrong: "#ffb19a",
    accentRgb: "239, 135, 109",
  },
  {
    id: "ocean",
    label: "深海青",
    color: "#0a1c2a",
    panel: "#102536",
    panel2: "#143046",
    panel3: "#1a3b54",
    line: "rgba(100, 204, 226, 0.16)",
    lineBright: "rgba(148, 233, 244, 0.28)",
    accent: "#58c9e0",
    accentStrong: "#94e9f4",
    accentRgb: "88, 201, 224",
  },
  {
    id: "twilight",
    label: "暮光紫",
    color: "#1d1630",
    panel: "#261d3b",
    panel2: "#312347",
    panel3: "#3b2a57",
    line: "rgba(190, 153, 255, 0.16)",
    lineBright: "rgba(221, 195, 255, 0.28)",
    accent: "#ba8fff",
    accentStrong: "#e2c7ff",
    accentRgb: "186, 143, 255",
  },
] as const;

export type BackgroundThemeId = (typeof BACKGROUND_THEMES)[number]["id"];

export function normalizeBackgroundTheme(value: unknown): BackgroundThemeId {
  return BACKGROUND_THEMES.some(theme => theme.id === value)
    ? (value as BackgroundThemeId)
    : "midnight";
}
