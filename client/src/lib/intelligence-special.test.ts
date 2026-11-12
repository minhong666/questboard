import { describe, expect, it } from "vitest";
import {
  getIntelligenceExperienceBonusPercent,
  MAX_INTELLIGENCE_XP_BONUS_PERCENT,
} from "./intelligence-special";

describe("intelligence special", () => {
  it("grants 0.1% experience bonus per intelligence", () => {
    expect(getIntelligenceExperienceBonusPercent(1)).toBe(0.1);
    expect(getIntelligenceExperienceBonusPercent(250)).toBe(25);
  });

  it("caps the experience bonus at 50%", () => {
    expect(getIntelligenceExperienceBonusPercent(500)).toBe(
      MAX_INTELLIGENCE_XP_BONUS_PERCENT
    );
    expect(getIntelligenceExperienceBonusPercent(9999)).toBe(
      MAX_INTELLIGENCE_XP_BONUS_PERCENT
    );
  });

  it("does not produce a bonus for negative intelligence", () => {
    expect(getIntelligenceExperienceBonusPercent(-10)).toBe(0);
  });
});
