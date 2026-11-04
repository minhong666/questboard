export type EquipmentSpecialAbilityId =
  | "low-health-damage"
  | "low-health-lifesteal"
  | "skill-cooldown"
  | "low-health-resistance"
  | "phoenix-rebirth"
  | "high-health-dominance"
  | "imperial-pressure"
  | "abyssal-counter"
  | "truth-awakening"
  | "sacred-wall"
  | "gale-dancer"
  | "oracle-blessing";

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
  attackBonusAbove70HealthPercent?: number;
  defenseBonusAbove70HealthPercent?: number;
  enemyDamageReductionAbove70HealthPercent?: number;
  guaranteedCritOnNextAttackAfterDodge?: boolean;
  nextAttackDamageBonusAfterDodgePercent?: number;
  doubleCastSkillChancePercent?: number;
  sacredShieldBelowHealthPercent?: number;
  sacredShieldAbsorbPercentMaxHealth?: number;
  sacredShieldDurationTurns?: number;
  galeMaxStacks?: number;
  galeAttackPercentPerStack?: number;
  galeDodgePercentPerStack?: number;
  galePhysicalDamageBonusAtMaxStacks?: number;
  oracleFirstTurnsDamageReductionPercent?: number;
  oracleFirstTurnsDuration?: number;
  oracleStunEnemiesOnHitAtTurnEnd?: boolean;
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
  enemyDamageReductionPercent: number;
  dodgeRateBonusPercent: number;
  physicalDamageBonusPercent: number;
};

export type LethalProtectionResolution = {
  triggered: boolean;
  health: number;
  nextAttackLifestealPercent: number;
};

export type DivineShieldState = {
  charge: number;
  remainingAbsorb: number;
  turnsRemaining: number;
  used: boolean;
};

export type DivineShieldResolution = {
  health: number;
  damageTaken: number;
  absorbedDamage: number;
  triggered: boolean;
  state: DivineShieldState;
};

export type DodgeCounterState = {
  guaranteedCrit: boolean;
  damageBonusPercent: number;
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
  "imperial-pressure": {
    id: "imperial-pressure",
    name: "帝王威壓",
    description:
      "生命值高於 70% 時，攻擊與防禦提高 15%，並使敵人造成的傷害降低 15%。",
    effects: {
      attackBonusAbove70HealthPercent: 15,
      defenseBonusAbove70HealthPercent: 15,
      enemyDamageReductionAbove70HealthPercent: 15,
    },
  },
  "abyssal-counter": {
    id: "abyssal-counter",
    name: "深淵反擊",
    description: "成功閃避後，下一次成功命中的攻擊必定暴擊，且傷害提高 15%。",
    effects: {
      guaranteedCritOnNextAttackAfterDodge: true,
      nextAttackDamageBonusAfterDodgePercent: 15,
    },
  },
  "truth-awakening": {
    id: "truth-awakening",
    name: "真理開悟",
    description: "施放造成傷害的技能時有 10% 機率使該技能在同一回合施放兩次。",
    effects: { doubleCastSkillChancePercent: 10 },
  },
  "sacred-wall": {
    id: "sacred-wall",
    name: "神聖護盾",
    description:
      "受到傷害會累積護盾能量；生命值低於 30% 時，自動獲得護盾，吸收相當於最大生命值 25% 的傷害，持續 2 回合，每場戰鬥僅觸發一次。",
    effects: {
      sacredShieldBelowHealthPercent: 30,
      sacredShieldAbsorbPercentMaxHealth: 25,
      sacredShieldDurationTurns: 2,
    },
  },
  "gale-dancer": {
    id: "gale-dancer",
    name: "疾風",
    description:
      "每次成功閃避或進行普通攻擊時獲得 1 層疾風（最多 5 層）；每層提升攻擊 3% 與閃避率 2%，滿 5 層時額外提高物理傷害 10%。",
    effects: {
      galeMaxStacks: 5,
      galeAttackPercentPerStack: 3,
      galeDodgePercentPerStack: 2,
      galePhysicalDamageBonusAtMaxStacks: 10,
    },
  },
  "oracle-blessing": {
    id: "oracle-blessing",
    name: "神諭庇佑",
    description:
      "戰鬥前 3 回合受到的物理與魔法傷害降低 20%；受到敵人命中後，於該回合結束時使所有敵人暈眩 1 回合。",
    effects: {
      oracleFirstTurnsDamageReductionPercent: 20,
      oracleFirstTurnsDuration: 3,
      oracleStunEnemiesOnHitAtTurnEnd: true,
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
  帝王光輝聖甲: "imperial-pressure",
  "曙光聖衛·傳說胸甲": "imperial-pressure",
  深淵獵手皮革: "abyssal-counter",
  "影月獵行·傳說胸甲": "abyssal-counter",
  真理之門法袍: "truth-awakening",
  "星界賢者·傳說胸甲": "truth-awakening",
  神聖守護者之壁: "sacred-wall",
  "鐵壁巨神·傳說胸甲": "sacred-wall",
  疾風劍聖法衣: "gale-dancer",
  "風暴劍魂·傳說胸甲": "gale-dancer",
  神諭聖甲: "oracle-blessing",
  "蒼龍天命·傳說胸甲": "oracle-blessing",
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
  maxHealth: number,
  turn = 1,
  windStacks = 0
): ActiveEquipmentSpecialEffects {
  const effects = ability?.effects;
  const belowHalfHealth = health < maxHealth * 0.5;
  const aboveHalfHealth = health > maxHealth * 0.5;
  const above70Health = health > maxHealth * 0.7;
  const activeWindStacks = Math.min(
    effects?.galeMaxStacks ?? 0,
    Math.max(0, windStacks)
  );
  const oracleProtectionActive =
    turn >= 1 && turn <= (effects?.oracleFirstTurnsDuration ?? 0);
  return {
    attackDamageBonusPercent:
      (belowHalfHealth
        ? (effects?.damageBonusBelowHalfHealthPercent ?? 0)
        : aboveHalfHealth
          ? (effects?.attackBonusAboveHalfHealthPercent ?? 0)
          : 0) +
      (above70Health ? (effects?.attackBonusAbove70HealthPercent ?? 0) : 0) +
      activeWindStacks * (effects?.galeAttackPercentPerStack ?? 0),
    defenseBonusPercent:
      (aboveHalfHealth
        ? (effects?.defenseBonusAboveHalfHealthPercent ?? 0)
        : 0) +
      (above70Health ? (effects?.defenseBonusAbove70HealthPercent ?? 0) : 0),
    lifestealPercent: belowHalfHealth
      ? (effects?.lifestealBelowHalfHealthPercent ?? 0)
      : 0,
    physicalResistancePercent:
      (belowHalfHealth
        ? (effects?.physicalResistanceBelowHalfHealthPercent ?? 0)
        : 0) +
      (oracleProtectionActive
        ? (effects?.oracleFirstTurnsDamageReductionPercent ?? 0)
        : 0),
    magicResistancePercent:
      (belowHalfHealth
        ? (effects?.magicResistanceBelowHalfHealthPercent ?? 0)
        : 0) +
      (oracleProtectionActive
        ? (effects?.oracleFirstTurnsDamageReductionPercent ?? 0)
        : 0),
    enemyDamageReductionPercent: above70Health
      ? (effects?.enemyDamageReductionAbove70HealthPercent ?? 0)
      : 0,
    dodgeRateBonusPercent:
      activeWindStacks * (effects?.galeDodgePercentPerStack ?? 0),
    physicalDamageBonusPercent:
      activeWindStacks >= (effects?.galeMaxStacks ?? Number.POSITIVE_INFINITY)
        ? (effects?.galePhysicalDamageBonusAtMaxStacks ?? 0)
        : 0,
  };
}

export function rollTruthDoubleCast(
  ability: EquipmentSpecialAbility | undefined,
  randomValue = Math.random()
): boolean {
  const chance = ability?.effects.doubleCastSkillChancePercent ?? 0;
  return chance > 0 && randomValue < chance / 100;
}

export function resolveDodgeCounterState(
  ability: EquipmentSpecialAbility | undefined,
  previousState: DodgeCounterState,
  successfullyDodged: boolean,
  attackConnected: boolean
): DodgeCounterState {
  if (
    successfullyDodged &&
    ability?.effects.guaranteedCritOnNextAttackAfterDodge
  ) {
    return {
      guaranteedCrit: true,
      damageBonusPercent:
        ability.effects.nextAttackDamageBonusAfterDodgePercent ?? 0,
    };
  }
  return attackConnected
    ? { guaranteedCrit: false, damageBonusPercent: 0 }
    : previousState;
}

export function resolveGaleStackCount(
  currentStacks: number,
  normalAttackMade: boolean,
  successfullyDodged: boolean,
  maxStacks = 5
): number {
  const stacks = Math.max(0, Math.floor(currentStacks));
  const gained = Number(normalAttackMade) + Number(successfullyDodged);
  return Math.min(Math.max(0, maxStacks), stacks + gained);
}

export function resolveDivineShieldDamage(
  ability: EquipmentSpecialAbility | undefined,
  state: DivineShieldState,
  healthBeforeDamage: number,
  maxHealth: number,
  incomingDamage: number,
  endOfTurn = false
): DivineShieldResolution {
  const safeDamage = Math.max(0, incomingDamage);
  const shieldActive = state.remainingAbsorb > 0 && state.turnsRemaining > 0;
  const hasShieldPassive = ability?.id === "sacred-wall";
  const charge =
    hasShieldPassive && !state.used
      ? Math.max(0, state.charge) + safeDamage
      : Math.max(0, state.charge);
  const trigger = Boolean(
    !shieldActive &&
      hasShieldPassive &&
      !state.used &&
      charge > 0 &&
      healthBeforeDamage - safeDamage <
        maxHealth *
          ((ability?.effects.sacredShieldBelowHealthPercent ?? 0) / 100)
  );
  const shieldCapacity = shieldActive
    ? state.remainingAbsorb
    : trigger
      ? maxHealth *
        ((ability?.effects.sacredShieldAbsorbPercentMaxHealth ?? 0) / 100)
      : 0;
  const absorbedDamage = Math.min(safeDamage, shieldCapacity);
  const duration = ability?.effects.sacredShieldDurationTurns ?? 0;
  const turnsRemaining = shieldActive
    ? Math.max(0, state.turnsRemaining - Number(endOfTurn))
    : trigger
      ? Math.max(0, duration - Number(endOfTurn))
      : 0;
  const remainingAbsorb = Math.max(0, shieldCapacity - absorbedDamage);
  const remainsActive = remainingAbsorb > 0 && turnsRemaining > 0;
  return {
    health: Math.max(0, healthBeforeDamage - (safeDamage - absorbedDamage)),
    damageTaken: safeDamage - absorbedDamage,
    absorbedDamage,
    triggered: trigger,
    state: {
      charge: trigger
        ? 0
        : hasShieldPassive && !state.used
          ? charge
          : state.charge,
      remainingAbsorb: remainsActive ? remainingAbsorb : 0,
      turnsRemaining: remainsActive ? turnsRemaining : 0,
      used: state.used || trigger,
    },
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
