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

  it("distributes damage across living members and can remove one member", () => {
    const members = createMonsterGroupMembers("swarm", 90);
    const result = applyMonsterGroupDamage(members, 40);
    expect(result.members.map(member => member.health)).toEqual([16, 16, 18]);
    expect(getLivingMonsterGroupMembers(result.members)).toHaveLength(3);

    const unevenMembers = [
      { id: "a", health: 10, maxHealth: 10 },
      { id: "b", health: 10, maxHealth: 10 },
      { id: "c", health: 70, maxHealth: 70 },
    ];
    const defeated = applyMonsterGroupDamage(unevenMembers, 30);
    expect(getLivingMonsterGroupMembers(defeated.members)).toHaveLength(1);
    expect(defeated.members.filter(member => member.health === 0)).toHaveLength(2);
  });

  it("does not apply negative damage or damage defeated members", () => {
    const members = createMonsterGroupMembers("swarm", 60);
    const untouched = applyMonsterGroupDamage(members, -10);
    expect(untouched.members).toEqual(members);
    const defeated = applyMonsterGroupDamage(members, 60);
    const afterDeath = applyMonsterGroupDamage(defeated.members, 20);
    expect(afterDeath.members).toEqual(defeated.members);
  });
});
