import { describe, expect, it } from "vitest";
import {
  mergeDiscoveredEquipmentNames,
  parseDiscoveredEquipmentNames,
} from "./equipment-codex";
import { EQUIPMENT_CODEX_TEMPLATES } from "./loot";

describe("permanent equipment codex discoveries", () => {
  it("migrates equipment currently held in any save into the permanent set", () => {
    expect(
      mergeDiscoveredEquipmentNames(
        [],
        [
          [{ kind: "equipment", name: "森林守護胸甲" }],
          [{ kind: "equipment", name: "裂空魔刃" }],
        ]
      )
    ).toEqual(["森林守護胸甲", "裂空魔刃"]);
  });

  it("keeps a discovery after the equipment is consumed or no longer held", () => {
    expect(
      mergeDiscoveredEquipmentNames(
        ["合成素材甲"],
        [[], [{ kind: "treasure", name: "旅人的古幣袋" }]]
      )
    ).toEqual(["合成素材甲"]);
  });

  it("deduplicates names and ignores treasure, malformed items, and blank names", () => {
    expect(
      mergeDiscoveredEquipmentNames(
        ["已有裝備", "已有裝備"],
        [
          [
            { kind: "equipment", name: "新裝備" },
            { kind: "equipment", name: "新裝備" },
            { kind: "treasure", name: "不是裝備" },
            { kind: "equipment", name: "   " },
            { kind: "equipment", name: 123 },
          ],
        ]
      )
    ).toEqual(["已有裝備", "新裝備"]);
  });

  it("parses and sanitizes stored discoveries safely", () => {
    expect(
      parseDiscoveredEquipmentNames(["裝備甲", "裝備甲", "", null, 7])
    ).toEqual(["裝備甲"]);
    expect(parseDiscoveredEquipmentNames("invalid")).toEqual([]);
  });

  it("does not include the removed starter and special equipment", () => {
    const specialEquipmentNames = [
      "磨亮的冒險者短劍",
      "森林守護胸甲",
      "旅者皮帽",
      "見習者護腿",
      "森林守護護身符",
      "專注學者之戒",
      "迅捷旅者護腿",
      "不屈心核",
      "裂空魔刃",
      "區域王冠",
    ];

    expect(
      specialEquipmentNames.every(name =>
        EQUIPMENT_CODEX_TEMPLATES.every(item => item.name !== name)
      )
    ).toBe(true);
    expect(EQUIPMENT_CODEX_TEMPLATES).toHaveLength(540);
  });
});
