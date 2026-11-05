import { describe, expect, it } from "vitest";
import { RPG_EQUIPMENT_TEMPLATES } from "./equipment-database";
import { parseLootItem } from "./loot";
import {
  advanceAsuraCritStackTurns,
  getLeviathanHealing,
  getStarCoreShieldGain,
  getActiveLegendaryEquipmentSetBonuses,
  getActiveEquipmentSpecialEffects,
  getEquipmentSpecialAbility,
  getEquipmentSpecialAbilityIdByName,
  resolveAstralLeggingsSkillEffect,
  resolveDivineShieldDamage,
  resolveDodgeCounterState,
  resolveGaleStackCount,
  resolveLethalProtection,
  resolveShadowmoonLethalEvasion,
  resolveStarCoreShieldDamage,
  rollMedusaEyeProc,
  rollSolarEyeProc,
  rollSpacetimeReversal,
  rollTruthDoubleCast,
} from "./equipment-special-abilities";
import {
  addCappedStack,
  advanceWeaponTimedBuffs,
  getWeaponTimedBuffBonuses,
  rollPercentChance,
} from "./equipment-weapon-combat";

describe("legendary helmet abilities", () => {
  it("assigns the requested passives to all six legendary helmets", () => {
    expect(
      getEquipmentSpecialAbility("阿修羅戰神兜盔", "傳說")?.effects
    ).toMatchObject({ damageBonusBelowHalfHealthPercent: 20 });
    expect(
      getEquipmentSpecialAbility("夜魔主宰面具", "傳說")?.effects
    ).toMatchObject({ lifestealBelowHalfHealthPercent: 35 });
    expect(
      getEquipmentSpecialAbility("星辰智者之冠", "傳說")?.effects
    ).toMatchObject({ cooldownReductionOnSkill: 1 });
    expect(
      getEquipmentSpecialAbility("永恆山脈巨盔", "傳說")?.effects
    ).toMatchObject({
      physicalResistanceBelowHalfHealthPercent: 20,
      magicResistanceBelowHalfHealthPercent: 20,
    });
    expect(
      getEquipmentSpecialAbility("鳳凰涅槃面具", "傳說")?.effects
    ).toMatchObject({
      preventLethalDamageOnce: true,
      nextAttackLifestealPercent: 20,
    });
    expect(
      getEquipmentSpecialAbility("天穹王盔", "傳說")?.effects
    ).toMatchObject({
      attackBonusAboveHalfHealthPercent: 20,
      defenseBonusAboveHalfHealthPercent: 20,
    });
  });

  it("leaves all six mythic helmets without abilities, including stale IDs", () => {
    const mythicItems = [
      ["創世者·秩序之冠", "low-health-damage"],
      ["虛空之主·終焉面具", "low-health-lifesteal"],
      ["全知者·真理之冠", "skill-cooldown"],
      ["滅世巨神·荒古重盔 (極品)", "low-health-resistance"],
      ["末日狂刃·血神之面 (極品)", "phoenix-rebirth"],
      ["萬象冠冕", "high-health-dominance"],
    ] as const;

    for (const [name, staleAbilityId] of mythicItems) {
      expect(getEquipmentSpecialAbilityIdByName(name)).toBeUndefined();
      expect(
        getEquipmentSpecialAbility(name, "神話", staleAbilityId)
      ).toBeUndefined();
    }
  });

  it("preserves passives on legendary set helmets only", () => {
    const setHelmetPairs = [
      ["曙光聖衛·傳說盔", "曙光聖衛·神話盔", "dawn-guardian-vision"],
      ["影月獵行·傳說盔", "影月獵行·神話盔", "moon-stalker-vision"],
      ["星界賢者·傳說盔", "星界賢者·神話盔", "skill-cooldown"],
      ["鐵壁巨神·傳說盔", "鐵壁巨神·神話盔", "low-health-resistance"],
      ["風暴劍魂·傳說盔", "風暴劍魂·神話盔", "phoenix-rebirth"],
      ["蒼龍天命·傳說盔", "蒼龍天命·神話盔", "high-health-dominance"],
    ] as const;

    for (const [legendaryName, mythicName, abilityId] of setHelmetPairs) {
      expect(getEquipmentSpecialAbilityIdByName(legendaryName)).toBe(abilityId);
      expect(getEquipmentSpecialAbilityIdByName(mythicName)).toBeUndefined();
      expect(
        RPG_EQUIPMENT_TEMPLATES.find(item => item.name === legendaryName)
          ?.specialAbilityId
      ).toBe(abilityId);
      expect(
        RPG_EQUIPMENT_TEMPLATES.find(item => item.name === mythicName)
          ?.specialAbilityId
      ).toBeUndefined();
    }
  });

  it("restores the ability for already-saved equipment without an ability ID", () => {
    const savedItem = parseLootItem({
      id: "saved-helmet",
      kind: "equipment",
      name: "鳳凰涅槃面具",
      rarity: "傳說",
      slot: "頭盔",
      description: "舊存檔裝備",
      bonus: "生命 +260",
      icon: "shield-check",
    });

    expect(savedItem).toMatchObject({
      kind: "equipment",
      specialAbilityId: "phoenix-rebirth",
    });

    const savedMythicItem = parseLootItem({
      id: "saved-mythic-helmet",
      kind: "equipment",
      name: "萬象冠冕",
      rarity: "神話",
      slot: "頭盔",
      description: "舊版神話裝備",
      bonus: "生命 +360",
      icon: "shield-check",
      specialAbilityId: "high-health-dominance",
    });
    expect(savedMythicItem).toMatchObject({
      kind: "equipment",
      specialAbilityId: undefined,
    });
  });

  it("prevents lethal damage once and queues the correct next-hit lifesteal", () => {
    const legendaryAbility = getEquipmentSpecialAbility("鳳凰涅槃面具", "傳說");
    expect(resolveLethalProtection(legendaryAbility, 10, 10, false)).toEqual({
      triggered: true,
      health: 10,
      nextAttackLifestealPercent: 20,
    });
    expect(resolveLethalProtection(legendaryAbility, 10, 10, true)).toEqual({
      triggered: false,
      health: 0,
      nextAttackLifestealPercent: 0,
    });

    const mythicAbility = getEquipmentSpecialAbility(
      "末日狂刃·血神之面 (極品)",
      "神話"
    );
    expect(mythicAbility).toBeUndefined();
    expect(resolveLethalProtection(mythicAbility, 10, 11, false)).toEqual({
      triggered: false,
      health: 0,
      nextAttackLifestealPercent: 0,
    });
  });

  it("activates health-threshold effects only below or above one half", () => {
    const lowHealthAbility = getEquipmentSpecialAbility(
      "阿修羅戰神兜盔",
      "傳說"
    );
    const lowHealth = getActiveEquipmentSpecialEffects(
      lowHealthAbility,
      49,
      100
    );
    const halfHealth = getActiveEquipmentSpecialEffects(
      lowHealthAbility,
      50,
      100
    );
    expect(lowHealth.attackDamageBonusPercent).toBe(20);
    expect(halfHealth.attackDamageBonusPercent).toBe(0);

    const highHealthAbility = getEquipmentSpecialAbility("天穹王盔", "傳說");
    expect(
      getActiveEquipmentSpecialEffects(highHealthAbility, 51, 100)
    ).toMatchObject({ attackDamageBonusPercent: 20, defenseBonusPercent: 20 });
    expect(
      getActiveEquipmentSpecialEffects(highHealthAbility, 50, 100)
    ).toMatchObject({ attackDamageBonusPercent: 0, defenseBonusPercent: 0 });
  });
});

describe("legendary legging abilities", () => {
  const leggingPairs = [
    [
      "阿修羅戰神護腿",
      "曙光聖衛·傳說護腿",
      "asura-leggings",
      "dawn-guardian-step",
    ],
    [
      "夜魔主宰護腿",
      "影月獵行·傳說護腿",
      "night-leggings",
      "moon-stalker-leggings",
    ],
    ["星辰智者長褲", "星界賢者·傳說護腿", "astral-leggings"],
    ["永恆山脈護腿", "鐵壁巨神·傳說護腿", "mountain-leggings"],
    ["疾風劍聖護腿", "風暴劍魂·傳說護腿", "gale-leggings"],
    ["影月護腿", "蒼龍天命·傳說護腿", "shadowmoon-leggings"],
  ] as const;

  it("assigns all six passives to legendary leggings and their legendary set copies only", () => {
    for (const [
      name,
      setName,
      abilityId,
      expectedSetAbilityId,
    ] of leggingPairs) {
      const setAbilityId = expectedSetAbilityId ?? abilityId;
      const mythicSetName = setName.replace("傳說", "神話");
      expect(getEquipmentSpecialAbilityIdByName(name)).toBe(abilityId);
      expect(getEquipmentSpecialAbilityIdByName(setName)).toBe(setAbilityId);
      expect(getEquipmentSpecialAbilityIdByName(mythicSetName)).toBeUndefined();
      expect(
        RPG_EQUIPMENT_TEMPLATES.find(item => item.name === name)
          ?.specialAbilityId
      ).toBe(abilityId);
      expect(
        RPG_EQUIPMENT_TEMPLATES.find(item => item.name === setName)
          ?.specialAbilityId
      ).toBe(setAbilityId);
      expect(
        RPG_EQUIPMENT_TEMPLATES.find(item => item.name === mythicSetName)
          ?.specialAbilityId
      ).toBeUndefined();
      expect(
        getEquipmentSpecialAbility(mythicSetName, "神話", abilityId)
      ).toBeUndefined();
    }

    expect(
      getEquipmentSpecialAbility("阿修羅戰神護腿", "傳說")?.effects
    ).toMatchObject({
      asuraPhysicalDamageBonusPerCritPercent: 8,
      asuraMaxCritStacks: 3,
      asuraCritStackDurationTurns: 3,
    });
    expect(
      getEquipmentSpecialAbility("夜魔主宰護腿", "傳說")?.effects
    ).toMatchObject({
      nightDodgeBelowHalfHealthPercent: 12,
      nightDefenseBelowHalfHealthPercent: 15,
    });
    expect(
      getEquipmentSpecialAbility("星辰智者長褲", "傳說")?.effects
    ).toMatchObject({
      astralSkillHealChancePercent: 30,
      astralSkillHealMaxHealthPercent: 8,
      astralNextSkillCritRateBonusPercent: 10,
    });
    expect(
      getEquipmentSpecialAbility("永恆山脈護腿", "傳說")?.effects
    ).toMatchObject({
      mountainDefenseBelowHalfHealthPercent: 20,
      mountainPhysicalResistanceBelowHalfHealthPercent: 10,
      mountainMagicResistanceBelowHalfHealthPercent: 10,
    });
    expect(
      getEquipmentSpecialAbility("疾風劍聖護腿", "傳說")?.effects
    ).toMatchObject({
      galeNextAttackBonusPercentStrength: 120,
    });
    expect(
      getEquipmentSpecialAbility("影月護腿", "傳說")?.effects
    ).toMatchObject({
      shadowmoonDodgeRateBonusAtBattleStartPercent: 10,
      shadowmoonLethalEvasionChancePercent: 20,
    });
  });

  it("activates low-health defense, resistance, dodge, and physical-damage effects at the correct thresholds", () => {
    const night = getEquipmentSpecialAbility("夜魔主宰護腿", "傳說");
    expect(getActiveEquipmentSpecialEffects(night, 49, 100)).toMatchObject({
      defenseBonusPercent: 15,
      dodgeRateBonusPercent: 12,
    });
    expect(getActiveEquipmentSpecialEffects(night, 50, 100)).toMatchObject({
      defenseBonusPercent: 0,
      dodgeRateBonusPercent: 0,
    });

    const mountain = getEquipmentSpecialAbility("永恆山脈護腿", "傳說");
    expect(getActiveEquipmentSpecialEffects(mountain, 49, 100)).toMatchObject({
      defenseBonusPercent: 20,
      physicalResistancePercent: 10,
      magicResistancePercent: 10,
    });
    expect(getActiveEquipmentSpecialEffects(mountain, 50, 100)).toMatchObject({
      defenseBonusPercent: 0,
      physicalResistancePercent: 0,
      magicResistancePercent: 0,
    });

    const asura = getEquipmentSpecialAbility("阿修羅戰神護腿", "傳說");
    expect(
      getActiveEquipmentSpecialEffects(asura, 100, 100, 1, 0, 3)
    ).toMatchObject({
      physicalDamageBonusPercent: 24,
    });
    expect(
      getActiveEquipmentSpecialEffects(asura, 100, 100, 1, 0, 4)
    ).toMatchObject({
      physicalDamageBonusPercent: 24,
    });

    const shadowmoon = getEquipmentSpecialAbility("影月護腿", "傳說");
    expect(
      getActiveEquipmentSpecialEffects(shadowmoon, 100, 100)
    ).toMatchObject({
      dodgeRateBonusPercent: 10,
    });
  });

  it("ages and caps Asura stacks, resolves Astral skill procs, and evades only lethal hits", () => {
    expect(advanceAsuraCritStackTurns([], true)).toEqual([3]);
    expect(advanceAsuraCritStackTurns([3, 2], true)).toEqual([2, 1, 3]);
    expect(advanceAsuraCritStackTurns([3, 2, 1], true)).toEqual([2, 1, 3]);
    expect(advanceAsuraCritStackTurns([1], false)).toEqual([]);

    const astral = getEquipmentSpecialAbility("星辰智者長褲", "傳說");
    expect(resolveAstralLeggingsSkillEffect(astral, 1000, true, 0.299)).toEqual(
      {
        triggered: true,
        healing: 80,
        nextSkillCritRateBonusPercent: 10,
      }
    );
    expect(
      resolveAstralLeggingsSkillEffect(astral, 1000, true, 0.3)
    ).toMatchObject({
      triggered: false,
      healing: 0,
    });
    expect(
      resolveAstralLeggingsSkillEffect(astral, 1000, false, 0)
    ).toMatchObject({
      triggered: false,
      healing: 0,
    });

    const shadowmoon = getEquipmentSpecialAbility("影月護腿", "傳說");
    expect(resolveShadowmoonLethalEvasion(shadowmoon, 30, 30, 0.199)).toEqual({
      triggered: true,
      damageTaken: 0,
    });
    expect(resolveShadowmoonLethalEvasion(shadowmoon, 30, 29, 0)).toEqual({
      triggered: false,
      damageTaken: 29,
    });
    expect(resolveShadowmoonLethalEvasion(shadowmoon, 30, 30, 0.2)).toEqual({
      triggered: false,
      damageTaken: 30,
    });
  });
});

describe("legendary two-piece set bonuses", () => {
  it("activates only the five matching legendary helmet/chest and legging pairs", () => {
    expect(
      getActiveLegendaryEquipmentSetBonuses(
        "low-health-damage",
        undefined,
        "asura-leggings"
      )
    ).toMatchObject({
      asura: true,
      night: false,
      astral: false,
      mountain: false,
      gale: false,
    });
    expect(
      getActiveLegendaryEquipmentSetBonuses(
        "low-health-lifesteal",
        undefined,
        "night-leggings"
      ).night
    ).toBe(true);
    expect(
      getActiveLegendaryEquipmentSetBonuses(
        "skill-cooldown",
        undefined,
        "astral-leggings"
      ).astral
    ).toBe(true);
    expect(
      getActiveLegendaryEquipmentSetBonuses(
        "low-health-resistance",
        undefined,
        "mountain-leggings"
      ).mountain
    ).toBe(true);
    expect(
      getActiveLegendaryEquipmentSetBonuses(
        undefined,
        "gale-dancer",
        "gale-leggings"
      ).gale
    ).toBe(true);
    expect(
      getActiveLegendaryEquipmentSetBonuses(
        "skill-cooldown",
        undefined,
        "mountain-leggings"
      )
    ).toEqual({
      asura: false,
      night: false,
      astral: false,
      mountain: false,
      gale: false,
    });
    expect(
      getActiveLegendaryEquipmentSetBonuses(
        "low-health-damage",
        undefined,
        undefined
      ).asura
    ).toBe(false);
  });
});

describe("legendary talisman abilities", () => {
  it("maps all six talismans and their stated effects", () => {
    const cases = [
      [
        "太陽神之眼",
        "solar-eye",
        {
          solarEyeProcChancePercent: 25,
          solarEyeHybridDamagePercent: 50,
          solarEyeAccuracyReductionPercent: 15,
          solarEyeAccuracyReductionDurationTurns: 2,
        },
      ],
      [
        "美杜莎之瞳",
        "medusa-eye",
        {
          medusaEyeProcChancePercent: 20,
          medusaEyeDamageBonusVsPetrifiedPercent: 25,
        },
      ],
      [
        "利維坦之心",
        "leviathan-heart",
        {
          leviathanHealIntervalTurns: 3,
          leviathanHealMaxHealthPercent: 4,
          leviathanLowHealthThresholdPercent: 30,
          leviathanLowHealthHealMultiplier: 2,
          leviathanLowHealthResistancePercent: 20,
        },
      ],
      [
        "獵王之牙",
        "hunter-king-fang",
        {
          hunterFangHighHealthThresholdPercent: 70,
          hunterFangCritRateBonusPercent: 15,
          hunterFangDefensePiercePercent: 20,
          hunterFangCooldownReductionOnKill: 1,
        },
      ],
      [
        "時空交界水晶",
        "spacetime-crystal",
        { spacetimeReversalChancePercent: 30 },
      ],
      [
        "永恆星核",
        "eternal-star-core",
        {
          starCoreShieldPercentIntelligence: 50,
          starCoreMagicDamageBonusPercent: 15,
        },
      ],
    ] as const;

    for (const [name, id, effects] of cases) {
      expect(getEquipmentSpecialAbilityIdByName(name)).toBe(id);
      expect(getEquipmentSpecialAbility(name, "傳說")?.effects).toMatchObject(
        effects
      );
      expect(getEquipmentSpecialAbility(name, "神話", id)).toBeUndefined();
    }
  });

  it("resolves Solar Eye and Medusa procs only after a qualifying event", () => {
    const solar = getEquipmentSpecialAbility("太陽神之眼", "傳說");
    const medusa = getEquipmentSpecialAbility("美杜莎之瞳", "傳說");
    expect(rollSolarEyeProc(solar, true, 0.249)).toBe(true);
    expect(rollSolarEyeProc(solar, true, 0.25)).toBe(false);
    expect(rollSolarEyeProc(solar, false, 0)).toBe(false);
    expect(rollMedusaEyeProc(medusa, true, 0.199)).toBe(true);
    expect(rollMedusaEyeProc(medusa, true, 0.2)).toBe(false);
    expect(rollMedusaEyeProc(medusa, false, 0)).toBe(false);
  });

  it("recovers Leviathan health every three turns, doubling below 30%", () => {
    const leviathan = getEquipmentSpecialAbility("利維坦之心", "傳說");
    expect(getLeviathanHealing(leviathan, 1000, 500, 3)).toBe(40);
    expect(getLeviathanHealing(leviathan, 1000, 299, 3)).toBe(80);
    expect(getLeviathanHealing(leviathan, 1000, 300, 3)).toBe(40);
    expect(getLeviathanHealing(leviathan, 1000, 100, 2)).toBe(0);
  });

  it("gives Spacetime Crystal one 30% fatal reversal and lets Star Core absorb damage", () => {
    const spacetime = getEquipmentSpecialAbility("時空交界水晶", "傳說");
    expect(rollSpacetimeReversal(spacetime, 50, 50, false, 0.299)).toBe(true);
    expect(rollSpacetimeReversal(spacetime, 50, 50, false, 0.3)).toBe(false);
    expect(rollSpacetimeReversal(spacetime, 50, 50, true, 0)).toBe(false);
    expect(rollSpacetimeReversal(spacetime, 50, 49, false, 0)).toBe(false);

    const starCore = getEquipmentSpecialAbility("永恆星核", "傳說");
    expect(getStarCoreShieldGain(starCore, 200, true)).toBe(100);
    expect(getStarCoreShieldGain(starCore, 200, false)).toBe(0);
    expect(resolveStarCoreShieldDamage(100, 65)).toEqual({
      shieldRemaining: 35,
      damageRemaining: 0,
      absorbedDamage: 65,
    });
    expect(resolveStarCoreShieldDamage(20, 65)).toEqual({
      shieldRemaining: 0,
      damageRemaining: 45,
      absorbedDamage: 20,
    });
  });
});

describe("legendary chest armor abilities", () => {
  it("assigns the six requested passives and their legendary set copies", () => {
    const armorPairs = [
      [
        "帝王光輝聖甲",
        "曙光聖衛·傳說胸甲",
        "imperial-pressure",
        "dawn-guardian-armor",
      ],
      [
        "深淵獵手皮革",
        "影月獵行·傳說胸甲",
        "abyssal-counter",
        "moon-stalker-chest",
      ],
      ["真理之門法袍", "星界賢者·傳說胸甲", "truth-awakening"],
      ["神聖守護者之壁", "鐵壁巨神·傳說胸甲", "sacred-wall"],
      ["疾風劍聖法衣", "風暴劍魂·傳說胸甲", "gale-dancer"],
      ["神諭聖甲", "蒼龍天命·傳說胸甲", "oracle-blessing"],
    ] as const;

    for (const [name, setName, abilityId, expectedSetAbilityId] of armorPairs) {
      const setAbilityId = expectedSetAbilityId ?? abilityId;
      const mythicSetName = setName.replace("傳說", "神話");
      expect(getEquipmentSpecialAbilityIdByName(name)).toBe(abilityId);
      expect(getEquipmentSpecialAbilityIdByName(setName)).toBe(setAbilityId);
      expect(getEquipmentSpecialAbilityIdByName(mythicSetName)).toBeUndefined();
      expect(
        RPG_EQUIPMENT_TEMPLATES.find(item => item.name === name)
          ?.specialAbilityId
      ).toBe(abilityId);
      expect(
        RPG_EQUIPMENT_TEMPLATES.find(item => item.name === setName)
          ?.specialAbilityId
      ).toBe(setAbilityId);
      expect(
        RPG_EQUIPMENT_TEMPLATES.find(item => item.name === mythicSetName)
          ?.specialAbilityId
      ).toBeUndefined();
      expect(
        getEquipmentSpecialAbility(mythicSetName, "神話", abilityId)
      ).toBeUndefined();
    }

    expect(
      getEquipmentSpecialAbility("帝王光輝聖甲", "傳說")?.effects
    ).toMatchObject({
      attackBonusAbove70HealthPercent: 15,
      defenseBonusAbove70HealthPercent: 15,
      enemyDamageReductionAbove70HealthPercent: 15,
    });
    expect(
      getEquipmentSpecialAbility("深淵獵手皮革", "傳說")?.effects
    ).toMatchObject({
      guaranteedCritOnNextAttackAfterDodge: true,
      nextAttackDamageBonusAfterDodgePercent: 15,
    });
    expect(
      getEquipmentSpecialAbility("真理之門法袍", "傳說")?.effects
    ).toMatchObject({ doubleCastSkillChancePercent: 10 });
    expect(
      getEquipmentSpecialAbility("神聖守護者之壁", "傳說")?.effects
    ).toMatchObject({
      sacredShieldBelowHealthPercent: 30,
      sacredShieldAbsorbPercentMaxHealth: 25,
      sacredShieldDurationTurns: 2,
    });
    expect(
      getEquipmentSpecialAbility("疾風劍聖法衣", "傳說")?.effects
    ).toMatchObject({
      galeMaxStacks: 5,
      galeAttackPercentPerStack: 3,
      galeDodgePercentPerStack: 2,
      galePhysicalDamageBonusAtMaxStacks: 10,
    });
    expect(
      getEquipmentSpecialAbility("神諭聖甲", "傳說")?.effects
    ).toMatchObject({
      oracleFirstTurnsDamageReductionPercent: 20,
      oracleFirstTurnsDuration: 3,
      oracleStunEnemiesOnHitAtTurnEnd: true,
    });
  });

  it("activates the threshold and duration-based effects at their boundaries", () => {
    const emperor = getEquipmentSpecialAbility("帝王光輝聖甲", "傳說");
    expect(getActiveEquipmentSpecialEffects(emperor, 71, 100)).toMatchObject({
      attackDamageBonusPercent: 15,
      defenseBonusPercent: 15,
      enemyDamageReductionPercent: 15,
    });
    expect(getActiveEquipmentSpecialEffects(emperor, 70, 100)).toMatchObject({
      attackDamageBonusPercent: 0,
      defenseBonusPercent: 0,
      enemyDamageReductionPercent: 0,
    });

    const gale = getEquipmentSpecialAbility("疾風劍聖法衣", "傳說");
    expect(getActiveEquipmentSpecialEffects(gale, 50, 100, 1, 4)).toMatchObject(
      {
        attackDamageBonusPercent: 12,
        dodgeRateBonusPercent: 8,
        physicalDamageBonusPercent: 0,
      }
    );
    expect(getActiveEquipmentSpecialEffects(gale, 50, 100, 1, 5)).toMatchObject(
      {
        attackDamageBonusPercent: 15,
        dodgeRateBonusPercent: 10,
        physicalDamageBonusPercent: 10,
      }
    );

    const oracle = getEquipmentSpecialAbility("神諭聖甲", "傳說");
    expect(getActiveEquipmentSpecialEffects(oracle, 50, 100, 3)).toMatchObject({
      physicalResistancePercent: 20,
      magicResistancePercent: 20,
    });
    expect(getActiveEquipmentSpecialEffects(oracle, 50, 100, 4)).toMatchObject({
      physicalResistancePercent: 0,
      magicResistancePercent: 0,
    });
  });

  it("rolls truth double-cast chance and retains abyssal counter until a hit connects", () => {
    const truth = getEquipmentSpecialAbility("真理之門法袍", "傳說");
    expect(rollTruthDoubleCast(truth, 0.099)).toBe(true);
    expect(rollTruthDoubleCast(truth, 0.1)).toBe(false);

    const abyssal = getEquipmentSpecialAbility("深淵獵手皮革", "傳說");
    const counter = resolveDodgeCounterState(
      abyssal,
      { guaranteedCrit: false, damageBonusPercent: 0 },
      true,
      false
    );
    expect(counter).toEqual({ guaranteedCrit: true, damageBonusPercent: 15 });
    expect(resolveDodgeCounterState(abyssal, counter, false, false)).toEqual(
      counter
    );
    expect(resolveDodgeCounterState(abyssal, counter, false, true)).toEqual({
      guaranteedCrit: false,
      damageBonusPercent: 0,
    });
  });

  it("adds one gale stack per normal attack or dodge and caps at five", () => {
    expect(resolveGaleStackCount(0, true, false)).toBe(1);
    expect(resolveGaleStackCount(1, false, true)).toBe(2);
    expect(resolveGaleStackCount(4, true, true)).toBe(5);
    expect(resolveGaleStackCount(5, true, true)).toBe(5);
  });

  it("activates the one-time divine shield below 30% and absorbs up to 25% max HP", () => {
    const sacredWall = getEquipmentSpecialAbility("神聖守護者之壁", "傳說");
    const emptyState = {
      charge: 0,
      remainingAbsorb: 0,
      turnsRemaining: 0,
      used: false,
    };
    const activated = resolveDivineShieldDamage(
      sacredWall,
      emptyState,
      40,
      100,
      20
    );
    expect(activated).toMatchObject({
      health: 40,
      damageTaken: 0,
      absorbedDamage: 20,
      triggered: true,
      state: {
        charge: 0,
        remainingAbsorb: 5,
        turnsRemaining: 2,
        used: true,
      },
    });

    const firstRound = resolveDivineShieldDamage(
      sacredWall,
      activated.state,
      40,
      100,
      2,
      true
    );
    expect(firstRound).toMatchObject({
      health: 40,
      absorbedDamage: 2,
      state: { remainingAbsorb: 3, turnsRemaining: 1, used: true },
    });

    const secondRound = resolveDivineShieldDamage(
      sacredWall,
      firstRound.state,
      40,
      100,
      10,
      true
    );
    expect(secondRound).toMatchObject({
      health: 33,
      damageTaken: 7,
      absorbedDamage: 3,
      triggered: false,
      state: { remainingAbsorb: 0, turnsRemaining: 0, used: true },
    });
  });
});

describe("legendary weapon abilities", () => {
  const weaponNames = [
    "焚星神弓",
    "傳說·曙光劍",
    "傳說·鐵衛劍",
    "傳說·月影劍",
    "傳說·王道劍",
    "傳說·星界劍",
    "傳說·獵影短刀",
    "傳說·迅牙短刀",
    "傳說·毒棘短刀",
    "傳說·幻步短刀",
    "傳說·虛空短刀",
    "傳說·林風弓",
    "傳說·沙羽弓",
    "傳說·月弦弓",
    "傳說·天穹弓",
    "傳說·日輪弓",
    "傳說·木靈法杖",
    "傳說·藍晶法杖",
    "傳說·星語法杖",
    "傳說·炎脈法杖",
    "傳說·創世法杖",
    "曙光聖衛·傳說劍武器",
    "曙光聖衛·傳說短刀武器",
    "曙光聖衛·傳說弓武器",
    "曙光聖衛·傳說法杖武器",
    "影月獵行·傳說劍武器",
    "影月獵行·傳說短刀武器",
    "影月獵行·傳說弓武器",
    "影月獵行·傳說法杖武器",
  ];

  it("assigns every requested passive to its matching legendary weapon only", () => {
    for (const name of weaponNames) {
      const abilityId = getEquipmentSpecialAbilityIdByName(name);
      expect(abilityId, name).toBeDefined();
      expect(
        RPG_EQUIPMENT_TEMPLATES.find(item => item.name === name)
          ?.specialAbilityId,
        name
      ).toBe(abilityId);
      expect(
        getEquipmentSpecialAbility(name, "傳說", abilityId),
        name
      ).toBeDefined();

      const mythicName = name.startsWith("傳說·")
        ? name.replace("傳說·", "神話·")
        : name;
      expect(
        getEquipmentSpecialAbility(mythicName, "神話", abilityId),
        mythicName
      ).toBeUndefined();
      if (name.startsWith("傳說·")) {
        expect(getEquipmentSpecialAbilityIdByName(mythicName)).toBeUndefined();
      }
    }
  });

  it("keeps requested proc values, durations, counters and damage rules", () => {
    expect(
      getEquipmentSpecialAbility("焚星神弓", "傳說")?.effects
    ).toMatchObject({
      starfireBurnPercentOfCriticalDamage: 15,
      starfireDurationTurns: 3,
      starfireArmorReductionPercent: 10,
    });
    expect(
      getEquipmentSpecialAbility("傳說·曙光劍", "傳說")?.effects
    ).toMatchObject({
      dawnProcChancePercent: 20,
      dawnBonusDamagePercentAttack: 20,
      dawnHighHealthThresholdPercent: 70,
      dawnHighHealthDamageMultiplier: 2,
    });
    expect(
      getEquipmentSpecialAbility("傳說·迅牙短刀", "傳說")?.effects
    ).toMatchObject({
      swiftfangAttackBonusPercent: 20,
      swiftfangDodgeRateBonusPercent: 5,
      swiftfangDurationTurns: 2,
    });
    expect(
      getEquipmentSpecialAbility("傳說·創世法杖", "傳說")?.effects
    ).toMatchObject({
      genesisStaffProcChancePercent: 25,
      genesisStaffBonusMagicDamage: 30,
      genesisStaffMaxAdditionalTargets: 3,
      genesisStaffParalysisChancePercent: 15,
      genesisStaffParalysisDurationTurns: 1,
    });
    expect(
      getEquipmentSpecialAbility("傳說·炎脈法杖", "傳說")?.effects
    ).toMatchObject({
      fireVeinMarksToBurst: 5,
      fireVeinAoeMagicAttackPercent: 100,
    });
    expect(
      getEquipmentSpecialAbility("曙光聖衛·傳說劍", "傳說")?.effects
    ).toMatchObject({
      dawnWardenSwordProcChancePercent: 20,
      dawnWardenSwordAoeDamagePercentAttack: 150,
      dawnWardenSwordStunDurationTurns: 1,
    });
    expect(
      getEquipmentSpecialAbility("影月獵行·傳說法杖", "傳說")?.effects
    ).toMatchObject({
      moonStalkerStaffFreezeChancePercent: 50,
      moonStalkerStaffFreezeDurationTurns: 2,
      moonStalkerStaffEnemyDamageReductionPercent: 20,
      moonStalkerStaffEnemyDefenseBonusPercent: 20,
      moonStalkerStaffBonusDamagePercent: 30,
    });
  });

  it("resolves proc boundaries, capped stacks and timed buff refresh", () => {
    expect(rollPercentChance(25, 0.249)).toBe(true);
    expect(rollPercentChance(25, 0.25)).toBe(false);
    expect(addCappedStack(1, 2)).toBe(2);
    expect(addCappedStack(2, 2)).toBe(2);

    const active = advanceWeaponTimedBuffs(
      [],
      [
        {
          id: "swiftfang-dagger",
          turnsRemaining: 2,
          attackDamageBonusPercent: 20,
          dodgeRateBonusPercent: 5,
        },
      ]
    );
    expect(getWeaponTimedBuffBonuses(active)).toEqual({
      attackDamageBonusPercent: 20,
      critRateBonusPercent: 0,
      dodgeRateBonusPercent: 5,
    });
    expect(advanceWeaponTimedBuffs(active)).toMatchObject([
      { id: "swiftfang-dagger", turnsRemaining: 1 },
    ]);
    expect(advanceWeaponTimedBuffs(advanceWeaponTimedBuffs(active))).toEqual(
      []
    );
    expect(
      advanceWeaponTimedBuffs(active, [
        {
          id: "swiftfang-dagger",
          turnsRemaining: 2,
          attackDamageBonusPercent: 20,
          dodgeRateBonusPercent: 5,
        },
      ])
    ).toMatchObject([{ id: "swiftfang-dagger", turnsRemaining: 2 }]);
  });
});
