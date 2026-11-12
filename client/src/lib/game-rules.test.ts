import { describe, expect, it } from "vitest";
import { GAME_RULES } from "./game-rules";

describe("centralized game rules", () => {
  it("keeps the current progression and recovery rules", () => {
    expect(GAME_RULES.progression.xpPerLevel).toBe(250);
    expect(GAME_RULES.intelligence.xpBonusPerPointPercent).toBe(0.5);
    expect(GAME_RULES.intelligence.maxXpBonusPercent).toBe(50);
    expect(GAME_RULES.health.recoveryPercent).toBe(0.015);
  });

  it("keeps daily monster, cooldown, and loot rules", () => {
    expect(GAME_RULES.monsters.dailySmallMonsterCount).toBe(6);
    expect(GAME_RULES.combat.cooldownMinutes).toBe(30);
    expect(GAME_RULES.loot.smallMonsterDropChancePercent).toBe(70);
  });
});
