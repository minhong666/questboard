import { describe, expect, it } from "vitest";
import { getUnlockedSpecialSkills } from "./class-skills";
import {
  applySpecializationToSkill,
  getDefaultSpecialization,
  getAllSpecializationSkills,
  getNextSpecializationSkillLevel,
  getUnlockedSpecializationSkills,
  getSpecializations,
  normalizeSpecialization,
} from "./class-specializations";

describe("class specializations", () => {
  it("provides two branches for every class", () => {
    expect(getSpecializations("warrior")).toHaveLength(2);
    expect(getSpecializations("archer")).toHaveLength(2);
    expect(getSpecializations("mage")).toHaveLength(2);
    expect(getSpecializations("rogue")).toHaveLength(2);
  });

  it("keeps legacy saves on the first branch for their class", () => {
    expect(normalizeSpecialization(undefined, "mage")).toBe("mage-elementalist");
    expect(normalizeSpecialization("warrior-berserker", "mage")).toBe(
      getDefaultSpecialization("mage")
    );
  });

  it("changes skill names and branch combat effects", () => {
    const skill = getUnlockedSpecialSkills("warrior", 25, 0)[0];
    const guardian = applySpecializationToSkill(
      skill,
      getSpecializations("warrior")[0]
    );
    const berserker = applySpecializationToSkill(
      skill,
      getSpecializations("warrior")[1]
    );
    expect(guardian.name).not.toBe(berserker.name);
    expect(guardian.damageBonusPercent).toBe(25);
    expect(berserker.damageBonusPercent).toBe(30);
  });

  it("uses the requested guardian defensive skill effects", () => {
    const guardianSkills = getAllSpecializationSkills(getSpecializations("warrior")[0]);
    const holyBastion = guardianSkills[0];
    const guardianVerdict = guardianSkills[1];
    expect(holyBastion.damageBonusPercent).toBe(20);
    expect(holyBastion.damageReductionPercent).toBe(30);
    expect(holyBastion.healPercentMaxHealth).toBe(5);
    expect(holyBastion.durationTurns).toBe(3);
    expect(holyBastion.cooldownTurns).toBe(5);
    expect(guardianVerdict.damageMultiplier).toBe(2.5);
    expect(guardianVerdict.defensePiercePercent).toBe(30);
    expect(guardianVerdict.damageReductionPercent).toBe(20);
    expect(guardianVerdict.durationTurns).toBe(2);
    expect(guardianVerdict.cooldownTurns).toBe(3);
    const immortalSlash = guardianSkills[2];
    expect(immortalSlash.defensePiercePercent).toBe(40);
    expect(immortalSlash.damageReductionPercent).toBe(50);
    expect(immortalSlash.durationTurns).toBe(0);
    expect(immortalSlash.cooldownTurns).toBe(8);
  });

  it("uses the requested ranger and sniper passive effects", () => {
    const rangerPassive = getAllSpecializationSkills(
      getSpecializations("archer")[0]
    )[0];
    expect(rangerPassive.effectType).toBe("passive");
    expect(rangerPassive.critDamageBonusPercent).toBe(30);
    expect(rangerPassive.dodgeRateBonusPercent).toBe(20);

    const sniperPassive = getAllSpecializationSkills(
      getSpecializations("archer")[1]
    )[0];
    expect(sniperPassive.effectType).toBe("passive");
    expect(sniperPassive.critRateBonusPercent).toBe(20);
    expect(sniperPassive.critDamageBonusPercent).toBe(30);
  });

  it("uses the requested berserker, ranger, and sniper skill effects", () => {
    const berserkerSkills = getAllSpecializationSkills(getSpecializations("warrior")[1]);
    expect(berserkerSkills[0].damageBonusPercent).toBe(40);
    expect(berserkerSkills[0].damageReductionPercent).toBe(-20);
    expect(berserkerSkills[0].durationTurns).toBe(2);
    expect(berserkerSkills[0].cooldownTurns).toBe(5);
    expect(berserkerSkills[2].damageMultiplier).toBe(4);
    expect(berserkerSkills[2].defensePiercePercent).toBe(50);
    expect(berserkerSkills[2].damageReductionPercent).toBe(-30);
    expect(berserkerSkills[2].durationTurns).toBe(3);
    expect(berserkerSkills[2].cooldownTurns).toBe(5);

    const rangerSkills = getAllSpecializationSkills(getSpecializations("archer")[0]);
    expect(rangerSkills[2].damageMultiplier).toBe(4.5);
    expect(rangerSkills[2].cooldownTurns).toBe(5);

    const sniperSkills = getAllSpecializationSkills(getSpecializations("archer")[1]);
    expect(sniperSkills[1].damageMultiplier).toBe(3);
    expect(sniperSkills[1].defensePiercePercent).toBe(35);
    expect(sniperSkills[1].cooldownTurns).toBe(5);
    expect(sniperSkills[2].defensePiercePercent).toBe(60);
    expect(sniperSkills[2].cooldownTurns).toBe(8);
  });

  it("unlocks specialization skills at levels 50, 75, and 100", () => {
    const specialization = getSpecializations("mage")[0];
    expect(getUnlockedSpecializationSkills(specialization, 49)).toHaveLength(0);
    expect(getUnlockedSpecializationSkills(specialization, 50)).toHaveLength(1);
    expect(getUnlockedSpecializationSkills(specialization, 75)).toHaveLength(2);
    expect(getUnlockedSpecializationSkills(specialization, 100)).toHaveLength(3);
    expect(getAllSpecializationSkills(specialization).map(skill => skill.unlockLevel)).toEqual([
      50,
      75,
      100,
    ]);
    expect(getNextSpecializationSkillLevel(specialization, 50)).toBe(75);
    expect(getNextSpecializationSkillLevel(specialization, 100)).toBeNull();
  });
});
