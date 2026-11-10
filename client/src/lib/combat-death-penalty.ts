export function isGoldOnlyCombatDeath(monsterId: string) {
  return monsterId.startsWith("boss-") || monsterId.startsWith("soul-trial-");
}

export function getCoinsAfterCombatDeath(coins: number) {
  return Math.floor(Math.max(0, coins) / 2);
}
