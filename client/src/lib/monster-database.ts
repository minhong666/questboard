export type MonsterMechanicDefinition = {
  name: string;
  description: string;
  region: string;
  physicalResistancePercent?: number;
  magicResistancePercent?: number;
  dodgeIgnorePercent?: number;
  lifestealPercent?: number;
  explosionDamage?: number;
  reflectDamage?: number;
};

export function getMonsterMechanicLabels(
  monster: Pick<MonsterMechanicDefinition, "physicalResistancePercent" | "magicResistancePercent" | "dodgeIgnorePercent" | "lifestealPercent" | "explosionDamage" | "reflectDamage">
): string[] {
  const labels: string[] = [];
  if (monster.physicalResistancePercent) {
    labels.push(`物理抗性 ${monster.physicalResistancePercent > 0 ? "+" : ""}${monster.physicalResistancePercent}%`);
  }
  if (monster.magicResistancePercent) {
    labels.push(`魔法抗性 ${monster.magicResistancePercent > 0 ? "+" : ""}${monster.magicResistancePercent}%`);
  }
  if (monster.dodgeIgnorePercent) labels.push(`無視閃避 ${monster.dodgeIgnorePercent}%`);
  if (monster.lifestealPercent) labels.push(`吸血回復 ${monster.lifestealPercent}%`);
  if (monster.explosionDamage) labels.push(`死亡自爆 ${monster.explosionDamage} 固定傷害`);
  if (monster.reflectDamage) labels.push(`受擊反傷 ${monster.reflectDamage} 固定傷害`);
  return labels;
}

export const DAILY_MONSTER_CATALOG: MonsterMechanicDefinition[] = [
  { name: "狂暴野豬", description: "在迷霧森林中橫衝直撞的野獸。", region: "迷霧森林" },
  { name: "迷霧史萊姆", description: "濃霧凝成的黏液怪，能吸收物理衝擊。", region: "迷霧森林", physicalResistancePercent: 20 },
  { name: "森林毒蛛", description: "以毒液與獵物生命力維生的巨蛛。", region: "迷霧森林", lifestealPercent: 15 },
  { name: "枯木樹精", description: "古老樹根守護者，對魔法特別脆弱。", region: "迷霧森林", magicResistancePercent: -20 },
  { name: "哥布林刺客", description: "藏在林間陰影裡伺機而動的哥布林。", region: "迷霧森林" },
  { name: "荒野鬃狼", description: "在荒野追逐商隊的兇猛鬃狼。", region: "咆哮荒野" },
  { name: "巨石蟹", description: "甲殼像岩石一樣堅硬的荒野蟹。", region: "咆哮荒野", physicalResistancePercent: 30 },
  { name: "沙蜥獵手", description: "能捕捉攻擊軌跡的沙地獵手。", region: "咆哮荒野", dodgeIgnorePercent: 20 },
  { name: "禿鷹強盜", description: "盤旋荒地上空、掠奪旅人的禿鷹。", region: "咆哮荒野" },
  { name: "土元素傀儡", description: "由荒野岩土凝聚而成的傀儡。", region: "咆哮荒野" },
  { name: "吸血蝙蝠群", description: "成群撲上的蝙蝠，會把傷口變成自己的力量。", region: "暗影礦坑", lifestealPercent: 25 },
  { name: "礦坑食屍鬼", description: "在礦坑深處啃食殘骸的食屍鬼。", region: "暗影礦坑" },
  { name: "幽暗蜘蛛女", description: "能看穿閃避動作的礦坑蛛后。", region: "暗影礦坑", dodgeIgnorePercent: 25 },
  { name: "瘋狂礦工骨架", description: "揮舞鎬子的亡者礦工。", region: "暗影礦坑" },
  { name: "深淵蠕蟲", description: "從礦脈裂縫鑽出的巨大蠕蟲。", region: "暗影礦坑" },
  { name: "雪原霜狼", description: "在暴風雪中尋找獵物的霜狼。", region: "凜冬雪原" },
  { name: "冰晶水元素", description: "冰晶核心凝聚的寒冷元素。", region: "凜冬雪原", magicResistancePercent: 30 },
  { name: "凍土巨人", description: "背負凍土與冰岩的巨人。", region: "凜冬雪原", physicalResistancePercent: 25 },
  { name: "寒冰雪怪", description: "棲息在雪崖間的高大雪怪。", region: "凜冬雪原" },
  { name: "霜凍巫妖幼體", description: "尚未完全成形的冰霜亡靈。", region: "凜冬雪原" },
  { name: "熔岩幼龍", description: "在火山口學習吐息的幼龍。", region: "烈焰火山" },
  { name: "烈焰元素", description: "由熔岩火焰聚成的元素。", region: "烈焰火山", magicResistancePercent: 25 },
  { name: "地獄火犬", description: "會以灼熱獠牙撕裂傷口的魔犬。", region: "烈焰火山", lifestealPercent: 20 },
  { name: "黑曜石石像鬼", description: "黑曜石外殼幾乎不受物理攻擊影響。", region: "烈焰火山", physicalResistancePercent: 35 },
  { name: "爆裂史萊姆", description: "核心破裂時會把最後的火焰炸向敵人。", region: "烈焰火山", explosionDamage: 35 },
  { name: "遺跡守衛兵", description: "遵循古代命令守護遺跡的兵俑。", region: "遠古遺跡", physicalResistancePercent: 20 },
  { name: "發光符文石像", description: "符文護壁能削弱來襲法術。", region: "遠古遺跡", magicResistancePercent: 20 },
  { name: "發狂的詛咒鎧甲", description: "被詛咒意志驅動的空鎧甲。", region: "遠古遺跡" },
  { name: "墓穴石像鬼", description: "盤踞古墓入口的石翼怪物。", region: "遠古遺跡" },
  { name: "幽靈法師", description: "沒有肉身卻能捕捉閃避軌跡的亡靈。", region: "遠古遺跡", dodgeIgnorePercent: 30 },
  { name: "沼澤巨鱷", description: "伏擊泥沼旅人的巨型鱷魚。", region: "毒霧沼澤" },
  { name: "毒角飛蜥", description: "以毒角俯衝攻擊的飛蜥。", region: "毒霧沼澤" },
  { name: "腐泥怪", description: "腐泥聚成的軟體怪物，能分散物理衝擊。", region: "毒霧沼澤", physicalResistancePercent: 15 },
  { name: "食人花蜥", description: "花冠張開便會吸取獵物生命的沼蜥。", region: "毒霧沼澤", lifestealPercent: 30 },
  { name: "發光毒蚊群", description: "數量龐大、幾乎無法躲開的毒蚊群。", region: "毒霧沼澤", dodgeIgnorePercent: 40 },
  { name: "深海巡衛魚人", description: "巡視沉船遺跡的魚人衛兵。", region: "深海遺跡" },
  { name: "巨型斑斕章魚", description: "觸手能預判閃避方向的深海獵手。", region: "深海遺跡", dodgeIgnorePercent: 25 },
  { name: "海妖吟唱者", description: "歌聲形成魔力屏障的海妖。", region: "深海遺跡", magicResistancePercent: 25 },
  { name: "電擊水母", description: "受擊時會釋放電流反擊的水母。", region: "深海遺跡", reflectDamage: 12 },
  { name: "深淵鋸齒鯊", description: "咬中獵物便會迅速恢復的鋸齒鯊。", region: "深海遺跡", lifestealPercent: 20 },
  { name: "墮落狂信徒", description: "在廢棄修道院祈禱的狂信徒。", region: "墮落修道院" },
  { name: "石雕狂暴者", description: "刻滿戰痕、難以破壞的石雕戰士。", region: "墮落修道院", physicalResistancePercent: 30 },
  { name: "影魔奴僕", description: "從祭壇陰影中誕生的魔物。", region: "墮落修道院" },
  { name: "血色祭司", description: "以鮮血儀式維持生命的祭司。", region: "墮落修道院", lifestealPercent: 35 },
  { name: "詛咒十字軍", description: "穿著染血鎧甲的墮落騎士。", region: "墮落修道院" },
  { name: "虛空追獵者", description: "能鎖定獵物動作的裂隙獵手。", region: "虛空裂隙", dodgeIgnorePercent: 50 },
  { name: "次元蝕鐵獸", description: "同時抵抗武器與法術的異界野獸。", region: "虛空裂隙", physicalResistancePercent: 20, magicResistancePercent: 20 },
  { name: "虛空寄生蟲", description: "寄生在傷口中並吸取生命的蟲群。", region: "虛空裂隙", lifestealPercent: 30 },
  { name: "星界行者", description: "穿梭星界裂痕的神秘行者。", region: "虛空裂隙" },
  { name: "滅世小鬼", description: "看似弱小卻帶著終焉氣息的小鬼。", region: "虛空裂隙" },
];

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function selectDailyMonsterDefinitions(
  refreshKey: string,
  count = 6
) {
  const safeCount = Math.min(DAILY_MONSTER_CATALOG.length, Math.max(0, Math.floor(count)));
  return DAILY_MONSTER_CATALOG
    .map((definition, index) => ({
      definition,
      catalogIndex: index,
      sortKey: stableHash(`${refreshKey}:${definition.name}`),
    }))
    .sort((left, right) => left.sortKey - right.sortKey)
    .slice(0, safeCount);
}
