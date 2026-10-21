export type TimerSession = {
  id: string;
  startedAt: number;
  endedAt: number;
  durationSeconds: number;
  xpEarned: number;
  rewardChecks: number;
  abilityPointsEarned: number;
};

export type TimerActivity = {
  id: string;
  name: string;
  totalSeconds: number;
  xpEarned: number;
  rewardChecks: number;
  abilityPointsEarned: number;
  sessions: TimerSession[];
};

export type RunningTimer = {
  activityId: string;
  startedAt: number;
  xpEarned: number;
  rewardChecks: number;
  abilityPointsEarned: number;
};

export type TimerSaveState = {
  activities: TimerActivity[];
  runningTimer: RunningTimer | null;
};

const MIN_VALID_TIMER_TIMESTAMP = Date.UTC(2000, 0, 1);
const MAX_TIMER_RUN_AGE_MS = 365 * 24 * 60 * 60 * 1000;
const MAX_TIMER_SESSION_MS = 365 * 24 * 60 * 60 * 1000;
const MAX_TIMER_RUN_SECONDS = Math.floor(MAX_TIMER_RUN_AGE_MS / 1000);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonnegativeInteger(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Math.floor(value)))
    : 0;
}

function safeSum(values: number[]): number {
  return values.reduce(
    (total, value) => Math.min(Number.MAX_SAFE_INTEGER, total + value),
    0
  );
}

function normalizeTimestamp(value: unknown, now: number): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const timestamp = Math.floor(value);
  if (
    !Number.isSafeInteger(timestamp) ||
    timestamp < MIN_VALID_TIMER_TIMESTAMP ||
    timestamp > now
  ) {
    return null;
  }
  return timestamp;
}

function normalizeSession(
  value: unknown,
  seenSessionIds: Set<string>,
  now: number
): TimerSession | null {
  if (!isRecord(value) || typeof value.id !== "string" || !value.id) return null;
  if (seenSessionIds.has(value.id)) return null;
  const startedAt = normalizeTimestamp(value.startedAt, now);
  const endedAt = normalizeTimestamp(value.endedAt, now);
  if (startedAt === null || endedAt === null || endedAt < startedAt) return null;
  const durationMs = endedAt - startedAt;
  if (durationMs > MAX_TIMER_SESSION_MS) return null;

  seenSessionIds.add(value.id);
  const sessionMinutes = Math.floor(durationMs / 60_000);
  const rewardChecks = Math.min(
    sessionMinutes,
    nonnegativeInteger(value.rewardChecks)
  );
  return {
    id: value.id,
    startedAt,
    endedAt,
    durationSeconds: Math.floor(durationMs / 1000),
    xpEarned: Math.min(
      sessionMinutes,
      nonnegativeInteger(value.xpEarned ?? rewardChecks)
    ),
    rewardChecks,
    abilityPointsEarned: Math.min(
      rewardChecks,
      nonnegativeInteger(value.abilityPointsEarned)
    ),
  };
}

export function normalizeTimerSaveState(
  activitiesValue: unknown,
  runningTimerValue: unknown
): TimerSaveState {
  const now = Date.now();
  const activityInputs = Array.isArray(activitiesValue)
    ? activitiesValue.filter(
        (activity): activity is Record<string, unknown> =>
          isRecord(activity) &&
          typeof activity.id === "string" &&
          activity.id.length > 0 &&
          typeof activity.name === "string" &&
          activity.name.trim().length > 0
      )
    : [];
  const idCounts = new Map<string, number>();
  activityInputs.forEach(activity => {
    const id = activity.id as string;
    idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
  });

  const activities = activityInputs
    .filter(activity => idCounts.get(activity.id as string) === 1)
    .map(activity => {
      const seenSessionIds = new Set<string>();
      const sessions: TimerSession[] = [];
      const hasSessionHistory = Array.isArray(activity.sessions);
      const sessionValues: unknown[] = hasSessionHistory
        ? (activity.sessions as unknown[])
        : [];
      if (hasSessionHistory) {
        for (const sessionValue of sessionValues) {
          const session = normalizeSession(sessionValue, seenSessionIds, now);
          if (session) sessions.push(session);
        }
      } else {
        const legacyTotalSeconds = Math.min(
          MAX_TIMER_SESSION_MS / 1000,
          nonnegativeInteger(activity.totalSeconds)
        );
        if (legacyTotalSeconds > 0) {
          const legacyMinutes = getCompletedTimerMinutes(legacyTotalSeconds);
          const legacyXpEarned = Math.min(
            legacyMinutes,
            nonnegativeInteger(activity.xpEarned ?? activity.rewardChecks)
          );
          const legacyRewardChecks = Math.min(
            legacyMinutes,
            nonnegativeInteger(activity.rewardChecks)
          );
          const legacyEndedAt = now;
          const legacyStartedAt = Math.max(
            MIN_VALID_TIMER_TIMESTAMP,
            legacyEndedAt - legacyTotalSeconds * 1000
          );
          sessions.push({
            id: `legacy-${activity.id as string}`,
            startedAt: legacyStartedAt,
            endedAt: legacyEndedAt,
            durationSeconds: Math.floor(
              (legacyEndedAt - legacyStartedAt) / 1000
            ),
            xpEarned: legacyXpEarned,
            rewardChecks: legacyRewardChecks,
            abilityPointsEarned: Math.min(
              legacyRewardChecks,
              nonnegativeInteger(activity.abilityPointsEarned)
            ),
          });
        }
      }
      const totalSeconds = safeSum(sessions.map(session => session.durationSeconds));
      const maxChecks = getCompletedTimerMinutes(totalSeconds);
      const xpEarned = Math.min(
        maxChecks,
        safeSum(sessions.map(session => session.xpEarned))
      );
      const rewardChecks = Math.min(
        maxChecks,
        safeSum(sessions.map(session => session.rewardChecks))
      );
      const abilityPointsEarned = Math.min(
        rewardChecks,
        safeSum(sessions.map(session => session.abilityPointsEarned))
      );
      return {
        id: activity.id as string,
        name: (activity.name as string).trim().slice(0, 40),
        totalSeconds,
        xpEarned,
        rewardChecks,
        abilityPointsEarned,
        sessions,
      };
    });

  const runningValue = isRecord(runningTimerValue) ? runningTimerValue : null;
  const runningActivity = runningValue
    ? activities.find(activity => activity.id === runningValue.activityId)
    : undefined;
  const runningStartedAt = runningValue
    ? normalizeTimestamp(runningValue.startedAt, now)
    : null;
  let runningTimer: RunningTimer | null = null;
  if (
    runningValue &&
    runningActivity &&
    runningStartedAt !== null &&
    now - runningStartedAt <= MAX_TIMER_RUN_AGE_MS
  ) {
    const elapsedSeconds = Math.min(
      MAX_TIMER_RUN_SECONDS,
      Math.max(0, Math.floor((now - runningStartedAt) / 1000))
    );
    const maxRunChecks = Math.max(
      0,
      getCompletedTimerMinutes(runningActivity.totalSeconds + elapsedSeconds) -
        runningActivity.rewardChecks
    );
    const maxRunXp = Math.max(
      0,
      getCompletedTimerMinutes(runningActivity.totalSeconds + elapsedSeconds) -
        runningActivity.xpEarned
    );
    const rewardChecks = Math.min(
      maxRunChecks,
      nonnegativeInteger(runningValue.rewardChecks)
    );
    const xpEarned = Math.min(
      maxRunXp,
      nonnegativeInteger(runningValue.xpEarned ?? runningValue.rewardChecks)
    );
    runningTimer = {
      activityId: runningActivity.id,
      startedAt: runningStartedAt,
      xpEarned,
      rewardChecks,
      abilityPointsEarned: Math.min(
        rewardChecks,
        nonnegativeInteger(runningValue.abilityPointsEarned)
      ),
    };
  }

  if (runningTimer) {
    return {
      activities: activities.map(activity =>
        activity.id === runningTimer?.activityId
          ? {
              ...activity,
              xpEarned: activity.xpEarned + runningTimer.xpEarned,
              rewardChecks: activity.rewardChecks + runningTimer.rewardChecks,
              abilityPointsEarned:
                activity.abilityPointsEarned + runningTimer.abilityPointsEarned,
            }
          : activity
      ),
      runningTimer,
    };
  }
  return { activities, runningTimer: null };
}

export function getTimerElapsedSeconds(
  accumulatedSeconds: number,
  startedAt: number,
  now: number
): number {
  const safeAccumulated = nonnegativeInteger(accumulatedSeconds);
  const elapsed = Number.isFinite(startedAt) && Number.isFinite(now)
    ? Math.min(
        MAX_TIMER_RUN_SECONDS,
        Math.max(0, Math.floor((now - startedAt) / 1000))
      )
    : 0;
  return nonnegativeInteger(safeAccumulated + elapsed);
}

export function getCompletedTimerMinutes(totalSeconds: number): number {
  return Math.floor(nonnegativeInteger(totalSeconds) / 60);
}

export function rollAbilityPointAwards(
  completedMinutes: number,
  random: () => number = Math.random
): number {
  return rollAbilityPointOutcomes(completedMinutes, random).filter(Boolean).length;
}

export function rollAbilityPointOutcomes(
  completedMinutes: number,
  random: () => number = Math.random
): boolean[] {
  const safeMinutes = nonnegativeInteger(completedMinutes);
  return Array.from({ length: safeMinutes }, () => random() < 0.05);
}

export function formatTimerDuration(totalSeconds: number): string {
  const seconds = nonnegativeInteger(totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainderSeconds = seconds % 60;
  if (hours > 0) return `${hours} 小時 ${minutes} 分 ${remainderSeconds} 秒`;
  if (minutes > 0) return `${minutes} 分 ${remainderSeconds} 秒`;
  return `${remainderSeconds} 秒`;
}
