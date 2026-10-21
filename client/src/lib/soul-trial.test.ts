import { describe, expect, it } from "vitest";
import {
  findFailedAbilityRequirement,
  getAbilityValuesForRequirementCheck,
} from "./soul-trial";

describe("soul trial ability requirements", () => {
  const soulAbilities = {
    health: 120,
    strength: 7,
    defense: 6,
    intelligence: 5,
  };
  const characterAbilitiesWithEquipment = {
    health: 260,
    strength: 18,
    defense: 17,
    intelligence: 12,
  };

  it("uses soul memory values instead of equipped character values for trials", () => {
    const trialAbilities = getAbilityValuesForRequirementCheck(
      true,
      characterAbilitiesWithEquipment,
      soulAbilities
    );

    expect(trialAbilities).toBe(soulAbilities);
    expect(
      findFailedAbilityRequirement(trialAbilities, { strength: 10 })
    ).toEqual(["strength", 10]);
    expect(
      findFailedAbilityRequirement(trialAbilities, { health: 120, defense: 6 })
    ).toBeUndefined();
  });

  it("keeps current character and equipment bonuses for ordinary monster checks", () => {
    const characterAbilities = getAbilityValuesForRequirementCheck(
      false,
      characterAbilitiesWithEquipment,
      soulAbilities
    );

    expect(characterAbilities).toBe(characterAbilitiesWithEquipment);
    expect(
      findFailedAbilityRequirement(characterAbilities, {
        strength: 10,
        defense: 10,
      })
    ).toBeUndefined();
  });
});
