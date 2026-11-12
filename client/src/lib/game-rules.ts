/**
 * Centralized gameplay balance rules.
 * Keep UI copy, calculations, and regression tests pointed at the same values.
 */
export const GAME_RULES = {
  progression: {
    xpPerLevel: 250,
  },
  intelligence: {
    xpBonusPerPointPercent: 0.5,
    maxXpBonusPercent: 50,
  },
  health: {
    recoveryIntervalMinutes: 1,
    recoveryPercent: 0.015,
  },
  monsters: {
    dailySmallMonsterCount: 6,
  },
  combat: {
    cooldownMinutes: 30,
    deathGoldLossPercent: 50,
  },
  loot: {
    smallMonsterDropChancePercent: 70,
    smallMonsterEquipmentChancePercent: 40,
    smallMonsterTreasureChancePercent: 30,
  },
  activityTimer: {
    pomodoroRoundXp: 25,
    abilityPointChancePercent: 5,
  },
} as const;
