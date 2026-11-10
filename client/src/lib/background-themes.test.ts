import { describe, expect, it } from "vitest";
import {
  BACKGROUND_THEMES,
  normalizeBackgroundTheme,
} from "./background-themes";

describe("background UI themes", () => {
  it("provides coordinated background, panel, border and accent colors", () => {
    expect(BACKGROUND_THEMES).toHaveLength(5);
    for (const theme of BACKGROUND_THEMES) {
      expect(theme.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(theme.panel).toMatch(/^#[0-9a-f]{6}$/i);
      expect(theme.panel2).toMatch(/^#[0-9a-f]{6}$/i);
      expect(theme.panel3).toMatch(/^#[0-9a-f]{6}$/i);
      expect(theme.accent).toMatch(/^#[0-9a-f]{6}$/i);
      expect(theme.accentRgb).toMatch(/^\d{1,3}, \d{1,3}, \d{1,3}$/);
      expect(theme.line).toContain("rgba(");
      expect(theme.lineBright).toContain("rgba(");
    }
  });

  it("normalizes unknown saved themes to the existing midnight default", () => {
    expect(normalizeBackgroundTheme("forest")).toBe("forest");
    expect(normalizeBackgroundTheme("missing-theme")).toBe("midnight");
    expect(normalizeBackgroundTheme(null)).toBe("midnight");
  });
});
