import { describe, expect, it } from "vitest";
import {
  getDailyMonsterRefreshKey,
  getNextDailyMonsterRefreshAt,
} from "./monster-refresh";

describe("daily monster refresh", () => {
  it("uses the current local calendar date for the daily monster key", () => {
    const date = new Date(2026, 10, 10, 0, 0, 0);
    const expected = `small-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    expect(getDailyMonsterRefreshKey(date)).toBe(expected);
    expect(
      getDailyMonsterRefreshKey(new Date(2026, 10, 10, 23, 59, 59))
    ).toBe(expected);
    expect(
      getDailyMonsterRefreshKey(new Date(2026, 10, 11, 0, 0, 0))
    ).not.toBe(expected);
  });

  it("refreshes at the next local midnight, including exactly at midnight", () => {
    const beforeMidnight = new Date(2026, 10, 10, 23, 59, 59, 500);
    const expectedMidnight = new Date(2026, 10, 11, 0, 0, 0, 0).getTime();
    expect(getNextDailyMonsterRefreshAt(beforeMidnight.getTime())).toBe(
      expectedMidnight
    );

    const exactlyAtMidnight = new Date(2026, 10, 10, 0, 0, 0, 0);
    expect(getNextDailyMonsterRefreshAt(exactlyAtMidnight.getTime())).toBe(
      new Date(2026, 10, 11, 0, 0, 0, 0).getTime()
    );
  });
});
