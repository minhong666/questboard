export type MonsterGroupMember = {
  id: string;
  health: number;
  maxHealth: number;
  damage?: number;
  defense?: number;
  critRate?: number;
  critDamage?: number;
  dodgeRate?: number;
  physicalResistancePercent?: number;
  magicResistancePercent?: number;
  lifestealPercent?: number;
  reflectDamage?: number;
  explosionDamage?: number;
};
export type MonsterGroupMemberStats = Omit<
  MonsterGroupMember,
  "id" | "health" | "maxHealth"
>;

export type MonsterGroupDamageResult = {
  members: MonsterGroupMember[];
  damageByMember: Record<string, number>;
  targetMemberId?: string;
  totalDamageApplied: number;
};

export function createMonsterGroupMembers(
  monsterId: string,
  totalHealth: number,
  count = 3,
  stats?: MonsterGroupMemberStats
): MonsterGroupMember[] {
  const safeCount = Math.max(2, Math.floor(count));
  const safeHealth = Math.max(safeCount, Math.floor(totalHealth));
  const baseHealth = Math.floor(safeHealth / safeCount);
  const remainder = safeHealth % safeCount;
  const halve = (value: number | undefined, minimum = 0) =>
    value === undefined ? undefined : Math.max(minimum, Math.round(value / 2));
  const halvedStats: MonsterGroupMemberStats = {
    damage: halve(stats?.damage, 1),
    defense: halve(stats?.defense, 1),
    critRate: halve(stats?.critRate),
    critDamage: halve(stats?.critDamage, 1),
    dodgeRate: halve(stats?.dodgeRate),
    physicalResistancePercent: halve(stats?.physicalResistancePercent),
    magicResistancePercent: halve(stats?.magicResistancePercent),
    lifestealPercent: halve(stats?.lifestealPercent),
    reflectDamage: halve(stats?.reflectDamage),
    explosionDamage: halve(stats?.explosionDamage),
  };
  return Array.from({ length: safeCount }, (_, index) => {
    const maxHealth = stats
      ? Math.max(1, Math.round(safeHealth / 2))
      : baseHealth + (index < remainder ? 1 : 0);
    return {
      id: `${monsterId}-member-${index + 1}`,
      health: maxHealth,
      maxHealth,
      ...halvedStats,
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
  const target =
    nextMembers.find(
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

export function applyMonsterGroupAreaDamage(
  members: MonsterGroupMember[],
  damagePerTarget: number,
  maxTargets = Number.POSITIVE_INFINITY
): MonsterGroupDamageResult {
  const nextMembers = members.map(member => ({ ...member }));
  const damageByMember: Record<string, number> = {};
  const targetLimit = Math.max(0, Math.floor(maxTargets));
  let targetsHit = 0;
  let totalDamageApplied = 0;
  const safeDamage = Math.max(0, Math.floor(damagePerTarget));

  for (const member of nextMembers) {
    if (member.health <= 0 || targetsHit >= targetLimit) continue;
    const applied = Math.min(member.health, safeDamage);
    if (applied <= 0) continue;
    member.health -= applied;
    damageByMember[member.id] = applied;
    totalDamageApplied += applied;
    targetsHit += 1;
  }

  return {
    members: nextMembers,
    damageByMember,
    targetMemberId: Object.keys(damageByMember)[0],
    totalDamageApplied,
  };
}

export function applyMonsterGroupMappedAreaDamage(
  members: MonsterGroupMember[],
  damageForMember: (member: MonsterGroupMember) => number,
  excludedMemberId?: string
): MonsterGroupDamageResult {
  const nextMembers = members.map(member => ({ ...member }));
  const damageByMember: Record<string, number> = {};
  let totalDamageApplied = 0;

  for (const member of nextMembers) {
    if (member.health <= 0 || member.id === excludedMemberId) continue;
    const damage = Math.max(0, Math.floor(damageForMember(member)));
    const applied = Math.min(member.health, damage);
    if (applied <= 0) continue;
    member.health -= applied;
    damageByMember[member.id] = applied;
    totalDamageApplied += applied;
  }

  return {
    members: nextMembers,
    damageByMember,
    targetMemberId: Object.keys(damageByMember)[0],
    totalDamageApplied,
  };
}

export function getLivingMonsterGroupMembers(
  members: MonsterGroupMember[]
): MonsterGroupMember[] {
  return members.filter(member => member.health > 0);
}
