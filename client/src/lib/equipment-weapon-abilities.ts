import type {
  EquipmentSpecialAbility,
  EquipmentSpecialAbilityId,
} from "./equipment-special-abilities";

export const weaponAbilityIdsByEquipmentName: Record<
  string,
  EquipmentSpecialAbilityId
> = {
  焚星神弓: "starfire-bow",
  "曙光聖衛·傳說劍": "dawn-warden-sword",
  "曙光聖衛·傳說短刀": "dawn-warden-dagger",
  "曙光聖衛·傳說弓": "dawn-warden-bow",
  "曙光聖衛·傳說法杖": "dawn-warden-staff",
  "影月獵行·傳說劍": "moon-stalker-sword",
  "影月獵行·傳說短刀": "moon-stalker-dagger",
  "影月獵行·傳說弓": "moon-stalker-bow",
  "影月獵行·傳說法杖": "moon-stalker-staff",
  "曙光聖衛·傳說劍武器": "dawn-warden-sword",
  "曙光聖衛·傳說短刀武器": "dawn-warden-dagger",
  "曙光聖衛·傳說弓武器": "dawn-warden-bow",
  "曙光聖衛·傳說法杖武器": "dawn-warden-staff",
  "影月獵行·傳說劍武器": "moon-stalker-sword",
  "影月獵行·傳說短刀武器": "moon-stalker-dagger",
  "影月獵行·傳說弓武器": "moon-stalker-bow",
  "影月獵行·傳說法杖武器": "moon-stalker-staff",
  "星界賢者·傳說劍武器": "astral-sage-sword",
  "星界賢者·傳說短刀武器": "astral-sage-dagger",
  "星界賢者·傳說弓武器": "astral-sage-bow",
  "星界賢者·傳說法杖武器": "astral-sage-staff",
  "星界賢者·傳說劍": "astral-sage-sword",
  "星界賢者·傳說短刀": "astral-sage-dagger",
  "星界賢者·傳說弓": "astral-sage-bow",
  "星界賢者·傳說法杖": "astral-sage-staff",
  "鐵壁巨神·傳說劍武器": "titan-bastion-sword",
  "鐵壁巨神·傳說短刀武器": "titan-bastion-dagger",
  "鐵壁巨神·傳說弓武器": "titan-bastion-bow",
  "鐵壁巨神·傳說法杖武器": "titan-bastion-staff",
  "風暴劍魂·傳說劍武器": "storm-sword-soul-sword",
  "風暴劍魂·傳說短刀武器": "storm-sword-soul-dagger",
  "風暴劍魂·傳說弓武器": "storm-sword-soul-bow",
  "風暴劍魂·傳說法杖武器": "storm-sword-soul-staff",
  "鐵壁巨神·傳說劍": "titan-bastion-sword",
  "鐵壁巨神·傳說短刀": "titan-bastion-dagger",
  "鐵壁巨神·傳說弓": "titan-bastion-bow",
  "鐵壁巨神·傳說法杖": "titan-bastion-staff",
  "風暴劍魂·傳說劍": "storm-sword-soul-sword",
  "風暴劍魂·傳說短刀": "storm-sword-soul-dagger",
  "風暴劍魂·傳說弓": "storm-sword-soul-bow",
  "風暴劍魂·傳說法杖": "storm-sword-soul-staff",
  "蒼龍天命·傳說弓武器": "azure-dragon-bow",
  "蒼龍天命·傳說弓": "azure-dragon-bow",
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
  "titan-bastion-sword": {
    id: "titan-bastion-sword",
    name: "王道重壓",
    description:
      "攻擊時附加總防禦力 80% 的真實物理傷害；暴擊時有 30% 機率暈眩目標 1 回合。",
    effects: {
      titanSwordTrueDamageDefensePercent: 80,
      titanSwordStunChanceOnCriticalPercent: 30,
      titanSwordStunDurationTurns: 1,
    },
  },
  "titan-bastion-dagger": {
    id: "titan-bastion-dagger",
    name: "巨力招架",
    description:
      "受擊或成功閃避時有 25% 機率反擊，造成總防禦力 200% 的傷害，並使目標防禦降低 15%，持續 2 回合。",
    effects: {
      titanDaggerCounterChancePercent: 25,
      titanDaggerCounterDamageDefensePercent: 200,
      titanDaggerDefenseReductionPercent: 15,
      titanDaggerEffectDurationTurns: 2,
    },
  },
  "titan-bastion-bow": {
    id: "titan-bastion-bow",
    name: "天穹重弩",
    description:
      "箭矢傷害附加總防禦力 100%，並使目標造成的傷害降低 12%，持續 2 回合。",
    effects: {
      titanBowDamageBonusDefensePercent: 100,
      titanBowEnemyDamageReductionPercent: 12,
      titanBowEffectDurationTurns: 2,
    },
  },
  "titan-bastion-staff": {
    id: "titan-bastion-staff",
    name: "炎脈盾壁",
    description:
      "施放技能時獲得可吸收總防禦力 150% 傷害的熔岩盾陣，持續 2 回合；同時每回合對敵人造成總防禦與智力之和 50% 的火焰傷害。",
    effects: {
      titanStaffShieldDefensePercent: 150,
      titanStaffAoeDamagePercentDefenseAndIntelligence: 50,
      titanStaffEffectDurationTurns: 2,
    },
  },
  "storm-sword-soul-sword": {
    id: "storm-sword-soul-sword",
    name: "星界風雷斬",
    description:
      "普通攻擊與傷害技能命中時有 30% 機率召喚風雷劍氣，對目標及所有附近敵人造成力量 80% 的物理傷害。",
    effects: {
      stormSwordProcChancePercent: 30,
      stormSwordAoeDamagePercentStrength: 80,
    },
  },
  "storm-sword-soul-dagger": {
    id: "storm-sword-soul-dagger",
    name: "虛空瞬影殺",
    description:
      "暴擊時有 35% 機率追加一擊，造成攻擊傷害 80% 的真實傷害，並使目標受到的暴擊傷害提高 20%，持續 2 回合。",
    effects: {
      stormDaggerProcChancePercent: 35,
      stormDaggerTrueDamagePercentAttack: 80,
      stormDaggerCriticalDamageTakenBonusPercent: 20,
      stormDaggerDurationTurns: 2,
    },
  },
  "storm-sword-soul-bow": {
    id: "storm-sword-soul-bow",
    name: "日輪風暴箭",
    description:
      "遠程攻擊命中時有 25% 機率引發太陽雷暴，對所有敵人額外造成攻擊傷害 50% 的真實傷害。",
    effects: {
      stormBowProcChancePercent: 25,
      stormBowTrueDamagePercentAttack: 50,
    },
  },
  "storm-sword-soul-staff": {
    id: "storm-sword-soul-staff",
    name: "創世雷霆鏈",
    description:
      "施放技能時有 30% 機率造成相當於技能傷害 50% 的雷霆彈跳，可額外跳躍 2 次且不衰減；若戰場僅有一名敵人，另造成智力 100% 的天雷傷害。",
    effects: {
      stormStaffProcChancePercent: 30,
      stormStaffChainDamagePercentSkill: 50,
      stormStaffMaxAdditionalBounces: 2,
      stormStaffSingleTargetExplosionPercentIntelligence: 100,
    },
  },
  "azure-dragon-bow": {
    id: "azure-dragon-bow",
    name: "焚星蒼龍破",
    description:
      "暴擊時有 35% 機率對所有敵人造成力量與智力總和 50% 的蒼龍火焰傷害，並使其受到的暴擊傷害提高 20%，持續 2 回合。",
    effects: {
      azureDragonBowProcChancePercent: 35,
      azureDragonBowAoeDamagePercentStrengthAndIntelligence: 50,
      azureDragonBowCritDamageTakenBonusPercent: 20,
      azureDragonBowDurationTurns: 2,
    },
  },
  "dawn-warden-sword": {
    id: "dawn-warden-sword",
    name: "裁決重擊",
    description:
      "普通攻擊有 20% 機率召喚巨型光劍，對所有敵人造成相當於攻擊力 150% 的範圍傷害並暈眩 1 回合。",
    effects: {
      dawnWardenSwordProcChancePercent: 20,
      dawnWardenSwordAoeDamagePercentAttack: 150,
      dawnWardenSwordStunDurationTurns: 1,
    },
  },
  "dawn-warden-dagger": {
    id: "dawn-warden-dagger",
    name: "光束殘影",
    description:
      "攻擊時有 25% 機率留下光束殘影；殘影於 1 回合後爆炸，造成相當於攻擊力 50% 的真實傷害。",
    effects: {
      dawnWardenDaggerProcChancePercent: 25,
      dawnWardenDaggerEchoDamagePercentAttack: 50,
    },
  },
  "dawn-warden-bow": {
    id: "dawn-warden-bow",
    name: "追光箭矢",
    description:
      "攻擊必定命中所有敵人；攻擊力按敵人數量分攤，每命中一名敵人後後續傷害提高 10%，最多提高 30%。",
    effects: {
      dawnWardenBowDamageBonusPerTargetPercent: 10,
      dawnWardenBowMaxDamageBonusPercent: 30,
    },
  },
  "dawn-warden-staff": {
    id: "dawn-warden-staff",
    name: "聖光陣界",
    description:
      "施放技能時使敵人每回合受到最大生命值 5% 的光系傷害，並使其造成的傷害降低 20%，持續 3 回合。",
    effects: {
      dawnWardenStaffDotMaxHealthPercent: 5,
      dawnWardenStaffDotDurationTurns: 3,
      dawnWardenStaffDamageReductionPercent: 20,
    },
  },
  "moon-stalker-sword": {
    id: "moon-stalker-sword",
    name: "月刃突襲",
    description:
      "成功閃避後以 120% 力量反擊，並使目標流血 3 回合（每回合反擊傷害 10%），受到治療降低 50%。",
    effects: {
      moonStalkerSwordCounterDamagePercentStrength: 120,
      moonStalkerSwordBleedPercentCounterDamage: 10,
      moonStalkerSwordHealingReductionPercent: 50,
      moonStalkerEffectDurationTurns: 3,
    },
  },
  "moon-stalker-dagger": {
    id: "moon-stalker-dagger",
    name: "迅牙撕裂",
    description:
      "暴擊時有 35% 機率追加一次相當於原傷害 50% 的物理傷害，並無視目標 15% 防禦。",
    effects: {
      moonStalkerDaggerDoubleStrikeChancePercent: 35,
      moonStalkerDaggerBonusDamagePercent: 50,
      moonStalkerDaggerDefensePiercePercent: 15,
    },
  },
  "moon-stalker-bow": {
    id: "moon-stalker-bow",
    name: "沙風獵殺",
    description:
      "遠程暴擊時使所有敵人命中率降低 20%，並使自身接下來 3 次攻擊必定命中、暴擊率提高 10%。",
    effects: {
      moonStalkerBowBlindAccuracyReductionPercent: 20,
      moonStalkerBowGuaranteedHits: 3,
      moonStalkerBowCritRateBonusPercent: 10,
    },
  },
  "moon-stalker-staff": {
    id: "moon-stalker-staff",
    name: "霜月凍結",
    description:
      "技能命中時有 50% 機率凍結目標 2 回合，使其攻擊降低 20%、防禦提高 20%；自身後續傷害提高 30%，持續 2 回合。",
    effects: {
      moonStalkerStaffFreezeChancePercent: 50,
      moonStalkerStaffFreezeDurationTurns: 2,
      moonStalkerStaffEnemyDamageReductionPercent: 20,
      moonStalkerStaffEnemyDefenseBonusPercent: 20,
      moonStalkerStaffBonusDamagePercent: 30,
      moonStalkerEffectDurationTurns: 2,
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
