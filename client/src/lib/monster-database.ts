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
  encounterType?: "individual" | "swarm";
};

/**
 * 小怪的戰鬥數值倍率：Lv.1–9 維持原值，從 Lv.10 起每 10 級增加 0.25，
 * Lv.100 以上固定使用 Lv.100 的倍率。
 */
export function getSmallMonsterStatMultiplier(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level));
  if (safeLevel < 10) return 1;
  return Math.min(3.75, 1.5 + Math.floor((safeLevel - 10) / 10) * 0.25);
}

/** 小怪暴擊率倍率每 10 級增加 0.1，Lv.100 以上固定使用 Lv.100 倍率。 */
export function getSmallMonsterCritRateMultiplier(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level));
  if (safeLevel < 10) return 1;
  return Math.min(2.1, 1.2 + Math.floor((safeLevel - 10) / 10) * 0.1);
}

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

const BASE_DAILY_MONSTER_CATALOG: MonsterMechanicDefinition[] = [
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


/** 新增的小怪設計：20 種個體小怪、30 種群聚小怪。 */
export const ADDITIONAL_MINOR_MONSTER_CATALOG: MonsterMechanicDefinition[] = [
  // 迷霧森林：2 個體、3 群聚
  { name: "藤蔓獵犬", description: "四肢纏滿活藤、會沿著樹根追蹤氣味的森林獵犬。", region: "迷霧森林", encounterType: "individual", dodgeIgnorePercent: 15 },
  { name: "霧冠鹿妖", description: "以霧氣遮掩鹿角、守護森林深處古泉的鹿妖。", region: "迷霧森林", encounterType: "individual", magicResistancePercent: 20 },
  { name: "葉刃螳螂群", description: "藏在蕨葉間、以整齊刀臂切開獵物退路的螳螂群。", region: "迷霧森林", encounterType: "swarm", dodgeIgnorePercent: 20 },
  { name: "螢光孢子群", description: "漂浮在霧中的發光孢子，會在接觸傷口時竊取生命。", region: "迷霧森林", encounterType: "swarm", lifestealPercent: 15 },
  { name: "樹洞幼蜂群", description: "守著蜂蜜與樹脂巢穴、被驚動便傾巢而出的幼蜂群。", region: "迷霧森林", encounterType: "swarm", explosionDamage: 18 },

  // 咆哮荒野：2 個體、3 群聚
  { name: "赤鬃犀", description: "鬃毛燃著赤色砂火、能把岩柱撞成碎片的荒野巨犀。", region: "咆哮荒野", encounterType: "individual", physicalResistancePercent: 25 },
  { name: "風蝕巨蜥", description: "背甲刻滿風蝕紋路、會耐心等待獵物露出破綻的巨蜥。", region: "咆哮荒野", encounterType: "individual", dodgeIgnorePercent: 25 },
  { name: "逐風鬣狗群", description: "以嚎叫互相定位、能從四面八方包抄旅人的鬣狗群。", region: "咆哮荒野", encounterType: "swarm", lifestealPercent: 12 },
  { name: "黃沙蠍群", description: "鑽出沙丘縫隙的毒蠍群，尾針會在混戰中輪番落下。", region: "咆哮荒野", encounterType: "swarm", reflectDamage: 8 },
  { name: "旱地禿鷲群", description: "盤旋等待疲憊獵物的禿鷲群，能從死角撕開防線。", region: "咆哮荒野", encounterType: "swarm", dodgeIgnorePercent: 30 },

  // 暗影礦坑：2 個體、3 群聚
  { name: "鐵顎穴熊", description: "啃食礦石磨利鐵顎、把廢棄礦坑當成巢穴的穴熊。", region: "暗影礦坑", encounterType: "individual", physicalResistancePercent: 20 },
  { name: "黑晶礦魔", description: "由塌方黑晶喚醒的礦魔，胸口藏著不穩定的魔力脈動。", region: "暗影礦坑", encounterType: "individual", magicResistancePercent: 25 },
  { name: "礦脈寄生蟲群", description: "沿著礦脈鑽行的寄生蟲群，會從每道傷口汲取養分。", region: "暗影礦坑", encounterType: "swarm", lifestealPercent: 25 },
  { name: "盲眼蝙蝠群", description: "以回聲鎖定獵物、讓黑暗礦道無處可躲的蝙蝠群。", region: "暗影礦坑", encounterType: "swarm", dodgeIgnorePercent: 35 },
  { name: "燼火鼠群", description: "啃食火藥與燼屑的鼠群，受驚時會把灼熱碎屑撒向四周。", region: "暗影礦坑", encounterType: "swarm", explosionDamage: 22 },

  // 凜冬雪原：2 個體、3 群聚
  { name: "冰角馴鹿", description: "鹿角凝著寒霜、會在雪原上踏出冰裂的孤傲馴鹿。", region: "凜冬雪原", encounterType: "individual", physicalResistancePercent: 20 },
  { name: "雪幕女巫", description: "披著雪幕吟唱古老咒語、能讓法術在暴風中偏轉的女巫。", region: "凜冬雪原", encounterType: "individual", magicResistancePercent: 30 },
  { name: "霜牙狼群", description: "沿著冰原裂谷包圍獵物、以霜牙交替撕咬的狼群。", region: "凜冬雪原", encounterType: "swarm", dodgeIgnorePercent: 20 },
  { name: "冰棘企鵝群", description: "投擲背上冰棘、用滑行衝勢撞擊敵人的企鵝群。", region: "凜冬雪原", encounterType: "swarm", reflectDamage: 10 },
  { name: "風雪精靈群", description: "混在暴風雪中的微小精靈群，會從四面削弱冒險者的魔力。", region: "凜冬雪原", encounterType: "swarm", magicResistancePercent: 20 },

  // 烈焰火山：2 個體、3 群聚
  { name: "赤鎧熔獸", description: "熔岩凝成甲殼、每次踏地都會引起火山震動的熔獸。", region: "烈焰火山", encounterType: "individual", physicalResistancePercent: 35 },
  { name: "灰燼術士", description: "在火山灰中施法、能把熄滅火星重新喚成烈焰的術士。", region: "烈焰火山", encounterType: "individual", magicResistancePercent: 25 },
  { name: "炎核蜥群", description: "腹藏灼熱炎核、沿著熔岩河追逐熱源的火蜥群。", region: "烈焰火山", encounterType: "swarm", lifestealPercent: 18 },
  { name: "火羽蝙蝠群", description: "翅膜拖著火羽、俯衝時把灼熱碎片灑滿戰場的蝙蝠群。", region: "烈焰火山", encounterType: "swarm", explosionDamage: 24 },
  { name: "熔渣蟲群", description: "從火山口爬出的熔渣蟲群，甲殼碎裂時會爆出灼熱核心。", region: "烈焰火山", encounterType: "swarm", explosionDamage: 28 },

  // 遠古遺跡：2 個體、3 群聚
  { name: "青銅方士", description: "守著失落曆法、以青銅符劍切斷咒術的遺跡方士。", region: "遠古遺跡", encounterType: "individual", dodgeIgnorePercent: 25 },
  { name: "斷首石衛", description: "失去頭顱仍遵守守門誓言、揮舞巨斧的石衛。", region: "遠古遺跡", encounterType: "individual", physicalResistancePercent: 35 },
  { name: "符文甲蟲群", description: "背甲刻著微光符文、會以蟲潮覆蓋古老石板的甲蟲群。", region: "遠古遺跡", encounterType: "swarm", magicResistancePercent: 20 },
  { name: "失語幽魂群", description: "從祭室飄出的無聲幽魂群，會讓獵物的閃避直覺逐漸失效。", region: "遠古遺跡", encounterType: "swarm", dodgeIgnorePercent: 35 },
  { name: "砂鐘傀儡群", description: "由古代砂鐘碎片拼成、會同步踏步逼近的傀儡群。", region: "遠古遺跡", encounterType: "swarm", reflectDamage: 14 },

  // 毒霧沼澤：2 個體、3 群聚
  { name: "泥沼巨蛙", description: "藏在泥潭中的巨蛙，舌頭能把遠處獵物拖進毒霧。", region: "毒霧沼澤", encounterType: "individual", lifestealPercent: 20 },
  { name: "腐冠巫醫", description: "戴著腐葉王冠、用沼澤藥泥交換詛咒力量的巫醫。", region: "毒霧沼澤", encounterType: "individual", magicResistancePercent: 25 },
  { name: "毒舌蛙群", description: "伏在荷葉下同時吐舌、以毒液封鎖沼澤小徑的蛙群。", region: "毒霧沼澤", encounterType: "swarm", dodgeIgnorePercent: 25 },
  { name: "瘴氣水蛭群", description: "從污水中湧出的水蛭群，會在混亂中黏住傷口吸取生命。", region: "毒霧沼澤", encounterType: "swarm", lifestealPercent: 35 },
  { name: "荊棘水螅群", description: "拖著荊棘觸手穿過淺水、以纏繞和反刺驅散入侵者的水螅群。", region: "毒霧沼澤", encounterType: "swarm", reflectDamage: 12 },

  // 深海遺跡：2 個體、3 群聚
  { name: "珊瑚巨蟹", description: "背負整片珊瑚礁、替沉船遺跡守住寶藏的巨蟹。", region: "深海遺跡", encounterType: "individual", physicalResistancePercent: 35 },
  { name: "沉船歌姬", description: "在沉船桅杆上歌唱、以聲波扭曲法術軌跡的海妖。", region: "深海遺跡", encounterType: "individual", magicResistancePercent: 30 },
  { name: "旋流魚群", description: "繞著古代石柱旋轉、以水流同時撞擊敵人的魚群。", region: "深海遺跡", encounterType: "swarm", dodgeIgnorePercent: 30 },
  { name: "深藍水母群", description: "漂浮在遺跡上方的水母群，觸鬚會把電流傳遍整片海水。", region: "深海遺跡", encounterType: "swarm", reflectDamage: 16 },
  { name: "鋸鰭海蛇群", description: "從裂縫竄出的海蛇群，會以鋸齒般的鰭刃輪番撕咬。", region: "深海遺跡", encounterType: "swarm", lifestealPercent: 22 },

  // 墮落修道院：2 個體、3 群聚
  { name: "黑鐘執刑官", description: "敲響黑鐘便踏入戰場、以沉重鐵鉤執行古老刑律的執刑官。", region: "墮落修道院", encounterType: "individual", physicalResistancePercent: 25 },
  { name: "灰燼修女", description: "守著熄滅聖壇、用灰燼祈禱換取暗影護佑的修女。", region: "墮落修道院", encounterType: "individual", lifestealPercent: 25 },
  { name: "祈罪蝙蝠群", description: "從鐘樓倒掛而下、會以尖嘯干擾獵物步伐的蝙蝠群。", region: "墮落修道院", encounterType: "swarm", dodgeIgnorePercent: 30 },
  { name: "斷誓教徒群", description: "手牽染血經卷、以狂熱隊形包圍異端的教徒群。", region: "墮落修道院", encounterType: "swarm", reflectDamage: 10 },
  { name: "骨燭蟲群", description: "在骸骨燭台間爬行、死後會點燃冷焰的蟲群。", region: "墮落修道院", encounterType: "swarm", explosionDamage: 20 },

  // 虛空裂隙：2 個體、3 群聚
  { name: "裂界獵犬", description: "能嗅到空間裂縫、從不可能的角度撲出的虛空獵犬。", region: "虛空裂隙", encounterType: "individual", dodgeIgnorePercent: 45 },
  { name: "星骸術士", description: "披著星骸碎片、把墜落星光化成咒刃的異界術士。", region: "虛空裂隙", encounterType: "individual", magicResistancePercent: 30 },
  { name: "虛空眼群", description: "漂浮在裂隙邊緣、以無數視線鎖定閃避路徑的眼魔群。", region: "虛空裂隙", encounterType: "swarm", dodgeIgnorePercent: 50 },
  { name: "折疊觸手群", description: "從重疊空間伸出的觸手群，攻擊方向會在落下前突然改變。", region: "虛空裂隙", encounterType: "swarm", reflectDamage: 15 },
  { name: "星塵噬蟲群", description: "啃食裂隙星塵維生、會把吸收的魔力反吐成爆裂光點的蟲群。", region: "虛空裂隙", encounterType: "swarm", explosionDamage: 30 },
];

export const DAILY_MONSTER_CATALOG: MonsterMechanicDefinition[] = [
  ...BASE_DAILY_MONSTER_CATALOG,
  ...ADDITIONAL_MINOR_MONSTER_CATALOG,
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
