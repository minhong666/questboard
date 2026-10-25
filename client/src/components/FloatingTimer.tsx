import {
  ArrowUpRight,
  Clock3,
  Maximize2,
  Minimize2,
  Square,
} from "lucide-react";
import {
  formatTimerDuration,
  type RunningTimer,
  type TimerActivity,
} from "../lib/activity-timers";
import { getTimerTodaySeconds } from "../lib/timer-daily";

type FloatingTimerProps = {
  activity: TimerActivity;
  runningTimer: RunningTimer;
  currentTime: number;
  expanded: boolean;
  onToggleExpanded: () => void;
  onOpenTimerPage: () => void;
  onStop: () => void;
};

function getPhaseLabel(phase: NonNullable<RunningTimer["pomodoro"]>["phase"]) {
  return phase === "focus" ? "專注" : phase === "shortBreak" ? "短休息" : "長休息";
}

export function FloatingTimer({
  activity,
  runningTimer,
  currentTime,
  expanded,
  onToggleExpanded,
  onOpenTimerPage,
  onStop,
}: FloatingTimerProps) {
  const pomodoro = runningTimer.pomodoro;
  const elapsedSeconds = getTimerTodaySeconds(activity, runningTimer, currentTime);
  const phaseLabel = pomodoro ? getPhaseLabel(pomodoro.phase) : "計時中";
  const isBreak = pomodoro ? pomodoro.phase !== "focus" : false;

  return (
    <aside
      className={`floating-timer ${expanded ? "is-expanded" : ""} ${isBreak ? "is-break" : ""}`}
      aria-label="浮動計時器"
    >
      <div className="floating-timer-bar">
        <button
          type="button"
          className="floating-timer-summary"
          onClick={onToggleExpanded}
          aria-expanded={expanded}
        >
          <span className="floating-timer-status-dot" />
          <span className="floating-timer-phase">{phaseLabel}</span>
          <strong>{formatTimerDuration(elapsedSeconds)}</strong>
        </button>
        <button
          type="button"
          className="floating-timer-expand-button"
          onClick={onToggleExpanded}
          aria-label={expanded ? "收合浮動計時器" : "展開浮動計時器"}
        >
          {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      {expanded && (
        <div className="floating-timer-details">
          <div className="floating-timer-heading">
            <span className="floating-timer-icon"><Clock3 size={15} /></span>
            <div>
              <strong>{activity.name}</strong>
              <small>
                {pomodoro
                  ? `${phaseLabel} · 第 ${pomodoro.completedRounds + (pomodoro.phase === "focus" ? 1 : 0)} 輪`
                  : "一般事務計時"}
              </small>
            </div>
          </div>
          <div className="floating-timer-detail-clock">
            <span>今天已計時</span>
            <strong>{formatTimerDuration(elapsedSeconds)}</strong>
          </div>
          <div className="floating-timer-actions">
            <button type="button" className="floating-timer-open" onClick={onOpenTimerPage}>
              查看計時器 <ArrowUpRight size={13} />
            </button>
            <button type="button" className="floating-timer-stop" onClick={onStop}>
              <Square size={12} /> 停止
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
