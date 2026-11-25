import { describe, expect, it } from "vitest";
import {
  ABILITY_POINT_EFFECTIVENESS,
  getAbilityPointAttributeGain,
  getAbilityPointCombatGain,
  getAbilityPointBudgetAfterMigration,
  getRebalancedAbilityPointBudget,
  getVersion1AbilityPointAttributeGain,
} from "./ability-point-rules";
import { GAME_RULES } from "./game-rules";

describe("ability point balance rules", () => {
  it("awards three points per level and increases each non-health attribute by one", () => {
    expect(GAME_RULES.combat.physicalDamagePerStrengthPoint).toBe(0.5);
    expect(GAME_RULES.combat.magicDamagePerIntelligencePoint).toBe(0.5);
    expect(GAME_RULES.combat.damageReductionPerDefensePoint).toBe(0.5);
    expect(GAME_RULES.progression.abilityPointsPerLevel).toBe(3);
    expect(GAME_RULES.abilityPoints.combatEffectivenessPercent).toBe(50);
    expect(ABILITY_POINT_EFFECTIVENESS).toBe(0.5);
    expect(getAbilityPointAttributeGain("health")).toBe(10);
    expect(getAbilityPointAttributeGain("strength")).toBe(1);
    expect(getAbilityPointAttributeGain("defense")).toBe(1);
    expect(getAbilityPointAttributeGain("intelligence")).toBe(1);
    expect(getVersion1AbilityPointAttributeGain("strength")).toBe(0.5);
    expect(getVersion1AbilityPointAttributeGain("intelligence")).toBe(0.5);
    expect(getAbilityPointCombatGain("critRate")).toBe(0.5);
    expect(getAbilityPointCombatGain("critRate", "rogue")).toBe(1.5);
    expect(getAbilityPointCombatGain("critRate", "warrior")).toBe(0.5);
    expect(getAbilityPointCombatGain("critDamage")).toBe(1);
    expect(getAbilityPointCombatGain("dodgeRate")).toBe(0.5);
  });

  it("recalculates a level-50 legacy character to the new level-up budget", () => {
    expect(
      getRebalancedAbilityPointBudget({
        level: 50,
        legacySpentPoints: 245,
        availablePoints: 0,
      })
    ).toBe(147);
  });

  it("preserves point rewards from non-level sources", () => {
    expect(
      getRebalancedAbilityPointBudget({
        level: 14,
        legacySpentPoints: 20,
        availablePoints: 50,
      })
    ).toBe(44);
  });

  it("does not change the point pool for a level-one character", () => {
    expect(
      getRebalancedAbilityPointBudget({
        level: 1,
        legacySpentPoints: 3,
        availablePoints: 2,
      })
    ).toBe(5);
  });

  it("refunds all spent points when migrating a version-one save", () => {
    expect(
      getAbilityPointBudgetAfterMigration({
        previousRulesVersion: 1,
        level: 14,
        spentPoints: 9,
        availablePoints: 4,
      })
    ).toBe(13);
  });
});
