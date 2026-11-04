import { describe, expect, it } from "vitest";
import { RPG_EQUIPMENT_TEMPLATES } from "./equipment-database";
import { parseLootItem } from "./loot";
import {
  getActiveEquipmentSpecialEffects,
  getEquipmentSpecialAbility,
  getEquipmentSpecialAbilityIdByName,
  resolveDivineShieldDamage,
  resolveDodgeCounterState,
  resolveGaleStackCount,
  resolveLethalProtection,
  rollTruthDoubleCast,
} from "./equipment-special-abilities";

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
      ["曙光聖衛·傳說盔", "曙光聖衛·神話盔", "low-health-damage"],
      ["影月獵行·傳說盔", "影月獵行·神話盔", "low-health-lifesteal"],
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

describe("legendary chest armor abilities", () => {
  it("assigns the six requested passives and their legendary set copies", () => {
    const armorPairs = [
      ["帝王光輝聖甲", "曙光聖衛·傳說胸甲", "imperial-pressure"],
      ["深淵獵手皮革", "影月獵行·傳說胸甲", "abyssal-counter"],
      ["真理之門法袍", "星界賢者·傳說胸甲", "truth-awakening"],
      ["神聖守護者之壁", "鐵壁巨神·傳說胸甲", "sacred-wall"],
      ["疾風劍聖法衣", "風暴劍魂·傳說胸甲", "gale-dancer"],
      ["神諭聖甲", "蒼龍天命·傳說胸甲", "oracle-blessing"],
    ] as const;

    for (const [name, setName, abilityId] of armorPairs) {
      const mythicSetName = setName.replace("傳說", "神話");
      expect(getEquipmentSpecialAbilityIdByName(name)).toBe(abilityId);
      expect(getEquipmentSpecialAbilityIdByName(setName)).toBe(abilityId);
      expect(getEquipmentSpecialAbilityIdByName(mythicSetName)).toBeUndefined();
      expect(
        RPG_EQUIPMENT_TEMPLATES.find(item => item.name === name)
          ?.specialAbilityId
      ).toBe(abilityId);
      expect(
        RPG_EQUIPMENT_TEMPLATES.find(item => item.name === setName)
          ?.specialAbilityId
      ).toBe(abilityId);
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
