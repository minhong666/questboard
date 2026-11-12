import { GAME_RULES } from "./game-rules";

export const INTELLIGENCE_XP_BONUS_PER_POINT =
  GAME_RULES.intelligence.xpBonusPerPointPercent;
export const MAX_INTELLIGENCE_XP_BONUS_PERCENT =
  GAME_RULES.intelligence.maxXpBonusPercent;

export function getIntelligenceExperienceBonusPercent(intelligence: number) {
  return Math.min(
    MAX_INTELLIGENCE_XP_BONUS_PERCENT,
    Math.max(0, intelligence) * INTELLIGENCE_XP_BONUS_PER_POINT
  );
}
