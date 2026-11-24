import { describe, expect, it } from "vitest";
import {
  capEffectiveDodgeRate,
  capPlayerCombatStatUpgradeValue,
  getEffectiveCombatStatWithBonuses,
  getNextPlayerCombatStatUpgradeValue,
  PLAYER_COMBAT_STAT_UPGRADE_CAPS,
} from "./player-combat-stat-upgrades";

describe("player combat stat upgrade caps", () => {
  it("sets the requested upgrade limits", () => {
    expect(PLAYER_COMBAT_STAT_UPGRADE_CAPS).toEqual({
      critRate: 50,
      critDamage: 180,
      dodgeRate: 50,
    });
  });

  it.each([
    ["critRate", 49, 1, 50],
    ["critRate", 49.75, 0.5, 50],
    ["critDamage", 177.5, 2.5, 180],
    ["critDamage", 179, 1.25, 180],
    ["dodgeRate", 49, 1, 50],
    ["dodgeRate", 49.75, 0.5, 50],
  ] as const)(
    "does not over-upgrade %s near its limit",
    (stat, current, increment, expected) => {
      expect(
        getNextPlayerCombatStatUpgradeValue(stat, current, increment)
      ).toBe(expected);
      expect(
        getNextPlayerCombatStatUpgradeValue(stat, expected, increment)
      ).toBe(expected);
    }
  );

  it("clamps saved upgrade values above the new limits", () => {
    expect(capPlayerCombatStatUpgradeValue("critRate", 72)).toBe(50);
    expect(capPlayerCombatStatUpgradeValue("critDamage", 240)).toBe(180);
    expect(capPlayerCombatStatUpgradeValue("dodgeRate", 75)).toBe(50);
  });

  it("caps total effective dodge after equipment and passive bonuses", () => {
    expect(capEffectiveDodgeRate(38)).toBe(38);
    expect(capEffectiveDodgeRate(100)).toBe(50);
    expect(capEffectiveDodgeRate(-5)).toBe(0);
    expect(capEffectiveDodgeRate(Number.NaN)).toBe(0);
  });

  it("applies limits to upgrade values before adding non-upgrade bonuses", () => {
    expect(getEffectiveCombatStatWithBonuses("critRate", 50, [12, 5])).toBe(67);
    expect(getEffectiveCombatStatWithBonuses("critDamage", 180, [35])).toBe(
      215
    );
    expect(getEffectiveCombatStatWithBonuses("dodgeRate", 30, [8])).toBe(38);
  });
});
