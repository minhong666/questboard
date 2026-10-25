import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Award,
  Bell,
  BookOpen,
  Brain,
  CalendarDays,
  Check,
  CheckCircle2,
  CheckSquare2,
  ChevronRight,
  Clock3,
  Coins,
  Droplets,
  Dumbbell,
  Flame,
  Filter,
  Gift,
  HeartPulse,
  Inbox,
  LayoutGrid,
  LockKeyhole,
  Leaf,
  Mail,
  Menu,
  Moon,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Skull,
  ScrollText,
  Settings2,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Star,
  Sword,
  Target,
  Trash2,
  Trophy,
  X,
  Zap,
} from "lucide-react";

import {
  canEquipEquipment,
  EQUIPMENT_SLOTS,
  getEquipmentRequiredJobClassName,
  getEquipmentAffixBonuses,
  getEquipmentSetBonuses,
  getLootProbabilitySummary,
  LOOT_RARITY_CLASS,
  LOOT_RARITIES,
  RPG_EQUIPMENT_BENCHMARKS,
  nextLootRarity,
  normalizeEquippedItemIds,
  parseLootInventory,
  prepareEquipmentFusion,
  removeTreasureFromInventory,
  rollLoot,
  rollQuestChestLoot,
  toggleEquippedItemIds,
  type EquipmentItem,
  type LootItem,
  type LootRarity,
  type TreasureItem,
} from "../lib/loot";
import { clampCurrentHealth } from "../lib/health";
import { RPG_EQUIPMENT_TEMPLATES } from "../lib/equipment-database";
import {
  applyArcherAttackBonus,
  getArcherEffectiveDodgeRate,
  getArcherTalentBonuses,
  getNextArcherDodgeFailStacks,
  normalizeArcherDodgeFailStacks,
} from "../lib/archer-talent";
import {
  formatTimerDuration,
  getCompletedTimerMinutes,
  getTimerElapsedSeconds,
  normalizeTimerSaveState,
  rollAbilityPointOutcomes,
  type PomodoroPhase,
  type PomodoroRuntime,
  type RunningTimer,
  type TimerActivity,
  type TimerSession,
} from "../lib/activity-timers";
import { getTimerDayStart, getTimerTodaySeconds } from "../lib/timer-daily";
import {
  acquireActivityTimerLock,
  type ActivityTimerLockLease,
} from "../lib/activity-timer-lock";
import { getWarriorTotalHealthGrowth } from "../lib/level-growth";
import { getPlayerLevelStats, getXpForLevel } from "../lib/leveling";
import { FloatingTimer } from "../components/FloatingTimer";
import {
  calculateSpecialSkillDamage,
  getAllSpecialSkills,
  getNextSkillUnlockThreshold,
  getUnlockedSpecialSkills,
  type SkillStatusEffect,
  type SkillStatusKind,
} from "../lib/class-skills";
import {
  applySkillUpgrade,
  getSkillUpgradePointsForLevelUps,
  MAX_SKILL_UPGRADE_LEVEL,
  normalizeSkillUpgradeLevels,
  type SkillUpgradeLevels,
} from "../lib/skill-upgrades";
import {
  ACHIEVEMENTS,
  getAchievementProgress,
  type AchievementContext,
} from "../lib/achievements";
import {
  applySpecializationToSkill,
  getDefaultSpecialization,
  getAllSpecializationSkills,
  getNextSpecializationSkillLevel,
  getUnlockedSpecializationSkills,
  getSpecialization,
  getSpecializations,
  isSpecializationSelected,
  normalizeSpecialization,
  type SpecializationId,
} from "../lib/class-specializations";
import {
  findFailedAbilityRequirement,
  getAbilityValuesForRequirementCheck,
} from "../lib/soul-trial";
import {
  DAILY_MONSTER_CATALOG,
  getMonsterMechanicLabels,
  selectDailyMonsterDefinitions,
} from "../lib/monster-database";
import type { MonsterMechanicDefinition } from "../lib/monster-database";
import {
  addWeeklyStats,
  createWeeklyStats,
  isWeeklyReportTime,
  normalizeWeeklyStats,
  type WeeklyStats,
} from "../lib/weekly-stats";

type Category = "工作" | "學習" | "健康" | "生活" | "心情";
type TaskDifficulty = "輕量" | "標準" | "挑戰";
type TaskCategoryFilter = Category | "all";
type TaskDifficultyFilter = TaskDifficulty | "all";
type TaskRepeat = "none" | "daily" | "weekly";
type BoardSize = 3 | 4 | 5;
type AbilityKey = "health" | "strength" | "defense" | "intelligence";
type CharacterAbilities = Record<AbilityKey, number>;
type CombatStats = {
  critRate: number;
  critDamage: number;
  dodgeRate: number;
  castSpeedPercent?: number;
  damageReductionPercent?: number;
  magicPenetrationPercent?: number;
};
type CombatStatKey = keyof CombatStats;
type JobClass = "warrior" | "archer" | "mage" | "rogue";
type MonsterRequirements = Partial<Record<AbilityKey, number>>;
type Monster = {
  id: string;
  name: string;
  description: string;
  level: number;
  health: number;
  reward: number;
  damage: number;
  defense: number;
  intelligence?: number;
  critRate: number;
  critDamage: number;
  dodgeRate: number;
  risk: string;
  requirements: MonsterRequirements;
  icon: LucideIcon;
  tone: string;
  region?: string;
  physicalResistancePercent?: number;
  magicResistancePercent?: number;
  dodgeIgnorePercent?: number;
  lifestealPercent?: number;
  explosionDamage?: number;
  reflectDamage?: number;
  isBoss?: boolean;
  levelGate?: "player" | "soul";
};
type BattleState = {
  monsterId: string;
  monsterSnapshot: Monster;
  playerHealth: number;
  monsterHealth: number;
  turn: number;
  logs: string[];
  damageDealt: number;
  damageTaken: number;
  criticalHits: number;
  dodges: number;
  usedSkillIds: string[];
  skillCooldowns: Record<string, number>;
  actionLockTurns?: number;
  monsterStatuses: BattleStatus[];
  activeBuff: {
    skillId: string;
    turnsRemaining: number;
    damageBonusPercent: number;
    damageReductionPercent: number;
    healPercentMaxHealth: number;
    dodgeRateBonusPercent: number;
  } | null;
  xpReward: number;
  lootDrop: LootItem | null;
  outcome: "fighting" | "victory" | "defeat";
};

type BattleStatus = {
  kind: SkillStatusKind;
  element: SkillStatusEffect["element"];
  turnsRemaining: number;
  damagePerTurn: number;
  breakDamageThreshold?: number;
  breakDamage?: number;
};
type BattleFx = {
  id: number;
  action: "attack" | "skill" | "idle";
  monsterDamage: number;
  playerDamage: number;
  healing: number;
  critical: boolean;
  monsterDodged: boolean;
  playerDodged: boolean;
  monsterDefeated: boolean;
  playerDefeated: boolean;
};
function applyBattleStatusEffects(
  current: BattleStatus[],
  effects: (SkillStatusEffect | undefined)[],
  sourceDamage = 0
) {
  const next = [...current];
  for (const effect of effects) {
    if (!effect || Math.random() > effect.chance) continue;
    const damagePerTurn = effect.damagePercentOfSkill
      ? Math.max(1, Math.round(sourceDamage * effect.damagePercentOfSkill / 100))
      : effect.damagePerTurn;
    const existing = next.find(status => status.kind === effect.kind);
    if (existing) {
      existing.turnsRemaining = Math.max(existing.turnsRemaining, effect.durationTurns);
      existing.damagePerTurn = Math.max(existing.damagePerTurn, damagePerTurn);
    } else {
      next.push({
        kind: effect.kind,
        element: effect.element,
        turnsRemaining: effect.durationTurns,
        damagePerTurn,
        breakDamageThreshold: effect.breakDamageThreshold,
        breakDamage: effect.breakDamage,
      });
    }
  }
  return next;
}

function tickBattleStatuses(statuses: BattleStatus[]) {
  let damage = 0;
  let frozen = false;
  let controlLabel: "冰凍" | "石化" | null = null;
  const labels: string[] = [];
  const nextStatuses = statuses
    .map(status => {
      if (status.kind === "冰凍" || status.kind === "石化") {
        frozen = true;
        controlLabel = status.kind;
      }
      if (status.damagePerTurn > 0) {
        damage += status.damagePerTurn;
        labels.push(`${status.element}·${status.kind}造成 ${status.damagePerTurn} 傷害`);
      } else {
        labels.push(`${status.element}·${status.kind}持續中`);
      }
      return { ...status, turnsRemaining: status.turnsRemaining - 1 };
    })
    .filter(status => status.turnsRemaining > 0);
  return { damage, frozen, controlLabel, labels, statuses: nextStatuses };
}

type Task = {
  id: string;
  slot: number;
  title: string;
  category: Category;
  icon: string;
  difficulty: TaskDifficulty;
  xp: number;
  coins: number;
  completed: boolean;
  awardedXp?: number;
  repeat?: TaskRepeat;
  completedPeriodKey?: string;
};

type Reward = {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
  custom?: boolean;
};

type RewardRedemption = {
  id: string;
  rewardId: string;
  title: string;
  cost: number;
  redeemedAt: number;
};

type AppState = {
  tasks: Task[];
  rewards: Reward[];
  rewardRedemptions: RewardRedemption[];
  weeklyStats: WeeklyStats;
  timerActivities: TimerActivity[];
  runningTimer: RunningTimer | null;
  totalXp: number;
  coins: number;
  streak: number;
  abilities: CharacterAbilities;
  abilityPoints: number;
  abilityLevel: number;
  abilityAutoGrowthApplied: boolean;
  defeatedMonsterIds: string[];
  currentHealth: number;
  nextHealthRecoveryAt: number;
  combatCooldownUntil: number;
  soulTrialCooldownUntil: number;
  combatStats: CombatStats;
  archerDodgeFailStacks: number;
  allTasksBonusClaimed: boolean;
  dailyQuestChestClaims?: number[];
  dailyQuestChestPeriodKey?: string;
  inventory: LootItem[];
  equippedItemIds: string[];
  skillUpgradePoints: number;
  skillUpgradeLevels: SkillUpgradeLevels;
  specialization: SpecializationId;
  achievementClaimedIds: string[];
  dailyResetMinutes: number;
  pomodoroSettings: PomodoroSettings;
  boardRefreshPeriodKey?: string;
  userName: string;
  jobClass: JobClass;
};
type SaveProfile = { id: string; name: string; state: AppState };

type TaskDraft = {
  title: string;
  category: Category;
  difficulty: TaskDifficulty;
  icon: string;
  slot: number;
  repeat: TaskRepeat;
};

type RewardDraft = {
  title: string;
  description: string;
  cost: string;
  icon: string;
};

type NotificationSettings = {
  enabled: boolean;
  dailyTaskReminder: boolean;
};

type PomodoroSettings = {
  enabled: boolean;
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  roundsBeforeLongBreak: number;
  autoStartNextPhase: boolean;
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type ScreenWakeLock = {
  release: () => Promise<void>;
};

type NavigatorWithWakeLock = Navigator & {
  wakeLock?: {
    request: (type: "screen") => Promise<ScreenWakeLock>;
  };
};

type ModalState =
  | { kind: "task"; taskId?: string; slot?: number }
  | { kind: "reward"; rewardId?: string }
  | { kind: "profile" }
  | { kind: "refresh" }
  | { kind: "notifications" }
  | { kind: "saves" }
  | null;

type PageKey =
  | "dashboard"
  | "abilities"
  | "skills"
  | "monsters"
  | "soulTrial"
  | "loot"
  | "codex"
  | "monsterCodex"
  | "rewards"
  | "timers"
  | "achievements";

const specializationVisuals: Record<
  SpecializationId,
  { icon: string; subtitle: string; colorClass: string }
> = {
  "warrior-guardian": {
    icon: "shield-check",
    subtitle: "鋼鐵壁壘 · 守護隊友",
    colorClass: "guardian",
  },
  "warrior-berserker": {
    icon: "flame",
    subtitle: "狂怒戰意 · 以傷換傷",
    colorClass: "berserker",
  },
  "archer-ranger": {
    icon: "leaf",
    subtitle: "荒野獵手 · 靈活追擊",
    colorClass: "ranger",
  },
  "archer-sniper": {
    icon: "target",
    subtitle: "致命瞄準 · 一擊破局",
    colorClass: "sniper",
  },
  "mage-elementalist": {
    icon: "sparkles",
    subtitle: "元素共鳴 · 掌控災厄",
    colorClass: "elementalist",
  },
  "mage-frostguard": {
    icon: "moon",
    subtitle: "寒霜結界 · 凍結戰場",
    colorClass: "frostguard",
  },
  "rogue-assassin": {
    icon: "sword",
    subtitle: "暗影獵殺 · 穿透要害",
    colorClass: "assassin",
  },
  "rogue-shadowdancer": {
    icon: "zap",
    subtitle: "幻影舞步 · 閃避連擊",
    colorClass: "shadowdancer",
  },
};

const LOOT_CATEGORY_KEYS = [...EQUIPMENT_SLOTS, "寶物"] as const;
type LootCategory = (typeof LOOT_CATEGORY_KEYS)[number];

const lootCategoryMeta: Record<
  LootCategory,
  { description: string; icon: LucideIcon }
> = {
  頭盔: { description: "頭部防具", icon: ShieldCheck },
  胸甲: { description: "身體防具", icon: ShieldCheck },
  武器: { description: "主要攻擊裝備", icon: Sword },
  護腿: { description: "腿部防具", icon: Shuffle },
  護身符: { description: "飾品與特殊加成", icon: Star },
  寶物: { description: "可出售的冒險寶物", icon: Gift },
};

const STORAGE_KEY = "questboard-rpg-state-v1";
const PROFILES_STORAGE_KEY = "questboard-rpg-profiles-v1";
const SHARED_ACHIEVEMENTS_STORAGE_KEY = "questboard-shared-achievements-v1";
const NOTIFICATION_SETTINGS_KEY = "questboard-notification-settings-v1";
const NOTIFICATION_LAST_REMINDER_KEY = "questboard-notification-last-reminder-v1";
const BOARD_SIZE_KEY = "questboard-board-size-v1";
const ACTIVE_PROFILE_KEY = "questboard-active-profile-v1";
const HEALTH_RECOVERY_INTERVAL_MINUTES = 1;
const HEALTH_RECOVERY_INTERVAL_MS =
  HEALTH_RECOVERY_INTERVAL_MINUTES * 60 * 1000;
const HEALTH_RECOVERY_PERCENT = 0.08;
const POMODORO_ROUND_XP = 25;
const defaultPomodoroSettings: PomodoroSettings = {
  enabled: false,
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  roundsBeforeLongBreak: 4,
  autoStartNextPhase: true,
};

function normalizePomodoroSettings(value: unknown): PomodoroSettings {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return defaultPomodoroSettings;
  }
  const candidate = value as Partial<PomodoroSettings>;
  const integerInRange = (
    input: unknown,
    fallback: number,
    min: number,
    max: number
  ) =>
    typeof input === "number" && Number.isFinite(input)
      ? Math.min(max, Math.max(min, Math.floor(input)))
      : fallback;
  return {
    enabled: candidate.enabled === true,
    focusMinutes: integerInRange(candidate.focusMinutes, 25, 1, 180),
    shortBreakMinutes: integerInRange(candidate.shortBreakMinutes, 5, 1, 60),
    longBreakMinutes: integerInRange(candidate.longBreakMinutes, 15, 1, 120),
    roundsBeforeLongBreak: integerInRange(
      candidate.roundsBeforeLongBreak,
      4,
      1,
      12
    ),
    autoStartNextPhase: candidate.autoStartNextPhase !== false,
  };
}

function pomodoroPhaseLabel(phase: PomodoroPhase) {
  return phase === "focus"
    ? "專注"
    : phase === "shortBreak"
      ? "短休息"
      : "長休息";
}

function getPomodoroPhaseElapsed(runtime: PomodoroRuntime, now: number) {
  return Math.min(
    runtime.phaseDurationSeconds,
    Math.max(0, Math.floor((now - runtime.phaseStartedAt) / 1000))
  );
}

function advancePomodoroRuntime(
  runtime: PomodoroRuntime,
  settings: PomodoroSettings,
  now: number
): PomodoroRuntime {
  if (runtime.phase === "focus") {
    const completedRounds = runtime.completedRounds + 1;
    const longBreak = completedRounds % settings.roundsBeforeLongBreak === 0;
    return {
      phase: longBreak ? "longBreak" : "shortBreak",
      phaseStartedAt: now,
      phaseDurationSeconds:
        (longBreak ? settings.longBreakMinutes : settings.shortBreakMinutes) * 60,
      completedRounds,
      focusSecondsAccumulated:
        runtime.focusSecondsAccumulated + runtime.phaseDurationSeconds,
    };
  }
  return {
    phase: "focus",
    phaseStartedAt: now,
    phaseDurationSeconds: settings.focusMinutes * 60,
    completedRounds: runtime.completedRounds,
    focusSecondsAccumulated: runtime.focusSecondsAccumulated,
  };
}

function getTodayFocusSeconds(
  activity: TimerActivity,
  running: RunningTimer | null,
  now: number
) {
  const dayStart = getTimerDayStart(now);
  const stoppedSeconds = activity.sessions.reduce(
    (total, session) =>
      session.startedAt >= dayStart ? total + session.durationSeconds : total,
    0
  );
  if (running?.activityId !== activity.id) return stoppedSeconds;
  if (!running.pomodoro) return getTimerTodaySeconds(activity, running, now);
  const runtime = running.pomodoro;
  const focusBeforeToday = running.startedAt >= dayStart
    ? runtime.focusSecondsAccumulated
    : 0;
  const currentFocus =
    runtime.phase === "focus" ? getPomodoroPhaseElapsed(runtime, now) : 0;
  return stoppedSeconds + focusBeforeToday + currentFocus;
}

function normalizeAchievementIds(value: unknown): string[] {
  return Array.isArray(value)
    ? [...new Set(value.filter((id): id is string => typeof id === "string"))]
    : [];
}

function normalizeDailyQuestChestClaims(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((milestone): milestone is number =>
    milestone === 3 || milestone === 6 || milestone === 9
  ))];
}

const defaultNotificationSettings: NotificationSettings = {
  enabled: false,
  dailyTaskReminder: true,
};

function loadNotificationSettings(): NotificationSettings {
  if (typeof window === "undefined") return defaultNotificationSettings;
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(NOTIFICATION_SETTINGS_KEY) ?? "null"
    ) as Partial<NotificationSettings> | null;
    return {
      enabled: parsed?.enabled === true,
      dailyTaskReminder: parsed?.dailyTaskReminder !== false,
    };
  } catch {
    return defaultNotificationSettings;
  }
}

function getNotificationPermission(): NotificationPermission | "unsupported" {
  return typeof Notification === "undefined" ? "unsupported" : Notification.permission;
}

async function showQuestNotification(
  title: string,
  body: string,
  tag: string,
  extraOptions: NotificationOptions = {}
) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") {
    return false;
  }
  const options: NotificationOptions = {
    body,
    icon: "/questboard-logo.svg",
    badge: "/questboard-logo.svg",
    tag,
    ...extraOptions,
  };
  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, options);
      return true;
    }
  } catch {
    // Fall back to the page notification when the service worker is unavailable.
  }
  new Notification(title, options);
  return true;
}

const iconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  mail: Mail,
  book: BookOpen,
  dumbbell: Dumbbell,
  droplets: Droplets,
  inbox: Inbox,
  pen: ScrollText,
  check: CheckSquare2,
  leaf: Leaf,
  heart: HeartPulse,
  moon: Moon,
  brain: Brain,
  target: Target,
  sword: Sword,
  star: Star,
  "shield-check": ShieldCheck,
  clock: Clock3,
  flame: Flame,
  skull: Skull,
  zap: Zap,
  award: Award,
  trophy: Trophy,
  coins: Coins,
};

const categoryTone: Record<Category, string> = {
  工作: "violet",
  學習: "blue",
  健康: "green",
  生活: "orange",
  心情: "pink",
};

const defaultTasks: Task[] = [
  {
    id: "task-1",
    slot: 0,
    title: "整理工作桌面",
    category: "生活",
    icon: "sparkles",
    difficulty: "輕量",
    xp: 40,
    coins: 25,
    completed: true,
  },
  {
    id: "task-2",
    slot: 1,
    title: "回覆重要訊息",
    category: "工作",
    icon: "mail",
    difficulty: "標準",
    xp: 55,
    coins: 30,
    completed: true,
  },
  {
    id: "task-3",
    slot: 2,
    title: "閱讀 20 分鐘",
    category: "學習",
    icon: "book",
    difficulty: "標準",
    xp: 60,
    coins: 35,
    completed: true,
  },
  {
    id: "task-4",
    slot: 3,
    title: "完成伸展運動",
    category: "健康",
    icon: "dumbbell",
    difficulty: "輕量",
    xp: 35,
    coins: 20,
    completed: true,
  },
  {
    id: "task-5",
    slot: 4,
    title: "喝滿今日 2000ml",
    category: "健康",
    icon: "droplets",
    difficulty: "標準",
    xp: 50,
    coins: 30,
    completed: true,
  },
  {
    id: "task-6",
    slot: 5,
    title: "整理收件匣",
    category: "工作",
    icon: "inbox",
    difficulty: "標準",
    xp: 50,
    coins: 30,
    completed: false,
  },
  {
    id: "task-7",
    slot: 6,
    title: "寫下今日反思",
    category: "心情",
    icon: "pen",
    difficulty: "輕量",
    xp: 40,
    coins: 25,
    completed: false,
  },
  {
    id: "task-8",
    slot: 7,
    title: "清空待辦 3 項",
    category: "工作",
    icon: "check",
    difficulty: "挑戰",
    xp: 85,
    coins: 45,
    completed: false,
  },
  {
    id: "task-9",
    slot: 8,
    title: "準備明日行程",
    category: "生活",
    icon: "calendar",
    difficulty: "標準",
    xp: 55,
    coins: 30,
    completed: true,
  },
  {
    id: "task-10",
    slot: 9,
    title: "散步 15 分鐘",
    category: "健康",
    icon: "leaf",
    difficulty: "輕量",
    xp: 35,
    coins: 20,
    completed: false,
  },
  {
    id: "task-11",
    slot: 10,
    title: "關閉未使用分頁",
    category: "工作",
    icon: "target",
    difficulty: "輕量",
    xp: 25,
    coins: 15,
    completed: true,
  },
  {
    id: "task-12",
    slot: 11,
    title: "睡前遠離螢幕",
    category: "健康",
    icon: "moon",
    difficulty: "挑戰",
    xp: 75,
    coins: 40,
    completed: false,
  },
];

const defaultRewards: Reward[] = [
  {
    id: "reward-1",
    title: "咖啡店放空 30 分鐘",
    description: "給今天努力的自己一段無任務時間",
    cost: 180,
    icon: "coffee",
  },
  {
    id: "reward-2",
    title: "看一集喜歡的影集",
    description: "把今晚的娛樂變成值得期待的獎勵",
    cost: 260,
    icon: "star",
  },
  {
    id: "reward-3",
    title: "買一份小點心",
    description: "解鎖一份你收藏已久的小確幸",
    cost: 320,
    icon: "gift",
  },
];
const dailyMonsterTones: Monster["tone"][] = [
  "mint",
  "orange",
  "violet",
  "gold",
  "blue",
  "orange",
  "violet",
  "blue",
  "red",
];
const dailyMonsterOffsets = [-10, -6, -2, 2, 6, 10];
function generateDailyMonsters(
  playerLevel: number,
  dateKey: string
): Monster[] {
  return selectDailyMonsterDefinitions(dateKey, 6).map(
    ({ definition, catalogIndex }, index) => {
    const offset = dailyMonsterOffsets[index] ?? 0;
    const level = Math.max(1, playerLevel + offset);
    const reward = Math.min(100, Math.max(20, 20 + Math.round(level * 3.2)));
    const monsterDefinition: MonsterMechanicDefinition = definition;
    return {
      id: `daily-${dateKey}-${catalogIndex}-${level}`,
      ...monsterDefinition,
      level,
      health: 60 + level * 30,
      reward,
      damage: 10 + level * 3,
      defense: 4 + Math.round(level * 0.8),
      critRate: Math.min(25, 4 + level * 0.35),
      critDamage: 140 + Math.min(60, level),
      dodgeRate: Math.min(28, 5 + level * 0.35),
      risk:
        level <= playerLevel - 5
          ? "低風險"
          : level <= playerLevel + 3
            ? "中風險"
            : "高風險",
      requirements: {
        health: 100 + level * 8,
        strength: Math.max(5, Math.round(level * 1.2)),
        defense: Math.max(5, Math.round(level * 1.05)),
      },
      icon: Skull,
      tone: dailyMonsterTones[index % dailyMonsterTones.length],
    };
    }
  );
}

const soulTrialMonsterNames = [
  ["記憶碎片獸", "從未完成的記憶裡誕生的試煉小怪"],
  ["心念吞噬者", "吞食冒險者雜念的幽暗生物"],
  ["夢境獵犬", "追逐靈魂深處恐懼的狩獵者"],
  ["回聲魔偶", "重複播放所有錯過機會的回聲"],
  ["執念藤蔓", "纏繞決心、阻止前進的古老藤蔓"],
  ["迷失旅人", "在靈魂迷宮裡等待下一個挑戰者"],
  ["沉默書吏", "記錄每一次放棄的神秘書吏"],
  ["裂心蝙蝠", "以動搖意志為食的夜行魔物"],
  ["試煉守門犬", "守護靈魂試煉最後一段路的看門者"],
] as const;
const soulTrialMonsterTones: Monster["tone"][] = [
  "violet",
  "blue",
  "red",
  "orange",
  "mint",
  "gold",
  "violet",
  "crimson",
  "red",
];
const soulTrialMonsterOffsets = [-10, -8, -6, -4, -2, 0, 2, 4, 10];

function generateSoulTrialMonsters(soulLevel: number, refreshKey: string) {
  return soulTrialMonsterOffsets.map((offset, index): Monster => {
    const level = Math.max(1, soulLevel + offset);
    const [name, description] = soulTrialMonsterNames[index];
    return {
      id: `soul-trial-${refreshKey}-${index}-${level}`,
      name,
      description,
      level,
      health: 80 + level * 34,
      reward: Math.min(180, Math.max(30, 30 + Math.round(level * 4))),
      damage: 14 + level * 3,
      defense: 6 + Math.round(level * 0.9),
      critRate: Math.min(35, 5 + level * 0.4),
      critDamage: 150 + Math.min(80, Math.round(level * 0.8)),
      dodgeRate: Math.min(32, 6 + level * 0.35),
      risk:
        level <= soulLevel - 5
          ? "低風險"
          : level <= soulLevel + 3
            ? "中風險"
            : "高風險",
      requirements: {
        health: 120 + level * 9,
        strength: Math.max(8, Math.round(level * 1.3)),
        defense: Math.max(8, Math.round(level * 1.1)),
        intelligence: Math.max(5, Math.round(level * 0.7)),
      },
      icon: Sparkles,
      tone: soulTrialMonsterTones[index],
      levelGate: "soul",
    };
  });
}

function generateSoulTrialBosses(refreshKey: string): Monster[] {
  return [100, 150, 200].map((level, index) => {
    const names = ["靈魂審判者", "永劫記憶龍", "終焉自我"];
    const descriptions = [
      "以靈魂的重量衡量冒險者決心的第一位魔王",
      "盤踞於深層記憶、吞噬歲月的高階魔王",
      "只有直面真正自我的冒險者才能挑戰的終焉魔王",
    ];
    return {
      id: `soul-trial-boss-${refreshKey}-${level}`,
      name: names[index],
      description: descriptions[index],
      level,
      health: 3600 + index * 2800,
      reward: 2200 + index * 1800,
      damage: 320 + index * 120,
      defense: 135 + index * 55,
      critRate: 30 + index * 5,
      critDamage: 260 + index * 30,
      dodgeRate: 25 + index * 5,
      risk: index === 0 ? "靈魂風險" : index === 1 ? "絕境風險" : "終焉風險",
      requirements: {
        health: 900 + index * 350,
        strength: 120 + index * 50,
        defense: 110 + index * 45,
        intelligence: 100 + index * 40,
      },
      icon: Sparkles,
      tone: index === 0 ? "violet" : index === 1 ? "gold" : "crimson",
      isBoss: true,
      levelGate: "soul" as const,
    };
  });
}
const bosses: Monster[] = [
  {
    id: "boss-shadow-king",
    name: "暗影區域魔王",
    description: "只有準備充分的冒險者，才能撼動牠的王座",
    level: 50,
    health: 900,
    reward: 500,
    damage: 110,
    defense: 48,
    critRate: 18,
    critDamage: 200,
    dodgeRate: 18,
    risk: "致命風險",
    requirements: { health: 350, strength: 45, defense: 35, intelligence: 25 },
    icon: Skull,
    tone: "red",
    isBoss: true,
  },
  {
    id: "boss-abyss-dragon",
    name: "深淵古龍",
    description: "盤踞在高階區域的終極守門者",
    level: 75,
    health: 1600,
    reward: 900,
    damage: 180,
    defense: 70,
    critRate: 22,
    critDamage: 225,
    dodgeRate: 22,
    risk: "極高風險",
    requirements: { health: 550, strength: 70, defense: 60, intelligence: 50 },
    icon: Skull,
    tone: "gold",
    isBoss: true,
  },
  {
    id: "boss-time-eater",
    name: "時間吞噬者",
    description: "以無盡拖延吞噬整個冒險日誌",
    level: 100,
    health: 2600,
    reward: 1500,
    damage: 260,
    defense: 100,
    critRate: 28,
    critDamage: 250,
    dodgeRate: 26,
    risk: "傳說風險",
    requirements: { health: 800, strength: 100, defense: 90, intelligence: 80 },
    icon: Skull,
    tone: "crimson",
    isBoss: true,
  },
  {
    id: "boss-final",
    name: "最終魔王",
    description: "站在所有區域盡頭的終焉支配者，只有完成最後試煉的冒險者才能挑戰。",
    level: 200,
    health: 3000,
    reward: 4500,
    damage: 525,
    defense: 525,
    intelligence: 600,
    critRate: 75,
    critDamage: 450,
    dodgeRate: 0,
    physicalResistancePercent: 45,
    magicResistancePercent: 45,
    risk: "終焉風險",
    requirements: { health: 1800, strength: 270, defense: 270, intelligence: 270 },
    icon: Skull,
    tone: "crimson",
    isBoss: true,
  },
  {
    id: "boss-vampire-lord",
    name: "吸血鬼領主",
    description: "以古老血契支配夜幕的區域魔王，能從每次攻擊中奪回生命。",
    level: 125,
    health: 3500,
    reward: 2500,
    damage: 200,
    defense: 120,
    critRate: 30,
    critDamage: 150,
    dodgeRate: 35,
    lifestealPercent: 50,
    magicResistancePercent: 25,
    physicalResistancePercent: -10,
    risk: "極高風險",
    requirements: {},
    icon: Skull,
    tone: "violet",
    isBoss: true,
  },
];

function tripleRegionalBossStats(boss: Monster): Monster {
  return {
    ...boss,
    health: boss.health * 3,
    reward: boss.reward * 3,
    damage: boss.damage * 3,
    defense: boss.defense * 3,
    intelligence: boss.intelligence === undefined ? undefined : boss.intelligence * 3,
    critRate: boss.critRate * 3,
    critDamage: boss.critDamage * 3,
    dodgeRate: boss.dodgeRate * 3,
    requirements: Object.fromEntries(
      Object.entries(boss.requirements).map(([key, value]) => [key, (value ?? 0) * 3])
    ) as MonsterRequirements,
    physicalResistancePercent:
      boss.physicalResistancePercent === undefined
        ? undefined
        : boss.physicalResistancePercent * 3,
    magicResistancePercent:
      boss.magicResistancePercent === undefined
        ? undefined
        : boss.magicResistancePercent * 3,
    dodgeIgnorePercent:
      boss.dodgeIgnorePercent === undefined ? undefined : boss.dodgeIgnorePercent * 3,
    lifestealPercent:
      boss.lifestealPercent === undefined ? undefined : boss.lifestealPercent * 3,
    explosionDamage:
      boss.explosionDamage === undefined ? undefined : boss.explosionDamage * 3,
    reflectDamage:
      boss.reflectDamage === undefined ? undefined : boss.reflectDamage * 3,
  };
}

const defaultAbilities: CharacterAbilities = {
  health: 100,
  strength: 5,
  defense: 5,
  intelligence: 5,
};
const defaultCombatStats: CombatStats = {
  critRate: 1,
  critDamage: 150,
  dodgeRate: 3,
  castSpeedPercent: 0,
};
function combatStatsBase(value?: Partial<CombatStats>): CombatStats {
  return {
    critRate:
      typeof value?.critRate === "number"
        ? Math.min(100, Math.max(0, value.critRate))
        : defaultCombatStats.critRate,
    critDamage:
      typeof value?.critDamage === "number"
        ? value.critDamage
        : defaultCombatStats.critDamage,
    dodgeRate:
      typeof value?.dodgeRate === "number"
        ? Math.min(100, Math.max(0, value.dodgeRate))
        : defaultCombatStats.dodgeRate,
    castSpeedPercent:
      typeof value?.castSpeedPercent === "number"
        ? Math.min(80, Math.max(0, value.castSpeedPercent))
        : defaultCombatStats.castSpeedPercent,
  };
}
function getEquipmentBonuses(items: EquipmentItem[]) {
  const abilities: CharacterAbilities = {
    health: 0,
    strength: 0,
    defense: 0,
    intelligence: 0,
  };
  const combat: Partial<CombatStats> = {};
  for (const item of items) {
    const bonus = item.bonus;
    const value = (label: string) =>
      Number(bonus.match(new RegExp(`${label} \\+(\\d+(?:\\.\\d+)?)`))?.[1] ?? 0);
    if (bonus.includes("全能力")) {
      const all = value("全能力");
      abilities.health += all;
      abilities.strength += all;
      abilities.defense += all;
      abilities.intelligence += all;
    }
    abilities.health += value("生命");
    abilities.strength += value("力量");
    abilities.defense += value("防禦");
    abilities.intelligence += value("智力");
    if (bonus.includes("暴擊率"))
      combat.critRate = (combat.critRate ?? 0) + value("暴擊率");
    if (bonus.includes("暴擊傷害"))
      combat.critDamage = (combat.critDamage ?? 0) + value("暴擊傷害");
    if (bonus.includes("閃避率"))
      combat.dodgeRate = (combat.dodgeRate ?? 0) + value("閃避率");
    if (bonus.includes("施法速度"))
      combat.castSpeedPercent = (combat.castSpeedPercent ?? 0) + value("施法速度");
    if (bonus.includes("魔法穿透"))
      combat.magicPenetrationPercent =
        (combat.magicPenetrationPercent ?? 0) + value("魔法穿透");
  }
  const affixBonuses = getEquipmentAffixBonuses(items);
  abilities.health += affixBonuses.health;
  abilities.strength += affixBonuses.strength;
  abilities.defense += affixBonuses.defense;
  abilities.intelligence += affixBonuses.intelligence;
  combat.critRate = (combat.critRate ?? 0) + affixBonuses.critRate;
  combat.critDamage = (combat.critDamage ?? 0) + affixBonuses.critDamage;
  combat.dodgeRate = (combat.dodgeRate ?? 0) + affixBonuses.dodgeRate;
  const setBonuses = getEquipmentSetBonuses(items);
  abilities.health += setBonuses.abilities.health;
  abilities.strength += setBonuses.abilities.strength;
  abilities.defense += setBonuses.abilities.defense;
  abilities.intelligence += setBonuses.abilities.intelligence;
  combat.critRate = (combat.critRate ?? 0) + setBonuses.combat.critRate;
  combat.critDamage = (combat.critDamage ?? 0) + setBonuses.combat.critDamage;
  combat.dodgeRate = (combat.dodgeRate ?? 0) + setBonuses.combat.dodgeRate;
  combat.castSpeedPercent =
    (combat.castSpeedPercent ?? 0) + setBonuses.combat.castSpeedPercent;
  combat.damageReductionPercent =
    (combat.damageReductionPercent ?? 0) + setBonuses.combat.damageReductionPercent;
  combat.magicPenetrationPercent =
    (combat.magicPenetrationPercent ?? 0) + setBonuses.combat.magicPenetrationPercent;
  return { abilities, combat, activeSets: setBonuses.activeSets };
}

function getEffectiveHealthCap(
  abilities: CharacterAbilities,
  jobClass: JobClass,
  inventory: LootItem[],
  equippedItemIds: string[]
): number {
  const equippedIds = new Set(equippedItemIds);
  const equippedItems = inventory.filter(
    (item): item is EquipmentItem =>
      item.kind === "equipment" && equippedIds.has(item.id)
  );
  const classHealthBonus = (jobClasses[jobClass] ?? jobClasses.warrior).bonuses
    .health;
  const equipmentHealthBonus = getEquipmentBonuses(equippedItems).abilities.health;
  return Math.max(1, abilities.health + classHealthBonus + equipmentHealthBonus);
}

function getExperienceBonusPercent(intelligence: number) {
  return Math.min(500, Math.round(intelligence * 10) / 10);
}
function getAttackDamage(
  abilities: CharacterAbilities,
  jobClass: JobClass = "warrior"
) {
  const primaryStat =
    jobClass === "mage" ? abilities.intelligence : abilities.strength;
  return Math.max(
    1,
    Math.round(
      jobClass === "mage"
        ? primaryStat * 1.5
        : primaryStat * 1.5 + abilities.intelligence * 0.25
    )
  );
}
function getPhysicalAttackDamage(abilities: CharacterAbilities) {
  return Math.max(
    1,
    Math.round(abilities.strength * 1.5 + abilities.intelligence * 0.25)
  );
}
function getMagicAttackDamage(abilities: CharacterAbilities) {
  return Math.max(1, Math.round(abilities.intelligence * 1.5));
}
function getDefenseReduction(defense: number) {
  return Math.floor(defense * 0.5);
}
const abilityLabels: Record<AbilityKey, string> = {
  health: "生命",
  strength: "力量",
  defense: "防禦",
  intelligence: "智力",
};
function getAutoGrowth(level: number): CharacterAbilities {
  const levelUps = Math.max(0, level - 1);
  return {
    health: levelUps * 10,
    strength: levelUps,
    defense: levelUps,
    intelligence: levelUps,
  };
}

type LevelGrowth = {
  abilities: CharacterAbilities;
  combat: Partial<CombatStats>;
};

function getLevelGrowth(jobClass: JobClass, levelUps: number): LevelGrowth {
  const safeLevelUps = Math.max(0, levelUps);
  const growth: LevelGrowth = {
    abilities: {
      health:
        jobClass === "warrior"
          ? getWarriorTotalHealthGrowth(safeLevelUps)
          : safeLevelUps * 10,
      strength: safeLevelUps,
      defense: safeLevelUps,
      intelligence: safeLevelUps,
    },
    combat: {},
  };

  if (jobClass === "warrior") {
    growth.abilities.strength += safeLevelUps;
  }
  if (jobClass === "archer") {
    growth.abilities.strength += safeLevelUps;
    growth.combat = {
      critRate: safeLevelUps * 0.6,
      critDamage: safeLevelUps * 0.5,
    };
  }
  if (jobClass === "mage") {
    growth.abilities.defense += safeLevelUps;
    growth.abilities.intelligence += safeLevelUps * 2;
  }
  if (jobClass === "rogue") {
    growth.combat = {
      critRate: safeLevelUps * 0.9,
      critDamage: safeLevelUps,
    };
  }
  return growth;
}

function formatLevelGrowth(jobClass: JobClass, levelUps: number) {
  const growth = getLevelGrowth(jobClass, levelUps);
  const parts = [
    growth.abilities.health ? `生命 +${growth.abilities.health}` : "",
    growth.abilities.strength ? `力量 +${growth.abilities.strength}` : "",
    growth.abilities.defense ? `防禦 +${growth.abilities.defense}` : "",
    growth.abilities.intelligence
      ? `智力 +${growth.abilities.intelligence}`
      : "",
    growth.combat.critRate ? `暴擊率 +${growth.combat.critRate}%` : "",
    growth.combat.critDamage ? `暴擊傷害 +${growth.combat.critDamage}%` : "",
  ].filter(Boolean);
  return parts.join("、");
}

function applyExperienceToState(state: AppState, xpDelta: number): AppState {
  const safeXpDelta = Math.max(0, Math.floor(xpDelta));
  if (safeXpDelta === 0) return state;
  const nextTotalXp = state.totalXp + safeXpDelta;
  const nextLevel = getPlayerLevelStats(nextTotalXp).level;
  const levelUps = Math.max(0, nextLevel - state.abilityLevel);
  const growth = getLevelGrowth(state.jobClass, levelUps);
  const weeklyStats = addWeeklyStats(
    state.weeklyStats,
    {
      levelsGained: levelUps,
      abilitiesGained: growth.abilities,
    },
    new Date()
  );
  return {
    ...state,
    totalXp: nextTotalXp,
    abilityPoints: state.abilityPoints + levelUps * 5,
    skillUpgradePoints:
      state.skillUpgradePoints + getSkillUpgradePointsForLevelUps(levelUps),
    abilityLevel: Math.max(state.abilityLevel, nextLevel),
    abilities: {
      health: state.abilities.health + growth.abilities.health,
      strength: state.abilities.strength + growth.abilities.strength,
      defense: state.abilities.defense + growth.abilities.defense,
      intelligence: state.abilities.intelligence + growth.abilities.intelligence,
    },
    combatStats: {
      ...state.combatStats,
      critRate: Math.min(
        100,
        state.combatStats.critRate + (growth.combat.critRate ?? 0)
      ),
      critDamage: state.combatStats.critDamage + (growth.combat.critDamage ?? 0),
    },
    currentHealth: state.currentHealth + growth.abilities.health,
    weeklyStats,
  };
}

function normalizeRewardRedemptions(value: unknown): RewardRedemption[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is Record<string, unknown> => {
      if (!entry || typeof entry !== "object") return false;
      return (
        typeof entry.id === "string" &&
        typeof entry.rewardId === "string" &&
        typeof entry.title === "string" &&
        typeof entry.cost === "number" &&
        Number.isFinite(entry.cost) &&
        entry.cost >= 0 &&
        typeof entry.redeemedAt === "number" &&
        Number.isFinite(entry.redeemedAt) &&
        entry.redeemedAt > 0
      );
    })
    .map(entry => ({
      id: entry.id as string,
      rewardId: entry.rewardId as string,
      title: entry.title as string,
      cost: Math.floor(entry.cost as number),
      redeemedAt: Math.floor(entry.redeemedAt as number),
    }));
}

function formatRewardRedemptionDate(timestamp: number) {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

const initialState: AppState = {
  tasks: defaultTasks,
  rewards: defaultRewards,
  rewardRedemptions: [],
  weeklyStats: createWeeklyStats(new Date()),
  timerActivities: [],
  runningTimer: null,
  totalXp: 3480,
  coins: 460,
  streak: 6,
  abilities: { health: 230, strength: 18, defense: 18, intelligence: 18 },
  abilityPoints: 65,
  abilityLevel: 14,
  abilityAutoGrowthApplied: true,
  defeatedMonsterIds: [],
  currentHealth: 230,
  nextHealthRecoveryAt: 0,
  combatCooldownUntil: 0,
  soulTrialCooldownUntil: 0,
  combatStats: defaultCombatStats,
  archerDodgeFailStacks: 0,
  allTasksBonusClaimed: false,
  dailyQuestChestClaims: [],
  dailyQuestChestPeriodKey: getRepeatPeriodKey("daily", new Date(), 240),
  inventory: [],
  equippedItemIds: [],
  skillUpgradePoints: 14,
  skillUpgradeLevels: {},
  specialization: "warrior-guardian",
  achievementClaimedIds: [],
  dailyResetMinutes: 240,
  pomodoroSettings: defaultPomodoroSettings,
  boardRefreshPeriodKey: getRepeatPeriodKey("daily", new Date(), 240),
  userName: "Mira Chen",
  jobClass: "warrior",
};

const jobClasses: Record<
  JobClass,
  {
    name: string;
    icon: string;
    description: string;
    levelUpSummary: string;
    bonuses: CharacterAbilities;
    combat: Partial<CombatStats>;
  }
> = {
  warrior: {
    name: "戰士",
    icon: "sword",
    description: "堅韌的前線守護者，擅長生命與防禦。",
    levelUpSummary: "每次升級額外獲得生命 +20、力量 +1",
    bonuses: { health: 20, strength: 2, defense: 3, intelligence: 0 },
    combat: {},
  },
  archer: {
    name: "弓箭手",
    icon: "target",
    description: "敏捷的遠程獵手，擅長閃避與暴擊。",
    levelUpSummary: "每次升級額外獲得攻擊 +1、暴擊率 +0.6%、暴擊傷害 +0.5%",
    bonuses: { health: 0, strength: 2, defense: 0, intelligence: 1 },
    combat: { critRate: 3, dodgeRate: 4 },
  },
  mage: {
    name: "法師",
    icon: "brain",
    description: "操縱知識與魔力，以智力造成法術傷害且無法暴擊。",
    levelUpSummary: "每次升級額外獲得智力 +2、防禦 +1；法術無法暴擊",
    bonuses: { health: 0, strength: 0, defense: 0, intelligence: 4 },
    combat: { critDamage: 15 },
  },
  rogue: {
    name: "盜賊",
    icon: "star",
    description: "靈巧的暗影行者，擅長速度與致命一擊。",
    levelUpSummary: "每次升級額外獲得暴擊率 +0.9%、暴擊傷害 +1%",
    bonuses: { health: 0, strength: 3, defense: 1, intelligence: 1 },
    combat: { critRate: 5, dodgeRate: 6 },
  },
};

const iconOptions = [
  "sparkles",
  "mail",
  "book",
  "dumbbell",
  "droplets",
  "inbox",
  "pen",
  "check",
  "leaf",
  "heart",
  "moon",
  "brain",
  "target",
  "sword",
  "star",
];

function loadState(): AppState {
  if (typeof window === "undefined") return initialState;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialState;
    const parsed = JSON.parse(saved) as Partial<AppState>;
    const savedAbilities = parsed.abilities as
      | Partial<CharacterAbilities>
      | undefined;
    const totalXp =
      typeof parsed.totalXp === "number"
        ? parsed.totalXp
        : initialState.totalXp;
    const playerLevel = getPlayerStats(totalXp).level;
    const hasStoredAbilityLevel = typeof parsed.abilityLevel === "number";
    const storedAbilityLevel = hasStoredAbilityLevel
      ? Math.max(0, parsed.abilityLevel as number)
      : 0;
    const legacyGrowth = parsed.abilityAutoGrowthApplied
      ? { health: 0, strength: 0, defense: 0, intelligence: 0 }
      : getAutoGrowth(playerLevel);
    const levelGrowth = hasStoredAbilityLevel
      ? getAutoGrowth(Math.max(0, playerLevel - storedAbilityLevel + 1))
      : { health: 0, strength: 0, defense: 0, intelligence: 0 };
    const levelUpsSinceSave = hasStoredAbilityLevel
      ? Math.max(0, playerLevel - storedAbilityLevel)
      : 0;
    const abilities: CharacterAbilities = {
      health:
        (typeof savedAbilities?.health === "number"
          ? savedAbilities.health
          : defaultAbilities.health) +
        legacyGrowth.health +
        levelGrowth.health,
      strength:
        (typeof savedAbilities?.strength === "number"
          ? savedAbilities.strength
          : defaultAbilities.strength) +
        legacyGrowth.strength +
        levelGrowth.strength,
      defense:
        (typeof savedAbilities?.defense === "number"
          ? savedAbilities.defense
          : defaultAbilities.defense) +
        legacyGrowth.defense +
        levelGrowth.defense,
      intelligence:
        (typeof savedAbilities?.intelligence === "number"
          ? savedAbilities.intelligence
          : defaultAbilities.intelligence) +
        legacyGrowth.intelligence +
        levelGrowth.intelligence,
    };
    const tasks = (
      Array.isArray(parsed.tasks) ? parsed.tasks : defaultTasks
    ).map(task => ({
      ...task,
      repeat:
        task.repeat === "daily" || task.repeat === "weekly"
          ? task.repeat
          : ("none" as TaskRepeat),
    }));
    const inventory = parseLootInventory(parsed.inventory);
    const jobClass =
      parsed.jobClass && parsed.jobClass in jobClasses
        ? (parsed.jobClass as JobClass)
        : initialState.jobClass;
    const specialization = normalizeSpecialization(
      parsed.specialization,
      jobClass
    );
    const equippedItemIds = normalizeEquippedItemIds(
      inventory,
      parsed.equippedItemIds,
      jobClass
    );
    const skillUpgradeLevels = normalizeSkillUpgradeLevels(
      parsed.skillUpgradeLevels
    );
    const skillUpgradePoints =
      typeof parsed.skillUpgradePoints === "number"
        ? Math.max(0, Math.floor(parsed.skillUpgradePoints) + levelUpsSinceSave)
        : playerLevel;
    const timerState = normalizeTimerSaveState(
      parsed.timerActivities,
      parsed.runningTimer
    );
    const maxHealth = getEffectiveHealthCap(
      abilities,
      jobClass,
      inventory,
      equippedItemIds
    );
    const currentHealth =
      typeof parsed.currentHealth === "number"
        ? clampCurrentHealth(parsed.currentHealth, maxHealth)
        : maxHealth;
    const dailyResetMinutes =
      typeof parsed.dailyResetMinutes === "number"
        ? normalizeResetMinutes(parsed.dailyResetMinutes)
        : initialState.dailyResetMinutes;
    return {
      ...initialState,
      ...parsed,
      totalXp,
      abilities,
      abilityPoints:
        typeof parsed.abilityPoints === "number"
          ? Math.max(0, parsed.abilityPoints + levelUpsSinceSave * 5)
          : Math.max(0, (playerLevel - 1) * 5),
      abilityLevel: Math.max(storedAbilityLevel, playerLevel),
      abilityAutoGrowthApplied: true,
      defeatedMonsterIds: Array.isArray(parsed.defeatedMonsterIds)
        ? parsed.defeatedMonsterIds
        : [],
      currentHealth,
      nextHealthRecoveryAt:
        typeof parsed.nextHealthRecoveryAt === "number"
          ? Math.max(0, parsed.nextHealthRecoveryAt)
          : initialState.nextHealthRecoveryAt,
      combatCooldownUntil:
        typeof parsed.combatCooldownUntil === "number"
          ? Math.max(0, parsed.combatCooldownUntil)
          : 0,
      soulTrialCooldownUntil:
        typeof parsed.soulTrialCooldownUntil === "number"
          ? Math.max(0, parsed.soulTrialCooldownUntil)
          : 0,
      combatStats: {
        critRate:
          typeof parsed.combatStats?.critRate === "number"
            ? Math.min(100, Math.max(0, parsed.combatStats.critRate))
            : defaultCombatStats.critRate,
        critDamage:
          typeof parsed.combatStats?.critDamage === "number"
            ? parsed.combatStats.critDamage
            : defaultCombatStats.critDamage,
        dodgeRate:
          typeof parsed.combatStats?.dodgeRate === "number"
            ? Math.min(100, Math.max(0, parsed.combatStats.dodgeRate))
            : defaultCombatStats.dodgeRate,
      },
      archerDodgeFailStacks: normalizeArcherDodgeFailStacks(
        parsed.archerDodgeFailStacks
      ),
      allTasksBonusClaimed: parsed.allTasksBonusClaimed === true,
      dailyQuestChestClaims: normalizeDailyQuestChestClaims(
        parsed.dailyQuestChestClaims
      ),
      dailyQuestChestPeriodKey:
        typeof parsed.dailyQuestChestPeriodKey === "string"
          ? parsed.dailyQuestChestPeriodKey
          : getRepeatPeriodKey("daily", new Date(), dailyResetMinutes),
      inventory,
      equippedItemIds,
      skillUpgradePoints,
      skillUpgradeLevels,
      specialization,
      achievementClaimedIds: Array.isArray(parsed.achievementClaimedIds)
        ? parsed.achievementClaimedIds.filter((id): id is string => typeof id === "string")
        : [],
      dailyResetMinutes,
      pomodoroSettings: normalizePomodoroSettings(parsed.pomodoroSettings),
      boardRefreshPeriodKey:
        typeof parsed.boardRefreshPeriodKey === "string"
          ? parsed.boardRefreshPeriodKey
          : getRepeatPeriodKey("daily", new Date(), dailyResetMinutes),
      userName:
        typeof parsed.userName === "string" && parsed.userName.trim()
          ? parsed.userName.trim().slice(0, 24)
          : initialState.userName,
      jobClass,
      timerActivities: timerState.activities,
      runningTimer: timerState.runningTimer,
      tasks,
      rewards: Array.isArray(parsed.rewards) ? parsed.rewards : defaultRewards,
      rewardRedemptions: normalizeRewardRedemptions(parsed.rewardRedemptions),
      weeklyStats: normalizeWeeklyStats(parsed.weeklyStats, new Date()),
    };
  } catch {
    return initialState;
  }
}

function loadBoardSize(): BoardSize {
  if (typeof window === "undefined") return 4;
  const saved = window.localStorage.getItem(BOARD_SIZE_KEY);
  return saved === "3" || saved === "5" ? (Number(saved) as BoardSize) : 4;
}

function normalizeProfileLoot(profileState: AppState): AppState {
  const inventory = parseLootInventory(profileState.inventory);
  const jobClass =
    profileState.jobClass && profileState.jobClass in jobClasses
      ? profileState.jobClass
      : initialState.jobClass;
  const equippedItemIds = normalizeEquippedItemIds(
    inventory,
    profileState.equippedItemIds,
    jobClass
  );
  const abilities = {
    ...initialState.abilities,
    ...(profileState.abilities ?? {}),
  };
  const timerState = normalizeTimerSaveState(
    profileState.timerActivities,
    profileState.runningTimer
  );
  return {
    ...profileState,
    abilities,
    jobClass,
    timerActivities: timerState.activities,
    runningTimer: timerState.runningTimer,
    archerDodgeFailStacks: normalizeArcherDodgeFailStacks(
      profileState.archerDodgeFailStacks
    ),
    rewardRedemptions: normalizeRewardRedemptions(
      profileState.rewardRedemptions
    ),
    weeklyStats: normalizeWeeklyStats(profileState.weeklyStats, new Date()),
    inventory,
    equippedItemIds,
    skillUpgradePoints: Math.max(
      0,
      profileState.skillUpgradePoints ?? profileState.abilityLevel ?? 0
    ),
    skillUpgradeLevels: normalizeSkillUpgradeLevels(
      profileState.skillUpgradeLevels
    ),
    specialization: normalizeSpecialization(
      profileState.specialization,
      jobClass
    ),
    achievementClaimedIds: Array.isArray(profileState.achievementClaimedIds)
      ? profileState.achievementClaimedIds.filter(
          (id): id is string => typeof id === "string"
        )
      : [],
    currentHealth: clampCurrentHealth(
      profileState.currentHealth,
      getEffectiveHealthCap(abilities, jobClass, inventory, equippedItemIds)
    ),
  };
}

function loadProfiles(): SaveProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed
          .filter((profile): profile is SaveProfile =>
            Boolean(
              profile &&
                typeof profile.id === "string" &&
                typeof profile.name === "string" &&
                profile.state &&
                typeof profile.state.totalXp === "number"
            )
          )
          .map(profile => ({
            ...profile,
            state: normalizeProfileLoot(profile.state),
          }))
      : [];
  } catch {
    return [];
  }
}

function loadActiveProfileId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_PROFILE_KEY);
}

function loadSharedAchievementClaimedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = JSON.parse(
      window.localStorage.getItem(SHARED_ACHIEVEMENTS_STORAGE_KEY) ?? "null"
    ) as { claimedIds?: unknown } | null;
    const sharedIds = normalizeAchievementIds(saved?.claimedIds);
    const legacyIds = [
      ...normalizeAchievementIds(loadState().achievementClaimedIds),
      ...loadProfiles().flatMap(profile =>
        normalizeAchievementIds(profile.state.achievementClaimedIds)
      ),
    ];
    return [...new Set([...sharedIds, ...legacyIds])];
  } catch {
    return [];
  }
}

function makeProfile(name: string, profileState: AppState): SaveProfile {
  return {
    id: `save-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    name: name.trim().slice(0, 24) || "未命名冒險",
    state: profileState,
  };
}

function getSoulMemory(profiles: SaveProfile[], currentState: AppState) {
  const states = profiles.length
    ? profiles.map(profile => profile.state)
    : [currentState];
  const totalXp = Math.floor(
    states.reduce((sum, item) => sum + Math.max(0, item.totalXp), 0) * 0.1
  );
  const abilities = (Object.keys(defaultAbilities) as AbilityKey[]).reduce(
    (result, key) => {
      result[key] = Math.floor(
        states.reduce(
          (sum, item) =>
            sum + Math.max(0, item.abilities?.[key] ?? defaultAbilities[key]),
          0
        ) * 0.1
      );
      return result;
    },
    {
      health: 0,
      strength: 0,
      defense: 0,
      intelligence: 0,
    } as CharacterAbilities
  );
  const abilityLevel = Math.floor(
    states.reduce((sum, item) => sum + Math.max(0, item.abilityLevel ?? 0), 0) *
      0.1
  );
  return {
    totalXp,
    level: getPlayerStats(totalXp).level,
    abilities,
    abilityLevel,
    roleCount: states.length,
  };
}

const getPlayerStats = getPlayerLevelStats;

function formatCooldown(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function getSmallMonsterRefreshKey(date: Date) {
  return `small-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getWeeklyBossRefreshKey(date: Date) {
  const refreshStart = new Date(date);
  const day = refreshStart.getDay();
  refreshStart.setDate(refreshStart.getDate() - (day === 0 ? 6 : day - 1));
  refreshStart.setHours(0, 0, 0, 0);
  return `boss-${refreshStart.getFullYear()}-${refreshStart.getMonth() + 1}-${refreshStart.getDate()}`;
}

function getNextSmallMonsterRefreshAt(timestamp: number) {
  const next = new Date(timestamp);
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() + 1);
  return next.getTime();
}

function getNextWeeklyBossRefreshAt(timestamp: number) {
  const next = new Date(timestamp);
  const day = next.getDay();
  next.setDate(next.getDate() + (day === 0 ? 1 : 8 - day));
  next.setHours(0, 0, 0, 0);
  return next.getTime();
}

function formatRefreshDate(timestamp: number) {
  return new Intl.DateTimeFormat("zh-TW", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function formatRefreshCountdown(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  if (totalSeconds < 60) return `${totalSeconds} 秒`;
  const totalMinutes = Math.ceil(totalSeconds / 60);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days} 天 ${hours} 小時`;
  if (hours > 0) return `${hours} 小時 ${minutes} 分`;
  return `${minutes} 分`;
}

function getBingoLines(tasks: Task[], size: BoardSize) {
  const completed = new Set(
    tasks.filter(task => task.completed).map(task => task.slot)
  );
  const lines: number[][] = [];
  for (let row = 0; row < size; row += 1)
    lines.push(
      Array.from({ length: size }, (_, column) => row * size + column)
    );
  for (let column = 0; column < size; column += 1)
    lines.push(Array.from({ length: size }, (_, row) => row * size + column));
  lines.push(Array.from({ length: size }, (_, index) => index * size + index));
  lines.push(
    Array.from(
      { length: size },
      (_, index) => index * size + (size - 1 - index)
    )
  );
  return lines.filter(line => line.every(slot => completed.has(slot)));
}

function getTaskIcon(name: string, size = 18) {
  const Icon = iconMap[name] ?? Sparkles;
  return <Icon size={size} strokeWidth={2.2} />;
}

function formatDate() {
  return new Intl.DateTimeFormat("zh-TW", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date());
}

function normalizeResetMinutes(value: number) {
  return Math.min(1439, Math.max(0, Math.round(value)));
}

function getRefreshAnchor(date: Date, resetMinutes: number) {
  const anchor = new Date(date);
  const safeMinutes = normalizeResetMinutes(resetMinutes);
  anchor.setHours(Math.floor(safeMinutes / 60), safeMinutes % 60, 0, 0);
  if (date.getTime() < anchor.getTime()) anchor.setDate(anchor.getDate() - 1);
  return anchor;
}

function getRepeatPeriodKey(
  repeat: TaskRepeat,
  date: Date,
  resetMinutes: number
) {
  if (repeat === "none") return "none";
  const anchor = getRefreshAnchor(date, resetMinutes);
  if (repeat === "daily")
    return `daily-${anchor.getFullYear()}-${anchor.getMonth() + 1}-${anchor.getDate()}`;
  const monday = new Date(anchor);
  const day = monday.getDay();
  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
  return `weekly-${monday.getFullYear()}-${monday.getMonth() + 1}-${monday.getDate()}`;
}

function formatResetTime(minutes: number) {
  const safeMinutes = normalizeResetMinutes(minutes);
  return `${String(Math.floor(safeMinutes / 60)).padStart(2, "0")}:${String(safeMinutes % 60).padStart(2, "0")}`;
}

function getRepeatLabel(repeat?: TaskRepeat) {
  return repeat === "daily" ? "每日" : repeat === "weekly" ? "每週" : "不重複";
}

function getInitials(name: string) {
  const trimmed = name.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length > 1)
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return trimmed.slice(0, 2).toUpperCase() || "MC";
}

function formatDropChance(chance: number) {
  return `${Number((chance * 100).toFixed(2))}%`;
}

function LootProbabilityGuide({
  monsterLevels,
  bossLevels,
}: {
  monsterLevels: number[];
  bossLevels: number[];
}) {
  const bossLevel = bossLevels[0] ?? 50;
  const levelRows = [...new Set(monsterLevels)]
    .sort((left, right) => left - right)
    .map(level => ({
      label: `小怪 Lv.${level}`,
      summary: getLootProbabilitySummary({ level }),
    }));
  const bossRows = [...new Set(bossLevels)]
    .sort((left, right) => left - right)
    .map(level => ({
      label: `區域魔王 Lv.${level}`,
      summary: getLootProbabilitySummary({ level, isBoss: true }),
    }));
  const rows = [
    ...levelRows,
    ...bossRows,
  ];
  const summaryCards = [
    {
      label: "普通小怪 · 單次挑戰",
      summary: getLootProbabilitySummary({ level: monsterLevels[0] ?? 1 }),
    },
    {
      label: "區域魔王 · 單次挑戰",
      summary: getLootProbabilitySummary({ level: bossLevel, isBoss: true }),
    },
  ];

  const renderRarityTable = (kind: "equipment" | "treasure") => (
    <div className={`loot-probability-table-card loot-probability-${kind}`}>
      <h4>{kind === "equipment" ? "裝備" : "可販售寶藏"}</h4>
      <div className="loot-probability-table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">怪物</th>
              {LOOT_RARITIES.map(rarity => (
                <th
                  className={`rarity-${LOOT_RARITY_CLASS[rarity]}`}
                  key={`${kind}-header-${rarity}`}
                  scope="col"
                >
                  {rarity}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ label, summary }) => {
              const itemChance =
                kind === "equipment"
                  ? summary.equipmentChance
                  : summary.treasureChance;
              const rarities =
                kind === "equipment"
                  ? summary.equipmentRarities
                  : summary.treasureRarities;
              return (
                <tr key={`${kind}-${label}`}>
                  <th scope="row">{label}</th>
                  {LOOT_RARITIES.map(rarity => {
                    const chance = itemChance * rarities[rarity];
                    return (
                      <td
                        className={chance > 0 ? "has-chance" : "no-chance"}
                        key={`${kind}-${label}-${rarity}`}
                      >
                        {formatDropChance(chance)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <section className="loot-probability-panel panel-card" aria-labelledby="loot-probability-title">
      <div className="loot-probability-heading">
        <div>
          <div className="section-kicker">
            <Sparkles size={14} /> LOOT CHANCES
          </div>
          <h3 id="loot-probability-title">戰利品掉落機率</h3>
          <p>
            掉落率以每次挑戰計；下方品質表列出單次挑戰取得該品質物品的機率。
            寶藏可在戰利品庫出售換取金幣。
          </p>
        </div>
      </div>

      <div className="loot-drop-summary-grid">
        {summaryCards.map(({ label, summary }) => (
          <div className="loot-drop-summary-card" key={label}>
            <strong>{label}</strong>
            <div className="loot-drop-summary-rates">
              <span>
                <small>任意掉落</small>
                <b>{formatDropChance(summary.dropChance)}</b>
              </span>
              <span>
                <small>裝備</small>
                <b>{formatDropChance(summary.equipmentChance)}</b>
              </span>
              <span>
                <small>可販售寶藏</small>
                <b>{formatDropChance(summary.treasureChance)}</b>
              </span>
              <span>
                <small>無掉落</small>
                <b>{formatDropChance(summary.noDropChance)}</b>
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="loot-probability-note">
        稀有度表中的百分比也是「每次挑戰」的總機率，不是先掉落後的條件機率；裝備品質已計入裝備模板的最低品質。
      </p>
      <div className="loot-probability-tables">
        {renderRarityTable("equipment")}
        {renderRarityTable("treasure")}
      </div>
      <div className="loot-probability-footnote">
        寶藏依怪物等級抽取品質；小怪的可掉落裝備種類會依等級解鎖。魔王必定掉落一件戰利品，裝備和寶藏類型各自依表列機率計算。
      </div>
    </section>
  );
}

export default function Home() {
  const [state, setState] = useState<AppState>(() => normalizeProfileLoot(loadState()));
  const [profiles, setProfiles] = useState<SaveProfile[]>(() => loadProfiles());
  const [sharedAchievementClaimedIds, setSharedAchievementClaimedIds] =
    useState<string[]>(() => loadSharedAchievementClaimedIds());
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(() => loadNotificationSettings());
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported"
  >(() => getNotificationPermission());
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(() =>
    loadActiveProfileId()
  );
  const [boardSize, setBoardSize] = useState<BoardSize>(() => loadBoardSize());
  const [modal, setModal] = useState<ModalState>(null);
  const [taskDraft, setTaskDraft] = useState<TaskDraft>({
    title: "",
    category: "工作",
    difficulty: "標準",
    icon: "sparkles",
    slot: 0,
    repeat: "none",
  });
  const [taskCategoryFilter, setTaskCategoryFilter] =
    useState<TaskCategoryFilter>("all");
  const [taskDifficultyFilter, setTaskDifficultyFilter] =
    useState<TaskDifficultyFilter>("all");
  const [rewardDraft, setRewardDraft] = useState<RewardDraft>({
    title: "",
    description: "",
    cost: "200",
    icon: "gift",
  });
  const [rewardHistoryQuery, setRewardHistoryQuery] = useState("");
  const [weeklyReportOpen, setWeeklyReportOpen] = useState(false);
  const [refreshDraft, setRefreshDraft] = useState("04:00");
  const [profileDraft, setProfileDraft] = useState("");
  const [timerNameDraft, setTimerNameDraft] = useState("");
  const [timerLockOwned, setTimerLockOwned] = useState(false);
  const [floatingTimerExpanded, setFloatingTimerExpanded] = useState(false);
  const timerLeaseRef = useRef<ActivityTimerLockLease | null>(null);
  const timerLeaseRunIdRef = useRef<string | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const activeProfileIdRef = useRef(activeProfileId);
  activeProfileIdRef.current = activeProfileId;
  const getStoredProfiles = () => loadProfiles();
  const getLatestProfiles = () => {
    const currentProfileId = activeProfileIdRef.current;
    const currentState = stateRef.current;
    return getStoredProfiles().map(profile =>
      profile.id === currentProfileId ? { ...profile, state: currentState } : profile
    );
  };
  const [toast, setToast] = useState<string | null>(null);
  const [undoAction, setUndoAction] = useState<{
    label: string;
    restore: () => void;
  } | null>(null);
  const undoTimeoutRef = useRef<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const wakeLockRef = useRef<ScreenWakeLock | null>(null);
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [battleFx, setBattleFx] = useState<BattleFx | null>(null);
  const battleFxIdRef = useRef(0);
  const [activePage, setActivePage] = useState<PageKey>("dashboard");
  const [selectedLootCategory, setSelectedLootCategory] =
    useState<LootCategory>("頭盔");
  const [selectedEquipmentForComparison, setSelectedEquipmentForComparison] =
    useState<EquipmentItem | null>(null);
  const [codexRarity, setCodexRarity] = useState<"all" | LootRarity>("all");
  const [codexSlot, setCodexSlot] = useState<"all" | (typeof EQUIPMENT_SLOTS)[number]>("all");
  const [monsterCodexSearch, setMonsterCodexSearch] = useState("");
  const [monsterCodexRegion, setMonsterCodexRegion] = useState("all");
  const [selectedFusionItemIds, setSelectedFusionItemIds] = useState<string[]>([]);
  const [saveNameDraft, setSaveNameDraft] = useState("");
  const [setupName, setSetupName] = useState("");
  const [setupJobClass, setSetupJobClass] = useState<JobClass>("warrior");
  const [setupOpen, setSetupOpen] = useState(() => loadProfiles().length === 0);
  const [newProfileSetupOpen, setNewProfileSetupOpen] = useState(false);

  const makeFreshState = (name: string, jobClass: JobClass): AppState => ({
    ...initialState,
    tasks: initialState.tasks.map(task => ({
      ...task,
      completed: false,
      awardedXp: undefined,
      completedPeriodKey: undefined,
    })),
    totalXp: 0,
    coins: 0,
    weeklyStats: createWeeklyStats(new Date()),
    streak: 0,
    abilities: { ...defaultAbilities },
    abilityPoints: 0,
    abilityLevel: 0,
    abilityAutoGrowthApplied: true,
    skillUpgradePoints: 0,
    skillUpgradeLevels: {},
    specialization: getDefaultSpecialization(jobClass),
    defeatedMonsterIds: [],
    currentHealth: defaultAbilities.health,
    nextHealthRecoveryAt: 0,
    combatCooldownUntil: 0,
    soulTrialCooldownUntil: 0,
    combatStats: { ...defaultCombatStats },
    allTasksBonusClaimed: false,
    inventory: [],
    equippedItemIds: [],
    userName: name.slice(0, 24),
    jobClass,
  });

  const player = useMemo(() => getPlayerStats(state.totalXp), [state.totalXp]);
  const filteredRewardRedemptions = useMemo(() => {
    const query = rewardHistoryQuery.trim().toLowerCase();
    return state.rewardRedemptions
      .filter(entry => !query || entry.title.toLowerCase().includes(query))
      .slice()
      .sort((a, b) => b.redeemedAt - a.redeemedAt);
  }, [rewardHistoryQuery, state.rewardRedemptions]);
  const soulMemory = useMemo(
    () => getSoulMemory(profiles, state),
    [profiles, state]
  );
  const userInitials = useMemo(
    () => getInitials(state.userName),
    [state.userName]
  );
  const totalTimerSeconds = state.timerActivities.reduce(
    (total, activity) =>
      total + getTodayFocusSeconds(activity, state.runningTimer, currentTime),
    0
  );
  const todayTimerDayStart = getTimerDayStart(currentTime);
  const todayPomodoroRounds = state.timerActivities.reduce(
    (total, activity) =>
      total +
      activity.sessions.reduce(
        (sessionTotal, session) =>
          session.startedAt >= todayTimerDayStart
            ? sessionTotal + (session.pomodoroRoundsCompleted ?? 0)
            : sessionTotal,
        0
      ),
    0
  ) + (state.runningTimer?.pomodoro?.completedRounds ?? 0);
  const totalTimerAbilityPoints = state.timerActivities.reduce(
    (total, activity) => total + activity.abilityPointsEarned,
    0
  );
  const totalTimerXp = state.timerActivities.reduce(
    (total, activity) => total + activity.xpEarned,
    0
  );
  const runningTimerActivity = state.runningTimer
    ? state.timerActivities.find(
        activity => activity.id === state.runningTimer?.activityId
      ) ?? null
    : null;
  const activeTimerProfile = profiles.find(
    profile => profile.state.runningTimer !== null
  );
  const activeTimerProfileActivity = activeTimerProfile?.state.timerActivities.find(
    activity => activity.id === activeTimerProfile.state.runningTimer?.activityId
  );
  const anyProfileTimerRunning = Boolean(activeTimerProfile);
  const smallMonsterRefreshKey = useMemo(
    () => getSmallMonsterRefreshKey(new Date(currentTime)),
    [currentTime]
  );
  const weeklyBossRefreshKey = useMemo(
    () => getWeeklyBossRefreshKey(new Date(currentTime)),
    [currentTime]
  );
  const dailyMonsters = useMemo(
    () => generateDailyMonsters(player.level, smallMonsterRefreshKey),
    [player.level, smallMonsterRefreshKey]
  );
  const soulTrialMonsters = useMemo(
    () => generateSoulTrialMonsters(soulMemory.level, smallMonsterRefreshKey),
    [soulMemory.level, smallMonsterRefreshKey]
  );
  const activeBosses = useMemo(
    () =>
      bosses.map(boss => ({
        ...tripleRegionalBossStats(boss),
        id: `${boss.id}-${weeklyBossRefreshKey}`,
      })),
    [weeklyBossRefreshKey]
  );
  const activeSoulTrialBosses = useMemo(
    () => generateSoulTrialBosses(weeklyBossRefreshKey),
    [weeklyBossRefreshKey]
  );
  const allAvailableMonsters = useMemo(
    () => [
      ...dailyMonsters,
      ...activeBosses,
      ...soulTrialMonsters,
      ...activeSoulTrialBosses,
    ],
    [dailyMonsters, activeBosses, soulTrialMonsters, activeSoulTrialBosses]
  );
  const nextSmallMonsterRefreshAt = useMemo(
    () => getNextSmallMonsterRefreshAt(currentTime),
    [currentTime]
  );
  const nextWeeklyBossRefreshAt = useMemo(
    () => getNextWeeklyBossRefreshAt(currentTime),
    [currentTime]
  );
  const boardSlotCount = boardSize * boardSize;
  const boardTasks = useMemo(
    () => state.tasks.filter(task => task.slot < boardSlotCount),
    [state.tasks, boardSlotCount]
  );
  const bingoLines = useMemo(
    () => getBingoLines(boardTasks, boardSize),
    [boardTasks, boardSize]
  );
  const activeTasks = boardTasks.length;
  const completedTasks = boardTasks.filter(task => task.completed).length;
  const dailyChestPeriodKey = getRepeatPeriodKey(
    "daily",
    new Date(currentTime),
    state.dailyResetMinutes
  );
  const dailyChestClaims =
    state.dailyQuestChestPeriodKey === dailyChestPeriodKey
      ? normalizeDailyQuestChestClaims(state.dailyQuestChestClaims)
      : [];
  const completionPercent = activeTasks
    ? Math.round((completedTasks / activeTasks) * 100)
    : 0;
  const filteredTaskCount = useMemo(
    () =>
      boardTasks.filter(
        task =>
          (taskCategoryFilter === "all" ||
            task.category === taskCategoryFilter) &&
          (taskDifficultyFilter === "all" ||
            task.difficulty === taskDifficultyFilter)
      ).length,
    [boardTasks, taskCategoryFilter, taskDifficultyFilter]
  );
  const hasTaskFilters =
    taskCategoryFilter !== "all" || taskDifficultyFilter !== "all";
  const taskBySlot = useMemo(
    () => new Map(boardTasks.map(task => [task.slot, task])),
    [boardTasks]
  );
  const firstEmptySlot = useMemo(
    () =>
      Array.from({ length: boardSlotCount }, (_, slot) => slot).find(
        slot => !taskBySlot.has(slot)
      ) ?? -1,
    [boardSlotCount, taskBySlot]
  );
  const defeatedMonsterIds = Array.isArray(state.defeatedMonsterIds)
    ? state.defeatedMonsterIds
    : [];
  const inventory = Array.isArray(state.inventory) ? state.inventory : [];
  const getLootCategoryItems = (category: LootCategory) =>
    inventory.filter(item =>
      category === "寶物"
        ? item.kind === "treasure"
        : item.kind === "equipment" && item.slot === category
    );
  const selectedLootItems = getLootCategoryItems(selectedLootCategory);
  const equippedItemIds = normalizeEquippedItemIds(
    inventory,
    state.equippedItemIds,
    state.jobClass
  );
  const equippedItems = equippedItemIds
    .map(id => inventory.find(item => item.id === id))
    .filter((item): item is EquipmentItem => item?.kind === "equipment");
  const equipmentComparison = selectedEquipmentForComparison
    ? (() => {
        const currentItem = equippedItems.find(
          item => item.slot === selectedEquipmentForComparison.slot
        );
        const replacementItems = [
          ...equippedItems.filter(item => item.slot !== selectedEquipmentForComparison.slot),
          selectedEquipmentForComparison,
        ];
        const currentBonuses = getEquipmentBonuses(equippedItems);
        const replacementBonuses = getEquipmentBonuses(replacementItems);
        const abilitiesWith = (bonuses: ReturnType<typeof getEquipmentBonuses>) => ({
          health: state.abilities.health + bonuses.abilities.health,
          strength: state.abilities.strength + bonuses.abilities.strength,
          defense: state.abilities.defense + bonuses.abilities.defense,
          intelligence: state.abilities.intelligence + bonuses.abilities.intelligence,
        });
        const currentAbilities = abilitiesWith(currentBonuses);
        const replacementAbilities = abilitiesWith(replacementBonuses);
        const currentCombat = {
          critRate: (state.combatStats.critRate ?? 0) + (currentBonuses.combat.critRate ?? 0),
          critDamage: (state.combatStats.critDamage ?? 0) + (currentBonuses.combat.critDamage ?? 0),
          dodgeRate: (state.combatStats.dodgeRate ?? 0) + (currentBonuses.combat.dodgeRate ?? 0),
        };
        const replacementCombat = {
          critRate: (state.combatStats.critRate ?? 0) + (replacementBonuses.combat.critRate ?? 0),
          critDamage: (state.combatStats.critDamage ?? 0) + (replacementBonuses.combat.critDamage ?? 0),
          dodgeRate: (state.combatStats.dodgeRate ?? 0) + (replacementBonuses.combat.dodgeRate ?? 0),
        };
        const currentMagicPenetration = Number(
          currentItem?.bonus.match(/魔法穿透 \+(\d+(?:\.\d+)?)%?/)?.[1] ?? 0
        );
        const replacementMagicPenetration = Number(
          selectedEquipmentForComparison.bonus.match(/魔法穿透 \+(\d+(?:\.\d+)?)%?/)?.[1] ?? 0
        );
        return {
          currentItem,
          stats: [
            { label: "物理攻擊", unit: "", current: getPhysicalAttackDamage(currentAbilities), replacement: getPhysicalAttackDamage(replacementAbilities) },
            { label: "魔法攻擊", unit: "", current: getMagicAttackDamage(currentAbilities), replacement: getMagicAttackDamage(replacementAbilities) },
            { label: "生命", unit: "", current: currentAbilities.health, replacement: replacementAbilities.health },
            { label: "防禦", unit: "", current: currentAbilities.defense, replacement: replacementAbilities.defense },
            { label: "暴擊率", unit: "%", current: currentCombat.critRate, replacement: replacementCombat.critRate },
            { label: "暴擊傷害", unit: "%", current: currentCombat.critDamage, replacement: replacementCombat.critDamage },
            { label: "閃避率", unit: "%", current: currentCombat.dodgeRate, replacement: replacementCombat.dodgeRate },
            { label: "魔法穿透", unit: "%", current: currentMagicPenetration, replacement: replacementMagicPenetration },
          ],
        };
      })()
    : null;
  const codexItems = RPG_EQUIPMENT_TEMPLATES.filter(item =>
    (codexRarity === "all" || item.rarity === codexRarity) &&
    (codexSlot === "all" || item.slot === codexSlot)
  );
  const codexProfileStates = [
    state,
    ...profiles
      .filter(profile => profile.id !== activeProfileId)
      .map(profile => profile.state),
  ];
  const discoveredEquipmentNames = new Set(
    codexProfileStates.flatMap(profileState =>
      profileState.inventory
        .filter((item): item is EquipmentItem => item.kind === "equipment")
        .map(item => item.name)
    )
  );
  const codexDiscoveredCount = RPG_EQUIPMENT_TEMPLATES.filter(item =>
    discoveredEquipmentNames.has(item.name)
  ).length;
  const codexCompletionPercent = RPG_EQUIPMENT_TEMPLATES.length
    ? Math.round((codexDiscoveredCount / RPG_EQUIPMENT_TEMPLATES.length) * 100)
    : 0;
  const monsterCodexEntries = [
    ...DAILY_MONSTER_CATALOG.map((monster, index) => ({
      id: `catalog-${index}`,
      name: monster.name,
      description: monster.description,
      region: monster.region,
      icon: Skull,
      isBoss: false,
      mechanicLabels: getMonsterMechanicLabels(monster),
      discovered: defeatedMonsterIds.some(
        id => id.startsWith("daily-") && id.includes(`-${index}-`)
      ),
    })),
    ...bosses.map(boss => ({
      id: boss.id,
      name: boss.name,
      description: boss.description,
      region: "區域魔王",
      icon: boss.icon,
      isBoss: true,
      mechanicLabels: getMonsterMechanicLabels(boss),
      discovered: defeatedMonsterIds.some(
        id => id === boss.id || id.startsWith(`${boss.id}-`)
      ),
    })),
    ...soulTrialMonsters.map((monster, index) => ({
      id: `soul-catalog-${index}`,
      name: monster.name,
      description: monster.description,
      region: "靈魂試煉",
      icon: monster.icon,
      isBoss: false,
      mechanicLabels: getMonsterMechanicLabels(monster),
      discovered: defeatedMonsterIds.some(
        id => id.startsWith("soul-trial-") && id.includes(`-${index}-`)
      ),
    })),
    ...activeSoulTrialBosses.map(boss => ({
      id: `soul-boss-catalog-${boss.level}`,
      name: boss.name,
      description: boss.description,
      region: "靈魂試煉",
      icon: boss.icon,
      isBoss: true,
      mechanicLabels: getMonsterMechanicLabels(boss),
      discovered: defeatedMonsterIds.some(
        id => id.startsWith(`soul-trial-boss-`) && id.endsWith(`-${boss.level}`)
      ),
    })),
  ];
  const monsterCodexRegions = Array.from(
    new Set(monsterCodexEntries.map(monster => monster.region))
  );
  const filteredMonsterCodexEntries = monsterCodexEntries.filter(monster => {
    const query = monsterCodexSearch.trim().toLowerCase();
    return (
      (monsterCodexRegion === "all" || monster.region === monsterCodexRegion) &&
      (!query ||
        `${monster.name} ${monster.description} ${monster.region}`
          .toLowerCase()
          .includes(query))
    );
  });
  const monsterCodexDiscoveredCount = monsterCodexEntries.filter(
    monster => monster.discovered
  ).length;
  const selectedFusionItems = selectedFusionItemIds
    .map(id => inventory.find((item): item is EquipmentItem =>
      item.id === id && item.kind === "equipment"
    ))
    .filter(
      (item): item is EquipmentItem =>
        item !== undefined && !equippedItemIds.includes(item.id)
    );
  const selectedFusionRarity = selectedFusionItems[0]?.rarity ?? null;
  const selectableFusionItems = inventory.filter(
    (item): item is EquipmentItem =>
      item.kind === "equipment" &&
      !equippedItemIds.includes(item.id) &&
      (!selectedFusionRarity || item.rarity === selectedFusionRarity)
  );
  const classDefinition = jobClasses[state.jobClass] ?? jobClasses.warrior;
  const isMage = state.jobClass === "mage";
  const isArcher = state.jobClass === "archer";
  const equipmentBonuses = useMemo(
    () => getEquipmentBonuses(equippedItems),
    [equippedItems]
  );
  const effectiveAbilities: CharacterAbilities = {
    health:
      state.abilities.health +
      classDefinition.bonuses.health +
      equipmentBonuses.abilities.health,
    strength:
      state.abilities.strength +
      classDefinition.bonuses.strength +
      equipmentBonuses.abilities.strength,
    defense:
      state.abilities.defense +
      classDefinition.bonuses.defense +
      equipmentBonuses.abilities.defense,
    intelligence:
      state.abilities.intelligence +
      classDefinition.bonuses.intelligence +
      equipmentBonuses.abilities.intelligence,
  };
  const archerTalentBonuses = getArcherTalentBonuses(
    state.archerDodgeFailStacks
  );
  const skillUpgradeLevels = state.skillUpgradeLevels ?? {};
  const currentSpecialization = getSpecialization(
    state.jobClass,
    state.specialization
  );
  const currentSpecializationVisual = specializationVisuals[currentSpecialization.id];
  const specializationUnlocked = player.level >= 50;
  const specializationSelected = specializationUnlocked;
  const unlockedSpecializationSkillsForStats = specializationUnlocked
    ? getUnlockedSpecializationSkills(currentSpecialization, player.level)
    : [];
  const specializationPassiveBonuses = unlockedSpecializationSkillsForStats
    .filter(skill => skill.effectType === "passive")
    .reduce(
      (total, skill) => ({
        critRate: total.critRate + (skill.critRateBonusPercent ?? 0),
        critDamage: total.critDamage + (skill.critDamageBonusPercent ?? 0),
        dodgeRate: total.dodgeRate + (skill.dodgeRateBonusPercent ?? 0),
      }),
      { critRate: 0, critDamage: 0, dodgeRate: 0 }
    );
  const normalDodgeRate =
    combatStatsBase(state.combatStats).dodgeRate +
    (classDefinition.combat.dodgeRate ?? 0) +
    (equipmentBonuses.combat.dodgeRate ?? 0) +
    specializationPassiveBonuses.dodgeRate;
  const archerSkillCritDamageBonus =
    isArcher && state.abilities.intelligence >= 5
      ? 30 +
        (skillUpgradeLevels["archer-5"] ?? 0) * 5
      : 0;
  const effectiveCombatStats: CombatStats = {
    critRate: isMage
      ? 0
      : Math.min(
          100,
          combatStatsBase(state.combatStats).critRate +
            (classDefinition.combat.critRate ?? 0) +
            (equipmentBonuses.combat.critRate ?? 0) +
            specializationPassiveBonuses.critRate
        ),
    critDamage:
      combatStatsBase(state.combatStats).critDamage +
      (classDefinition.combat.critDamage ?? 0) +
      (equipmentBonuses.combat.critDamage ?? 0) +
      archerSkillCritDamageBonus +
      specializationPassiveBonuses.critDamage,
    dodgeRate: isArcher
      ? getArcherEffectiveDodgeRate(
          normalDodgeRate,
          state.archerDodgeFailStacks
        )
      : Math.min(100, normalDodgeRate),
    castSpeedPercent: Math.min(
      80,
      (combatStatsBase(state.combatStats).castSpeedPercent ?? 0) +
        (equipmentBonuses.combat.castSpeedPercent ?? 0)
    ),
    damageReductionPercent: Math.min(
      80,
      equipmentBonuses.combat.damageReductionPercent ?? 0
    ),
    magicPenetrationPercent: Math.min(
      100,
      equipmentBonuses.combat.magicPenetrationPercent ?? 0
    ),
  };
  const unlockedSpecialSkills = getUnlockedSpecialSkills(
    state.jobClass,
    state.abilities.strength,
    state.abilities.intelligence,
    effectiveCombatStats.critRate
  ).map(skill =>
    applySkillUpgrade(
      specializationUnlocked
        ? applySpecializationToSkill(skill, currentSpecialization)
        : skill,
      skillUpgradeLevels[skill.id] ?? 0
    )
  );
  const specializationSkills = specializationUnlocked
    ? getUnlockedSpecializationSkills(currentSpecialization, player.level).map(
        skill => applySkillUpgrade(skill, skillUpgradeLevels[skill.id] ?? 0)
      )
    : [];
  const allSpecialSkills = [
    ...getAllSpecialSkills(state.jobClass).map(skill =>
      applySkillUpgrade(
        specializationUnlocked
          ? applySpecializationToSkill(skill, currentSpecialization)
          : skill,
        skillUpgradeLevels[skill.id] ?? 0
      )
    ),
    ...(specializationUnlocked
      ? getAllSpecializationSkills(currentSpecialization).map(skill =>
          applySkillUpgrade(skill, skillUpgradeLevels[skill.id] ?? 0)
        )
      : []),
  ];
  const battleSpecialSkills = [...unlockedSpecialSkills, ...specializationSkills];
  const achievementContext: AchievementContext = {
    completedTasks: state.tasks.filter(task => task.completed).length,
    totalXp: state.totalXp,
    timerSeconds:
      state.timerActivities.reduce((total, activity) => total + activity.totalSeconds, 0) +
      (state.runningTimer
        ? getTimerElapsedSeconds(0, state.runningTimer.startedAt, currentTime)
        : 0),
    streak: state.streak,
    defeatedMonsters: state.defeatedMonsterIds.length,
    inventoryItems: state.inventory.length,
    unlockedSkills: battleSpecialSkills.length,
    skillUpgradeLevels: Object.values(state.skillUpgradeLevels).reduce(
      (total, level) => total + level,
      0
    ),
    playerLevel: player.level,
    coins: state.coins,
    defeatedFinalBoss: state.defeatedMonsterIds.some(
      id => id === "boss-final" || id.startsWith("boss-final-")
    ),
  };
  const claimedAchievementIds = sharedAchievementClaimedIds;
  const achievementStatuses = ACHIEVEMENTS.map(achievement => ({
    achievement,
    progress: getAchievementProgress(achievement, achievementContext),
    claimed: claimedAchievementIds.includes(achievement.id),
  }));
  const nextSkillUnlockThreshold = getNextSkillUnlockThreshold(
    state.jobClass,
    state.abilities.strength,
    state.abilities.intelligence,
    effectiveCombatStats.critRate
  );
  const nextSpecializationSkillLevel = specializationUnlocked
    ? getNextSpecializationSkillLevel(currentSpecialization, player.level)
    : 50;
  const hasClassSkills =
    state.jobClass === "warrior" ||
    state.jobClass === "archer" ||
    state.jobClass === "mage" ||
    state.jobClass === "rogue";
  const skillAttributeName =
    state.jobClass === "rogue"
      ? "暴擊率"
      : state.jobClass === "warrior"
        ? "力量"
        : "智力";
  const skillAttributeValue =
    state.jobClass === "rogue"
      ? effectiveCombatStats.critRate
      : state.jobClass === "warrior"
        ? state.abilities.strength
        : state.abilities.intelligence;
  const combatStats = combatStatsBase(state.combatStats);
  const abilityStats = [
    {
      key: "health" as const,
      label: "生命",
      value: effectiveAbilities.health,
      tone: "mint",
      icon: HeartPulse,
      description: "每點 +10 · 每級 +10",
    },
    {
      key: "strength" as const,
      label: "力量",
      value: effectiveAbilities.strength,
      tone: "orange",
      icon: Sword,
      description: isMage
        ? `造成 ${getAttackDamage(effectiveAbilities, state.jobClass)} 法術傷害`
        : `造成 ${getAttackDamage(effectiveAbilities, state.jobClass)} 物理傷害`,
    },
    {
      key: "defense" as const,
      label: "防禦",
      value: effectiveAbilities.defense,
      tone: "blue",
      icon: ShieldCheck,
      description: `減免 ${getDefenseReduction(effectiveAbilities.defense)} 傷害`,
    },
    {
      key: "intelligence" as const,
      label: "智力",
      value: effectiveAbilities.intelligence,
      tone: "violet",
      icon: Brain,
      description: "每級自動 +1",
    },
  ];
  const classAbilities: CharacterAbilities = {
    health: state.abilities.health + classDefinition.bonuses.health,
    strength: state.abilities.strength + classDefinition.bonuses.strength,
    defense: state.abilities.defense + classDefinition.bonuses.defense,
    intelligence:
      state.abilities.intelligence + classDefinition.bonuses.intelligence,
  };
  const attributeBreakdownAbilities: CharacterAbilities = {
    health: effectiveAbilities.health,
    strength: effectiveAbilities.strength,
    defense: effectiveAbilities.defense,
    intelligence: effectiveAbilities.intelligence,
  };
  const physicalAttackBase = getPhysicalAttackDamage(state.abilities);
  const physicalAttackWithClass = getPhysicalAttackDamage(classAbilities);
  const magicAttackBase = getMagicAttackDamage(state.abilities);
  const magicAttackWithClass = getMagicAttackDamage(classAbilities);
  const temporaryBattleBuff = battle?.activeBuff ?? null;
  const attributeBreakdowns = [
    {
      key: "physical-attack",
      label: "物理攻擊",
      total: getPhysicalAttackDamage(attributeBreakdownAbilities),
      unit: "",
      icon: Sword,
      tone: "orange",
      base: physicalAttackBase,
      classBonus: physicalAttackWithClass - physicalAttackBase,
      equipmentBonus:
        getPhysicalAttackDamage(attributeBreakdownAbilities) -
        getPhysicalAttackDamage(classAbilities),
      specializationBonus: 0,
      note: "力量／智力換算；專精技能倍率另計",
    },
    {
      key: "magic-attack",
      label: "魔法攻擊",
      total: getMagicAttackDamage(attributeBreakdownAbilities),
      unit: "",
      icon: Sparkles,
      tone: "violet",
      base: magicAttackBase,
      classBonus: magicAttackWithClass - magicAttackBase,
      equipmentBonus:
        getMagicAttackDamage(attributeBreakdownAbilities) -
        getMagicAttackDamage(classAbilities),
      specializationBonus: 0,
      note: "智力換算；法師戰鬥使用此傷害",
    },
    {
      key: "defense",
      label: "防禦",
      total: effectiveAbilities.defense,
      unit: "",
      icon: ShieldCheck,
      tone: "blue",
      base: state.abilities.defense,
      classBonus: classDefinition.bonuses.defense,
      equipmentBonus: equipmentBonuses.abilities.defense,
      specializationBonus: 0,
      note: `約減免 ${getDefenseReduction(effectiveAbilities.defense)} 點傷害`,
    },
    {
      key: "magic-resistance",
      label: "魔法抗性",
      total: 0,
      unit: "%",
      icon: ShieldCheck,
      tone: "blue",
      base: 0,
      classBonus: 0,
      equipmentBonus: 0,
      specializationBonus: 0,
      note: "目前角色沒有全域魔法抗性加成",
    },
    {
      key: "physical-penetration",
      label: "物理穿透",
      total: 0,
      unit: "%",
      icon: Sword,
      tone: "orange",
      base: 0,
      classBonus: 0,
      equipmentBonus: 0,
      specializationBonus: 0,
      note: "穿透數值依技能顯示，不是角色全域屬性",
    },
    {
      key: "magic-penetration",
      label: "魔法穿透",
      total: effectiveCombatStats.magicPenetrationPercent ?? 0,
      unit: "%",
      icon: Sparkles,
      tone: "violet",
      base: 0,
      classBonus: 0,
      equipmentBonus: equipmentBonuses.combat.magicPenetrationPercent ?? 0,
      specializationBonus: 0,
      note: "降低魔法攻擊套用的魔法抗性",
    },
    {
      key: "crit-rate",
      label: "暴擊率",
      total: effectiveCombatStats.critRate,
      unit: "%",
      icon: Target,
      tone: "mint",
      base: combatStatsBase(state.combatStats).critRate,
      classBonus: classDefinition.combat.critRate ?? 0,
      equipmentBonus: equipmentBonuses.combat.critRate ?? 0,
      specializationBonus: specializationPassiveBonuses.critRate,
      note: isMage ? "法師固定不可暴擊" : "未含技能觸發的瞬時效果",
    },
    {
      key: "crit-damage",
      label: "暴擊傷害",
      total: effectiveCombatStats.critDamage,
      unit: "%",
      icon: Flame,
      tone: "orange",
      base: combatStatsBase(state.combatStats).critDamage,
      classBonus: classDefinition.combat.critDamage ?? 0,
      equipmentBonus: equipmentBonuses.combat.critDamage ?? 0,
      specializationBonus:
        specializationPassiveBonuses.critDamage + archerSkillCritDamageBonus,
      note: isMage ? "法師不會觸發暴擊" : "暴擊時套用的傷害倍率",
    },
    {
      key: "dodge-rate",
      label: "閃避率",
      total: effectiveCombatStats.dodgeRate,
      unit: "%",
      icon: Shuffle,
      tone: "mint",
      base: combatStatsBase(state.combatStats).dodgeRate,
      classBonus: classDefinition.combat.dodgeRate ?? 0,
      equipmentBonus: equipmentBonuses.combat.dodgeRate ?? 0,
      specializationBonus: specializationPassiveBonuses.dodgeRate,
      note: isArcher
        ? `遊俠天賦目前額外 +${archerTalentBonuses.dodgePercent}%`
        : "未含技能觸發的瞬時效果",
    },
  ];
  const experienceBonusPercent = getExperienceBonusPercent(
    effectiveAbilities.intelligence
  );
  const combatCooldownRemaining = Math.max(
    0,
    state.combatCooldownUntil - currentTime
  );
  const combatLocked = combatCooldownRemaining > 0;
  const soulTrialCooldownRemaining = Math.max(
    0,
    state.soulTrialCooldownUntil - currentTime
  );
  const soulTrialCombatLocked = soulTrialCooldownRemaining > 0;
  const healthRecoveryRemaining =
    state.nextHealthRecoveryAt > 0
      ? Math.max(0, state.nextHealthRecoveryAt - currentTime)
      : 0;
  const healthRecoveryLabel =
    state.currentHealth >= effectiveAbilities.health
      ? "生命已滿"
      : state.nextHealthRecoveryAt > 0
        ? `下次回復 ${formatRefreshCountdown(healthRecoveryRemaining)}`
        : "回復計時準備中";
  const activeBattleMonster = battle
    ? (battle.monsterSnapshot ??
      allAvailableMonsters.find(monster => monster.id === battle.monsterId) ??
      null)
    : null;
  const skillPreviewMonster =
    activeBattleMonster ?? dailyMonsters[0] ?? allAvailableMonsters[0] ?? null;
  const getSkillDamagePreview = (skill: (typeof allSpecialSkills)[number]) => {
    if (skill.effectType !== "damage" || !skillPreviewMonster) return null;
    const rawPlayerDamage = getAttackDamage(effectiveAbilities, state.jobClass);
    const basePlayerDamage = isArcher
      ? applyArcherAttackBonus(rawPlayerDamage, state.archerDodgeFailStacks)
      : rawPlayerDamage;
    const buffedPlayerDamage = Math.round(
      basePlayerDamage * (1 + (battle?.activeBuff?.damageBonusPercent ?? 0) / 100)
    );
    const normalDamage = calculateSpecialSkillDamage(
      buffedPlayerDamage,
      skillPreviewMonster.defense,
      skill
    );
    const canCrit = !isMage && effectiveCombatStats.critRate > 0;
    const criticalBaseDamage = canCrit
      ? Math.round((buffedPlayerDamage * effectiveCombatStats.critDamage) / 100)
      : buffedPlayerDamage;
    const criticalDamage = canCrit
      ? calculateSpecialSkillDamage(
          criticalBaseDamage,
          skillPreviewMonster.defense,
          skill
        )
      : normalDamage;
    const resistancePercent =
      skill.damageType === "魔法"
        ? Math.max(
            0,
            (skillPreviewMonster.magicResistancePercent ?? 0) -
              (effectiveCombatStats.magicPenetrationPercent ?? 0)
          )
        : skillPreviewMonster.physicalResistancePercent ?? 0;
    const afterResistance = (damage: number) =>
      Math.max(1, Math.round(damage * (1 - resistancePercent / 100)));
    const minimumDamage = Math.min(normalDamage, criticalDamage);
    const maximumDamage = Math.max(normalDamage, criticalDamage);
    return {
      damageType: skill.damageType,
      penetration:
        skill.defensePiercePercent +
        (skill.damageType === "魔法"
          ? effectiveCombatStats.magicPenetrationPercent ?? 0
          : 0),
      resistancePercent,
      minimumDamage,
      maximumDamage,
      minimumAfterResistance: afterResistance(minimumDamage),
      maximumAfterResistance: afterResistance(maximumDamage),
      monsterName: skillPreviewMonster.name,
    };
  };
  const repeatPeriodSignature = useMemo(() => {
    const date = new Date(currentTime);
    return `${getRepeatPeriodKey("daily", date, state.dailyResetMinutes)}|${getRepeatPeriodKey("weekly", date, state.dailyResetMinutes)}`;
  }, [currentTime, state.dailyResetMinutes]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (activeProfileId) {
      setProfiles(previous =>
        previous.map(profile =>
          profile.id === activeProfileId ? { ...profile, state } : profile
        )
      );
    }
  }, [state, activeProfileId]);

  useEffect(() => {
    window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    if (activeProfileId)
      window.localStorage.setItem(ACTIVE_PROFILE_KEY, activeProfileId);
  }, [profiles, activeProfileId]);

  useEffect(() => {
    window.localStorage.setItem(
      SHARED_ACHIEVEMENTS_STORAGE_KEY,
      JSON.stringify({ claimedIds: sharedAchievementClaimedIds })
    );
  }, [sharedAchievementClaimedIds]);

  useEffect(() => {
    window.localStorage.setItem(
      NOTIFICATION_SETTINGS_KEY,
      JSON.stringify(notificationSettings)
    );
  }, [notificationSettings]);

  useEffect(() => {
    const captureInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", captureInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
  }, []);

  useEffect(() => {
    if (
      !notificationSettings.enabled ||
      !notificationSettings.dailyTaskReminder ||
      notificationPermission !== "granted"
    ) {
      return;
    }
    const date = new Date(currentTime);
    const currentMinute = date.getHours() * 60 + date.getMinutes();
    if (currentMinute !== state.dailyResetMinutes) return;
    const reminderKey = getRepeatPeriodKey("daily", date, state.dailyResetMinutes);
    if (window.localStorage.getItem(NOTIFICATION_LAST_REMINDER_KEY) === reminderKey) {
      return;
    }
    showQuestNotification(
      "QuestBoard · 每日任務刷新",
      state.tasks.some(task => !task.completed)
        ? "新的每日冒險已準備好，還有任務等待完成。"
        : "今日任務已刷新，準備開始新的冒險吧。",
      "daily-task-reminder"
    ).then(sent => {
      if (sent) window.localStorage.setItem(NOTIFICATION_LAST_REMINDER_KEY, reminderKey);
    });
  }, [
    currentTime,
    notificationPermission,
    notificationSettings,
    state.dailyResetMinutes,
    state.tasks,
  ]);

  useEffect(() => {
    const syncStoredProfiles = (event: StorageEvent) => {
      if (event.key !== PROFILES_STORAGE_KEY) return;
      const latestProfiles = loadProfiles();
      setProfiles(previous =>
        JSON.stringify(previous) === JSON.stringify(latestProfiles)
          ? previous
          : latestProfiles
      );
      if (!activeProfileId) return;
      const activeProfile = latestProfiles.find(
        profile => profile.id === activeProfileId
      );
      if (!activeProfile) return;
      const latestState = normalizeProfileLoot(activeProfile.state);
      setState(previous =>
        JSON.stringify(previous) === JSON.stringify(latestState)
          ? previous
          : latestState
      );
    };
    window.addEventListener("storage", syncStoredProfiles);
    return () => window.removeEventListener("storage", syncStoredProfiles);
  }, [activeProfileId]);

  useEffect(() => {
    const syncSharedAchievements = (event: StorageEvent) => {
      if (event.key !== SHARED_ACHIEVEMENTS_STORAGE_KEY) return;
      setSharedAchievementClaimedIds(loadSharedAchievementClaimedIds());
    };
    window.addEventListener("storage", syncSharedAchievements);
    return () => window.removeEventListener("storage", syncSharedAchievements);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(BOARD_SIZE_KEY, String(boardSize));
  }, [boardSize]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!undoAction) return;
    if (undoTimeoutRef.current !== null) {
      window.clearTimeout(undoTimeoutRef.current);
    }
    undoTimeoutRef.current = window.setTimeout(() => {
      setUndoAction(null);
      undoTimeoutRef.current = null;
    }, 5000);
    return () => {
      if (undoTimeoutRef.current !== null) {
        window.clearTimeout(undoTimeoutRef.current);
        undoTimeoutRef.current = null;
      }
    };
  }, [undoAction]);

  useEffect(() => {
    const updateClock = () => setCurrentTime(Date.now());
    const interval = window.setInterval(updateClock, 1000);
    window.addEventListener("focus", updateClock);
    document.addEventListener("visibilitychange", updateClock);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", updateClock);
      document.removeEventListener("visibilitychange", updateClock);
    };
  }, []);

  useEffect(() => {
    const running = state.runningTimer;
    const lockId = running
      ? `${running.activityId}:${running.startedAt}`
      : null;
    if (!lockId) {
      timerLeaseRef.current?.release();
      timerLeaseRef.current = null;
      timerLeaseRunIdRef.current = null;
      setTimerLockOwned(false);
      return;
    }

    let cancelled = false;
    let acquiring = false;
    const acquireForRunningTimer = async () => {
      if (cancelled || acquiring) return;
      if (
        timerLeaseRef.current &&
        timerLeaseRunIdRef.current === lockId
      ) {
        setTimerLockOwned(true);
        return;
      }
      if (timerLeaseRef.current) {
        timerLeaseRef.current.release();
        timerLeaseRef.current = null;
        timerLeaseRunIdRef.current = null;
      }
      acquiring = true;
      let lease: ActivityTimerLockLease | null = null;
      try {
        lease = await acquireActivityTimerLock(() => {
          if (timerLeaseRunIdRef.current !== lockId) return;
          timerLeaseRef.current = null;
          timerLeaseRunIdRef.current = null;
          setTimerLockOwned(false);
          showToast("計時鎖已失效；請確認此分頁是否仍在管理計時");
        });
      } catch {
        lease = null;
      } finally {
        acquiring = false;
      }
      if (cancelled) {
        lease?.release();
        return;
      }
      const latestRunning = stateRef.current.runningTimer;
      const latestLockId = latestRunning
        ? `${latestRunning.activityId}:${latestRunning.startedAt}`
        : null;
      if (!lease || latestLockId !== lockId) {
        lease?.release();
        setTimerLockOwned(false);
        return;
      }
      timerLeaseRef.current = lease;
      timerLeaseRunIdRef.current = lockId;
      setTimerLockOwned(true);
    };

    void acquireForRunningTimer();
    const retry = window.setInterval(
      () => void acquireForRunningTimer(),
      5000
    );
    return () => {
      cancelled = true;
      window.clearInterval(retry);
    };
  }, [state.runningTimer?.activityId, state.runningTimer?.startedAt]);

  useEffect(
    () => () => {
      timerLeaseRef.current?.release();
      timerLeaseRef.current = null;
      timerLeaseRunIdRef.current = null;
    },
    []
  );

  useEffect(() => {
    const running = state.runningTimer;
    if (
      !running ||
      !timerLockOwned ||
      !timerLeaseRef.current ||
      timerLeaseRunIdRef.current !== `${running.activityId}:${running.startedAt}`
    )
      return;
    const activity = state.timerActivities.find(
      item => item.id === running.activityId
    );
    if (!activity) return;
    const pomodoro = running.pomodoro;
    const phaseElapsed = pomodoro
      ? getPomodoroPhaseElapsed(pomodoro, currentTime)
      : 0;
    const elapsedTotal = pomodoro
      ? activity.totalSeconds +
        pomodoro.focusSecondsAccumulated +
        (pomodoro.phase === "focus" ? phaseElapsed : 0)
      : getTimerElapsedSeconds(activity.totalSeconds, running.startedAt, currentTime);
    const targetCompletedMinutes = getCompletedTimerMinutes(elapsedTotal);
    const pendingXp = Math.max(
      0,
      targetCompletedMinutes - activity.xpEarned
    );
    const pendingRewardChecks = Math.max(
      0,
      targetCompletedMinutes - activity.rewardChecks
    );
    const phaseComplete = Boolean(
      pomodoro && phaseElapsed >= pomodoro.phaseDurationSeconds
    );
    const shouldAdvancePhase = Boolean(
      pomodoro && phaseComplete && state.pomodoroSettings.autoStartNextPhase
    );
    if (pendingXp === 0 && pendingRewardChecks === 0 && !shouldAdvancePhase) return;
    const rewardOutcomes = rollAbilityPointOutcomes(pendingRewardChecks);
    const awardedPoints = rewardOutcomes.filter(Boolean).length;

    setState(previous => {
      const previousRunning = previous.runningTimer;
      const previousActivity = previous.timerActivities.find(
        item => item.id === running.activityId
      );
      if (
        !previousRunning ||
        previousRunning.activityId !== running.activityId ||
        previousRunning.startedAt !== running.startedAt ||
        !previousActivity ||
        previousActivity.rewardChecks !== activity.rewardChecks ||
        previousActivity.xpEarned !== activity.xpEarned
      ) {
        return previous;
      }
      const latestPomodoro = previousRunning.pomodoro;
      const latestPhaseElapsed = latestPomodoro
        ? getPomodoroPhaseElapsed(latestPomodoro, currentTime)
        : 0;
      const latestElapsedTotal = latestPomodoro
        ? previousActivity.totalSeconds +
          latestPomodoro.focusSecondsAccumulated +
          (latestPomodoro.phase === "focus" ? latestPhaseElapsed : 0)
        : getTimerElapsedSeconds(
            previousActivity.totalSeconds,
            previousRunning.startedAt,
            currentTime
          );
      const latestPendingChecks = Math.max(
        0,
        getCompletedTimerMinutes(latestElapsedTotal) -
          previousActivity.rewardChecks
      );
      const latestPendingXp = Math.max(
        0,
        getCompletedTimerMinutes(latestElapsedTotal) -
          previousActivity.xpEarned
      );
      const latestPhaseComplete = Boolean(
        latestPomodoro && latestPhaseElapsed >= latestPomodoro.phaseDurationSeconds
      );
      const latestShouldAdvance = Boolean(
        latestPomodoro &&
        latestPhaseComplete &&
        previous.pomodoroSettings.autoStartNextPhase
      );
      if (
        latestPendingChecks !== pendingRewardChecks ||
        latestPendingXp !== pendingXp ||
        latestShouldAdvance !== shouldAdvancePhase
      )
        return previous;

      const latestRoundCompleted = Boolean(
        latestPomodoro && latestPomodoro.phase === "focus" && latestPhaseComplete
      );
      const nextState = applyExperienceToState(
        previous,
        pendingXp + (latestRoundCompleted ? POMODORO_ROUND_XP : 0)
      );
      const nextPomodoro =
        latestPomodoro && latestShouldAdvance
          ? advancePomodoroRuntime(
              latestPomodoro,
              previous.pomodoroSettings,
              currentTime
            )
          : latestPomodoro;

      return {
        ...nextState,
        abilityPoints: nextState.abilityPoints + awardedPoints,
        timerActivities: nextState.timerActivities.map(item =>
          item.id === previousActivity.id
            ? {
                ...item,
                xpEarned: item.xpEarned + pendingXp,
                rewardChecks: item.rewardChecks + pendingRewardChecks,
                abilityPointsEarned:
                  item.abilityPointsEarned + awardedPoints,
                pomodoroRoundsCompleted:
                  (item.pomodoroRoundsCompleted ?? 0) +
                  (latestRoundCompleted ? 1 : 0),
              }
            : item
        ),
        runningTimer: {
          ...previousRunning,
          xpEarned: previousRunning.xpEarned + pendingXp,
          rewardChecks:
            previousRunning.rewardChecks + pendingRewardChecks,
          abilityPointsEarned:
            previousRunning.abilityPointsEarned + awardedPoints,
          pomodoro: nextPomodoro,
        },
      };
    });
  }, [currentTime, state.runningTimer, state.timerActivities, timerLockOwned]);

  useEffect(() => {
    const running = state.runningTimer;
    const activity = running
      ? state.timerActivities.find(item => item.id === running.activityId)
      : null;

    if (!running || !activity) {
      document.title = "QuestBoard";
      return;
    }

    const elapsedSeconds = running.pomodoro
      ? getPomodoroPhaseElapsed(running.pomodoro, currentTime)
      : getTimerElapsedSeconds(activity.totalSeconds, running.startedAt, currentTime);
    const phaseLabel = running.pomodoro
      ? `${pomodoroPhaseLabel(running.pomodoro.phase)} `
      : "";
    document.title = `${phaseLabel}${formatTimerDuration(elapsedSeconds)} · ${activity.name} · QuestBoard`;
  }, [currentTime, state.runningTimer, state.timerActivities]);

  useEffect(() => {
    const running = state.runningTimer;
    const navigatorWithWakeLock = window.navigator as NavigatorWithWakeLock;
    let disposed = false;

    const releaseWakeLock = async () => {
      const lock = wakeLockRef.current;
      wakeLockRef.current = null;
      if (lock) await lock.release().catch(() => undefined);
    };

    const requestWakeLock = async () => {
      if (
        disposed ||
        !running ||
        document.visibilityState !== "visible" ||
        !navigatorWithWakeLock.wakeLock ||
        wakeLockRef.current
      )
        return;
      try {
        wakeLockRef.current = await navigatorWithWakeLock.wakeLock.request("screen");
        if (disposed) await releaseWakeLock();
      } catch {
        // Some browsers require a user gesture or do not support Wake Lock.
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void requestWakeLock();
      else void releaseWakeLock();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    if (running) void requestWakeLock();
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      void releaseWakeLock();
    };
  }, [state.runningTimer?.activityId, state.runningTimer?.startedAt]);

  useEffect(() => {
    setState(previous => {
      const maxHealth = effectiveAbilities.health;
      if (previous.currentHealth >= maxHealth) {
        return previous.nextHealthRecoveryAt === 0
          ? previous
          : { ...previous, nextHealthRecoveryAt: 0 };
      }
      const firstRecoveryAt =
        previous.nextHealthRecoveryAt > 0
          ? previous.nextHealthRecoveryAt
          : currentTime + HEALTH_RECOVERY_INTERVAL_MS;
      if (currentTime < firstRecoveryAt) {
        return previous.nextHealthRecoveryAt === firstRecoveryAt
          ? previous
          : { ...previous, nextHealthRecoveryAt: firstRecoveryAt };
      }
      const recoveryCycles =
        Math.floor(
          (currentTime - firstRecoveryAt) / HEALTH_RECOVERY_INTERVAL_MS
        ) + 1;
      const recoveryAmount =
        Math.ceil(maxHealth * HEALTH_RECOVERY_PERCENT) * recoveryCycles;
      const nextHealth = Math.min(
        maxHealth,
        previous.currentHealth + recoveryAmount
      );
      return {
        ...previous,
        currentHealth: nextHealth,
        nextHealthRecoveryAt:
          nextHealth >= maxHealth
            ? 0
            : firstRecoveryAt + recoveryCycles * HEALTH_RECOVERY_INTERVAL_MS,
      };
    });
  }, [currentTime]);

  useEffect(() => {
    const now = new Date();
    setState(previous => {
      let changed = false;
      const dailyPeriodKey = getRepeatPeriodKey(
        "daily",
        now,
        previous.dailyResetMinutes
      );
      const boardPeriodChanged =
        previous.boardRefreshPeriodKey !== dailyPeriodKey;
      const boardSlotCount = boardSize * boardSize;
      const tasksToRefresh = boardPeriodChanged
        ? previous.tasks.filter(task => task.repeat === "daily")
        : [];
      const dailyTaskIds = new Set(tasksToRefresh.map(task => task.id));
      const refreshSourceTasks = boardPeriodChanged
        ? [
            ...previous.tasks.filter(
              task => task.slot >= boardSlotCount && !dailyTaskIds.has(task.id)
            ),
            ...tasksToRefresh.map((task, index) => ({
              ...task,
              slot: index,
              completed: false,
              awardedXp: undefined,
              completedPeriodKey: undefined,
            })),
          ]
        : previous.tasks;
      if (boardPeriodChanged) changed = true;
      const tasks = refreshSourceTasks.map(task => {
        const repeat: TaskRepeat =
          task.repeat === "daily" || task.repeat === "weekly"
            ? task.repeat
            : "none";
        if (repeat === "none") {
          if (task.repeat !== repeat) {
            changed = true;
            return { ...task, repeat };
          }
          return task;
        }
        const periodKey = getRepeatPeriodKey(
          repeat,
          now,
          previous.dailyResetMinutes
        );
        if (task.completed && !task.completedPeriodKey) {
          changed = true;
          return { ...task, repeat, completedPeriodKey: periodKey };
        }
        if (task.completed && task.completedPeriodKey !== periodKey) {
          changed = true;
          return {
            ...task,
            repeat,
            completed: false,
            awardedXp: undefined,
            completedPeriodKey: undefined,
          };
        }
        if (task.repeat !== repeat) {
          changed = true;
          return { ...task, repeat };
        }
        return task;
      });
      return changed || boardPeriodChanged
        ? {
            ...previous,
            tasks,
            boardRefreshPeriodKey: dailyPeriodKey,
            allTasksBonusClaimed: false,
            dailyQuestChestClaims: [],
            dailyQuestChestPeriodKey: dailyPeriodKey,
          }
        : previous;
    });
  }, [boardSize, repeatPeriodSignature]);

  useEffect(() => {
    const now = new Date(currentTime);
    setState(previous => {
      const weeklyStats = normalizeWeeklyStats(previous.weeklyStats, now);
      return weeklyStats.weekKey === previous.weeklyStats.weekKey
        ? previous
        : { ...previous, weeklyStats };
    });
    if (
      isWeeklyReportTime(now) &&
      state.weeklyStats.reportShownWeekKey !== state.weeklyStats.weekKey
    ) {
      setWeeklyReportOpen(true);
    }
  }, [currentTime, state.weeklyStats.weekKey, state.weeklyStats.reportShownWeekKey]);

  useEffect(() => {
    const availableIds = new Set(
      allAvailableMonsters.map(monster => monster.id)
    );
    setState(previous => {
      const previousDefeated = Array.isArray(previous.defeatedMonsterIds)
        ? previous.defeatedMonsterIds
        : [];
      const nextDefeated = previousDefeated.filter(id => availableIds.has(id));
      return nextDefeated.length === previousDefeated.length
        ? previous
        : { ...previous, defeatedMonsterIds: nextDefeated };
    });
  }, [allAvailableMonsters]);

  const showToast = (message: string) => setToast(message);
  const showUndoToast = (message: string, restore: () => void) => {
    setToast(message);
    setUndoAction({ label: "復原", restore });
  };
  const clearUndoAction = () => {
    setUndoAction(null);
    if (undoTimeoutRef.current !== null) {
      window.clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }
  };

  const clearTaskFilters = () => {
    setTaskCategoryFilter("all");
    setTaskDifficultyFilter("all");
  };

  const resetCharacter = () => {
    const savedCurrentProfile = getStoredProfiles().find(
      profile => profile.id === activeProfileIdRef.current
    );
    if (stateRef.current.runningTimer || savedCurrentProfile?.state.runningTimer) {
      showToast("請先停止目前的事務計時，再重製角色");
      return;
    }
    const confirmed = window.confirm(
      "確定要重製角色嗎？金幣、等級、連續完成天數與九宮格任務完成狀態都會清零，但任務內容會保留。此操作無法復原。\n\n按「確定」繼續。 "
    );
    if (!confirmed) return;
    setState(previous => ({
      ...previous,
      tasks: previous.tasks.map(task =>
        task.slot < 9
          ? {
              ...task,
              completed: false,
              awardedXp: undefined,
              completedPeriodKey: undefined,
            }
          : task
      ),
      totalXp: 0,
      coins: 0,
      weeklyStats: createWeeklyStats(new Date()),
      streak: 0,
      abilities: defaultAbilities,
      abilityPoints: 0,
      abilityLevel: 0,
      abilityAutoGrowthApplied: true,
      defeatedMonsterIds: [],
      currentHealth: defaultAbilities.health,
      nextHealthRecoveryAt: 0,
      combatCooldownUntil: 0,
      soulTrialCooldownUntil: 0,
      combatStats: defaultCombatStats,
      allTasksBonusClaimed: false,
      dailyQuestChestClaims: [],
      dailyQuestChestPeriodKey: getRepeatPeriodKey(
        "daily",
        new Date(),
        previous.dailyResetMinutes
      ),
      inventory: [],
      equippedItemIds: [],
      jobClass: previous.jobClass,
    }));
    showToast("角色已重製：任務、能力、金幣、等級、連勝與戰利品已清空");
  };

  const allocateAbilityPoint = (key: AbilityKey, label: string) => {
    if (state.abilityPoints <= 0) {
      showToast("目前沒有可用的能力點數，繼續升級來獲得更多點數");
      return;
    }
    setState(previous => ({
      ...previous,
      abilityPoints: previous.abilityPoints - 1,
      abilities: {
        ...previous.abilities,
        [key]: previous.abilities[key] + (key === "health" ? 10 : 1),
      },
      currentHealth: previous.currentHealth + (key === "health" ? 10 : 0),
      weeklyStats: addWeeklyStats(
        previous.weeklyStats,
        { abilitiesGained: { [key]: key === "health" ? 10 : 1 } },
        new Date()
      ),
    }));
    showToast(`${label} +${key === "health" ? 10 : 1}，能力點數已使用`);
  };

  const upgradeCombatStat = (key: CombatStatKey, label: string) => {
    const currentValue = combatStats[key] ?? 0;
    if (state.jobClass === "mage" && key === "critRate") {
      showToast("法師的法術無法暴擊，暴擊率不可升級");
      return;
    }
    const increment = key === "critRate" ? 0.3 : 1;
    const nextValue =
      key === "critDamage"
        ? currentValue + increment
        : Math.min(100, currentValue + increment);
    if (state.abilityPoints <= 0) {
      showToast("目前沒有可用的能力點數，繼續升級來獲得更多點數");
      return;
    }
    if (nextValue === currentValue) {
      showToast(`${label} 已達到 100% 上限`);
      return;
    }
    setState(previous => ({
      ...previous,
      abilityPoints: previous.abilityPoints - 1,
      combatStats: {
        ...(previous.combatStats ?? defaultCombatStats),
        [key]: nextValue,
      },
    }));
    showToast(`${label} +${increment}%，能力點數已使用`);
  };

  const toggleEquipItem = (item: EquipmentItem) => {
    const currentlyEquipped = equippedItemIds.includes(item.id);
    if (!currentlyEquipped && !canEquipEquipment(item, state.jobClass)) {
      const requiredClass = getEquipmentRequiredJobClassName(item);
      showToast(`${item.name}只能由${requiredClass}裝備`);
      return;
    }
    const replacedItem = currentlyEquipped
      ? undefined
      : equippedItems.find(
          equipped => equipped.slot === item.slot && equipped.id !== item.id
        );
    const previousEquippedItemIds = equippedItemIds;
    const previousCurrentHealth = state.currentHealth;
    setState(previous => {
      const nextEquippedItemIds = toggleEquippedItemIds(
        previous.inventory,
        previous.equippedItemIds,
        item.id,
        previous.jobClass
      );
      return {
        ...previous,
        equippedItemIds: nextEquippedItemIds,
        currentHealth: clampCurrentHealth(
          previous.currentHealth,
          getEffectiveHealthCap(
            previous.abilities,
            previous.jobClass,
            previous.inventory,
            nextEquippedItemIds
          )
        ),
      };
    });
    showToast(
      currentlyEquipped
        ? `已卸下${item.name}`
        : replacedItem
          ? `已以${item.name}替換${replacedItem.name}`
          : `已裝備${item.name}`
    );
    showUndoToast("裝備變更已套用", () => {
      setState(previous => ({
        ...previous,
        equippedItemIds: previousEquippedItemIds,
        currentHealth: previousCurrentHealth,
      }));
      clearUndoAction();
      showToast("裝備變更已復原");
    });
  };

  const sellTreasure = (item: TreasureItem) => {
    if (
      !inventory.some(
        candidate => candidate.id === item.id && candidate.kind === "treasure"
      )
    ) {
      return;
    }
    setState(previous => {
      const sale = removeTreasureFromInventory(previous.inventory, item.id);
      if (!sale.treasure) return previous;
      return {
        ...previous,
        coins: previous.coins + sale.coinsEarned,
        weeklyStats: addWeeklyStats(
          previous.weeklyStats,
          { coinsEarned: sale.coinsEarned },
          new Date()
        ),
        inventory: sale.inventory,
      };
    });
    showToast(`${item.name}已售出，獲得 ${item.sellValue} 金幣`);
  };

  const toggleFusionMaterial = (item: EquipmentItem) => {
    const currentSelectedIds = selectedFusionItems.map(selected => selected.id);
    if (currentSelectedIds.includes(item.id)) {
      setSelectedFusionItemIds(currentSelectedIds.filter(id => id !== item.id));
      return;
    }
    if (currentSelectedIds.length >= 3) {
      showToast("最多只能選擇 3 件合成素材");
      return;
    }
    if (selectedFusionRarity && item.rarity !== selectedFusionRarity) {
      showToast("合成素材必須是相同品質");
      return;
    }
    setSelectedFusionItemIds([...currentSelectedIds, item.id]);
  };

  const fuseSelectedEquipment = () => {
    const selectedIds = selectedFusionItems.map(item => item.id);
    const selectedItems = selectedIds
      .map(id => inventory.find((item): item is EquipmentItem =>
        item.id === id && item.kind === "equipment"
      ))
      .filter((item): item is EquipmentItem => Boolean(item));
    const rarity = selectedItems[0]?.rarity;
    if (selectedItems.length !== 3 || !rarity) {
      showToast("請選擇 3 件同品質的未裝備裝備");
      return;
    }
    if (!nextLootRarity(rarity)) {
      showToast("神話品質已達最高級，無法再合成");
      return;
    }
    const fusion = prepareEquipmentFusion(
      inventory,
      equippedItemIds,
      rarity,
      player.level,
      Math.random,
      Date.now,
      selectedIds
    );
    if (!fusion) {
      showToast("所選素材已不可用，請重新選擇裝備");
      setSelectedFusionItemIds([]);
      return;
    }

    const consumedIds = new Set(fusion.consumedIds);
    setState(previous => {
      const activeIds = new Set(
        normalizeEquippedItemIds(
          previous.inventory,
          previous.equippedItemIds,
          previous.jobClass
        )
      );
      const ingredientsStillAvailable = fusion.consumedIds.every(
        id =>
          !activeIds.has(id) &&
          previous.inventory.some(
            item =>
              item.id === id &&
              item.kind === "equipment" &&
              item.rarity === rarity
          )
      );
      if (!ingredientsStillAvailable) return previous;
      return {
        ...previous,
        inventory: [
          ...previous.inventory.filter(item => !consumedIds.has(item.id)),
          fusion.result,
        ],
      };
    });
    setSelectedFusionItemIds([]);
    showToast(`合成成功：${fusion.result.rarity} ${fusion.result.name}`);
  };

  const showBattleFx = (effect: Omit<BattleFx, "id">) => {
    battleFxIdRef.current += 1;
    setBattleFx({ ...effect, id: battleFxIdRef.current });
  };
  const startBattle = (monster: Monster) => {
    if (state.runningTimer?.pomodoro?.phase !== undefined &&
        state.runningTimer.pomodoro.phase !== "focus") {
      showToast("番茄鐘休息期間不能開始戰鬥，先回到專注階段吧");
      return;
    }
    const isSoulTrialMonster = monster.id.startsWith("soul-trial-");
    const cooldownUntil = isSoulTrialMonster
      ? state.soulTrialCooldownUntil
      : state.combatCooldownUntil;
    if (cooldownUntil > Date.now()) {
      showToast(
        `${isSoulTrialMonster ? "靈魂試煉" : "角色"}正在恢復中，還有 ${formatCooldown(cooldownUntil - Date.now())} 無法再次挑戰`
      );
      return;
    }
    if (defeatedMonsterIds.includes(monster.id)) {
      showToast(`${monster.name} 已被擊倒，金幣獎勵已領取`);
      return;
    }
    const levelForGate =
      monster.levelGate === "soul" ? soulMemory.level : player.level;
    if (monster.isBoss && levelForGate < monster.level) {
      showToast(`需要達到 LV. ${monster.level} 才能挑戰${monster.name}`);
      return;
    }
    setBattle({
      monsterId: monster.id,
      monsterSnapshot: monster,
      playerHealth: clampCurrentHealth(
        state.currentHealth,
        effectiveAbilities.health
      ),
      monsterHealth: monster.health,
      turn: 1,
      logs: [`你與${monster.name}遭遇了！選擇「進行回合」開始攻擊。`],
      damageDealt: 0,
      damageTaken: 0,
      criticalHits: 0,
      dodges: 0,
      usedSkillIds: [],
      skillCooldowns: {},
      actionLockTurns: 0,
      monsterStatuses: [],
      activeBuff: null,
      xpReward: 0,
      lootDrop: null,
      outcome: "fighting",
    });
    setBattleFx(null);
  };

  const runBattleTurn = (skillId?: string) => {
    if (!battle || !activeBattleMonster || battle.outcome !== "fighting")
      return;
    const actionLocked = (battle.actionLockTurns ?? 0) > 0;
    if (actionLocked && skillId) {
      showToast("終焉狙殺的反噬尚未結束，這一回合不能使用技能");
      return;
    }
    const selectedSkill = skillId
      ? battleSpecialSkills.find(skill => skill.id === skillId)
      : undefined;
    if (skillId && !selectedSkill) {
      showToast("目前職業或能力尚未解鎖這項技能");
      return;
    }
    const mageStaff = isMage
      ? equippedItems.find(item => item.slot === "武器" && item.weaponType === "法杖")
      : undefined;
    const staffStatusEffect: SkillStatusEffect | undefined = mageStaff?.element
      ? {
          element: mageStaff.element,
          kind:
            mageStaff.element === "自然"
              ? "中毒"
              : mageStaff.element === "冰霜"
                ? "冰凍"
                : mageStaff.element === "火焰"
                  ? "燃燒"
                  : "感電",
          chance: mageStaff.element === "冰霜" ? 0.45 : 0.65,
          durationTurns: mageStaff.element === "冰霜" ? 1 : 3,
          damagePerTurn:
            mageStaff.element === "冰霜"
              ? 0
              : mageStaff.element === "雷電"
                ? 8
                : 5,
        }
      : undefined;
    if (selectedSkill && (battle.skillCooldowns[selectedSkill.id] ?? 0) > 0) {
      showToast(`「${selectedSkill.name}」還要 ${battle.skillCooldowns[selectedSkill.id]} 回合才能使用`);
      return;
    }
    const usedSkillIds = battle.usedSkillIds;
    const nextSkillCooldowns = Object.fromEntries(
      Object.entries(battle.skillCooldowns).map(([id, turns]) => [id, Math.max(0, turns - 1)])
    );
    if (selectedSkill && selectedSkill.cooldownTurns > 0) {
      const cooldownReduction =
        selectedSkill.damageType === "魔法"
          ? Math.floor((effectiveCombatStats.castSpeedPercent ?? 0) / 10)
          : 0;
      nextSkillCooldowns[selectedSkill.id] = Math.max(
        1,
        selectedSkill.cooldownTurns - cooldownReduction
      );
    }
    const activeBuff = selectedSkill && (
      selectedSkill.effectType === "buff" ||
      selectedSkill.damageBonusPercent > 0 ||
      selectedSkill.damageReductionPercent !== 0 ||
      (selectedSkill.healPercentMaxHealth ?? 0) > 0 ||
      (selectedSkill.dodgeRateBonusPercent ?? 0) > 0
    )
      ? {
          skillId: selectedSkill.id,
          turnsRemaining: selectedSkill.durationTurns,
          damageBonusPercent: selectedSkill.damageBonusPercent,
          damageReductionPercent: selectedSkill.damageReductionPercent,
          healPercentMaxHealth: selectedSkill.healPercentMaxHealth ?? 0,
          dodgeRateBonusPercent: selectedSkill.dodgeRateBonusPercent ?? 0,
        }
      : battle.activeBuff;
    const nextActiveBuff = activeBuff && activeBuff.turnsRemaining > 1
      ? { ...activeBuff, turnsRemaining: activeBuff.turnsRemaining - 1 }
      : null;
    const monster = activeBattleMonster;
    const requirementAbilities = getAbilityValuesForRequirementCheck(
      monster.levelGate === "soul",
      effectiveAbilities,
      soulMemory.abilities
    );
    const failedRequirement = findFailedAbilityRequirement(
      requirementAbilities,
      monster.requirements
    );
    const damageType = selectedSkill?.damageType ?? (isMage ? "魔法" : "物理");
    const monsterDodges = actionLocked
      ? false
      : selectedSkill?.effectType === "buff"
        ? false
        : Math.random() < monster.dodgeRate / 100;
    const criticalHit =
      !actionLocked &&
      !isMage &&
      !monsterDodges &&
      Math.random() < effectiveCombatStats.critRate / 100;
    const rawPlayerDamage = getAttackDamage(effectiveAbilities, state.jobClass);
    const basePlayerDamage = isArcher
      ? applyArcherAttackBonus(rawPlayerDamage, state.archerDodgeFailStacks)
      : rawPlayerDamage;
    const damageBeforeDefense = criticalHit
      ? Math.round((basePlayerDamage * effectiveCombatStats.critDamage) / 100)
      : basePlayerDamage;
    const buffedPlayerDamage = Math.round(
      damageBeforeDefense * (1 + (activeBuff?.damageBonusPercent ?? 0) / 100)
    );
    const instantExecute = Boolean(
      selectedSkill?.executeBelowHealthPercent &&
      battle.monsterHealth <
        monster.health * (selectedSkill.executeBelowHealthPercent / 100)
    );
    const skillHitCount = selectedSkill?.hitCountMin && selectedSkill.hitCountMax
      ? selectedSkill.hitCountMin +
        Math.floor(Math.random() * (selectedSkill.hitCountMax - selectedSkill.hitCountMin + 1))
      : 1;
    const rawDamageDealt = instantExecute
      ? battle.monsterHealth
      : actionLocked
      ? 0
      : monsterDodges
      ? 0
      : selectedSkill?.effectType === "buff"
        ? 0
      : selectedSkill
        ? calculateSpecialSkillDamage(
            buffedPlayerDamage,
            monster.defense,
            selectedSkill
          ) * skillHitCount
        : Math.max(
            1,
            buffedPlayerDamage - getDefenseReduction(monster.defense)
          );
    const resistancePercent = damageType === "魔法"
      ? Math.max(
          0,
          (monster.magicResistancePercent ?? 0) -
            (effectiveCombatStats.magicPenetrationPercent ?? 0)
        )
      : monster.physicalResistancePercent ?? 0;
    const damageDealt = instantExecute
      ? battle.monsterHealth
      : rawDamageDealt === 0
      ? 0
      : Math.max(1, Math.round(rawDamageDealt * (1 - resistancePercent / 100)));
    const nextMonsterStatuses = applyBattleStatusEffects(
      battle.monsterStatuses,
      damageDealt > 0 && damageType === "魔法"
        ? [selectedSkill?.statusEffect, staffStatusEffect]
        : [],
      damageDealt
    );
    const petrifyBroken = damageDealt > 200 && nextMonsterStatuses.some(
      status => status.kind === "石化" && status.breakDamageThreshold !== undefined
    );
    const statusesBeforeTick = petrifyBroken
      ? nextMonsterStatuses.filter(status => status.kind !== "石化")
      : nextMonsterStatuses;
    const statusTick = tickBattleStatuses(statusesBeforeTick);
    const petrifyBreakDamage = petrifyBroken ? 25 : 0;
    const statusDamage = Math.min(
      statusTick.damage + petrifyBreakDamage,
      Math.max(0, battle.monsterHealth - damageDealt)
    );
    const statusLabels = [
      ...statusTick.labels,
      ...(petrifyBroken ? ["石化被高額傷害提前解除，受到 25 點石化傷害"] : []),
    ];
    const statusLogs = statusLabels.length > 0 ? `；${statusLabels.join("；")}` : "";
    const lifestealHealing = damageDealt > 0
      ? Math.floor(damageDealt * (monster.lifestealPercent ?? 0) / 100)
      : 0;
    const reflectedDamage = damageDealt > 0 ? monster.reflectDamage ?? 0 : 0;
    const reactiveDamageOnDeath = reflectedDamage + (monster.explosionDamage ?? 0);
    const activeBuffHealing = Math.floor(
      effectiveAbilities.health * (activeBuff?.healPercentMaxHealth ?? 0) / 100
    );
    const healedPlayerHealth = Math.min(
      effectiveAbilities.health,
      battle.playerHealth + lifestealHealing + activeBuffHealing
    );
    const actionLabel = actionLocked ? "停滯" : selectedSkill ? `「${selectedSkill.name}」` : "攻擊";
    const monsterHealth = Math.max(0, battle.monsterHealth - damageDealt - statusDamage);
    const logs = [
      ...battle.logs,
      `第 ${battle.turn} 回合：${actionLocked ? "你因終焉狙殺的反噬停滯一回合，無法攻擊或使用技能" : monsterDodges ? `${monster.name}閃避了你的${actionLabel}！` : `${selectedSkill ? `你使出${actionLabel}` : "你"}造成 ${damageDealt} 傷害${criticalHit ? "（暴擊！）" : ""}${statusLogs}`}`,
    ];
    const criticalHits = battle.criticalHits + (criticalHit ? 1 : 0);
    const dodges = battle.dodges + (monsterDodges ? 1 : 0);
    if (monsterHealth <= 0) {
      const baseMonsterXp = 30 + Math.floor(Math.random() * 21);
      const xpReward = Math.max(
        1,
        Math.round(baseMonsterXp * (1 + experienceBonusPercent / 100))
      );
      const lootDrop = rollLoot(monster);
      const lootAffixSummary = lootDrop?.affixes?.length
        ? ` · 詞綴 ${lootDrop.affixes.map(affix => affix.name).join("、")}`
        : "";
      const nextTotalXp = state.totalXp + xpReward;
      const nextLevel = getPlayerStats(nextTotalXp).level;
      const levelUps = Math.max(0, nextLevel - state.abilityLevel);
      const nextBattle = {
        ...battle,
        monsterHealth: 0,
        playerHealth: Math.max(0, healedPlayerHealth - reactiveDamageOnDeath),
        usedSkillIds,
        skillCooldowns: nextSkillCooldowns,
        monsterStatuses: statusTick.statuses,
        activeBuff: nextActiveBuff,
        actionLockTurns: Math.max(0, (battle.actionLockTurns ?? 0) - 1),
        turn: battle.turn + 1,
        logs: [
          ...logs,
          `${monster.name}倒下了！獲得 ${xpReward} XP。`,
          lifestealHealing ? `怪物吸血回復 ${lifestealHealing} 生命。` : "",
          activeBuffHealing ? `「${actionLabel}」恢復 ${activeBuffHealing} 生命。` : "",
          monster.explosionDamage ? `${monster.name}死亡自爆，造成 ${monster.explosionDamage} 固定傷害！` : "",
          reflectedDamage ? `受到 ${reflectedDamage} 點反傷。` : "",
          lootDrop
            ? `戰利品掉落：${lootDrop.kind === "equipment" ? "裝備" : "寶藏"}「${lootDrop.name}」（${lootDrop.rarity}${lootAffixSummary}）！`
            : "這次沒有發現新的戰利品。",
        ],
        damageDealt: battle.damageDealt + damageDealt + statusDamage,
        damageTaken: battle.damageTaken + reactiveDamageOnDeath,
        criticalHits,
        dodges,
        xpReward,
        lootDrop,
        outcome: "victory" as const,
      };
      showBattleFx({
        action: selectedSkill ? "skill" : "attack",
        monsterDamage: damageDealt + statusDamage,
        playerDamage: reactiveDamageOnDeath,
        healing: lifestealHealing + activeBuffHealing,
        critical: criticalHit,
        monsterDodged: false,
        playerDodged: false,
        monsterDefeated: true,
        playerDefeated: false,
      });
      setBattle(nextBattle);
      setState(previous => {
        const previousDefeatedMonsterIds = Array.isArray(
          previous.defeatedMonsterIds
        )
          ? previous.defeatedMonsterIds
          : [];
        const previousInventory = Array.isArray(previous.inventory)
          ? previous.inventory
          : [];
        const levelGrowth = getLevelGrowth(previous.jobClass, levelUps);
        return {
          ...previous,
          currentHealth:
            Math.max(0, healedPlayerHealth - reactiveDamageOnDeath) +
            getLevelGrowth(previous.jobClass, levelUps).abilities.health,
          totalXp: nextTotalXp,
          coins: previous.coins + monster.reward,
          weeklyStats: addWeeklyStats(
            previous.weeklyStats,
            {
              monstersDefeated: 1,
              coinsEarned: monster.reward,
              levelsGained: levelUps,
              abilitiesGained: levelGrowth.abilities,
            },
            new Date()
          ),
          defeatedMonsterIds: [...previousDefeatedMonsterIds, monster.id],
          inventory: lootDrop
            ? [...previousInventory, lootDrop]
            : previousInventory,
          abilityPoints: previous.abilityPoints + levelUps * 5,
          skillUpgradePoints: previous.skillUpgradePoints + levelUps,
          abilityLevel: Math.max(previous.abilityLevel, nextLevel),
          abilities: {
            health:
              previous.abilities.health +
              levelGrowth.abilities.health,
            strength:
              previous.abilities.strength +
              levelGrowth.abilities.strength,
            defense:
              previous.abilities.defense +
              levelGrowth.abilities.defense,
            intelligence:
              previous.abilities.intelligence +
              levelGrowth.abilities.intelligence,
          },
          combatStats: {
            ...previous.combatStats,
            critRate: Math.min(
              100,
              previous.combatStats.critRate +
                (getLevelGrowth(previous.jobClass, levelUps).combat.critRate ??
                  0)
            ),
            critDamage:
              previous.combatStats.critDamage +
              (getLevelGrowth(previous.jobClass, levelUps).combat.critDamage ??
                0),
          },
        };
      });
      showToast(
        `擊倒${monster.name}！+${xpReward} XP、+${monster.reward} 金幣${lootDrop ? ` · 掉落${lootDrop.name}` : ""}${levelUps > 0 ? ` · 升級：${formatLevelGrowth(state.jobClass, levelUps)} · 獲得 ${levelUps * 5} 點能力點與 ${levelUps} 點技能升級點數` : ""}`
      );
      return;
    }
    const effectivePlayerDodgeRate = (effectiveCombatStats.dodgeRate +
      (activeBuff?.dodgeRateBonusPercent ?? 0)) *
      (1 - (monster.dodgeIgnorePercent ?? 0) / 100);
    const playerDodges = statusTick.frozen
      ? false
      : Math.random() < effectivePlayerDodgeRate / 100;
    const monsterCritical =
      !statusTick.frozen && !playerDodges && Math.random() < monster.critRate / 100;
    const nextArcherDodgeFailStacks = isArcher
      ? getNextArcherDodgeFailStacks(state.archerDodgeFailStacks, playerDodges)
      : 0;
    const nextArcherTalentBonuses = getArcherTalentBonuses(
      nextArcherDodgeFailStacks
    );
    const archerTalentLog = isArcher
      ? playerDodges
        ? "（游擊本能觸發：閃避成功，累積加成重置）"
        : `（游擊本能累積 ${nextArcherDodgeFailStacks} 層：攻擊 +${nextArcherTalentBonuses.attackPercent}%、閃避 +${nextArcherTalentBonuses.dodgePercent}%）`
      : "";
    const incomingBaseDamage = statusTick.frozen
      ? 0
      : failedRequirement
        ? monster.damage * 2
        : monster.damage;
    const reducedDamage = Math.max(
      1,
      incomingBaseDamage - getDefenseReduction(effectiveAbilities.defense)
    );
    const buffReducedDamage = Math.max(
      1,
      Math.ceil(
        reducedDamage *
          (1 -
            Math.min(
              80,
              (effectiveCombatStats.damageReductionPercent ?? 0) +
                (activeBuff?.damageReductionPercent ?? 0)
            ) /
              100)
      )
    );
    const incomingDamageTaken = playerDodges
      ? 0
      : monsterCritical
        ? Math.ceil((buffReducedDamage * monster.critDamage) / 100)
        : buffReducedDamage;
    const damageTaken = incomingDamageTaken + reflectedDamage;
    const playerHealth = Math.max(0, healedPlayerHealth - damageTaken);
    const nextLogs = [
      ...logs,
      statusTick.frozen
        ? `${monster.name}被${statusTick.controlLabel ?? "控制"}，無法反擊！`
        : playerDodges
        ? `你閃過了${monster.name}的攻擊！${archerTalentLog}`
        : `${monster.name}造成 ${incomingDamageTaken} 傷害${monsterCritical ? "（暴擊！）" : ""}${reflectedDamage ? `；反傷 ${reflectedDamage}` : ""}${lifestealHealing ? `；吸血回復 ${lifestealHealing}` : ""}${archerTalentLog}`,
    ];
    const nextDamageTaken = battle.damageTaken + damageTaken;
    if (playerHealth <= 0) {
      showBattleFx({
        action: selectedSkill ? "skill" : "attack",
        monsterDamage: damageDealt + statusDamage,
        playerDamage: damageTaken,
        healing: lifestealHealing + activeBuffHealing,
        critical: criticalHit || monsterCritical,
        monsterDodged: monsterDodges,
        playerDodged: playerDodges,
        monsterDefeated: false,
        playerDefeated: true,
      });
      const isSoulTrialBattle = monster.id.startsWith("soul-trial-");
      if (isSoulTrialBattle) {
        setBattle({
          ...battle,
          playerHealth: 0,
          monsterHealth,
          usedSkillIds,
          skillCooldowns: nextSkillCooldowns,
          monsterStatuses: statusTick.statuses,
          activeBuff: nextActiveBuff,
          actionLockTurns: Math.max(0, (battle.actionLockTurns ?? 0) - 1),
          turn: battle.turn + 1,
        logs: [
            ...nextLogs,
            `你被${monster.name}擊倒了！靈魂試煉失敗，只損失一半金幣。`,
          ],
          damageDealt: battle.damageDealt + damageDealt + statusDamage,
          damageTaken: nextDamageTaken,
          criticalHits,
          dodges: dodges + (playerDodges ? 1 : 0),
          outcome: "defeat",
        });
        setState(previous => ({
          ...previous,
          archerDodgeFailStacks: nextArcherDodgeFailStacks,
          currentHealth: effectiveAbilities.health,
          nextHealthRecoveryAt: 0,
          coins: Math.floor(previous.coins / 2),
          soulTrialCooldownUntil: Date.now() + 30 * 60 * 1000,
        }));
        showToast(
          `靈魂試煉失敗：僅損失一半金幣，經驗、等級與能力點不受影響；靈魂試煉冷卻 30 分鐘`
        );
        return;
      }
      const currentLevel = getPlayerStats(state.totalXp).level;
      const reducedLevel = Math.floor(currentLevel / 2);
      const reducedAbilities: CharacterAbilities = {
        health: Math.max(100, Math.floor(state.abilities.health / 2)),
        strength: Math.max(3, Math.floor(state.abilities.strength / 2)),
        defense: Math.max(3, Math.floor(state.abilities.defense / 2)),
        intelligence: Math.max(5, Math.floor(state.abilities.intelligence / 2)),
      };
      setBattle({
        ...battle,
        playerHealth: 0,
        monsterHealth,
        usedSkillIds,
        skillCooldowns: nextSkillCooldowns,
        monsterStatuses: statusTick.statuses,
        activeBuff: nextActiveBuff,
        actionLockTurns: Math.max(0, (battle.actionLockTurns ?? 0) - 1),
        turn: battle.turn + 1,
        logs: [...nextLogs, `你被${monster.name}擊倒了！`],
        damageDealt: battle.damageDealt + damageDealt + statusDamage,
        damageTaken: nextDamageTaken,
        criticalHits,
        dodges: dodges + (playerDodges ? 1 : 0),
        outcome: "defeat",
      });
      setState(previous => ({
        ...previous,
        archerDodgeFailStacks: nextArcherDodgeFailStacks,
        abilities: reducedAbilities,
        currentHealth: reducedAbilities.health,
        nextHealthRecoveryAt: 0,
        totalXp: getXpForLevel(reducedLevel),
        abilityLevel: reducedLevel,
        abilityPoints: Math.floor(previous.abilityPoints / 2),
        skillUpgradePoints: Math.floor(previous.skillUpgradePoints / 2),
        coins: Math.floor(previous.coins / 2),
        combatCooldownUntil: Date.now() + 30 * 60 * 1000,
      }));
      showToast(
        `你被${monster.name}擊倒了！能力與金幣已減半，30 分鐘內無法再次挑戰魔物`
      );
      return;
    }
    showBattleFx({
      action: selectedSkill ? "skill" : "attack",
      monsterDamage: damageDealt + statusDamage,
      playerDamage: damageTaken,
      healing: lifestealHealing + activeBuffHealing,
      critical: criticalHit || monsterCritical,
      monsterDodged: monsterDodges,
      playerDodged: playerDodges,
      monsterDefeated: false,
      playerDefeated: false,
    });
    setBattle({
      ...battle,
      playerHealth,
      monsterHealth,
      usedSkillIds,
      skillCooldowns: nextSkillCooldowns,
      monsterStatuses: statusTick.statuses,
      activeBuff: nextActiveBuff,
      actionLockTurns: selectedSkill?.name === "終焉狙殺" ? 1 : Math.max(0, (battle.actionLockTurns ?? 0) - 1),
      turn: battle.turn + 1,
      logs: nextLogs,
      damageDealt: battle.damageDealt + damageDealt + statusDamage,
      damageTaken: nextDamageTaken,
      criticalHits,
      dodges: dodges + (playerDodges ? 1 : 0),
    });
    setState(previous => ({
      ...previous,
      archerDodgeFailStacks: nextArcherDodgeFailStacks,
      currentHealth: playerHealth,
      nextHealthRecoveryAt:
        previous.nextHealthRecoveryAt > 0
          ? previous.nextHealthRecoveryAt
          : currentTime + HEALTH_RECOVERY_INTERVAL_MS,
    }));
  };

  const openNewTask = (slot = 0) => {
    setTaskDraft({
      title: "",
      category: "工作",
      difficulty: "標準",
      icon: "sparkles",
      slot,
      repeat: "none",
    });
    setModal({ kind: "task", slot });
  };

  const openEditTask = (task: Task) => {
    setTaskDraft({
      title: task.title,
      category: task.category,
      difficulty: task.difficulty,
      icon: task.icon,
      slot: task.slot,
      repeat: task.repeat ?? "none",
    });
    setModal({ kind: "task", taskId: task.id });
  };

  const openRefreshSettings = () => {
    setRefreshDraft(formatResetTime(state.dailyResetMinutes));
    setModal({ kind: "refresh" });
  };

  const openNotificationSettings = () => {
    setModal({ kind: "notifications" });
  };

  const requestNotificationAccess = async () => {
    if (notificationPermission === "unsupported") {
      showToast("此瀏覽器不支援手機通知");
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === "granted") {
      setNotificationSettings(previous => ({ ...previous, enabled: true }));
      await showQuestNotification(
        "QuestBoard 通知已啟用",
        "每日任務刷新時會提醒你回到冒險中。",
        "notification-enabled"
      );
      showToast("手機通知已啟用");
    } else if (permission === "denied") {
      showToast("通知權限已被拒絕，請到瀏覽器設定中重新允許");
    }
  };

  const installQuestBoard = async () => {
    if (!installPrompt) {
      showToast("請使用瀏覽器選單中的「加入主畫面」安裝");
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") showToast("QuestBoard 已加入主畫面");
    setInstallPrompt(null);
  };

  const openProfileSettings = () => {
    setProfileDraft(state.userName);
    setModal({ kind: "profile" });
  };

  const openSaveManager = () => {
    setSaveNameDraft(
      profiles.find(profile => profile.id === activeProfileId)?.name ??
        state.userName
    );
    setModal({ kind: "saves" });
  };

  const saveCurrentProfile = () => {
    const name = saveNameDraft.trim();
    if (!name) {
      showToast("請先輸入存檔名稱");
      return;
    }
    const nextProfile = activeProfileId
      ? profiles.map(profile =>
          profile.id === activeProfileId
            ? { ...profile, name: name.slice(0, 24), state }
            : profile
        )
      : [...profiles, makeProfile(name, state)];
    const selected =
      activeProfileId ?? nextProfile[nextProfile.length - 1]?.id ?? null;
    setProfiles(nextProfile);
    setActiveProfileId(selected);
    setSetupOpen(false);
    showToast(`「${name.slice(0, 24)}」已保存`);
  };

  const switchProfile = (profile: SaveProfile) => {
    if (profile.id === activeProfileId) return;
    const latestProfiles = getLatestProfiles();
    const runningProfile = latestProfiles.find(
      item => item.state.runningTimer !== null
    );
    if (
      (stateRef.current.runningTimer && profile.id !== activeProfileIdRef.current) ||
      (runningProfile && runningProfile.id !== profile.id)
    ) {
      showToast("請先停止目前計時器，再切換角色存檔");
      return;
    }
    const latestTarget = latestProfiles.find(item => item.id === profile.id);
    const currentSavedProfiles = latestProfiles.map(item =>
      item.id === activeProfileIdRef.current
        ? { ...item, state: stateRef.current }
        : item
    );
    setProfiles(currentSavedProfiles);
    setState(normalizeProfileLoot((latestTarget ?? profile).state));
    setActiveProfileId(profile.id);
    setModal(null);
    showToast(`已切換至「${profile.name}」`);
  };

  const startNewProfileSetup = () => {
    if (
      stateRef.current.runningTimer ||
      getLatestProfiles().some(item => item.state.runningTimer !== null)
    ) {
      showToast("請先停止目前計時器，再建立新存檔");
      return;
    }
    setSetupName("");
    setSetupJobClass("warrior");
    setModal(null);
    setNewProfileSetupOpen(true);
  };

  const completeNewProfileSetup = () => {
    if (
      stateRef.current.runningTimer ||
      getLatestProfiles().some(item => item.state.runningTimer !== null)
    ) {
      showToast("請先停止目前計時器，再建立新存檔");
      return;
    }
    const name = setupName.trim() || "新的冒險";
    const profile = makeProfile(name, makeFreshState(name, setupJobClass));
    setProfiles(previous => [
      ...previous.map(item =>
        item.id === activeProfileId ? { ...item, state } : item
      ),
      profile,
    ]);
    setState(profile.state);
    setActiveProfileId(profile.id);
    setSaveNameDraft(profile.name);
    setNewProfileSetupOpen(false);
    showToast(`已建立新冒險「${profile.name}」`);
  };

  const deleteProfile = (profile: SaveProfile) => {
    const latestProfiles = getLatestProfiles();
    const profileToDelete = latestProfiles.find(item => item.id === profile.id);
    if (profileToDelete?.state.runningTimer) {
      showToast("請先切換至正在計時的存檔並停止計時，再刪除");
      return;
    }
    if (latestProfiles.length <= 1) {
      showToast("至少要保留一個存檔");
      return;
    }
    if (!window.confirm(`確定刪除「${profile.name}」嗎？此操作無法復原。`))
      return;
    const nextProfiles = latestProfiles.filter(item => item.id !== profile.id);
    setProfiles(nextProfiles);
    if (profile.id === activeProfileId) {
      const next = nextProfiles[0];
      setState(normalizeProfileLoot(next.state));
      setActiveProfileId(next.id);
    }
    showToast(`已刪除存檔「${profile.name}」`);
  };

  const completeSetup = () => {
    const name = setupName.trim() || "我的冒險";
    const nextState = makeFreshState(name, setupJobClass);
    const profile = makeProfile(name, nextState);
    setState(nextState);
    setProfiles([profile]);
    setActiveProfileId(profile.id);
    setSetupOpen(false);
    showToast(`冒險已建立，職業：${jobClasses[setupJobClass].name}`);
  };

  const saveProfileSettings = () => {
    const userName = profileDraft.trim();
    if (!userName) {
      showToast("請輸入使用者名稱");
      return;
    }
    setState(previous => ({ ...previous, userName: userName.slice(0, 24) }));
    setModal(null);
    showToast(`使用者名稱已更新為「${userName.slice(0, 24)}」`);
  };

  const saveRefreshSettings = () => {
    const [hours, minutes] = refreshDraft.split(":").map(Number);
    if (
      !Number.isInteger(hours) ||
      !Number.isInteger(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      showToast("請選擇有效的每日刷新時間");
      return;
    }
    const nextMinutes = hours * 60 + minutes;
    setState(previous => ({
      ...previous,
      dailyResetMinutes: nextMinutes,
      boardRefreshPeriodKey: getRepeatPeriodKey(
        "daily",
        new Date(),
        nextMinutes
      ),
    }));
    setModal(null);
    showToast(`每日任務刷新時間已設定為 ${formatResetTime(nextMinutes)}`);
  };

  const saveTask = () => {
    const title = taskDraft.title.trim();
    if (!title) {
      showToast("先替任務取一個名字吧");
      return;
    }
    const difficultyValues: Record<
      TaskDifficulty,
      { xp: number; coins: number }
    > = {
      輕量: { xp: 35, coins: 20 },
      標準: { xp: 55, coins: 30 },
      挑戰: { xp: 85, coins: 45 },
    };
    const isEditingTask = modal?.kind === "task" && Boolean(modal.taskId);
    setState(previous => {
      if (modal?.kind === "task" && modal.taskId) {
        return {
          ...previous,
          tasks: previous.tasks.map(task => {
            if (task.id !== modal.taskId) return task;
            const repeatChanged = (task.repeat ?? "none") !== taskDraft.repeat;
            return {
              ...task,
              title,
              category: taskDraft.category,
              difficulty: taskDraft.difficulty,
              icon: taskDraft.icon,
              repeat: taskDraft.repeat,
              completed: repeatChanged ? false : task.completed,
              awardedXp: repeatChanged ? undefined : task.awardedXp,
              completedPeriodKey: repeatChanged
                ? undefined
                : task.completedPeriodKey,
            };
          }),
        };
      }
      const reward = difficultyValues[taskDraft.difficulty];
      const newTask: Task = {
        id: `task-${Date.now()}`,
        slot: taskDraft.slot,
        title,
        category: taskDraft.category,
        icon: taskDraft.icon,
        difficulty: taskDraft.difficulty,
        xp: reward.xp,
        coins: reward.coins,
        completed: false,
        repeat: taskDraft.repeat,
      };
      return {
        ...previous,
        tasks: [
          ...previous.tasks.filter(task => task.slot !== taskDraft.slot),
          newTask,
        ],
      };
    });
    setModal(null);
    showToast(isEditingTask ? "任務已更新" : "新任務已加入冒險盤");
  };

  const deleteTask = (task: Task) => {
    const previousTasks = state.tasks;
    setState(previous => ({
      ...previous,
      tasks: previous.tasks.filter(item => item.id !== task.id),
    }));
    showUndoToast("任務已移出冒險盤", () => {
      setState(previous => ({ ...previous, tasks: previousTasks }));
      clearUndoAction();
      showToast("任務已復原");
    });
  };

  const shuffleBoardTasks = () => {
    setState(previous => {
      const boardTasks = previous.tasks.filter(task => task.slot < boardSlotCount);
      if (boardTasks.length < 2) return previous;
      const shuffledSlots = Array.from(
        { length: boardSlotCount },
        (_, slot) => slot
      );
      for (let index = shuffledSlots.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffledSlots[index], shuffledSlots[swapIndex]] = [
          shuffledSlots[swapIndex],
          shuffledSlots[index],
        ];
      }
      const slotByTaskId = new Map(
        boardTasks.map((task, index) => [task.id, shuffledSlots[index]])
      );
      return {
        ...previous,
        tasks: previous.tasks.map(task =>
          slotByTaskId.has(task.id)
            ? { ...task, slot: slotByTaskId.get(task.id)! }
            : task
        ),
      };
    });
    showToast("九宮格任務已在所有格位中重新打亂");
  };

  const resetBoardTasks = () => {
    if (
      boardTasks.length > 0 &&
      !window.confirm(`確定要刪除目前棋盤內的 ${boardTasks.length} 個任務嗎？`)
    ) {
      return;
    }
    setState(previous => ({
      ...previous,
      tasks: previous.tasks.filter(task => task.slot >= boardSlotCount),
    }));
    showToast("九宮格任務已全部刪除");
  };

  const toggleTask = (task: Task) => {
    const previousState = state;
    const nextCompleted = !task.completed;
    const earnedXp = Math.max(
      1,
      Math.round(task.xp * (1 + experienceBonusPercent / 100))
    );
    const xpDelta = nextCompleted ? earnedXp : -(task.awardedXp ?? task.xp);
    const nextTasksPreview = state.tasks.map(item =>
      item.id === task.id ? { ...item, completed: nextCompleted } : item
    );
    const completedTaskCount = nextTasksPreview.filter(
      item => item.slot < boardSlotCount && item.completed
    ).length;
    const dailyChestMilestones = [3, 6, 9];
    const currentDailyPeriodKey = getRepeatPeriodKey(
      "daily",
      new Date(),
      state.dailyResetMinutes
    );
    const claimedChestMilestones =
      state.dailyQuestChestPeriodKey === currentDailyPeriodKey
        ? normalizeDailyQuestChestClaims(state.dailyQuestChestClaims)
        : [];
    const newlyUnlockedChestMilestones = nextCompleted
      ? dailyChestMilestones.filter(
          milestone =>
            completedTaskCount >= milestone &&
            !claimedChestMilestones.includes(milestone)
        )
      : [];
    const chestRewards = newlyUnlockedChestMilestones.map(milestone => ({
      milestone,
      gold: 50 + Math.floor(Math.random() * 26),
      xp: 50 + Math.floor(Math.random() * 76),
      loot: rollQuestChestLoot(
        getPlayerStats(state.totalXp).level,
        Math.random,
        Date.now
      ),
    }));
    const chestGold = chestRewards.reduce((total, reward) => total + reward.gold, 0);
    const chestXp = chestRewards.reduce((total, reward) => total + reward.xp, 0);
    const chestLoot = chestRewards.flatMap(reward =>
      reward.loot ? [reward.loot] : []
    );
    const nextTotalXp = Math.max(0, state.totalXp + xpDelta + chestXp);
    const nextLevel = getPlayerStats(nextTotalXp).level;
    const levelUps = Math.max(0, nextLevel - state.abilityLevel);
    const earnedAbilityPoints = levelUps * 5;
    const repeat = task.repeat ?? "none";
    const completedPeriodKey = nextCompleted
      ? getRepeatPeriodKey(repeat, new Date(), state.dailyResetMinutes)
      : undefined;
    setState(previous => {
      const nextTasks = previous.tasks.map(item =>
        item.id === task.id
          ? {
              ...item,
              completed: nextCompleted,
              awardedXp: nextCompleted ? earnedXp : undefined,
              completedPeriodKey,
            }
          : item
      );
      const allTasksCompleted = nextTasks
        .filter(item => item.slot < boardSlotCount)
        .every(item => item.completed);
      const allTasksBonus =
        nextCompleted && allTasksCompleted && !previous.allTasksBonusClaimed;
      const levelGrowth = getLevelGrowth(previous.jobClass, levelUps);
      return {
        ...previous,
        tasks: nextTasks,
        totalXp: nextTotalXp,
        coins: Math.max(
          0,
          previous.coins +
            (nextCompleted ? task.coins : -task.coins) +
            chestGold +
            (allTasksBonus ? 50 : 0)
        ),
        abilityPoints:
          previous.abilityPoints +
          earnedAbilityPoints +
          (allTasksBonus ? 5 : 0),
        skillUpgradePoints: previous.skillUpgradePoints + levelUps,
        abilityLevel: Math.max(previous.abilityLevel, nextLevel),
        allTasksBonusClaimed: previous.allTasksBonusClaimed || allTasksBonus,
        dailyQuestChestClaims:
          nextCompleted && newlyUnlockedChestMilestones.length > 0
            ? [...new Set([
                ...claimedChestMilestones,
                ...newlyUnlockedChestMilestones,
              ])]
            : claimedChestMilestones,
        dailyQuestChestPeriodKey: currentDailyPeriodKey,
        inventory:
          chestLoot.length > 0
            ? [...previous.inventory, ...chestLoot]
            : previous.inventory,
        weeklyStats: nextCompleted
          ? addWeeklyStats(
              previous.weeklyStats,
              {
                tasksCompleted: 1,
                coinsEarned:
                  task.coins + chestGold + (allTasksBonus ? 50 : 0),
                levelsGained: levelUps,
                abilitiesGained: levelGrowth.abilities,
              },
              new Date()
            )
          : previous.weeklyStats,
        abilities: {
          health:
            previous.abilities.health +
            levelGrowth.abilities.health,
          strength:
            previous.abilities.strength +
            levelGrowth.abilities.strength,
          defense:
            previous.abilities.defense +
            levelGrowth.abilities.defense,
          intelligence:
            previous.abilities.intelligence +
            levelGrowth.abilities.intelligence,
        },
        combatStats: {
          ...previous.combatStats,
          critRate: Math.min(
            100,
            previous.combatStats.critRate +
              (getLevelGrowth(previous.jobClass, levelUps).combat.critRate ?? 0)
          ),
          critDamage:
            previous.combatStats.critDamage +
            (getLevelGrowth(previous.jobClass, levelUps).combat.critDamage ??
              0),
        },
        currentHealth:
          previous.currentHealth +
          levelGrowth.abilities.health,
      };
    });
    showUndoToast(
      nextCompleted ? "任務已完成" : "任務完成狀態已取消",
      () => {
        setState(() => previousState);
        clearUndoAction();
        showToast("任務狀態已復原");
      }
    );
    if (nextCompleted) {
      const afterCompletion = state.tasks.map(item =>
        item.id === task.id ? { ...item, completed: true } : item
      );
      const newLines = getBingoLines(
        afterCompletion.filter(item => item.slot < boardSlotCount),
        boardSize
      ).length;
      const allTasksCompleteNow = afterCompletion
        .filter(item => item.slot < boardSlotCount)
        .every(item => item.completed);
      const allTasksBonusMessage =
        allTasksCompleteNow && !state.allTasksBonusClaimed
          ? " · 全任務完成：+5 點能力點、+50 金幣"
          : "";
      const chestMessage =
        chestRewards.length > 0
          ? ` · 解鎖 ${chestRewards.map(reward => `${reward.milestone} 任務寶箱`).join("、")}：+${chestGold} 金幣、+${chestXp} XP${chestLoot.length > 0 ? `、獲得${chestLoot.map(item => item.name).join("、")}` : ""}`
          : "";
      const levelUpMessage =
        levelUps > 0
          ? ` · 升級：${formatLevelGrowth(state.jobClass, levelUps)} · 獲得 ${earnedAbilityPoints} 點能力點與 ${levelUps} 點技能升級點數`
          : "";
      showToast(
        newLines > bingoLines.length
          ? `任務完成！+${earnedXp} XP · +${task.coins} 金幣${levelUpMessage}${allTasksBonusMessage}${chestMessage} · 額外寶箱已解鎖`
          : `任務完成！+${earnedXp} XP · +${task.coins} 金幣${levelUpMessage}${allTasksBonusMessage}${chestMessage}`
      );
    } else {
      showToast("任務標記為未完成，獎勵已回收");
    }
  };

  const openNewReward = () => {
    setRewardDraft({ title: "", description: "", cost: "200", icon: "gift" });
    setModal({ kind: "reward" });
  };

  const openEditReward = (reward: Reward) => {
    setRewardDraft({
      title: reward.title,
      description: reward.description,
      cost: String(reward.cost),
      icon: reward.icon,
    });
    setModal({ kind: "reward", rewardId: reward.id });
  };

  const saveReward = () => {
    const title = rewardDraft.title.trim();
    const cost = Number.parseInt(rewardDraft.cost, 10);
    if (!title || !Number.isFinite(cost) || cost <= 0) {
      showToast("獎勵名稱與金幣需求都要填寫");
      return;
    }
    setState(previous => {
      if (modal?.kind === "reward" && modal.rewardId) {
        return {
          ...previous,
          rewards: previous.rewards.map(reward =>
            reward.id === modal.rewardId
              ? {
                  ...reward,
                  title,
                  description:
                    rewardDraft.description.trim() || "完成任務後，給自己的小獎勵",
                  cost,
                  icon: rewardDraft.icon,
                }
              : reward
          ),
        };
      }
      return {
        ...previous,
        rewards: [
          ...previous.rewards,
          {
            id: `reward-${Date.now()}`,
            title,
            description:
              rewardDraft.description.trim() || "完成任務後，給自己的小獎勵",
            cost,
            icon: rewardDraft.icon,
            custom: true,
          },
        ],
      };
    });
    setModal(null);
    showToast(modal?.kind === "reward" && modal.rewardId ? "獎勵設定已更新" : "自訂獎勵已放入寶庫");
  };

  const redeemReward = (reward: Reward) => {
    if (state.coins < reward.cost) {
      showToast(`還差 ${reward.cost - state.coins} 金幣才能兌換`);
      return;
    }
    const redeemedAt = Date.now();
    setState(previous => ({
      ...previous,
      coins: previous.coins - reward.cost,
      rewardRedemptions: [
        ...previous.rewardRedemptions,
        {
          id: `redemption-${redeemedAt}-${Math.random().toString(36).slice(2, 8)}`,
          rewardId: reward.id,
          title: reward.title,
          cost: reward.cost,
          redeemedAt,
        },
      ],
    }));
    showToast(`已兌換「${reward.title}」，好好享受這份獎勵`);
  };

  const deleteReward = (reward: Reward) => {
    if (!window.confirm(`確定要刪除「${reward.title}」嗎？\n目前價格：${reward.cost} 金幣\n既有兌換歷史會保留。`)) {
      return;
    }
    const previousRewards = state.rewards;
    setState(previous => ({
      ...previous,
      rewards: previous.rewards.filter(item => item.id !== reward.id),
    }));
    showUndoToast(`已刪除「${reward.title}」`, () => {
      setState(previous => ({ ...previous, rewards: previousRewards }));
      clearUndoAction();
      showToast("獎勵已復原");
    });
  };

  const addTimerActivity = () => {
    const name = timerNameDraft.trim();
    if (!name) {
      showToast("請先輸入要計時的事務名稱");
      return;
    }
    if (
      state.timerActivities.some(
        activity => activity.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      showToast("已有同名事務計時器");
      return;
    }
    const activity: TimerActivity = {
      id: `timer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.slice(0, 40),
      totalSeconds: 0,
      xpEarned: 0,
      rewardChecks: 0,
      abilityPointsEarned: 0,
      sessions: [],
    };
    setState(previous => ({
      ...previous,
      timerActivities: [...previous.timerActivities, activity],
    }));
    setTimerNameDraft("");
    showToast(`已建立「${activity.name}」計時器`);
  };

  const updatePomodoroSettings = (patch: Partial<PomodoroSettings>) => {
    if (stateRef.current.runningTimer) {
      showToast("請先停止目前的計時器，再修改番茄鐘設定");
      return;
    }
    setState(previous => ({
      ...previous,
      pomodoroSettings: normalizePomodoroSettings({
        ...previous.pomodoroSettings,
        ...patch,
      }),
    }));
  };

  const selectPomodoroPreset = (preset: "25-5" | "50-10" | "custom") => {
    if (preset === "25-5") {
      updatePomodoroSettings({ focusMinutes: 25, shortBreakMinutes: 5 });
    } else if (preset === "50-10") {
      updatePomodoroSettings({ focusMinutes: 50, shortBreakMinutes: 10 });
    }
  };

  const advancePomodoroPhase = () => {
    const running = stateRef.current.runningTimer;
    if (!running?.pomodoro || !timerLockOwned) return;
    const runtime = running.pomodoro;
    if (getPomodoroPhaseElapsed(runtime, Date.now()) < runtime.phaseDurationSeconds) {
      showToast(`目前${pomodoroPhaseLabel(runtime.phase)}尚未結束`);
      return;
    }
    const roundCompleted = runtime.phase === "focus";
    const nextPhase = advancePomodoroRuntime(
      runtime,
      stateRef.current.pomodoroSettings,
      Date.now()
    ).phase;
    setState(previous => {
      const current = previous.runningTimer;
      if (!current?.pomodoro || current.startedAt !== running.startedAt) {
        return previous;
      }
      const nextState = applyExperienceToState(
        previous,
        roundCompleted ? POMODORO_ROUND_XP : 0
      );
      return {
        ...nextState,
        timerActivities: nextState.timerActivities.map(activity =>
          activity.id === current.activityId
            ? {
                ...activity,
                pomodoroRoundsCompleted:
                  (activity.pomodoroRoundsCompleted ?? 0) +
                  (roundCompleted ? 1 : 0),
              }
            : activity
        ),
        runningTimer: {
          ...current,
          xpEarned:
            current.xpEarned + (roundCompleted ? POMODORO_ROUND_XP : 0),
          pomodoro: advancePomodoroRuntime(
            current.pomodoro,
            previous.pomodoroSettings,
            Date.now()
          ),
        },
      };
    });
    showToast(
      roundCompleted
        ? `完成第 ${runtime.completedRounds + 1} 輪，獲得 +${POMODORO_ROUND_XP} XP`
        : `已進入${pomodoroPhaseLabel(nextPhase)}階段`
    );
  };

  const startActivityTimer = async (activityId: string) => {
    if (stateRef.current.runningTimer) {
      showToast("請先停止目前的計時器，再開始其他事務");
      return;
    }
    const profileIdAtStart = activeProfileIdRef.current;
    if (!profileIdAtStart) {
      showToast("請先建立角色存檔，再使用事務計時器");
      return;
    }
    const existingTimerProfile = getStoredProfiles().find(
      profile => profile.state.runningTimer !== null
    );
    if (existingTimerProfile) {
      if (existingTimerProfile.id === profileIdAtStart) {
        setState(normalizeProfileLoot(existingTimerProfile.state));
        showToast("此角色已有進行中的計時，已同步狀態；請先停止該計時");
      } else {
        showToast(`「${existingTimerProfile.name}」存檔已有計時，請先切換並停止`);
      }
      return;
    }
    const activity = stateRef.current.timerActivities.find(
      item => item.id === activityId
    );
    if (!activity) return;
    let lockId: string | null = null;
    let lease: ActivityTimerLockLease | null = null;
    try {
      lease = await acquireActivityTimerLock(() => {
        if (!lockId || timerLeaseRunIdRef.current !== lockId) return;
        timerLeaseRef.current = null;
        timerLeaseRunIdRef.current = null;
        setTimerLockOwned(false);
        showToast("計時鎖已失效，請確認其他分頁的計時狀態");
      });
    } catch {
      lease = null;
    }
    if (!lease) {
      showToast("無法取得計時鎖；請確認其他分頁未計時，並允許此網站使用儲存空間");
      return;
    }
    const latestRunningProfile = getStoredProfiles().find(
      profile => profile.state.runningTimer !== null
    );
    if (
      latestRunningProfile ||
      activeProfileIdRef.current !== profileIdAtStart ||
      stateRef.current.runningTimer
    ) {
      lease.release();
      showToast("計時狀態已變更；請重新確認目前的角色存檔");
      return;
    }
    if (!stateRef.current.timerActivities.some(item => item.id === activityId)) {
      lease.release();
      return;
    }
    const startedAt = Date.now();
    const pomodoroSettings = stateRef.current.pomodoroSettings;
    lockId = `${activityId}:${startedAt}`;
    timerLeaseRef.current = lease;
    timerLeaseRunIdRef.current = lockId;
    setTimerLockOwned(true);
    setState(previous => {
      if (previous.runningTimer) return previous;
      if (!previous.timerActivities.some(item => item.id === activityId))
        return previous;
      return {
        ...previous,
        runningTimer: {
          activityId,
          startedAt,
          xpEarned: 0,
          rewardChecks: 0,
          abilityPointsEarned: 0,
          pomodoro: pomodoroSettings.enabled
            ? {
                phase: "focus",
                phaseStartedAt: startedAt,
                phaseDurationSeconds: pomodoroSettings.focusMinutes * 60,
                completedRounds: 0,
                focusSecondsAccumulated: 0,
              }
            : undefined,
        },
      };
    });
    showToast(`開始計時「${activity.name}」`);
  };

  const stopActivityTimer = () => {
    const running = state.runningTimer;
    if (!running) return;
    const lockId = `${running.activityId}:${running.startedAt}`;
    if (
      !timerLockOwned ||
      !timerLeaseRef.current ||
      timerLeaseRunIdRef.current !== lockId
    ) {
      showToast("此計時由另一分頁管理；請在持有計時鎖的分頁停止");
      return;
    }
    const activity = state.timerActivities.find(
      item => item.id === running.activityId
    );
    if (!activity) return;
    const endedAt = Date.now();
    const elapsedSeconds = running.pomodoro
      ? running.pomodoro.focusSecondsAccumulated +
        (running.pomodoro.phase === "focus"
          ? getPomodoroPhaseElapsed(running.pomodoro, endedAt)
          : 0)
      : getTimerElapsedSeconds(0, running.startedAt, endedAt);
    const targetChecks = getCompletedTimerMinutes(
      activity.totalSeconds + elapsedSeconds
    );
    const pendingChecks = Math.max(0, targetChecks - activity.rewardChecks);
    const pendingOutcomes = rollAbilityPointOutcomes(pendingChecks);
    const sessionId = `timer-session-${endedAt}-${Math.random().toString(36).slice(2, 8)}`;

    setState(previous => {
      const previousRunning = previous.runningTimer;
      const previousActivity = previous.timerActivities.find(
        item => item.id === running.activityId
      );
      if (
        !previousRunning ||
        previousRunning.activityId !== running.activityId ||
        previousRunning.startedAt !== running.startedAt ||
        !previousActivity
      ) {
        return previous;
      }
      const finalElapsedSeconds = previousRunning.pomodoro
        ? previousRunning.pomodoro.focusSecondsAccumulated +
          (previousRunning.pomodoro.phase === "focus"
            ? getPomodoroPhaseElapsed(previousRunning.pomodoro, endedAt)
            : 0)
        : getTimerElapsedSeconds(0, previousRunning.startedAt, endedAt);
      const finalTargetChecks = getCompletedTimerMinutes(
        previousActivity.totalSeconds + finalElapsedSeconds
      );
      const finalPendingChecks = Math.max(
        0,
        finalTargetChecks - previousActivity.rewardChecks
      );
      const finalPendingXp = Math.max(
        0,
        finalTargetChecks - previousActivity.xpEarned
      );
      const outcomeOffset = Math.max(
        0,
        previousActivity.rewardChecks - activity.rewardChecks
      );
      const pointsAwarded = pendingOutcomes
        .slice(outcomeOffset, outcomeOffset + finalPendingChecks)
        .filter(Boolean).length;
      const nextState = applyExperienceToState(previous, finalPendingXp);
      const session: TimerSession = {
        id: sessionId,
        startedAt: Math.min(previousRunning.startedAt, endedAt),
        endedAt,
        durationSeconds: finalElapsedSeconds,
        xpEarned: previousRunning.xpEarned + finalPendingXp,
        rewardChecks: previousRunning.rewardChecks + finalPendingChecks,
        abilityPointsEarned:
          previousRunning.abilityPointsEarned + pointsAwarded,
        pomodoroRoundsCompleted:
          previousRunning.pomodoro?.completedRounds ?? 0,
      };

      return {
        ...nextState,
        abilityPoints: nextState.abilityPoints + pointsAwarded,
        timerActivities: nextState.timerActivities.map(item =>
          item.id === previousActivity.id
            ? {
                ...item,
                totalSeconds: item.totalSeconds + finalElapsedSeconds,
                xpEarned: item.xpEarned + finalPendingXp,
                rewardChecks: item.rewardChecks + finalPendingChecks,
                abilityPointsEarned:
                  item.abilityPointsEarned + pointsAwarded,
                pomodoroRoundsCompleted: item.pomodoroRoundsCompleted ?? 0,
                sessions: [...item.sessions, session],
              }
            : item
        ),
        runningTimer: null,
      };
    });
    showToast(
      `已停止「${activity.name}」計時，本段 ${formatTimerDuration(elapsedSeconds)} 已記錄`
    );
  };

  const deleteTimerActivity = (activity: TimerActivity) => {
    if (getStoredProfiles().some(profile => profile.state.runningTimer !== null)) {
      showToast("請先停止目前的計時器，再刪除事務與紀錄");
      return;
    }
    if (!window.confirm(`刪除「${activity.name}」及其所有計時紀錄？`)) return;
    setState(previous => ({
      ...previous,
      timerActivities: previous.timerActivities.filter(
        item => item.id !== activity.id
      ),
    }));
    showToast(`已刪除「${activity.name}」計時器`);
  };

  const upgradeSkill = (skillId: string, skillName: string) => {
    const currentLevel = state.skillUpgradeLevels[skillId] ?? 0;
    if (state.skillUpgradePoints <= 0) {
      showToast("技能升級點數不足，請先提升角色等級");
      return;
    }
    if (currentLevel >= MAX_SKILL_UPGRADE_LEVEL) {
      showToast(`「${skillName}」已達技能升級上限`);
      return;
    }
    setState(previous => ({
      ...previous,
      skillUpgradePoints: previous.skillUpgradePoints - 1,
      skillUpgradeLevels: {
        ...previous.skillUpgradeLevels,
        [skillId]: (previous.skillUpgradeLevels[skillId] ?? 0) + 1,
      },
    }));
    showToast(`「${skillName}」已升級至 Lv.${currentLevel + 1}`);
  };

  const claimAchievement = (achievementId: string) => {
    const status = achievementStatuses.find(
      item => item.achievement.id === achievementId
    );
    if (!status || !status.progress.completed || status.claimed) return;
    const { achievement } = status;
    setSharedAchievementClaimedIds(previous =>
      previous.includes(achievement.id)
        ? previous
        : [...previous, achievement.id]
    );
    setState(previous => ({
      ...previous,
      coins: previous.coins + achievement.rewardCoins,
      weeklyStats: addWeeklyStats(
        previous.weeklyStats,
        { coinsEarned: achievement.rewardCoins },
        new Date()
      ),
      skillUpgradePoints:
        previous.skillUpgradePoints + (achievement.rewardSkillPoints ?? 0),
      achievementClaimedIds: normalizeAchievementIds([
        ...(Array.isArray(previous.achievementClaimedIds)
          ? previous.achievementClaimedIds
          : []),
        achievement.id,
      ]),
    }));
    showToast(
      `成就「${achievement.title}」已領取：+${achievement.rewardCoins} 金幣${
        achievement.rewardSkillPoints ? `、+${achievement.rewardSkillPoints} 技能點` : ""
      }`
    );
  };

  const selectSpecialization = (specializationId: SpecializationId) => {
    if (!specializationUnlocked) {
      showToast(`角色達到 Lv.50 後才能轉職（目前 Lv.${player.level}）`);
      return;
    }
    if (specializationId === state.specialization) return;
    const specialization = getSpecializations(state.jobClass).find(
      item => item.id === specializationId
    );
    if (!specialization) return;
    setState(previous => ({ ...previous, specialization: specialization.id }));
    showToast(`已轉職為「${specialization.name}」專精`);
  };
  const navigateTo = (page: PageKey) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const renderSoulTrialCard = (monster: Monster) => {
    const defeated = defeatedMonsterIds.includes(monster.id);
    const Icon = monster.icon;
    const levelLocked = soulMemory.level < monster.level;
    return (
      <div
        className={`monster-card panel-card monster-${monster.tone} ${monster.isBoss ? "boss-card" : ""} ${defeated ? "is-defeated" : ""}`}
        key={monster.id}
      >
        <div className="monster-card-top">
          <div className="monster-avatar">
            <Icon size={monster.isBoss ? 27 : 25} />
          </div>
          <span className="monster-level">LV. {monster.level}</span>
        </div>
        {monster.region && <div className="monster-region-label">{monster.region}</div>}
        <h3>{monster.name}</h3>
        <p>{monster.description}</p>
        <div className="monster-requirements">
          <span>最低門檻</span>
          {Object.entries(monster.requirements).map(([key, value]) => (
            <b key={key}>
              {abilityLabels[key as AbilityKey]} {value}
            </b>
          ))}
        </div>
        <div className="monster-risk">
          <span>
            {soulTrialCombatLocked
              ? `靈魂恢復中 · ${formatCooldown(soulTrialCooldownRemaining)}`
              : levelLocked
                ? `需要靈魂 LV. ${monster.level}`
                : `戰鬥風險：${monster.risk}`}
          </span>
          <span>生命 -{monster.damage}</span>
        </div>
        <div className="monster-combat-stats">
          <span>攻擊 {monster.damage}</span>
          <span>減免 {getDefenseReduction(monster.defense)}</span>
          <span>暴擊 {monster.critRate.toFixed(1)}%</span>
          <span>閃避 {monster.dodgeRate.toFixed(1)}%</span>
          <span>暴傷 {monster.critDamage}%</span>
        </div>
        {getMonsterMechanicLabels(monster).length > 0 && (
          <div className="monster-mechanics" aria-label="特殊機制">
            {getMonsterMechanicLabels(monster).map(label => (
              <span key={label}>{label}</span>
            ))}
          </div>
        )}
        <div className="monster-card-bottom">
          <span className="monster-reward">
            <Coins size={14} /> +{monster.reward}
          </span>
          <button
            className="monster-attack-button"
            disabled={defeated || levelLocked || soulTrialCombatLocked}
            onClick={() => startBattle(monster)}
          >
            {defeated
              ? "已擊倒"
              : soulTrialCombatLocked
                ? "靈魂恢復中"
                : levelLocked
                  ? "靈魂等級不足"
                  : "開始戰鬥"}
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="quest-app">
      <aside className={`quest-sidebar ${mobileMenuOpen ? "is-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark">
            <Sword size={22} />
          </div>
          <div>
            <div className="brand-name">QUESTBOARD</div>
            <div className="brand-subtitle">DAILY RPG PLANNER</div>
          </div>
        </div>
        <div className="sidebar-scroll" aria-label="側邊導覽選單">
          <div className="sidebar-section-label">冒險地圖</div>
          <nav className="sidebar-nav" aria-label="冒險地圖">
          <button
            className={`sidebar-link ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => navigateTo("dashboard")}
          >
            <LayoutGrid size={18} />
            <span>任務總覽</span>
            {activePage === "dashboard" && <span className="active-dot" />}
          </button>
          <button
            className={`sidebar-link ${activePage === "abilities" ? "active" : ""}`}
            onClick={() => navigateTo("abilities")}
          >
            <ShieldCheck size={18} />
            <span>角色</span>
            {activePage === "abilities" && <span className="active-dot" />}
          </button>
          <button
            className={`sidebar-link ${activePage === "monsters" ? "active" : ""}`}
            onClick={() => navigateTo("monsters")}
          >
            <Skull size={18} />
            <span>怪物區域</span>
            {activePage === "monsters" && <span className="active-dot" />}
          </button>
          <button
            className={`sidebar-link ${activePage === "soulTrial" ? "active" : ""}`}
            onClick={() => navigateTo("soulTrial")}
          >
            <Sparkles size={18} />
            <span>靈魂的試煉</span>
            {activePage === "soulTrial" && <span className="active-dot" />}
          </button>
          <button
            className={`sidebar-link ${activePage === "loot" ? "active" : ""}`}
            onClick={() => navigateTo("loot")}
          >
            <Gift size={18} />
            <span>裝備工坊</span>
            {activePage === "loot" && <span className="active-dot" />}
          </button>
          <button
            className={`sidebar-link ${activePage === "codex" ? "active" : ""}`}
            onClick={() => navigateTo("codex")}
          >
            <BookOpen size={18} />
            <span>裝備圖鑑</span>
            {activePage === "codex" && <span className="active-dot" />}
          </button>
          <button
            className={`sidebar-link ${activePage === "monsterCodex" ? "active" : ""}`}
            onClick={() => navigateTo("monsterCodex")}
          >
            <Skull size={18} />
            <span>怪物圖鑑</span>
            {activePage === "monsterCodex" && <span className="active-dot" />}
          </button>
          <button
            className={`sidebar-link ${activePage === "rewards" ? "active" : ""}`}
            onClick={() => navigateTo("rewards")}
          >
            <Gift size={18} />
            <span>獎勵寶庫</span>
            {activePage === "rewards" && <span className="active-dot" />}
          </button>
          <button
            className={`sidebar-link ${activePage === "timers" ? "active" : ""}`}
            onClick={() => navigateTo("timers")}
          >
            <Clock3 size={18} />
            <span>事務計時</span>
            {activePage === "timers" && <span className="active-dot" />}
          </button>
          <button
            className="sidebar-link"
            onClick={() => navigateTo("achievements")}
          >
            <Trophy size={18} />
            <span>成就里程碑</span>
          </button>
          </nav>
          <div className="sidebar-section-label sidebar-label-spaced">系統</div>
          <nav className="sidebar-nav" aria-label="系統">
          <button
            type="button"
            className="sidebar-link"
            onClick={openProfileSettings}
          >
            <Settings2 size={18} />
            <span>設定偏好</span>
          </button>
          <button className="sidebar-link" onClick={openSaveManager}>
            <BookOpen size={18} />
            <span>冒險存檔</span>
          </button>
          <button
            className="sidebar-link"
            onClick={() => showToast("你的冒險紀錄已安全保存在此裝置")}
          >
            <ShieldCheck size={18} />
            <span>資料安全</span>
          </button>
          </nav>
        </div>
        <div className="sidebar-footer-card">
          <div className="mini-spark">
            <Sparkles size={16} />
          </div>
          <div>
            <strong>
              今日任務已完成 {completedTasks}/{activeTasks}
            </strong>
            <span>
              再完成 {Math.max(0, activeTasks - completedTasks)}{" "}
              個，解鎖下一個寶箱
            </span>
          </div>
        </div>
        <div className="sidebar-user">
          <div className="avatar avatar-small">{userInitials}</div>
          <div className="sidebar-user-copy">
            <strong>{state.userName}</strong>
            <span>任務騎士 · Lv.{player.level}</span>
          </div>
          <button
            className="icon-button muted-button"
            aria-label="更多選項"
            onClick={() => showToast("冒險者選單即將開放")}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </aside>

      <main className="quest-main" id="dashboard">
        <header className="topbar">
          <button
            className="mobile-menu-button"
            aria-label="開啟選單"
            onClick={() => setMobileMenuOpen(open => !open)}
          >
            <Menu size={21} />
          </button>
          <div className="crumb">
            <span>你的冒險</span>
            <ChevronRight size={14} />
            <strong>
              {
                {
                  dashboard: "任務總覽",
                  abilities: "角色能力與技能",
                  skills: "角色能力與技能",
                  monsters: "怪物與魔王",
                  soulTrial: "靈魂的試煉",
                  loot: "裝備工坊",
                  codex: "裝備圖鑑",
                  monsterCodex: "怪物圖鑑",
                  rewards: "獎勵寶庫",
                  timers: "事務計時",
                  achievements: "成就里程碑",
                }[activePage]
              }
            </strong>
          </div>
          <div className="topbar-actions">
            <button
              type="button"
              className="save-access-button"
              onClick={openSaveManager}
            >
              <BookOpen size={14} /> <span>存檔</span>
            </button>
            <div className="date-chip">
              <CalendarDays size={15} /> {formatDate()}
            </div>
            <button
              type="button"
              className="refresh-time-button"
              onClick={openRefreshSettings}
              aria-label={`調整每日刷新時間，目前為 ${formatResetTime(state.dailyResetMinutes)}`}
            >
              <Clock3 size={15} />
              <span>刷新 {formatResetTime(state.dailyResetMinutes)}</span>
            </button>
            <button
              className="notification-button"
              aria-label="通知"
              onClick={openNotificationSettings}
            >
              <Bell size={18} />
              <span />
            </button>
            <div className="avatar avatar-top">{userInitials}</div>
          </div>
        </header>

        <div className="content-wrap">
          {activePage === "dashboard" && (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-line" />
                    任務簡報
                  </div>
                  <h1>
                    歡迎回來，冒險者 <span className="wave-mark">✦</span>
                  </h1>
                  <p className="welcome-copy">
                    把今天的小事，變成下一段冒險的經驗值。
                  </p>
                </div>
                <button
                  className="primary-button"
                  onClick={() =>
                    firstEmptySlot >= 0
                      ? openNewTask(firstEmptySlot)
                      : showToast("目前棋盤已滿，請先完成或刪除一個任務")
                  }
                >
                  <Plus size={18} /> 新增任務
                </button>
              </section>

              <section className="soul-memory-panel panel-card">
                <div className="soul-memory-symbol">
                  <Sparkles size={21} />
                </div>
                <div className="soul-memory-copy">
                  <span className="mini-kicker">
                    SOUL MEMORY · {soulMemory.roleCount} ROLES
                  </span>
                  <h2>靈魂的記憶</h2>
                  <p>
                    彙整目前所有角色的 10% 經驗與基礎能力，不計入裝備加成。
                  </p>
                </div>
                <div className="soul-memory-stats">
                  <div>
                    <span>經驗</span>
                    <strong>{soulMemory.totalXp.toLocaleString()}</strong>
                    <small>XP · LV.{soulMemory.level}</small>
                  </div>
                  <div>
                    <span>能力</span>
                    <strong>
                      {soulMemory.abilities.health}/
                      {soulMemory.abilities.strength}/
                      {soulMemory.abilities.defense}/
                      {soulMemory.abilities.intelligence}
                    </strong>
                    <small>生命／力／防／智</small>
                  </div>
                  <div>
                    <span>能力等級</span>
                    <strong>{soulMemory.abilityLevel}</strong>
                    <small>10% 累積</small>
                  </div>
                </div>
              </section>

              <section className="hero-panel">
                <div className="hero-glow hero-glow-one" />
                <div className="hero-glow hero-glow-two" />
                <div className="hero-profile">
                  <div className="avatar avatar-hero">
                    {userInitials}
                    <span className="online-dot" />
                  </div>
                  <div className="profile-copy">
                    <div className="profile-kicker">
                      <span>任務騎士</span>
                      <span className="profile-divider">/</span>
                      <span>白銀階級</span>
                    </div>
                    <div className="profile-name">
                      {state.userName}{" "}
                      <span className="verified-mark">
                        <Check size={11} />
                      </span>
                    </div>
                    <div className="level-line">
                      <span>LV. {String(player.level).padStart(2, "0")}</span>
                      <span className="level-next">
                        距離下一級還有 {player.neededXp - player.currentXp} XP
                      </span>
                    </div>
                    <div className="xp-track">
                      <div
                        className="xp-fill"
                        style={{ width: `${player.progress}%` }}
                      />
                      <span className="xp-shimmer" />
                    </div>
                    <div className="xp-foot">
                      <span>
                        {player.currentXp.toLocaleString()} /{" "}
                        {player.neededXp.toLocaleString()} XP
                      </span>
                      <span>{player.progress}%</span>
                    </div>
                  </div>
                </div>
                <div className="hero-divider" />
                <div className="hero-stat-grid">
                  <div className="hero-stat">
                    <div className="stat-icon gold">
                      <Coins size={17} />
                    </div>
                    <div>
                      <span>金幣</span>
                      <strong>{state.coins.toLocaleString()}</strong>
                    </div>
                  </div>
                  <div className="hero-stat">
                    <div className="stat-icon fire">
                      <Flame size={17} />
                    </div>
                    <div>
                      <span>連續完成</span>
                      <strong>
                        {state.streak} <em>天</em>
                      </strong>
                    </div>
                  </div>
                  <div className="hero-stat">
                    <div className="stat-icon mint">
                      <CheckCircle2 size={17} />
                    </div>
                    <div>
                      <span>今日進度</span>
                      <strong>
                        {completedTasks}
                        <em>/{activeTasks}</em>
                      </strong>
                    </div>
                  </div>
                </div>
                <button
                  className="reset-character-button"
                  disabled={Boolean(state.runningTimer)}
                  onClick={resetCharacter}
                >
                  <RotateCcw size={14} /> 重製角色
                </button>
              </section>
            </>
          )}

          {activePage === "abilities" && (
            <section className="abilities-section" id="abilities">
              <div className="section-heading abilities-heading">
                <div>
                  <div className="section-kicker">
                    <ShieldCheck size={15} /> CHARACTER ATTRIBUTES
                  </div>
                  <h2>角色能力</h2>
                  <p>每一次完成，都是下一段冒險的能力值。</p>
                </div>
                <div
                  className={`ability-average ${state.abilityPoints > 0 ? "has-points" : ""}`}
                >
                  <span>可用點數</span>
                  <strong>{state.abilityPoints}</strong>
                  <small>點</small>
                </div>
              </div>
              <div className="abilities-panel panel-card">
                <div className="abilities-panel-intro">
                  <div className="ability-emblem">
                    <Sparkles size={21} />
                  </div>
                  <div>
                    <strong>冒險者狀態</strong>
                    <p>能力會隨著你的任務節奏即時成長</p>
                  </div>
                  <div className="ability-level-badge">
                    <span>RPG RANK</span>
                    <strong>LV. {String(player.level).padStart(2, "0")}</strong>
                  </div>
                </div>
                <div className="class-selection">
                  <div className="class-selection-heading">
                    <div>
                      <span className="mini-kicker">JOB CLASS</span>
                      <strong>{classDefinition.name}</strong>
                      <small>{classDefinition.description}</small>
                      <small className="class-lock-note">
                        職業已鎖定；{classDefinition.levelUpSummary}
                      </small>
                    </div>
                    <div className="class-badge">
                      {getTaskIcon(classDefinition.icon, 19)}
                    </div>
                  </div>
                  <div className="class-options class-options-locked">
                    <div className="class-locked-pill">
                      {getTaskIcon(classDefinition.icon, 15)}
                      <span>{classDefinition.name} · 不可轉職</span>
                    </div>
                  </div>
                </div>
                <div className="ability-equipment-panel">
                  <div className="ability-equipment-heading">
                    <div>
                      <span className="mini-kicker">EQUIPPED ITEMS</span>
                      <strong>裝備道具欄位</strong>
                      <small>
                        頭盔、胸甲、武器、護腿、護身符各一件；屬性即時加入戰鬥計算。
                      </small>
                    </div>
                    <span>{equippedItems.length}/5</span>
                  </div>
                  <div className="ability-equipment-slots">
                    {EQUIPMENT_SLOTS.map(slot => {
                      const item = equippedItems.find(
                        equipped => equipped.slot === slot
                      );
                      return item ? (
                        <button
                          type="button"
                          className="ability-equipment-slot filled"
                          key={`ability-slot-${slot}`}
                          onClick={() => toggleEquipItem(item)}
                          title="點擊卸下"
                        >
                          <span>{getTaskIcon(item.icon, 14)}</span>
                          <strong>{slot} · {item.name}</strong>
                          <small>{item.element ? `${item.element}元素 · ` : ""}{item.bonus}</small>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="ability-equipment-slot"
                          key={`ability-slot-${slot}`}
                          onClick={() => navigateTo("loot")}
                        >
                          <span>{slot}</span>
                          <strong>未裝備</strong>
                          <small>前往戰利品庫</small>
                        </button>
                      );
                    })}
                  </div>
                  <div className="equipment-bonus-summary">
                    <span>裝備加成</span>
                    <b>生命 +{equipmentBonuses.abilities.health}</b>
                    <b>力量 +{equipmentBonuses.abilities.strength}</b>
                    <b>防禦 +{equipmentBonuses.abilities.defense}</b>
                    <b>智力 +{equipmentBonuses.abilities.intelligence}</b>
                    {equipmentBonuses.combat.critRate ? (
                      <b>暴擊 +{equipmentBonuses.combat.critRate}%</b>
                    ) : null}
                    {equipmentBonuses.combat.critDamage ? (
                      <b>暴傷 +{equipmentBonuses.combat.critDamage}%</b>
                    ) : null}
                    {equipmentBonuses.combat.dodgeRate ? (
                      <b>閃避 +{equipmentBonuses.combat.dodgeRate}%</b>
                    ) : null}
                    {equipmentBonuses.combat.castSpeedPercent ? (
                      <b>施法速度 +{equipmentBonuses.combat.castSpeedPercent}%</b>
                    ) : null}
                    {equipmentBonuses.combat.damageReductionPercent ? (
                      <b>受到傷害 −{equipmentBonuses.combat.damageReductionPercent}%</b>
                    ) : null}
                    {equipmentBonuses.combat.magicPenetrationPercent ? (
                      <b>魔法穿透 +{equipmentBonuses.combat.magicPenetrationPercent}%</b>
                    ) : null}
                  </div>
                  <div className="equipment-set-summary">
                    <div className="equipment-set-summary-heading">
                      <div>
                        <span className="mini-kicker">EQUIPMENT SETS</span>
                        <strong>套裝效果</strong>
                      </div>
                      <small>同系列裝備達到 2／4 件時啟用</small>
                    </div>
                    {equipmentBonuses.activeSets.length > 0 ? (
                      <div className="equipment-set-list">
                        {equipmentBonuses.activeSets.map(set => (
                          <div className="equipment-set-card" key={set.id}>
                            <div className="equipment-set-card-top">
                              <strong>{set.name}</strong>
                              <span>{set.equippedCount}/4 件</span>
                            </div>
                            <small>{set.description}</small>
                            <div className="equipment-set-effects">
                              {set.activeBonuses.map(bonus => (
                                <span key={`${set.id}-${bonus.pieces}`}>
                                  <b>{bonus.pieces} 件</b> {bonus.label} · {bonus.description}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="equipment-set-empty">目前尚未湊齊任何套裝；裝備名稱前綴相同的部件屬於同一系列。</p>
                    )}
                  </div>
                </div>
                <div className="ability-grid">
                  {abilityStats.map(
                    ({ key, label, value, tone, icon: Icon, description }) => (
                      <div className={`ability-card ability-${tone}`} key={key}>
                        <div className="ability-card-top">
                          <div className="ability-icon">
                            <Icon size={18} />
                          </div>
                          <div className="ability-label">
                            <span>{label}</span>
                            <small>{description}</small>
                          </div>
                          <strong>{value}</strong>
                        </div>
                        <div className="ability-track">
                          <span style={{ width: `${Math.min(100, value)}%` }} />
                        </div>
                        <div className="ability-card-foot">
                          <span>目前能力</span>
                          <button
                            className="ability-upgrade"
                            disabled={state.abilityPoints <= 0}
                            onClick={() => allocateAbilityPoint(key, label)}
                            aria-label={`將 1 點能力點分配給${label}`}
                          >
                            {key === "health" ? "＋10" : "＋1"}
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="attribute-breakdown-panel">
                  <div className="attribute-breakdown-heading">
                    <div>
                      <span className="mini-kicker">COMBAT PROFILE</span>
                      <strong>角色屬性面板</strong>
                      <small>
                        顯示目前實際值，以及基礎、職業、裝備與專精被動的來源拆解。
                      </small>
                    </div>
                    <span className="attribute-breakdown-badge">
                      {classDefinition.name} · Lv.{player.level}
                    </span>
                  </div>
                  <div className="attribute-breakdown-table" role="table" aria-label="角色屬性來源拆解">
                    <div className="attribute-breakdown-row attribute-breakdown-header" role="row">
                      <span role="columnheader">屬性</span>
                      <span role="columnheader">目前</span>
                      <span role="columnheader">基礎</span>
                      <span role="columnheader">職業</span>
                      <span role="columnheader">裝備</span>
                      <span role="columnheader">專精</span>
                    </div>
                    {attributeBreakdowns.map(attribute => {
                      const Icon = attribute.icon;
                      const formatValue = (value: number) =>
                        `${value > 0 ? "+" : ""}${value}${attribute.unit}`;
                      return (
                        <div className="attribute-breakdown-row" role="row" key={attribute.key}>
                          <div className="attribute-breakdown-name" role="cell">
                            <span className={`attribute-breakdown-icon attribute-${attribute.tone}`}>
                              <Icon size={14} />
                            </span>
                            <span>
                              <strong>{attribute.label}</strong>
                              <small>{attribute.note}</small>
                            </span>
                          </div>
                          <strong className="attribute-breakdown-total" role="cell">
                            {attribute.total}{attribute.unit}
                          </strong>
                          <span role="cell">{formatValue(attribute.base)}</span>
                          <span role="cell">{formatValue(attribute.classBonus)}</span>
                          <span role="cell">{formatValue(attribute.equipmentBonus)}</span>
                          <span role="cell">{formatValue(attribute.specializationBonus)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="temporary-buff-summary">
                    <div>
                      <span className="mini-kicker">TEMPORARY BUFF</span>
                      <strong>臨時 Buff</strong>
                    </div>
                    {temporaryBattleBuff ? (
                      <div className="temporary-buff-values">
                        <span>剩餘 {temporaryBattleBuff.turnsRemaining} 回合</span>
                        {temporaryBattleBuff.damageBonusPercent ? (
                          <b>傷害 +{temporaryBattleBuff.damageBonusPercent}%</b>
                        ) : null}
                        {temporaryBattleBuff.damageReductionPercent ? (
                          <b>受傷 {temporaryBattleBuff.damageReductionPercent > 0 ? "−" : "+"}{Math.abs(temporaryBattleBuff.damageReductionPercent)}%</b>
                        ) : null}
                        {temporaryBattleBuff.healPercentMaxHealth ? (
                          <b>回復 +{temporaryBattleBuff.healPercentMaxHealth}%</b>
                        ) : null}
                        {temporaryBattleBuff.dodgeRateBonusPercent ? (
                          <b>閃避 +{temporaryBattleBuff.dodgeRateBonusPercent}%</b>
                        ) : null}
                      </div>
                    ) : (
                      <span className="temporary-buff-empty">目前沒有生效中的戰鬥 Buff</span>
                    )}
                  </div>
                </div>
                <div className="combat-stats-row">
                  <div className="combat-stats-label">
                    <span>戰鬥屬性</span>
                    <small>每點能力點可自選升級</small>
                  </div>
                  <div className="combat-stat">
                    <span>暴擊率</span>
                    <strong>
                      {isMage
                        ? "不可暴擊"
                        : `${effectiveCombatStats.critRate.toFixed(1)}%`}
                    </strong>
                    <small>{isMage ? "法師固定無法暴擊" : "+0.3%／點"}</small>
                    <button
                      className="combat-stat-upgrade"
                      disabled={
                        isMage ||
                        state.abilityPoints <= 0 ||
                        combatStats.critRate >= 100
                      }
                      onClick={() => upgradeCombatStat("critRate", "暴擊率")}
                      aria-label="升級暴擊率"
                    >
                      ＋1
                    </button>
                  </div>
                  <div className="combat-stat">
                    <span>暴擊傷害</span>
                    <strong>{effectiveCombatStats.critDamage}%</strong>
                    <small>+1%／點</small>
                    <button
                      className="combat-stat-upgrade"
                      disabled={state.abilityPoints <= 0}
                      onClick={() =>
                        upgradeCombatStat("critDamage", "暴擊傷害")
                      }
                      aria-label="升級暴擊傷害"
                    >
                      ＋1
                    </button>
                  </div>
                  <div className="combat-stat">
                    <span>施法速度</span>
                    <strong>{effectiveCombatStats.castSpeedPercent ?? 0}%</strong>
                    <small>每 10% 魔法技能冷卻 -1 回合</small>
                  </div>
                  <div className="combat-stat">
                    <span>閃避率</span>
                    <strong>{effectiveCombatStats.dodgeRate}%</strong>
                    <small>+1%／點</small>
                    <button
                      className="combat-stat-upgrade"
                      disabled={
                        state.abilityPoints <= 0 || combatStats.dodgeRate >= 100
                      }
                      onClick={() => upgradeCombatStat("dodgeRate", "閃避率")}
                      aria-label="升級閃避率"
                    >
                      ＋1
                    </button>
                  </div>
                </div>
                {isArcher && (
                  <div className="archer-talent-panel">
                    <div className="archer-talent-heading">
                      <div>
                        <span className="mini-kicker">ARCHER TALENT</span>
                        <strong>游擊本能</strong>
                      </div>
                      <span>固定閃避率 +10%</span>
                    </div>
                    <p>
                      每次閃避失敗累積攻擊 +3%、閃避 +5%；加成持續至下一次閃避成功，成功時全部重置。
                    </p>
                    <div className="archer-talent-current">
                      <span>目前累積 {state.archerDodgeFailStacks} 層</span>
                      <strong>
                        攻擊 +{archerTalentBonuses.attackPercent}% · 額外閃避 +
                        {archerTalentBonuses.dodgePercent}%
                      </strong>
                    </div>
                  </div>
                )}
                <div className="intelligence-special">
                  <div>
                    <span>智力特技</span>
                    <strong>
                      經驗獲取 +{experienceBonusPercent.toFixed(1)}%
                    </strong>
                  </div>
                  <small>每 1 智力 +0.1% · 最高 +500%</small>
                </div>
                <div className="class-skill-panel">
                  <div className="class-skill-panel-heading">
                    <div>
                      <span className="mini-kicker">CLASS SKILLS</span>
                      <strong>職業專屬特殊技能</strong>
                    </div>
                    <button
                      type="button"
                      className="skill-page-link"
                      onClick={() => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      跳到完整技能樹 <ChevronRight size={13} />
                    </button>
                  </div>
                  {hasClassSkills ? (
                    <>
                      <div className="class-skill-progress">
                        <span>
                          {classDefinition.name} ·{" "}
                          {state.jobClass === "rogue"
                            ? `暴擊率 ${skillAttributeValue.toFixed(1)}%`
                            : `基礎${skillAttributeName} ${skillAttributeValue}`}
                        </span>
                        <strong>
                          {nextSkillUnlockThreshold !== null
                            ? `下一技能：${nextSkillUnlockThreshold}${state.jobClass === "rogue" ? "%" : " 點"}`
                            : "已解鎖全部盜賊技能"}
                        </strong>
                      </div>
                      {battleSpecialSkills.length > 0 ? (
                        <div className="class-skill-list">
                          {battleSpecialSkills.map(skill => (
                            <div className="class-skill-card" key={skill.id}>
                              <div>
                                <strong>{skill.name}</strong>
                                <span>
                                  {skill.unlockLevel
                                    ? `角色 Lv.${skill.unlockLevel} 解鎖`
                                    : `${skill.attributeName} ${skill.requiredValue}${skill.attributeName === "暴擊率" ? "%" : " 點"}`}
                                </span>
                              </div>
                              <small>{skill.description}</small>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="class-skill-empty">
                          {state.jobClass === "rogue"
                            ? "暴擊率達到 10%、20%、30% 時依序解鎖盜賊技能。"
                            : `基礎${skillAttributeName}達到 25 點後解鎖第一項職業技能；門檻不計裝備加成。`}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="class-skill-empty">
                      特殊技能開放給戰士（力量物理技能）、弓箭手（智力被動技能）、法師（智力魔法技能）與盜賊（暴擊率技能）。
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {activePage === "abilities" && (
            <section className="skills-page" id="skills">
              <div className="section-heading">
                <div>
                  <div className="section-kicker"><Zap size={15} /> CLASS SKILL ARCHIVE</div>
                  <h2>角色技能</h2>
                  <p>角色能力與技能集中於同一頁；達到基礎能力門檻後解鎖特殊技能。</p>
                </div>
                <div className="skill-page-class-badge">
                  {getTaskIcon(classDefinition.icon, 18)} {classDefinition.name}
                </div>
              </div>
              <div className="specialization-branch-panel panel-card">
                <div className="specialization-branch-heading">
                  <div>
                    <span className="mini-kicker">CLASS SPECIALIZATION</span>
                    <strong>
                      {specializationUnlocked
                        ? `${currentSpecialization.name}專精`
                        : `Lv.50 開放轉職（目前 Lv.${player.level}）`}
                    </strong>
                  </div>
                  <small>
                    {specializationUnlocked
                      ? nextSpecializationSkillLevel === null
                        ? "已解鎖此專精的全部 50／75／100 級技能。"
                        : `下一個專精技能：Lv.${nextSpecializationSkillLevel}`
                      : "角色達到 Lv.50 後，才能選擇轉職專精分支。"}
                  </small>
                </div>
                <div className={`specialization-identity specialization-identity-${currentSpecializationVisual.colorClass}`}>
                  <div className="specialization-identity-art">
                    {getTaskIcon(currentSpecializationVisual.icon, 30)}
                  </div>
                  <div>
                    <span className="mini-kicker">CURRENT ASPECT</span>
                    <strong>
                      {specializationSelected ? currentSpecialization.name : "尚未選擇專精"}
                    </strong>
                    <small>
                      {specializationSelected
                        ? currentSpecializationVisual.subtitle
                        : "Lv.50 後可選擇專精分支"}
                    </small>
                  </div>
                  <div className="specialization-identity-skills">
                    <span>專精技能</span>
                    <b>{unlockedSpecializationSkillsForStats.length} / 3</b>
                  </div>
                </div>
                <div className="specialization-branch-grid">
                  {getSpecializations(state.jobClass).map(specialization => (
                    (() => {
                      const visual = specializationVisuals[specialization.id];
                      return (
                    <button
                      type="button"
                      key={specialization.id}
                      className={`specialization-branch-option specialization-option-${visual.colorClass} ${isSpecializationSelected(player.level, specialization.id, state.specialization) ? "is-selected" : ""}`}
                      disabled={!specializationUnlocked}
                      onClick={() => selectSpecialization(specialization.id)}
                    >
                      <span className="specialization-option-icon">{getTaskIcon(visual.icon, 21)}</span>
                      <strong>{specialization.name}</strong>
                      <small>{visual.subtitle}</small>
                      <span>{specialization.description}</span>
                    </button>
                      );
                    })()
                  ))}
                </div>
              </div>
              <div className="skill-page-summary panel-card">
                <div>
                  <span className="mini-kicker">CURRENT PROGRESS</span>
                  <strong>
                    {state.jobClass === "rogue"
                      ? `暴擊率 ${skillAttributeValue.toFixed(1)}%`
                      : `基礎${skillAttributeName} ${skillAttributeValue} 點`}
                  </strong>
                </div>
                <div>
                  <span>已解鎖</span>
                  <strong>{battleSpecialSkills.length} / {allSpecialSkills.length}</strong>
                </div>
                <div>
                  <span>下一門檻</span>
                  <strong>{nextSkillUnlockThreshold === null ? "全部解鎖" : `${nextSkillUnlockThreshold}${state.jobClass === "rogue" ? "%" : " 點"}`}</strong>
                </div>
              </div>
              <div className="skill-upgrade-points panel-card">
                <div>
                  <span className="mini-kicker">SKILL UPGRADE POINTS</span>
                  <strong>{state.skillUpgradePoints}</strong>
                  <small>每升 1 級獲得 1 點；增益技能每級 +1% 增益，傷害技能每級 +5% 傷害；每項技能最多升級 {MAX_SKILL_UPGRADE_LEVEL} 次。</small>
                </div>
                <Zap size={24} />
              </div>
              <div className="skill-archive-grid">
                {allSpecialSkills.map(skill => {
                  const unlocked = battleSpecialSkills.some(item => item.id === skill.id);
                  const isBuff = skill.effectType === "buff";
                  const upgradeLevel = state.skillUpgradeLevels[skill.id] ?? 0;
                  const upgradeBonusLabel =
                    upgradeLevel > 0
                      ? skill.effectType === "damage"
                        ? `升級額外：傷害倍率 +${upgradeLevel * 5}% · 防禦穿透 +${Math.min(60, skill.defensePiercePercent + upgradeLevel * 2) - skill.defensePiercePercent}%`
                        : skill.effectType === "buff"
                        ? `升級額外：傷害增益 +${upgradeLevel}% · 減傷 +${upgradeLevel}%`
                        : `升級額外：暴擊傷害 +${upgradeLevel * 5}%`
                      : "";
                  const nextUpgradeSkill =
                    unlocked && upgradeLevel < MAX_SKILL_UPGRADE_LEVEL
                      ? applySkillUpgrade(skill, upgradeLevel + 1)
                      : null;
                  const damagePreview = unlocked
                    ? getSkillDamagePreview(skill)
                    : null;
                  return (
                    <article className={`skill-archive-card panel-card ${unlocked ? "is-unlocked" : "is-locked"}`} key={skill.id}>
                      <div className="skill-archive-card-top">
                        <div className="skill-archive-icon"><Zap size={18} /></div>
                        <div>
                          <span>{unlocked ? "已解鎖" : "尚未解鎖"}</span>
                          <h3>{skill.name}</h3>
                        </div>
                        <strong>
                          {skill.unlockLevel
                            ? `Lv.${skill.unlockLevel}`
                            : `${skill.requiredValue}${skill.attributeName === "暴擊率" ? "%" : " 點"}`}
                        </strong>
                      </div>
                      <p>{skill.description}</p>
                      {upgradeBonusLabel && (
                        <div className="skill-upgrade-bonus">
                          <Zap size={13} />
                          <span>{upgradeBonusLabel}（Lv.{upgradeLevel}）</span>
                        </div>
                      )}
                      {damagePreview ? (
                        <div className="skill-damage-preview">
                          <div className="skill-damage-preview-heading">
                            <strong>實際傷害預覽</strong>
                            <small>對 {damagePreview.monsterName}</small>
                          </div>
                          <div className="skill-damage-preview-grid">
                            <span>預估傷害</span>
                            <b>{damagePreview.minimumDamage}～{damagePreview.maximumDamage}</b>
                            <span>傷害類型</span>
                            <b>{damagePreview.damageType}</b>
                            <span>{damagePreview.damageType === "魔法" ? "魔法穿透" : "物理穿透"}</span>
                            <b>{damagePreview.penetration}%</b>
                            <span>{damagePreview.damageType === "魔法" ? "魔法抗性" : "物理抗性"}後</span>
                            <b>約 {damagePreview.minimumAfterResistance}～{damagePreview.maximumAfterResistance}</b>
                          </div>
                          <small className="skill-damage-preview-note">
                            目標{damagePreview.damageType === "魔法" ? "魔法" : "物理"}抗性 {damagePreview.resistancePercent}%；預覽已套用技能穿透與目前裝備／能力值。
                          </small>
                        </div>
                      ) : skill.effectType === "damage" ? (
                        <div className="skill-damage-preview is-locked">
                          解鎖後顯示實際傷害、穿透與抗性後數值
                        </div>
                      ) : null}
                      {nextUpgradeSkill && (
                        <div className="skill-upgrade-preview">
                          <strong>下一級預覽</strong>
                          {skill.effectType === "damage" ? (
                            <span>
                              {skill.damageMultiplier.toFixed(2)}× → {nextUpgradeSkill.damageMultiplier.toFixed(2)}× {skill.damageType}傷害
                            </span>
                          ) : skill.effectType === "buff" ? (
                            <span>
                              傷害增益 {skill.damageBonusPercent}% → {nextUpgradeSkill.damageBonusPercent}% · 減傷 {skill.damageReductionPercent}% → {nextUpgradeSkill.damageReductionPercent}%
                            </span>
                          ) : (
                            <span>
                              暴擊傷害 +{skill.critDamageBonusPercent}% → +{nextUpgradeSkill.critDamageBonusPercent}%
                            </span>
                          )}
                          <small>升級消耗：1 點技能升級點數</small>
                        </div>
                      )}
                      <div className="skill-archive-meta">
                        <span>{skill.attributeName}門檻</span>
                        {isBuff ? <span>增益技能 · {skill.durationTurns} 回合</span> : <span>{skill.damageMultiplier.toFixed(2)}×{skill.damageType}傷害</span>}
                        {skill.cooldownTurns > 0 && <span>冷卻 {skill.cooldownTurns} 回合</span>}
                        <button
                          type="button"
                          className="skill-upgrade-button"
                          disabled={!unlocked || state.skillUpgradePoints <= 0 || upgradeLevel >= MAX_SKILL_UPGRADE_LEVEL}
                          onClick={() => upgradeSkill(skill.id, skill.name)}
                        >
                          {upgradeLevel >= MAX_SKILL_UPGRADE_LEVEL ? "已滿級" : `升級 ${upgradeLevel}/${MAX_SKILL_UPGRADE_LEVEL}`}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className="skill-archive-note panel-card">
                <strong>戰鬥規則</strong>
                <span>已解鎖技能可在回合制戰鬥中點擊使用；技能冷卻與持續回合只在該場戰鬥內計算。</span>
              </div>
            </section>
          )}

          {activePage === "soulTrial" && (
            <>
              <section className="soul-trial-hero panel-card">
                <div className="soul-trial-hero-icon">
                  <Sparkles size={29} />
                </div>
                <div>
                  <div className="section-kicker soul-trial-kicker">
                    <Sparkles size={15} /> SOUL TRIAL
                  </div>
                  <h2>靈魂的試煉</h2>
                  <p>
                    以所有角色累積的靈魂記憶，挑戰比個人冒險更深的試煉；能力門檻只依靈魂基礎能力判定，不受目前角色的裝備加成影響。
                  </p>
                  <small className="soul-trial-cooldown-note">
                    {soulTrialCombatLocked
                      ? `靈魂試煉冷卻中 · ${formatCooldown(soulTrialCooldownRemaining)}`
                      : "靈魂試煉擁有獨立戰鬥冷卻，不會影響當前角色。"}
                  </small>
                </div>
                <div className="soul-trial-level">
                  <span>靈魂等級</span>
                  <strong>LV. {soulMemory.level}</strong>
                  <small>10% 全角色經驗彙總</small>
                </div>
              </section>
              <section className="monsters-section soul-trial-section">
                <div className="section-heading monsters-heading">
                  <div>
                    <div className="section-kicker soul-trial-kicker">
                      <Sparkles size={15} /> SOUL TRIAL CREATURES
                    </div>
                    <h2>靈魂小怪</h2>
                    <p>
                      共 9 隻 · 與怪物區域相同，每日 00:00 刷新 · 倒數{" "}
                      {formatRefreshCountdown(
                        nextSmallMonsterRefreshAt - currentTime
                      )}{" "}
                      · 等級範圍：靈魂等級 ±10
                    </p>
                  </div>
                </div>
                <div className="monster-grid">
                  {soulTrialMonsters.map(renderSoulTrialCard)}
                </div>
              </section>
              <section className="boss-section soul-trial-section">
                <div className="section-heading bosses-heading">
                  <div>
                    <div className="section-kicker soul-trial-kicker">
                      <Sparkles size={15} /> SOUL TRIAL BOSS
                    </div>
                    <h2>靈魂魔王</h2>
                    <p>
                      共 3 隻 · 與怪物區域相同，每週一 00:00 刷新 · 倒數{" "}
                      {formatRefreshCountdown(
                        nextWeeklyBossRefreshAt - currentTime
                      )}{" "}
                      · 魔王等級 100／150／200
                    </p>
                  </div>
                  <div className="boss-warning">
                    <span>挑戰條件</span>
                    <strong>需要達到對應靈魂等級</strong>
                  </div>
                </div>
                <div className="monster-grid boss-grid">
                  {activeSoulTrialBosses.map(renderSoulTrialCard)}
                </div>
              </section>
            </>
          )}

          {activePage === "monsters" && (
            <section className="monsters-section" id="monsters">
              <div className="section-heading monsters-heading">
                <div>
                  <div className="section-kicker">
                    <Skull size={15} /> MONSTER ZONE
                  </div>
                  <h2>怪物與魔王</h2>
                  <p>
                    {combatLocked
                      ? `戰鬥封鎖中 · 剩餘 ${formatCooldown(combatCooldownRemaining)}`
                      : `目前 ${dailyMonsters.length} 隻小怪 · 從小怪資料庫隨機選取 · 每日 00:00 刷新 · 倒數 ${formatRefreshCountdown(nextSmallMonsterRefreshAt - currentTime)} · 下次 ${formatRefreshDate(nextSmallMonsterRefreshAt)}`}
                  </p>
                </div>
                <div className="monster-zone-stats">
                  <div className="monster-health-summary">
                    <HeartPulse size={14} />
                    <div className="health-summary-copy">
                      <span>生命</span>
                      <strong>{state.currentHealth}</strong>
                      <small>/ {effectiveAbilities.health} · 每分鐘 +8%</small>
                    </div>
                    <em>{healthRecoveryLabel}</em>
                  </div>
                  <div className="monster-bounty-summary">
                    <Coins size={14} />
                    <span>已獲得</span>
                    <strong>
                      {allAvailableMonsters
                        .filter(monster =>
                          defeatedMonsterIds.includes(monster.id)
                        )
                        .reduce((total, monster) => total + monster.reward, 0)}
                    </strong>
                    <small>金幣</small>
                  </div>
                </div>
              </div>
              <LootProbabilityGuide
                monsterLevels={dailyMonsters.map(monster => monster.level)}
                bossLevels={activeBosses.map(boss => boss.level)}
              />
              <div className="monster-grid">
                {dailyMonsters.map(monster => {
                  const defeated = defeatedMonsterIds.includes(monster.id);
                  const Icon = monster.icon;
                  const mechanicLabels = getMonsterMechanicLabels(monster);
                  return (
                    <div
                      className={`monster-card panel-card monster-${monster.tone} ${defeated ? "is-defeated" : ""}`}
                      key={monster.id}
                    >
                      <div className="monster-card-top">
                        <div className="monster-avatar">
                          <Icon size={25} />
                        </div>
                        <span className="monster-level">
                          LV. {monster.level}
                        </span>
                      </div>
                      <div className="monster-region-label">{monster.region}</div>
                      <h3>{monster.name}</h3>
                      <p>{monster.description}</p>
                      <div className="monster-requirements">
                        <span>最低門檻</span>
                        {Object.entries(monster.requirements).map(
                          ([key, value]) => (
                            <b key={key}>
                              {abilityLabels[key as AbilityKey]} {value}
                            </b>
                          )
                        )}
                      </div>
                      <div className="monster-risk">
                        <span>戰鬥風險：{monster.risk}</span>
                        <span>生命 -{monster.damage}</span>
                      </div>
                      <div className="monster-combat-stats">
                        <span>攻擊 {monster.damage}</span>
                        <span>減免 {getDefenseReduction(monster.defense)}</span>
                        <span>暴擊 {monster.critRate.toFixed(1)}%</span>
                        <span>閃避 {monster.dodgeRate.toFixed(1)}%</span>
                        <span>暴傷 {monster.critDamage}%</span>
                      </div>
                      {mechanicLabels.length > 0 && (
                        <div className="monster-mechanics" aria-label="特殊機制">
                          {mechanicLabels.map(label => (
                            <span key={label}>{label}</span>
                          ))}
                        </div>
                      )}
                      <div className="monster-card-bottom">
                        <span className="monster-reward">
                          <Coins size={14} /> +{monster.reward}
                        </span>
                        <button
                          className="monster-attack-button"
                          disabled={defeated || combatLocked}
                          onClick={() => startBattle(monster)}
                        >
                          {defeated
                            ? "已擊倒"
                            : combatLocked
                              ? "恢復中"
                              : "開始戰鬥"}
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {activePage === "monsters" && (
            <section className="boss-section" id="bosses">
              <div className="section-heading bosses-heading">
                <div>
                  <div className="section-kicker boss-kicker">
                    <Skull size={15} /> AREA BOSS
                  </div>
                  <h2>區域魔王</h2>
                  <p>
                    每週一 00:00 刷新 · 倒數{" "}
                    {formatRefreshCountdown(
                      nextWeeklyBossRefreshAt - currentTime
                    )}{" "}
                    · 下次 {formatRefreshDate(nextWeeklyBossRefreshAt)} · 區域魔王最低
                    50 級，最終魔王需達 200 級。
                  </p>
                </div>
                <div className="boss-warning">
                  <span>死亡懲罰</span>
                  <strong>能力／等級／金幣 −50%</strong>
                </div>
              </div>
              <div className="monster-grid boss-grid">
                {activeBosses.map(boss => {
                  const defeated = defeatedMonsterIds.includes(boss.id);
                  const Icon = boss.icon;
                  const levelLocked = player.level < boss.level;
                  const mechanicLabels = getMonsterMechanicLabels(boss);
                  return (
                    <div
                      className={`monster-card boss-card panel-card monster-${boss.tone} ${defeated ? "is-defeated" : ""}`}
                      key={boss.id}
                    >
                      <div className="monster-card-top">
                        <div className="monster-avatar">
                          <Icon size={27} />
                        </div>
                        <span className="monster-level">LV. {boss.level}</span>
                      </div>
                      <h3>{boss.name}</h3>
                      <p>{boss.description}</p>
                      <div className="monster-requirements">
                        <span>最低門檻</span>
                        {Object.entries(boss.requirements).map(
                          ([key, value]) => (
                            <b key={key}>
                              {abilityLabels[key as AbilityKey]} {value}
                            </b>
                          )
                        )}
                      </div>
                      <div className="monster-risk">
                        <span>
                          {combatLocked
                            ? `恢復中 · ${formatCooldown(combatCooldownRemaining)}`
                            : levelLocked
                              ? `需要 LV. ${boss.level}`
                              : `戰鬥風險：${boss.risk}`}
                        </span>
                        <span>生命 -{boss.damage}</span>
                      </div>
                      <div className="monster-combat-stats">
                        <span>生命 {boss.health}</span>
                        <span>攻擊 {boss.damage}</span>
                        <span>防禦 {boss.defense}</span>
                        <span>減免 {getDefenseReduction(boss.defense)}</span>
                        {boss.intelligence !== undefined && <span>智力 {boss.intelligence}</span>}
                        <span>暴擊 {boss.critRate}%</span>
                        <span>閃避 {boss.dodgeRate}%</span>
                        <span>暴傷 {boss.critDamage}%</span>
                      </div>
                      {mechanicLabels.length > 0 && (
                        <div className="monster-mechanics" aria-label="特殊機制">
                          {mechanicLabels.map(label => (
                            <span key={label}>{label}</span>
                          ))}
                        </div>
                      )}
                      <div className="monster-card-bottom">
                        <span className="monster-reward">
                          <Coins size={14} /> +{boss.reward}
                        </span>
                        <button
                          className="monster-attack-button"
                          disabled={defeated || levelLocked || combatLocked}
                          onClick={() => startBattle(boss)}
                        >
                          {defeated
                            ? "已擊倒"
                            : combatLocked
                              ? "恢復中"
                              : levelLocked
                                ? "等級不足"
                                : "開始戰鬥"}
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {activePage === "dashboard" && (
            <>
              <section className="section-heading" id="quest-board">
                <div>
                  <div className="section-kicker">
                    <Activity size={15} /> QUEST BOARD
                  </div>
                  <h2>今日冒險任務</h2>
                  <p>完成今日任務，解鎖額外的冒險寶箱。</p>
                </div>
              </section>

              <section className="adventure-layout">
                <div className="bingo-card panel-card">
                  <div className="bingo-card-top">
                    <div className="bingo-label">TODAY'S QUEST BOARD</div>
                    <div className="bingo-card-controls">
                      <label className="board-size-control">
                        <LayoutGrid size={13} />
                        <span>棋盤</span>
                        <select
                          value={boardSize}
                          onChange={event =>
                            setBoardSize(
                              Number(event.target.value) as BoardSize
                            )
                          }
                          aria-label="選擇任務版面尺寸"
                        >
                          <option value="3">3 × 3</option>
                          <option value="4">4 × 4</option>
                          <option value="5">5 × 5</option>
                        </select>
                      </label>
                      <div className="board-action-buttons">
                        <button
                          type="button"
                          className="board-action-button"
                          onClick={shuffleBoardTasks}
                          disabled={boardTasks.length < 2}
                          title="打亂九宮格內任務的順序"
                        >
                          <Shuffle size={13} />
                          <span>打亂排序</span>
                        </button>
                        <button
                          type="button"
                          className="board-action-button board-action-danger"
                          onClick={resetBoardTasks}
                          disabled={boardTasks.length === 0}
                          title="刪除九宮格內的全部任務"
                        >
                          <RotateCcw size={13} />
                          <span>重置九宮格</span>
                        </button>
                      </div>
                      <div className="bingo-count">
                        <span className="count-number">{completedTasks}</span>
                        <span>/ {activeTasks} 完成</span>
                      </div>
                    </div>
                  </div>
                  <div className="task-filter-bar">
                    <div className="task-filter-heading">
                      <Filter size={14} />
                      <span>任務篩選</span>
                      <small>
                        {hasTaskFilters
                          ? `顯示 ${filteredTaskCount}/${activeTasks}`
                          : "全部任務"}
                      </small>
                    </div>
                    <label
                      className={
                        taskCategoryFilter !== "all" ? "is-active" : ""
                      }
                    >
                      <span>分類</span>
                      <select
                        value={taskCategoryFilter}
                        onChange={event =>
                          setTaskCategoryFilter(
                            event.target.value as TaskCategoryFilter
                          )
                        }
                        aria-label="依任務分類篩選"
                      >
                        <option value="all">全部分類</option>
                        {["工作", "學習", "健康", "生活", "心情"].map(
                          category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          )
                        )}
                      </select>
                    </label>
                    <label
                      className={
                        taskDifficultyFilter !== "all" ? "is-active" : ""
                      }
                    >
                      <span>難度</span>
                      <select
                        value={taskDifficultyFilter}
                        onChange={event =>
                          setTaskDifficultyFilter(
                            event.target.value as TaskDifficultyFilter
                          )
                        }
                        aria-label="依任務難度篩選"
                      >
                        <option value="all">全部難度</option>
                        {["輕量", "標準", "挑戰"].map(difficulty => (
                          <option key={difficulty} value={difficulty}>
                            {difficulty}
                          </option>
                        ))}
                      </select>
                    </label>
                    {hasTaskFilters && (
                      <button
                        type="button"
                        className="clear-task-filters"
                        onClick={clearTaskFilters}
                      >
                        清除篩選
                      </button>
                    )}
                  </div>
                  <div
                    className="bingo-grid"
                    style={{
                      gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
                    }}
                  >
                    {Array.from({ length: boardSlotCount }, (_, slot) => {
                      const task = taskBySlot.get(slot);
                      if (!task) {
                        return (
                          <button
                            key={`empty-${slot}`}
                            className="task-tile empty-tile"
                            onClick={() => openNewTask(slot)}
                          >
                            <span className="empty-plus">
                              <Plus size={18} />
                            </span>
                            <span>放置新任務</span>
                            <small>點擊新增</small>
                          </button>
                        );
                      }
                      const matchesFilters =
                        (taskCategoryFilter === "all" ||
                          task.category === taskCategoryFilter) &&
                        (taskDifficultyFilter === "all" ||
                          task.difficulty === taskDifficultyFilter);
                      if (!matchesFilters) {
                        return (
                          <div
                            key={task.id}
                            className="task-tile task-filtered-out"
                          >
                            <Filter size={17} />
                            <strong>已篩選隱藏</strong>
                            <span>
                              {task.category} · {task.difficulty}
                            </span>
                            <small>清除篩選後查看</small>
                          </div>
                        );
                      }
                      const tone = categoryTone[task.category];
                      return (
                        <div
                          key={task.id}
                          className={`task-tile task-${tone} ${task.completed ? "is-complete" : ""}`}
                        >
                          <button
                            className="task-main-button"
                            onClick={() => toggleTask(task)}
                            aria-label={`${task.completed ? "取消完成" : "完成"}：${task.title}`}
                          >
                            <div className="task-tile-head">
                              <span className="task-icon">
                                {getTaskIcon(task.icon, 17)}
                              </span>
                              <span className="task-category">
                                {task.category}
                              </span>
                              {task.repeat && task.repeat !== "none" && (
                                <span className="task-repeat-badge">
                                  {getRepeatLabel(task.repeat)}
                                </span>
                              )}
                              {task.completed && (
                                <span className="task-check">
                                  <Check size={13} />
                                </span>
                              )}
                            </div>
                            <div className="task-title">{task.title}</div>
                            <div className="task-reward">
                              <span>
                                <Zap size={12} /> +{task.xp} XP
                              </span>
                              <span>
                                <Coins size={12} /> +{task.coins}
                              </span>
                            </div>
                          </button>
                          <div className="task-tile-actions">
                            <span
                              className={`difficulty-dot difficulty-${task.difficulty}`}
                            >
                              {task.difficulty}
                            </span>
                            <button
                              aria-label={`編輯${task.title}`}
                              onClick={() => openEditTask(task)}
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              aria-label={`刪除${task.title}`}
                              onClick={() => deleteTask(task)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bingo-card-footer">
                    <span>
                      <span className="legend-dot complete-dot" /> 已完成
                    </span>
                    <span>
                      <span className="legend-dot pending-dot" /> 待出發
                    </span>
                    <span className="footer-note">
                      <Sparkles size={13} /> 每個任務都會帶你更接近下一級
                    </span>
                  </div>
                </div>

                <div className="progress-column">
                  <div className="progress-card panel-card">
                    <div className="card-heading">
                      <div>
                        <span className="mini-kicker">DAILY PROGRESS</span>
                        <h3>今日進度</h3>
                      </div>
                      <button
                        className="icon-button"
                        aria-label="重新整理進度"
                        onClick={() => showToast("進度已同步")}
                      >
                        <Activity size={17} />
                      </button>
                    </div>
                    <div className="progress-ring-row">
                      <div
                        className="progress-ring"
                        style={
                          {
                            "--progress": `${completionPercent * 3.6}deg`,
                          } as React.CSSProperties
                        }
                      >
                        <div className="progress-ring-inner">
                          <strong>{completionPercent}%</strong>
                          <span>完成度</span>
                        </div>
                      </div>
                      <div className="progress-copy">
                        <strong>
                          {completedTasks} <span>/ {activeTasks} 任務</span>
                        </strong>
                        <p>
                          {completionPercent >= 70
                            ? "很棒，今天的節奏正好。"
                            : "先完成一個最輕的任務吧。"}
                        </p>
                        <div className="micro-progress">
                          <span style={{ width: `${completionPercent}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="next-reward">
                      <div className="next-reward-icon">
                        <Gift size={17} />
                      </div>
                      <div>
                        <span>下一個小里程碑</span>
                        <strong>
                          完成 {Math.min(activeTasks, completedTasks + 2)}{" "}
                          個任務
                        </strong>
                      </div>
                      <ChevronRight size={16} />
                    </div>
                    <div className="daily-chest-progress">
                      <div className="daily-chest-heading">
                        <span>每日任務寶箱</span>
                        <small>金幣 50–75 · XP 50–125 · 裝備／寶物各 35%</small>
                      </div>
                      <div className="daily-chest-milestones">
                        {[3, 6, 9].map(milestone => {
                          const claimed = dailyChestClaims.includes(milestone);
                          const reached = completedTasks >= milestone;
                          return (
                            <div
                              key={milestone}
                              className={`daily-chest-milestone ${claimed ? "claimed" : reached ? "reached" : ""}`}
                            >
                              <Gift size={14} />
                              <strong>{milestone}</strong>
                              <span>{claimed ? "已領取" : reached ? "可領取" : "待解鎖"}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="streak-card panel-card" id="milestones">
                    <div className="card-heading">
                      <div>
                        <span className="mini-kicker">STREAK MILESTONES</span>
                        <h3>連勝里程碑</h3>
                      </div>
                      <Flame className="streak-heading-icon" size={19} />
                    </div>
                    <div className="milestone-list">
                      {[
                        { days: 3, reward: "+50 金幣", label: "初燃之火" },
                        { days: 7, reward: "+120 金幣", label: "不滅意志" },
                        { days: 14, reward: "+300 金幣", label: "傳奇習慣" },
                      ].map(milestone => {
                        const achieved = state.streak >= milestone.days;
                        const current =
                          state.streak < milestone.days &&
                          (milestone.days === 3 ||
                            state.streak >= milestone.days - 4);
                        return (
                          <div
                            key={milestone.days}
                            className={`milestone-row ${achieved ? "achieved" : ""} ${current ? "current" : ""}`}
                          >
                            <div className="milestone-medal">
                              {achieved ? (
                                <Check size={14} />
                              ) : (
                                <span>{milestone.days}</span>
                              )}
                            </div>
                            <div className="milestone-copy">
                              <strong>{milestone.label}</strong>
                              <span>
                                {milestone.days} 天連勝 · {milestone.reward}
                              </span>
                            </div>
                            {achieved ? (
                              <span className="achieved-label">已解鎖</span>
                            ) : (
                              <span className="locked-label">
                                <span>
                                  {Math.max(0, milestone.days - state.streak)}{" "}
                                  天
                                </span>
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {activePage === "achievements" && (
            <section className="achievements-section" id="achievements">
              <div className="section-heading achievements-heading">
                <div>
                  <div className="section-kicker"><Trophy size={15} /> ACHIEVEMENT HALL</div>
                  <h2>成就里程碑</h2>
                  <p>完成任務、專注計時與戰鬥挑戰，解鎖成就並領取額外獎勵；里程碑由所有存檔共用。</p>
                </div>
                <div className="achievement-trophy-count">
                  <strong>{achievementStatuses.filter(item => item.claimed).length}</strong>
                  <span>/ {ACHIEVEMENTS.length} 已領取</span>
                </div>
              </div>
              <div className="achievement-summary-grid">
                <div className="achievement-summary-card panel-card">
                  <span>已解鎖</span>
                  <strong>{achievementStatuses.filter(item => item.progress.completed).length}</strong>
                </div>
                <div className="achievement-summary-card panel-card">
                  <span>待領取</span>
                  <strong>{achievementStatuses.filter(item => item.progress.completed && !item.claimed).length}</strong>
                </div>
                <div className="achievement-summary-card panel-card">
                  <span>可領取金幣</span>
                  <strong>{achievementStatuses.filter(item => item.progress.completed && !item.claimed).reduce((total, item) => total + item.achievement.rewardCoins, 0)}</strong>
                </div>
              </div>
              <div className="achievement-grid">
                {achievementStatuses.map(({ achievement, progress, claimed }) => {
                  const progressPercent = Math.min(100, Math.round((progress.value / progress.goal) * 100));
                  return (
                    <article className={`achievement-card panel-card ${progress.completed ? "is-complete" : ""} ${claimed ? "is-claimed" : ""}`} key={achievement.id}>
                      <div className="achievement-card-top">
                        <div className="achievement-icon">{getTaskIcon(achievement.icon, 20)}</div>
                        <div>
                          <span>{achievement.category}</span>
                          <h3>{achievement.title}</h3>
                        </div>
                        {progress.completed && <CheckCircle2 size={18} className="achievement-complete-icon" />}
                      </div>
                      <p>{achievement.description}</p>
                      <div className="achievement-progress-label">
                        <span>{progress.label}</span>
                        <strong>{progressPercent}%</strong>
                      </div>
                      <div className="achievement-progress-track"><span style={{ width: `${progressPercent}%` }} /></div>
                      <div className="achievement-reward-row">
                        <span>獎勵：+{achievement.rewardCoins} 金幣{achievement.rewardSkillPoints ? ` · +${achievement.rewardSkillPoints} 技能點` : ""}</span>
                        {claimed ? (
                          <strong>已領取</strong>
                        ) : progress.completed ? (
                          <button type="button" onClick={() => claimAchievement(achievement.id)}>領取獎勵</button>
                        ) : (
                          <small>尚未完成</small>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {activePage === "loot" && (
            <section className="loot-section" id="loot">
              <div className="section-heading loot-heading">
                <div>
                  <div className="section-kicker">
                    <Gift size={15} /> LOOT VAULT
                  </div>
                  <h2>裝備工坊</h2>
                  <p>集中管理戰利品、裝備欄位與裝備合成；擊敗怪物有機會帶回新的裝備與道具。</p>
                </div>
                <div className="loot-count">
                  <strong>{inventory.length}</strong>
                  <span>件收藏</span>
                </div>
              </div>
              <nav className="equipment-workshop-tabs" aria-label="裝備工坊分區">
                <a className="is-active" href="#loot">戰利品庫</a>
                <a href="#fusion">裝備合成</a>
              </nav>
              <div className="equipment-benchmark-strip panel-card">
                <div className="equipment-benchmark-title">
                  <span className="mini-kicker">EQUIPMENT LEVEL BENCHMARK</span>
                  <strong>裝備等級基準</strong>
                  <small>掉落裝備會依稀有度套用 Lv.1–6 的數值區間。</small>
                </div>
                <div className="equipment-benchmark-list">
                  {LOOT_RARITIES.map((rarity, index) => {
                    const benchmark = RPG_EQUIPMENT_BENCHMARKS[rarity];
                    return (
                      <div key={rarity} className={`equipment-benchmark-item loot-${LOOT_RARITY_CLASS[rarity]}`}>
                        <strong>Lv.{index + 1} · {rarity}</strong>
                        <span>HP {benchmark.hp} · ATK {benchmark.attack}</span>
                        <span>INT {benchmark.intelligence} · DEF {benchmark.defense}</span>
                        <small>閃避 {benchmark.dodge}%</small>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="equipment-loadout panel-card">
                <div className="loadout-heading">
                  <div>
                    <span className="mini-kicker">ACTIVE LOADOUT</span>
                    <h3>裝備欄位</h3>
                    <p>五個部位各可裝備一件；同部位換裝會自動替換，寶藏可出售換取金幣。</p>
                  </div>
                  <strong>
                    {equippedItems.length}
                    <small>/ 5</small>
                  </strong>
                </div>
                <div className="equipment-slots">
                  {EQUIPMENT_SLOTS.map(slot => {
                    const item = equippedItems.find(
                      equipped => equipped.slot === slot
                    );
                    return (
                      <div
                        className={`equipment-slot ${item ? "filled" : "empty"}`}
                        key={`loadout-slot-${slot}`}
                      >
                        {item ? (
                          <>
                            <div className="equipment-slot-icon">
                              {getTaskIcon(item.icon, 16)}
                            </div>
                            <div>
                              <span>{item.weaponType ? `${item.weaponType} · ` : ""}{slot}</span>
                              <strong>{item.name}</strong>
                            </div>
                            <button
                              aria-label={`卸下${item.name}`}
                              onClick={() => toggleEquipItem(item)}
                            >
                              <X size={13} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="equipment-slot-number">
                              {slot}
                            </span>
                            <span>尚未裝備</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="loot-category-section">
                <div className="loot-category-heading">
                  <div>
                    <span className="mini-kicker">LOOT CATEGORIES</span>
                    <h3>戰利品分類格</h3>
                    <p>點選格子後，只在下方顯示該部位的裝備或寶物屬性。</p>
                  </div>
                  <span className="loot-category-selection">
                    目前查看：{selectedLootCategory}
                  </span>
                </div>
                <div className="loot-category-grid" role="tablist" aria-label="戰利品分類">
                  {LOOT_CATEGORY_KEYS.map(category => {
                    const Icon = lootCategoryMeta[category].icon;
                    const itemCount = getLootCategoryItems(category).length;
                    const selected = selectedLootCategory === category;
                    return (
                      <button
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        className={`loot-category-slot ${selected ? "is-selected" : ""}`}
                        key={category}
                        onClick={() => setSelectedLootCategory(category)}
                      >
                        <span className="loot-category-icon"><Icon size={19} /></span>
                        <span className="loot-category-copy">
                          <strong>{category}</strong>
                          <small>{lootCategoryMeta[category].description}</small>
                        </span>
                        <b>{itemCount}</b>
                      </button>
                    );
                  })}
                </div>
              </div>
              {equipmentComparison && selectedEquipmentForComparison ? (
                <div className="equipment-comparison panel-card" aria-live="polite">
                  <div className="equipment-comparison-heading">
                    <div>
                      <span className="mini-kicker">EQUIPMENT COMPARISON</span>
                      <h3>裝備比較</h3>
                      <p>比較替換同一部位後的角色實際屬性變化。</p>
                    </div>
                    <button type="button" className="equipment-comparison-close" aria-label="關閉裝備比較" onClick={() => setSelectedEquipmentForComparison(null)}><X size={16} /></button>
                  </div>
                  <div className="equipment-comparison-items">
                    <div className="equipment-comparison-item is-new"><span>新裝備</span><strong>{selectedEquipmentForComparison.name}</strong><small>{selectedEquipmentForComparison.bonus}</small></div>
                    <div className="equipment-comparison-arrow">→</div>
                    <div className="equipment-comparison-item is-current"><span>目前裝備</span><strong>{equipmentComparison.currentItem?.name ?? "尚未裝備"}</strong><small>{equipmentComparison.currentItem?.bonus ?? "此部位目前沒有裝備"}</small></div>
                  </div>
                  <div className="equipment-comparison-stats">
                    {equipmentComparison.stats.map(stat => {
                      const delta = stat.replacement - stat.current;
                      return <div className="equipment-comparison-stat" key={stat.label}><span>{stat.label}</span><strong>{stat.replacement}{stat.unit}</strong><small className={delta > 0 ? "is-positive" : delta < 0 ? "is-negative" : ""}>{delta > 0 ? "+" : ""}{delta}{stat.unit}</small></div>;
                    })}
                  </div>
                  <small className="equipment-comparison-note">魔法穿透目前由技能提供，裝備若未標示全域穿透則顯示 0；替換不會改變既有存檔格式。</small>
                </div>
              ) : null}
              <div className="loot-grid">
                {selectedLootItems.length === 0 ? (
                  <div className="loot-empty panel-card">
                    <div className="loot-empty-icon">
                      <Gift size={22} />
                    </div>
                    <strong>
                      {inventory.length === 0
                        ? "戰利品庫尚未開張"
                        : `${selectedLootCategory}目前沒有物品`}
                    </strong>
                    <span>
                      {inventory.length === 0
                        ? "完成第一場怪物戰鬥，尋找屬於你的第一件戰利品。"
                        : "探索其他分類格，或完成怪物戰鬥取得新的戰利品。"}
                    </span>
                  </div>
                ) : (
                  selectedLootItems
                    .slice()
                    .reverse()
                    .map(item => (
                      <div
                        className={`loot-card panel-card loot-${LOOT_RARITY_CLASS[item.rarity]} loot-${item.kind}`}
                        key={item.id}
                      >
                        <div className="loot-card-top">
                          <div className="loot-icon">
                            {item.kind === "equipment" ? (
                              getTaskIcon(item.icon, 19)
                            ) : (
                              <Coins size={19} />
                            )}
                          </div>
                          <div className="loot-card-labels">
                            <span className="loot-kind-badge">
                              {item.kind === "equipment" ? "裝備" : "寶藏"}
                            </span>
                              <span>{item.rarity}{item.kind === "equipment" ? ` · Lv.${item.equipmentLevel ?? LOOT_RARITIES.indexOf(item.rarity) + 1}` : ""}</span>
                          </div>
                        </div>
                        <div className="loot-card-copy">
                          <span>
                            {item.kind === "equipment"
                              ? `${item.element ? `${item.element}元素 · ` : ""}${item.weaponType ? `${item.weaponType} · ` : ""}${item.slot} · 裝備等級 ${item.equipmentLevel ?? LOOT_RARITIES.indexOf(item.rarity) + 1}${item.weaponType ? ` · ${getEquipmentRequiredJobClassName(item)}專用` : ""}`
                              : "可出售寶藏"}
                          </span>
                          <h3>{item.name}</h3>
                          <p>{item.description}</p>
                          {item.affixes?.length ? (
                            <div className="loot-affix-list" aria-label="特殊詞綴">
                              {item.affixes.map((affix, index) => (
                                <div
                                  className="loot-affix"
                                  key={`${item.id}-affix-${index}`}
                                >
                                  <strong>{affix.name}</strong>
                                  <small>{affix.description}</small>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <div className="loot-card-bottom">
                          <strong>
                            {item.kind === "equipment"
                              ? item.bonus
                              : `出售價 +${item.sellValue} 金幣`}
                          </strong>
                          <button
                            className={`loot-equip-button ${item.kind === "equipment" && equippedItemIds.includes(item.id) ? "is-equipped" : ""} ${item.kind === "treasure" ? "loot-sell-button" : ""}`}
                            disabled={
                              item.kind === "equipment" &&
                              !equippedItemIds.includes(item.id) &&
                              !canEquipEquipment(item, state.jobClass)
                            }
                            title={
                              item.kind === "equipment" &&
                              !canEquipEquipment(item, state.jobClass)
                                ? `${getEquipmentRequiredJobClassName(item)}專用武器`
                                : undefined
                            }
                            onClick={() =>
                              item.kind === "equipment"
                                ? toggleEquipItem(item)
                                : sellTreasure(item)
                            }
                          >
                            {item.kind === "equipment"
                              ? equippedItemIds.includes(item.id)
                                ? "已裝備"
                                : !canEquipEquipment(item, state.jobClass)
                                  ? `${getEquipmentRequiredJobClassName(item)}專用`
                                : equippedItems.some(
                                      equipped => equipped.slot === item.slot
                                    )
                                  ? "替換裝備"
                                  : "裝備"
                              : `出售 +${item.sellValue} 金幣`}
                          </button>
                          {item.kind === "equipment" && !equippedItemIds.includes(item.id) && canEquipEquipment(item, state.jobClass) ? (
                            <button type="button" className="loot-compare-button" onClick={() => setSelectedEquipmentForComparison(item)}>比較替換</button>
                          ) : null}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </section>
          )}

          {activePage === "codex" && (
            <section className="codex-section" id="codex">
              <div className="section-heading codex-heading">
                <div>
                  <div className="section-kicker">
                    <BookOpen size={15} /> EQUIPMENT CODEX
                  </div>
                  <h2>裝備圖鑑</h2>
                  <p>
                    完整收錄遊戲內全部裝備；所有冒險存檔共用同一本收藏冊，等待你從戰鬥與合成裡解鎖。
                  </p>
                </div>
                <div className="codex-total-badge">
                  <strong>{RPG_EQUIPMENT_TEMPLATES.length}</strong>
                  <span>件裝備</span>
                </div>
              </div>

              <div className="codex-progress-panel panel-card">
                <div className="codex-progress-copy">
                  <span className="mini-kicker">COLLECTION PROGRESS</span>
                  <strong>
                    {codexDiscoveredCount} / {RPG_EQUIPMENT_TEMPLATES.length} 已發現
                  </strong>
                  <small>
                    尚有 {RPG_EQUIPMENT_TEMPLATES.length - codexDiscoveredCount} 件裝備等待探索 · 所有存檔共用進度
                  </small>
                </div>
                <div className="codex-progress-visual">
                  <strong>{codexCompletionPercent}%</strong>
                  <div className="codex-progress-track" aria-label={`裝備圖鑑完成度 ${codexCompletionPercent}%`}>
                    <span style={{ width: `${codexCompletionPercent}%` }} />
                  </div>
                </div>
              </div>

              <div className="codex-toolbar panel-card">
                <div className="codex-toolbar-title">
                  <span className="mini-kicker">FILTER ARCHIVE</span>
                  <strong>搜尋完整收藏</strong>
                  <small>已發現與未發現裝備都會保留在結果中。</small>
                </div>
                <div className="codex-filters">
                  <label>
                    <span>稀有度</span>
                    <select
                      value={codexRarity}
                      onChange={event => setCodexRarity(event.target.value as "all" | LootRarity)}
                    >
                      <option value="all">全部稀有度</option>
                      {LOOT_RARITIES.map(rarity => (
                        <option value={rarity} key={rarity}>{rarity}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>裝備部位</span>
                    <select
                      value={codexSlot}
                      onChange={event => setCodexSlot(event.target.value as "all" | (typeof EQUIPMENT_SLOTS)[number])}
                    >
                      <option value="all">全部部位</option>
                      {EQUIPMENT_SLOTS.map(slot => (
                        <option value={slot} key={slot}>{slot}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    className="codex-clear-button"
                    disabled={codexRarity === "all" && codexSlot === "all"}
                    onClick={() => {
                      setCodexRarity("all");
                      setCodexSlot("all");
                    }}
                  >
                    清除篩選
                  </button>
                </div>
              </div>

              <div className="codex-result-summary">
                <span>目前顯示 {codexItems.length} / {RPG_EQUIPMENT_TEMPLATES.length} 件裝備</span>
                <span>{codexItems.filter(item => discoveredEquipmentNames.has(item.name)).length} 件已發現 · {codexItems.filter(item => !discoveredEquipmentNames.has(item.name)).length} 件未發現</span>
              </div>

              <div className="codex-grid">
                {codexItems.map(item => {
                  const discovered = discoveredEquipmentNames.has(item.name);
                  const collectionNumber = RPG_EQUIPMENT_TEMPLATES.indexOf(item) + 1;
                  return (
                    <article
                      className={`codex-card panel-card loot-${LOOT_RARITY_CLASS[item.rarity]} ${discovered ? "is-discovered" : "is-locked"}`}
                      key={`${item.name}-${item.slot}`}
                    >
                      <div className="codex-card-top">
                        <div className="codex-card-icon">
                          {discovered ? getTaskIcon(item.icon, 22) : <LockKeyhole size={19} />}
                        </div>
                        <div className="codex-card-meta">
                          <span className="codex-rarity-pill">{item.rarity}</span>
                          <small>#{String(collectionNumber).padStart(3, "0")}</small>
                        </div>
                      </div>
                      <div className="codex-card-copy">
                        <span>{item.weaponType ? `${item.weaponType} · ` : ""}{item.slot}{item.element ? ` · ${item.element}` : ""}{item.weaponType ? ` · ${getEquipmentRequiredJobClassName(item)}專用` : ""}</span>
                        <h3>{discovered ? item.name : "尚未發現的裝備"}</h3>
                        <p>{discovered ? item.description : "探索怪物區域或完成裝備合成，解鎖這張收藏卡的詳細資料。"}</p>
                        <div className="codex-bonus">
                          <small>{discovered ? "裝備效果" : "效果資訊"}</small>
                          <strong>{discovered ? item.bonus : "????????"}</strong>
                        </div>
                      </div>
                      <div className="codex-card-bottom">
                        <span>裝備等級 {discovered ? `Lv.${item.equipmentLevel}` : "?"}</span>
                        <strong>{discovered ? "已發現" : "尚未發現"}</strong>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {activePage === "monsterCodex" && (
            <section className="monster-codex-section" id="monster-codex">
              <div className="section-heading codex-heading">
                <div>
                  <div className="section-kicker">
                    <Skull size={15} /> MONSTER CODEX
                  </div>
                  <h2>怪物圖鑑</h2>
                  <p>收錄冒險區域的普通魔物與區域魔王；擊敗過的敵人會解鎖完整資料。</p>
                </div>
                <div className="codex-total-badge monster-codex-total-badge">
                  <strong>{monsterCodexEntries.length}</strong>
                  <span>種魔物</span>
                </div>
              </div>
              <div className="codex-progress-panel panel-card">
                <div className="codex-progress-copy">
                  <span className="mini-kicker">HUNTING PROGRESS</span>
                  <strong>
                    {monsterCodexDiscoveredCount} / {monsterCodexEntries.length} 已擊敗
                  </strong>
                  <small>擊敗過的魔物會在所有角色存檔中共用圖鑑進度。</small>
                </div>
                <div className="codex-progress-visual">
                  <strong>
                    {monsterCodexEntries.length
                      ? Math.round((monsterCodexDiscoveredCount / monsterCodexEntries.length) * 100)
                      : 0}%
                  </strong>
                  <div className="codex-progress-track" aria-label="怪物圖鑑完成度">
                    <span
                      style={{
                        width: `${monsterCodexEntries.length ? Math.round((monsterCodexDiscoveredCount / monsterCodexEntries.length) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="codex-toolbar panel-card monster-codex-toolbar">
                <div className="codex-toolbar-title">
                  <span className="mini-kicker">FILTER BESTIARY</span>
                  <strong>搜尋怪物資料</strong>
                  <small>可依名稱、描述或區域搜尋。</small>
                </div>
                <div className="codex-filters">
                  <label>
                    <span>搜尋</span>
                    <input
                      value={monsterCodexSearch}
                      onChange={event => setMonsterCodexSearch(event.target.value)}
                      placeholder="輸入怪物名稱"
                    />
                  </label>
                  <label>
                    <span>區域</span>
                    <select
                      value={monsterCodexRegion}
                      onChange={event => setMonsterCodexRegion(event.target.value)}
                    >
                      <option value="all">全部區域</option>
                      {monsterCodexRegions.map(region => (
                        <option value={region} key={region}>{region}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    className="codex-clear-button"
                    disabled={!monsterCodexSearch && monsterCodexRegion === "all"}
                    onClick={() => {
                      setMonsterCodexSearch("");
                      setMonsterCodexRegion("all");
                    }}
                  >
                    清除篩選
                  </button>
                </div>
              </div>
              <div className="codex-result-summary">
                <span>目前顯示 {filteredMonsterCodexEntries.length} / {monsterCodexEntries.length} 種魔物</span>
                <span>{filteredMonsterCodexEntries.filter(monster => monster.discovered).length} 種已擊敗 · {filteredMonsterCodexEntries.filter(monster => !monster.discovered).length} 種未擊敗</span>
              </div>
              <div className="monster-codex-grid">
                {filteredMonsterCodexEntries.map(monster => {
                  const Icon = monster.icon;
                  return (
                    <article
                      className={`monster-codex-card panel-card ${monster.isBoss ? "is-boss" : ""} ${monster.discovered ? "is-discovered" : "is-locked"}`}
                      key={monster.id}
                    >
                      <div className="monster-codex-card-top">
                        <div className="monster-codex-icon">
                          {monster.discovered ? <Icon size={22} /> : <LockKeyhole size={18} />}
                        </div>
                        <div>
                          <span className="monster-codex-region">{monster.region}</span>
                          <small>{monster.isBoss ? "區域魔王" : "普通魔物"}</small>
                        </div>
                      </div>
                      <div className="monster-codex-copy">
                        <h3>{monster.discovered ? monster.name : "尚未辨識的魔物"}</h3>
                        <p>{monster.discovered ? monster.description : "前往怪物區域挑戰並擊敗牠，解鎖詳細資料。"}</p>
                        {monster.discovered && monster.mechanicLabels.length > 0 && (
                          <div className="monster-codex-mechanics">
                            {monster.mechanicLabels.map(label => <span key={label}>{label}</span>)}
                          </div>
                        )}
                      </div>
                      <div className="monster-codex-card-bottom">
                        <span>{monster.discovered ? "資料已解鎖" : "資料鎖定"}</span>
                        <strong>{monster.discovered ? "已擊敗" : "未擊敗"}</strong>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {activePage === "loot" && (
            <section className="fusion-page" id="fusion">
              <div className="section-heading fusion-page-heading">
                <div>
                  <div className="section-kicker">
                    <Sparkles size={15} /> EQUIPMENT FORGE
                  </div>
                  <h2>裝備合成</h2>
                  <p>親自挑選素材，打造更高品質的下一件裝備。</p>
                </div>
                <div className="loot-count">
                  <strong>{selectedFusionItems.length}/3</strong>
                  <span>已選素材</span>
                </div>
              </div>

              <div className="fusion-rarity-guide panel-card">
                <div className="fusion-guide-title">
                  <span className="mini-kicker">RARITY ORDER</span>
                  <strong>品質稀有順序</strong>
                </div>
                <div className="fusion-rarity-steps" aria-label="品質稀有順序">
                  {LOOT_RARITIES.map(rarity => (
                    <span
                      className={`loot-fusion-rarity loot-${LOOT_RARITY_CLASS[rarity]}`}
                      key={`rarity-order-${rarity}`}
                    >
                      {rarity}
                    </span>
                  ))}
                </div>
                <p>
                  普通 → 精良 → 稀有 → 史詩 → 傳說 → 神話。選 3 件相同品質的未裝備裝備，可合成下一級；神話為最高品質。
                </p>
              </div>

              <div className="fusion-workbench">
                <div className="fusion-material-panel panel-card">
                  <div className="fusion-panel-heading">
                    <div>
                      <span className="mini-kicker">CHOOSE MATERIALS</span>
                      <h3>選擇合成裝備</h3>
                      <p>
                        {selectedFusionRarity
                          ? `目前選擇 ${selectedFusionRarity} 品質；請再選擇相同品質裝備。`
                          : "只能選擇同品質裝備；寶藏與已裝備物品不會列入。"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="fusion-clear-button"
                      disabled={selectedFusionItems.length === 0}
                      onClick={() => setSelectedFusionItemIds([])}
                    >
                      清除選擇
                    </button>
                  </div>

                  {selectableFusionItems.length === 0 ? (
                    <div className="loot-fusion-empty">
                      {inventory.some(item => item.kind === "equipment")
                        ? "目前沒有符合這個品質的未裝備裝備；請清除選擇或到戰利品庫更換裝備。"
                        : "目前沒有未裝備的裝備素材，先到戰利品庫取得裝備吧。"}
                      <button
                        type="button"
                        className="fusion-loot-link"
                        onClick={() => navigateTo("loot")}
                      >
                        前往戰利品庫 <ChevronRight size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="fusion-item-list">
                      {selectableFusionItems.map(item => {
                        const selected = selectedFusionItemIds.includes(item.id);
                        return (
                          <button
                            type="button"
                            className={`fusion-item-option ${selected ? "is-selected" : ""}`}
                            key={item.id}
                            aria-pressed={selected}
                            onClick={() => toggleFusionMaterial(item)}
                          >
                            <span className="fusion-item-check">
                              {selected ? <Check size={14} /> : getTaskIcon(item.icon, 15)}
                            </span>
                            <span className="fusion-item-copy">
                              <strong>{item.name}</strong>
                              <small>{item.slot} · {item.bonus}</small>
                            </span>
                            <span
                              className={`loot-fusion-rarity loot-${LOOT_RARITY_CLASS[item.rarity]}`}
                            >
                              {item.rarity}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <aside className="fusion-result-panel panel-card">
                  <div className="fusion-panel-heading">
                    <div>
                      <span className="mini-kicker">FORGE PREVIEW</span>
                      <h3>合成預覽</h3>
                    </div>
                    <div className="loot-fusion-icon">
                      <Sparkles size={18} />
                    </div>
                  </div>
                  <div className="fusion-selected-list">
                    {[0, 1, 2].map(index => {
                      const item = selectedFusionItems[index];
                      return (
                        <div
                          className={`fusion-selected-slot ${item ? "has-item" : ""}`}
                          key={`selected-fusion-${index}`}
                        >
                          <span>{index + 1}</span>
                          {item ? (
                            <>
                              <strong>{item.name}</strong>
                              <small>{item.slot} · {item.rarity}</small>
                            </>
                          ) : (
                            <small>選擇第 {index + 1} 件素材</small>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="fusion-outcome-preview">
                    <span>預計品質</span>
                    {selectedFusionRarity && nextLootRarity(selectedFusionRarity) ? (
                      <strong
                        className={`loot-fusion-rarity loot-${LOOT_RARITY_CLASS[nextLootRarity(selectedFusionRarity)!]}`}
                      >
                        {nextLootRarity(selectedFusionRarity)}
                      </strong>
                    ) : (
                      <strong>
                        {selectedFusionRarity === "神話" ? "最高品質" : "等待選擇素材"}
                      </strong>
                    )}
                    {selectedFusionItems.length === 3 && (
                      <small>
                        隨機部位：{selectedFusionItems.map(item => item.slot).join("、")} · 詞綴重新生成
                      </small>
                    )}
                  </div>
                  <button
                    type="button"
                    className="loot-fusion-button fusion-submit-button"
                    disabled={
                      selectedFusionItems.length !== 3 ||
                      !selectedFusionRarity ||
                      !nextLootRarity(selectedFusionRarity)
                    }
                    onClick={fuseSelectedEquipment}
                  >
                    <Sparkles size={15} />
                    {selectedFusionRarity === "神話"
                      ? "神話已達最高級"
                      : "合成所選裝備"}
                  </button>
                </aside>
              </div>
            </section>
          )}

          {activePage === "rewards" && (
            <section className="rewards-section" id="rewards">
              <div className="section-heading rewards-heading">
                <div>
                  <div className="section-kicker">
                    <Gift size={15} /> REWARD VAULT
                  </div>
                  <h2>獎勵寶庫</h2>
                  <p>把努力換成真正想要的休息與小確幸。</p>
                </div>
                <button className="secondary-button" onClick={openNewReward}>
                  <Plus size={17} /> 自訂獎勵
                </button>
              </div>
              <div className="reward-grid">
                {state.rewards.map(reward => {
                  const canRedeem = state.coins >= reward.cost;
                  return (
                    <div
                      className={`reward-card panel-card ${canRedeem ? "" : "reward-locked"}`}
                      key={reward.id}
                    >
                      <div className="reward-card-top">
                        <div className="reward-icon">
                          <Gift size={21} />
                        </div>
                        <div className="reward-card-actions">
                          <button
                            className="reward-edit"
                            aria-label={`編輯${reward.title}`}
                            onClick={() => openEditReward(reward)}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="reward-delete"
                            aria-label={`刪除${reward.title}`}
                            onClick={() => deleteReward(reward)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <h3>{reward.title}</h3>
                      <p>{reward.description}</p>
                      <div className="reward-card-bottom">
                        <span className="cost">
                          <Coins size={15} /> {reward.cost}
                        </span>
                        <button
                          className={`redeem-button ${canRedeem ? "can-redeem" : ""}`}
                          disabled={!canRedeem}
                          onClick={() => redeemReward(reward)}
                        >
                          {canRedeem ? "兌換" : "金幣不足"}
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <section className="reward-history panel-card" aria-labelledby="reward-history-title">
                <div className="reward-history-heading">
                  <div>
                    <div className="section-kicker">
                      <ScrollText size={14} /> REDEMPTION LOG
                    </div>
                    <h3 id="reward-history-title">兌換歷史</h3>
                    <p>查看目前角色過去兌換過的獎勵與花費金幣。</p>
                  </div>
                  <strong>{state.rewardRedemptions.length} 筆紀錄</strong>
                </div>
                <label className="reward-history-search">
                  <Search size={15} />
                  <span className="sr-only">搜尋兌換歷史</span>
                  <input
                    type="search"
                    value={rewardHistoryQuery}
                    onChange={event => setRewardHistoryQuery(event.target.value)}
                    placeholder="搜尋獎勵名稱"
                  />
                </label>
                {filteredRewardRedemptions.length === 0 ? (
                  <div className="reward-history-empty">
                    <ScrollText size={20} />
                    <span>
                      {state.rewardRedemptions.length === 0
                        ? "目前還沒有兌換紀錄"
                        : "找不到符合的兌換紀錄"}
                    </span>
                  </div>
                ) : (
                  <div className="reward-history-list">
                    {filteredRewardRedemptions.map(entry => (
                      <div className="reward-history-row" key={entry.id}>
                        <div className="reward-history-icon">
                          <Gift size={16} />
                        </div>
                        <div className="reward-history-copy">
                          <strong>{entry.title}</strong>
                          <small>{formatRewardRedemptionDate(entry.redeemedAt)}</small>
                        </div>
                        <span className="reward-history-cost">
                          <Coins size={14} /> -{entry.cost}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </section>
          )}

          {activePage === "timers" && (
            <section
              className={`timer-page ${state.runningTimer ? "is-timer-running" : ""}`}
              id="timers"
            >
              <div className="section-heading timer-page-heading">
                <div>
                  <div className="section-kicker">
                    <Clock3 size={15} /> FOCUS TRACKER
                  </div>
                  <h2>事務計時器</h2>
                  <p>專注每一分鐘，讓工作、學習與日常事務持續累積 XP。</p>
                </div>
                <div className="timer-points-badge">
                  <span>可用能力點</span>
                  <strong>{state.abilityPoints}</strong>
                </div>
              </div>

              <div className="timer-rule-note">
                <Sparkles size={17} />
                <p>
                  今日計時每天 00:00 依裝置本地時區歸零；正在運行的計時器不中斷，午夜後從零累積今日時間。歷次紀錄與已獲能力點永久保留。
                  每項事務每完整累積 1 分鐘固定獲得 1 XP，另有一次獨立的 5% 機會獲得 1 點能力點。獎勵進度與未滿一分鐘的秒數不受每日顯示歸零影響；所有角色存檔與瀏覽器分頁共用計時鎖，同一時間只計時一項事務。
                  {activeTimerProfile &&
                    ` 目前「${activeTimerProfile.name}」存檔${activeTimerProfileActivity ? ` 的「${activeTimerProfileActivity.name}」` : ""}正在計時；請在持有計時鎖的分頁停止後再開始其他事務。`}
                </p>
              </div>

              <section className="pomodoro-settings panel-card">
                <div className="pomodoro-settings-heading">
                  <div>
                    <span className="mini-kicker">POMODORO MODE</span>
                    <h3>番茄鐘進階模式</h3>
                    <p>完成一輪專注可獲得 +{POMODORO_ROUND_XP} XP；休息階段會暫停一般計時獎勵並禁止開始戰鬥。</p>
                  </div>
                  <label className="pomodoro-toggle">
                    <input
                      type="checkbox"
                      checked={state.pomodoroSettings.enabled}
                      disabled={Boolean(state.runningTimer)}
                      onChange={event => updatePomodoroSettings({ enabled: event.target.checked })}
                    />
                    <span>啟用</span>
                  </label>
                </div>
                <div className="pomodoro-controls">
                  <label>
                    <span>專注／短休息</span>
                    <select
                      value={
                        state.pomodoroSettings.focusMinutes === 25 && state.pomodoroSettings.shortBreakMinutes === 5
                          ? "25-5"
                          : state.pomodoroSettings.focusMinutes === 50 && state.pomodoroSettings.shortBreakMinutes === 10
                            ? "50-10"
                            : "custom"
                      }
                      disabled={Boolean(state.runningTimer)}
                      onChange={event => selectPomodoroPreset(event.target.value as "25-5" | "50-10" | "custom")}
                    >
                      <option value="25-5">25／5</option>
                      <option value="50-10">50／10</option>
                      <option value="custom">自訂週期</option>
                    </select>
                  </label>
                  <label>
                    <span>專注分鐘</span>
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={state.pomodoroSettings.focusMinutes}
                      disabled={Boolean(state.runningTimer)}
                      onChange={event => updatePomodoroSettings({ focusMinutes: Number(event.target.value) })}
                    />
                  </label>
                  <label>
                    <span>短休息分鐘</span>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={state.pomodoroSettings.shortBreakMinutes}
                      disabled={Boolean(state.runningTimer)}
                      onChange={event => updatePomodoroSettings({ shortBreakMinutes: Number(event.target.value) })}
                    />
                  </label>
                  <label>
                    <span>長休息分鐘</span>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={state.pomodoroSettings.longBreakMinutes}
                      disabled={Boolean(state.runningTimer)}
                      onChange={event => updatePomodoroSettings({ longBreakMinutes: Number(event.target.value) })}
                    />
                  </label>
                  <label>
                    <span>幾輪後長休息</span>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={state.pomodoroSettings.roundsBeforeLongBreak}
                      disabled={Boolean(state.runningTimer)}
                      onChange={event => updatePomodoroSettings({ roundsBeforeLongBreak: Number(event.target.value) })}
                    />
                  </label>
                </div>
                <label className="pomodoro-auto-start">
                  <input
                    type="checkbox"
                    checked={state.pomodoroSettings.autoStartNextPhase}
                    disabled={Boolean(state.runningTimer)}
                    onChange={event => updatePomodoroSettings({ autoStartNextPhase: event.target.checked })}
                  />
                  <span>階段結束後自動開始下一階段</span>
                </label>
              </section>

              {state.runningTimer && runningTimerActivity && (
                <div className="timer-mobile-live panel-card">
                  <div className="timer-mobile-live-copy">
                    <span>
                      <span className="timer-live-dot" /> 手機即時計時
                      {state.runningTimer.pomodoro &&
                        ` · ${pomodoroPhaseLabel(state.runningTimer.pomodoro.phase)}`}
                    </span>
                    <strong>{runningTimerActivity.name}</strong>
                    <small>
                      {state.runningTimer.pomodoro
                        ? state.runningTimer.pomodoro.phase === "focus"
                          ? `完成一輪獲得 +${POMODORO_ROUND_XP} XP · 支援的裝置會保持螢幕喚醒`
                          : "休息期間禁止開始戰鬥 · 支援的裝置會保持螢幕喚醒"
                        : "網頁內即時更新 · 支援的裝置會保持螢幕喚醒"}
                    </small>
                  </div>
                  <strong className="timer-mobile-live-clock">
                    {state.runningTimer.pomodoro
                      ? formatTimerDuration(
                          getPomodoroPhaseElapsed(state.runningTimer.pomodoro, currentTime)
                        )
                      : formatTimerDuration(
                          getTimerTodaySeconds(
                            runningTimerActivity,
                            state.runningTimer,
                            currentTime
                          )
                        )}
                  </strong>
                </div>
              )}

              <div className="timer-summary-grid">
                <div className="timer-summary-card">
                  <span>今日專注時間 · 00:00 歸零</span>
                  <strong>{formatTimerDuration(totalTimerSeconds)}</strong>
                </div>
                <div className="timer-summary-card">
                  <span>今日完成番茄鐘輪次</span>
                  <strong>{todayPomodoroRounds} 輪</strong>
                </div>
                <div className="timer-summary-card">
                  <span>角色目前總 XP</span>
                  <strong>{state.totalXp}</strong>
                </div>
                <div className="timer-summary-card">
                  <span>歷來計時 XP</span>
                  <strong>+{totalTimerXp} XP</strong>
                </div>
                <div className="timer-summary-card">
                  <span>歷來計時獲得能力點</span>
                  <strong>+{totalTimerAbilityPoints}</strong>
                </div>
              </div>

              <form
                className="timer-create-form panel-card"
                onSubmit={event => {
                  event.preventDefault();
                  addTimerActivity();
                }}
              >
                <label htmlFor="timer-activity-name">新增要追蹤的事務</label>
                <div className="timer-create-controls">
                  <input
                    id="timer-activity-name"
                    value={timerNameDraft}
                    maxLength={40}
                    onChange={event => setTimerNameDraft(event.target.value)}
                    placeholder="例如：讀書、寫程式、運動"
                  />
                  <button
                    type="submit"
                    className="primary-button timer-create-button"
                    disabled={!timerNameDraft.trim()}
                  >
                    <Plus size={16} /> 建立事務
                  </button>
                </div>
              </form>

              {state.timerActivities.length === 0 ? (
                <div className="timer-empty-state panel-card">
                  <Clock3 size={26} />
                  <strong>還沒有追蹤中的事務</strong>
                  <span>先建立一項事務，就能開始累積時間與能力點機會。</span>
                </div>
              ) : (
                <div className="timer-activity-list">
                  {state.timerActivities.map(activity => {
                    const isRunning =
                      state.runningTimer?.activityId === activity.id;
                    const anotherTimerRunning =
                      !isRunning &&
                      (state.runningTimer !== null || anyProfileTimerRunning);
                    const displaySeconds = getTimerTodaySeconds(
                      activity,
                      state.runningTimer,
                      currentTime
                    );
                    const allSessions = activity.sessions.slice().reverse();
                    return (
                      <article
                        className={`timer-activity-card panel-card ${isRunning ? "is-running" : ""}`}
                        key={activity.id}
                      >
                        <div className="timer-activity-heading">
                          <div className="timer-activity-icon">
                            <Clock3 size={18} />
                          </div>
                          <div className="timer-activity-name">
                            <h3>{activity.name}</h3>
                            <span>
                              {isRunning
                                ? timerLockOwned
                                  ? "正在計時 · 本分頁管理"
                                  : "另一分頁正在管理計時"
                                : "已保存"}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="timer-delete-button"
                            aria-label={`刪除${activity.name}與其計時紀錄`}
                            disabled={anyProfileTimerRunning}
                            onClick={() => deleteTimerActivity(activity)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="timer-activity-total">
                          <span>今日累積時間 · 每天 00:00 歸零</span>
                          <strong>{formatTimerDuration(displaySeconds)}</strong>
                        </div>

                        <div className="timer-activity-metrics">
                          <div>
                            <span>歷來完整分鐘</span>
                            <strong>{activity.xpEarned}</strong>
                          </div>
                          <div>
                            <span>歷來計時 XP</span>
                            <strong>+{activity.xpEarned}</strong>
                          </div>
                          <div>
                            <span>歷來獲得能力點</span>
                            <strong>+{activity.abilityPointsEarned}</strong>
                          </div>
                          <div>
                            <span>歷來計時時段</span>
                            <strong>{activity.sessions.length}</strong>
                          </div>
                        </div>

                        {isRunning && state.runningTimer && (
                          <div className="timer-live-reward">
                            {state.runningTimer.pomodoro ? (
                              <>
                                <span>
                                  {pomodoroPhaseLabel(state.runningTimer.pomodoro.phase)}階段 ·
                                  已完成 {state.runningTimer.pomodoro.completedRounds} 輪
                                </span>
                                <strong>
                                  本段 +{state.runningTimer.xpEarned} XP ·
                                  {state.runningTimer.pomodoro.phase === "focus"
                                    ? `完成後獲得 +${POMODORO_ROUND_XP} XP`
                                    : "休息中不可開始戰鬥"}
                                </strong>
                                {!state.pomodoroSettings.autoStartNextPhase &&
                                  getPomodoroPhaseElapsed(
                                    state.runningTimer.pomodoro,
                                    currentTime
                                  ) >= state.runningTimer.pomodoro.phaseDurationSeconds && (
                                    <button
                                      type="button"
                                      className="timer-phase-button"
                                      onClick={advancePomodoroPhase}
                                    >
                                      進入下一階段
                                    </button>
                                  )}
                              </>
                            ) : (
                              <>
                                <span>
                                  本段已完成 {state.runningTimer.xpEarned} 個完整分鐘
                                </span>
                                <strong>
                                  {timerLockOwned
                                    ? `本段 +${state.runningTimer.xpEarned} XP · +${state.runningTimer.abilityPointsEarned} 能力點`
                                    : "由持鎖分頁結算 XP 與能力點"}
                                </strong>
                              </>
                            )}
                          </div>
                        )}

                        <button
                          type="button"
                          className={
                            isRunning
                              ? "timer-stop-button"
                              : "primary-button timer-start-button"
                          }
                          disabled={
                            anotherTimerRunning || (isRunning && !timerLockOwned)
                          }
                          onClick={() =>
                            isRunning
                              ? stopActivityTimer()
                              : startActivityTimer(activity.id)
                          }
                        >
                          {isRunning
                            ? timerLockOwned
                              ? "停止並保存此段"
                              : "其他分頁管理中"
                            : anotherTimerRunning
                              ? "另一角色或分頁計時中"
                              : "開始計時"}
                        </button>

                        <details className="timer-history-details">
                          <summary>全部歷史紀錄（{activity.sessions.length}）</summary>
                          {allSessions.length === 0 ? (
                            <p className="timer-history-empty">停止計時後，這裡會保留每段紀錄。</p>
                          ) : (
                            <div className="timer-history-list">
                              {allSessions.map(session => (
                                <div className="timer-history-row" key={session.id}>
                                  <div>
                                    <strong>
                                      {new Date(session.startedAt).toLocaleString(
                                        "zh-TW",
                                        {
                                          month: "2-digit",
                                          day: "2-digit",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        }
                                      )}
                                    </strong>
                                    <span>
                                      XP +{session.xpEarned} · 抽取 {session.rewardChecks} 次 ·
                                      能力點 +{session.abilityPointsEarned}
                                    </span>
                                  </div>
                                  <b>{formatTimerDuration(session.durationSeconds)}</b>
                                </div>
                              ))}
                            </div>
                          )}
                        </details>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          <footer className="quest-footer">
            <span>
              <span className="footer-logo">
                <Sword size={14} />
              </span>{" "}
              QuestBoard
            </span>
            <span>你的日常，也值得一場史詩冒險。</span>
            <span className="footer-status">
              <span /> 本地進度已保存
            </span>
          </footer>
        </div>
      </main>

      {state.runningTimer && runningTimerActivity && (
        <FloatingTimer
          activity={runningTimerActivity}
          runningTimer={state.runningTimer}
          currentTime={currentTime}
          expanded={floatingTimerExpanded}
          onToggleExpanded={() => setFloatingTimerExpanded(value => !value)}
          onOpenTimerPage={() => {
            navigateTo("timers");
            setFloatingTimerExpanded(true);
          }}
          onStop={stopActivityTimer}
        />
      )}

      {setupOpen && (
        <div className="setup-backdrop">
          <div className="setup-card" role="dialog" aria-modal="true">
            <div className="setup-symbol">
              <Sparkles size={25} />
            </div>
            <span className="mini-kicker">CREATE YOUR FIRST SAVE</span>
            <h2>建立第一個存檔</h2>
            <p>
              先命名存檔並選擇職業。職業一旦確定就會鎖定，只能建立新的存檔重新選擇。
            </p>
            <label className="setup-name-label">
              冒險名稱
              <input
                autoFocus
                value={setupName}
                maxLength={24}
                onChange={event => setSetupName(event.target.value)}
                placeholder="例如：Mira 的冒險"
              />
            </label>
            <div className="setup-job-grid">
              {(Object.keys(jobClasses) as JobClass[]).map(jobClass => (
                <button
                  type="button"
                  key={jobClass}
                  className={setupJobClass === jobClass ? "is-selected" : ""}
                  onClick={() => setSetupJobClass(jobClass)}
                >
                  {getTaskIcon(jobClasses[jobClass].icon, 22)}
                  <strong>{jobClasses[jobClass].name}</strong>
                  <span>{jobClasses[jobClass].description}</span>
                  <small>
                    生命 +{jobClasses[jobClass].bonuses.health} · 力量 +
                    {jobClasses[jobClass].bonuses.strength} · 防禦 +
                    {jobClasses[jobClass].bonuses.defense} · 智力 +
                    {jobClasses[jobClass].bonuses.intelligence}
                  </small>
                </button>
              ))}
            </div>
            <button
              className="primary-button setup-submit"
              onClick={completeSetup}
            >
              開始任務冒險 <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}

      {newProfileSetupOpen && (
        <div
          className="setup-backdrop"
          onClick={event => {
            if (event.target === event.currentTarget)
              setNewProfileSetupOpen(false);
          }}
        >
          <div className="setup-card" role="dialog" aria-modal="true">
            <button
              type="button"
              className="setup-dismiss"
              onClick={() => setNewProfileSetupOpen(false)}
              aria-label="取消建立新存檔"
            >
              <X size={18} />
            </button>
            <div className="setup-symbol">
              <Sparkles size={25} />
            </div>
            <span className="mini-kicker">NEW SAVE PROFILE</span>
            <h2>建立新的冒險存檔</h2>
            <p>
              新存檔會從零開始遊玩。請選擇職業；建立後該存檔的職業將永久鎖定。
            </p>
            <label className="setup-name-label">
              存檔名稱
              <input
                autoFocus
                value={setupName}
                maxLength={24}
                onChange={event => setSetupName(event.target.value)}
                placeholder="例如：法師的新旅程"
              />
            </label>
            <div className="setup-job-grid">
              {(Object.keys(jobClasses) as JobClass[]).map(jobClass => (
                <button
                  type="button"
                  key={jobClass}
                  className={setupJobClass === jobClass ? "is-selected" : ""}
                  onClick={() => setSetupJobClass(jobClass)}
                >
                  {getTaskIcon(jobClasses[jobClass].icon, 22)}
                  <strong>{jobClasses[jobClass].name}</strong>
                  <span>{jobClasses[jobClass].description}</span>
                  <small>{jobClasses[jobClass].levelUpSummary}</small>
                </button>
              ))}
            </div>
            <button
              className="primary-button setup-submit"
              onClick={completeNewProfileSetup}
            >
              建立存檔並開始冒險 <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-message">
          <div className="toast-icon">
            <Sparkles size={16} />
          </div>
          <span>{toast}</span>
          {undoAction ? (
            <button
              type="button"
              className="toast-undo-button"
              onClick={() => undoAction.restore()}
            >
              {undoAction.label}
            </button>
          ) : null}
          <button
            aria-label="關閉提示"
            onClick={() => {
              clearUndoAction();
              setToast(null);
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {battle && activeBattleMonster && (
        <div
          className="battle-backdrop"
          onClick={event => {
            if (
              battle.outcome !== "fighting" &&
              event.target === event.currentTarget
            ) {
              setBattle(null);
            }
          }}
        >
          <div
            className="battle-card"
            role="dialog"
            aria-modal="true"
          >
            <div className="battle-header">
              <div>
                <span className="mini-kicker">TURN-BASED COMBAT</span>
                <h2>
                  {battle.outcome === "victory"
                    ? "戰鬥勝利"
                    : battle.outcome === "defeat"
                      ? "戰鬥失敗"
                      : `對戰：${activeBattleMonster.name}`}
                </h2>
              </div>
              {battle.outcome !== "fighting" && (
                <button
                  className="modal-close"
                  onClick={() => setBattle(null)}
                  aria-label="關閉戰鬥報告"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <div className="battle-arena">
              <div className={`battle-unit player-unit ${battleFx?.playerDefeated ? "is-defeated" : ""}`}>
                <span className="battle-unit-label">
                  {state.userName || "冒險者"} · LV. {player.level}
                </span>
                <strong>{battle.playerHealth}</strong>
                <div className="battle-hp-track">
                  <span
                    style={{
                      width: `${Math.max(0, Math.min(100, (battle.playerHealth / effectiveAbilities.health) * 100))}%`,
                    }}
                  />
                </div>
                <small>/ {effectiveAbilities.health} 生命</small>
              </div>
              <div className="battle-vs"><span>VS</span><i /></div>
              <div className={`battle-unit enemy-unit ${battleFx?.monsterDefeated ? "is-defeated" : ""}`}>
                <span className="battle-unit-label">
                  {activeBattleMonster.name} · LV. {activeBattleMonster.level}
                </span>
                <strong>{battle.monsterHealth}</strong>
                <div className="battle-hp-track">
                  <span
                    style={{
                      width: `${Math.max(0, Math.min(100, (battle.monsterHealth / activeBattleMonster.health) * 100))}%`,
                    }}
                  />
                </div>
                <small>/ {activeBattleMonster.health} 生命</small>
              </div>
            </div>
            <div className="battle-turn-label">
              {battle.outcome === "fighting"
                ? `第 ${battle.turn} 回合`
                : "戰鬥統計報告"}
            </div>
            {battle.monsterStatuses.length > 0 && (
              <div className="battle-status-row" aria-label="怪物異常狀態">
                {battle.monsterStatuses.map(status => (
                  <span className={`battle-status battle-status-${status.kind}`} key={status.kind}>
                    {status.element}·{status.kind} · {status.turnsRemaining} 回合
                    {status.damagePerTurn > 0
                      ? ` · 每回合 ${status.damagePerTurn} 傷害`
                      : status.kind === "冰凍" || status.kind === "石化"
                        ? " · 無法反擊"
                        : " · 持續中"}
                  </span>
                ))}
              </div>
            )}
            {battle.outcome === "fighting" && (
              <div className="battle-player-effects" aria-label="角色目前戰鬥效果">
                <span className="battle-effects-label">你的目前效果</span>
                {temporaryBattleBuff && (
                  <span className="battle-effect battle-effect-buff">
                    <strong>
                      {battleSpecialSkills.find(
                        skill => skill.id === temporaryBattleBuff.skillId
                      )?.name ?? "戰鬥增益"}
                    </strong>
                    <small>{temporaryBattleBuff.turnsRemaining} 回合</small>
                    {temporaryBattleBuff.damageBonusPercent > 0 && (
                      <small>傷害 +{temporaryBattleBuff.damageBonusPercent}%</small>
                    )}
                    {temporaryBattleBuff.damageReductionPercent > 0 && (
                      <small>減傷 +{temporaryBattleBuff.damageReductionPercent}%</small>
                    )}
                    {temporaryBattleBuff.dodgeRateBonusPercent > 0 && (
                      <small>閃避 +{temporaryBattleBuff.dodgeRateBonusPercent}%</small>
                    )}
                    {temporaryBattleBuff.healPercentMaxHealth > 0 && (
                      <small>每回合恢復 {temporaryBattleBuff.healPercentMaxHealth}% 生命</small>
                    )}
                  </span>
                )}
                {(battle.actionLockTurns ?? 0) > 0 && (
                  <span className="battle-effect battle-effect-debuff">
                    <strong>終焉狙殺反噬</strong>
                    <small>{battle.actionLockTurns} 回合</small>
                    <small>停滯，無法使用技能</small>
                  </span>
                )}
                {isArcher && state.archerDodgeFailStacks > 0 && (
                  <span className="battle-effect battle-effect-buff">
                    <strong>游擊本能</strong>
                    <small>{state.archerDodgeFailStacks} 層</small>
                    <small>攻擊 +{archerTalentBonuses.attackPercent}%</small>
                    <small>閃避 +{archerTalentBonuses.dodgePercent}%</small>
                  </span>
                )}
                {!temporaryBattleBuff &&
                  (battle.actionLockTurns ?? 0) === 0 &&
                  (!isArcher || state.archerDodgeFailStacks === 0) && (
                    <span className="battle-effects-empty">目前沒有增益或負面效果</span>
                  )}
              </div>
            )}
            <div className="battle-log">
              {battle.logs.slice(-5).map((log, index) => (
                <div className="battle-log-row" key={`${log}-${index}`}>
                  <span>▸</span>
                  {log}
                </div>
              ))}
            </div>
            {isArcher && (
              <div className="archer-battle-talent">
                <span>游擊本能 · 累積 {state.archerDodgeFailStacks} 層</span>
                <strong>
                  攻擊 +{archerTalentBonuses.attackPercent}% · 額外閃避 +
                  {archerTalentBonuses.dodgePercent}%
                </strong>
              </div>
            )}
            {battle.outcome === "fighting" ? (
              <>
                {battleSpecialSkills.some(skill => skill.effectType !== "passive") && (
                  <div className="battle-skill-panel">
                    <div className="battle-skill-heading">
                      <strong>職業特殊技能</strong>
                        <small>技能可重複使用；每項技能依設定進入冷卻</small>
                    </div>
                    <div className="battle-skill-list">
                    {battleSpecialSkills.filter(skill => skill.effectType !== "passive").map(skill => {
                        const cooldown = battle.skillCooldowns[skill.id] ?? 0;
                        return (
                          <button
                            type="button"
                            className="battle-skill-button"
                            key={skill.id}
                            disabled={cooldown > 0 || (battle.actionLockTurns ?? 0) > 0}
                            onClick={() => runBattleTurn(skill.id)}
                            aria-label={`使用${skill.name}，${skill.description}`}
                          >
                            <span>
                              <strong>{skill.name}</strong>
                              <small>
                                {skill.effectType === "buff" ? "攻防增益" : `${skill.damageMultiplier.toFixed(2)}×${skill.damageType}`}
                              </small>
                              {skill.statusEffect && (
                                <small className="skill-element-effect">
                                  {skill.statusEffect.element}元素 · {skill.statusEffect.kind} ·
                                  {Math.round(skill.statusEffect.chance * 100)}% ·
                                  {skill.statusEffect.durationTurns}回合
                                  {skill.statusEffect.damagePerTurn > 0
                                    ? ` · 每回合 ${skill.statusEffect.damagePerTurn} 傷害`
                                    : skill.statusEffect.damagePercentOfSkill
                                      ? ` · 每回合該技能 ${skill.statusEffect.damagePercentOfSkill}% 傷害`
                                        : skill.statusEffect.kind === "冰凍" || skill.statusEffect.kind === "石化"
                                        ? " · 無法反擊"
                                        : " · 持續中"}
                                </small>
                              )}
                            </span>
                            <small>{cooldown > 0 ? `冷卻 ${cooldown} 回合` : skill.effectType === "buff" ? `持續 ${skill.durationTurns} 回合` : `破防 ${skill.defensePiercePercent}%`}</small>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <button
                  className="primary-button battle-action-button"
                  onClick={() => runBattleTurn()}
                >
                  {(battle.actionLockTurns ?? 0) > 0 ? "停滯中 · 跳過本回合" : `普通攻擊 · 第 ${battle.turn} 回合`} <ChevronRight size={16} />
                </button>
              </>
            ) : (
              <>
                <div className="battle-report-grid">
                  <div>
                    <span>回合數</span>
                    <strong>{battle.turn - 1}</strong>
                  </div>
                  <div>
                    <span>造成傷害</span>
                    <strong>{battle.damageDealt}</strong>
                  </div>
                  <div>
                    <span>承受傷害</span>
                    <strong>{battle.damageTaken}</strong>
                  </div>
                  <div>
                    <span>暴擊／閃避</span>
                    <strong>
                      {battle.criticalHits}／{battle.dodges}
                    </strong>
                  </div>
                  <div>
                    <span>XP 結果</span>
                    <strong>
                      {battle.xpReward ? `+${battle.xpReward}` : "0"}
                    </strong>
                  </div>
                  <div>
                    <span>金幣結果</span>
                    <strong>
                      {battle.outcome === "victory"
                        ? `+${activeBattleMonster.reward}`
                        : "−50%"}
                    </strong>
                  </div>
                </div>
                <div
                  className={`battle-loot-result ${battle.lootDrop ? "has-loot" : ""}`}
                >
                  {battle.lootDrop ? (
                    <>
                      <span>戰利品掉落</span>
                    <strong>{battle.lootDrop.name}</strong>
                    <small>
                      {battle.lootDrop.rarity} · {battle.lootDrop.kind === "equipment" ? battle.lootDrop.bonus : `出售可得 ${battle.lootDrop.sellValue} 金幣`}
                      {battle.lootDrop.affixes?.length
                        ? ` · 詞綴：${battle.lootDrop.affixes.map(affix => `${affix.name}（${affix.description}）`).join("、")}`
                        : ""}
                    </small>
                    </>
                  ) : (
                    <>
                      <span>戰利品掉落</span>
                      <strong>這次沒有新掉落</strong>
                      <small>再挑戰其他怪物試試</small>
                    </>
                  )}
                </div>
                <button
                  className="primary-button battle-action-button"
                  onClick={() => setBattle(null)}
                >
                  關閉戰鬥報告 <Check size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {weeklyReportOpen && (
        <div
          className="weekly-report-backdrop"
          onClick={event => {
            if (event.target !== event.currentTarget) return;
            setState(previous => ({
              ...previous,
              weeklyStats: {
                ...previous.weeklyStats,
                reportShownWeekKey: previous.weeklyStats.weekKey,
              },
            }));
            setWeeklyReportOpen(false);
          }}
        >
          <div className="weekly-report-card" role="dialog" aria-modal="true">
            <div className="weekly-report-header">
              <div className="weekly-report-symbol">
                <CalendarDays size={22} />
              </div>
              <div>
                <span className="mini-kicker">WEEKLY ADVENTURE REPORT</span>
                <h2>本週冒險統計</h2>
                <p>每週一 00:00 至週日 23:59 的累積成果</p>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => {
                  setState(previous => ({
                    ...previous,
                    weeklyStats: {
                      ...previous.weeklyStats,
                      reportShownWeekKey: previous.weeklyStats.weekKey,
                    },
                  }));
                  setWeeklyReportOpen(false);
                }}
                aria-label="關閉每週統計"
              >
                <X size={18} />
              </button>
            </div>
            <div className="weekly-report-grid">
              <div>
                <CheckCircle2 size={17} />
                <span>完成任務</span>
                <strong>{state.weeklyStats.tasksCompleted}</strong>
                <small>個任務</small>
              </div>
              <div>
                <Skull size={17} />
                <span>打倒魔物</span>
                <strong>{state.weeklyStats.monstersDefeated}</strong>
                <small>隻魔物</small>
              </div>
              <div>
                <Trophy size={17} />
                <span>升級</span>
                <strong>{state.weeklyStats.levelsGained}</strong>
                <small>個等級</small>
              </div>
              <div>
                <Coins size={17} />
                <span>獲得金幣</span>
                <strong>{state.weeklyStats.coinsEarned}</strong>
                <small>枚金幣</small>
              </div>
              <div>
                <Sparkles size={17} />
                <span>能力增加</span>
                <strong>
                  {Object.values(state.weeklyStats.abilitiesGained).reduce(
                    (total, value) => total + value,
                    0
                  )}
                </strong>
                <small>點屬性</small>
              </div>
            </div>
            <div className="weekly-report-abilities">
              <span>能力增加明細</span>
              <div>
                <b>生命 +{state.weeklyStats.abilitiesGained.health}</b>
                <b>力量 +{state.weeklyStats.abilitiesGained.strength}</b>
                <b>防禦 +{state.weeklyStats.abilitiesGained.defense}</b>
                <b>智力 +{state.weeklyStats.abilitiesGained.intelligence}</b>
              </div>
            </div>
            <button
              type="button"
              className="primary-button weekly-report-submit"
              onClick={() => {
                setState(previous => ({
                  ...previous,
                  weeklyStats: {
                    ...previous.weeklyStats,
                    reportShownWeekKey: previous.weeklyStats.weekKey,
                  },
                }));
                setWeeklyReportOpen(false);
              }}
            >
              收下本週成果 <Check size={16} />
            </button>
          </div>
        </div>
      )}

      {modal && (
        <div
          className="modal-backdrop"
          onClick={event => {
            if (event.target === event.currentTarget) setModal(null);
          }}
        >
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div>
                <span className="mini-kicker">
                  {modal.kind === "task"
                    ? "NEW QUEST"
                    : modal.kind === "profile"
                      ? "PROFILE SETTINGS"
                    : modal.kind === "refresh"
                        ? "REFRESH SETTINGS"
                        : modal.kind === "notifications"
                          ? "MOBILE APP"
                        : modal.kind === "saves"
                          ? "SAVE PROFILES"
                          : modal.kind === "reward" && modal.rewardId
                            ? "EDIT REWARD"
                            : "NEW REWARD"}
                </span>
                <h2>
                  {modal.kind === "task"
                    ? modal.taskId
                      ? "編輯任務"
                      : "加入新任務"
                    : modal.kind === "profile"
                      ? "使用者設定"
                      : modal.kind === "refresh"
                        ? "調整刷新時間"
                        : modal.kind === "notifications"
                          ? "手機 App 與通知"
                        : modal.kind === "saves"
                          ? "冒險存檔"
                          : modal.kind === "reward" && modal.rewardId
                            ? "編輯獎勵"
                            : "建立自訂獎勵"}
                </h2>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setModal(null)}
                aria-label="關閉"
              >
                <X size={18} />
              </button>
            </div>
            {modal.kind === "notifications" ? (
              <div className="modal-form notification-settings-form">
                <div className="profile-setting-note">
                  <Bell size={20} />
                  <span>
                    {notificationPermission === "granted"
                      ? "此裝置已允許 QuestBoard 顯示通知。"
                      : notificationPermission === "denied"
                        ? "通知目前被瀏覽器拒絕，請至網站權限重新允許。"
                        : "允許通知後，在手機上接收每日任務提醒。"}
                  </span>
                </div>
                <label className="setting-toggle-row">
                  <span>
                    <strong>手機通知</strong>
                    <small>每日刷新時間提醒未完成任務</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={notificationSettings.enabled && notificationPermission === "granted"}
                    onChange={() => {
                      if (notificationPermission !== "granted") {
                        void requestNotificationAccess();
                      } else {
                        setNotificationSettings(previous => ({
                          ...previous,
                          enabled: !previous.enabled,
                        }));
                      }
                    }}
                  />
                </label>
                <label className="setting-toggle-row">
                  <span>
                    <strong>每日任務提醒</strong>
                    <small>使用目前設定的每日刷新時間</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={notificationSettings.dailyTaskReminder}
                    disabled={!notificationSettings.enabled || notificationPermission !== "granted"}
                    onChange={event =>
                      setNotificationSettings(previous => ({
                        ...previous,
                        dailyTaskReminder: event.target.checked,
                      }))
                    }
                  />
                </label>
                <small className="form-help">
                  通知使用瀏覽器權限與本機 Service Worker；若瀏覽器限制背景執行，請重新開啟 QuestBoard 以接收最新提醒。
                </small>
                <div className="save-manager-actions">
                  {notificationPermission !== "granted" && (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => void requestNotificationAccess()}
                      disabled={notificationPermission === "unsupported"}
                    >
                      <Bell size={15} /> 允許手機通知
                    </button>
                  )}
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => void installQuestBoard()}
                  >
                    加入手機主畫面
                  </button>
                </div>
              </div>
            ) : modal.kind === "saves" ? (
              <div className="modal-form save-manager-form">
                <label>
                  目前存檔名稱
                  <input
                    autoFocus
                    maxLength={24}
                    value={saveNameDraft}
                    onChange={event => setSaveNameDraft(event.target.value)}
                    placeholder="例如：主線冒險"
                  />
                </label>
                <div className="save-manager-actions">
                  <button
                    className="primary-button"
                    onClick={saveCurrentProfile}
                  >
                    <Check size={15} /> 保存目前進度
                  </button>
                  <button
                    className="secondary-button"
                    disabled={state.runningTimer !== null}
                    onClick={startNewProfileSetup}
                  >
                    <Plus size={15} />
                    {state.runningTimer ? "先停止計時" : "建立新存檔"}
                  </button>
                </div>
                <div className="save-profile-list">
                  {profiles.map(profile => (
                    <div
                      className={`save-profile-row ${profile.id === activeProfileId ? "is-active" : ""}`}
                      key={profile.id}
                    >
                      <div>
                        <strong>{profile.name}</strong>
                        <span>
                          LV.{getPlayerStats(profile.state.totalXp).level} ·{" "}
                          {profile.state.totalXp.toLocaleString()} XP ·{" "}
                          {jobClasses[profile.state.jobClass]?.name ?? "冒險者"}
                        </span>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="save-switch-button"
                          disabled={
                            profile.id === activeProfileId ||
                            state.runningTimer !== null
                          }
                          onClick={() => switchProfile(profile)}
                        >
                          {profile.id === activeProfileId
                            ? "使用中"
                            : state.runningTimer
                              ? "先停止計時"
                              : "載入"}
                        </button>
                        <button
                          type="button"
                          className="save-delete-button"
                          disabled={
                            profile.id === activeProfileId &&
                            state.runningTimer !== null
                          }
                          onClick={() => deleteProfile(profile)}
                          aria-label={`刪除${profile.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <small className="form-help">
                  每個存檔會獨立保存任務、職業、等級、能力、裝備與獎勵。
                </small>
              </div>
            ) : modal.kind === "task" ? (
              <div className="modal-form">
                <label>
                  任務名稱
                  <input
                    autoFocus
                    value={taskDraft.title}
                    onChange={event =>
                      setTaskDraft(draft => ({
                        ...draft,
                        title: event.target.value,
                      }))
                    }
                    placeholder="例如：整理房間 15 分鐘"
                  />
                </label>
                <div className="form-two-col">
                  <label>
                    類別
                    <select
                      value={taskDraft.category}
                      onChange={event =>
                        setTaskDraft(draft => ({
                          ...draft,
                          category: event.target.value as Category,
                        }))
                      }
                    >
                      {["工作", "學習", "健康", "生活", "心情"].map(
                        category => (
                          <option key={category}>{category}</option>
                        )
                      )}
                    </select>
                  </label>
                  <label>
                    難度
                    <select
                      value={taskDraft.difficulty}
                      onChange={event =>
                        setTaskDraft(draft => ({
                          ...draft,
                          difficulty: event.target.value as TaskDifficulty,
                        }))
                      }
                    >
                      {["輕量", "標準", "挑戰"].map(difficulty => (
                        <option key={difficulty}>{difficulty}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  重複週期
                  <select
                    value={taskDraft.repeat}
                    onChange={event =>
                      setTaskDraft(draft => ({
                        ...draft,
                        repeat: event.target.value as TaskRepeat,
                      }))
                    }
                  >
                    <option value="none">不重複</option>
                    <option value="daily">每天重複</option>
                    <option value="weekly">每週重複</option>
                  </select>
                  <small className="form-help">
                    每週任務會在每週一的刷新時間恢復未完成。
                  </small>
                </label>
                <label>
                  任務圖示
                  <div className="icon-picker">
                    {iconOptions.map(icon => (
                      <button
                        type="button"
                        key={icon}
                        className={taskDraft.icon === icon ? "selected" : ""}
                        onClick={() =>
                          setTaskDraft(draft => ({ ...draft, icon }))
                        }
                      >
                        {getTaskIcon(icon, 17)}
                      </button>
                    ))}
                  </div>
                </label>
                <div className="modal-reward-preview">
                  <Zap size={15} /> 完成後可獲得{" "}
                  <strong>
                    +
                    {taskDraft.difficulty === "輕量"
                      ? 35
                      : taskDraft.difficulty === "挑戰"
                        ? 85
                        : 55}{" "}
                    XP
                  </strong>{" "}
                  與{" "}
                  <strong>
                    +
                    {taskDraft.difficulty === "輕量"
                      ? 20
                      : taskDraft.difficulty === "挑戰"
                        ? 45
                        : 30}{" "}
                    金幣
                  </strong>
                </div>
                <button
                  className="primary-button modal-submit"
                  onClick={saveTask}
                >
                  {modal.taskId ? "保存變更" : "加入冒險盤"}
                  <ChevronRight size={16} />
                </button>
              </div>
            ) : modal.kind === "profile" ? (
              <div className="modal-form">
                <label>
                  使用者名稱
                  <input
                    autoFocus
                    value={profileDraft}
                    maxLength={24}
                    onChange={event => setProfileDraft(event.target.value)}
                    placeholder="例如：Mira Chen"
                  />
                  <small className="form-help">
                    名稱會同步顯示在冒險者狀態、側邊欄與右上角頭像。
                  </small>
                </label>
                <div className="profile-setting-note">
                  <div className="avatar avatar-preview">
                    {getInitials(profileDraft)}
                  </div>
                  <span>{profileDraft.trim() || "預覽名稱"}</span>
                </div>
                <button
                  type="button"
                  className="primary-button modal-submit"
                  onClick={saveProfileSettings}
                >
                  保存使用者名稱 <Check size={16} />
                </button>
              </div>
            ) : modal.kind === "refresh" ? (
              <div className="modal-form">
                <label>
                  每日刷新時間
                  <input
                    autoFocus
                    type="time"
                    value={refreshDraft}
                    onChange={event => setRefreshDraft(event.target.value)}
                  />
                  <small className="form-help">
                    時間到會刪除九宮格內全部任務，再將「每天重複」任務重新生成到九宮格；累積 XP、計時資料與九宮格外任務會保留。
                  </small>
                </label>
                <div className="refresh-setting-note">
                  <Clock3 size={16} />
                  <span>
                    目前設定：每天 {formatResetTime(state.dailyResetMinutes)}{" "}
                    刷新任務
                  </span>
                </div>
                <button
                  className="primary-button modal-submit"
                  onClick={saveRefreshSettings}
                >
                  保存刷新時間 <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="modal-form">
                <label>
                  獎勵名稱
                  <input
                    autoFocus
                    value={rewardDraft.title}
                    onChange={event =>
                      setRewardDraft(draft => ({
                        ...draft,
                        title: event.target.value,
                      }))
                    }
                    placeholder="例如：買一杯喜歡的飲料"
                  />
                </label>
                <label>
                  獎勵描述
                  <textarea
                    value={rewardDraft.description}
                    onChange={event =>
                      setRewardDraft(draft => ({
                        ...draft,
                        description: event.target.value,
                      }))
                    }
                    placeholder="完成後，讓自己開心一下"
                    rows={3}
                  />
                </label>
                <label>
                  需要金幣
                  <input
                    type="number"
                    min="1"
                    value={rewardDraft.cost}
                    onChange={event =>
                      setRewardDraft(draft => ({
                        ...draft,
                        cost: event.target.value,
                      }))
                    }
                  />
                </label>
                <button
                  className="primary-button modal-submit"
                  onClick={saveReward}
                >
                  {modal.kind === "reward" && modal.rewardId ? "保存獎勵設定" : "放入獎勵寶庫"} <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
