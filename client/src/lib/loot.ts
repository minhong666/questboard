import {
  RPG_EQUIPMENT_TEMPLATES,
  type WeaponElement,
  type WeaponType,
} from "./equipment-database";

export { RPG_EQUIPMENT_BENCHMARKS } from "./equipment-database";

export const LOOT_RARITIES = ["普通", "精良", "稀有", "史詩", "傳說", "神話"] as const;
export type LootRarity = (typeof LOOT_RARITIES)[number];

export const EQUIPMENT_SLOTS = ["頭盔", "胸甲", "武器", "護腿", "護身符"] as const;
export type EquipmentSlot = (typeof EQUIPMENT_SLOTS)[number];

export type EquipmentJobClass = "warrior" | "archer" | "mage" | "rogue";

export const WEAPON_JOB_CLASS: Record<WeaponType, EquipmentJobClass> = {
  短刀: "rogue",
  法杖: "mage",
  劍: "warrior",
  弓: "archer",
};

export const EQUIPMENT_JOB_CLASS_NAME: Record<EquipmentJobClass, string> = {
  warrior: "戰士",
  archer: "弓箭手",
  mage: "法師",
  rogue: "盜賊",
};

export const LOOT_RARITY_CLASS: Record<LootRarity, string> = {
  普通: "common",
  精良: "fine",
  稀有: "rare",
  史詩: "epic",
  傳說: "legendary",
  神話: "mythic",
};

export type EquipmentAffixStat =
  | "health"
  | "strength"
  | "defense"
  | "intelligence"
  | "critRate"
  | "critDamage"
  | "dodgeRate";
export type EquipmentAffixBonuses = Partial<Record<EquipmentAffixStat, number>>;
export type EquipmentAffix = {
  name: string;
  description: string;
  bonuses: EquipmentAffixBonuses;
};
export type TreasureAffix = {
  name: string;
  description: string;
  saleBonusPercent: number;
};

export type EquipmentItem = {
  id: string;
  kind: "equipment";
  name: string;
  setId?: string;
  slot: EquipmentSlot;
  weaponType?: WeaponType;
  element?: WeaponElement;
  rarity: LootRarity;
  description: string;
  bonus: string;
  icon: string;
  affixes?: EquipmentAffix[];
  equipmentLevel?: number;
};

export type EquipmentSetBonus = {
  pieces: 2 | 4;
  label: string;
  description: string;
  bonuses: Partial<Record<EquipmentAffixStat | "castSpeedPercent" | "damageReductionPercent" | "magicPenetrationPercent", number>>;
};

export type EquipmentSetDefinition = {
  id: string;
  name: string;
  description: string;
  bonuses: EquipmentSetBonus[];
};

const equipmentSetThemes: Array<{
  id: string;
  name: string;
  description: string;
  two: { label: string; bonuses: Partial<Record<EquipmentAffixStat | "castSpeedPercent" | "damageReductionPercent" | "magicPenetrationPercent", number>> };
  four: { label: string; bonuses: Partial<Record<EquipmentAffixStat | "castSpeedPercent" | "damageReductionPercent" | "magicPenetrationPercent", number>> };
}> = [
  {
    id: "dawn-warden",
    name: "曙光聖衛",
    description: "以堅定防線守住每一個黎明。",
    two: { label: "曙光誓約", bonuses: { health: 60, defense: 8 } },
    four: { label: "聖衛壁壘", bonuses: { health: 60, defense: 8, damageReductionPercent: 10 } },
  },
  {
    id: "moon-stalker",
    name: "影月獵行",
    description: "在月影與寂靜中追獵目標。",
    two: { label: "月影步", bonuses: { strength: 10, dodgeRate: 3 } },
    four: { label: "無聲獵殺", bonuses: { strength: 10, dodgeRate: 6, critRate: 5 } },
  },
  {
    id: "astral-sage",
    name: "星界賢者",
    description: "讓群星的知識流入每一次施法。",
    two: { label: "星軌共鳴", bonuses: { intelligence: 12, castSpeedPercent: 4 } },
    four: { label: "萬象洞悉", bonuses: { intelligence: 12, castSpeedPercent: 6, magicPenetrationPercent: 10 } },
  },
  {
    id: "titan-bastion",
    name: "鐵壁巨神",
    description: "以巨神之軀承受最猛烈的衝擊。",
    two: { label: "巨神鎧意", bonuses: { health: 100, defense: 10 } },
    four: { label: "不動壁壘", bonuses: { health: 220, defense: 24 } },
  },
  {
    id: "storm-sword",
    name: "風暴劍魂",
    description: "以雷霆力量撕裂敵人的防線。",
    two: { label: "雷霆蓄勢", bonuses: { strength: 12, critRate: 3 } },
    four: { label: "風暴連斬", bonuses: { strength: 13, critRate: 6, critDamage: 15 } },
  },
  {
    id: "azure-dragon",
    name: "蒼龍天命",
    description: "承接蒼龍血脈，均衡駕馭各種戰局。",
    two: { label: "蒼龍血脈", bonuses: { health: 20, strength: 3, defense: 3, intelligence: 3 } },
    four: { label: "天命覺醒", bonuses: { health: 30, strength: 5, defense: 5, intelligence: 5, critDamage: 8 } },
  },
];

const setRarityMultiplier: Record<LootRarity, number> = {
  普通: 1,
  精良: 1.25,
  稀有: 1.5,
  史詩: 1.75,
  傳說: 2.5,
  神話: 3.5,
};

const setBonusLabels: Record<EquipmentAffixStat | "castSpeedPercent" | "damageReductionPercent" | "magicPenetrationPercent", { label: string; unit: string }> = {
  health: { label: "生命", unit: "" },
  strength: { label: "力量", unit: "" },
  defense: { label: "防禦", unit: "" },
  intelligence: { label: "智力", unit: "" },
  critRate: { label: "暴擊率", unit: "%" },
  critDamage: { label: "暴擊傷害", unit: "%" },
  dodgeRate: { label: "閃避率", unit: "%" },
  castSpeedPercent: { label: "施法速度", unit: "%" },
  damageReductionPercent: { label: "受到傷害", unit: "%" },
  magicPenetrationPercent: { label: "魔法穿透", unit: "%" },
};

function scaleSetBonuses(
  bonuses: Partial<Record<EquipmentAffixStat | "castSpeedPercent" | "damageReductionPercent" | "magicPenetrationPercent", number>>,
  multiplier: number
) {
  return Object.fromEntries(
    Object.entries(bonuses).map(([stat, value]) => [
      stat,
      Math.max(1, Math.round((value ?? 0) * multiplier)),
    ])
  ) as Partial<Record<EquipmentAffixStat | "castSpeedPercent" | "damageReductionPercent" | "magicPenetrationPercent", number>>;
}

function describeSetBonuses(
  bonuses: Partial<Record<EquipmentAffixStat | "castSpeedPercent" | "damageReductionPercent" | "magicPenetrationPercent", number>>
) {
  return Object.entries(bonuses)
    .map(([stat, value]) => {
      const info = setBonusLabels[stat as EquipmentAffixStat | "castSpeedPercent" | "damageReductionPercent" | "magicPenetrationPercent"];
      const sign = stat === "damageReductionPercent" ? "−" : "+";
      return `${info.label} ${sign}${value}${info.unit}`;
    })
    .join(" · ");
}

export const EQUIPMENT_SET_DEFINITIONS: EquipmentSetDefinition[] = LOOT_RARITIES.flatMap(
  rarity =>
    equipmentSetThemes.map(theme => {
      const multiplier = setRarityMultiplier[rarity];
      const twoBonuses = scaleSetBonuses(theme.two.bonuses, multiplier);
      const fourBonuses = scaleSetBonuses(theme.four.bonuses, multiplier);
      return {
        id: `${theme.id}-${rarity}`,
        name: `${theme.name}·${rarity}`,
        description: `${theme.description}本套裝為${rarity}階系列。`,
        bonuses: [
          { pieces: 2 as const, label: theme.two.label, description: describeSetBonuses(twoBonuses), bonuses: twoBonuses },
          { pieces: 4 as const, label: theme.four.label, description: describeSetBonuses(fourBonuses), bonuses: fourBonuses },
        ],
      };
    })
);

export type ActiveEquipmentSet = EquipmentSetDefinition & {
  equippedCount: number;
  activeBonuses: EquipmentSetBonus[];
};

export function getEquipmentSetBonuses(items: EquipmentItem[]): {
  abilities: Required<Pick<EquipmentAffixBonuses, "health" | "strength" | "defense" | "intelligence">>;
  combat: Required<Pick<EquipmentAffixBonuses, "critRate" | "critDamage" | "dodgeRate">> & { castSpeedPercent: number; damageReductionPercent: number; magicPenetrationPercent: number };
  activeSets: ActiveEquipmentSet[];
} {
  const abilities = { health: 0, strength: 0, defense: 0, intelligence: 0 };
  const combat = { critRate: 0, critDamage: 0, dodgeRate: 0, castSpeedPercent: 0, damageReductionPercent: 0, magicPenetrationPercent: 0 };
  const counts = new Map<string, number>();
  for (const item of items) {
    if (item.setId) counts.set(item.setId, (counts.get(item.setId) ?? 0) + 1);
  }

  const activeSets = EQUIPMENT_SET_DEFINITIONS.flatMap(set => {
    const equippedCount = counts.get(set.id) ?? 0;
    if (equippedCount < 2) return [];
    const activeBonuses = set.bonuses.filter(bonus => equippedCount >= bonus.pieces);
    for (const bonus of activeBonuses) {
      abilities.health += bonus.bonuses.health ?? 0;
      abilities.strength += bonus.bonuses.strength ?? 0;
      abilities.defense += bonus.bonuses.defense ?? 0;
      abilities.intelligence += bonus.bonuses.intelligence ?? 0;
      combat.critRate += bonus.bonuses.critRate ?? 0;
      combat.critDamage += bonus.bonuses.critDamage ?? 0;
      combat.dodgeRate += bonus.bonuses.dodgeRate ?? 0;
      combat.castSpeedPercent += bonus.bonuses.castSpeedPercent ?? 0;
      combat.damageReductionPercent += bonus.bonuses.damageReductionPercent ?? 0;
      combat.magicPenetrationPercent += bonus.bonuses.magicPenetrationPercent ?? 0;
    }
    return [{ ...set, equippedCount, activeBonuses }];
  });

  return { abilities, combat, activeSets };
}

export function getEquipmentRequiredJobClass(
  item: Pick<EquipmentItem, "slot" | "weaponType" | "name">
): EquipmentJobClass | null {
  const weaponType = getEquipmentWeaponType(item);
  return weaponType ? WEAPON_JOB_CLASS[weaponType] : null;
}

export function getEquipmentWeaponType(
  item: Pick<EquipmentItem, "slot" | "weaponType" | "name">
): WeaponType | null {
  if (item.slot !== "武器") return null;
  if (item.weaponType && item.weaponType in WEAPON_JOB_CLASS) {
    return item.weaponType;
  }
  if (item.name.includes("短刀")) return "短刀";
  if (item.name.includes("法杖")) return "法杖";
  if (item.name.includes("弓")) return "弓";
  return "劍";
}

export function canEquipEquipment(
  item: Pick<EquipmentItem, "slot" | "weaponType" | "name">,
  jobClass: EquipmentJobClass
) {
  const requiredJobClass = getEquipmentRequiredJobClass(item);
  return requiredJobClass === null || requiredJobClass === jobClass;
}

export function getEquipmentRequiredJobClassName(
  item: Pick<EquipmentItem, "slot" | "weaponType" | "name">
) {
  const requiredJobClass = getEquipmentRequiredJobClass(item);
  return requiredJobClass ? EQUIPMENT_JOB_CLASS_NAME[requiredJobClass] : null;
}

export type TreasureItem = {
  id: string;
  kind: "treasure";
  name: string;
  slot: "寶藏";
  rarity: LootRarity;
  description: string;
  sellValue: number;
  icon: string;
  affixes?: TreasureAffix[];
};

export type LootItem = EquipmentItem | TreasureItem;

export type LootMonster = {
  level: number;
  isBoss?: boolean;
};

export type LootRarityDistribution = Record<LootRarity, number>;
export type LootProbabilitySummary = {
  dropChance: number;
  equipmentChance: number;
  treasureChance: number;
  noDropChance: number;
  equipmentRarities: LootRarityDistribution;
  treasureRarities: LootRarityDistribution;
};

const ordinaryLootDropChance = 0.65;
const equipmentDropChance = 0.65;

const rarityRank: Record<LootRarity, number> = {
  普通: 0,
  精良: 1,
  稀有: 2,
  史詩: 3,
  傳說: 4,
  神話: 5,
};

const rarityPower: Record<LootRarity, number> = {
  普通: 1,
  精良: 1.25,
  稀有: 1.6,
  史詩: 2.1,
  傳說: 3,
  神話: 4.5,
};

const affixCountByRarity: Record<LootRarity, number> = {
  普通: 0,
  精良: 1,
  稀有: 1,
  史詩: 2,
  傳說: 2,
  神話: 3,
};

const equipmentAffixStats: EquipmentAffixStat[] = [
  "health",
  "strength",
  "defense",
  "intelligence",
  "critRate",
  "critDamage",
  "dodgeRate",
];

const equipmentAffixLabels: Record<
  EquipmentAffixStat,
  { label: string; unit: string }
> = {
  health: { label: "生命", unit: "" },
  strength: { label: "力量", unit: "" },
  defense: { label: "防禦", unit: "" },
  intelligence: { label: "智力", unit: "" },
  critRate: { label: "暴擊率", unit: "%" },
  critDamage: { label: "暴擊傷害", unit: "%" },
  dodgeRate: { label: "閃避率", unit: "%" },
};

const equipmentAffixTemplates: EquipmentAffix[] = [
  {
    name: "堅韌",
    description: "生命上限提升",
    bonuses: { health: 6 },
  },
  {
    name: "鋒銳",
    description: "攻擊力量提升",
    bonuses: { strength: 1 },
  },
  {
    name: "守護",
    description: "防禦能力提升",
    bonuses: { defense: 1 },
  },
  {
    name: "睿智",
    description: "魔法智力提升",
    bonuses: { intelligence: 1 },
  },
  {
    name: "精準",
    description: "暴擊機率提升",
    bonuses: { critRate: 1 },
  },
  {
    name: "破軍",
    description: "暴擊傷害提升",
    bonuses: { critDamage: 5 },
  },
  {
    name: "迅捷",
    description: "閃避機率提升",
    bonuses: { dodgeRate: 1 },
  },
];

const treasureAffixByRarity: Partial<Record<LootRarity, TreasureAffix>> = {
  精良: {
    name: "鍍金",
    description: "收藏家願意多付 10% 金幣",
    saleBonusPercent: 10,
  },
  稀有: {
    name: "珍藏",
    description: "收藏家願意多付 15% 金幣",
    saleBonusPercent: 15,
  },
  史詩: {
    name: "遠古",
    description: "收藏家願意多付 25% 金幣",
    saleBonusPercent: 25,
  },
  傳說: {
    name: "王室印記",
    description: "收藏家願意多付 40% 金幣",
    saleBonusPercent: 40,
  },
  神話: {
    name: "龍神祝福",
    description: "收藏家願意多付 60% 金幣",
    saleBonusPercent: 60,
  },
};

const starterEquipmentTemplates: Array<Omit<EquipmentItem, "id" | "kind"> & { minLevel: number }> = [
  {
    name: "磨亮的冒險者短劍",
    slot: "武器",
    weaponType: "劍",
    rarity: "普通",
    description: "陪你踏出第一步的可靠短劍",
    bonus: "力量 +2",
    icon: "sword",
    minLevel: 1,
  },
  {
    name: "森林守護胸甲",
    slot: "胸甲",
    rarity: "普通",
    description: "以韌性藤木與輕甲片編成，守護旅人的軀幹。",
    bonus: "防禦 +2",
    icon: "shield-check",
    minLevel: 1,
  },
  {
    name: "旅者皮帽",
    slot: "頭盔",
    rarity: "普通",
    description: "縫有銅扣的輕便皮帽，能擋下沿途碎石。",
    bonus: "生命 +6",
    icon: "shield-check",
    minLevel: 1,
  },
  {
    name: "見習者護腿",
    slot: "護腿",
    rarity: "普通",
    description: "為長途跋涉準備的耐磨護腿。",
    bonus: "閃避率 +1%",
    icon: "target",
    minLevel: 1,
  },
  {
    name: "森林守護護身符",
    slot: "護身符",
    rarity: "普通",
    description: "沾著森林露水的溫和護身符。",
    bonus: "生命 +6",
    icon: "leaf",
    minLevel: 1,
  },
  {
    name: "專注學者之戒",
    slot: "護身符",
    rarity: "稀有",
    description: "讓思緒保持清晰的藍晶戒指",
    bonus: "智力 +3",
    icon: "brain",
    minLevel: 5,
  },
  {
    name: "迅捷旅者護腿",
    slot: "護腿",
    rarity: "稀有",
    description: "在林間行動時幾乎不會發出聲音的輕便護腿。",
    bonus: "閃避率 +2%",
    icon: "target",
    minLevel: 8,
  },
  {
    name: "不屈心核",
    slot: "護身符",
    rarity: "史詩",
    description: "即使倒下也會再次燃起的心核",
    bonus: "生命 +25",
    icon: "heart",
    minLevel: 15,
  },
  {
    name: "裂空魔刃",
    slot: "武器",
    weaponType: "劍",
    rarity: "史詩",
    description: "能切開高階魔物護甲的魔刃",
    bonus: "力量 +8",
    icon: "sword",
    minLevel: 25,
  },
  {
    name: "區域王冠",
    slot: "頭盔",
    rarity: "傳說",
    description: "只有征服區域魔王者才配戴的王冠",
    bonus: "全能力 +5",
    icon: "star",
    minLevel: 50,
  },
];

const equipmentTemplates: Array<Omit<EquipmentItem, "id" | "kind"> & { minLevel: number }> = [
  ...starterEquipmentTemplates,
  ...RPG_EQUIPMENT_TEMPLATES,
];

const treasureTemplates: Array<Omit<TreasureItem, "id" | "kind" | "slot" | "rarity" | "sellValue">> = [
  {
    name: "旅人的古幣袋",
    description: "從遺跡帶回的舊時貨幣，收藏家願意付出好價錢。",
    icon: "coins",
  },
  {
    name: "月光晶簇",
    description: "閃爍著微光的晶體，可以在城鎮換成金幣。",
    icon: "gem",
  },
  {
    name: "王室珍寶匣",
    description: "封存著古代王室珍藏的寶匣，值得高價轉售。",
    icon: "chest",
  },
  {
    name: "龍族金鱗",
    description: "罕見的龍族遺物，商人會以高價收購。",
    icon: "star",
  },
];

const baseTreasureValues: Record<LootRarity, number> = {
  普通: 25,
  精良: 45,
  稀有: 75,
  史詩: 180,
  傳說: 450,
  神話: 900,
};

function pick<T>(items: T[], random: () => number): T {
  const index = Math.min(items.length - 1, Math.floor(random() * items.length));
  return items[Math.max(0, index)];
}

function formatEquipmentAffixBonuses(bonuses: EquipmentAffixBonuses): string {
  return equipmentAffixStats
    .filter(stat => bonuses[stat] !== undefined)
    .map(stat => {
      const { label, unit } = equipmentAffixLabels[stat];
      return `${label} +${bonuses[stat]}${unit}`;
    })
    .join(" · ");
}

function rollEquipmentAffixes(
  rarity: LootRarity,
  random: () => number
): EquipmentAffix[] {
  const candidates = equipmentAffixTemplates.slice();
  const affixes: EquipmentAffix[] = [];
  const count = affixCountByRarity[rarity];
  for (let index = 0; index < count && candidates.length > 0; index += 1) {
    const template = pick(candidates, random);
    candidates.splice(candidates.indexOf(template), 1);
    const bonuses: EquipmentAffixBonuses = {};
    for (const stat of equipmentAffixStats) {
      const baseValue = template.bonuses[stat];
      if (baseValue === undefined) continue;
      bonuses[stat] = Math.max(1, Math.round(baseValue * rarityPower[rarity]));
    }
    affixes.push({
      name: template.name,
      description: `${template.description}（${formatEquipmentAffixBonuses(bonuses)}）`,
      bonuses,
    });
  }
  return affixes;
}

export function getEquipmentAffixBonuses(
  items: EquipmentItem[]
): Required<EquipmentAffixBonuses> {
  const totals: Required<EquipmentAffixBonuses> = {
    health: 0,
    strength: 0,
    defense: 0,
    intelligence: 0,
    critRate: 0,
    critDamage: 0,
    dodgeRate: 0,
  };
  for (const item of items) {
    for (const affix of item.affixes ?? []) {
      for (const stat of equipmentAffixStats) {
        totals[stat] += affix.bonuses[stat] ?? 0;
      }
    }
  }
  return totals;
}

function rollTreasureAffixes(rarity: LootRarity): TreasureAffix[] {
  const affix = treasureAffixByRarity[rarity];
  return affix ? [{ ...affix }] : [];
}

function applyTreasureAffixes(value: number, affixes: TreasureAffix[]): number {
  return affixes.reduce(
    (total, affix) => Math.round(total * (1 + affix.saleBonusPercent / 100)),
    value
  );
}

function getRarityRollProfile(monster: LootMonster) {
  if (monster.isBoss) {
    return {
      rarities: ["史詩", "傳說", "神話"] as LootRarity[],
      thresholds: [0.75, 0.97],
    };
  }

  const level = Math.max(1, monster.level);
  const thresholds =
    level >= 30
      ? [0.4, 0.52, 0.72, 0.93, 0.998]
      : level >= 10
        ? [0.55, 0.67, 0.84, 0.97, 0.998]
        : [0.72, 0.82, 0.94, 0.99, 0.999];
  return { rarities: [...LOOT_RARITIES], thresholds };
}

function getRarityRollDistribution(monster: LootMonster): LootRarityDistribution {
  const distribution = Object.fromEntries(
    LOOT_RARITIES.map(rarity => [rarity, 0])
  ) as LootRarityDistribution;
  const { rarities, thresholds } = getRarityRollProfile(monster);
  let lowerBound = 0;
  rarities.forEach((rarity, index) => {
    const upperBound = thresholds[index] ?? 1;
    distribution[rarity] = upperBound - lowerBound;
    lowerBound = upperBound;
  });
  return distribution;
}

function rollRarity(monster: LootMonster, random: () => number): LootRarity {
  const roll = random();
  const { rarities, thresholds } = getRarityRollProfile(monster);
  for (let index = 0; index < thresholds.length; index += 1) {
    if (roll < thresholds[index]) return rarities[index];
  }
  return rarities[rarities.length - 1];
}

function higherRarity(left: LootRarity, right: LootRarity): LootRarity {
  return rarityRank[left] >= rarityRank[right] ? left : right;
}

function getEquipmentPool(monster: LootMonster) {
  const level = Math.max(1, monster.level);
  const available = equipmentTemplates.filter(item => item.minLevel <= level);
  const bossEquipment = monster.isBoss
    ? available.filter(item => rarityRank[item.rarity] >= rarityRank.史詩)
    : [];
  return bossEquipment.length > 0 ? bossEquipment : available;
}

export function getLootProbabilitySummary(
  monster: LootMonster
): LootProbabilitySummary {
  const dropChance = monster.isBoss ? 1 : ordinaryLootDropChance;
  const treasureDropChance = 1 - equipmentDropChance;
  const rolledRarities = getRarityRollDistribution(monster);
  const equipmentRarities = Object.fromEntries(
    LOOT_RARITIES.map(rarity => [rarity, 0])
  ) as LootRarityDistribution;
  const equipmentPool = getEquipmentPool(monster);
  const templates = equipmentPool.length > 0 ? equipmentPool : equipmentTemplates;

  for (const template of templates) {
    for (const rarity of LOOT_RARITIES) {
      const finalRarity = higherRarity(template.rarity, rarity);
      equipmentRarities[finalRarity] += rolledRarities[rarity] / templates.length;
    }
  }

  return {
    dropChance,
    equipmentChance: dropChance * equipmentDropChance,
    treasureChance: dropChance * treasureDropChance,
    noDropChance: 1 - dropChance,
    equipmentRarities,
    treasureRarities: rolledRarities,
  };
}

function normalizeEquipmentSlot(slot: string): EquipmentSlot {
  switch (slot) {
    case "頭盔":
      return "頭盔";
    case "胸甲":
    case "防具":
      return "胸甲";
    case "武器":
      return "武器";
    case "護腿":
      return "護腿";
    case "護身符":
    case "飾品":
    case "戒指":
    case "核心":
    default:
      return "護身符";
  }
}

export function scaleBonusByRarity(
  bonus: string,
  baseRarity: LootRarity,
  itemRarity: LootRarity
): string {
  const scale = rarityPower[itemRarity] / rarityPower[baseRarity];
  return bonus.replace(/\+(\d+)(%?)/g, (_match, rawValue: string, unit: string) => {
    const amount = Math.max(1, Math.round(Number(rawValue) * scale));
    return `+${amount}${unit}`;
  });
}

export function getTreasureSellValue(rarity: LootRarity, monsterLevel: number): number {
  const levelMultiplier =
    1 + Math.min(4, Math.floor(Math.max(0, monsterLevel - 1) / 25));
  return baseTreasureValues[rarity] * levelMultiplier;
}

export function rollLoot(
  monster: LootMonster,
  random: () => number = Math.random,
  now: () => number = Date.now
): LootItem | null {
  if (!monster.isBoss && random() > ordinaryLootDropChance) return null;

  const kind = random() < equipmentDropChance ? "equipment" : "treasure";
  const rolledRarity = rollRarity(monster, random);
  const idSuffix = () => `${now()}-${Math.floor(random() * 1_000_000)}`;

  if (kind === "treasure") {
    const template = pick(treasureTemplates, random);
    const affixes = rollTreasureAffixes(rolledRarity);
    const baseValue = getTreasureSellValue(rolledRarity, monster.level);
    return {
      ...template,
      id: `${template.name}-${idSuffix()}`,
      kind: "treasure",
      slot: "寶藏",
      rarity: rolledRarity,
      sellValue: applyTreasureAffixes(baseValue, affixes),
      affixes,
    };
  }

  const pool = getEquipmentPool(monster);
  const template = pick(pool.length > 0 ? pool : equipmentTemplates, random);
  const rarity = higherRarity(template.rarity, rolledRarity);
  const affixes = rollEquipmentAffixes(rarity, random);

  return {
    ...template,
    id: `${template.name}-${idSuffix()}`,
    kind: "equipment",
    rarity,
    bonus: scaleBonusByRarity(template.bonus, template.rarity, rarity),
    affixes,
  };
}

function parseEquipmentAffixes(value: unknown): EquipmentAffix[] {
  if (!Array.isArray(value)) return [];
  const affixes: EquipmentAffix[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const candidate = raw as Record<string, unknown>;
    if (
      typeof candidate.name !== "string" ||
      typeof candidate.description !== "string" ||
      !candidate.bonuses ||
      typeof candidate.bonuses !== "object" ||
      Array.isArray(candidate.bonuses)
    ) {
      continue;
    }
    const rawBonuses = candidate.bonuses as Record<string, unknown>;
    const bonuses: EquipmentAffixBonuses = {};
    for (const stat of equipmentAffixStats) {
      const amount = rawBonuses[stat];
      if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0)
        continue;
      bonuses[stat] = Math.min(10000, Math.max(1, Math.round(amount)));
    }
    if (Object.keys(bonuses).length === 0) continue;
    affixes.push({
      name: candidate.name.slice(0, 64),
      description: candidate.description.slice(0, 180),
      bonuses,
    });
  }
  return affixes;
}

function parseTreasureAffixes(value: unknown): TreasureAffix[] {
  if (!Array.isArray(value)) return [];
  const affixes: TreasureAffix[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const candidate = raw as Record<string, unknown>;
    if (
      typeof candidate.name !== "string" ||
      typeof candidate.description !== "string" ||
      typeof candidate.saleBonusPercent !== "number" ||
      !Number.isFinite(candidate.saleBonusPercent) ||
      candidate.saleBonusPercent <= 0
    ) {
      continue;
    }
    affixes.push({
      name: candidate.name.slice(0, 64),
      description: candidate.description.slice(0, 180),
      saleBonusPercent: Math.min(
        1000,
        Math.max(1, Math.round(candidate.saleBonusPercent))
      ),
    });
  }
  return affixes;
}

export function parseLootItem(value: unknown): LootItem | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  if (
    typeof item.id !== "string" ||
    typeof item.name !== "string" ||
    typeof item.rarity !== "string" ||
    !LOOT_RARITIES.includes(item.rarity as LootRarity)
  ) {
    return null;
  }

  const common = {
    id: item.id,
    name: item.name,
    rarity: item.rarity as LootRarity,
    description: typeof item.description === "string" ? item.description : "",
    icon: typeof item.icon === "string" ? item.icon : "star",
  };

  if (item.kind === "treasure") {
    if (
      typeof item.sellValue !== "number" ||
      !Number.isFinite(item.sellValue) ||
      item.sellValue <= 0
    ) {
      return null;
    }
    return {
      ...common,
      kind: "treasure",
      slot: "寶藏",
      sellValue: Math.floor(item.sellValue),
      affixes: parseTreasureAffixes(item.affixes),
    };
  }

  // Items saved before the loot-type split are existing equipment.
  if (
    (item.kind === undefined || item.kind === "equipment") &&
    typeof item.slot === "string" &&
    typeof item.bonus === "string"
  ) {
    const slot = normalizeEquipmentSlot(item.slot);
    return {
      ...common,
      kind: "equipment",
      setId: typeof item.setId === "string" ? item.setId : undefined,
      slot,
      weaponType:
        item.weaponType === "劍" ||
        item.weaponType === "短刀" ||
        item.weaponType === "弓" ||
        item.weaponType === "法杖"
          ? item.weaponType
          : getEquipmentWeaponType({ slot, name: item.name }) ?? undefined,
      element:
        item.element === "自然" ||
        item.element === "冰霜" ||
        item.element === "奧術" ||
        item.element === "火焰" ||
        item.element === "雷電"
          ? item.element
          : undefined,
      bonus: item.bonus,
      affixes: parseEquipmentAffixes(item.affixes),
      equipmentLevel:
        typeof item.equipmentLevel === "number" && Number.isFinite(item.equipmentLevel)
          ? Math.min(6, Math.max(1, Math.floor(item.equipmentLevel)))
          : undefined,
    };
  }

  return null;
}

export function parseLootInventory(value: unknown): LootItem[] {
  if (!Array.isArray(value)) return [];
  const seenIds = new Set<string>();
  const inventory: LootItem[] = [];
  for (const rawItem of value) {
    const item = parseLootItem(rawItem);
    if (!item || seenIds.has(item.id)) continue;
    seenIds.add(item.id);
    inventory.push(item);
  }
  return inventory;
}

export function normalizeEquippedItemIds(
  inventory: LootItem[],
  value: unknown,
  jobClass?: EquipmentJobClass
): string[] {
  if (!Array.isArray(value)) return [];
  const equipmentById = new Map(
    inventory
      .filter((item): item is EquipmentItem => item.kind === "equipment")
      .map(item => [item.id, item])
  );
  const seenIds = new Set<string>();
  const occupiedSlots = new Set<EquipmentSlot>();
  const equippedIds: string[] = [];
  for (const id of value) {
    if (typeof id !== "string" || seenIds.has(id)) continue;
    const item = equipmentById.get(id);
    if (
      !item ||
      occupiedSlots.has(item.slot) ||
      (jobClass && !canEquipEquipment(item, jobClass))
    ) {
      continue;
    }
    seenIds.add(id);
    occupiedSlots.add(item.slot);
    equippedIds.push(id);
    if (occupiedSlots.size === EQUIPMENT_SLOTS.length) break;
  }
  return equippedIds;
}

export function toggleEquippedItemIds(
  inventory: LootItem[],
  equippedItemIds: unknown,
  itemId: string,
  jobClass?: EquipmentJobClass
): string[] {
  const current = normalizeEquippedItemIds(inventory, equippedItemIds, jobClass);
  const item = inventory.find(
    (candidate): candidate is EquipmentItem =>
      candidate.id === itemId && candidate.kind === "equipment"
  );
  if (!item || (jobClass && !canEquipEquipment(item, jobClass))) return current;
  if (current.includes(itemId)) return current.filter(id => id !== itemId);

  return [
    ...current.filter(id => {
      const equipped = inventory.find(candidate => candidate.id === id);
      return equipped?.kind === "equipment" && equipped.slot !== item.slot;
    }),
    itemId,
  ];
}

export function removeTreasureFromInventory(
  inventory: LootItem[],
  itemId: string
): { inventory: LootItem[]; treasure: TreasureItem | null; coinsEarned: number } {
  const treasure = inventory.find(
    (item): item is TreasureItem => item.id === itemId && item.kind === "treasure"
  );
  if (!treasure) return { inventory, treasure: null, coinsEarned: 0 };

  return {
    inventory: inventory.filter(item => item.id !== itemId),
    treasure,
    coinsEarned: treasure.sellValue,
  };
}


export function nextLootRarity(rarity: LootRarity): LootRarity | null {
  return LOOT_RARITIES[rarityRank[rarity] + 1] ?? null;
}

export type EquipmentFusion = {
  consumedIds: string[];
  result: EquipmentItem;
};

export function prepareEquipmentFusion(
  inventory: LootItem[],
  equippedItemIds: unknown,
  rarity: LootRarity,
  playerLevel: number,
  random: () => number = Math.random,
  now: () => number = Date.now,
  selectedItemIds?: string[]
): EquipmentFusion | null {
  const nextRarity = nextLootRarity(rarity);
  if (!nextRarity) return null;

  const equippedIds = new Set(normalizeEquippedItemIds(inventory, equippedItemIds));
  const isAvailableIngredient = (
    item: LootItem | undefined
  ): item is EquipmentItem =>
    item?.kind === "equipment" &&
    item.rarity === rarity &&
    !equippedIds.has(item.id);
  const ingredients = selectedItemIds
    ? selectedItemIds
        .map(id => inventory.find(item => item.id === id))
        .filter(isAvailableIngredient)
    : inventory.filter(isAvailableIngredient).slice(0, 3);
  if (
    (selectedItemIds &&
      (selectedItemIds.length !== 3 || new Set(selectedItemIds).size !== 3)) ||
    ingredients.length !== 3 ||
    new Set(ingredients.map(item => item.id)).size !== 3
  ) {
    return null;
  }

  const level = Math.max(1, Math.floor(Number.isFinite(playerLevel) ? playerLevel : 1));
  const slot = pick(ingredients.map(item => item.slot), random);
  const templates = equipmentTemplates.filter(
    template =>
      template.slot === slot &&
      template.minLevel <= level &&
      rarityRank[template.rarity] <= rarityRank[nextRarity]
  );
  if (templates.length === 0) return null;

  const template = pick(templates, random);
  const result: EquipmentItem = {
    ...template,
    id: `${template.name}-fusion-${now()}-${Math.floor(random() * 1_000_000)}`,
    kind: "equipment",
    rarity: nextRarity,
    bonus: scaleBonusByRarity(template.bonus, template.rarity, nextRarity),
    affixes: rollEquipmentAffixes(nextRarity, random),
  };

  return {
    consumedIds: ingredients.map(item => item.id),
    result,
  };
}
