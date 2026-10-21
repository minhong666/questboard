import { describe, expect, it } from "vitest";
import type { RunningTimer, TimerActivity } from "./activity-timers";
import {
  getTimerDayStart,
  getTimerTodayRunningSeconds,
  getTimerTodaySeconds,
} from "./timer-daily";

function makeActivity(
  id: string,
  sessions: TimerActivity["sessions"] = [],
  overrides: Partial<TimerActivity> = {}
): TimerActivity {
  return {
    id,
    name: id,
    totalSeconds: 0,
    xpEarned: 0,
    rewardChecks: 0,
    abilityPointsEarned: 0,
    sessions,
    ...overrides,
  };
}

function localDayShift(dayStart: number, days: number): number {
  const date = new Date(dayStart);
  date.setDate(date.getDate() + days);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

describe("daily timer helpers", () => {
  it("counts today's sessions but excludes the previous day's record", () => {
    const now = new Date(2024, 6, 15, 3, 0, 0, 0).getTime();
    const dayStart = getTimerDayStart(now);
    const previousDayStart = localDayShift(dayStart, -1);
    const activity = makeActivity("read", [
      {
        id: "today",
        startedAt: dayStart + 1_000,
        endedAt: dayStart + 61_999,
        durationSeconds: 99_999,
        xpEarned: 0,
        rewardChecks: 5,
        abilityPointsEarned: 2,
      },
      {
        id: "yesterday",
        startedAt: previousDayStart + 6 * 60 * 60 * 1000,
        endedAt: previousDayStart + 7 * 60 * 60 * 1000,
        durationSeconds: 3_600,
        xpEarned: 0,
        rewardChecks: 9,
        abilityPointsEarned: 9,
      },
    ]);

    expect(getTimerDayStart(now)).toBe(dayStart);
    expect(getTimerTodaySeconds(activity, null, now)).toBe(60);
  });

  it("counts the current-day portion of a stopped session crossing midnight", () => {
    const now = new Date(2024, 6, 15, 1, 0, 0, 0).getTime();
    const dayStart = getTimerDayStart(now);
    const previousDayStart = localDayShift(dayStart, -1);
    const activity = makeActivity("cross-midnight", [
      {
        id: "crossed",
        startedAt: previousDayStart + 23 * 60 * 60 * 1000 + 30_000,
        endedAt: dayStart + 30_999,
        durationSeconds: 3_600,
        xpEarned: 0,
        rewardChecks: 1,
        abilityPointsEarned: 1,
      },
    ]);

    expect(getTimerTodaySeconds(activity, null, now)).toBe(30);
  });

  it("returns zero exactly at local midnight and continues after midnight", () => {
    const midday = new Date(2024, 6, 15, 12, 0, 0, 0).getTime();
    const dayStart = getTimerDayStart(midday);
    const previousDayStart = localDayShift(dayStart, -1);
    const activity = makeActivity("midnight", [
      {
        id: "crossed",
        startedAt: previousDayStart + 23 * 60 * 60 * 1000,
        endedAt: dayStart + 20_999,
        durationSeconds: 3_600,
        xpEarned: 0,
        rewardChecks: 0,
        abilityPointsEarned: 0,
      },
    ]);
    const running: RunningTimer = {
      activityId: activity.id,
      startedAt: previousDayStart + 23 * 60 * 60 * 1000,
      xpEarned: 0,
      rewardChecks: 0,
      abilityPointsEarned: 0,
    };

    expect(getTimerTodaySeconds(activity, running, dayStart)).toBe(0);
    expect(getTimerTodayRunningSeconds(running, dayStart)).toBe(0);
    expect(
      getTimerTodaySeconds(activity, running, dayStart + 21_000)
    ).toBe(41);
    expect(getTimerTodayRunningSeconds(running, dayStart + 21_000)).toBe(21);
  });

  it("continues today's total after a pause and a new running segment", () => {
    const dayStart = getTimerDayStart(
      new Date(2024, 6, 15, 2, 0, 0, 999).getTime()
    );
    const now = dayStart + 250_999;
    const activity = makeActivity("resume", [
      {
        id: "paused",
        startedAt: dayStart + 10_000,
        endedAt: dayStart + 110_999,
        durationSeconds: 100,
        xpEarned: 0,
        rewardChecks: 1,
        abilityPointsEarned: 1,
      },
    ]);
    const running: RunningTimer = {
      activityId: activity.id,
      startedAt: dayStart + 200_000,
      xpEarned: 0,
      rewardChecks: 2,
      abilityPointsEarned: 1,
    };

    expect(getTimerTodayRunningSeconds(running, now)).toBe(50);
    expect(getTimerTodaySeconds(activity, running, now)).toBe(150);
  });

  it("keeps only the current local day after multiple days closed and reopened", () => {
    const now = new Date(2024, 6, 15, 2, 0, 0, 0).getTime();
    const dayStart = getTimerDayStart(now);
    const yesterdayStart = localDayShift(dayStart, -1);
    const twoDaysAgoStart = localDayShift(dayStart, -2);
    const activity = makeActivity("reopened", [
      {
        id: "old",
        startedAt: twoDaysAgoStart + 12 * 60 * 60 * 1000,
        endedAt: twoDaysAgoStart + 13 * 60 * 60 * 1000,
        durationSeconds: 3_600,
        xpEarned: 0,
        rewardChecks: 60,
        abilityPointsEarned: 4,
      },
      {
        id: "overnight",
        startedAt: yesterdayStart + 23 * 60 * 60 * 1000,
        endedAt: dayStart + 20 * 60 * 1000,
        durationSeconds: 3_600,
        xpEarned: 0,
        rewardChecks: 60,
        abilityPointsEarned: 3,
      },
      {
        id: "today",
        startedAt: dayStart + 40 * 60 * 1000,
        endedAt: dayStart + 70 * 60 * 1000,
        durationSeconds: 1_800,
        xpEarned: 0,
        rewardChecks: 30,
        abilityPointsEarned: 2,
      },
    ], { totalSeconds: 99_999, rewardChecks: 90, abilityPointsEarned: 9 });

    expect(getTimerTodaySeconds(activity, null, now)).toBe(3_000);
  });

  it("uses timestamps rather than aggregates and does not mutate history or rewards", () => {
    const now = new Date(2024, 6, 15, 1, 0, 0, 0).getTime();
    const dayStart = getTimerDayStart(now);
    const activity = makeActivity("immutable", [
      {
        id: "history",
        startedAt: dayStart + 10_000,
        endedAt: dayStart + 14_999,
        durationSeconds: 9_999,
        xpEarned: 0,
        rewardChecks: 12,
        abilityPointsEarned: 8,
      },
    ], { totalSeconds: 123_456, rewardChecks: 77, abilityPointsEarned: 33 });
    const running: RunningTimer = {
      activityId: activity.id,
      startedAt: dayStart + 20_000,
      xpEarned: 0,
      rewardChecks: 4,
      abilityPointsEarned: 3,
    };
    const activityBefore = structuredClone(activity);
    const runningBefore = structuredClone(running);

    expect(getTimerTodaySeconds(activity, running, dayStart + 30_000)).toBe(14);
    expect(activity).toEqual(activityBefore);
    expect(running).toEqual(runningBefore);
    expect(activity.totalSeconds).toBe(123_456);
    expect(activity.abilityPointsEarned).toBe(33);
    expect(activity.sessions[0].abilityPointsEarned).toBe(8);
  });

  it("does not mix a running timer into a different activity", () => {
    const now = new Date(2024, 6, 15, 1, 0, 0, 0).getTime();
    const dayStart = getTimerDayStart(now);
    const running: RunningTimer = {
      activityId: "first",
      startedAt: dayStart + 20_000,
      xpEarned: 0,
      rewardChecks: 0,
      abilityPointsEarned: 0,
    };
    const first = makeActivity("first");
    const second = makeActivity("second", [{
      id: "old",
      startedAt: localDayShift(dayStart, -1),
      endedAt: localDayShift(dayStart, -1) + 10_000,
      durationSeconds: 10,
      xpEarned: 0,
      rewardChecks: 0,
      abilityPointsEarned: 0,
    }]);

    expect(getTimerTodaySeconds(first, running, dayStart + 30_000)).toBe(10);
    expect(getTimerTodaySeconds(second, running, dayStart + 30_000)).toBe(0);
  });

  it("uses local calendar midnights across a DST transition", () => {
    const previousTimeZone = process.env.TZ;
    process.env.TZ = "America/New_York";
    try {
      const springDayStart = new Date(2024, 2, 10, 0, 0, 0, 0).getTime();
      const springLate = new Date(2024, 2, 10, 23, 59, 59, 999).getTime();
      const nextDayStart = new Date(2024, 2, 11, 0, 0, 0, 0).getTime();
      const activity = makeActivity("dst", [{
        id: "spring-day",
        startedAt: springDayStart,
        endedAt: springLate,
        durationSeconds: 86_399,
        xpEarned: 0,
        rewardChecks: 0,
        abilityPointsEarned: 0,
      }]);

      expect(getTimerDayStart(springLate)).toBe(springDayStart);
      expect(nextDayStart - springDayStart).toBe(23 * 60 * 60 * 1000);
      expect(getTimerTodaySeconds(activity, null, springLate)).toBe(82_799);
    } finally {
      if (previousTimeZone === undefined) delete process.env.TZ;
      else process.env.TZ = previousTimeZone;
    }
  });
});
