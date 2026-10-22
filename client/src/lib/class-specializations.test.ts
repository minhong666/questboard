import { describe, expect, it } from "vitest";
import { getUnlockedSpecialSkills } from "./class-skills";
import {
  applySpecializationToSkill,
  getDefaultSpecialization,
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
});
