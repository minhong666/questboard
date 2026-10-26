export type MonsterGroupMember = {
  id: string;
  health: number;
  maxHealth: number;
};

export type MonsterGroupDamageResult = {
  members: MonsterGroupMember[];
  damageByMember: Record<string, number>;
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
  damage: number
): MonsterGroupDamageResult {
  const nextMembers = members.map(member => ({ ...member }));
  const damageByMember: Record<string, number> = {};
  let remainingDamage = Math.max(0, Math.floor(damage));

  while (remainingDamage > 0) {
    const livingMembers = nextMembers.filter(member => member.health > 0);
    if (livingMembers.length === 0) break;
    const share = Math.max(1, Math.ceil(remainingDamage / livingMembers.length));
    for (const livingMember of livingMembers) {
      if (remainingDamage <= 0) break;
      const member = nextMembers.find(candidate => candidate.id === livingMember.id);
      if (!member || member.health <= 0) continue;
      const applied = Math.min(member.health, share, remainingDamage);
      member.health -= applied;
      damageByMember[member.id] = (damageByMember[member.id] ?? 0) + applied;
      remainingDamage -= applied;
    }
  }

  return { members: nextMembers, damageByMember };
}

export function getLivingMonsterGroupMembers(members: MonsterGroupMember[]): MonsterGroupMember[] {
  return members.filter(member => member.health > 0);
}
