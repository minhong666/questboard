export function isGoldOnlyCombatDeath(_monsterId: string) {
  return true;
}

export function getCoinsAfterCombatDeath(coins: number) {
  return Math.floor(Math.max(0, coins) / 2);
}

export function applyCombatDeathPenalty<T extends { coins: number }>(
  state: T
): T {
  return {
    ...state,
    coins: getCoinsAfterCombatDeath(state.coins),
  };
}
