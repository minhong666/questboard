export type AchievementProgressState = {
  tasks: Array<{ completed: boolean }>;
  totalXp: number;
  abilityLevel: number;
  abilities: { strength: number };
  streak: number;
  defeatedMonsterIds: string[];
  timerActivities: Array<{ totalSeconds: number }>;
  jobClass: "warrior" | "archer" | "mage" | "rogue";
};

export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first-task",
    title: "踏出第一步",
    description: "完成第一個任務。",
    icon: "check",
  },
  {
    id: "xp-1000",
    title: "經驗累積者",
    description: "累積 1,000 XP。",
    icon: "sparkles",
  },
  {
    id: "level-10",
    title: "第十級冒險者",
    description: "角色達到 Lv.10。",
    icon: "star",
  },
  {
    id: "focus-60",
    title: "專注一小時",
    description: "累積 60 分鐘事務計時。",
    icon: "clock",
  },
  {
    id: "streak-7",
    title: "七日連勝",
    description: "連續完成任務 7 天。",
    icon: "flame",
  },
  {
    id: "first-victory",
    title: "初戰告捷",
    description: "擊敗第一隻怪物。",
    icon: "skull",
  },
  {
    id: "warrior-strength-100",
    title: "百鍊戰士",
    description: "以戰士身分達到力量 100 點。",
    icon: "sword",
  },
];

export function getAchievementProgress(state: AchievementProgressState) {
  const totalTimerSeconds = state.timerActivities.reduce(
    (total, activity) => total + Math.max(0, activity.totalSeconds),
    0
  );
  return {
    "first-task": state.tasks.some(task => task.completed),
    "xp-1000": state.totalXp >= 1_000,
    "level-10": state.abilityLevel >= 10,
    "focus-60": totalTimerSeconds >= 60 * 60,
    "streak-7": state.streak >= 7,
    "first-victory": state.defeatedMonsterIds.length > 0,
    "warrior-strength-100":
      state.jobClass === "warrior" && state.abilities.strength >= 100,
  } as Record<string, boolean>;
}

export function getNewAchievementIds(
  state: AchievementProgressState,
  unlockedIds: string[] = []
) {
  const unlocked = new Set(unlockedIds);
  const progress = getAchievementProgress(state);
  return ACHIEVEMENTS.filter(
    achievement => progress[achievement.id] && !unlocked.has(achievement.id)
  ).map(achievement => achievement.id);
}

export function normalizeAchievementIds(value: unknown) {
  if (!Array.isArray(value)) return [];
  const validIds = new Set(ACHIEVEMENTS.map(achievement => achievement.id));
  return Array.from(
    new Set(
      value.filter(
        (id): id is string => typeof id === "string" && validIds.has(id)
      )
    )
  );
}
