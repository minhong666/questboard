import { describe, expect, it } from "vitest";
import {
  getCoinsAfterCombatDeath,
  isGoldOnlyCombatDeath,
} from "./combat-death-penalty";

describe("combat death penalty", () => {
  it("uses gold-only penalties for regional bosses and soul trials", () => {
    expect(isGoldOnlyCombatDeath("boss-shadow-king-boss-2026-11-09")).toBe(
      true
    );
    expect(isGoldOnlyCombatDeath("soul-trial-boss-1-week-2026-11-09")).toBe(
      true
    );
  });

  it("keeps the existing progression penalty for ordinary monsters", () => {
    expect(isGoldOnlyCombatDeath("daily-small-2026-11-09-1")).toBe(false);
  });

  it("preserves the existing half-gold loss without allowing negative coins", () => {
    expect(getCoinsAfterCombatDeath(101)).toBe(50);
    expect(getCoinsAfterCombatDeath(1)).toBe(0);
    expect(getCoinsAfterCombatDeath(-5)).toBe(0);
  });
});
