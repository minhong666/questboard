export type WeeklyAbilityIncrease = {
  health: number;
  strength: number;
  defense: number;
  intelligence: number;
};

export type WeeklyStats = {
  weekKey: string;
  tasksCompleted: number;
  monstersDefeated: number;
  levelsGained: number;
  coinsEarned: number;
  abilitiesGained: WeeklyAbilityIncrease;
  reportShownWeekKey?: string;
};

export type WeeklyStatsChanges = {
  tasksCompleted?: number;
  monstersDefeated?: number;
  levelsGained?: number;
  coinsEarned?: number;
  abilitiesGained?: Partial<WeeklyAbilityIncrease>;
};

const EMPTY_ABILITIES: WeeklyAbilityIncrease = {
  health: 0,
  strength: 0,
  defense: 0,
  intelligence: 0,
};

function safeInteger(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.floor(value))
    : 0;
}

function safeNonNegativeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, value)
    : 0;
}

export function getWeeklyStatsKey(date: Date) {
  const monday = new Date(date);
  const day = monday.getDay();
  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);
  return `weekly-stats-${monday.getFullYear()}-${monday.getMonth() + 1}-${monday.getDate()}`;
}

export function createWeeklyStats(date: Date) {
  return {
    weekKey: getWeeklyStatsKey(date),
    tasksCompleted: 0,
    monstersDefeated: 0,
    levelsGained: 0,
    coinsEarned: 0,
    abilitiesGained: { ...EMPTY_ABILITIES },
  } satisfies WeeklyStats;
}

export function normalizeWeeklyStats(value: unknown, date: Date) {
  const fallback = createWeeklyStats(date);
  if (!value || typeof value !== "object") return fallback;
  const entry = value as Record<string, unknown>;
  if (entry.weekKey !== fallback.weekKey) return fallback;
  const abilities =
    entry.abilitiesGained && typeof entry.abilitiesGained === "object"
      ? (entry.abilitiesGained as Record<string, unknown>)
      : {};
  return {
    ...fallback,
    tasksCompleted: safeInteger(entry.tasksCompleted),
    monstersDefeated: safeInteger(entry.monstersDefeated),
    levelsGained: safeInteger(entry.levelsGained),
    coinsEarned: safeInteger(entry.coinsEarned),
    abilitiesGained: {
      health: safeNonNegativeNumber(abilities.health),
      strength: safeNonNegativeNumber(abilities.strength),
      defense: safeNonNegativeNumber(abilities.defense),
      intelligence: safeNonNegativeNumber(abilities.intelligence),
    },
    reportShownWeekKey:
      entry.reportShownWeekKey === fallback.weekKey
        ? fallback.weekKey
        : undefined,
  } satisfies WeeklyStats;
}

export function addWeeklyStats(
  current: unknown,
  changes: WeeklyStatsChanges,
  date: Date
) {
  const base = normalizeWeeklyStats(current, date);
  const abilities = changes.abilitiesGained ?? {};
  return {
    ...base,
    tasksCompleted: base.tasksCompleted + safeInteger(changes.tasksCompleted),
    monstersDefeated:
      base.monstersDefeated + safeInteger(changes.monstersDefeated),
    levelsGained: base.levelsGained + safeInteger(changes.levelsGained),
    coinsEarned: base.coinsEarned + safeInteger(changes.coinsEarned),
    abilitiesGained: {
      health:
        base.abilitiesGained.health + safeNonNegativeNumber(abilities.health),
      strength:
        base.abilitiesGained.strength +
        safeNonNegativeNumber(abilities.strength),
      defense:
        base.abilitiesGained.defense + safeNonNegativeNumber(abilities.defense),
      intelligence:
        base.abilitiesGained.intelligence +
        safeNonNegativeNumber(abilities.intelligence),
    },
  } satisfies WeeklyStats;
}

export function subtractWeeklyStats(
  current: unknown,
  changes: WeeklyStatsChanges,
  date: Date
) {
  const base = normalizeWeeklyStats(current, date);
  const abilities = changes.abilitiesGained ?? {};
  return {
    ...base,
    tasksCompleted: Math.max(
      0,
      base.tasksCompleted - safeInteger(changes.tasksCompleted)
    ),
    monstersDefeated: Math.max(
      0,
      base.monstersDefeated - safeInteger(changes.monstersDefeated)
    ),
    levelsGained: Math.max(
      0,
      base.levelsGained - safeInteger(changes.levelsGained)
    ),
    coinsEarned: Math.max(
      0,
      base.coinsEarned - safeInteger(changes.coinsEarned)
    ),
    abilitiesGained: {
      health: Math.max(
        0,
        base.abilitiesGained.health - safeNonNegativeNumber(abilities.health)
      ),
      strength: Math.max(
        0,
        base.abilitiesGained.strength -
          safeNonNegativeNumber(abilities.strength)
      ),
      defense: Math.max(
        0,
        base.abilitiesGained.defense - safeNonNegativeNumber(abilities.defense)
      ),
      intelligence: Math.max(
        0,
        base.abilitiesGained.intelligence -
          safeNonNegativeNumber(abilities.intelligence)
      ),
    },
  } satisfies WeeklyStats;
}

export function isWeeklyReportTime(date: Date) {
  return date.getDay() === 0 && date.getHours() >= 23;
}
