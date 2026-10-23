import { describe, expect, it } from "vitest";
import {
  calculateSpecialSkillDamage,
  MAX_DEFENSE_PIERCE_PERCENT,
  MIN_DEFENSE_PIERCE_PERCENT,
  getAllSpecialSkills,
  getNextSkillUnlockThreshold,
  getUnlockedSpecialSkills,
} from "./class-skills";

describe("class-specific special skills", () => {
  it("unlocks one warrior physical skill at each 25-point strength milestone", () => {
    expect(getUnlockedSpecialSkills("warrior", 24, 500)).toEqual([]);
    expect(getNextSkillUnlockThreshold("warrior", 24, 500)).toBe(25);

    const skills = getUnlockedSpecialSkills("warrior", 100, 0);
    expect(skills.map(skill => skill.requiredValue)).toEqual([25, 50, 75, 100]);
    expect(skills.map(skill => skill.name)).toEqual(["騎士之心", "戰騎斬", "狂戰重擊", "滅世斬"]);
    expect(skills.every(skill => skill.jobClass === "warrior")).toBe(true);
    expect(skills.every(skill => skill.damageType === "物理")).toBe(true);
    expect(skills.slice(2).every(skill => skill.effectType === "damage")).toBe(true);
  });

  it("adds warrior damage skills at 75 and 100 strength, then caps", () => {
    expect(getUnlockedSpecialSkills("warrior", 74, 0)).toHaveLength(2);
    expect(getNextSkillUnlockThreshold("warrior", 74, 0)).toBe(75);
    expect(getUnlockedSpecialSkills("warrior", 75, 0)).toHaveLength(3);
    expect(getNextSkillUnlockThreshold("warrior", 75, 0)).toBe(100);
    const skills = getUnlockedSpecialSkills("warrior", 125, 0);
    expect(skills).toHaveLength(4);
    expect(getNextSkillUnlockThreshold("warrior", 125, 0)).toBeNull();
  });

  it("unlocks mage magic skills from intelligence only", () => {
    expect(getUnlockedSpecialSkills("mage", 500, 24)).toEqual([]);
    const skills = getUnlockedSpecialSkills("mage", 0, 50);
    expect(skills.map(skill => skill.name)).toEqual(["火球術", "冰霜矛"]);
    expect(skills.every(skill => skill.jobClass === "mage")).toBe(true);
    expect(skills.every(skill => skill.damageType === "魔法")).toBe(true);
    expect(skills[0].statusEffect?.kind).toBe("燃燒");
    expect(skills[0].statusEffect?.element).toBe("火焰");
    expect(skills[0].description).toContain("元素效果：火焰燃燒");
    expect(skills[1].statusEffect?.kind).toBe("冰凍");
    expect(skills[1].description).toContain("冰霜冰凍");
    expect(getNextSkillUnlockThreshold("mage", 500, 50)).toBe(75);
  });

  it("unlocks archer skills at 5%, 10%, 15%, and 20% critical rate", () => {
    expect(getUnlockedSpecialSkills("archer", 500, 500, 4.9)).toEqual([]);
    expect(getNextSkillUnlockThreshold("archer", 500, 500, 4.9)).toBe(5);
    const skills = getUnlockedSpecialSkills("archer", 500, 500, 20);
    expect(skills).toHaveLength(4);
    expect(skills[0]).toMatchObject({
      name: "鷹眼",
      jobClass: "archer",
      attributeName: "暴擊率",
      requiredValue: 5,
      effectType: "passive",
      critDamageBonusPercent: 30,
      description: "暴擊傷害增加 30%。",
    });
    expect(skills.map(skill => skill.name)).toEqual(["鷹眼", "穿雲箭", "連珠箭", "破曉射擊"]);
    expect(skills.slice(1).every(skill => skill.effectType === "damage")).toBe(true);
    expect(skills.slice(1).every(skill => skill.damageMultiplier > 0)).toBe(true);
    expect(getNextSkillUnlockThreshold("archer", 500, 500, 5)).toBe(10);
    expect(getNextSkillUnlockThreshold("archer", 500, 500, 20)).toBeNull();
    expect(skills.every(skill => skill.damageType === "物理")).toBe(true);
  });

  it("unlocks three rogue physical skills at 10%, 20%, and 30% critical rate", () => {
    expect(getUnlockedSpecialSkills("rogue", 500, 500, 9.9)).toEqual([]);
    expect(getNextSkillUnlockThreshold("rogue", 500, 500, 9.9)).toBe(10);

    const firstSkill = getUnlockedSpecialSkills("rogue", 0, 0, 10);
    expect(firstSkill.map(skill => skill.name)).toEqual(["背刺"]);
    expect(firstSkill[0]).toMatchObject({
      id: "rogue-10",
      jobClass: "rogue",
      attributeName: "暴擊率",
      requiredValue: 10,
      damageType: "物理",
    });
    expect(getUnlockedSpecialSkills("rogue", 0, 0, 30).every(skill => skill.damageType === "物理")).toBe(true);
    expect(getNextSkillUnlockThreshold("rogue", 0, 0, 10)).toBe(20);

    expect(getUnlockedSpecialSkills("rogue", 0, 0, 20).map(skill => skill.name))
      .toEqual(["背刺", "影刃連擊"]);
    const allSkills = getUnlockedSpecialSkills("rogue", 0, 0, 30);
    expect(allSkills.map(skill => skill.requiredValue)).toEqual([10, 20, 30]);
    expect(allSkills.map(skill => skill.name)).toEqual([
      "背刺",
      "影刃連擊",
      "死亡標記",
    ]);
    expect(getNextSkillUnlockThreshold("rogue", 0, 0, 30)).toBeNull();
  });

  it("keeps rogue unlocks exclusive to critical rate and caps them at three", () => {
    expect(getUnlockedSpecialSkills("rogue", 1000, 1000, 0)).toEqual([]);
    expect(getUnlockedSpecialSkills("rogue", 0, 0, 99)).toHaveLength(3);
    expect(getUnlockedSpecialSkills("mage", 0, 0, 100)).toEqual([]);
  });

  it("exposes the full skill archive and calculates warrior slash damage", () => {
    expect(getAllSpecialSkills("warrior").map(skill => skill.name)).toEqual([
      "騎士之心",
      "戰騎斬",
      "狂戰重擊",
      "滅世斬",
    ]);
    const skill = getUnlockedSpecialSkills("warrior", 50, 0)[1];
    expect(skill.description).toBe("造成自身1.5倍的傷害；冷卻 4 回合。");
    expect(skill.damageMultiplier).toBe(1.5);
    expect(skill.flatDamageBonus).toBe(0);
    expect(skill.cooldownTurns).toBe(4);
    expect(calculateSpecialSkillDamage(100, 40, skill)).toBe(136);
    expect(calculateSpecialSkillDamage(1, 1000, skill)).toBe(1);
  });

  it("gives every unlocked skill a reusable 3-to-5-turn cooldown", () => {
    for (const jobClass of ["warrior", "archer", "mage", "rogue"] as const) {
      const skills = getAllSpecialSkills(jobClass);
      expect(skills.length).toBeGreaterThan(0);
      expect(skills.every(skill => skill.cooldownTurns >= 3 && skill.cooldownTurns <= 5)).toBe(true);
    }
    expect(getAllSpecialSkills("warrior").map(skill => skill.cooldownTurns)).toEqual([5, 4, 5, 3]);
  });

  it("keeps applicable defense penetration between 25% and 60%", () => {
    for (const jobClass of ["warrior", "archer", "mage", "rogue"] as const) {
      for (const skill of getAllSpecialSkills(jobClass)) {
        if (skill.effectType === "damage") {
          expect(skill.defensePiercePercent).toBeGreaterThanOrEqual(
            MIN_DEFENSE_PIERCE_PERCENT
          );
          expect(skill.defensePiercePercent).toBeLessThanOrEqual(
            MAX_DEFENSE_PIERCE_PERCENT
          );
        } else {
          expect(skill.defensePiercePercent).toBe(0);
        }
      }
    }
  });
});
