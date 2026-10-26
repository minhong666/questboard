import { describe, expect, it } from "vitest";
import { getDailyMonsterId, normalizeDailyMonsterId } from "./daily-monster-ids";

describe("daily monster ids", () => {
  it("does not change when the player's level changes", () => {
    expect(getDailyMonsterId("small-2026-10-26", 17)).toBe(
      "daily-small-2026-10-26-17"
    );
    expect(getDailyMonsterId("small-2026-10-26", 17)).toBe(
      getDailyMonsterId("small-2026-10-26", 17)
    );
  });

  it("normalizes legacy level-dependent defeated ids", () => {
    expect(
      normalizeDailyMonsterId("daily-small-2026-10-26-17-42")
    ).toBe("daily-small-2026-10-26-17");
    expect(
      normalizeDailyMonsterId("daily-small-2026-10-26-17")
    ).toBe("daily-small-2026-10-26-17");
  });

  it("leaves unrelated ids unchanged", () => {
    expect(normalizeDailyMonsterId("boss-ancient-dragon-week-1")).toBe(
      "boss-ancient-dragon-week-1"
    );
  });
});
