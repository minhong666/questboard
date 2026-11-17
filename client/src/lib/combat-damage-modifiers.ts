export const MAX_DAMAGE_MODIFIER_PERCENT = 80;

const finitePercentOrZero = (percent: number) =>
  Number.isFinite(percent) ? percent : 0;

export function capCombinedDamageModifierPercent(
  percentages: readonly number[]
): number {
  const total = percentages.reduce(
    (sum, percent) => sum + finitePercentOrZero(percent),
    0
  );
  return Math.min(MAX_DAMAGE_MODIFIER_PERCENT, total);
}

export function getCappedDamageBonusMultiplier(
  bonusPercentages: readonly number[]
): number {
  const multiplier = bonusPercentages.reduce(
    (product, percent) => product * (1 + finitePercentOrZero(percent) / 100),
    1
  );
  if (Number.isNaN(multiplier)) return 1;
  return Math.min(
    1 + MAX_DAMAGE_MODIFIER_PERCENT / 100,
    Math.max(0, multiplier)
  );
}

export function getCappedDamageReductionMultiplier(
  reductionPercentages: readonly number[]
): number {
  const multiplier = reductionPercentages.reduce(
    (product, percent) => product * (1 - finitePercentOrZero(percent) / 100),
    1
  );
  if (Number.isNaN(multiplier)) return 1;
  return Math.max(1 - MAX_DAMAGE_MODIFIER_PERCENT / 100, multiplier);
}
