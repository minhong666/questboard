export type AchievementContext = {
  completedTasks: number;
  totalXp: number;
  timerSeconds: number;
  streak: number;
  defeatedMonsters: number;
  inventoryItems: number;
  unlockedSkills: number;
  skillUpgradeLevels: number;
};

export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  category: "任務" | "成長" | "專注" | "戰鬥" | "收藏";
  goal: number;
  rewardCoins: number;
  rewardSkillPoints?: number;
  icon: string;
  getValue: (context: AchievementContext) => number;
  formatProgress: (value: number, goal: number) => string;
};

const integerProgress = (value: number, goal: number) => `${Math.min(value, goal)} / ${goal}`;
const minutesProgress = (value: number, goal: number) =>
  `${Math.min(Math.floor(value / 60), goal)} / ${goal} 分鐘`;

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first-quest",
    title: "冒險啟程",
    description: "完成第一個任務，踏出你的第一步。",
    category: "任務",
    goal: 1,
    rewardCoins: 30,
    icon: "target",
    getValue: context => context.completedTasks,
    formatProgress: integerProgress,
  },
  {
    id: "quest-master",
    title: "任務達人",
    description: "累積完成 20 個任務。",
    category: "任務",
    goal: 20,
    rewardCoins: 120,
    rewardSkillPoints: 1,
    icon: "check",
    getValue: context => context.completedTasks,
    formatProgress: integerProgress,
  },
  {
    id: "xp-hunter",
    title: "經驗獵人",
    description: "累積獲得 1,000 XP。",
    category: "成長",
    goal: 1000,
    rewardCoins: 100,
    icon: "sparkles",
    getValue: context => context.totalXp,
    formatProgress: integerProgress,
  },
  {
    id: "focus-hour",
    title: "專注一小時",
    description: "透過事務計時累積 60 分鐘。",
    category: "專注",
    goal: 60,
    rewardCoins: 80,
    rewardSkillPoints: 1,
    icon: "clock",
    getValue: context => context.timerSeconds,
    formatProgress: minutesProgress,
  },
  {
    id: "unbroken-will",
    title: "不滅意志",
    description: "維持 7 天連勝。",
    category: "成長",
    goal: 7,
    rewardCoins: 120,
    icon: "flame",
    getValue: context => context.streak,
    formatProgress: (value, goal) => `${Math.min(value, goal)} / ${goal} 天`,
  },
  {
    id: "monster-hunter",
    title: "魔物獵人",
    description: "擊敗 3 隻不同的魔物。",
    category: "戰鬥",
    goal: 3,
    rewardCoins: 100,
    icon: "skull",
    getValue: context => context.defeatedMonsters,
    formatProgress: integerProgress,
  },
  {
    id: "skill-collector",
    title: "技能收藏家",
    description: "解鎖 4 項職業技能。",
    category: "收藏",
    goal: 4,
    rewardCoins: 150,
    rewardSkillPoints: 1,
    icon: "zap",
    getValue: context => context.unlockedSkills,
    formatProgress: integerProgress,
  },
  {
    id: "skill-awakening",
    title: "技能覺醒",
    description: "完成第一次技能升級。",
    category: "成長",
    goal: 1,
    rewardCoins: 50,
    icon: "award",
    getValue: context => context.skillUpgradeLevels,
    formatProgress: integerProgress,
  },
  {
    id: "loot-collector",
    title: "戰利品收藏家",
    description: "收集 5 件戰利品或裝備。",
    category: "收藏",
    goal: 5,
    rewardCoins: 100,
    icon: "gift",
    getValue: context => context.inventoryItems,
    formatProgress: integerProgress,
  },
];

export function getAchievementProgress(
  achievement: AchievementDefinition,
  context: AchievementContext
) {
  const value = Math.max(0, Math.floor(achievement.getValue(context)));
  return {
    value,
    goal: achievement.goal,
    completed: value >= achievement.goal,
    label: achievement.formatProgress(value, achievement.goal),
  };
}
