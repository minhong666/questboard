export type WeeklyAbilityIncrease = {
  health: number;
  strength: number;
  defense: number;
  intelligence: number;
};

export type WeeklyStats = {
  weekKey: string;
  tasksCompleted: number;
  levelsGained: number;
  coinsEarned: number;
  abilitiesGained: WeeklyAbilityIncrease;
  reportShownWeekKey?: string;
};

export type WeeklyStatsChanges = {
  tasksCompleted?: number;
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
    levelsGained: safeInteger(entry.levelsGained),
    coinsEarned: safeInteger(entry.coinsEarned),
    abilitiesGained: {
      health: safeInteger(abilities.health),
      strength: safeInteger(abilities.strength),
      defense: safeInteger(abilities.defense),
      intelligence: safeInteger(abilities.intelligence),
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
    levelsGained: base.levelsGained + safeInteger(changes.levelsGained),
    coinsEarned: base.coinsEarned + safeInteger(changes.coinsEarned),
    abilitiesGained: {
      health: base.abilitiesGained.health + safeInteger(abilities.health),
      strength: base.abilitiesGained.strength + safeInteger(abilities.strength),
      defense: base.abilitiesGained.defense + safeInteger(abilities.defense),
      intelligence:
        base.abilitiesGained.intelligence + safeInteger(abilities.intelligence),
    },
  } satisfies WeeklyStats;
}

export function isWeeklyReportTime(date: Date) {
  return date.getDay() === 0 && date.getHours() >= 23;
}
