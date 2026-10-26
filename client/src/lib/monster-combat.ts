export type MonsterGroupMember = {
  id: string;
  health: number;
  maxHealth: number;
};

export type MonsterGroupDamageResult = {
  members: MonsterGroupMember[];
  damageByMember: Record<string, number>;
  targetMemberId?: string;
  totalDamageApplied: number;
};

export function createMonsterGroupMembers(
  monsterId: string,
  totalHealth: number,
  count = 3
): MonsterGroupMember[] {
  const safeCount = Math.max(2, Math.floor(count));
  const safeHealth = Math.max(safeCount, Math.floor(totalHealth));
  const baseHealth = Math.floor(safeHealth / safeCount);
  const remainder = safeHealth % safeCount;
  return Array.from({ length: safeCount }, (_, index) => {
    const maxHealth = baseHealth + (index < remainder ? 1 : 0);
    return {
      id: `${monsterId}-member-${index + 1}`,
      health: maxHealth,
      maxHealth,
    };
  });
}

export function applyMonsterGroupDamage(
  members: MonsterGroupMember[],
  damage: number,
  targetMemberId?: string
): MonsterGroupDamageResult {
  const nextMembers = members.map(member => ({ ...member }));
  const damageByMember: Record<string, number> = {};
  const target = nextMembers.find(
    member => member.health > 0 && member.id === targetMemberId
  ) ?? nextMembers.find(member => member.health > 0);
  const applied = target
    ? Math.min(target.health, Math.max(0, Math.floor(damage)))
    : 0;
  if (target && applied > 0) {
    target.health -= applied;
    damageByMember[target.id] = applied;
  }

  return {
    members: nextMembers,
    damageByMember,
    targetMemberId: target?.id,
    totalDamageApplied: applied,
  };
}

export function getLivingMonsterGroupMembers(members: MonsterGroupMember[]): MonsterGroupMember[] {
  return members.filter(member => member.health > 0);
}
