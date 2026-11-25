import { GAME_RULES } from "./game-rules";

export const LEGACY_ABILITY_POINTS_PER_LEVEL = 5;
export const ABILITY_POINT_SYSTEM_VERSION = 2;
export const ABILITY_POINT_EFFECTIVENESS =
  GAME_RULES.abilityPoints.combatEffectivenessPercent / 100;

export type AbilityPointAttribute =
  | "health"
  | "strength"
  | "defense"
  | "intelligence";

export type AbilityPointCombatStat =
  | "critRate"
  | "critDamage"
  | "dodgeRate"
  | "castSpeedPercent";

const LEGACY_ATTRIBUTE_GAIN: Record<AbilityPointAttribute, number> = {
  health: 10,
  strength: 1,
  defense: 1,
  intelligence: 1,
};

const LEGACY_COMBAT_GAIN: Record<AbilityPointCombatStat, number> = {
  critRate: 1,
  critDamage: 2,
  dodgeRate: 1,
  castSpeedPercent: 1,
};

export function getAbilityPointAttributeGain(key: AbilityPointAttribute) {
  return LEGACY_ATTRIBUTE_GAIN[key];
}

/** Attribute gain used by saves created under ability-point rules version 1. */
export function getVersion1AbilityPointAttributeGain(
  key: AbilityPointAttribute
) {
  return key === "health"
    ? LEGACY_ATTRIBUTE_GAIN.health
    : LEGACY_ATTRIBUTE_GAIN[key] * ABILITY_POINT_EFFECTIVENESS;
}

export function getAbilityPointCombatGain(
  key: AbilityPointCombatStat,
  jobClass?: "warrior" | "archer" | "mage" | "rogue"
) {
  if (key === "critRate" && jobClass === "rogue") return 1.5;
  return LEGACY_COMBAT_GAIN[key] * ABILITY_POINT_EFFECTIVENESS;
}

export function getLegacyAbilityPointAttributeGain(key: AbilityPointAttribute) {
  return LEGACY_ATTRIBUTE_GAIN[key];
}

export function getLegacyAbilityPointCombatGain(key: AbilityPointCombatStat) {
  return LEGACY_COMBAT_GAIN[key];
}

function nonNegativeInteger(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

/**
 * Respecs legacy investments and recomputes the point pool under the new rules.
 * Non-level sources (tasks, timers, shop purchases, etc.) are preserved.
 */
export function getRebalancedAbilityPointBudget(input: {
  level: number;
  legacySpentPoints: number;
  availablePoints: number;
}) {
  const level = Math.max(1, nonNegativeInteger(input.level));
  const levelUps = Math.max(0, level - 1);
  const legacySpentPoints = nonNegativeInteger(input.legacySpentPoints);
  const availablePoints = nonNegativeInteger(input.availablePoints);
  const totalLegacyPoints = legacySpentPoints + availablePoints;
  const legacyLevelPoints = levelUps * LEGACY_ABILITY_POINTS_PER_LEVEL;
  const nonLevelPoints = Math.max(0, totalLegacyPoints - legacyLevelPoints);

  return (
    nonLevelPoints + levelUps * GAME_RULES.progression.abilityPointsPerLevel
  );
}

/** Returns spent and available points when moving a save to the current rules. */
export function getAbilityPointBudgetAfterMigration(input: {
  previousRulesVersion: number;
  level: number;
  spentPoints: number;
  availablePoints: number;
}) {
  const spentPoints = nonNegativeInteger(input.spentPoints);
  const availablePoints = nonNegativeInteger(input.availablePoints);
  return input.previousRulesVersion >= 1
    ? spentPoints + availablePoints
    : getRebalancedAbilityPointBudget({
        level: input.level,
        legacySpentPoints: spentPoints,
        availablePoints,
      });
}
