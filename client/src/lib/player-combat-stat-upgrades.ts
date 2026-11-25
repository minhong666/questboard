export const PLAYER_COMBAT_STAT_UPGRADE_CAPS = {
  critRate: 50,
  critDamage: 200,
  dodgeRate: 50,
} as const;

export type PlayerCombatJobClass = "warrior" | "archer" | "mage" | "rogue";

export const MAX_EFFECTIVE_DODGE_RATE_PERCENT = 50;

export function getPlayerCombatStatUpgradeCap(
  stat: PlayerCombatStatUpgradeKey,
  jobClass?: PlayerCombatJobClass
) {
  if (stat === "critDamage" && jobClass === "rogue") return 300;
  return PLAYER_COMBAT_STAT_UPGRADE_CAPS[stat];
}

export function capEffectiveDodgeRate(value: number) {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  return Math.min(MAX_EFFECTIVE_DODGE_RATE_PERCENT, safeValue);
}

export type PlayerCombatStatUpgradeKey =
  keyof typeof PLAYER_COMBAT_STAT_UPGRADE_CAPS;

export function capPlayerCombatStatUpgradeValue(
  stat: PlayerCombatStatUpgradeKey,
  value: number,
  jobClass?: PlayerCombatJobClass
) {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  return Math.min(getPlayerCombatStatUpgradeCap(stat, jobClass), safeValue);
}

export function getNextPlayerCombatStatUpgradeValue(
  stat: PlayerCombatStatUpgradeKey,
  currentValue: number,
  increment: number,
  jobClass?: PlayerCombatJobClass
) {
  const current = capPlayerCombatStatUpgradeValue(stat, currentValue, jobClass);
  const safeIncrement = Number.isFinite(increment) ? Math.max(0, increment) : 0;
  return capPlayerCombatStatUpgradeValue(
    stat,
    current + safeIncrement,
    jobClass
  );
}

export function getEffectiveCombatStatWithBonuses(
  stat: PlayerCombatStatUpgradeKey,
  upgradeValue: number,
  nonUpgradeBonuses: readonly number[],
  jobClass?: PlayerCombatJobClass
) {
  return (
    capPlayerCombatStatUpgradeValue(stat, upgradeValue, jobClass) +
    nonUpgradeBonuses.reduce(
      (total, bonus) => total + (Number.isFinite(bonus) ? bonus : 0),
      0
    )
  );
}
