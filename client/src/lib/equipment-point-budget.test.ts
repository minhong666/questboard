import { describe, expect, it } from "vitest";
import { RPG_EQUIPMENT_TEMPLATES } from "./equipment-database";

const POINT_BUDGET_BY_RARITY: Record<string, number> = {
  普通: 10,
  精良: 20,
  稀有: 30,
  史詩: 40,
  傳說: 55,
  神話: 65,
};

function getBonusPoints(bonus: string): number {
  return bonus.split(" · ").reduce((total, attribute) => {
    const match = attribute.match(
      /^(生命|力量|防禦|智力|暴擊率|暴擊傷害|閃避率|施法速度) \+([\d.]+)%?$/
    );
    if (!match) throw new Error(`Unknown equipment bonus: ${attribute}`);

    const value = Number(match[2]);
    switch (match[1]) {
      case "生命":
        return total + value / 10;
      case "暴擊率":
      case "閃避率":
        return total + value * 2;
      case "施法速度":
        return total + value / 2;
      default:
        return total + value;
    }
  }, 0);
}

describe("equipment point budgets", () => {
  it("assigns the target point budget to every equipment template", () => {
    expect(RPG_EQUIPMENT_TEMPLATES.length).toBeGreaterThan(0);

    for (const equipment of RPG_EQUIPMENT_TEMPLATES) {
      expect(getBonusPoints(equipment.bonus), equipment.name).toBe(
        POINT_BUDGET_BY_RARITY[equipment.rarity]
      );
    }
  });
});
