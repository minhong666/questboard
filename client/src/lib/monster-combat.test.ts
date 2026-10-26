import { describe, expect, it } from "vitest";
import {
  applyMonsterGroupDamage,
  createMonsterGroupMembers,
  getLivingMonsterGroupMembers,
} from "./monster-combat";

describe("monster group combat", () => {
  it("creates three living members with the full shared health pool", () => {
    const members = createMonsterGroupMembers("swarm", 100);
    expect(members).toHaveLength(3);
    expect(members.every(member => member.health === member.maxHealth)).toBe(true);
    expect(members.reduce((total, member) => total + member.health, 0)).toBe(100);
  });

  it("applies one attack to only one living member", () => {
    const members = createMonsterGroupMembers("swarm", 90);
    const result = applyMonsterGroupDamage(members, 40);
    expect(result.members.map(member => member.health)).toEqual([0, 30, 30]);
    expect(result.targetMemberId).toBe("swarm-member-1");
    expect(result.totalDamageApplied).toBe(30);
    expect(getLivingMonsterGroupMembers(result.members)).toHaveLength(2);

    const unevenMembers = [
      { id: "a", health: 10, maxHealth: 10 },
      { id: "b", health: 10, maxHealth: 10 },
      { id: "c", health: 70, maxHealth: 70 },
    ];
    const targeted = applyMonsterGroupDamage(unevenMembers, 30, "c");
    expect(targeted.members.map(member => member.health)).toEqual([10, 10, 40]);
    expect(targeted.targetMemberId).toBe("c");
    expect(targeted.totalDamageApplied).toBe(30);
  });

  it("does not apply negative damage or damage defeated members", () => {
    const members = createMonsterGroupMembers("swarm", 60);
    const untouched = applyMonsterGroupDamage(members, -10);
    expect(untouched.members).toEqual(members);
    expect(untouched.totalDamageApplied).toBe(0);
    const defeated = applyMonsterGroupDamage(members, 60);
    const afterDeath = applyMonsterGroupDamage(defeated.members, 20);
    expect(afterDeath.members.map(member => member.health)).toEqual([0, 0, 20]);
    expect(afterDeath.targetMemberId).toBe("swarm-member-2");
    expect(afterDeath.totalDamageApplied).toBe(20);
  });
});
