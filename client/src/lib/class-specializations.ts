import {
  clampDefensePiercePercent,
  type SkillStatusEffect,
  type SpecialCombatSkill,
} from "./class-skills";

export type JobClass = "warrior" | "archer" | "mage" | "rogue";

export type SpecializationId =
  | "warrior-guardian"
  | "warrior-berserker"
  | "archer-ranger"
  | "archer-sniper"
  | "mage-elementalist"
  | "mage-frostguard"
  | "rogue-assassin"
  | "rogue-shadowdancer";

export type ClassSpecialization = {
  id: SpecializationId;
  jobClass: JobClass;
  name: string;
  description: string;
  skillNames: string[];
};

const SPECIALIZATIONS: ClassSpecialization[] = [
  {
    id: "warrior-guardian",
    jobClass: "warrior",
    name: "守護者",
    description: "強化防禦與控場，讓增益技能更適合承受傷害。",
    skillNames: ["聖盾之心", "守護斬", "壁壘重擊", "天穹斬"],
  },
  {
    id: "warrior-berserker",
    jobClass: "warrior",
    name: "狂戰士",
    description: "以更高的爆發傷害換取較低的防禦收益。",
    skillNames: ["狂怒之心", "血刃", "狂戰重擊", "滅世斬"],
  },
  {
    id: "archer-ranger",
    jobClass: "archer",
    name: "遊俠",
    description: "提升暴擊傷害與機動性，擅長穩定輸出。",
    skillNames: ["鷹眼巡獵"],
  },
  {
    id: "archer-sniper",
    jobClass: "archer",
    name: "狙擊手",
    description: "犧牲部分機動性，換取更高的致命一擊傷害。",
    skillNames: ["致命瞄準"],
  },
  {
    id: "mage-elementalist",
    jobClass: "mage",
    name: "元素使",
    description: "強化元素法術的傷害與狀態效果。",
    skillNames: ["烈焰彈", "冰霜矛", "雷霆風暴", "隕星術"],
  },
  {
    id: "mage-frostguard",
    jobClass: "mage",
    name: "霜衛",
    description: "以冰霜控制與防禦為核心，降低戰鬥風險。",
    skillNames: ["寒霜護盾", "冰封矛", "凍結領域", "極寒星墜"],
  },
  {
    id: "rogue-assassin",
    jobClass: "rogue",
    name: "刺客",
    description: "專注單點爆發與穿透防禦。",
    skillNames: ["致命背刺", "影刃連擊", "死亡標記"],
  },
  {
    id: "rogue-shadowdancer",
    jobClass: "rogue",
    name: "影舞者",
    description: "以靈活的連擊與閃避掌控戰場節奏。",
    skillNames: ["幻影步", "暗影旋舞", "無痕終結"],
  },
];

export function getSpecializations(jobClass: JobClass) {
  return SPECIALIZATIONS.filter(item => item.jobClass === jobClass);
}

export function getDefaultSpecialization(jobClass: JobClass): SpecializationId {
  return getSpecializations(jobClass)[0]?.id ?? "warrior-guardian";
}

export function normalizeSpecialization(value: unknown, jobClass: JobClass) {
  const valid = getSpecializations(jobClass);
  return valid.some(item => item.id === value)
    ? (value as SpecializationId)
    : getDefaultSpecialization(jobClass);
}

export function getSpecialization(
  jobClass: JobClass,
  specializationId: SpecializationId
): ClassSpecialization {
  return (
    getSpecializations(jobClass).find(item => item.id === specializationId) ??
    getSpecializations(jobClass)[0] ??
    SPECIALIZATIONS[0]
  );
}

function createSpecializationSkill(
  specialization: ClassSpecialization,
  level: number,
  name: string,
  effectType: SpecialCombatSkill["effectType"],
  damageMultiplier: number,
  defensePiercePercent: number,
  damageBonusPercent = 0,
  damageReductionPercent = 0,
  critDamageBonusPercent = 0,
  healPercentMaxHealth = 0,
  durationTurns = effectType === "buff" ? 2 : 0,
  critRateBonusPercent = 0,
  dodgeRateBonusPercent = 0,
  cooldownTurns = effectType === "buff" ? 5 : 3,
  executeBelowHealthPercent = 0,
  statusEffect?: SkillStatusEffect
): SpecialCombatSkill {
  const isMage = specialization.jobClass === "mage";
  const damageReductionLabel = damageReductionPercent >= 0
    ? `受到傷害 −${damageReductionPercent}%`
    : `受到傷害 +${Math.abs(damageReductionPercent)}%`;
  return {
    id: `${specialization.id}-level-${level}`,
    name,
    jobClass: specialization.jobClass,
    attributeName:
      specialization.jobClass === "rogue"
        ? "暴擊率"
        : specialization.jobClass === "warrior"
          ? "力量"
          : "智力",
    requiredValue: level,
    unlockLevel: level,
    damageType: isMage ? "魔法" : "物理",
    damageMultiplier,
    defensePiercePercent:
      effectType === "damage"
        ? clampDefensePiercePercent(defensePiercePercent)
        : 0,
    effectType,
    description:
      effectType === "buff"
        ? `轉職專精技能：造成傷害 +${damageBonusPercent}%，${damageReductionLabel}，每回合恢復最大生命 ${healPercentMaxHealth}%，持續 ${durationTurns} 回合。`
        : effectType === "passive"
          ? `轉職專精被動：暴擊率增加 ${critRateBonusPercent}%，暴擊傷害增加 ${critDamageBonusPercent}%，閃避增加 ${dodgeRateBonusPercent}%。`
          : `轉職專精技能：造成 ${damageMultiplier.toFixed(2)} 倍${isMage ? "魔法" : "物理"}傷害${defensePiercePercent > 0 ? `，防禦穿透 ${clampDefensePiercePercent(defensePiercePercent)}%` : ""}${damageReductionPercent !== 0 ? `，${damageReductionLabel}，持續 ${durationTurns} 回合` : ""}${executeBelowHealthPercent > 0 ? `，敵人生命低於 ${executeBelowHealthPercent}% 時直接斬殺` : ""}${statusEffect?.damagePercentOfSkill ? `，每回合受到該技能 ${statusEffect.damagePercentOfSkill}% 魔法傷害，持續 ${statusEffect.durationTurns} 回合` : statusEffect?.kind === "冰凍" ? `，無法攻擊 ${statusEffect.durationTurns} 回合` : ""}。`,
    cooldownTurns,
    durationTurns,
    damageBonusPercent,
    damageReductionPercent,
    flatDamageBonus: 0,
    critDamageBonusPercent,
    critRateBonusPercent,
    dodgeRateBonusPercent,
    executeBelowHealthPercent,
    healPercentMaxHealth,
    statusEffect,
  };
}

export function getAllSpecializationSkills(
  specialization: ClassSpecialization
): SpecialCombatSkill[] {
  const skillSets: Record<SpecializationId, SpecialCombatSkill[]> = {
    "warrior-guardian": [
      createSpecializationSkill(specialization, 50, "神聖壁壘", "buff", 0, 0, 20, 30, 0, 5, 3),
      createSpecializationSkill(specialization, 75, "守護裁決", "damage", 2.5, 30, 0, 20, 0, 0, 2),
      createSpecializationSkill(specialization, 100, "不滅天斬", "damage", 3.2, 40, 0, 50, 0, 0, 0, 0, 0, 8),
    ],
    "warrior-berserker": [
      createSpecializationSkill(specialization, 50, "狂怒解放", "buff", 0, 0, 40, -20, 0, 0, 2, 0, 0, 5),
      createSpecializationSkill(specialization, 75, "血獄斬", "damage", 2.6, 30),
      createSpecializationSkill(specialization, 100, "末日狂斬", "damage", 4, 50, 0, -30, 0, 0, 3, 0, 0, 5),
    ],
    "archer-ranger": [
      createSpecializationSkill(specialization, 50, "獵王直覺", "passive", 0, 0, 0, 0, 30, 0, 0, 0, 20),
      createSpecializationSkill(specialization, 75, "連環箭雨", "damage", 2.2, 40),
      createSpecializationSkill(specialization, 100, "森林審判", "damage", 4.5, 55, 0, 0, 0, 0, 0, 0, 0, 5),
    ],
    "archer-sniper": [
      createSpecializationSkill(specialization, 50, "致命校準", "passive", 0, 0, 0, 0, 30, 0, 0, 20, 0),
      createSpecializationSkill(specialization, 75, "貫星射擊", "damage", 3, 35, 0, 0, 0, 0, 0, 0, 0, 5),
      createSpecializationSkill(specialization, 100, "終焉狙殺", "damage", 4.2, 60, 0, 0, 0, 0, 0, 0, 0, 8),
    ],
    "mage-elementalist": [
      createSpecializationSkill(specialization, 50, "元素共鳴", "damage", 2, 25),
      createSpecializationSkill(specialization, 75, "元素爆裂", "damage", 3.1, 45, 0, 0, 0, 0, 0, 0, 0, 5),
      createSpecializationSkill(
        specialization,
        100,
        "天災降臨",
        "damage",
        4.2,
        60,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        8,
        0,
        {
          kind: "災厄",
          element: "奧術",
          chance: 1,
          durationTurns: 3,
          damagePerTurn: 0,
          damagePercentOfSkill: 5,
        }
      ),
    ],
    "mage-frostguard": [
      {
        ...createSpecializationSkill(specialization, 50, "寒霜護體", "buff", 0, 0, -20, 50, 0, 0, 2, 0, 0, 5),
        description: "轉職專精技能：受到傷害 −50%，造成傷害 −20%，持續 2 回合；冷卻 5 回合。",
      },
      {
        ...createSpecializationSkill(
          specialization,
          75,
          "冰封審判",
          "damage",
          2.1,
          20,
          0,
          30,
          0,
          0,
          2,
          0,
          0,
          5,
          0,
          {
            kind: "冰凍",
            element: "冰霜",
            chance: 1,
            durationTurns: 2,
            damagePerTurn: 0,
          }
        ),
        defensePiercePercent: 20,
        description: "轉職專精技能：造成 2.10 倍魔法傷害，防禦穿透 20%，受到傷害 −30%，持續 2 回合；冷卻 5 回合。",
      },
      {
        ...createSpecializationSkill(
          specialization,
          100,
          "絕對零度",
          "damage",
          3.3,
          50,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          5,
          0,
          {
            kind: "冰凍",
            element: "冰霜",
            chance: 1,
            durationTurns: 2,
            damagePerTurn: 0,
          }
        ),
        description: "轉職專精技能：造成 3.30 倍魔法傷害，防禦穿透 50%，並讓對手無法攻擊 2 回合；冷卻 5 回合。",
      },
    ],
    "rogue-assassin": [
      createSpecializationSkill(specialization, 50, "暗殺契約", "damage", 2.5, 30),
      createSpecializationSkill(specialization, 75, "致命連環", "damage", 3.4, 60, 0, 0, 0, 0, 0, 0, 0, 5),
      createSpecializationSkill(specialization, 100, "無聲處決", "damage", 4.6, 60, 0, 0, 0, 0, 0, 0, 0, 8, 10),
    ],
    "rogue-shadowdancer": [
      createSpecializationSkill(specialization, 50, "影步幻舞", "passive", 0, 0, 0, 0, 25, 0, 0, 0, 10),
      createSpecializationSkill(specialization, 75, "月影亂舞", "damage", 2.4, 45, 0, 0, 0, 0, 0, 0, 0, 5),
      createSpecializationSkill(specialization, 100, "萬影歸寂", "damage", 4, 30, 0, 0, 0, 0, 3, 0, 30, 8),
    ],
  };
  return skillSets[specialization.id];
}

export function getUnlockedSpecializationSkills(
  specialization: ClassSpecialization,
  playerLevel: number
) {
  return getAllSpecializationSkills(specialization).filter(
    skill => (skill.unlockLevel ?? Infinity) <= Math.max(0, playerLevel)
  );
}

export function getNextSpecializationSkillLevel(
  specialization: ClassSpecialization,
  playerLevel: number
) {
  return (
    getAllSpecializationSkills(specialization).find(
      skill => (skill.unlockLevel ?? Infinity) > playerLevel
    )?.unlockLevel ?? null
  );
}

export function applySpecializationToSkill(
  skill: SpecialCombatSkill,
  specialization: ClassSpecialization
): SpecialCombatSkill {
  const skillIndex = Math.max(
    0,
    Math.floor(skill.requiredValue / (skill.jobClass === "rogue" ? 10 : skill.jobClass === "archer" ? 5 : 25)) - 1
  );
  const isGuardian = specialization.id === "warrior-guardian";
  const isBerserker = specialization.id === "warrior-berserker";
  const isSniper = specialization.id === "archer-sniper";
  const isFrostguard = specialization.id === "mage-frostguard";
  const isShadowdancer = specialization.id === "rogue-shadowdancer";
  const isDamage = skill.effectType === "damage";
  return {
    ...skill,
    name: specialization.skillNames[skillIndex] ?? skill.name,
    damageMultiplier:
      isBerserker && isDamage
        ? skill.damageMultiplier * 1.15
        : isSniper && skill.effectType === "passive"
          ? skill.damageMultiplier
          : isFrostguard && isDamage
            ? skill.damageMultiplier * 0.95
            : isShadowdancer && isDamage
              ? skill.damageMultiplier * 1.08
              : skill.damageMultiplier,
    defensePiercePercent:
      isGuardian && isDamage
        ? clampDefensePiercePercent(skill.defensePiercePercent + 5)
        : isBerserker && isDamage
          ? clampDefensePiercePercent(skill.defensePiercePercent - 5)
          : skill.defensePiercePercent,
    damageBonusPercent:
      isGuardian && skill.effectType === "buff"
        ? skill.damageBonusPercent + 5
        : isBerserker && skill.effectType === "buff"
          ? skill.damageBonusPercent + 10
          : skill.damageBonusPercent,
    damageReductionPercent:
      isGuardian && skill.effectType === "buff"
        ? skill.damageReductionPercent + 10
        : isBerserker && skill.effectType === "buff"
          ? Math.max(0, skill.damageReductionPercent - 10)
          : skill.damageReductionPercent,
    critDamageBonusPercent:
      isSniper && skill.effectType === "passive"
        ? skill.critDamageBonusPercent + 15
        : isShadowdancer && skill.effectType === "passive"
          ? skill.critDamageBonusPercent + 5
          : skill.critDamageBonusPercent,
    description: `${skill.description}（${specialization.name}專精）`,
  };
}
