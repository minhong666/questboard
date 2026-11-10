import { describe, expect, it } from "vitest";
import { getAllSpecialSkills, getUnlockedSpecialSkills } from "./class-skills";
import {
  applySkillUpgrade,
  getSkillUpgradePointsForLevelUps,
  getNextSkillUpgradePreview,
  MAX_SKILL_UPGRADE_LEVEL,
  normalizeSkillUpgradeLevels,
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
    expect(MAX_SKILL_UPGRADE_LEVEL).toBe(50);
  });

  it("increases damage skill power without changing its unlock requirement", () => {
    const skill = getUnlockedSpecialSkills("warrior", 50, 0)[1];
    const upgraded = applySkillUpgrade(skill, 2);
    expect(upgraded.requiredValue).toBe(skill.requiredValue);
    expect(upgraded.damageMultiplier).toBeCloseTo(skill.damageMultiplier * 1.1);
    expect(upgraded.defensePiercePercent).toBe(skill.defensePiercePercent);
    expect(upgraded.description).toContain("技能升級 Lv.2");
  });

  it("only increases defense penetration when the effect description declares it", () => {
    const skill = getUnlockedSpecialSkills("warrior", 50, 0)[1];
    const declaredPierceSkill = {
      ...skill,
      description: `${skill.description} 防禦穿透 ${skill.defensePiercePercent}%。`,
    };
    const upgraded = applySkillUpgrade(declaredPierceSkill, 2);
    expect(upgraded.defensePiercePercent).toBe(skill.defensePiercePercent + 4);
  });

  it("adds one percent to each buff effect per upgrade level", () => {
    const skill = getUnlockedSpecialSkills("warrior", 25, 0)[0];
    const upgraded = applySkillUpgrade(skill, 3);
    expect(upgraded.damageBonusPercent).toBe(23);
    expect(upgraded.damageReductionPercent).toBe(23);
  });

  it("caps upgraded defense penetration at 60%", () => {
    const skill = getUnlockedSpecialSkills("rogue", 0, 0, 0, 225)[2];
    const upgraded = applySkillUpgrade(skill, MAX_SKILL_UPGRADE_LEVEL);
    expect(skill.defensePiercePercent).toBe(60);
    expect(upgraded.defensePiercePercent).toBe(60);
  });

  it("previews the next damage level from the base skill, not the upgraded value", () => {
    const baseSkill = getUnlockedSpecialSkills("archer", 0, 0, 10)[1];
    const currentSkill = applySkillUpgrade(baseSkill, 4);
    const nextSkill = getNextSkillUpgradePreview(baseSkill, 4);

    expect(currentSkill.damageMultiplier).toBeCloseTo(1.92);
    expect(nextSkill?.damageMultiplier).toBeCloseTo(2);
    expect(nextSkill?.damageMultiplier).not.toBeCloseTo(2.4);
    expect(nextSkill?.defensePiercePercent).toBe(40);
  });

  it("previews buff and passive values using their actual next-level formulas", () => {
    const warriorBuff = getUnlockedSpecialSkills("warrior", 25, 0)[0];
    const nextBuff = getNextSkillUpgradePreview(warriorBuff, 4);
    expect(applySkillUpgrade(warriorBuff, 4).damageBonusPercent).toBe(24);
    expect(nextBuff?.damageBonusPercent).toBe(25);
    expect(nextBuff?.damageReductionPercent).toBe(25);

    const archerPassive = getUnlockedSpecialSkills("archer", 0, 0, 5)[0];
    const nextPassive = getNextSkillUpgradePreview(archerPassive, 4);
    expect(applySkillUpgrade(archerPassive, 4).critDamageBonusPercent).toBe(50);
    expect(nextPassive?.critDamageBonusPercent).toBe(55);
    expect(
      getNextSkillUpgradePreview(getAllSpecialSkills("warrior")[0], MAX_SKILL_UPGRADE_LEVEL)
    ).toBeNull();
  });
});
