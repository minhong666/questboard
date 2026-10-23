export type SkillJobClass = "warrior" | "archer" | "mage" | "rogue";
export type SpecialSkillDamageType = "物理" | "魔法";
export type SpecialSkillEffectType = "damage" | "buff" | "passive";
export type SkillStatusKind = "中毒" | "冰凍" | "燃燒" | "感電" | "災厄";
export type SkillElement = "自然" | "冰霜" | "奧術" | "火焰" | "雷電";
export type SkillStatusEffect = {
  kind: SkillStatusKind;
  element: SkillElement;
  chance: number;
  durationTurns: number;
  damagePerTurn: number;
  damagePercentOfSkill?: number;
};

export type SpecialCombatSkill = {
  id: string;
  name: string;
  jobClass: "warrior" | "archer" | "mage" | "rogue";
  attributeName: "力量" | "智力" | "暴擊率";
  requiredValue: number;
  damageType: SpecialSkillDamageType;
  damageMultiplier: number;
  defensePiercePercent: number;
  effectType: SpecialSkillEffectType;
  description: string;
  cooldownTurns: number;
  durationTurns: number;
  damageBonusPercent: number;
  damageReductionPercent: number;
  flatDamageBonus: number;
  critDamageBonusPercent: number;
  critRateBonusPercent?: number;
  dodgeRateBonusPercent?: number;
  hitCountMin?: number;
  hitCountMax?: number;
  healPercentMaxHealth?: number;
  executeBelowHealthPercent?: number;
  unlockLevel?: number;
  statusEffect?: SkillStatusEffect;
};

export const MIN_DEFENSE_PIERCE_PERCENT = 25;
export const MAX_DEFENSE_PIERCE_PERCENT = 60;

export function clampDefensePiercePercent(value: number) {
  return Math.min(
    MAX_DEFENSE_PIERCE_PERCENT,
    Math.max(
      MIN_DEFENSE_PIERCE_PERCENT,
      Number.isFinite(value) ? value : MIN_DEFENSE_PIERCE_PERCENT
    )
  );
}

const SKILL_STEP = 25;
const ROGUE_SKILL_STEP = 10;
const ROGUE_SKILL_LIMIT = 3;
const WARRIOR_SKILL_LIMIT = 4;
const warriorSkillNames = ["騎士之心", "戰騎斬", "狂戰重擊", "滅世斬"];
const archerSkillNames = ["鷹眼", "穿雲箭", "連珠箭", "破曉射擊"];
const mageSkillNames = ["火球術", "冰霜矛", "雷霆風暴", "隕星術"];
const rogueSkillNames = ["背刺", "影刃連擊", "死亡標記"];

function safeAttributeValue(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

export function getNextSkillUnlockThreshold(
  jobClass: SkillJobClass,
  strength: number,
  intelligence: number,
  critRate = 0
): number | null {
  if (jobClass === "rogue") {
    const unlockedCount = Math.min(
      ROGUE_SKILL_LIMIT,
      Math.floor(safeAttributeValue(critRate) / ROGUE_SKILL_STEP)
    );
    return unlockedCount < ROGUE_SKILL_LIMIT
      ? (unlockedCount + 1) * ROGUE_SKILL_STEP
      : null;
  }
  if (jobClass === "warrior" && safeAttributeValue(strength) >= 100) return null;
  if (jobClass === "archer") {
    const unlockedCount = Math.min(
      archerSkillNames.length,
      Math.floor(safeAttributeValue(critRate) / 5)
    );
    return unlockedCount < archerSkillNames.length
      ? (unlockedCount + 1) * 5
      : null;
  }
  if (jobClass !== "warrior" && jobClass !== "mage") return null;
  const currentValue = safeAttributeValue(
    jobClass === "warrior" ? strength : intelligence
  );
  const next = (Math.floor(currentValue / SKILL_STEP) + 1) * SKILL_STEP;
  return jobClass === "warrior" && next > 100 ? null : next;
}

export function getUnlockedSpecialSkills(
  jobClass: SkillJobClass,
  strength: number,
  intelligence: number,
  critRate = 0
): SpecialCombatSkill[] {
  if (jobClass !== "warrior" && jobClass !== "archer" && jobClass !== "mage" && jobClass !== "rogue")
    return [];

  const isRogue = jobClass === "rogue";
  const isArcher = jobClass === "archer";
  const attributeName = isRogue || isArcher
    ? "暴擊率"
    : jobClass === "warrior"
      ? "力量"
      : "智力";
  const damageType: SpecialSkillDamageType =
    jobClass === "mage" ? "魔法" : "物理";
  const names =
    jobClass === "warrior"
      ? warriorSkillNames
      : isArcher
        ? archerSkillNames
      : jobClass === "mage"
        ? mageSkillNames
        : rogueSkillNames;
  const currentValue = safeAttributeValue(
    isRogue || isArcher ? critRate : jobClass === "warrior" ? strength : intelligence
  );
  const skillStep = isRogue ? ROGUE_SKILL_STEP : isArcher ? 5 : SKILL_STEP;
  const skillCount = isArcher
    ? Math.min(archerSkillNames.length, Math.floor(currentValue / skillStep))
    : jobClass === "warrior"
    ? Math.min(WARRIOR_SKILL_LIMIT, Math.floor(currentValue / skillStep))
    : isRogue
    ? Math.min(ROGUE_SKILL_LIMIT, Math.floor(currentValue / skillStep))
    : Math.floor(currentValue / skillStep);

  return Array.from({ length: skillCount }, (_, index) => {
    const requiredValue = (index + 1) * skillStep;
    const rank = Math.floor(index / names.length) + 1;
    const name = names[index % names.length];
    const isKnightHeart = jobClass === "warrior" && index === 0;
    const isWarriorSlash = jobClass === "warrior" && index === 1;
    const isArcherFocus = isArcher && index === 0;
    const isArcherPiercingShot = isArcher && index === 1;
    const isArcherRapidVolley = isArcher && index === 2;
    const isArcherDawnShot = isArcher && index === 3;
    const cooldownTurns = isKnightHeart
      ? 5
      : isArcherPiercingShot || isArcherRapidVolley
        ? 4
        : isArcherDawnShot
          ? 5
          : isWarriorSlash
        ? 4
        : jobClass === "warrior" && index === 3
          ? 5
          : 3 + (index % 3);
    const statusEffect = jobClass === "mage"
      ? index === 0
        ? { kind: "燃燒" as const, element: "火焰" as const, chance: 1, durationTurns: 3, damagePerTurn: 8 + index * 2 }
        : index === 1
          ? { kind: "冰凍" as const, element: "冰霜" as const, chance: 0.7, durationTurns: 1, damagePerTurn: 0 }
          : index === 2
            ? { kind: "感電" as const, element: "雷電" as const, chance: 0.85, durationTurns: 2, damagePerTurn: 6 }
            : { kind: "中毒" as const, element: "自然" as const, chance: 0.9, durationTurns: 4, damagePerTurn: 7 }
      : undefined;
    const statusDescription = statusEffect
      ? `元素效果：${statusEffect.element}${statusEffect.kind}（${Math.round(statusEffect.chance * 100)}% 機率，持續 ${statusEffect.durationTurns} 回合${statusEffect.damagePerTurn > 0 ? `，每回合 ${statusEffect.damagePerTurn} 傷害` : "，冰凍時跳過怪物反擊"}）`
      : "";
    return {
      id: `${jobClass}-${requiredValue}`,
      name: rank === 1 ? name : `${name}・階級 ${rank}`,
      jobClass,
      attributeName,
      requiredValue,
      damageType,
      damageMultiplier: isKnightHeart || isArcherFocus
        ? 0
        : isArcherPiercingShot
          ? 1.6
          : isArcherRapidVolley
            ? 1.65
            : isArcherDawnShot
              ? 3
        : isRogue
        ? 2 + index * 0.3
        : isWarriorSlash
          ? 1.5
          : 1.5 + requiredValue / 100,
      defensePiercePercent: isKnightHeart || isArcherFocus
        ? 0
        : isArcher
          ? isArcherPiercingShot
            ? 30
            : 0
        : clampDefensePiercePercent(
            isRogue ? 35 + index * 15 : 20 + index * 10
          ),
      effectType: isKnightHeart ? "buff" : isArcherFocus ? "passive" : "damage",
      description: isKnightHeart
        ? "自身造成傷害 +20%，受到傷害 −20%，持續 3 回合；冷卻 5 回合。"
        : isArcherFocus
          ? "暴擊傷害增加 30%。"
        : isArcherPiercingShot
          ? "物理技能，造成 1.60 倍傷害，防禦穿透 30%；冷卻 4 回合。"
        : isArcherRapidVolley
          ? "物理技能，每次造成 1.65 倍傷害，隨機攻擊 1～3 次；冷卻 4 回合。"
        : isArcherDawnShot
          ? "物理技能，造成 3.00 倍傷害；冷卻 5 回合。"
        : isWarriorSlash
          ? `造成自身1.5倍的傷害；冷卻 ${cooldownTurns} 回合。`
          : `${damageType}技能，造成 ${isRogue ? (2 + index * 0.3).toFixed(2) : (1.5 + requiredValue / 100).toFixed(2)} 倍傷害；冷卻 ${cooldownTurns} 回合${statusDescription ? `；${statusDescription}` : ""}`,
      cooldownTurns,
      durationTurns: isKnightHeart ? 3 : 0,
      damageBonusPercent: isKnightHeart ? 20 : 0,
      damageReductionPercent: isKnightHeart ? 20 : 0,
      flatDamageBonus: 0,
      critDamageBonusPercent: isArcherFocus ? 30 : 0,
      hitCountMin: isArcherRapidVolley ? 1 : undefined,
      hitCountMax: isArcherRapidVolley ? 3 : undefined,
      statusEffect,
    };
  });
}

export function getAllSpecialSkills(jobClass: SkillJobClass): SpecialCombatSkill[] {
  const maxValue = jobClass === "rogue" ? 30 : jobClass === "warrior" ? 100 : jobClass === "archer" ? 20 : 100;
  return getUnlockedSpecialSkills(
    jobClass,
    jobClass === "warrior" ? maxValue : 0,
    jobClass === "mage" ? maxValue : 0,
    jobClass === "rogue" || jobClass === "archer" ? maxValue : 0
  );
}

export function calculateSpecialSkillDamage(
  baseDamage: number,
  enemyDefense: number,
  skill: SpecialCombatSkill
) {
  const amplifiedDamage = Math.round(
    Math.max(1, baseDamage) * skill.damageMultiplier
  ) + skill.flatDamageBonus;
  const remainingDefense = Math.max(
    0,
    enemyDefense * (1 - skill.defensePiercePercent / 100)
  );
  return Math.max(1, amplifiedDamage - Math.floor(remainingDefense * 0.5));
}
