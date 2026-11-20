import {
  getAllSpecialSkills,
  type SkillJobClass,
  type SpecialCombatSkill,
} from "./class-skills";
import {
  getAllSpecializationSkills,
  getAllSpecializations,
} from "./class-specializations";

export const MAX_SKILL_UPGRADE_LEVEL = 15;

export type SkillUpgradeLevels = Record<string, number>;

export function getSkillUpgradePointsForLevelUps(levelUps: number) {
  return Math.max(0, Math.floor(Number.isFinite(levelUps) ? levelUps : 0));
}

const SKILL_JOB_CLASSES: SkillJobClass[] = [
  "warrior",
  "archer",
  "mage",
  "rogue",
];

export function isSkillUpgradeable(skill: SpecialCombatSkill) {
  return skill.effectType !== "passive";
}

const NON_UPGRADEABLE_SKILL_IDS = new Set(
  [
    ...SKILL_JOB_CLASSES.flatMap(jobClass => getAllSpecialSkills(jobClass)),
    ...getAllSpecializations().flatMap(specialization =>
      getAllSpecializationSkills(specialization)
    ),
  ]
    .filter(skill => !isSkillUpgradeable(skill))
    .map(skill => skill.id)
);

export function normalizeSkillUpgradeState(value: unknown): {
  levels: SkillUpgradeLevels;
  refundedPoints: number;
} {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { levels: {}, refundedPoints: 0 };
  }
  return Object.entries(value).reduce(
    (result, [skillId, level]) => {
      if (typeof level !== "number" || !Number.isFinite(level)) return result;
      const wholeLevel = Math.max(0, Math.floor(level));
      if (NON_UPGRADEABLE_SKILL_IDS.has(skillId)) {
        result.refundedPoints += wholeLevel;
        return result;
      }
      result.refundedPoints += Math.max(0, wholeLevel - MAX_SKILL_UPGRADE_LEVEL);
      const safeLevel = Math.min(MAX_SKILL_UPGRADE_LEVEL, wholeLevel);
      if (safeLevel > 0) result.levels[skillId] = safeLevel;
      return result;
    },
    { levels: {} as SkillUpgradeLevels, refundedPoints: 0 }
  );
}

export function normalizeSkillUpgradeLevels(value: unknown): SkillUpgradeLevels {
  return normalizeSkillUpgradeState(value).levels;
}

export function applySkillUpgrade(
  skill: SpecialCombatSkill,
  upgradeLevel: number
): SpecialCombatSkill {
  const level = Math.min(
    MAX_SKILL_UPGRADE_LEVEL,
    Math.max(0, Math.floor(Number.isFinite(upgradeLevel) ? upgradeLevel : 0))
  );
  if (level === 0 || !isSkillUpgradeable(skill)) return skill;
  const damageSkill = skill.effectType === "damage";
  const hasDamageBonus = skill.damageBonusPercent !== 0;
  const hasDamageReduction = skill.damageReductionPercent !== 0;
  return {
    ...skill,
    damageMultiplier: damageSkill
      ? skill.damageMultiplier * (1 + level * 0.025)
      : skill.damageMultiplier,
    defensePiercePercent: skill.defensePiercePercent,
    damageBonusPercent: hasDamageBonus
      ? skill.damageBonusPercent + level * 0.5
      : skill.damageBonusPercent,
    damageReductionPercent: hasDamageReduction
      ? skill.damageReductionPercent + level * 0.5
      : skill.damageReductionPercent,
    critDamageBonusPercent: skill.critDamageBonusPercent,
    description: `${skill.description}（技能升級 Lv.${level}）`,
  };
}

export function getNextSkillUpgradePreview(
  baseSkill: SpecialCombatSkill,
  currentUpgradeLevel: number
): SpecialCombatSkill | null {
  const currentLevel = Math.max(
    0,
    Math.floor(
      Number.isFinite(currentUpgradeLevel) ? currentUpgradeLevel : 0
    )
  );
  if (!isSkillUpgradeable(baseSkill) || currentLevel >= MAX_SKILL_UPGRADE_LEVEL) {
    return null;
  }
  return applySkillUpgrade(baseSkill, currentLevel + 1);
}
