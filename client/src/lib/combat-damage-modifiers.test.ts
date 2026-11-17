import { describe, expect, it } from "vitest";
import {
  capCombinedDamageModifierPercent,
  getCappedDamageBonusMultiplier,
  getCappedDamageReductionMultiplier,
} from "./combat-damage-modifiers";

describe("combat damage modifier caps", () => {
  it("caps total damage reduction at 80% and preserves values below the cap", () => {
    expect(capCombinedDamageModifierPercent([25, 30])).toBe(55);
    expect(capCombinedDamageModifierPercent([30, 50])).toBe(80);
    expect(capCombinedDamageModifierPercent([60, 40])).toBe(80);
  });

  it("preserves multiplicative damage bonuses below the cap and caps the final multiplier", () => {
    expect(getCappedDamageBonusMultiplier([20, 30])).toBeCloseTo(1.56);
    expect(getCappedDamageBonusMultiplier([80])).toBe(1.8);
    expect(getCappedDamageBonusMultiplier([50, 50])).toBe(1.8);
  });

  it("caps multiplicative reductions at 80% while preserving lower totals", () => {
    expect(getCappedDamageReductionMultiplier([20, 30])).toBeCloseTo(0.56);
    expect(getCappedDamageReductionMultiplier([80])).toBeCloseTo(0.2);
    expect(getCappedDamageReductionMultiplier([80, 80])).toBeCloseTo(0.2);
  });

  it("ignores non-finite modifier values without producing NaN", () => {
    expect(capCombinedDamageModifierPercent([Number.NaN, 40])).toBe(40);
    expect(getCappedDamageBonusMultiplier([Number.NaN, 20])).toBeCloseTo(1.2);
    expect(
      getCappedDamageReductionMultiplier([Number.POSITIVE_INFINITY, 20])
    ).toBeCloseTo(0.8);
    expect(
      Number.isNaN(getCappedDamageBonusMultiplier([Number.POSITIVE_INFINITY]))
    ).toBe(false);
  });
});
