import {
  getLegendaryWeaponAbility,
  getLegendaryWeaponAbilityIdByName,
} from "./equipment-weapon-abilities";

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
  | "oracle-blessing"
  | "starfire-bow"
  | "dawn-sword"
  | "iron-guard-sword"
  | "moonshadow-sword"
  | "kings-sword"
  | "starrealm-sword"
  | "hunter-dagger"
  | "swiftfang-dagger"
  | "poison-thorn-dagger"
  | "phantom-step-dagger"
  | "void-dagger"
  | "forestwind-bow"
  | "sandfeather-bow"
  | "moonstring-bow"
  | "firmament-bow"
  | "sunwheel-bow"
  | "nature-staff"
  | "sapphire-staff"
  | "starlight-staff"
  | "fire-vein-staff"
  | "genesis-staff"
  | "asura-leggings"
  | "night-leggings"
  | "astral-leggings"
  | "mountain-leggings"
  | "gale-leggings"
  | "shadowmoon-leggings"
  | "solar-eye"
  | "medusa-eye"
  | "leviathan-heart"
  | "hunter-king-fang"
  | "spacetime-crystal"
  | "eternal-star-core"
  | "dawn-guardian-vision"
  | "dawn-guardian-armor"
  | "dawn-guardian-step"
  | "dawn-guardian-sunmark"
  | "dawn-warden-sword"
  | "dawn-warden-dagger"
  | "dawn-warden-bow"
  | "dawn-warden-staff"
  | "moon-stalker-vision"
  | "moon-stalker-chest"
  | "moon-stalker-leggings"
  | "moon-stalker-amulet"
  | "moon-stalker-sword"
  | "moon-stalker-dagger"
  | "moon-stalker-bow"
  | "moon-stalker-staff";

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
  starfireBurnPercentOfCriticalDamage?: number;
  starfireDurationTurns?: number;
  starfireArmorReductionPercent?: number;
  dawnProcChancePercent?: number;
  dawnBonusDamagePercentAttack?: number;
  dawnHighHealthThresholdPercent?: number;
  dawnHighHealthDamageMultiplier?: number;
  ironGuardDamageReductionPercentPerStack?: number;
  ironGuardMaxStacks?: number;
  moonshadowProcChancePercent?: number;
  moonshadowDodgeRateBonusPercent?: number;
  moonshadowNextAttackDamageBonusPercent?: number;
  kingsSwordTargetHealthBelowPercent?: number;
  kingsSwordCritDamageBonusPercent?: number;
  starrealmMaxStacks?: number;
  starrealmAoeAttackPercent?: number;
  hunterCritRateBonusPerCriticalPercent?: number;
  hunterCritDamageBonusPerCriticalPercent?: number;
  swiftfangAttackBonusPercent?: number;
  swiftfangDodgeRateBonusPercent?: number;
  swiftfangDurationTurns?: number;
  poisonThornDamagePercentOfHit?: number;
  poisonThornHealingReceivedReductionPercent?: number;
  poisonThornDurationTurns?: number;
  phantomStepNextAttackCritRateBonusPercent?: number;
  phantomStepDefensePiercePercent?: number;
  voidDaggerProcChancePercent?: number;
  voidDaggerOutgoingDamageReductionPercent?: number;
  voidDaggerDurationTurns?: number;
  forestwindDamageBonusPerTurnPercent?: number;
  forestwindMaxDamageBonusPercent?: number;
  sandfeatherProcChancePercent?: number;
  sandfeatherAccuracyReductionPercent?: number;
  sandfeatherDurationTurns?: number;
  moonstringChargeIntervalTurns?: number;
  moonstringDefensePiercePercent?: number;
  moonstringNextEnemyAccuracyReductionPercent?: number;
  firmamentBonusDamagePercentStrength?: number;
  sunwheelProcChancePercent?: number;
  sunwheelBurnPercentAttack?: number;
  sunwheelDurationTurns?: number;
  sunwheelCritRateBonusPercent?: number;
  natureStaffHealChancePercent?: number;
  natureStaffHealPercentIntelligence?: number;
  sapphireStaffFreezeChancePercent?: number;
  sapphireStaffFreezeDurationTurns?: number;
  sapphireStaffDamageBonusVsFrozenPercent?: number;
  starlightStaffCastsPerEcho?: number;
  starlightStaffEchoDamageBonusPercent?: number;
  fireVeinMarksToBurst?: number;
  fireVeinAoeMagicAttackPercent?: number;
  genesisStaffProcChancePercent?: number;
  genesisStaffBonusMagicDamage?: number;
  genesisStaffMaxAdditionalTargets?: number;
  genesisStaffParalysisChancePercent?: number;
  genesisStaffParalysisDurationTurns?: number;
  asuraPhysicalDamageBonusPerCritPercent?: number;
  asuraMaxCritStacks?: number;
  asuraCritStackDurationTurns?: number;
  nightDodgeBelowHalfHealthPercent?: number;
  nightDefenseBelowHalfHealthPercent?: number;
  astralSkillHealChancePercent?: number;
  astralSkillHealMaxHealthPercent?: number;
  astralNextSkillCritRateBonusPercent?: number;
  mountainDefenseBelowHalfHealthPercent?: number;
  mountainPhysicalResistanceBelowHalfHealthPercent?: number;
  mountainMagicResistanceBelowHalfHealthPercent?: number;
  galeNextAttackBonusPercentStrength?: number;
  shadowmoonDodgeRateBonusAtBattleStartPercent?: number;
  shadowmoonLethalEvasionChancePercent?: number;
  solarEyeProcChancePercent?: number;
  solarEyeHybridDamagePercent?: number;
  solarEyeAccuracyReductionPercent?: number;
  solarEyeAccuracyReductionDurationTurns?: number;
  medusaEyeProcChancePercent?: number;
  medusaEyeDamageBonusVsPetrifiedPercent?: number;
  leviathanHealIntervalTurns?: number;
  leviathanHealMaxHealthPercent?: number;
  leviathanLowHealthThresholdPercent?: number;
  leviathanLowHealthHealMultiplier?: number;
  leviathanLowHealthResistancePercent?: number;
  hunterFangHighHealthThresholdPercent?: number;
  hunterFangCritRateBonusPercent?: number;
  hunterFangDefensePiercePercent?: number;
  hunterFangCooldownReductionOnKill?: number;
  spacetimeReversalChancePercent?: number;
  starCoreShieldPercentIntelligence?: number;
  starCoreMagicDamageBonusPercent?: number;
  dawnGuardianDefensePiercePercent?: number;
  dawnGuardianResistancePiercePercent?: number;
  dawnArmorDamageReductionPercentPerStack?: number;
  dawnArmorMaxStacks?: number;
  dawnArmorHealingReceivedPercentPerStack?: number;
  dawnArmorFullStackHealMaxHealthPercent?: number;
  dawnStepDodgeRateBonusPercent?: number;
  dawnStepDisarmChancePercent?: number;
  dawnMarkDamageBonusPercent?: number;
  dawnMarkLifestealPercent?: number;
  dawnWardenSwordProcChancePercent?: number;
  dawnWardenSwordAoeDamagePercentAttack?: number;
  dawnWardenSwordStunDurationTurns?: number;
  dawnWardenDaggerProcChancePercent?: number;
  dawnWardenDaggerEchoDamagePercentAttack?: number;
  dawnWardenBowDamageBonusPerTargetPercent?: number;
  dawnWardenBowMaxDamageBonusPercent?: number;
  dawnWardenStaffDotMaxHealthPercent?: number;
  dawnWardenStaffDotDurationTurns?: number;
  dawnWardenStaffDamageReductionPercent?: number;
  moonStalkerEnemyAttackStealPercent?: number;
  moonStalkerAttackBonusPercent?: number;
  moonStalkerCriticalDamageBonusPercent?: number;
  moonStalkerEffectDurationTurns?: number;
  moonStalkerDodgeHealMaxHealthPercent?: number;
  moonStalkerAfterimageDamageReductionPercent?: number;
  moonStalkerLeggingsHealthThresholdPercent?: number;
  moonStalkerStealthDamageTakenBonusPercent?: number;
  moonStalkerStealthDamageBonusPercent?: number;
  moonStalkerStealthDodgeBonusPercent?: number;
  moonStalkerMarkChancePercent?: number;
  moonStalkerMarkDefensePiercePercent?: number;
  moonStalkerMarkCritRateBonusPercent?: number;
  moonStalkerSwordCounterDamagePercentStrength?: number;
  moonStalkerSwordBleedPercentCounterDamage?: number;
  moonStalkerSwordHealingReductionPercent?: number;
  moonStalkerDaggerDoubleStrikeChancePercent?: number;
  moonStalkerDaggerBonusDamagePercent?: number;
  moonStalkerDaggerDefensePiercePercent?: number;
  moonStalkerBowBlindAccuracyReductionPercent?: number;
  moonStalkerBowGuaranteedHits?: number;
  moonStalkerBowCritRateBonusPercent?: number;
  moonStalkerStaffFreezeChancePercent?: number;
  moonStalkerStaffFreezeDurationTurns?: number;
  moonStalkerStaffEnemyDamageReductionPercent?: number;
  moonStalkerStaffEnemyDefenseBonusPercent?: number;
  moonStalkerStaffBonusDamagePercent?: number;
};

export type EquipmentSpecialAbility = {
  id: EquipmentSpecialAbilityId;
  name: string;
  description: string;
  effects: EquipmentSpecialAbilityEffects;
};

export type ActiveLegendaryEquipmentSetBonuses = {
  asura: boolean;
  night: boolean;
  astral: boolean;
  mountain: boolean;
  gale: boolean;
};

export function getActiveLegendaryEquipmentSetBonuses(
  helmetAbilityId?: EquipmentSpecialAbilityId,
  chestAbilityId?: EquipmentSpecialAbilityId,
  leggingsAbilityId?: EquipmentSpecialAbilityId
): ActiveLegendaryEquipmentSetBonuses {
  return {
    asura:
      helmetAbilityId === "low-health-damage" &&
      leggingsAbilityId === "asura-leggings",
    night:
      helmetAbilityId === "low-health-lifesteal" &&
      leggingsAbilityId === "night-leggings",
    astral:
      helmetAbilityId === "skill-cooldown" &&
      leggingsAbilityId === "astral-leggings",
    mountain:
      helmetAbilityId === "low-health-resistance" &&
      leggingsAbilityId === "mountain-leggings",
    gale:
      chestAbilityId === "gale-dancer" && leggingsAbilityId === "gale-leggings",
  };
}

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

const legendaryAbilities: Partial<
  Record<EquipmentSpecialAbilityId, EquipmentSpecialAbility>
> = {
  "asura-leggings": {
    id: "asura-leggings",
    name: "阿修羅戰意",
    description:
      "每次造成暴擊時，物理傷害提高 8%，最多 3 層；每層持續 3 回合。",
    effects: {
      asuraPhysicalDamageBonusPerCritPercent: 8,
      asuraMaxCritStacks: 3,
      asuraCritStackDurationTurns: 3,
    },
  },
  "night-leggings": {
    id: "night-leggings",
    name: "夜魔幻步",
    description: "生命值低於 50% 時，閃避率提高 12%，防禦提高 15%。",
    effects: {
      nightDodgeBelowHalfHealthPercent: 12,
      nightDefenseBelowHalfHealthPercent: 15,
    },
  },
  "astral-leggings": {
    id: "astral-leggings",
    name: "星辰啟示",
    description:
      "施放主動技能後有 30% 機率恢復最大生命值的 8%，並使下一次傷害技能暴擊率提高 10%。",
    effects: {
      astralSkillHealChancePercent: 30,
      astralSkillHealMaxHealthPercent: 8,
      astralNextSkillCritRateBonusPercent: 10,
    },
  },
  "mountain-leggings": {
    id: "mountain-leggings",
    name: "山脈壁壘",
    description:
      "生命值低於 50% 時，防禦提高 20%，物理與魔法傷害抗性各提高 10%。",
    effects: {
      mountainDefenseBelowHalfHealthPercent: 20,
      mountainPhysicalResistanceBelowHalfHealthPercent: 10,
      mountainMagicResistanceBelowHalfHealthPercent: 10,
    },
  },
  "gale-leggings": {
    id: "gale-leggings",
    name: "疾風追擊",
    description: "成功閃避後，下一次物理攻擊附加相當於自身力量 120% 的傷害。",
    effects: { galeNextAttackBonusPercentStrength: 120 },
  },
  "shadowmoon-leggings": {
    id: "shadowmoon-leggings",
    name: "影月庇佑",
    description:
      "進入戰鬥時閃避率提高 10%；受到致命傷害時有 20% 機率閃避該次攻擊。",
    effects: {
      shadowmoonDodgeRateBonusAtBattleStartPercent: 10,
      shadowmoonLethalEvasionChancePercent: 20,
    },
  },
  "solar-eye": {
    id: "solar-eye",
    name: "太陽神裁決",
    description:
      "造成傷害時有 25% 機率觸發雙修爆發，額外造成力量與智力總和 50% 的傷害，並使目標命中率降低 15%，持續 2 回合。",
    effects: {
      solarEyeProcChancePercent: 25,
      solarEyeHybridDamagePercent: 50,
      solarEyeAccuracyReductionPercent: 15,
      solarEyeAccuracyReductionDurationTurns: 2,
    },
  },
  "medusa-eye": {
    id: "medusa-eye",
    name: "美杜莎凝視",
    description:
      "攻擊命中或成功閃避時有 20% 機率使目標石化 1 回合；攻擊已石化目標時傷害提高 25%。",
    effects: {
      medusaEyeProcChancePercent: 20,
      medusaEyeDamageBonusVsPetrifiedPercent: 25,
    },
  },
  "leviathan-heart": {
    id: "leviathan-heart",
    name: "利維坦回生",
    description:
      "每 3 回合恢復最大生命值 4%；生命低於 30% 時恢復量翻倍，並獲得 20% 物理與魔法抗性。",
    effects: {
      leviathanHealIntervalTurns: 3,
      leviathanHealMaxHealthPercent: 4,
      leviathanLowHealthThresholdPercent: 30,
      leviathanLowHealthHealMultiplier: 2,
      leviathanLowHealthResistancePercent: 20,
    },
  },
  "hunter-king-fang": {
    id: "hunter-king-fang",
    name: "獵王追擊",
    description:
      "攻擊生命高於 70% 的目標時，暴擊率提高 15%、護甲穿透提高 20%；擊殺目標後所有傷害技能冷卻減少 1 回合。",
    effects: {
      hunterFangHighHealthThresholdPercent: 70,
      hunterFangCritRateBonusPercent: 15,
      hunterFangDefensePiercePercent: 20,
      hunterFangCooldownReductionOnKill: 1,
    },
  },
  "spacetime-crystal": {
    id: "spacetime-crystal",
    name: "時空逆轉",
    description:
      "每場戰鬥首次受到致命傷害時有 30% 機率免疫該次傷害，並將戰鬥狀態回溯至本回合開始前。",
    effects: { spacetimeReversalChancePercent: 30 },
  },
  "eternal-star-core": {
    id: "eternal-star-core",
    name: "星核共鳴",
    description:
      "施放技能時獲得相當於智力 50% 的護盾；護盾存在時魔法傷害提高 15%。",
    effects: {
      starCoreShieldPercentIntelligence: 50,
      starCoreMagicDamageBonusPercent: 15,
    },
  },
  "dawn-guardian-vision": {
    id: "dawn-guardian-vision",
    name: "神聖視界",
    description: "攻擊時無視敵人 15% 防禦與物理／魔法抗性。",
    effects: {
      dawnGuardianDefensePiercePercent: 15,
      dawnGuardianResistancePiercePercent: 15,
    },
  },
  "dawn-guardian-armor": {
    id: "dawn-guardian-armor",
    name: "曙光鎧甲",
    description:
      "每次受到傷害累積 1 層聖光能量（最多 5 層），每層提供 3% 減傷與 2% 額外受療；滿層時每回合恢復最大生命值的 3%。",
    effects: {
      dawnArmorDamageReductionPercentPerStack: 3,
      dawnArmorMaxStacks: 5,
      dawnArmorHealingReceivedPercentPerStack: 2,
      dawnArmorFullStackHealMaxHealthPercent: 3,
    },
  },
  "dawn-guardian-step": {
    id: "dawn-guardian-step",
    name: "聖衛步伐",
    description:
      "閃避率提高 10%；受到近戰傷害時有 25% 機率使攻擊者繳械 1 回合。",
    effects: {
      dawnStepDodgeRateBonusPercent: 10,
      dawnStepDisarmChancePercent: 25,
    },
  },
  "dawn-guardian-sunmark": {
    id: "dawn-guardian-sunmark",
    name: "太陽印記",
    description:
      "命中時為目標施加太陽印記；攻擊帶有印記的目標時傷害提高 12%，並將造成傷害的 10% 轉化為生命。",
    effects: {
      dawnMarkDamageBonusPercent: 12,
      dawnMarkLifestealPercent: 10,
    },
  },
  "moon-stalker-vision": {
    id: "moon-stalker-vision",
    name: "夜魔視界",
    description:
      "命中時竊取目標 10% 攻擊力並轉為自身攻擊加成，持續 3 回合；暴擊傷害提高 20%。",
    effects: {
      moonStalkerEnemyAttackStealPercent: 10,
      moonStalkerAttackBonusPercent: 10,
      moonStalkerCriticalDamageBonusPercent: 20,
      moonStalkerEffectDurationTurns: 3,
    },
  },
  "moon-stalker-chest": {
    id: "moon-stalker-chest",
    name: "深淵護體",
    description:
      "成功閃避時恢復最大生命值的 3%，並獲得持續 1 回合、使下一次受傷降低 30% 的暗影殘像。",
    effects: {
      moonStalkerDodgeHealMaxHealthPercent: 3,
      moonStalkerAfterimageDamageReductionPercent: 30,
      moonStalkerEffectDurationTurns: 1,
    },
  },
  "moon-stalker-leggings": {
    id: "moon-stalker-leggings",
    name: "夜魔遁術",
    description:
      "生命低於 40% 時每場戰鬥首次進入暗影潛行：閃避 +25%、傷害 +50%，但受到傷害 +30%。",
    effects: {
      moonStalkerLeggingsHealthThresholdPercent: 40,
      moonStalkerStealthDamageTakenBonusPercent: 30,
      moonStalkerStealthDamageBonusPercent: 50,
      moonStalkerStealthDodgeBonusPercent: 25,
    },
  },
  "moon-stalker-amulet": {
    id: "moon-stalker-amulet",
    name: "月蝕印記",
    description:
      "造成傷害時有 20% 機率標記目標；攻擊被標記目標時穿透 20% 防禦並提高暴擊率 15%。",
    effects: {
      moonStalkerMarkChancePercent: 20,
      moonStalkerMarkDefensePiercePercent: 20,
      moonStalkerMarkCritRateBonusPercent: 15,
    },
  },
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
  "曙光聖衛·傳說盔": "dawn-guardian-vision",
  夜魔主宰面具: "low-health-lifesteal",
  "影月獵行·傳說盔": "moon-stalker-vision",
  星辰智者之冠: "skill-cooldown",
  "星界賢者·傳說盔": "skill-cooldown",
  永恆山脈巨盔: "low-health-resistance",
  "鐵壁巨神·傳說盔": "low-health-resistance",
  鳳凰涅槃面具: "phoenix-rebirth",
  "風暴劍魂·傳說盔": "phoenix-rebirth",
  天穹王盔: "high-health-dominance",
  "蒼龍天命·傳說盔": "high-health-dominance",
  帝王光輝聖甲: "imperial-pressure",
  "曙光聖衛·傳說胸甲": "dawn-guardian-armor",
  深淵獵手皮革: "abyssal-counter",
  "影月獵行·傳說胸甲": "moon-stalker-chest",
  真理之門法袍: "truth-awakening",
  "星界賢者·傳說胸甲": "truth-awakening",
  神聖守護者之壁: "sacred-wall",
  "鐵壁巨神·傳說胸甲": "sacred-wall",
  疾風劍聖法衣: "gale-dancer",
  "風暴劍魂·傳說胸甲": "gale-dancer",
  神諭聖甲: "oracle-blessing",
  "蒼龍天命·傳說胸甲": "oracle-blessing",
  阿修羅戰神護腿: "asura-leggings",
  "曙光聖衛·傳說護腿": "dawn-guardian-step",
  夜魔主宰護腿: "night-leggings",
  "影月獵行·傳說護腿": "moon-stalker-leggings",
  星辰智者長褲: "astral-leggings",
  "星界賢者·傳說護腿": "astral-leggings",
  永恆山脈護腿: "mountain-leggings",
  "鐵壁巨神·傳說護腿": "mountain-leggings",
  疾風劍聖護腿: "gale-leggings",
  "風暴劍魂·傳說護腿": "gale-leggings",
  影月護腿: "shadowmoon-leggings",
  "蒼龍天命·傳說護腿": "shadowmoon-leggings",
  太陽神之眼: "solar-eye",
  美杜莎之瞳: "medusa-eye",
  利維坦之心: "leviathan-heart",
  獵王之牙: "hunter-king-fang",
  時空交界水晶: "spacetime-crystal",
  永恆星核: "eternal-star-core",
  "曙光聖衛·傳說徽記": "dawn-guardian-sunmark",
  "影月獵行·傳說徽記": "moon-stalker-amulet",
};

export function getEquipmentSpecialAbilityIdByName(
  equipmentName: string
): EquipmentSpecialAbilityId | undefined {
  return (
    abilityIdsByEquipmentName[equipmentName] ??
    getLegendaryWeaponAbilityIdByName(equipmentName)
  );
}

export function getEquipmentSpecialAbility(
  equipmentName: string,
  rarity: string,
  abilityId?: EquipmentSpecialAbilityId
): EquipmentSpecialAbility | undefined {
  const id = abilityId ?? getEquipmentSpecialAbilityIdByName(equipmentName);
  if (!id || rarity !== "傳說") return undefined;
  return legendaryAbilities[id] ?? getLegendaryWeaponAbility(id);
}

export function getActiveEquipmentSpecialEffects(
  ability: EquipmentSpecialAbility | undefined,
  health: number,
  maxHealth: number,
  turn = 1,
  windStacks = 0,
  asuraCritStacks = 0
): ActiveEquipmentSpecialEffects {
  const effects = ability?.effects;
  const belowHalfHealth = health < maxHealth * 0.5;
  const aboveHalfHealth = health > maxHealth * 0.5;
  const above70Health = health > maxHealth * 0.7;
  const activeWindStacks = Math.min(
    effects?.galeMaxStacks ?? 0,
    Math.max(0, windStacks)
  );
  const activeAsuraCritStacks = Math.min(
    effects?.asuraMaxCritStacks ?? 0,
    Math.max(0, asuraCritStacks)
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
      (belowHalfHealth
        ? (effects?.nightDefenseBelowHalfHealthPercent ?? 0) +
          (effects?.mountainDefenseBelowHalfHealthPercent ?? 0)
        : 0) +
      (aboveHalfHealth
        ? (effects?.defenseBonusAboveHalfHealthPercent ?? 0)
        : 0) +
      (above70Health ? (effects?.defenseBonusAbove70HealthPercent ?? 0) : 0),
    lifestealPercent: belowHalfHealth
      ? (effects?.lifestealBelowHalfHealthPercent ?? 0)
      : 0,
    physicalResistancePercent:
      (belowHalfHealth
        ? (effects?.physicalResistanceBelowHalfHealthPercent ?? 0) +
          (effects?.mountainPhysicalResistanceBelowHalfHealthPercent ?? 0)
        : 0) +
      (oracleProtectionActive
        ? (effects?.oracleFirstTurnsDamageReductionPercent ?? 0)
        : 0),
    magicResistancePercent:
      (belowHalfHealth
        ? (effects?.magicResistanceBelowHalfHealthPercent ?? 0) +
          (effects?.mountainMagicResistanceBelowHalfHealthPercent ?? 0)
        : 0) +
      (oracleProtectionActive
        ? (effects?.oracleFirstTurnsDamageReductionPercent ?? 0)
        : 0),
    enemyDamageReductionPercent: above70Health
      ? (effects?.enemyDamageReductionAbove70HealthPercent ?? 0)
      : 0,
    dodgeRateBonusPercent:
      (belowHalfHealth ? (effects?.nightDodgeBelowHalfHealthPercent ?? 0) : 0) +
      (effects?.shadowmoonDodgeRateBonusAtBattleStartPercent ?? 0) +
      (effects?.dawnStepDodgeRateBonusPercent ?? 0) +
      activeWindStacks * (effects?.galeDodgePercentPerStack ?? 0),
    physicalDamageBonusPercent:
      (activeWindStacks >= (effects?.galeMaxStacks ?? Number.POSITIVE_INFINITY)
        ? (effects?.galePhysicalDamageBonusAtMaxStacks ?? 0)
        : 0) +
      activeAsuraCritStacks *
        (effects?.asuraPhysicalDamageBonusPerCritPercent ?? 0),
  };
}

export function advanceAsuraCritStackTurns(
  currentStackTurns: number[],
  criticalHit: boolean,
  maxStacks = 3,
  durationTurns = 3
): number[] {
  const nextStacks = currentStackTurns
    .map(turns => Math.max(0, Math.floor(turns) - 1))
    .filter(turns => turns > 0)
    .slice(0, Math.max(0, Math.floor(maxStacks)));
  if (criticalHit && nextStacks.length < maxStacks && durationTurns > 0) {
    nextStacks.push(Math.floor(durationTurns));
  }
  return nextStacks;
}

export type AstralLeggingsSkillResolution = {
  triggered: boolean;
  healing: number;
  nextSkillCritRateBonusPercent: number;
};

export function resolveAstralLeggingsSkillEffect(
  ability: EquipmentSpecialAbility | undefined,
  maxHealth: number,
  activeSkillCast: boolean,
  randomValue = Math.random()
): AstralLeggingsSkillResolution {
  const chance = ability?.effects.astralSkillHealChancePercent ?? 0;
  const triggered = Boolean(
    ability?.id === "astral-leggings" &&
      activeSkillCast &&
      chance > 0 &&
      randomValue < chance / 100
  );
  return {
    triggered,
    healing: triggered
      ? Math.max(
          1,
          Math.floor(
            maxHealth *
              ((ability?.effects.astralSkillHealMaxHealthPercent ?? 8) / 100)
          )
        )
      : 0,
    nextSkillCritRateBonusPercent: triggered
      ? (ability?.effects.astralNextSkillCritRateBonusPercent ?? 10)
      : 0,
  };
}

export type ShadowmoonEvasionResolution = {
  triggered: boolean;
  damageTaken: number;
};

export function resolveShadowmoonLethalEvasion(
  ability: EquipmentSpecialAbility | undefined,
  healthBeforeDamage: number,
  incomingDamage: number,
  randomValue = Math.random()
): ShadowmoonEvasionResolution {
  const chance = ability?.effects.shadowmoonLethalEvasionChancePercent ?? 0;
  const isLethal =
    healthBeforeDamage > 0 && incomingDamage >= healthBeforeDamage;
  const triggered = Boolean(
    ability?.id === "shadowmoon-leggings" &&
      isLethal &&
      chance > 0 &&
      randomValue < chance / 100
  );
  return {
    triggered,
    damageTaken: triggered ? 0 : Math.max(0, incomingDamage),
  };
}

export function rollSolarEyeProc(
  ability: EquipmentSpecialAbility | undefined,
  dealtDamage: boolean,
  randomValue = Math.random()
): boolean {
  const chance = ability?.effects.solarEyeProcChancePercent ?? 0;
  return Boolean(
    ability?.id === "solar-eye" &&
      dealtDamage &&
      chance > 0 &&
      randomValue < chance / 100
  );
}

export function rollMedusaEyeProc(
  ability: EquipmentSpecialAbility | undefined,
  attackHitOrDodged: boolean,
  randomValue = Math.random()
): boolean {
  const chance = ability?.effects.medusaEyeProcChancePercent ?? 0;
  return Boolean(
    ability?.id === "medusa-eye" &&
      attackHitOrDodged &&
      chance > 0 &&
      randomValue < chance / 100
  );
}

export function getLeviathanHealing(
  ability: EquipmentSpecialAbility | undefined,
  maxHealth: number,
  currentHealth: number,
  turn: number
): number {
  const interval = ability?.effects.leviathanHealIntervalTurns ?? 0;
  if (
    ability?.id !== "leviathan-heart" ||
    interval <= 0 ||
    turn % interval !== 0
  )
    return 0;
  const isLowHealth =
    currentHealth <
    maxHealth *
      ((ability.effects.leviathanLowHealthThresholdPercent ?? 30) / 100);
  const multiplier = isLowHealth
    ? (ability.effects.leviathanLowHealthHealMultiplier ?? 2)
    : 1;
  return Math.max(
    1,
    Math.floor(
      maxHealth *
        ((ability.effects.leviathanHealMaxHealthPercent ?? 4) / 100) *
        multiplier
    )
  );
}

export function rollSpacetimeReversal(
  ability: EquipmentSpecialAbility | undefined,
  healthBeforeDamage: number,
  incomingDamage: number,
  alreadyUsed: boolean,
  randomValue = Math.random()
): boolean {
  const chance = ability?.effects.spacetimeReversalChancePercent ?? 0;
  return Boolean(
    ability?.id === "spacetime-crystal" &&
      !alreadyUsed &&
      healthBeforeDamage > 0 &&
      incomingDamage >= healthBeforeDamage &&
      chance > 0 &&
      randomValue < chance / 100
  );
}

export function getStarCoreShieldGain(
  ability: EquipmentSpecialAbility | undefined,
  intelligence: number,
  skillCast: boolean
): number {
  return ability?.id === "eternal-star-core" && skillCast
    ? Math.max(
        1,
        Math.floor(
          intelligence *
            ((ability.effects.starCoreShieldPercentIntelligence ?? 50) / 100)
        )
      )
    : 0;
}

export type StarCoreShieldResolution = {
  shieldRemaining: number;
  damageRemaining: number;
  absorbedDamage: number;
};

export function resolveStarCoreShieldDamage(
  currentShield: number,
  incomingDamage: number
): StarCoreShieldResolution {
  const shield = Math.max(0, currentShield);
  const damage = Math.max(0, incomingDamage);
  const absorbedDamage = Math.min(shield, damage);
  return {
    shieldRemaining: shield - absorbedDamage,
    damageRemaining: damage - absorbedDamage,
    absorbedDamage,
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
