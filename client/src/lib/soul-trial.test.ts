import { describe, expect, it } from "vitest";
import {
  findFailedAbilityRequirement,
  getAbilityValuesForRequirementCheck,
  getCombatantForBattle,
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

describe("soul trial combatant", () => {
  const soul = {
    level: 100,
    abilities: { health: 120, strength: 7, defense: 6, intelligence: 5 },
  };
  const character = {
    level: 10,
    abilities: { health: 260, strength: 18, defense: 17, intelligence: 12 },
  };

  it("uses soul level and every soul ability with independent full health", () => {
    expect(getCombatantForBattle(true, character, soul, 1)).toEqual({
      ...soul,
      currentHealth: 120,
    });
    expect(getCombatantForBattle(true, character, soul, 0).currentHealth).toBe(
      120
    );
  });

  it("does not import a stronger selected character or equipment abilities", () => {
    const strongerCharacter = {
      level: 200,
      abilities: {
        health: 9999,
        strength: 999,
        defense: 999,
        intelligence: 999,
      },
    };
    expect(getCombatantForBattle(true, strongerCharacter, soul, 9999)).toEqual(
      getCombatantForBattle(true, character, soul, 1)
    );
  });

  it("keeps a soul ability snapshot stable after source values change", () => {
    const source = { ...soul, abilities: { ...soul.abilities } };
    const combatant = getCombatantForBattle(true, character, source, 1);
    source.abilities.health = 999;
    source.abilities.strength = 999;
    source.level = 200;
    expect(combatant).toEqual({ ...soul, currentHealth: 120 });
  });

  it("preserves current character level, equipment abilities and damaged health for ordinary fights", () => {
    expect(getCombatantForBattle(false, character, soul, 50)).toEqual({
      ...character,
      currentHealth: 50,
    });
    expect(
      getCombatantForBattle(false, character, soul, 999).currentHealth
    ).toBe(260);
    expect(
      getCombatantForBattle(false, character, soul, -5).currentHealth
    ).toBe(0);
  });
});
