export type AchievementContext = {
  completedTasks: number;
  totalXp: number;
  timerSeconds: number;
  streak: number;
  defeatedMonsters: number;
  inventoryItems: number;
  unlockedSkills: number;
  skillUpgradeLevels: number;
  playerLevel?: number;
  coins?: number;
  defeatedFinalBoss?: boolean;
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
const minutesCountProgress = (value: number, goal: number) =>
  `${Math.min(value, goal)} / ${goal} 分鐘`;
const daysProgress = (value: number, goal: number) =>
  `${Math.min(value, goal)} / ${goal} 天`;
const levelProgress = (value: number, goal: number) =>
  `Lv.${Math.min(value, goal)} / Lv.${goal}`;
const coinsProgress = (value: number, goal: number) =>
  `${Math.min(value, goal)} / ${goal} 金幣`;

type MilestoneSeries = {
  prefix: string;
  names: string[];
  category: AchievementDefinition["category"];
  icon: string;
  goals: number[];
  unit: string;
  getValue: (context: AchievementContext) => number;
  formatProgress: AchievementDefinition["formatProgress"];
  rewardCoins: number[];
  rewardSkillPoints?: (number | undefined)[];
};

function createMilestoneSeries(series: MilestoneSeries): AchievementDefinition[] {
  return series.goals.map((goal, index) => ({
    id: `${series.prefix}-${goal}`,
    title: series.names[index],
    description: `累積${goal}${series.unit}。`,
    category: series.category,
    goal,
    rewardCoins: series.rewardCoins[index],
    rewardSkillPoints: series.rewardSkillPoints?.[index],
    icon: series.icon,
    getValue: series.getValue,
    formatProgress: series.formatProgress,
  }));
}

const EXTRA_ACHIEVEMENTS: AchievementDefinition[] = [
  ...createMilestoneSeries({
    prefix: "milestone-tasks",
    names: ["任務征服者", "任務遠征軍", "任務統帥", "任務傳奇", "任務不朽者"],
    category: "任務",
    icon: "check",
    goals: [50, 100, 250, 500, 1000],
    unit: "個任務",
    getValue: context => context.completedTasks,
    formatProgress: integerProgress,
    rewardCoins: [180, 240, 320, 450, 650],
    rewardSkillPoints: [undefined, 1, undefined, 2, 3],
  }),
  ...createMilestoneSeries({
    prefix: "milestone-xp",
    names: ["經驗掠奪者", "成長先鋒", "冒險菁英", "傳奇旅者", "世界級冒險家"],
    category: "成長",
    icon: "sparkles",
    goals: [2500, 5000, 10000, 25000, 50000],
    unit: " XP",
    getValue: context => context.totalXp,
    formatProgress: integerProgress,
    rewardCoins: [180, 240, 330, 480, 700],
    rewardSkillPoints: [undefined, 1, 1, 2, 3],
  }),
  ...createMilestoneSeries({
    prefix: "milestone-focus",
    names: ["專注學徒", "專注行者", "深度工作者", "心流大師", "專注賢者"],
    category: "專注",
    icon: "clock",
    goals: [10, 30, 60, 120, 300],
    unit: "分鐘專注",
    getValue: context => Math.floor(context.timerSeconds / 60),
    formatProgress: minutesCountProgress,
    rewardCoins: [160, 220, 300, 430, 620],
    rewardSkillPoints: [undefined, 1, undefined, 2, 3],
  }),
  ...createMilestoneSeries({
    prefix: "milestone-streak",
    names: ["雙週不墜", "月度堅持者", "鐵血自律者", "百日誓約", "永燃之火"],
    category: "成長",
    icon: "flame",
    goals: [14, 30, 60, 100, 180],
    unit: "天連勝",
    getValue: context => context.streak,
    formatProgress: daysProgress,
    rewardCoins: [220, 300, 420, 580, 850],
    rewardSkillPoints: [1, undefined, 2, 3, 4],
  }),
  ...createMilestoneSeries({
    prefix: "milestone-monsters",
    names: ["獵魔老手", "魔物剋星", "戰場清道夫", "魔王追獵者", "深淵終結者"],
    category: "戰鬥",
    icon: "skull",
    goals: [10, 25, 50, 100, 200],
    unit: "隻魔物",
    getValue: context => context.defeatedMonsters,
    formatProgress: integerProgress,
    rewardCoins: [180, 260, 360, 520, 780],
    rewardSkillPoints: [undefined, 1, 1, 2, 3],
  }),
  ...createMilestoneSeries({
    prefix: "milestone-loot",
    names: ["戰利品掠奪者", "寶庫看守人", "裝備收藏家", "傳奇鑑賞家", "神話寶庫主"],
    category: "收藏",
    icon: "gift",
    goals: [10, 20, 30, 40, 50],
    unit: "件戰利品",
    getValue: context => context.inventoryItems,
    formatProgress: integerProgress,
    rewardCoins: [180, 250, 340, 480, 720],
    rewardSkillPoints: [undefined, 1, undefined, 2, 3],
  }),
  ...createMilestoneSeries({
    prefix: "milestone-skills",
    names: ["技能研習者", "技能專家", "技能大師", "全系通曉", "技能宗師"],
    category: "收藏",
    icon: "zap",
    goals: [8, 12, 16, 20, 24],
    unit: "項已解鎖技能",
    getValue: context => context.unlockedSkills,
    formatProgress: integerProgress,
    rewardCoins: [200, 280, 380, 540, 800],
    rewardSkillPoints: [1, undefined, 2, 2, 4],
  }),
  ...createMilestoneSeries({
    prefix: "milestone-upgrades",
    names: ["磨練之路", "技能鍛造師", "精通開端", "極限突破", "百鍊成鋼"],
    category: "成長",
    icon: "award",
    goals: [5, 10, 20, 35, 50],
    unit: "級技能升級",
    getValue: context => context.skillUpgradeLevels,
    formatProgress: integerProgress,
    rewardCoins: [180, 250, 350, 500, 760],
    rewardSkillPoints: [undefined, 1, 1, 2, 3],
  }),
  ...createMilestoneSeries({
    prefix: "milestone-level",
    names: ["進階冒險者", "老練冒險者", "菁英冒險者", "傳奇等級", "巔峰之境"],
    category: "成長",
    icon: "trophy",
    goals: [10, 20, 30, 50, 75],
    unit: "級角色等級",
    getValue: context => context.playerLevel ?? 0,
    formatProgress: levelProgress,
    rewardCoins: [180, 260, 380, 600, 900],
    rewardSkillPoints: [undefined, 1, 2, 3, 5],
  }),
  ...createMilestoneSeries({
    prefix: "milestone-coins",
    names: ["小有積蓄", "金幣獵手", "財寶管家", "富饒領主", "黃金帝國"],
    category: "成長",
    icon: "coins",
    goals: [1000, 2500, 5000, 10000, 25000],
    unit: "枚金幣持有",
    getValue: context => context.coins ?? 0,
    formatProgress: coinsProgress,
    rewardCoins: [150, 220, 320, 500, 800],
    rewardSkillPoints: [undefined, 1, undefined, 2, 4],
  }),
];

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
    formatProgress: daysProgress,
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
  {
    id: "ending",
    title: "結局",
    description: "擊敗最終魔王，完成冒險的最後試煉。",
    category: "戰鬥",
    goal: 1,
    rewardCoins: 1000,
    rewardSkillPoints: 5,
    icon: "trophy",
    getValue: context => (context.defeatedFinalBoss ? 1 : 0),
    formatProgress: (value, goal) => `${Math.min(value, goal)} / ${goal}`,
  },
  ...EXTRA_ACHIEVEMENTS,
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
