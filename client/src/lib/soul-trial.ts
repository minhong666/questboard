export type TrialAbilityKey =
  | "health"
  | "strength"
  | "defense"
  | "intelligence";
export type TrialAbilityValues = Record<TrialAbilityKey, number>;
export type TrialAbilityRequirements = Partial<Record<TrialAbilityKey, number>>;

export type TrialCombatant = {
  level: number;
  abilities: TrialAbilityValues;
  currentHealth: number;
};

export function getCombatantForBattle(
  isSoulTrial: boolean,
  character: Pick<TrialCombatant, "level" | "abilities">,
  soul: Pick<TrialCombatant, "level" | "abilities">,
  characterCurrentHealth: number
): TrialCombatant {
  const source = isSoulTrial ? soul : character;
  return {
    level: source.level,
    abilities: { ...source.abilities },
    currentHealth: isSoulTrial
      ? source.abilities.health
      : Math.max(0, Math.min(characterCurrentHealth, source.abilities.health)),
  };
}

export function getAbilityValuesForRequirementCheck(
  isSoulTrial: boolean,
  characterAbilities: TrialAbilityValues,
  soulAbilities: TrialAbilityValues
): TrialAbilityValues {
  return isSoulTrial ? soulAbilities : characterAbilities;
}

export function findFailedAbilityRequirement(
  abilities: TrialAbilityValues,
  requirements: TrialAbilityRequirements
): [TrialAbilityKey, number] | undefined {
  return (Object.entries(requirements) as [TrialAbilityKey, number][]).find(
    ([key, required]) => abilities[key] < required
  );
}
