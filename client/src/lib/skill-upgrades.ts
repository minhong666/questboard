import type { SpecialCombatSkill } from "./class-skills";

export const MAX_SKILL_UPGRADE_LEVEL = 50;

export type SkillUpgradeLevels = Record<string, number>;

export function getSkillUpgradePointsForLevelUps(levelUps: number) {
  return Math.max(0, Math.floor(Number.isFinite(levelUps) ? levelUps : 0));
}

export function normalizeSkillUpgradeLevels(value: unknown): SkillUpgradeLevels {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.entries(value).reduce<SkillUpgradeLevels>(
    (levels, [skillId, level]) => {
      if (typeof level !== "number" || !Number.isFinite(level)) return levels;
      const safeLevel = Math.min(MAX_SKILL_UPGRADE_LEVEL, Math.max(0, Math.floor(level)));
      if (safeLevel > 0) levels[skillId] = safeLevel;
      return levels;
    },
    {}
  );
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
  return {
    ...skill,
    damageMultiplier: damageSkill
      ? skill.damageMultiplier * (1 + level * 0.05)
      : skill.damageMultiplier,
    defensePiercePercent: damageSkill
      ? Math.min(90, skill.defensePiercePercent + level * 2)
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
