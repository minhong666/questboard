import { describe, expect, it } from "vitest";
import { getUnlockedSpecialSkills } from "./class-skills";
import {
  applySkillUpgrade,
  getSkillUpgradePointsForLevelUps,
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
    expect(upgraded.defensePiercePercent).toBe(skill.defensePiercePercent + 4);
    expect(upgraded.description).toContain("技能升級 Lv.2");
  });

  it("adds one percent to each buff effect per upgrade level", () => {
    const skill = getUnlockedSpecialSkills("warrior", 25, 0)[0];
    const upgraded = applySkillUpgrade(skill, 3);
    expect(upgraded.damageBonusPercent).toBe(23);
    expect(upgraded.damageReductionPercent).toBe(23);
  });

  it("caps upgraded defense penetration at 60%", () => {
    const skill = getUnlockedSpecialSkills("rogue", 0, 0, 30)[2];
    const upgraded = applySkillUpgrade(skill, MAX_SKILL_UPGRADE_LEVEL);
    expect(skill.defensePiercePercent).toBe(60);
    expect(upgraded.defensePiercePercent).toBe(60);
  });
});
