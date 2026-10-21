export type PlayerLevelStats = {
  level: number;
  currentXp: number;
  neededXp: number;
  progress: number;
};

const FIRST_LEVEL_XP = 150;
const LEVEL_XP_STEP = 25;

export function getXpForLevel(level: number) {
  const safeLevel = Math.max(0, Math.floor(level));
  return safeLevel * FIRST_LEVEL_XP + (LEVEL_XP_STEP * safeLevel * (safeLevel - 1)) / 2;
}

export function getXpForNextLevel(level: number) {
  return FIRST_LEVEL_XP + Math.max(0, Math.floor(level)) * LEVEL_XP_STEP;
}

export function getPlayerLevelStats(totalXp: number): PlayerLevelStats {
  const safeXp = Math.max(0, Math.floor(totalXp));
  let level = 0;
  while (getXpForLevel(level + 1) <= safeXp) level += 1;
  const levelStart = getXpForLevel(level);
  const neededXp = getXpForNextLevel(level);
  const currentXp = Math.max(0, safeXp - levelStart);
  return {
    level,
    currentXp,
    neededXp,
    progress: Math.min(100, Math.round((currentXp / neededXp) * 100)),
  };
}
