import {
  clampDefensePiercePercent,
  type SpecialCombatSkill,
} from "./class-skills";

export const MAX_SKILL_UPGRADE_LEVEL = 15;

export type SkillUpgradeLevels = Record<string, number>;

export function getSkillUpgradePointsForLevelUps(levelUps: number) {
  return Math.max(0, Math.floor(Number.isFinite(levelUps) ? levelUps : 0));
}

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
  if (level === 0) return skill;
  const damageSkill = skill.effectType === "damage";
  const buffSkill = skill.effectType === "buff";
  const passiveSkill = skill.effectType === "passive";
  const descriptionIncludesDefensePierce = skill.description.includes("防禦穿透");
  return {
    ...skill,
    damageMultiplier: damageSkill
      ? skill.damageMultiplier * (1 + level * 0.05)
      : skill.damageMultiplier,
    defensePiercePercent: damageSkill && descriptionIncludesDefensePierce
      ? clampDefensePiercePercent(skill.defensePiercePercent + level * 2)
      : skill.defensePiercePercent,
    damageBonusPercent: buffSkill
      ? skill.damageBonusPercent + level
      : skill.damageBonusPercent,
    damageReductionPercent: buffSkill
      ? skill.damageReductionPercent + level
      : skill.damageReductionPercent,
    critDamageBonusPercent: passiveSkill
      ? skill.critDamageBonusPercent + level * 5
      : skill.critDamageBonusPercent,
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
  if (currentLevel >= MAX_SKILL_UPGRADE_LEVEL) return null;
  return applySkillUpgrade(baseSkill, currentLevel + 1);
}
