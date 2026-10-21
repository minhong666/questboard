export type TrialAbilityKey =
  | "health"
  | "strength"
  | "defense"
  | "intelligence";
export type TrialAbilityValues = Record<TrialAbilityKey, number>;
export type TrialAbilityRequirements = Partial<
  Record<TrialAbilityKey, number>
>;

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
  return (
    Object.entries(requirements) as [TrialAbilityKey, number][]
  ).find(([key, required]) => abilities[key] < required);
}
