import { GAME_RULES } from "./game-rules";

export type PlayerLevelStats = {
  level: number;
  currentXp: number;
  neededXp: number;
  progress: number;
};

/** Game-balance invariant: every level requires exactly 250 XP. */
export const XP_PER_LEVEL = GAME_RULES.progression.xpPerLevel;

export function getXpForLevel(level: number) {
  const safeLevel = Math.max(0, Math.floor(level));
  return safeLevel * XP_PER_LEVEL;
}

export function getXpForNextLevel(_level: number) {
  return XP_PER_LEVEL;
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
