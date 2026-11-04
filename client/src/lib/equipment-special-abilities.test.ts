import { describe, expect, it } from "vitest";
import { RPG_EQUIPMENT_TEMPLATES } from "./equipment-database";
import { parseLootItem } from "./loot";
import {
  getActiveEquipmentSpecialEffects,
  getEquipmentSpecialAbility,
  getEquipmentSpecialAbilityIdByName,
  resolveLethalProtection,
} from "./equipment-special-abilities";

describe("legendary and mythic helmet abilities", () => {
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

  it("gives the corresponding mythic helmets stronger versions", () => {
    const pairs = [
      [
        "阿修羅戰神兜盔",
        "創世者·秩序之冠",
        "damageBonusBelowHalfHealthPercent",
      ],
      ["夜魔主宰面具", "虛空之主·終焉面具", "lifestealBelowHalfHealthPercent"],
      ["星辰智者之冠", "全知者·真理之冠", "cooldownReductionOnSkill"],
      [
        "永恆山脈巨盔",
        "滅世巨神·荒古重盔 (極品)",
        "physicalResistanceBelowHalfHealthPercent",
      ],
      [
        "鳳凰涅槃面具",
        "末日狂刃·血神之面 (極品)",
        "nextAttackLifestealPercent",
      ],
      ["天穹王盔", "萬象冠冕", "attackBonusAboveHalfHealthPercent"],
    ] as const;

    for (const [legendaryName, mythicName, effectName] of pairs) {
      const legendaryValue = getEquipmentSpecialAbility(legendaryName, "傳說")
        ?.effects[effectName];
      const mythicValue = getEquipmentSpecialAbility(mythicName, "神話")
        ?.effects[effectName];
      expect(legendaryValue).toBeTypeOf("number");
      expect(mythicValue).toBeTypeOf("number");
      expect(mythicValue as number).toBeGreaterThan(legendaryValue as number);
    }
  });

  it("preserves the passive on corresponding legendary and mythic set helmets", () => {
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
      expect(getEquipmentSpecialAbilityIdByName(mythicName)).toBe(abilityId);
      expect(
        RPG_EQUIPMENT_TEMPLATES.find(item => item.name === legendaryName)
          ?.specialAbilityId
      ).toBe(abilityId);
      expect(
        RPG_EQUIPMENT_TEMPLATES.find(item => item.name === mythicName)
          ?.specialAbilityId
      ).toBe(abilityId);
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
    expect(resolveLethalProtection(mythicAbility, 10, 11, false)).toMatchObject(
      {
        triggered: true,
        health: 10,
        nextAttackLifestealPercent: 35,
      }
    );
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
