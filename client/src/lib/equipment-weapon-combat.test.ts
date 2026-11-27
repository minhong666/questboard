import { describe, expect, it } from "vitest";
import {
  getDawnWardenBowSharedDamage,
  getDawnWardenSanctuaryDamage,
  shouldDawnWardenBowDistributeDamage,
} from "./equipment-weapon-combat";

describe("Dawn guardian weapon combat helpers", () => {
  it("shares Dawn Arrow attack damage across the living target count", () => {
    expect(getDawnWardenBowSharedDamage(120, 1, 0)).toBe(120);
    expect(getDawnWardenBowSharedDamage(120, 3, 0)).toBe(40);
    expect(getDawnWardenBowSharedDamage(120, 3, 1)).toBe(44);
    expect(getDawnWardenBowSharedDamage(120, 3, 2)).toBe(48);
  });

  it("caps Dawn Arrow's progressive per-target bonus at 30 percent", () => {
    expect(getDawnWardenBowSharedDamage(1000, 5, 0)).toBe(200);
    expect(getDawnWardenBowSharedDamage(1000, 5, 1)).toBe(220);
    expect(getDawnWardenBowSharedDamage(1000, 5, 2)).toBe(240);
    expect(getDawnWardenBowSharedDamage(1000, 5, 3)).toBe(260);
    expect(getDawnWardenBowSharedDamage(1000, 5, 4)).toBe(260);
  });

  it("keeps execute skills for a lone target but distributes them against groups", () => {
    expect(shouldDawnWardenBowDistributeDamage(true, 1)).toBe(false);
    expect(shouldDawnWardenBowDistributeDamage(true, 3)).toBe(true);
    expect(shouldDawnWardenBowDistributeDamage(false, 3)).toBe(false);
  });

  it("uses each Sanctuary target's own maximum health", () => {
    const maxHealthByTarget = [100, 250, 1200];
    expect(maxHealthByTarget.map(maxHealth => getDawnWardenSanctuaryDamage(maxHealth))).toEqual([
      3,
      7,
      36,
    ]);
  });
});
