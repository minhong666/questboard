import type { SpecialCombatSkill } from "./class-skills";

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
        ? Math.min(90, skill.defensePiercePercent + 5)
        : isBerserker && isDamage
          ? Math.max(0, skill.defensePiercePercent - 5)
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
