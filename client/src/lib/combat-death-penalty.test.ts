import { describe, expect, it } from "vitest";
import {
  applyCombatDeathPenalty,
  getCoinsAfterCombatDeath,
  isGoldOnlyCombatDeath,
} from "./combat-death-penalty";

describe("combat death penalty", () => {
  it("uses gold-only penalties for every monster type", () => {
    expect(isGoldOnlyCombatDeath("daily-small-2026-11-09-1")).toBe(true);
    expect(isGoldOnlyCombatDeath("boss-shadow-king-boss-2026-11-09")).toBe(
      true
    );
    expect(isGoldOnlyCombatDeath("soul-trial-boss-1-week-2026-11-09")).toBe(
      true
    );
  });

  it("changes only coins and preserves abilities and character progression", () => {
    const previousState = {
      coins: 101,
      abilities: { health: 500, strength: 20, defense: 18, intelligence: 16 },
      currentHealth: 190,
      totalXp: 3_250,
      abilityLevel: 13,
      abilityPoints: 7,
      skillUpgradePoints: 4,
    };

    expect(applyCombatDeathPenalty(previousState)).toEqual({
      ...previousState,
      coins: 50,
    });
    expect(previousState.coins).toBe(101);
  });

  it("preserves the existing half-gold loss without allowing negative coins", () => {
    expect(getCoinsAfterCombatDeath(101)).toBe(50);
    expect(getCoinsAfterCombatDeath(1)).toBe(0);
    expect(getCoinsAfterCombatDeath(-5)).toBe(0);
  });
});
