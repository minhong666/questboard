import { describe, expect, it } from "vitest";
import {
  applyArcherAttackBonus,
  getArcherEffectiveDodgeRate,
  getArcherTalentBonuses,
  getNextArcherDodgeFailStacks,
  normalizeArcherDodgeFailStacks,
} from "./archer-talent";

describe("archer evasion talent", () => {
  it("adds a permanent 10% dodge bonus and caps total dodge at 100%", () => {
    expect(getArcherEffectiveDodgeRate(5, 0)).toBe(15);
    expect(getArcherEffectiveDodgeRate(5, 2)).toBe(25);
    expect(getArcherEffectiveDodgeRate(95, 10)).toBe(100);
  });

  it("adds 3% attack and 5% dodge per failed dodge stack", () => {
    expect(getArcherTalentBonuses(0)).toEqual({
      attackPercent: 0,
      dodgePercent: 0,
    });
    expect(getArcherTalentBonuses(3)).toEqual({
      attackPercent: 9,
      dodgePercent: 15,
    });
  });

  it("applies the accumulated attack bonus to the next and following attacks", () => {
    expect(applyArcherAttackBonus(100, 0)).toBe(100);
    expect(applyArcherAttackBonus(100, 1)).toBe(103);
    expect(applyArcherAttackBonus(100, 3)).toBe(109);
  });

  it("adds one stack after a failed dodge and clears all stacks after a success", () => {
    expect(getNextArcherDodgeFailStacks(0, false)).toBe(1);
    expect(getNextArcherDodgeFailStacks(2, false)).toBe(3);
    expect(getNextArcherDodgeFailStacks(18, false)).toBe(18);
    expect(getNextArcherDodgeFailStacks(3, true)).toBe(0);
  });

  it("normalizes missing, invalid, and negative legacy save values safely", () => {
    expect(normalizeArcherDodgeFailStacks(undefined)).toBe(0);
    expect(normalizeArcherDodgeFailStacks(Number.NaN)).toBe(0);
    expect(normalizeArcherDodgeFailStacks(-5)).toBe(0);
    expect(normalizeArcherDodgeFailStacks(2.8)).toBe(2);
    expect(normalizeArcherDodgeFailStacks(1000)).toBe(18);
  });
});
