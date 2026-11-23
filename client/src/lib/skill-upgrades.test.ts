import { describe, expect, it } from "vitest";
import {
  getAllSpecialSkills,
  getUnlockedSpecialSkills,
} from "./class-skills";
import {
  getAllSpecializationSkills,
  getAllSpecializations,
} from "./class-specializations";
import {
  applySkillUpgrade,
  getSkillUpgradePointsForLevelUps,
  getNextSkillUpgradePreview,
  isSkillUpgradeable,
  MAX_SKILL_UPGRADE_LEVEL,
  normalizeSkillUpgradeLevels,
  normalizeSkillUpgradeState,
} from "./skill-upgrades";

describe("skill upgrades", () => {
  it("awards one skill point for each level gained", () => {
    expect(getSkillUpgradePointsForLevelUps(3)).toBe(3);
    expect(getSkillUpgradePointsForLevelUps(0)).toBe(0);
    expect(getSkillUpgradePointsForLevelUps(-2)).toBe(0);
  });

  it("normalizes saved skill upgrade levels", () => {
    expect(
      normalizeSkillUpgradeLevels({ "warrior-50": 2.9, "warrior-75": 99, invalid: -1 })
    ).toEqual({ "warrior-50": 2, "warrior-75": MAX_SKILL_UPGRADE_LEVEL });
    expect(MAX_SKILL_UPGRADE_LEVEL).toBe(15);
  });

  it("refunds every saved upgrade level above the cap", () => {
    expect(
      normalizeSkillUpgradeState({ first: 18, second: 15, third: 20.8 })
    ).toEqual({
      levels: { first: 15, second: 15, third: 15 },
      refundedPoints: 8,
    });
  });

  it("increases damage skill power by 2.5% per upgrade level", () => {
    const skill = getUnlockedSpecialSkills("warrior", 50, 0)[1];
    const upgraded = applySkillUpgrade(skill, 2);
    expect(upgraded.requiredValue).toBe(skill.requiredValue);
    expect(upgraded.damageMultiplier).toBeCloseTo(skill.damageMultiplier * 1.05);
    expect(upgraded.defensePiercePercent).toBe(skill.defensePiercePercent);
    expect(upgraded.description).toContain("技能升級 Lv.2");
  });

  it("keeps defense penetration fixed at every skill upgrade level", () => {
    const skill = getUnlockedSpecialSkills("warrior", 50, 0)[1];
    const declaredPierceSkill = {
      ...skill,
      defensePiercePercent: 42,
      description: `${skill.description} 防禦穿透 42%。`,
    };
    const upgraded = applySkillUpgrade(
      declaredPierceSkill,
      MAX_SKILL_UPGRADE_LEVEL
    );
    expect(upgraded.defensePiercePercent).toBe(42);
  });

  it("adds 0.5 percentage points to each buff effect per upgrade level", () => {
    const skill = getUnlockedSpecialSkills("warrior", 25, 0)[0];
    const upgraded = applySkillUpgrade(skill, 3);
    expect(upgraded.damageBonusPercent).toBe(21.5);
    expect(upgraded.damageReductionPercent).toBe(21.5);
  });

  it("scales reduction on damage skills by 0.5 percentage points per level", () => {
    const guardian = getAllSpecializations().find(
      specialization => specialization.id === "warrior-guardian"
    )!;
    const judgment = getAllSpecializationSkills(guardian)[1];
    const upgraded = applySkillUpgrade(judgment, 3);

    expect(judgment.effectType).toBe("damage");
    expect(judgment.damageReductionPercent).toBe(20);
    expect(upgraded.damageReductionPercent).toBe(21.5);
    const judgmentWithDamageBonus = {
      ...judgment,
      damageBonusPercent: 8,
    };
    expect(
      applySkillUpgrade(judgmentWithDamageBonus, 3).damageBonusPercent
    ).toBe(9.5);
    expect(upgraded.damageMultiplier).toBeCloseTo(
      judgment.damageMultiplier * 1.075
    );
  });

  it("previews the next damage level from the base skill, not the upgraded value", () => {
    const baseSkill = getUnlockedSpecialSkills("archer", 0, 0, 10)[1];
    const currentSkill = applySkillUpgrade(baseSkill, 4);
    const nextSkill = getNextSkillUpgradePreview(baseSkill, 4);
    expect(currentSkill.damageMultiplier).toBeCloseTo(1.76);
    expect(nextSkill?.damageMultiplier).toBeCloseTo(1.8);
    expect(nextSkill?.damageMultiplier).not.toBeCloseTo(2.4);
    expect(nextSkill?.defensePiercePercent).toBe(baseSkill.defensePiercePercent);
  });

  it("keeps critical-damage passives fixed and prevents their upgrade preview", () => {
    const archerPassive = getUnlockedSpecialSkills("archer", 0, 0, 5)[0];
    expect(isSkillUpgradeable(archerPassive)).toBe(false);
    expect(applySkillUpgrade(archerPassive, 4)).toEqual(archerPassive);
    expect(applySkillUpgrade(archerPassive, MAX_SKILL_UPGRADE_LEVEL)).toEqual(
      archerPassive
    );
    expect(getNextSkillUpgradePreview(archerPassive, 0)).toBeNull();
    expect(getNextSkillUpgradePreview(archerPassive, 4)).toBeNull();
  });

  it("refunds legacy upgrade points spent on every passive skill", () => {
    const passiveSkillIds = [
      ...getAllSpecialSkills("archer"),
      ...getAllSpecializations().flatMap(specialization =>
        getAllSpecializationSkills(specialization)
      ),
    ]
      .filter(skill => skill.effectType === "passive")
      .map(skill => skill.id);
    const legacyPassiveLevels = Object.fromEntries(
      passiveSkillIds.map(skillId => [skillId, 2])
    );
    const normalized = normalizeSkillUpgradeState({
      ...legacyPassiveLevels,
      "warrior-50": 3,
    });

    expect(passiveSkillIds).toContain("archer-5");
    expect(normalized.refundedPoints).toBe(passiveSkillIds.length * 2);
    expect(normalized.levels).toEqual({ "warrior-50": 3 });
  });

  it("returns no next-level preview at the upgrade cap", () => {
    expect(
      getNextSkillUpgradePreview(getAllSpecialSkills("warrior")[0], MAX_SKILL_UPGRADE_LEVEL)
    ).toBeNull();
  });
});
