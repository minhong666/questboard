import { describe, expect, it } from "vitest";
import {
  calculateSpecialSkillDamage,
  MAX_DEFENSE_PIERCE_PERCENT,
  MIN_DEFENSE_PIERCE_PERCENT,
  getAllSpecialSkills,
  getNextSkillUnlockThreshold,
  getUnlockedSpecialSkills,
} from "./class-skills";
import { applyMonsterGroupSkillDamage } from "./monster-combat";

describe("class-specific special skills", () => {
  it("unlocks one warrior physical skill at each 25-point strength milestone", () => {
    expect(getUnlockedSpecialSkills("warrior", 24, 500)).toEqual([]);
    expect(getNextSkillUnlockThreshold("warrior", 24, 500)).toBe(25);

    const skills = getUnlockedSpecialSkills("warrior", 100, 0);
    expect(skills.map(skill => skill.requiredValue)).toEqual([25, 50, 75, 100]);
    expect(skills.map(skill => skill.name)).toEqual([
      "騎士之心",
      "戰騎斬",
      "狂戰重擊",
      "滅世斬",
    ]);
    expect(skills.every(skill => skill.jobClass === "warrior")).toBe(true);
    expect(skills.every(skill => skill.damageType === "物理")).toBe(true);
    expect(skills.slice(2).every(skill => skill.effectType === "damage")).toBe(
      true
    );
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

  it("uses the requested mage fireball and meteor damage rules", () => {
    const skills = getAllSpecialSkills("mage");
    expect(skills[0]).toMatchObject({
      name: "火球術",
      damageMultiplier: 1.5,
      cooldownTurns: 3,
    });
    expect(skills[3]).toMatchObject({
      name: "隕星術",
      damageMultiplier: 3,
      defensePiercePercent: 50,
      cooldownTurns: 5,
      targetMode: "all",
      statusEffect: {
        kind: "石化",
        element: "奧術",
        chance: 1,
        durationTurns: 2,
        damagePerTurn: 5,
        breakDamageThreshold: 200,
        breakDamage: 25,
      },
    });
    expect(skills[3].description).toContain("對所有敵人");
    expect(skills[3].description).toContain("石化");
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
    expect(skills.map(skill => skill.name)).toEqual([
      "鷹眼",
      "穿雲箭",
      "連珠箭",
      "破曉射擊",
    ]);
    expect(skills.slice(1).every(skill => skill.effectType === "damage")).toBe(
      true
    );
    expect(skills.slice(1).every(skill => skill.damageMultiplier > 0)).toBe(
      true
    );
    expect(skills[1]).toMatchObject({
      damageMultiplier: 1.6,
      defensePiercePercent: 30,
      cooldownTurns: 4,
      targetMode: "two",
      damageType: "物理",
    });
    expect(skills[2]).toMatchObject({
      damageMultiplier: 2,
      defensePiercePercent: 40,
      cooldownTurns: 4,
      targetMode: "all",
      damageType: "物理",
    });
    expect(skills[3]).toMatchObject({
      damageMultiplier: 3,
      defensePiercePercent: 0,
      cooldownTurns: 5,
      damageType: "物理",
    });
    expect(getNextSkillUnlockThreshold("archer", 500, 500, 5)).toBe(10);
    expect(getNextSkillUnlockThreshold("archer", 500, 500, 20)).toBeNull();
    expect(skills.every(skill => skill.damageType === "物理")).toBe(true);
  });

  it("unlocks four rogue physical skills at 170%, 200%, 225%, and 250% critical damage", () => {
    expect(getUnlockedSpecialSkills("rogue", 500, 500, 0, 169.9)).toEqual([]);
    expect(getNextSkillUnlockThreshold("rogue", 500, 500, 0, 169.9)).toBe(170);

    const firstSkill = getUnlockedSpecialSkills("rogue", 0, 0, 0, 170);
    expect(firstSkill.map(skill => skill.name)).toEqual(["背刺"]);
    expect(firstSkill[0]).toMatchObject({
      id: "rogue-170",
      jobClass: "rogue",
      attributeName: "暴擊傷害",
      requiredValue: 170,
      damageType: "物理",
    });
    const at200 = getUnlockedSpecialSkills("rogue", 0, 0, 0, 200);
    expect(at200.map(skill => skill.name)).toEqual(["背刺", "順影鏢殺"]);
    expect(at200[1]).toMatchObject({
      damageMultiplier: 2.3,
      defensePiercePercent: 0,
      targetMode: "all",
    });
    expect(
      getUnlockedSpecialSkills("rogue", 0, 0, 0, 250).every(
        skill => skill.damageType === "物理"
      )
    ).toBe(true);
    expect(getNextSkillUnlockThreshold("rogue", 0, 0, 0, 170)).toBe(200);

    const allSkills = getUnlockedSpecialSkills("rogue", 0, 0, 0, 250);
    expect(allSkills.map(skill => skill.requiredValue)).toEqual([
      170, 200, 225, 250,
    ]);
    expect(allSkills.map(skill => skill.name)).toEqual([
      "背刺",
      "順影鏢殺",
      "影刃連擊",
      "死亡標記",
    ]);
    expect(getNextSkillUnlockThreshold("rogue", 0, 0, 0, 250)).toBeNull();
  });

  it("keeps rogue unlocks exclusive to critical damage and caps them at four", () => {
    expect(getUnlockedSpecialSkills("rogue", 1000, 1000, 0, 0)).toEqual([]);
    expect(getUnlockedSpecialSkills("rogue", 0, 0, 0, 250)).toHaveLength(4);
    expect(getUnlockedSpecialSkills("mage", 0, 0, 100)).toEqual([]);
  });

  it("exposes the full skill archive and calculates warrior slash damage", () => {
    expect(getAllSpecialSkills("warrior").map(skill => skill.name)).toEqual([
      "騎士之心",
      "戰騎斬",
      "狂戰重擊",
      "滅世斬",
    ]);
    const knightHeart = getUnlockedSpecialSkills("warrior", 25, 0)[0];
    expect(knightHeart.name).toBe("騎士之心");
    expect(knightHeart.durationTurns).toBe(3);
    expect(knightHeart.description).toContain("持續 3 回合");
    const skill = getUnlockedSpecialSkills("warrior", 50, 0)[1];
    expect(skill.description).toBe(
      "物理技能，對單一敵人造成自身 1.50 倍傷害；冷卻 4 回合。"
    );
    expect(skill.damageMultiplier).toBe(1.5);
    expect(skill.targetMode).toBe("single");
    expect(skill.flatDamageBonus).toBe(0);
    expect(skill.cooldownTurns).toBe(4);
    expect(calculateSpecialSkillDamage(100, 40, skill)).toBe(136);
    expect(calculateSpecialSkillDamage(1, 1000, skill)).toBe(1);
    const berserkerStrike = getUnlockedSpecialSkills("warrior", 75, 0)[2];
    expect(berserkerStrike.name).toBe("狂戰重擊");
    expect(berserkerStrike.targetMode).toBe("all");
    expect(berserkerStrike.description).toContain("對所有敵人");
  });

  it("uses generated target modes to damage only the selected target or every living enemy", () => {
    const members = [
      { id: "enemy-1", health: 40, maxHealth: 40 },
      { id: "enemy-2", health: 50, maxHealth: 50 },
      { id: "enemy-3", health: 0, maxHealth: 40 },
    ];
    const warriorSkills = getUnlockedSpecialSkills("warrior", 75, 0);
    const slash = warriorSkills[1];
    const berserkerStrike = warriorSkills[2];

    const slashResult = applyMonsterGroupSkillDamage(
      members,
      20,
      slash.targetMode!,
      "enemy-2"
    );
    expect(slashResult.damageByMember).toEqual({ "enemy-2": 20 });
    expect(slashResult.members.map(member => member.health)).toEqual([
      40, 30, 0,
    ]);

    const berserkerResult = applyMonsterGroupSkillDamage(
      members,
      20,
      berserkerStrike.targetMode!,
      "enemy-2"
    );
    expect(berserkerResult.damageByMember).toEqual({
      "enemy-1": 20,
      "enemy-2": 20,
    });
    expect(berserkerResult.members.map(member => member.health)).toEqual([
      20, 30, 0,
    ]);
  });

  it("gives every unlocked skill a reusable 3-to-5-turn cooldown", () => {
    for (const jobClass of ["warrior", "archer", "mage", "rogue"] as const) {
      const skills = getAllSpecialSkills(jobClass);
      expect(skills.length).toBeGreaterThan(0);
      expect(
        skills.every(
          skill => skill.cooldownTurns >= 3 && skill.cooldownTurns <= 5
        )
      ).toBe(true);
    }
    expect(
      getAllSpecialSkills("warrior").map(skill => skill.cooldownTurns)
    ).toEqual([5, 4, 5, 5]);
  });

  it("keeps applicable defense penetration between 25% and 60%", () => {
    for (const jobClass of ["warrior", "archer", "mage", "rogue"] as const) {
      for (const skill of getAllSpecialSkills(jobClass)) {
        if (skill.effectType === "damage" && skill.defensePiercePercent > 0) {
          expect(skill.defensePiercePercent).toBeGreaterThanOrEqual(
            MIN_DEFENSE_PIERCE_PERCENT
          );
          expect(skill.defensePiercePercent).toBeLessThanOrEqual(
            MAX_DEFENSE_PIERCE_PERCENT
          );
        } else if (skill.effectType !== "damage") {
          expect(skill.defensePiercePercent).toBe(0);
        }
      }
    }
  });
});
