import type { EquipmentSpecialAbilityId } from "./equipment-special-abilities";

export type WeaponPassiveBattleState = {
  ironGuardStacks: number;
  moonstringArrowReady: boolean;
  enemyAccuracyReductionNextPercent: number;
  nextEnemyAttackDodgeBonusPercent: number;
  hunterCritStacks: number;
  starrealmCritStacks: number;
  arcaneSkillCastsSinceEcho: number;
  arcaneEchoReady: boolean;
  fireVeinMarks: number;
};

export type WeaponTimedBuff = {
  id: EquipmentSpecialAbilityId;
  turnsRemaining: number;
  attackDamageBonusPercent?: number;
  critRateBonusPercent?: number;
  dodgeRateBonusPercent?: number;
};

export type WeaponTimedBuffBonuses = {
  attackDamageBonusPercent: number;
  critRateBonusPercent: number;
  dodgeRateBonusPercent: number;
};

export const INITIAL_WEAPON_PASSIVE_BATTLE_STATE: WeaponPassiveBattleState = {
  ironGuardStacks: 0,
  moonstringArrowReady: false,
  enemyAccuracyReductionNextPercent: 0,
  nextEnemyAttackDodgeBonusPercent: 0,
  hunterCritStacks: 0,
  starrealmCritStacks: 0,
  arcaneSkillCastsSinceEcho: 0,
  arcaneEchoReady: false,
  fireVeinMarks: 0,
};

export function rollPercentChance(
  chancePercent: number,
  randomValue = Math.random()
) {
  return chancePercent > 0 && randomValue < chancePercent / 100;
}

export function addCappedStack(current: number, maximum: number) {
  return Math.min(
    Math.max(0, Math.floor(maximum)),
    Math.max(0, Math.floor(current)) + 1
  );
}

export function getWeaponTimedBuffBonuses(
  buffs: WeaponTimedBuff[] = []
): WeaponTimedBuffBonuses {
  return buffs.reduce<WeaponTimedBuffBonuses>(
    (total, buff) => {
      if (buff.turnsRemaining <= 0) return total;
      return {
        attackDamageBonusPercent:
          total.attackDamageBonusPercent + (buff.attackDamageBonusPercent ?? 0),
        critRateBonusPercent:
          total.critRateBonusPercent + (buff.critRateBonusPercent ?? 0),
        dodgeRateBonusPercent:
          total.dodgeRateBonusPercent + (buff.dodgeRateBonusPercent ?? 0),
      };
    },
    {
      attackDamageBonusPercent: 0,
      critRateBonusPercent: 0,
      dodgeRateBonusPercent: 0,
    }
  );
}

export function advanceWeaponTimedBuffs(
  current: WeaponTimedBuff[] = [],
  triggered: WeaponTimedBuff[] = []
): WeaponTimedBuff[] {
  const next = new Map<EquipmentSpecialAbilityId, WeaponTimedBuff>();
  for (const buff of current) {
    if (buff.turnsRemaining > 1) {
      next.set(buff.id, { ...buff, turnsRemaining: buff.turnsRemaining - 1 });
    }
  }
  for (const buff of triggered) {
    if (buff.turnsRemaining <= 0) continue;
    next.set(buff.id, { ...buff });
  }
  return [...next.values()];
}
