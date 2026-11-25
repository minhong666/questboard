import { describe, expect, it } from "vitest";
import {
  getAttackDamage,
  getDefenseReduction,
  getMagicAttackDamage,
  getPhysicalAttackDamage,
} from "./character-combat-stats";
import { GAME_RULES } from "./game-rules";

describe("attribute-based combat damage", () => {
  it("uses 0.5 physical damage per strength point", () => {
    expect(GAME_RULES.combat.physicalDamagePerStrengthPoint).toBe(0.5);
    expect(
      getPhysicalAttackDamage({ strength: 20, defense: 0, intelligence: 80 })
    ).toBe(10);
    expect(
      getPhysicalAttackDamage({ strength: 40, defense: 0, intelligence: 0 })
    ).toBe(20);
    expect(
      getAttackDamage({ strength: 20, defense: 0, intelligence: 80 }, "warrior")
    ).toBe(10);
  });

  it("uses 0.5 magic damage per intelligence point for mages only", () => {
    expect(GAME_RULES.combat.magicDamagePerIntelligencePoint).toBe(0.5);
    expect(
      getMagicAttackDamage({ strength: 0, defense: 0, intelligence: 20 })
    ).toBe(10);
    expect(
      getAttackDamage({ strength: 20, defense: 0, intelligence: 80 }, "mage")
    ).toBe(40);
    expect(
      getAttackDamage({ strength: 20, defense: 0, intelligence: 80 }, "archer")
    ).toBe(10);
  });

  it("reduces damage by 0.5 per defense point", () => {
    expect(GAME_RULES.combat.damageReductionPerDefensePoint).toBe(0.5);
    expect(getDefenseReduction(20)).toBe(10);
    expect(getDefenseReduction(21)).toBe(10);
    expect(getDefenseReduction(22)).toBe(11);
  });

  it("treats invalid or negative attributes as zero", () => {
    expect(
      getPhysicalAttackDamage({ strength: -10, defense: 0, intelligence: 0 })
    ).toBe(1);
    expect(
      getMagicAttackDamage({
        strength: 0,
        defense: 0,
        intelligence: Number.NaN,
      })
    ).toBe(1);
    expect(getDefenseReduction(Number.POSITIVE_INFINITY)).toBe(0);
  });
});
