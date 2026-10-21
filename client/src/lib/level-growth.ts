function safeLevelUpCount(levelUps: number): number {
  return Math.max(0, Math.floor(levelUps));
}

export function getWarriorExtraHealth(levelUps: number): number {
  return safeLevelUpCount(levelUps) * 20;
}

export function getWarriorTotalHealthGrowth(levelUps: number): number {
  const count = safeLevelUpCount(levelUps);
  return count * 10 + getWarriorExtraHealth(count);
}
