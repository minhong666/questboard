import { describe, expect, it } from "vitest";
import { TASK_DIFFICULTY_REWARDS } from "./task-rewards";

describe("task difficulty rewards", () => {
  it("provides a single source of truth for task editor preview and saved values", () => {
    expect(TASK_DIFFICULTY_REWARDS).toEqual({
      輕量: { xp: 35, coins: 20 },
      標準: { xp: 55, coins: 30 },
      挑戰: { xp: 85, coins: 45 },
    });
  });
});
