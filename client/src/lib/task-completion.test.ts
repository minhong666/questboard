import { describe, expect, it } from "vitest";
import {
  getTaskCompletionRollback,
  type TaskCompletionReceipt,
} from "./task-completion";

const receipt: TaskCompletionReceipt = {
  taskXp: 100,
  taskCoins: 40,
  chestXp: 60,
  chestCoins: 70,
  chestLootIds: ["loot-1"],
  chestMilestones: [3],
  levelUps: 1,
  abilityGrowth: { health: 8, strength: 2, defense: 1, intelligence: 0 },
  critRateGrowth: 1,
  critDamageGrowth: 2,
  allTasksBonus: true,
  dailyPeriodKey: "daily-1",
  weeklyStatsWeekKey: "week-1",
  weeklyStats: {
    tasksCompleted: 1,
    coinsEarned: 160,
    levelsGained: 1,
    abilitiesGained: { health: 8, strength: 2, defense: 1, intelligence: 0 },
  },
};

const resources = {
  totalXp: 500,
  coins: 200,
  abilityPoints: 12,
  skillUpgradePoints: 2,
  inventoryIds: ["loot-1", "other-loot"],
  equippedItemIds: [],
};

describe("task completion rollback", () => {
  it("reverses all unused rewards from the recorded completion", () => {
    expect(getTaskCompletionRollback(resources, receipt)).toEqual({
      totalXp: 340,
      coins: 40,
      abilityPoints: 2,
      skillUpgradePoints: 1,
      lootIdsToRemove: ["loot-1"],
      totalXpToRemove: 160,
      coinsToRemove: 160,
      abilityPointsToRemove: 10,
      skillUpgradePointsToRemove: 1,
    });
  });

  it.each([
    ["XP", { ...resources, totalXp: 159 }],
    ["金幣", { ...resources, coins: 159 }],
    ["能力點", { ...resources, abilityPoints: 9 }],
    ["技能點", { ...resources, skillUpgradePoints: 0 }],
    ["已不在背包的寶箱物品", { ...resources, inventoryIds: ["other-loot"] }],
    ["已裝備的寶箱物品", { ...resources, equippedItemIds: ["loot-1"] }],
  ])(
    "refuses rollback when completion rewards have already been used (%s)",
    (_, available) => {
      expect(getTaskCompletionRollback(available, receipt)).toBeNull();
    }
  );

  it("does not require chest items when no chest loot was awarded", () => {
    expect(
      getTaskCompletionRollback(
        { ...resources, inventoryIds: [] },
        { ...receipt, chestLootIds: [] }
      )
    ).not.toBeNull();
  });
});
