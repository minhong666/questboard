import { describe, expect, it } from "vitest";
import {
  capEffectiveDodgeRate,
  capPlayerCombatStatUpgradeValue,
  getEffectiveCombatStatWithBonuses,
  getNextPlayerCombatStatUpgradeValue,
  getPlayerCombatStatUpgradeCap,
  PLAYER_COMBAT_STAT_UPGRADE_CAPS,
} from "./player-combat-stat-upgrades";

describe("player combat stat upgrade caps", () => {
  it("sets the requested upgrade limits", () => {
    expect(PLAYER_COMBAT_STAT_UPGRADE_CAPS).toEqual({
      critRate: 50,
      critDamage: 200,
      dodgeRate: 50,
    });
  });

  it.each([
    ["critRate", 49, 1, 50],
    ["critRate", 49.75, 0.5, 50],
    ["critDamage", 197.5, 2.5, 200],
    ["critDamage", 199, 1.25, 200],
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
    expect(capPlayerCombatStatUpgradeValue("critDamage", 240)).toBe(200);
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
    expect(getEffectiveCombatStatWithBonuses("critDamage", 200, [35])).toBe(235);
    expect(
      getEffectiveCombatStatWithBonuses("critDamage", 300, [], "rogue")
    ).toBe(300);
    expect(getEffectiveCombatStatWithBonuses("dodgeRate", 30, [8])).toBe(38);
  });

  it("uses a 300% critical-damage cap for rogues and 200% for other classes", () => {
    expect(getPlayerCombatStatUpgradeCap("critDamage", "rogue")).toBe(300);
    expect(getPlayerCombatStatUpgradeCap("critDamage", "mage")).toBe(200);
    expect(capPlayerCombatStatUpgradeValue("critDamage", 350, "rogue")).toBe(300);
    expect(
      getNextPlayerCombatStatUpgradeValue("critDamage", 299, 5, "rogue")
    ).toBe(300);
  });
});
