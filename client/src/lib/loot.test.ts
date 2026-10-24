import { describe, expect, it } from "vitest";
import {
  canEquipEquipment,
  EQUIPMENT_SLOTS,
  RPG_EQUIPMENT_BENCHMARKS,
  getLootProbabilitySummary,
  LOOT_RARITIES,
  LOOT_RARITY_CLASS,
  getEquipmentAffixBonuses,
  getEquipmentSetBonuses,
  getEquipmentRequiredJobClass,
  getTreasureSellValue,
  nextLootRarity,
  normalizeEquippedItemIds,
  parseLootInventory,
  parseLootItem,
  prepareEquipmentFusion,
  removeTreasureFromInventory,
  rollLoot,
  rollQuestChestLoot,
  scaleBonusByRarity,
  toggleEquippedItemIds,
  type EquipmentAffix,
  type EquipmentItem,
  type EquipmentSlot,
  type TreasureItem,
} from "./loot";

function randomSequence(...values: number[]) {
  let index = 0;
  return () => values[index++] ?? 0;
}

function expectProbabilityMap(actual: object, expected: Record<string, number>) {
  const values = actual as Record<string, number>;
  for (const [rarity, chance] of Object.entries(expected)) {
    expect(values[rarity]).toBeCloseTo(chance, 10);
  }
}

function equipment(id: string, slot: EquipmentSlot): EquipmentItem {
  return {
    id,
    kind: "equipment",
    name: id,
    slot,
    rarity: "普通",
    description: "測試裝備",
    bonus: "力量 +1",
    icon: "sword",
  };
}

describe("QuestBoard loot", () => {
  it("offers six rarity tiers and matching visual classes", () => {
    expect(LOOT_RARITIES).toEqual([
      "普通",
      "精良",
      "稀有",
      "史詩",
      "傳說",
      "神話",
    ]);
    expect(LOOT_RARITY_CLASS.精良).toBe("fine");
    expect(LOOT_RARITY_CLASS.神話).toBe("mythic");
  });

  it("uses the five requested equipment slots", () => {
    expect(EQUIPMENT_SLOTS).toEqual([
      "頭盔",
      "胸甲",
      "武器",
      "護腿",
      "護身符",
    ]);
  });

  it("rolls equipment, treasure, or no item at the requested chest rates", () => {
    expect(
      rollQuestChestLoot(10, randomSequence(0.1, 0, 0), () => 100)
    ).toMatchObject({
      kind: "equipment",
      id: expect.stringContaining("-100-"),
    });
    expect(
      rollQuestChestLoot(10, randomSequence(0.5, 0, 0), () => 101)
    ).toMatchObject({
      kind: "treasure",
      id: expect.stringContaining("-101-"),
    });
    expect(rollQuestChestLoot(10, randomSequence(0.7), () => 102)).toBeNull();
  });

  it("keeps chest equipment eligible for the player's level", () => {
    const loot = rollQuestChestLoot(1, randomSequence(0.1, 0, 0), () => 103);
    expect(loot?.kind).toBe("equipment");
    expect(loot?.rarity).toBe("普通");
  });

  it("limits each weapon type to its matching job class", () => {
    const weapons = [
      { ...equipment("dagger", "武器"), weaponType: "短刀" as const },
      { ...equipment("staff", "武器"), weaponType: "法杖" as const },
      { ...equipment("sword", "武器"), weaponType: "劍" as const },
      { ...equipment("bow", "武器"), weaponType: "弓" as const },
    ];

    expect(getEquipmentRequiredJobClass(weapons[0])).toBe("rogue");
    expect(getEquipmentRequiredJobClass(weapons[1])).toBe("mage");
    expect(getEquipmentRequiredJobClass(weapons[2])).toBe("warrior");
    expect(getEquipmentRequiredJobClass(weapons[3])).toBe("archer");
    expect(canEquipEquipment(weapons[0], "rogue")).toBe(true);
    expect(canEquipEquipment(weapons[0], "warrior")).toBe(false);
    expect(canEquipEquipment(weapons[1], "mage")).toBe(true);
    expect(canEquipEquipment(weapons[2], "warrior")).toBe(true);
    expect(canEquipEquipment(weapons[3], "archer")).toBe(true);
    expect(
      normalizeEquippedItemIds(weapons, weapons.map(item => item.id), "warrior")
    ).toEqual(["sword"]);
  });

  it("includes the six-level RPG benchmark and five weapons per type and rarity", async () => {
    expect(RPG_EQUIPMENT_BENCHMARKS.普通.hp).toBe("30–50");
    expect(RPG_EQUIPMENT_BENCHMARKS.神話.attack).toContain("85");
    const module = await import("./equipment-database");
    const weaponTypes = ["劍", "短刀", "弓", "法杖"] as const;
    for (const rarity of LOOT_RARITIES) {
      expect(module.RPG_EQUIPMENT_TEMPLATES.filter(item => item.rarity === rarity)).toHaveLength(90);
      for (const weaponType of weaponTypes) {
        const weapons = module.RPG_EQUIPMENT_TEMPLATES.filter(
          item =>
            item.rarity === rarity &&
            item.slot === "武器" &&
            item.weaponType === weaponType
        );
        const legacyWeaponCount =
          (weaponType === "劍" &&
            ["普通", "稀有", "史詩", "神話"].includes(rarity)) ||
          (weaponType === "弓" && ["精良", "傳說"].includes(rarity))
            ? 1
            : 0;
        expect(weapons).toHaveLength(10 + legacyWeaponCount * 2);
        expect(weapons.every(item => item.equipmentLevel === LOOT_RARITIES.indexOf(rarity) + 1)).toBe(true);
        expect(weapons.every(item => item.minLevel === 1 + LOOT_RARITIES.indexOf(rarity) * 10)).toBe(true);
        expect(
          weapons.every(item =>
            weaponType === "法杖"
              ? !item.bonus.includes("暴擊率") &&
                !item.bonus.includes("暴擊傷害") &&
                item.bonus.includes("施法速度") &&
                Boolean(item.element)
              : item.bonus.includes("暴擊率") && item.bonus.includes("暴擊傷害")
          )
        ).toBe(true);
      }
    }
  });

  it("keeps the original database equipment and adds six named set copies", async () => {
    const module = await import("./equipment-database");
    const originals = module.RPG_EQUIPMENT_TEMPLATES.slice(0, 270);
    const setCopies = module.RPG_EQUIPMENT_TEMPLATES.slice(270);
    expect(originals.every(item => item.setId === undefined)).toBe(true);
    expect(setCopies).toHaveLength(270);
    expect(setCopies.every(item => Boolean(item.setId) && item.name.includes("·"))).toBe(true);
    expect(new Set(setCopies.map(item => item.setId)).size).toBe(36);
    expect(setCopies.every((item, index) => item.bonus === originals[index].bonus)).toBe(true);
  });

  it("preserves the existing 65% ordinary drop chance", () => {
    const drop = rollLoot(
      { level: 1 },
      randomSequence(0.65, 0, 0, 0, 0),
      () => 1
    );
    const noDrop = rollLoot(
      { level: 1 },
      randomSequence(0.650001),
      () => 1
    );

    expect(drop).not.toBeNull();
    expect(noDrop).toBeNull();
  });

  it("reports ordinary encounter drop rates and each final rarity by current level", () => {
    const lowLevel = getLootProbabilitySummary({ level: 1 });
    expect(lowLevel.dropChance).toBeCloseTo(0.65, 10);
    expect(lowLevel.equipmentChance).toBeCloseTo(0.4225, 10);
    expect(lowLevel.treasureChance).toBeCloseTo(0.2275, 10);
    expect(lowLevel.noDropChance).toBeCloseTo(0.35, 10);
    const lowLevelRarities = {
      普通: 0.72,
      精良: 0.1,
      稀有: 0.12,
      史詩: 0.05,
      傳說: 0.009,
      神話: 0.001,
    };
    expectProbabilityMap(lowLevel.equipmentRarities, lowLevelRarities);
    expectProbabilityMap(lowLevel.treasureRarities, lowLevelRarities);

    const midLevel = getLootProbabilitySummary({ level: 10 });
    expectProbabilityMap(midLevel.treasureRarities, {
      普通: 0.55,
      精良: 0.12,
      稀有: 0.17,
      史詩: 0.13,
      傳說: 0.028,
      神話: 0.002,
    });
    const highLevel = getLootProbabilitySummary({ level: 30 });
    expectProbabilityMap(highLevel.treasureRarities, {
      普通: 0.4,
      精良: 0.12,
      稀有: 0.2,
      史詩: 0.21,
      傳說: 0.068,
      神話: 0.002,
    });
    expect(highLevel.equipmentRarities.普通).toBeLessThan(
      highLevel.treasureRarities.普通
    );
    expect(highLevel.equipmentRarities.史詩).toBeGreaterThan(
      highLevel.treasureRarities.史詩
    );
    const crownLevel = getLootProbabilitySummary({ level: 50 });
    expect(crownLevel.equipmentRarities.傳說).toBeGreaterThan(
      crownLevel.treasureRarities.傳說
    );
  });

  it("reports guaranteed boss drops and equipment-template rarity floors", () => {
    const boss = getLootProbabilitySummary({ level: 50, isBoss: true });
    expect(boss).toMatchObject({
      dropChance: 1,
      equipmentChance: 0.65,
      treasureChance: 0.35,
      noDropChance: 0,
    });
    expect(boss.equipmentRarities.普通).toBe(0);
    expect(boss.equipmentRarities.精良).toBe(0);
    expect(boss.equipmentRarities.稀有).toBe(0);
    expect(boss.equipmentRarities.史詩).toBeGreaterThan(0);
    expect(boss.equipmentRarities.傳說).toBeGreaterThan(0);
    expect(boss.equipmentRarities.神話).toBeGreaterThan(0);
    expect(Object.values(boss.equipmentRarities).reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 10);
    expectProbabilityMap(boss.treasureRarities, {
      普通: 0,
      精良: 0,
      稀有: 0,
      史詩: 0.75,
      傳說: 0.22,
      神話: 0.03,
    });
  });

  it("scales equipment base bonuses and rolls a matching quality affix", () => {
    const item = rollLoot(
      { level: 1 },
      randomSequence(0, 0, 0.75, 0, 0, 0),
      () => 234
    );

    expect(item?.kind).toBe("equipment");
    if (item?.kind !== "equipment") throw new Error("Expected equipment");
    expect(item.rarity).toBe("精良");
    expect(item.bonus).toBe("力量 +3");
    expect(item.affixes).toHaveLength(1);
    expect(item.affixes?.[0].bonuses.health).toBe(8);
    expect(item.affixes?.[0].description).toContain("生命 +8");
  });

  it("gives higher equipment rarities more distinct affixes", () => {
    const item = rollLoot(
      { level: 50, isBoss: true },
      randomSequence(0, 0.99, 0, 0, 0, 0, 0),
      () => 345
    );

    expect(item?.kind).toBe("equipment");
    if (item?.kind !== "equipment") throw new Error("Expected equipment");
    expect(item.rarity).toBe("神話");
    expect(item.affixes).toHaveLength(3);
    expect(new Set(item.affixes?.map(affix => affix.name)).size).toBe(3);
  });

  it("applies equipped affix effects to ability and combat totals", () => {
    const affix: EquipmentAffix = {
      name: "精準",
      description: "暴擊率 +3%",
      bonuses: { strength: 2, critRate: 3 },
    };
    const item = { ...equipment("sword-1", "武器"), affixes: [affix] };

    expect(getEquipmentAffixBonuses([item])).toEqual({
      health: 0,
      strength: 2,
      defense: 0,
      intelligence: 0,
      critRate: 3,
      critDamage: 0,
      dodgeRate: 0,
    });
  });

  it("activates cumulative two-piece and four-piece set bonuses", () => {
    const pieces = [
      { ...equipment("dawn-helmet", "頭盔"), setId: "dawn-warden-普通" },
      { ...equipment("dawn-chest", "胸甲"), setId: "dawn-warden-普通" },
      { ...equipment("dawn-legs", "護腿"), setId: "dawn-warden-普通" },
      { ...equipment("dawn-charm", "護身符"), setId: "dawn-warden-普通" },
    ];

    expect(getEquipmentSetBonuses(pieces.slice(0, 2))).toMatchObject({
      abilities: { health: 60, defense: 8 },
      combat: { critDamage: 0 },
      activeSets: [{ name: "曙光聖衛·普通", equippedCount: 2, activeBonuses: [{ pieces: 2 }] }],
    });
    expect(getEquipmentSetBonuses(pieces)).toMatchObject({
      abilities: { health: 120, defense: 16 },
      combat: { critDamage: 0, damageReductionPercent: 10 },
      activeSets: [{ equippedCount: 4, activeBonuses: [{ pieces: 2 }, { pieces: 4 }] }],
    });
  });

  it("uses the requested four-piece set values", () => {
    const fourPieces = (setId: string) => [
      { ...equipment(`${setId}-helmet`, "頭盔"), setId },
      { ...equipment(`${setId}-chest`, "胸甲"), setId },
      { ...equipment(`${setId}-legs`, "護腿"), setId },
      { ...equipment(`${setId}-charm`, "護身符"), setId },
    ];

    expect(getEquipmentSetBonuses(fourPieces("moon-stalker-普通")).abilities).toMatchObject({ strength: 20 });
    expect(getEquipmentSetBonuses(fourPieces("moon-stalker-普通")).combat).toMatchObject({ dodgeRate: 9, critRate: 5 });
    expect(getEquipmentSetBonuses(fourPieces("astral-sage-普通")).abilities).toMatchObject({ intelligence: 24 });
    expect(getEquipmentSetBonuses(fourPieces("astral-sage-普通")).combat).toMatchObject({ castSpeedPercent: 10, magicPenetrationPercent: 10 });
    expect(getEquipmentSetBonuses(fourPieces("storm-sword-普通")).abilities).toMatchObject({ strength: 25 });
    expect(getEquipmentSetBonuses(fourPieces("storm-sword-普通")).combat).toMatchObject({ critRate: 9, critDamage: 15 });
    expect(getEquipmentSetBonuses(fourPieces("azure-dragon-普通").slice(0, 2)).abilities).toMatchObject({ health: 20, strength: 3, defense: 3, intelligence: 3 });
    expect(getEquipmentSetBonuses(fourPieces("azure-dragon-普通")).abilities).toMatchObject({ health: 50, strength: 8, defense: 8, intelligence: 8 });
    expect(getEquipmentSetBonuses(fourPieces("azure-dragon-普通")).combat).toMatchObject({ critDamage: 8 });
  });

  it("keeps old equipment without a set id usable", () => {
    const oldItem = parseLootItem({
      id: "old-setless-gear",
      kind: "equipment",
      name: "舊版胸甲",
      slot: "胸甲",
      rarity: "普通",
      description: "舊存檔裝備",
      bonus: "防禦 +2",
      icon: "shield",
    });

    expect(oldItem?.kind).toBe("equipment");
    if (oldItem?.kind !== "equipment") throw new Error("Expected old equipment");
    expect(oldItem.setId).toBeUndefined();
    expect(getEquipmentSetBonuses([oldItem]).activeSets).toEqual([]);
  });

  it("scales set bonuses with the current rarity multipliers", () => {
    const mythicPieces = [
      { ...equipment("mythic-helmet", "頭盔"), setId: "astral-sage-神話" },
      { ...equipment("mythic-chest", "胸甲"), setId: "astral-sage-神話" },
      { ...equipment("mythic-legs", "護腿"), setId: "astral-sage-神話" },
      { ...equipment("mythic-charm", "護身符"), setId: "astral-sage-神話" },
    ];
    expect(getEquipmentSetBonuses(mythicPieces).combat).toMatchObject({
      castSpeedPercent: 35,
      magicPenetrationPercent: 35,
    });
  });

  it("applies treasure affix value to the actual sale price", () => {
    const item = rollLoot(
      { level: 1 },
      randomSequence(0, 0.99, 0.84, 0, 0),
      () => 456
    );

    expect(item?.kind).toBe("treasure");
    if (item?.kind !== "treasure") throw new Error("Expected a treasure drop");
    expect(item.rarity).toBe("稀有");
    expect(item.affixes?.[0]).toMatchObject({
      name: "珍藏",
      saleBonusPercent: 15,
    });
    expect(item.sellValue).toBe(86);
  });

  it("lets bosses drop mythic treasures with their matching sale affix", () => {
    const item = rollLoot(
      { level: 50, isBoss: true },
      randomSequence(0.99, 0.99, 0, 0),
      () => 567
    );

    expect(item?.kind).toBe("treasure");
    if (item?.kind !== "treasure") throw new Error("Expected a treasure drop");
    expect(item.rarity).toBe("神話");
    expect(item.affixes?.[0].name).toBe("龍神祝福");
    expect(item.sellValue).toBeGreaterThan(getTreasureSellValue("神話", 50));
  });

  it("scales base bonuses through the rarity ladder", () => {
    expect(scaleBonusByRarity("力量 +2", "普通", "精良")).toBe("力量 +3");
    expect(scaleBonusByRarity("力量 +2", "普通", "神話")).toBe("力量 +9");
    expect(scaleBonusByRarity("閃避率 +2%", "普通", "史詩")).toBe(
      "閃避率 +4%"
    );
  });

  it("migrates legacy equipment and accepts old items without affixes", () => {
    const legacy = parseLootItem({
      id: "old-gear",
      name: "舊短劍",
      slot: "武器",
      rarity: "普通",
      description: "舊存檔裝備",
      bonus: "力量 +2",
      icon: "sword",
    });

    expect(legacy?.kind).toBe("equipment");
    if (legacy?.kind !== "equipment") throw new Error("Expected legacy gear");
    expect(legacy.affixes).toEqual([]);

    const oldTreasure = parseLootItem({
      id: "old-treasure",
      kind: "treasure",
      name: "舊古幣",
      slot: "寶藏",
      rarity: "傳說",
      description: "舊存檔寶藏",
      sellValue: 450,
      icon: "coins",
    });
    expect(oldTreasure?.kind).toBe("treasure");
    if (oldTreasure?.kind !== "treasure") throw new Error("Expected treasure");
    expect(oldTreasure.affixes).toEqual([]);
  });

  it("preserves generated affix effects when loading saved items", () => {
    const gear = parseLootItem({
      id: "mythic-gear",
      name: "遠古長劍",
      kind: "equipment",
      slot: "武器",
      rarity: "神話",
      description: "傳世裝備",
      bonus: "力量 +9",
      icon: "sword",
      affixes: [
        {
          name: "精準",
          description: "暴擊率 +4%",
          bonuses: { critRate: 4, strength: 2 },
        },
      ],
    });
    expect(gear?.kind).toBe("equipment");
    if (gear?.kind !== "equipment") throw new Error("Expected saved gear");
    expect(gear.affixes?.[0].name).toBe("精準");
    expect(getEquipmentAffixBonuses([gear]).critRate).toBe(4);
    expect(getEquipmentAffixBonuses([gear]).strength).toBe(2);

    const treasure = parseLootItem({
      id: "mythic-treasure",
      kind: "treasure",
      name: "龍神珍藏",
      slot: "寶藏",
      rarity: "神話",
      description: "神話寶藏",
      sellValue: 1440,
      icon: "gem",
      affixes: [
        {
          name: "龍神祝福",
          description: "收藏家願意多付 60% 金幣",
          saleBonusPercent: 60,
        },
      ],
    });
    expect(treasure?.kind).toBe("treasure");
    if (treasure?.kind !== "treasure") throw new Error("Expected saved treasure");
    expect(treasure.affixes?.[0].saleBonusPercent).toBe(60);
  });

  it("migrates legacy equipment names to the five new slots", () => {
    const parseLegacySlot = (slot: string) =>
      parseLootItem({
        id: `legacy-${slot}`,
        name: "舊版裝備",
        slot,
        rarity: "普通",
        description: "舊存檔裝備",
        bonus: "力量 +2",
        icon: "sword",
      });

    expect(parseLegacySlot("防具")?.slot).toBe("胸甲");
    expect(parseLegacySlot("飾品")?.slot).toBe("護身符");
    expect(parseLegacySlot("戒指")?.slot).toBe("護身符");
    expect(parseLegacySlot("核心")?.slot).toBe("護身符");
  });

  it("keeps one item per slot when loading existing equipment", () => {
    const inventory = parseLootInventory([
      equipment("helmet-1", "頭盔"),
      equipment("helmet-2", "頭盔"),
      equipment("chest-1", "胸甲"),
      equipment("weapon-1", "武器"),
    ]);

    expect(
      normalizeEquippedItemIds(inventory, [
        "helmet-1",
        "helmet-2",
        "chest-1",
        "weapon-1",
      ])
    ).toEqual(["helmet-1", "chest-1", "weapon-1"]);
  });

  it("replaces only an item in the same slot and can unequip it", () => {
    const inventory = [
      equipment("helmet-1", "頭盔"),
      equipment("helmet-2", "頭盔"),
      equipment("chest-1", "胸甲"),
      equipment("weapon-1", "武器"),
    ];
    const replaced = toggleEquippedItemIds(
      inventory,
      ["helmet-1", "chest-1", "weapon-1"],
      "helmet-2"
    );

    expect(replaced).toEqual(["chest-1", "weapon-1", "helmet-2"]);
    expect(toggleEquippedItemIds(inventory, replaced, "helmet-2")).toEqual([
      "chest-1",
      "weapon-1",
    ]);
  });

  it("sells a treasure exactly once", () => {
    const treasure: TreasureItem = {
      id: "treasure-1",
      kind: "treasure",
      name: "古幣袋",
      slot: "寶藏",
      rarity: "稀有",
      description: "可出售",
      sellValue: 75,
      icon: "coins",
    };
    const sale = removeTreasureFromInventory([treasure], treasure.id);
    expect(sale.coinsEarned).toBe(75);
    expect(sale.inventory).toEqual([]);
    expect(removeTreasureFromInventory(sale.inventory, treasure.id).coinsEarned).toBe(0);
  });
});


describe("Equipment fusion", () => {
  it("uses three unequipped items of the same rarity and upgrades one tier", () => {
    const fineEquipment = (
      id: string,
      slot: EquipmentSlot
    ): EquipmentItem => ({
      ...equipment(id, slot),
      rarity: "精良",
    });
    const inventory = [
      fineEquipment("fine-helmet", "頭盔"),
      fineEquipment("fine-weapon", "武器"),
      fineEquipment("fine-chest", "胸甲"),
      fineEquipment("fine-legs", "護腿"),
    ];

    const fusion = prepareEquipmentFusion(
      inventory,
      ["fine-legs"],
      "精良",
      1,
      () => 0,
      () => 123
    );

    expect(fusion?.consumedIds).toEqual([
      "fine-helmet",
      "fine-weapon",
      "fine-chest",
    ]);
    expect(fusion?.result.rarity).toBe("稀有");
    expect(fusion?.result.kind).toBe("equipment");
    expect(["頭盔", "武器", "胸甲"]).toContain(fusion?.result.slot);
    expect(fusion?.result.affixes).toHaveLength(1);
  });

  it("fuses exactly the three selected materials instead of the first inventory items", () => {
    const fineEquipment = (id: string, slot: EquipmentSlot): EquipmentItem => ({
      ...equipment(id, slot),
      rarity: "精良",
    });
    const inventory = [
      fineEquipment("fine-first", "頭盔"),
      fineEquipment("fine-selected-weapon", "武器"),
      fineEquipment("fine-selected-chest", "胸甲"),
      fineEquipment("fine-selected-legs", "護腿"),
    ];
    const selectedIds = [
      "fine-selected-legs",
      "fine-selected-chest",
      "fine-selected-weapon",
    ];

    const fusion = prepareEquipmentFusion(
      inventory,
      [],
      "精良",
      1,
      () => 0,
      () => 456,
      selectedIds
    );

    expect(fusion?.consumedIds).toEqual(selectedIds);
    expect(fusion?.consumedIds).not.toContain("fine-first");
    expect(fusion?.result.rarity).toBe("稀有");
  });

  it("rejects duplicate, mixed-rarity, equipped, or incomplete selected materials", () => {
    const fineEquipment = (id: string, slot: EquipmentSlot): EquipmentItem => ({
      ...equipment(id, slot),
      rarity: "精良",
    });
    const inventory = [
      fineEquipment("fine-helmet", "頭盔"),
      fineEquipment("fine-weapon", "武器"),
      fineEquipment("fine-chest", "胸甲"),
      equipment("common-legs", "護腿"),
    ];
    const prepare = (selectedIds: string[], equipped: string[] = []) =>
      prepareEquipmentFusion(
        inventory,
        equipped,
        "精良",
        1,
        () => 0,
        () => 789,
        selectedIds
      );

    expect(prepare(["fine-helmet", "fine-weapon", "fine-helmet"])).toBeNull();
    expect(prepare(["fine-helmet", "fine-weapon", "common-legs"])).toBeNull();
    expect(
      prepare(["fine-helmet", "fine-weapon", "fine-chest"], ["fine-weapon"])
    ).toBeNull();
    expect(prepare(["fine-helmet", "fine-weapon"])).toBeNull();
  });

  it("rejects insufficient materials and prevents fusion above mythic", () => {
    const commonItems = [
      equipment("common-helmet", "頭盔"),
      equipment("common-weapon", "武器"),
    ];
    expect(
      prepareEquipmentFusion(commonItems, [], "普通", 1, () => 0, () => 1)
    ).toBeNull();
    expect(nextLootRarity("傳說")).toBe("神話");
    expect(nextLootRarity("神話")).toBeNull();
    expect(
      prepareEquipmentFusion(
        [
          { ...equipment("mythic-helmet", "頭盔"), rarity: "神話" },
          { ...equipment("mythic-weapon", "武器"), rarity: "神話" },
          { ...equipment("mythic-chest", "胸甲"), rarity: "神話" },
        ],
        [],
        "神話",
        50,
        () => 0,
        () => 1
      )
    ).toBeNull();
  });
});
