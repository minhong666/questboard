import { describe, expect, it } from "vitest";
import {
  ADDITIONAL_MINOR_MONSTER_CATALOG,
  DAILY_MONSTER_CATALOG,
  getDailyMonsterCritStats,
  getMonsterMechanicLabels,
  getSmallMonsterStatMultiplier,
  selectDailyMonsterDefinitions,
} from "./monster-database";

describe("daily monster catalog", () => {
  it("contains 100 monsters across 10 regions with ten monsters each", () => {
    expect(DAILY_MONSTER_CATALOG).toHaveLength(100);
    const counts = new Map<string, number>();
    for (const monster of DAILY_MONSTER_CATALOG) {
      counts.set(monster.region, (counts.get(monster.region) ?? 0) + 1);
    }
    expect(counts.size).toBe(10);
    expect([...counts.values()].every(count => count === 10)).toBe(true);
  });
  it("adds exactly 20 individual and 30 swarm minor monsters", () => {
    expect(ADDITIONAL_MINOR_MONSTER_CATALOG).toHaveLength(50);
    expect(ADDITIONAL_MINOR_MONSTER_CATALOG.filter(monster => monster.encounterType === "individual")).toHaveLength(20);
    expect(ADDITIONAL_MINOR_MONSTER_CATALOG.filter(monster => monster.encounterType === "swarm")).toHaveLength(30);
    expect(new Set(ADDITIONAL_MINOR_MONSTER_CATALOG.map(monster => monster.name)).size).toBe(50);
    expect(ADDITIONAL_MINOR_MONSTER_CATALOG.every(monster => monster.description.length >= 20)).toBe(true);
  });

  it("preserves every special mechanic listed on the monster entries", () => {
    const mechanicCount = DAILY_MONSTER_CATALOG.filter(
      monster => getMonsterMechanicLabels(monster).length > 0
    ).length;
    // The individual entries contain 28 mechanism monsters; the source summary says 24.
    expect(mechanicCount).toBeGreaterThan(28);
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

  it("assigns each daily monster stable, varied crit stats within the configured ranges", () => {
    const stats = DAILY_MONSTER_CATALOG.map((_, catalogIndex) =>
      getDailyMonsterCritStats("small-2026-10-21", catalogIndex)
    );
    const sameMonster = getDailyMonsterCritStats("small-2026-10-21", 0);
    const nextDayMonster = getDailyMonsterCritStats("small-2026-10-22", 0);

    expect(stats.every(({ critRate }) => critRate >= 10 && critRate <= 50)).toBe(true);
    expect(stats.every(({ critDamage }) => critDamage >= 120 && critDamage <= 180)).toBe(true);
    expect(new Set(stats.map(({ critRate }) => critRate)).size).toBeGreaterThan(1);
    expect(new Set(stats.map(({ critDamage }) => critDamage)).size).toBeGreaterThan(1);
    expect(getDailyMonsterCritStats("small-2026-10-21", 0)).toEqual(sameMonster);
    expect(nextDayMonster).not.toEqual(sameMonster);
  });
});
