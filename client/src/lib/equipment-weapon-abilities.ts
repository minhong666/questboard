import type {
  EquipmentSpecialAbility,
  EquipmentSpecialAbilityId,
} from "./equipment-special-abilities";

export const weaponAbilityIdsByEquipmentName: Record<
  string,
  EquipmentSpecialAbilityId
> = {
  焚星神弓: "starfire-bow",
  "傳說·曙光劍": "dawn-sword",
  "傳說·鐵衛劍": "iron-guard-sword",
  "傳說·月影劍": "moonshadow-sword",
  "傳說·王道劍": "kings-sword",
  "傳說·星界劍": "starrealm-sword",
  "傳說·獵影短刀": "hunter-dagger",
  "傳說·迅牙短刀": "swiftfang-dagger",
  "傳說·毒棘短刀": "poison-thorn-dagger",
  "傳說·幻步短刀": "phantom-step-dagger",
  "傳說·虛空短刀": "void-dagger",
  "傳說·林風弓": "forestwind-bow",
  "傳說·沙羽弓": "sandfeather-bow",
  "傳說·月弦弓": "moonstring-bow",
  "傳說·天穹弓": "firmament-bow",
  "傳說·日輪弓": "sunwheel-bow",
  "傳說·木靈法杖": "nature-staff",
  "傳說·藍晶法杖": "sapphire-staff",
  "傳說·星語法杖": "starlight-staff",
  "傳說·炎脈法杖": "fire-vein-staff",
  "傳說·創世法杖": "genesis-staff",
};

export const legendaryWeaponAbilities: Partial<
  Record<EquipmentSpecialAbilityId, EquipmentSpecialAbility>
> = {
  "starfire-bow": {
    id: "starfire-bow",
    name: "星火燎原",
    description:
      "每次暴擊使目標燃燒 3 回合，每回合受到相當於該次暴擊傷害 15% 的火焰傷害，並使目標護甲降低 10%。",
    effects: {
      starfireBurnPercentOfCriticalDamage: 15,
      starfireDurationTurns: 3,
      starfireArmorReductionPercent: 10,
    },
  },
  "dawn-sword": {
    id: "dawn-sword",
    name: "曙光之破",
    description:
      "攻擊有 20% 機率額外造成相當於攻擊力 20% 的傷害；目標生命高於 70% 時，此額外傷害翻倍。",
    effects: {
      dawnProcChancePercent: 20,
      dawnBonusDamagePercentAttack: 20,
      dawnHighHealthThresholdPercent: 70,
      dawnHighHealthDamageMultiplier: 2,
    },
  },
  "iron-guard-sword": {
    id: "iron-guard-sword",
    name: "鐵壁防禦",
    description:
      "普通攻擊或施放物理技能後，獲得 1 層鐵壁防禦；每層使下一回合受到的物理傷害降低 10%，最多 2 層。",
    effects: {
      ironGuardDamageReductionPercentPerStack: 10,
      ironGuardMaxStacks: 2,
    },
  },
  "moonshadow-sword": {
    id: "moonshadow-sword",
    name: "月影隱匿",
    description:
      "暴擊時有 30% 機率使下一次敵方攻擊前閃避率提高 10%，並使下一次成功命中的攻擊傷害提高 20%。",
    effects: {
      moonshadowProcChancePercent: 30,
      moonshadowDodgeRateBonusPercent: 10,
      moonshadowNextAttackDamageBonusPercent: 20,
    },
  },
  "kings-sword": {
    id: "kings-sword",
    name: "王道壓制",
    description: "攻擊生命值低於 50% 的目標時，暴擊傷害額外提高 25%。",
    effects: {
      kingsSwordTargetHealthBelowPercent: 50,
      kingsSwordCritDamageBonusPercent: 25,
    },
  },
  "starrealm-sword": {
    id: "starrealm-sword",
    name: "星界能量",
    description:
      "每次成功暴擊獲得 1 層星界能量；累積 3 層時消耗全部能量，對所有敵人造成相當於攻擊力 80% 的傷害。",
    effects: {
      starrealmMaxStacks: 3,
      starrealmAoeAttackPercent: 80,
    },
  },
  "hunter-dagger": {
    id: "hunter-dagger",
    name: "獵影本能",
    description:
      "每次成功暴擊後，戰鬥期間暴擊率與暴擊傷害各提高 15%（暴擊率最高 100%）。",
    effects: {
      hunterCritRateBonusPerCriticalPercent: 15,
      hunterCritDamageBonusPerCriticalPercent: 15,
    },
  },
  "swiftfang-dagger": {
    id: "swiftfang-dagger",
    name: "迅捷牙襲",
    description: "暴擊後，攻擊提高 20%、閃避率提高 5%，持續 2 回合。",
    effects: {
      swiftfangAttackBonusPercent: 20,
      swiftfangDodgeRateBonusPercent: 5,
      swiftfangDurationTurns: 2,
    },
  },
  "poison-thorn-dagger": {
    id: "poison-thorn-dagger",
    name: "劇毒",
    description:
      "暴擊時使目標中毒 3 回合，每回合受到相當於該次攻擊傷害 3% 的毒傷，並使目標受到的治療降低 15%。",
    effects: {
      poisonThornDamagePercentOfHit: 3,
      poisonThornHealingReceivedReductionPercent: 15,
      poisonThornDurationTurns: 3,
    },
  },
  "phantom-step-dagger": {
    id: "phantom-step-dagger",
    name: "幻步重擊",
    description:
      "成功閃避後，下一次攻擊的暴擊率提高 50%，並無視目標 20% 防禦。",
    effects: {
      phantomStepNextAttackCritRateBonusPercent: 50,
      phantomStepDefensePiercePercent: 20,
    },
  },
  "void-dagger": {
    id: "void-dagger",
    name: "虛空衰弱",
    description: "暴擊時有 25% 機率使目標造成的傷害降低 15%，持續 2 回合。",
    effects: {
      voidDaggerProcChancePercent: 25,
      voidDaggerOutgoingDamageReductionPercent: 15,
      voidDaggerDurationTurns: 2,
    },
  },
  "forestwind-bow": {
    id: "forestwind-bow",
    name: "林風蓄勢",
    description: "每回合造成的傷害提高 5%，最高提高 30%。",
    effects: {
      forestwindDamageBonusPerTurnPercent: 5,
      forestwindMaxDamageBonusPercent: 30,
    },
  },
  "sandfeather-bow": {
    id: "sandfeather-bow",
    name: "盲目沙塵",
    description: "攻擊有 25% 機率使目標命中率降低 25%，持續 2 回合。",
    effects: {
      sandfeatherProcChancePercent: 25,
      sandfeatherAccuracyReductionPercent: 25,
      sandfeatherDurationTurns: 2,
    },
  },
  "moonstring-bow": {
    id: "moonstring-bow",
    name: "月華穿透",
    description:
      "每 3 回合為下一次弓類攻擊充能，使其無視目標 25% 防禦，並使敵人下一次攻擊命中率降低 15%。",
    effects: {
      moonstringChargeIntervalTurns: 3,
      moonstringDefensePiercePercent: 25,
      moonstringNextEnemyAccuracyReductionPercent: 15,
    },
  },
  "firmament-bow": {
    id: "firmament-bow",
    name: "天穹之箭",
    description: "暴擊時召喚天穹之箭，額外造成相當於自身力量 50% 的物理傷害。",
    effects: { firmamentBonusDamagePercentStrength: 50 },
  },
  "sunwheel-bow": {
    id: "sunwheel-bow",
    name: "日輪灼燒",
    description:
      "普通攻擊或技能有 30% 機率使目標燃燒 2 回合，每回合受到相當於攻擊力 5% 的火焰傷害；自身暴擊率提高 10%，持續 2 回合。",
    effects: {
      sunwheelProcChancePercent: 30,
      sunwheelBurnPercentAttack: 5,
      sunwheelDurationTurns: 2,
      sunwheelCritRateBonusPercent: 10,
    },
  },
  "nature-staff": {
    id: "nature-staff",
    name: "自然復甦",
    description: "施放技能時有 35% 機率恢復相當於自身智力 30% 的生命。",
    effects: {
      natureStaffHealChancePercent: 35,
      natureStaffHealPercentIntelligence: 30,
    },
  },
  "sapphire-staff": {
    id: "sapphire-staff",
    name: "霜封",
    description:
      "造成傷害時有 20% 機率使目標凍結 2 回合；對已凍結目標造成的魔法傷害提高 20%。",
    effects: {
      sapphireStaffFreezeChancePercent: 20,
      sapphireStaffFreezeDurationTurns: 2,
      sapphireStaffDamageBonusVsFrozenPercent: 20,
    },
  },
  "starlight-staff": {
    id: "starlight-staff",
    name: "星語共鳴",
    description: "每施放 3 次技能，下一次技能不進入冷卻且傷害提高 30%。",
    effects: {
      starlightStaffCastsPerEcho: 3,
      starlightStaffEchoDamageBonusPercent: 30,
    },
  },
  "fire-vein-staff": {
    id: "fire-vein-staff",
    name: "炎脈印記",
    description:
      "成功施放造成傷害的技能時累積 1 層灼燒印記；達 5 層時消耗全部印記，對所有敵人造成相當於自身魔法攻擊 100% 的範圍爆發傷害。",
    effects: {
      fireVeinMarksToBurst: 5,
      fireVeinAoeMagicAttackPercent: 100,
    },
  },
  "genesis-staff": {
    id: "genesis-staff",
    name: "創世天雷",
    description:
      "施放雷電技能時有 25% 機率引發彈跳雷擊，對目標與最多 3 名其他敵人各造成 30 點魔法傷害；每名受擊者另有 15% 機率麻痺 1 回合。",
    effects: {
      genesisStaffProcChancePercent: 25,
      genesisStaffBonusMagicDamage: 30,
      genesisStaffMaxAdditionalTargets: 3,
      genesisStaffParalysisChancePercent: 15,
      genesisStaffParalysisDurationTurns: 1,
    },
  },
};

export function getLegendaryWeaponAbilityIdByName(
  equipmentName: string
): EquipmentSpecialAbilityId | undefined {
  return weaponAbilityIdsByEquipmentName[equipmentName];
}

export function getLegendaryWeaponAbility(
  abilityId: EquipmentSpecialAbilityId
): EquipmentSpecialAbility | undefined {
  return legendaryWeaponAbilities[abilityId];
}
