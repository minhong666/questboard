export type ArcherTalentBonuses = {
  attackPercent: number;
  dodgePercent: number;
};

const MAX_ARCHER_DODGE_FAIL_STACKS = 18;

export function normalizeArcherDodgeFailStacks(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(MAX_ARCHER_DODGE_FAIL_STACKS, Math.max(0, Math.floor(value)))
    : 0;
}

export function getArcherTalentBonuses(
  failedDodgeStacks: number
): ArcherTalentBonuses {
  const stacks = normalizeArcherDodgeFailStacks(failedDodgeStacks);
  return {
    attackPercent: stacks * 3,
    dodgePercent: stacks * 5,
  };
}

export function getNextArcherDodgeFailStacks(
  currentStacks: number,
  dodgedSuccessfully: boolean
): number {
  return dodgedSuccessfully
    ? 0
    : Math.min(
        MAX_ARCHER_DODGE_FAIL_STACKS,
        normalizeArcherDodgeFailStacks(currentStacks) + 1
      );
}

export function getArcherEffectiveDodgeRate(
  normalDodgeRate: number,
  failedDodgeStacks: number
): number {
  const safeNormalRate = Number.isFinite(normalDodgeRate)
    ? Math.max(0, normalDodgeRate)
    : 0;
  const { dodgePercent } = getArcherTalentBonuses(failedDodgeStacks);
  return Math.min(100, safeNormalRate + 10 + dodgePercent);
}

export function applyArcherAttackBonus(
  baseDamage: number,
  failedDodgeStacks: number
): number {
  const safeBaseDamage = Number.isFinite(baseDamage)
    ? Math.max(1, baseDamage)
    : 1;
  const { attackPercent } = getArcherTalentBonuses(failedDodgeStacks);
  return Math.max(1, Math.round(safeBaseDamage * (1 + attackPercent / 100)));
}
