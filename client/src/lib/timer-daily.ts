import type { TimerActivity, RunningTimer } from "./activity-timers";

function wholeNonnegativeSeconds(startedAt: number, endedAt: number): number {
  if (!Number.isFinite(startedAt) || !Number.isFinite(endedAt)) return 0;
  const elapsedMilliseconds = endedAt - startedAt;
  if (!Number.isFinite(elapsedMilliseconds)) return 0;
  return Math.max(0, Math.floor(elapsedMilliseconds / 1000));
}

function overlapSeconds(
  startedAt: number,
  endedAt: number,
  dayStart: number,
  now: number
): number {
  if (!Number.isFinite(dayStart) || !Number.isFinite(now)) return 0;
  const overlapStart = Math.max(dayStart, startedAt);
  const overlapEnd = Math.min(now, endedAt);
  return wholeNonnegativeSeconds(overlapStart, overlapEnd);
}

/** 回傳 now 所在本地日的 00:00 時刻。 */
export function getTimerDayStart(now: number): number {
  const localDate = new Date(now);
  localDate.setHours(0, 0, 0, 0);
  return localDate.getTime();
}

/** 回傳 running timer 在 now 所在本地日內已經過的完整秒數。 */
export function getTimerTodayRunningSeconds(
  running: RunningTimer | null,
  now: number
): number {
  if (!running) return 0;
  return overlapSeconds(running.startedAt, now, getTimerDayStart(now), now);
}

/**
 * 回傳單一活動在 now 所在本地日的累積秒數，包含已停止 session
 * 與同一活動目前仍在執行中的區段；歷史彙總欄位不參與計算。
 */
export function getTimerTodaySeconds(
  activity: TimerActivity,
  running: RunningTimer | null,
  now: number
): number {
  const dayStart = getTimerDayStart(now);
  const stoppedSeconds = activity.sessions.reduce(
    (total, session) =>
      total + overlapSeconds(session.startedAt, session.endedAt, dayStart, now),
    0
  );
  const runningSeconds =
    running?.activityId === activity.id
      ? getTimerTodayRunningSeconds(running, now)
      : 0;
  return stoppedSeconds + runningSeconds;
}
