import {
  getLegendaryWeaponAbility,
  getLegendaryWeaponAbilityIdByName,
} from "./equipment-weapon-abilities";

export type EquipmentSpecialAbilityId =
  | "law-calibration"
  | "void-gaze"
  | "omniscient-vision"
  | "titan-awe"
  | "blood-god-frenzy"
  | "myriad-cosmos"
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
  | "moon-stalker-staff"
  | "astral-sage-vision"
  | "astral-sage-chest"
  | "astral-sage-leggings"
  | "deep-sea-star-core"
  | "astral-sage-sword"
  | "astral-sage-dagger"
  | "astral-sage-bow"
  | "astral-sage-staff"
  | "titan-bastion-helmet"
  | "titan-bastion-chest"
  | "titan-bastion-leggings"
  | "titan-bastion-amulet"
  | "titan-bastion-sword"
  | "titan-bastion-dagger"
  | "titan-bastion-bow"
  | "titan-bastion-staff"
  | "storm-sword-soul-helmet"
  | "storm-sword-soul-chest"
  | "storm-sword-soul-leggings"
  | "storm-sword-soul-amulet"
  | "storm-sword-soul-sword"
  | "storm-sword-soul-dagger"
  | "storm-sword-soul-bow"
  | "storm-sword-soul-staff"
  | "azure-dragon-helmet"
  | "azure-dragon-chest"
  | "azure-dragon-leggings"
  | "azure-dragon-amulet"
  | "azure-dragon-bow"
  | "genesis-immortal-chest"
  | "void-phase-chest"
  | "omniscient-elemental-chest"
  | "eternal-fortress-chest"
  | "slaying-armor-chest"
  | "star-creation-chest";

export type EquipmentSpecialAbilityEffects = {
  lawCalibrationIntervalTurns?: number;
  lawCalibrationStatBonusPercent?: number;
  lawCalibrationMaxStacks?: number;
  voidGazeCritAfterDodge?: boolean;
  voidGazeDefensePiercePercent?: number;
  omniscientSkillRefreshChancePercent?: number;
  omniscientSkillDamageBonusPercent?: number;
  titanAweCritDamageReductionPercent?: number;
  titanAweEnemyAttackReductionPercent?: number;
  titanAweDurationTurns?: number;
  bloodFrenzyLifeLossStepPercent?: number;
  bloodFrenzyLifestealPerStepPercent?: number;
  bloodFrenzyDamagePerStepPercent?: number;
  bloodFrenzyMaxStacks?: number;
  myriadShieldIntelligencePercent?: number;
  myriadShieldDamageReductionPercent?: number;
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
  astralSageSkillProcChancePercent?: number;
  astralSageCooldownReductionTurns?: number;
  astralSageNextAttackDamageBonusPercent?: number;
  astralSageChestShieldConversionPercent?: number;
  astralSageChestHighHealthThresholdPercent?: number;
  astralSageChestDamageReductionPercent?: number;
  astralSageLeggingsAttackBonusPercent?: number;
  astralSageLeggingsDotDamagePercentIntelligence?: number;
  astralSageLeggingsDotDurationTurns?: number;
  deepSeaStarCoreHealthThresholdPercent?: number;
  deepSeaStarCoreShieldMaxHealthPercent?: number;
  astralSageSwordStrengthToMagicPercent?: number;
  astralSageSwordBurstChancePercent?: number;
  astralSageSwordBurstDamagePercentStrength?: number;
  astralSageDaggerPoisonMaxHealthPercent?: number;
  astralSageDaggerMagicResistanceReductionPercent?: number;
  astralSageDaggerPoisonDurationTurns?: number;
  astralSageBowBonusDamagePercentIntelligence?: number;
  astralSageBowMagicResistancePiercePercent?: number;
  astralSageStaffCastsPerEcho?: number;
  titanHelmetShieldFromDamagePercent?: number;
  titanHelmetShieldDurationTurns?: number;
  titanChestHitsToTrigger?: number;
  titanChestShieldDefenseMultiplier?: number;
  titanChestShieldDurationTurns?: number;
  titanChestCooldownTurns?: number;
  titanLeggingsHealMaxHealthPercent?: number;
  titanAmuletDefenseToAttackPercent?: number;
  titanAmuletDamageBonusHigherHealthPercent?: number;
  titanSwordTrueDamageDefensePercent?: number;
  titanSwordStunChanceOnCriticalPercent?: number;
  titanSwordStunDurationTurns?: number;
  titanDaggerCounterChancePercent?: number;
  titanDaggerCounterDamageDefensePercent?: number;
  titanDaggerDefenseReductionPercent?: number;
  titanDaggerEffectDurationTurns?: number;
  titanBowDamageBonusDefensePercent?: number;
  titanBowEnemyDamageReductionPercent?: number;
  titanBowEffectDurationTurns?: number;
  titanStaffShieldDefensePercent?: number;
  titanStaffAoeDamagePercentDefenseAndIntelligence?: number;
  titanStaffEffectDurationTurns?: number;
  stormHelmetHealPercent?: number;
  stormHelmetGuaranteedCritAttacks?: number;
  stormChestMaxStacks?: number;
  stormChestDodgePercentPerStack?: number;
  stormChestSingleTargetDamageReductionAtMaxStacks?: number;
  stormLeggingsBonusDamagePercentStrength?: number;
  stormLeggingsParalysisChancePercent?: number;
  stormLeggingsParalysisDurationTurns?: number;
  stormAmuletProcChancePercent?: number;
  stormAmuletCooldownReductionTurns?: number;
  stormAmuletAttackBonusPercent?: number;
  stormAmuletMaxStacks?: number;
  stormAmuletDurationTurns?: number;
  stormSwordProcChancePercent?: number;
  stormSwordAoeDamagePercentStrength?: number;
  stormDaggerProcChancePercent?: number;
  stormDaggerTrueDamagePercentAttack?: number;
  stormDaggerCriticalDamageTakenBonusPercent?: number;
  stormDaggerDurationTurns?: number;
  stormBowProcChancePercent?: number;
  stormBowTrueDamagePercentAttack?: number;
  stormStaffProcChancePercent?: number;
  stormStaffChainDamagePercentSkill?: number;
  stormStaffMaxAdditionalBounces?: number;
  stormStaffSingleTargetExplosionPercentIntelligence?: number;
  azureDragonAttackBonusAbove60HealthPercent?: number;
  azureDragonDefenseBonusAbove60HealthPercent?: number;
  azureDragonShieldBelowHealthThresholdPercent?: number;
  azureDragonShieldBelow40HealthPercentMaxHealth?: number;
  azureDragonShieldDurationTurns?: number;
  azureDragonChestProcChancePercent?: number;
  azureDragonEnemyDamageReductionPercent?: number;
  azureDragonEnemyDefenseReductionPercent?: number;
  azureDragonChestDurationTurns?: number;
  azureDragonLeggingsCritRateBonusOnDodgePercent?: number;
  azureDragonLeggingsBonusDamagePercentStrengthAndIntelligence?: number;
  azureDragonAmuletConversionPercent?: number;
  azureDragonAmuletHealChancePercent?: number;
  azureDragonAmuletHealMaxHealthPercent?: number;
  azureDragonBowProcChancePercent?: number;
  azureDragonBowAoeDamagePercentStrengthAndIntelligence?: number;
  azureDragonBowCritDamageTakenBonusPercent?: number;
  azureDragonBowDurationTurns?: number;
  genesisBodyHealPercent?: number;
  genesisBodyInvulnerabilityTurns?: number;
  voidArmorDodgeRateBonusPercent?: number;
  voidArmorCooldownRefreshIntervalMs?: number;
  omniscientChestSkillDamageBonusPerStackPercent?: number;
  omniscientChestMaxStacks?: number;
  omniscientChestNextSkillTrueDamagePercent?: number;
  eternalFortressDamageReductionPercentPerStack?: number;
  eternalFortressMaxStacks?: number;
  eternalFortressMaxStackDamageReductionPercent?: number;
  slayingArmorSelfDamageMaxHealthPercent?: number;
  slayingArmorBonusDamageMaxHealthPercent?: number;
  slayingArmorLifestealPercent?: number;
  starCreationIntervalTurns?: number;
  starCreationDefenseDamagePercent?: number;
  starCreationStrengthDamagePercent?: number;
  starCreationHealingPercent?: number;
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
      (helmetAbilityId === "skill-cooldown" &&
        leggingsAbilityId === "astral-leggings") ||
      (helmetAbilityId === "astral-sage-vision" &&
        leggingsAbilityId === "astral-sage-leggings"),
    mountain:
      helmetAbilityId === "low-health-resistance" &&
      leggingsAbilityId === "mountain-leggings",
    gale:
      chestAbilityId === "gale-dancer" && leggingsAbilityId === "gale-leggings",
  };
}

export type AstralEnergyResolution = {
  energyStacksForAction: number;
  nextEnergyStacks: number;
  meteorTriggered: boolean;
};

export function resolveAstralEnergyAction(
  currentStacks: number,
  castsSkill: boolean,
  damageSkill: boolean,
  twoPieceActive: boolean,
  fourPieceActive: boolean
): AstralEnergyResolution {
  const current = Math.min(4, Math.max(0, Math.floor(currentStacks)));
  const meteorTriggered = fourPieceActive && damageSkill && current >= 4;
  const energyStacksForAction = twoPieceActive
    ? Math.min(4, current + (castsSkill && !meteorTriggered ? 1 : 0))
    : 0;
  const nextEnergyStacks = !twoPieceActive
    ? 0
    : meteorTriggered
      ? 0
      : energyStacksForAction;
  return { energyStacksForAction, nextEnergyStacks, meteorTriggered };
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
  "law-calibration": {
    id: "law-calibration",
    name: "法則校準",
    description: "每 3 回合淨化自身 1 個負面狀態，並使力量、智力與防禦提升 10%，最多疊加 30%。",
    effects: { lawCalibrationIntervalTurns: 3, lawCalibrationStatBonusPercent: 10, lawCalibrationMaxStacks: 3 },
  },
  "void-gaze": {
    id: "void-gaze", name: "虛空凝視",
    description: "成功閃避敵人攻擊後，下一次普通攻擊或技能必定暴擊，並無視目標 25% 物理與魔法防禦。",
    effects: { voidGazeCritAfterDodge: true, voidGazeDefensePiercePercent: 25 },
  },
  "omniscient-vision": {
    id: "omniscient-vision", name: "全知視界",
    description: "施放技能時有 35% 機率刷新冷卻，並使該次技能傷害提升 30%。",
    effects: { omniscientSkillRefreshChancePercent: 35, omniscientSkillDamageBonusPercent: 30 },
  },
  "titan-awe": {
    id: "titan-awe", name: "泰坦威壓",
    description: "受到暴擊時，使該次暴擊傷害降低 80%，並降低敵人攻擊 15%，持續 3 回合。",
    effects: { titanAweCritDamageReductionPercent: 80, titanAweEnemyAttackReductionPercent: 15, titanAweDurationTurns: 3 },
  },
  "blood-god-frenzy": {
    id: "blood-god-frenzy", name: "嗜血狂熱",
    description: "每損失 10% 最大生命值，獲得 6% 物理吸血與 5% 物理傷害加成，最高 5 層。",
    effects: { bloodFrenzyLifeLossStepPercent: 10, bloodFrenzyLifestealPerStepPercent: 6, bloodFrenzyDamagePerStepPercent: 5, bloodFrenzyMaxStacks: 5 },
  },
  "myriad-cosmos": {
    id: "myriad-cosmos", name: "萬象森羅",
    description: "戰鬥開始時獲得相當於智力 60% 的額外魔法護盾；護盾存在期間，受到傷害減少 15%。",
    effects: { myriadShieldIntelligencePercent: 60, myriadShieldDamageReductionPercent: 15 },
  },
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
  "astral-sage-vision": {
    id: "astral-sage-vision",
    name: "星辰啟示",
    description:
      "施放技能後有 30% 機率使該技能冷卻立即減少 2 回合，並使下一擊傷害提高 15%。",
    effects: {
      astralSageSkillProcChancePercent: 30,
      astralSageCooldownReductionTurns: 2,
      astralSageNextAttackDamageBonusPercent: 15,
    },
  },
  "astral-sage-chest": {
    id: "astral-sage-chest",
    name: "真理視界",
    description:
      "受到攻擊時將所受傷害的 15% 轉為護盾；生命高於 70% 時，奧術護盾使受到傷害降低 20%。",
    effects: {
      astralSageChestShieldConversionPercent: 15,
      astralSageChestHighHealthThresholdPercent: 70,
      astralSageChestDamageReductionPercent: 20,
      enemyDamageReductionAbove70HealthPercent: 20,
    },
  },
  "astral-sage-leggings": {
    id: "astral-sage-leggings",
    name: "星軌步履",
    description:
      "施放攻擊後留下星光殘留：攻擊提高 12%，目標每回合受到相當於智力 60% 的奧術傷害，持續 3 回合。",
    effects: {
      astralSageLeggingsAttackBonusPercent: 12,
      astralSageLeggingsDotDamagePercentIntelligence: 60,
      astralSageLeggingsDotDurationTurns: 3,
    },
  },
  "deep-sea-star-core": {
    id: "deep-sea-star-core",
    name: "深海星核",
    description:
      "生命值低於 40% 時觸發深海庇護，獲得相當於最大生命值 10% 的護盾。",
    effects: {
      deepSeaStarCoreHealthThresholdPercent: 40,
      deepSeaStarCoreShieldMaxHealthPercent: 10,
    },
  },
  "astral-sage-sword": {
    id: "astral-sage-sword",
    name: "星輝魔刃",
    description:
      "力量的 30% 額外轉為魔法攻擊；普通攻擊與技能有 25% 機率造成物理與奧術雙重爆發。",
    effects: {
      astralSageSwordStrengthToMagicPercent: 30,
      astralSageSwordBurstChancePercent: 25,
      astralSageSwordBurstDamagePercentStrength: 30,
    },
  },
  "astral-sage-dagger": {
    id: "astral-sage-dagger",
    name: "毒棘星閃",
    description:
      "暴擊時施加星毒 3 回合，每回合造成目標最大生命 5% 的真實奧術傷害，並降低魔法抗性 15%。",
    effects: {
      astralSageDaggerPoisonMaxHealthPercent: 5,
      astralSageDaggerMagicResistanceReductionPercent: 15,
      astralSageDaggerPoisonDurationTurns: 3,
    },
  },
  "astral-sage-bow": {
    id: "astral-sage-bow",
    name: "月弦星箭",
    description:
      "普通攻擊額外造成相當於智力 120% 的魔法傷害，無視目標 20% 魔法防禦。",
    effects: {
      astralSageBowBonusDamagePercentIntelligence: 120,
      astralSageBowMagicResistancePiercePercent: 20,
    },
  },
  "astral-sage-staff": {
    id: "astral-sage-staff",
    name: "奧術共鳴",
    description: "每連續施放 2 次技能後，第 3 次技能連續施放兩次且不進入冷卻。",
    effects: { astralSageStaffCastsPerEcho: 2 },
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
  "titan-bastion-helmet": {
    id: "titan-bastion-helmet",
    name: "山脈硬化",
    description: "受到傷害時，將該次傷害的 12% 轉化為護盾，持續 3 回合。",
    effects: {
      titanHelmetShieldFromDamagePercent: 12,
      titanHelmetShieldDurationTurns: 3,
    },
  },
  "titan-bastion-chest": {
    id: "titan-bastion-chest",
    name: "巨神守護",
    description:
      "每受擊 4 次，獲得總防禦力 300% 的護盾，持續 2 回合；冷卻 5 回合。",
    effects: {
      titanChestHitsToTrigger: 4,
      titanChestShieldDefenseMultiplier: 300,
      titanChestShieldDurationTurns: 2,
      titanChestCooldownTurns: 5,
    },
  },
  "titan-bastion-leggings": {
    id: "titan-bastion-leggings",
    name: "不動根基",
    description:
      "免疫所有負面與控制效果；每回合恢復最大生命值 5%，防禦力提高 10%。",
    effects: { titanLeggingsHealMaxHealthPercent: 5 },
  },
  "titan-bastion-amulet": {
    id: "titan-bastion-amulet",
    name: "巨獸獵殺",
    description:
      "將總防禦力的 15% 轉化為額外力量與智力；攻擊生命百分比高於自己的敵人時，傷害提高 18%。",
    effects: {
      titanAmuletDefenseToAttackPercent: 15,
      titanAmuletDamageBonusHigherHealthPercent: 18,
    },
  },
  "storm-sword-soul-helmet": {
    id: "storm-sword-soul-helmet",
    name: "風暴涅槃",
    description:
      "受到致命傷害時免疫該次傷害並恢復 20% 生命值；接下來 3 次攻擊必定暴擊，每場戰鬥限一次。",
    effects: {
      preventLethalDamageOnce: true,
      stormHelmetHealPercent: 20,
      stormHelmetGuaranteedCritAttacks: 3,
    },
  },
  "storm-sword-soul-chest": {
    id: "storm-sword-soul-chest",
    name: "疾風氣勁",
    description:
      "每次攻擊或施放技能獲得 1 層疾風（最多 5 層），每層閃避率 +3%；滿層時承受的單體傷害降低 15%。",
    effects: {
      stormChestMaxStacks: 5,
      stormChestDodgePercentPerStack: 3,
      stormChestSingleTargetDamageReductionAtMaxStacks: 15,
    },
  },
  "storm-sword-soul-leggings": {
    id: "storm-sword-soul-leggings",
    name: "風雷一擊",
    description:
      "成功閃避後，下一次攻擊追加力量 50% 的物理傷害，並有 50% 機率使目標麻痺 3 回合；麻痺另有 50% 機率令目標暈眩 1 回合。",
    effects: {
      stormLeggingsBonusDamagePercentStrength: 50,
      stormLeggingsParalysisChancePercent: 50,
      stormLeggingsParalysisDurationTurns: 3,
    },
  },
  "storm-sword-soul-amulet": {
    id: "storm-sword-soul-amulet",
    name: "時空雷印",
    description:
      "每次暴擊有 25% 機率使所有冷卻中的技能減少 1 回合，並獲得 1 層攻擊 +10% 增益（最多 3 層，持續 3 回合）。",
    effects: {
      stormAmuletProcChancePercent: 25,
      stormAmuletCooldownReductionTurns: 1,
      stormAmuletAttackBonusPercent: 10,
      stormAmuletMaxStacks: 3,
      stormAmuletDurationTurns: 3,
    },
  },
  "azure-dragon-helmet": {
    id: "azure-dragon-helmet",
    name: "天穹龍威",
    description:
      "生命高於 60% 時攻擊力與防禦力 +10%；生命低於 40% 時獲得最大生命值 10% 的天命護盾，持續 3 回合，每回合最多觸發一次。",
    effects: {
      azureDragonAttackBonusAbove60HealthPercent: 10,
      azureDragonDefenseBonusAbove60HealthPercent: 10,
      azureDragonShieldBelowHealthThresholdPercent: 40,
      azureDragonShieldBelow40HealthPercentMaxHealth: 10,
      azureDragonShieldDurationTurns: 3,
    },
  },
  "azure-dragon-chest": {
    id: "azure-dragon-chest",
    name: "神諭龍鎧",
    description:
      "受到攻擊時有 25% 機率使攻擊者造成傷害降低 15%、防禦力降低 10%，持續 2 回合。",
    effects: {
      azureDragonChestProcChancePercent: 25,
      azureDragonEnemyDamageReductionPercent: 15,
      azureDragonEnemyDefenseReductionPercent: 10,
      azureDragonChestDurationTurns: 2,
    },
  },
  "genesis-immortal-chest": {
    id: "genesis-immortal-chest", name: "不朽神格",
    description: "每場戰鬥首次受到致命傷害時，恢復最大生命值 20%、清除負面狀態，並獲得 1 回合無敵。",
    effects: { genesisBodyHealPercent: 20, genesisBodyInvulnerabilityTurns: 1 },
  },
  "void-phase-chest": {
    id: "void-phase-chest", name: "相位轉移",
    description: "閃避率提高 10%；成功閃避時刷新所有技能冷卻（每 2 秒最多觸發一次）。",
    effects: { voidArmorDodgeRateBonusPercent: 10, voidArmorCooldownRefreshIntervalMs: 2000 },
  },
  "omniscient-elemental-chest": {
    id: "omniscient-elemental-chest", name: "元素共鳴",
    description: "施放技能獲得 1 層元素共鳴，每層技能傷害 +8%，最多 3 層；滿層後下一個傷害技能追加相當於該技能傷害 60% 的真實傷害。",
    effects: { omniscientChestSkillDamageBonusPerStackPercent: 8, omniscientChestMaxStacks: 3, omniscientChestNextSkillTrueDamagePercent: 60 },
  },
  "eternal-fortress-chest": {
    id: "eternal-fortress-chest", name: "不動如山",
    description: "每回合及受到傷害時獲得 1 層岩甲；每層使物理與魔法減傷 +3%，最多 10 層，滿層時額外減傷 20%。",
    effects: { eternalFortressDamageReductionPercentPerStack: 3, eternalFortressMaxStacks: 10, eternalFortressMaxStackDamageReductionPercent: 20 },
  },
  "slaying-armor-chest": {
    id: "slaying-armor-chest", name: "血肉獻祭",
    description: "每回合損失最大生命值 8%；攻擊額外造成最大生命值 5% 的物理傷害，命中後恢復該次攻擊傷害的 10%。",
    effects: { slayingArmorSelfDamageMaxHealthPercent: 8, slayingArmorBonusDamageMaxHealthPercent: 5, slayingArmorLifestealPercent: 10 },
  },
  "star-creation-chest": {
    id: "star-creation-chest", name: "星辰力場",
    description: "每 3 回合生成持續 1 回合的星輝，對敵人造成防禦力 40% + 力量 30% 傷害，並恢復造成傷害總量的 5%。",
    effects: { starCreationIntervalTurns: 3, starCreationDefenseDamagePercent: 40, starCreationStrengthDamagePercent: 30, starCreationHealingPercent: 5 },
  },
  "azure-dragon-leggings": {
    id: "azure-dragon-leggings",
    name: "影月龍行",
    description:
      "成功閃避後，下一次攻擊暴擊率 +25%，並額外造成自身力量與智力總和 50% 的傷害。",
    effects: {
      azureDragonLeggingsCritRateBonusOnDodgePercent: 25,
      azureDragonLeggingsBonusDamagePercentStrengthAndIntelligence: 50,
    },
  },
  "azure-dragon-amulet": {
    id: "azure-dragon-amulet",
    name: "星核龍脈",
    description:
      "力量的 20% 轉化為智力、智力的 20% 轉化為力量；每施放技能或觸發暴擊時有 35% 機率恢復最大生命值 3%。",
    effects: {
      azureDragonAmuletConversionPercent: 20,
      azureDragonAmuletHealChancePercent: 35,
      azureDragonAmuletHealMaxHealthPercent: 3,
    },
  },
};

const abilityIdsByEquipmentName: Record<string, EquipmentSpecialAbilityId> = {
  "創世者·秩序之冠": "law-calibration",
  "虛空之主·終焉面具": "void-gaze",
  "全知者·真理之冠": "omniscient-vision",
  "滅世巨神·荒古重盔 (極品)": "titan-awe",
  "末日狂刃·血神之面 (極品)": "blood-god-frenzy",
  萬象冠冕: "myriad-cosmos",
  阿修羅戰神兜盔: "low-health-damage",
  "曙光聖衛·傳說盔": "dawn-guardian-vision",
  夜魔主宰面具: "low-health-lifesteal",
  "影月獵行·傳說盔": "moon-stalker-vision",
  星辰智者之冠: "skill-cooldown",
  "星界賢者·傳說盔": "astral-sage-vision",
  永恆山脈巨盔: "low-health-resistance",
  "鐵壁巨神·傳說盔": "titan-bastion-helmet",
  鳳凰涅槃面具: "phoenix-rebirth",
  "風暴劍魂·傳說盔": "storm-sword-soul-helmet",
  天穹王盔: "high-health-dominance",
  "蒼龍天命·傳說盔": "azure-dragon-helmet",
  帝王光輝聖甲: "imperial-pressure",
  "曙光聖衛·傳說胸甲": "dawn-guardian-armor",
  深淵獵手皮革: "abyssal-counter",
  "影月獵行·傳說胸甲": "moon-stalker-chest",
  真理之門法袍: "truth-awakening",
  "星界賢者·傳說胸甲": "astral-sage-chest",
  神聖守護者之壁: "sacred-wall",
  "鐵壁巨神·傳說胸甲": "titan-bastion-chest",
  疾風劍聖法衣: "gale-dancer",
  "風暴劍魂·傳說胸甲": "storm-sword-soul-chest",
  神諭聖甲: "oracle-blessing",
  "蒼龍天命·傳說胸甲": "azure-dragon-chest",
  "創世者·不朽聖軀": "genesis-immortal-chest",
  "虛空之主·無形影甲": "void-phase-chest",
  "全知者·元素起源法袍": "omniscient-elemental-chest",
  "滅世巨神·永恆堡壘 (極品)": "eternal-fortress-chest",
  "末日狂刃·屠戮胸甲 (極品)": "slaying-armor-chest",
  "創星神鎧": "star-creation-chest",
  阿修羅戰神護腿: "asura-leggings",
  "曙光聖衛·傳說護腿": "dawn-guardian-step",
  夜魔主宰護腿: "night-leggings",
  "影月獵行·傳說護腿": "moon-stalker-leggings",
  星辰智者長褲: "astral-leggings",
  "星界賢者·傳說護腿": "astral-sage-leggings",
  永恆山脈護腿: "mountain-leggings",
  "鐵壁巨神·傳說護腿": "titan-bastion-leggings",
  疾風劍聖護腿: "gale-leggings",
  "風暴劍魂·傳說護腿": "storm-sword-soul-leggings",
  影月護腿: "shadowmoon-leggings",
  "蒼龍天命·傳說護腿": "azure-dragon-leggings",
  太陽神之眼: "solar-eye",
  美杜莎之瞳: "medusa-eye",
  利維坦之心: "leviathan-heart",
  獵王之牙: "hunter-king-fang",
  時空交界水晶: "spacetime-crystal",
  永恆星核: "eternal-star-core",
  "曙光聖衛·傳說徽記": "dawn-guardian-sunmark",
  "星界賢者·傳說徽記": "deep-sea-star-core",
  "影月獵行·傳說徽記": "moon-stalker-amulet",
  "鐵壁巨神·傳說徽記": "titan-bastion-amulet",
  "風暴劍魂·傳說徽記": "storm-sword-soul-amulet",
  "蒼龍天命·傳說徽記": "azure-dragon-amulet",
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
  const mappedId = getEquipmentSpecialAbilityIdByName(equipmentName);
  const mythicNames = new Set([
    "創世者·秩序之冠", "虛空之主·終焉面具", "全知者·真理之冠",
    "滅世巨神·荒古重盔 (極品)", "末日狂刃·血神之面 (極品)", "萬象冠冕",
    "創世者·不朽聖軀", "虛空之主·無形影甲", "全知者·元素起源法袍",
    "滅世巨神·永恆堡壘 (極品)", "末日狂刃·屠戮胸甲 (極品)", "創星神鎧",
  ]);
  const id = rarity === "神話" ? mappedId : abilityId ?? mappedId;
  if (!id || (rarity !== "傳說" && (rarity !== "神話" || !mythicNames.has(equipmentName)))) return undefined;
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
      (effects?.voidArmorDodgeRateBonusPercent ?? 0) +
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
