export type EquipmentSpecialAbilityId =
  | "low-health-damage"
  | "low-health-lifesteal"
  | "skill-cooldown"
  | "low-health-resistance"
  | "phoenix-rebirth"
  | "high-health-dominance";

export type EquipmentSpecialAbilityEffects = {
  damageBonusBelowHalfHealthPercent?: number;
  lifestealBelowHalfHealthPercent?: number;
  cooldownReductionOnSkill?: number;
  physicalResistanceBelowHalfHealthPercent?: number;
  magicResistanceBelowHalfHealthPercent?: number;
  preventLethalDamageOnce?: boolean;
  nextAttackLifestealPercent?: number;
  attackBonusAboveHalfHealthPercent?: number;
  defenseBonusAboveHalfHealthPercent?: number;
};

export type EquipmentSpecialAbility = {
  id: EquipmentSpecialAbilityId;
  name: string;
  description: string;
  effects: EquipmentSpecialAbilityEffects;
};

export type ActiveEquipmentSpecialEffects = {
  attackDamageBonusPercent: number;
  defenseBonusPercent: number;
  lifestealPercent: number;
  physicalResistancePercent: number;
  magicResistancePercent: number;
};

export type LethalProtectionResolution = {
  triggered: boolean;
  health: number;
  nextAttackLifestealPercent: number;
};

const legendaryAbilities: Record<
  EquipmentSpecialAbilityId,
  EquipmentSpecialAbility
> = {
  "low-health-damage": {
    id: "low-health-damage",
    name: "阿修羅戰意",
    description: "生命值低於 50% 時，造成的傷害提高 20%。",
    effects: { damageBonusBelowHalfHealthPercent: 20 },
  },
  "low-health-lifesteal": {
    id: "low-health-lifesteal",
    name: "夜魔噬魂",
    description: "生命值低於 50% 時，攻擊獲得 35% 吸血。",
    effects: { lifestealBelowHalfHealthPercent: 35 },
  },
  "skill-cooldown": {
    id: "skill-cooldown",
    name: "星辰回響",
    description: "施放技能後，該技能的冷卻回合數減少 1 回合。",
    effects: { cooldownReductionOnSkill: 1 },
  },
  "low-health-resistance": {
    id: "low-health-resistance",
    name: "山脈守護",
    description: "生命值低於 50% 時，物理與魔法傷害抗性各提高 20%。",
    effects: {
      physicalResistanceBelowHalfHealthPercent: 20,
      magicResistanceBelowHalfHealthPercent: 20,
    },
  },
  "phoenix-rebirth": {
    id: "phoenix-rebirth",
    name: "涅槃重生",
    description:
      "每場戰鬥首次受到致死傷害時免疫該次傷害，並使下一次成功攻擊獲得 20% 吸血。",
    effects: {
      preventLethalDamageOnce: true,
      nextAttackLifestealPercent: 20,
    },
  },
  "high-health-dominance": {
    id: "high-health-dominance",
    name: "天穹威勢",
    description: "生命值高於 50% 時，攻擊與防禦提高 20%。",
    effects: {
      attackBonusAboveHalfHealthPercent: 20,
      defenseBonusAboveHalfHealthPercent: 20,
    },
  },
};

const abilityIdsByEquipmentName: Record<string, EquipmentSpecialAbilityId> = {
  阿修羅戰神兜盔: "low-health-damage",
  "曙光聖衛·傳說盔": "low-health-damage",
  夜魔主宰面具: "low-health-lifesteal",
  "影月獵行·傳說盔": "low-health-lifesteal",
  星辰智者之冠: "skill-cooldown",
  "星界賢者·傳說盔": "skill-cooldown",
  永恆山脈巨盔: "low-health-resistance",
  "鐵壁巨神·傳說盔": "low-health-resistance",
  鳳凰涅槃面具: "phoenix-rebirth",
  "風暴劍魂·傳說盔": "phoenix-rebirth",
  天穹王盔: "high-health-dominance",
  "蒼龍天命·傳說盔": "high-health-dominance",
};

export function getEquipmentSpecialAbilityIdByName(
  equipmentName: string
): EquipmentSpecialAbilityId | undefined {
  return abilityIdsByEquipmentName[equipmentName];
}

export function getEquipmentSpecialAbility(
  equipmentName: string,
  rarity: string,
  abilityId?: EquipmentSpecialAbilityId
): EquipmentSpecialAbility | undefined {
  const id = abilityId ?? getEquipmentSpecialAbilityIdByName(equipmentName);
  if (!id || rarity !== "傳說") return undefined;
  return legendaryAbilities[id];
}

export function getActiveEquipmentSpecialEffects(
  ability: EquipmentSpecialAbility | undefined,
  health: number,
  maxHealth: number
): ActiveEquipmentSpecialEffects {
  const effects = ability?.effects;
  const belowHalfHealth = health < maxHealth * 0.5;
  const aboveHalfHealth = health > maxHealth * 0.5;
  return {
    attackDamageBonusPercent: belowHalfHealth
      ? (effects?.damageBonusBelowHalfHealthPercent ?? 0)
      : aboveHalfHealth
        ? (effects?.attackBonusAboveHalfHealthPercent ?? 0)
        : 0,
    defenseBonusPercent: aboveHalfHealth
      ? (effects?.defenseBonusAboveHalfHealthPercent ?? 0)
      : 0,
    lifestealPercent: belowHalfHealth
      ? (effects?.lifestealBelowHalfHealthPercent ?? 0)
      : 0,
    physicalResistancePercent: belowHalfHealth
      ? (effects?.physicalResistanceBelowHalfHealthPercent ?? 0)
      : 0,
    magicResistancePercent: belowHalfHealth
      ? (effects?.magicResistanceBelowHalfHealthPercent ?? 0)
      : 0,
  };
}

export function resolveLethalProtection(
  ability: EquipmentSpecialAbility | undefined,
  healthBeforeDamage: number,
  incomingDamage: number,
  alreadyUsed: boolean
): LethalProtectionResolution {
  const triggered = Boolean(
    ability?.effects.preventLethalDamageOnce &&
      !alreadyUsed &&
      healthBeforeDamage > 0 &&
      incomingDamage > 0 &&
      healthBeforeDamage - incomingDamage <= 0
  );
  return {
    triggered,
    health: triggered
      ? healthBeforeDamage
      : Math.max(0, healthBeforeDamage - incomingDamage),
    nextAttackLifestealPercent: triggered
      ? (ability?.effects.nextAttackLifestealPercent ?? 0)
      : 0,
  };
}
