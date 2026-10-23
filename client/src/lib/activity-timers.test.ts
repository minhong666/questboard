import { describe, expect, it, vi } from "vitest";
import {
  formatTimerDuration,
  getCompletedTimerMinutes,
  getTimerElapsedSeconds,
  normalizeTimerSaveState,
  rollAbilityPointAwards,
} from "./activity-timers";

const sessionStart = Date.UTC(2023, 0, 1);

describe("activity timer helpers", () => {
  it("counts elapsed time from timestamps and preserves accumulated seconds", () => {
    expect(getTimerElapsedSeconds(59, 1_000, 2_000)).toBe(60);
    expect(getTimerElapsedSeconds(59, 2_000, 1_000)).toBe(59);
    expect(
      getCompletedTimerMinutes(getTimerElapsedSeconds(59, 1_000, 2_000))
    ).toBe(1);
  });

  it("counts only full minutes and carries the remaining seconds", () => {
    expect(getCompletedTimerMinutes(59)).toBe(0);
    expect(getCompletedTimerMinutes(60)).toBe(1);
    expect(getCompletedTimerMinutes(125)).toBe(2);
    expect(125 % 60).toBe(5);
  });

  it("awards exactly one XP for each completed timer minute", () => {
    expect(getCompletedTimerMinutes(60)).toBe(1);
    expect(getCompletedTimerMinutes(120)).toBe(2);
    expect(getCompletedTimerMinutes(179)).toBe(2);
  });

  it("keeps fixed XP separate from the independent 5% ability-point roll", () => {
    expect(getCompletedTimerMinutes(180)).toBe(3);
    const values = [0.049, 0.05, 0.9, 0.01];
    let index = 0;
    expect(rollAbilityPointAwards(4, () => values[index++])).toBe(2);
    expect(index).toBe(4);
    expect(rollAbilityPointAwards(0, () => 0)).toBe(0);
  });

  it("normalizes missing legacy timer data and drops an orphan running timer", () => {
    expect(normalizeTimerSaveState(undefined, undefined)).toEqual({
      activities: [],
      runningTimer: null,
    });
    expect(
      normalizeTimerSaveState([], {
        activityId: "missing",
        startedAt: sessionStart,
        rewardChecks: 1,
      }).runningTimer
    ).toBeNull();
  });

  it("sanitizes timer activity, sessions, and active timer state", () => {
    const runningStartedAt = Date.now() - 10_000;
    const normalized = normalizeTimerSaveState(
      [
        {
          id: "read",
          name: "  閱讀  ",
          totalSeconds: 9_999,
          rewardChecks: 99,
          abilityPointsEarned: 99,
          sessions: [
          {
            id: "s1",
            startedAt: sessionStart,
            endedAt: sessionStart + 125_800,
            durationSeconds: 9_999,
            xpEarned: 99,
            rewardChecks: 2,
              abilityPointsEarned: 1,
            },
          ],
        },
      ],
      {
        activityId: "read",
        startedAt: runningStartedAt,
        rewardChecks: 0,
        abilityPointsEarned: 0,
      }
    );

    expect(normalized.activities[0]).toMatchObject({
      id: "read",
      name: "閱讀",
      totalSeconds: 125,
      xpEarned: 2,
      rewardChecks: 2,
      abilityPointsEarned: 1,
      sessions: [
        {
          durationSeconds: 125,
          rewardChecks: 2,
          abilityPointsEarned: 1,
        },
      ],
    });
    expect(normalized.runningTimer).toEqual({
      activityId: "read",
      startedAt: runningStartedAt,
      xpEarned: 0,
      rewardChecks: 0,
      abilityPointsEarned: 0,
    });
  });

  it("restores active timer XP without duplicating the saved completed minutes", () => {
    const now = Date.UTC(2026, 9, 20, 12, 0, 0);
    const clock = vi.spyOn(Date, "now").mockReturnValue(now);
    try {
      const normalized = normalizeTimerSaveState(
        [
          {
            id: "read",
            name: "閱讀",
            sessions: [
              {
                id: "saved",
                startedAt: now - 60_000,
                endedAt: now,
                xpEarned: 1,
                rewardChecks: 1,
                abilityPointsEarned: 0,
              },
            ],
          },
        ],
        {
          activityId: "read",
          startedAt: now - 125_000,
          xpEarned: 2,
          rewardChecks: 2,
          abilityPointsEarned: 0,
        }
      );

      expect(normalized.activities[0].xpEarned).toBe(3);
      expect(normalized.runningTimer?.xpEarned).toBe(2);
      expect(
        normalizeTimerSaveState(
          normalized.activities,
          normalized.runningTimer
        ).activities[0].xpEarned
      ).toBe(3);
    } finally {
      clock.mockRestore();
    }
  });

  it("migrates legacy aggregate-only activities into one preserved history session", () => {
    const now = Date.UTC(2026, 9, 20, 12, 0, 0);
    const clock = vi.spyOn(Date, "now").mockReturnValue(now);
    try {
      const normalized = normalizeTimerSaveState(
        [
          {
            id: "legacy",
            name: "舊事務",
            totalSeconds: 125,
            xpEarned: 2,
            rewardChecks: 2,
            abilityPointsEarned: 1,
          },
        ],
        null
      );

      expect(normalized.activities[0]).toMatchObject({
        totalSeconds: 125,
        xpEarned: 2,
        rewardChecks: 2,
        abilityPointsEarned: 1,
        sessions: [
          {
            id: "legacy-legacy",
            durationSeconds: 125,
            xpEarned: 2,
          },
        ],
      });
    } finally {
      clock.mockRestore();
    }
  });

  it("rejects negative, epoch, future, and excessively old active timestamps", () => {
    const activity = [{ id: "read", name: "閱讀", sessions: [] }];
    const now = Date.UTC(2026, 9, 20);
    const clock = vi.spyOn(Date, "now").mockReturnValue(now);
    try {
      for (const startedAt of [
        -1,
        0,
        Date.UTC(1999, 11, 31),
        now + 1,
        now - 366 * 24 * 60 * 60 * 1000,
      ]) {
        expect(
          normalizeTimerSaveState(activity, {
            activityId: "read",
            startedAt,
            rewardChecks: 0,
            abilityPointsEarned: 0,
          }).runningTimer
        ).toBeNull();
      }
    } finally {
      clock.mockRestore();
    }
  });

  it("drops duplicate activity/session IDs and rebuilds aggregates from valid sessions", () => {
    const normalized = normalizeTimerSaveState(
      [
        {
          id: "read",
          name: "閱讀",
          totalSeconds: 999,
          sessions: [
            {
              id: "same",
              startedAt: sessionStart,
              endedAt: sessionStart + 60_000,
              durationSeconds: 999,
              rewardChecks: 5,
              abilityPointsEarned: 5,
            },
            {
              id: "same",
              startedAt: sessionStart,
              endedAt: sessionStart + 60_000,
              rewardChecks: 1,
              abilityPointsEarned: 1,
            },
            {
              id: "reversed",
              startedAt: sessionStart + 60_000,
              endedAt: sessionStart,
              rewardChecks: 1,
              abilityPointsEarned: 1,
            },
          ],
        },
        { id: "read", name: "重複事務", sessions: [] },
      ],
      null
    );

    expect(normalized.activities).toHaveLength(0);
  });

  it("drops duplicate session IDs and invalid sessions while rebuilding totals", () => {
    const normalized = normalizeTimerSaveState(
      [
        {
          id: "read",
          name: "閱讀",
          totalSeconds: 999,
          sessions: [
            {
              id: "same",
              startedAt: sessionStart,
              endedAt: sessionStart + 60_000,
              durationSeconds: 999,
              xpEarned: 5,
              rewardChecks: 5,
              abilityPointsEarned: 5,
            },
            {
              id: "same",
              startedAt: sessionStart,
              endedAt: sessionStart + 60_000,
              rewardChecks: 1,
              abilityPointsEarned: 1,
            },
            {
              id: "reversed",
              startedAt: sessionStart + 60_000,
              endedAt: sessionStart,
              xpEarned: 1,
              rewardChecks: 1,
              abilityPointsEarned: 1,
            },
          ],
        },
      ],
      null
    );

    expect(normalized.activities[0]).toMatchObject({
      totalSeconds: 60,
      xpEarned: 1,
      rewardChecks: 1,
      abilityPointsEarned: 1,
      sessions: [{ id: "same", durationSeconds: 60 }],
    });
  });

  it("formats durations for timer cards", () => {
    expect(formatTimerDuration(0)).toBe("0 秒");
    expect(formatTimerDuration(65)).toBe("1 分 5 秒");
    expect(formatTimerDuration(3_725)).toBe("1 小時 2 分 5 秒");
  });
});
