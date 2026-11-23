import { GAME_RULES } from "./game-rules";

export type CharacterCombatAttributes = {
  strength: number;
  defense: number;
  intelligence: number;
};

export type CharacterCombatJobClass = "warrior" | "archer" | "mage" | "rogue";

function safeAttribute(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

/** Physical attack uses strength only; intelligence is reserved for mages. */
export function getPhysicalAttackDamage(abilities: CharacterCombatAttributes) {
  return Math.max(
    1,
    Math.round(
      safeAttribute(abilities.strength) *
        GAME_RULES.combat.physicalDamagePerStrengthPoint
    )
  );
}

/** Magic attack is based on intelligence and is selected only for mages. */
export function getMagicAttackDamage(abilities: CharacterCombatAttributes) {
  return Math.max(
    1,
    Math.round(
      safeAttribute(abilities.intelligence) *
        GAME_RULES.combat.magicDamagePerIntelligencePoint
    )
  );
}

export function getAttackDamage(
  abilities: CharacterCombatAttributes,
  jobClass: CharacterCombatJobClass = "warrior"
) {
  return jobClass === "mage"
    ? getMagicAttackDamage(abilities)
    : getPhysicalAttackDamage(abilities);
}

/** Converts the half-point defense ratio to whole-point damage reduction. */
export function getDefenseReduction(defense: number) {
  return Math.floor(
    safeAttribute(defense) * GAME_RULES.combat.damageReductionPerDefensePoint
  );
}
