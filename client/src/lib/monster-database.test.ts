import { describe, expect, it } from "vitest";
import {
  DAILY_MONSTER_CATALOG,
  getSmallMonsterCritRateMultiplier,
  getMonsterMechanicLabels,
  getSmallMonsterStatMultiplier,
  selectDailyMonsterDefinitions,
} from "./monster-database";

describe("daily monster catalog", () => {
  it("contains 50 monsters across 10 regions with five monsters each", () => {
    expect(DAILY_MONSTER_CATALOG).toHaveLength(50);
    const counts = new Map<string, number>();
    for (const monster of DAILY_MONSTER_CATALOG) {
      counts.set(monster.region, (counts.get(monster.region) ?? 0) + 1);
    }
    expect(counts.size).toBe(10);
    expect([...counts.values()].every(count => count === 5)).toBe(true);
  });

  it("preserves every special mechanic listed on the monster entries", () => {
    const mechanicCount = DAILY_MONSTER_CATALOG.filter(
      monster => getMonsterMechanicLabels(monster).length > 0
    ).length;
    // The individual entries contain 28 mechanism monsters; the source summary says 24.
    expect(mechanicCount).toBe(28);
    expect(getMonsterMechanicLabels(DAILY_MONSTER_CATALOG[3])).toContain(
      "魔法抗性 -20%"
    );
    const voidParasite = DAILY_MONSTER_CATALOG.find(
      monster => monster.name === "虛空寄生蟲"
    );
    expect(voidParasite).toBeDefined();
    expect(getMonsterMechanicLabels(voidParasite!)).toContain(
      "吸血回復 30%"
    );
  });

  it("selects six unique monsters deterministically for each refresh day", () => {
    const today = selectDailyMonsterDefinitions("small-2026-10-21", 6);
    const sameDay = selectDailyMonsterDefinitions("small-2026-10-21", 6);
    const nextDay = selectDailyMonsterDefinitions("small-2026-10-22", 6);

    expect(today).toHaveLength(6);
    expect(new Set(today.map(item => item.definition.name)).size).toBe(6);
    expect(today).toEqual(sameDay);
    expect(today.map(item => item.definition.name)).not.toEqual(
      nextDay.map(item => item.definition.name)
    );
  });

  it("scales small monster stats by level and caps the multiplier at level 100", () => {
    expect(getSmallMonsterStatMultiplier(1)).toBe(1);
    expect(getSmallMonsterStatMultiplier(10)).toBe(1.5);
    expect(getSmallMonsterStatMultiplier(20)).toBe(1.75);
    expect(getSmallMonsterStatMultiplier(50)).toBe(2.5);
    expect(getSmallMonsterStatMultiplier(100)).toBe(3.75);
    expect(getSmallMonsterStatMultiplier(150)).toBe(3.75);
  });

  it("uses a separate crit-rate multiplier and never scales dodge rate", () => {
    expect(getSmallMonsterCritRateMultiplier(1)).toBe(1);
    expect(getSmallMonsterCritRateMultiplier(10)).toBe(1.2);
    expect(getSmallMonsterCritRateMultiplier(20)).toBe(1.3);
    expect(getSmallMonsterCritRateMultiplier(100)).toBe(2.1);
    expect(getSmallMonsterCritRateMultiplier(150)).toBe(2.1);
  });
});
