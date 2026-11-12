export const INTELLIGENCE_XP_BONUS_PER_POINT = 0.5;
export const MAX_INTELLIGENCE_XP_BONUS_PERCENT = 50;

export function getIntelligenceExperienceBonusPercent(intelligence: number) {
  return Math.min(
    MAX_INTELLIGENCE_XP_BONUS_PERCENT,
    Math.max(0, intelligence) * INTELLIGENCE_XP_BONUS_PER_POINT
  );
}
