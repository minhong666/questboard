export type TaskAbilityGrowth = {
  health: number;
  strength: number;
  defense: number;
  intelligence: number;
};

export type TaskCompletionReceipt = {
  taskXp: number;
  taskCoins: number;
  chestXp: number;
  chestCoins: number;
  chestLootIds: string[];
  chestMilestones: number[];
  levelUps: number;
  abilityGrowth: TaskAbilityGrowth;
  critRateGrowth: number;
  critDamageGrowth: number;
  allTasksBonus: boolean;
  dailyPeriodKey: string;
  weeklyStatsWeekKey: string;
  weeklyStats: {
    tasksCompleted: number;
    coinsEarned: number;
    levelsGained: number;
    abilitiesGained: TaskAbilityGrowth;
  };
};

export type TaskCompletionRollbackResources = {
  totalXp: number;
  coins: number;
  abilityPoints: number;
  skillUpgradePoints: number;
  inventoryIds: string[];
  equippedItemIds: string[];
};

export type TaskCompletionRollback = {
  totalXp: number;
  coins: number;
  abilityPoints: number;
  skillUpgradePoints: number;
  lootIdsToRemove: string[];
  totalXpToRemove: number;
  coinsToRemove: number;
  abilityPointsToRemove: number;
  skillUpgradePointsToRemove: number;
};

export function getTaskCompletionRollback(
  resources: TaskCompletionRollbackResources,
  receipt: TaskCompletionReceipt
): TaskCompletionRollback | null {
  const totalXpToRemove = receipt.taskXp + receipt.chestXp;
  const coinsToRemove =
    receipt.taskCoins + receipt.chestCoins + (receipt.allTasksBonus ? 50 : 0);
  const abilityPointsToRemove =
    receipt.levelUps * 5 + (receipt.allTasksBonus ? 5 : 0);
  const skillUpgradePointsToRemove = receipt.levelUps;

  if (
    resources.totalXp < totalXpToRemove ||
    resources.coins < coinsToRemove ||
    resources.abilityPoints < abilityPointsToRemove ||
    resources.skillUpgradePoints < skillUpgradePointsToRemove ||
    receipt.chestLootIds.some(
      id =>
        !resources.inventoryIds.includes(id) ||
        resources.equippedItemIds.includes(id)
    )
  ) {
    return null;
  }

  return {
    totalXp: resources.totalXp - totalXpToRemove,
    coins: resources.coins - coinsToRemove,
    abilityPoints: resources.abilityPoints - abilityPointsToRemove,
    skillUpgradePoints:
      resources.skillUpgradePoints - skillUpgradePointsToRemove,
    lootIdsToRemove: receipt.chestLootIds,
    totalXpToRemove,
    coinsToRemove,
    abilityPointsToRemove,
    skillUpgradePointsToRemove,
  };
}
