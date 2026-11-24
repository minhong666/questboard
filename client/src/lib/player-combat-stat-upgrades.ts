export const PLAYER_COMBAT_STAT_UPGRADE_CAPS = {
  critRate: 50,
  critDamage: 180,
  dodgeRate: 50,
} as const;

export const MAX_EFFECTIVE_DODGE_RATE_PERCENT = 50;

export function capEffectiveDodgeRate(value: number) {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  return Math.min(MAX_EFFECTIVE_DODGE_RATE_PERCENT, safeValue);
}

export type PlayerCombatStatUpgradeKey =
  keyof typeof PLAYER_COMBAT_STAT_UPGRADE_CAPS;

export function capPlayerCombatStatUpgradeValue(
  stat: PlayerCombatStatUpgradeKey,
  value: number
) {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  return Math.min(PLAYER_COMBAT_STAT_UPGRADE_CAPS[stat], safeValue);
}

export function getNextPlayerCombatStatUpgradeValue(
  stat: PlayerCombatStatUpgradeKey,
  currentValue: number,
  increment: number
) {
  const current = capPlayerCombatStatUpgradeValue(stat, currentValue);
  const safeIncrement = Number.isFinite(increment) ? Math.max(0, increment) : 0;
  return capPlayerCombatStatUpgradeValue(stat, current + safeIncrement);
}

export function getEffectiveCombatStatWithBonuses(
  stat: PlayerCombatStatUpgradeKey,
  upgradeValue: number,
  nonUpgradeBonuses: readonly number[]
) {
  return (
    capPlayerCombatStatUpgradeValue(stat, upgradeValue) +
    nonUpgradeBonuses.reduce(
      (total, bonus) => total + (Number.isFinite(bonus) ? bonus : 0),
      0
    )
  );
}
