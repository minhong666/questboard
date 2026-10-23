export type EquipmentDatabaseTemplate = {
  name: string;
  setId?: string;
  slot: "頭盔" | "胸甲" | "武器" | "護腿" | "護身符";
  weaponType?: WeaponType;
  element?: WeaponElement;
  rarity: "普通" | "精良" | "稀有" | "史詩" | "傳說" | "神話";
  description: string;
  bonus: string;
  icon: string;
  minLevel: number;
  equipmentLevel: number;
};

export type WeaponType = "劍" | "短刀" | "弓" | "法杖";
export type WeaponElement = "自然" | "冰霜" | "奧術" | "火焰" | "雷電";

export const RPG_EQUIPMENT_BENCHMARKS = {
  普通: { hp: "30–50", attack: "3–5", intelligence: "3–5", defense: "2–4", dodge: "0.5–1.0" },
  精良: { hp: "50–80", attack: "6–10", intelligence: "6–10", defense: "5–8", dodge: "1.2–2.0" },
  稀有: { hp: "80–150", attack: "11–20", intelligence: "11–20", defense: "9–15", dodge: "2.5–4.0" },
  史詩: { hp: "150–200", attack: "21–35", intelligence: "21–35", defense: "16–25", dodge: "4.5–6.5" },
  傳說: { hp: "200–280", attack: "36–55", intelligence: "36–55", defense: "26–40", dodge: "7.0–10.0" },
  神話: { hp: "280–380（極品 400）", attack: "56–80（極品 85）", intelligence: "56–80（極品 85）", defense: "41–60（極品 65）", dodge: "11.0–15.0" },
} as const;

const LEGACY_EQUIPMENT_TEMPLATES: EquipmentDatabaseTemplate[] = [
  { name: '皮質兜帽', slot: '頭盔', rarity: '普通', description: "依照設計基準打造的普通頭盔。", bonus: '生命 +35 · 防禦 +2 · 閃避率 +0.5%', icon: 'shield-check', minLevel: 1, equipmentLevel: 1 },
  { name: '粗鐵面罩', slot: '頭盔', rarity: '普通', description: "依照設計基準打造的普通頭盔。", bonus: '防禦 +4 · 力量 +3', icon: 'shield-check', minLevel: 1, equipmentLevel: 1 },
  { name: '學徒法帽', slot: '頭盔', rarity: '普通', description: "依照設計基準打造的普通頭盔。", bonus: '防禦 +2 · 智力 +4', icon: 'shield-check', minLevel: 1, equipmentLevel: 1 },
  { name: '獵人軟帽', slot: '頭盔', rarity: '普通', description: "依照設計基準打造的普通頭盔。", bonus: '防禦 +3 · 閃避率 +1.0%', icon: 'shield-check', minLevel: 1, equipmentLevel: 1 },
  { name: '破舊鐵盔', slot: '頭盔', rarity: '普通', description: "依照設計基準打造的普通頭盔。", bonus: '生命 +45 · 防禦 +3', icon: 'shield-check', minLevel: 1, equipmentLevel: 1 },
  { name: '亞麻便衣', slot: '胸甲', rarity: '普通', description: "依照設計基準打造的普通胸甲。", bonus: '生命 +50 · 防禦 +3', icon: 'shield', minLevel: 1, equipmentLevel: 1 },
  { name: '硬皮胸甲', slot: '胸甲', rarity: '普通', description: "依照設計基準打造的普通胸甲。", bonus: '生命 +30 · 防禦 +4 · 閃避率 +0.8%', icon: 'shield', minLevel: 1, equipmentLevel: 1 },
  { name: '生鐵鏈甲', slot: '胸甲', rarity: '普通', description: "依照設計基準打造的普通胸甲。", bonus: '防禦 +4 · 力量 +4', icon: 'shield', minLevel: 1, equipmentLevel: 1 },
  { name: '學士長袍', slot: '胸甲', rarity: '普通', description: "依照設計基準打造的普通胸甲。", bonus: '生命 +35 · 防禦 +2 · 智力 +5', icon: 'shield', minLevel: 1, equipmentLevel: 1 },
  { name: '獵犬皮革衣', slot: '胸甲', rarity: '普通', description: "依照設計基準打造的普通胸甲。", bonus: '生命 +40 · 防禦 +3 · 閃避率 +0.5%', icon: 'shield', minLevel: 1, equipmentLevel: 1 },
  { name: '粗布長褲', slot: '護腿', rarity: '普通', description: "依照設計基準打造的普通護腿。", bonus: '生命 +35 · 防禦 +2', icon: 'target', minLevel: 1, equipmentLevel: 1 },
  { name: '熟皮護腿', slot: '護腿', rarity: '普通', description: "依照設計基準打造的普通護腿。", bonus: '防禦 +3 · 閃避率 +0.7%', icon: 'target', minLevel: 1, equipmentLevel: 1 },
  { name: '生鐵護腿', slot: '護腿', rarity: '普通', description: "依照設計基準打造的普通護腿。", bonus: '防禦 +4 · 力量 +3', icon: 'target', minLevel: 1, equipmentLevel: 1 },
  { name: '學徒長裙', slot: '護腿', rarity: '普通', description: "依照設計基準打造的普通護腿。", bonus: '生命 +30 · 防禦 +2 · 智力 +4', icon: 'target', minLevel: 1, equipmentLevel: 1 },
  { name: '輕便皮褲', slot: '護腿', rarity: '普通', description: "依照設計基準打造的普通護腿。", bonus: '防禦 +3 · 閃避率 +1.0%', icon: 'target', minLevel: 1, equipmentLevel: 1 },
  { name: '銅質項鏈', slot: '護身符', rarity: '普通', description: "依照設計基準打造的普通護身符。", bonus: '生命 +45 · 防禦 +2', icon: 'star', minLevel: 1, equipmentLevel: 1 },
  { name: '力量吊墜', slot: '護身符', rarity: '普通', description: "依照設計基準打造的普通護身符。", bonus: '力量 +5', icon: 'star', minLevel: 1, equipmentLevel: 1 },
  { name: '智力水晶', slot: '護身符', rarity: '普通', description: "依照設計基準打造的普通護身符。", bonus: '智力 +5', icon: 'star', minLevel: 1, equipmentLevel: 1 },
  { name: '獵戶護符', slot: '護身符', rarity: '普通', description: "依照設計基準打造的普通護身符。", bonus: '力量 +3 · 閃避率 +0.5%', icon: 'star', minLevel: 1, equipmentLevel: 1 },
  { name: '靈巧護符', slot: '護身符', rarity: '普通', description: "依照設計基準打造的普通護身符。", bonus: '防禦 +3 · 閃避率 +1.0%', icon: 'star', minLevel: 1, equipmentLevel: 1 },
  { name: '精鍛鐵盔', slot: '頭盔', rarity: '精良', description: "依照設計基準打造的精良頭盔。", bonus: '生命 +65 · 防禦 +7 · 力量 +6', icon: 'shield-check', minLevel: 11, equipmentLevel: 2 },
  { name: '巡林者兜帽', slot: '頭盔', rarity: '精良', description: "依照設計基準打造的精良頭盔。", bonus: '防禦 +5 · 力量 +7 · 閃避率 +1.5%', icon: 'shield-check', minLevel: 11, equipmentLevel: 2 },
  { name: '元素師圓帽', slot: '頭盔', rarity: '精良', description: "依照設計基準打造的精良頭盔。", bonus: '生命 +50 · 防禦 +5 · 智力 +9', icon: 'shield-check', minLevel: 11, equipmentLevel: 2 },
  { name: '重型鋼盔', slot: '頭盔', rarity: '精良', description: "依照設計基準打造的精良頭盔。", bonus: '生命 +80 · 防禦 +8', icon: 'shield-check', minLevel: 11, equipmentLevel: 2 },
  { name: '游俠面具', slot: '頭盔', rarity: '精良', description: "依照設計基準打造的精良頭盔。", bonus: '防禦 +6 · 力量 +8 · 閃避率 +1.2%', icon: 'shield-check', minLevel: 11, equipmentLevel: 2 },
  { name: '精鍛鋼胸甲', slot: '胸甲', rarity: '精良', description: "依照設計基準打造的精良胸甲。", bonus: '生命 +75 · 防禦 +8 · 力量 +7', icon: 'shield', minLevel: 11, equipmentLevel: 2 },
  { name: '蜥蜴皮甲', slot: '胸甲', rarity: '精良', description: "依照設計基準打造的精良胸甲。", bonus: '生命 +55 · 防禦 +6 · 閃避率 +2.0%', icon: 'shield', minLevel: 11, equipmentLevel: 2 },
  { name: '學士法袍', slot: '胸甲', rarity: '精良', description: "依照設計基準打造的精良胸甲。", bonus: '生命 +60 · 防禦 +5 · 智力 +10', icon: 'shield', minLevel: 11, equipmentLevel: 2 },
  { name: '鎖子重甲', slot: '胸甲', rarity: '精良', description: "依照設計基準打造的精良胸甲。", bonus: '生命 +80 · 防禦 +8', icon: 'shield', minLevel: 11, equipmentLevel: 2 },
  { name: '巡邏輕甲', slot: '胸甲', rarity: '精良', description: "依照設計基準打造的精良胸甲。", bonus: '生命 +50 · 防禦 +6 · 力量 +8 · 閃避率 +1.2%', icon: 'shield', minLevel: 11, equipmentLevel: 2 },
  { name: '精鍛鋼護腿', slot: '護腿', rarity: '精良', description: "依照設計基準打造的精良護腿。", bonus: '生命 +65 · 防禦 +7 · 力量 +6', icon: 'target', minLevel: 11, equipmentLevel: 2 },
  { name: '蜥蜴皮護腿', slot: '護腿', rarity: '精良', description: "依照設計基準打造的精良護腿。", bonus: '防禦 +6 · 閃避率 +1.8%', icon: 'target', minLevel: 11, equipmentLevel: 2 },
  { name: '絲綢長褲', slot: '護腿', rarity: '精良', description: "依照設計基準打造的精良護腿。", bonus: '生命 +50 · 防禦 +5 · 智力 +8', icon: 'target', minLevel: 11, equipmentLevel: 2 },
  { name: '重型鋼護腿', slot: '護腿', rarity: '精良', description: "依照設計基準打造的精良護腿。", bonus: '生命 +70 · 防禦 +8', icon: 'target', minLevel: 11, equipmentLevel: 2 },
  { name: '輕風護腿', slot: '護腿', rarity: '精良', description: "依照設計基準打造的精良護腿。", bonus: '防禦 +5 · 力量 +6 · 閃避率 +1.5%', icon: 'target', minLevel: 11, equipmentLevel: 2 },
  { name: '紅寶石項鏈', slot: '護身符', rarity: '精良', description: "依照設計基準打造的精良護身符。", bonus: '生命 +75 · 力量 +8', icon: 'star', minLevel: 11, equipmentLevel: 2 },
  { name: '藍寶石智力護符', slot: '護身符', rarity: '精良', description: "依照設計基準打造的精良護身符。", bonus: '生命 +50 · 智力 +10', icon: 'star', minLevel: 11, equipmentLevel: 2 },
  { name: '綠翡翠護符', slot: '護身符', rarity: '精良', description: "依照設計基準打造的精良護身符。", bonus: '生命 +60 · 防禦 +7', icon: 'star', minLevel: 11, equipmentLevel: 2 },
  { name: '疾風護符', slot: '護身符', rarity: '精良', description: "依照設計基準打造的精良護身符。", bonus: '力量 +6 · 閃避率 +2.0%', icon: 'star', minLevel: 11, equipmentLevel: 2 },
  { name: '堅固防禦護符', slot: '護身符', rarity: '精良', description: "依照設計基準打造的精良護身符。", bonus: '生命 +60 · 防禦 +8', icon: 'star', minLevel: 11, equipmentLevel: 2 },
  { name: '曙光聖衛盔', setId: 'dawn-warden', slot: '頭盔', rarity: '稀有', description: "曙光聖衛套裝的頭盔，守護黎明前線。", bonus: '生命 +130 · 防禦 +13 · 力量 +12', icon: 'shield-check', minLevel: 21, equipmentLevel: 3 },
  { name: '幻影刺客兜帽', slot: '頭盔', rarity: '稀有', description: "依照設計基準打造的稀有頭盔。", bonus: '防禦 +10 · 力量 +16 · 閃避率 +3.5%', icon: 'shield-check', minLevel: 21, equipmentLevel: 3 },
  { name: '大魔法師面罩', slot: '頭盔', rarity: '稀有', description: "依照設計基準打造的稀有頭盔。", bonus: '生命 +90 · 防禦 +9 · 智力 +18', icon: 'shield-check', minLevel: 21, equipmentLevel: 3 },
  { name: '大地守護者鋼盔', slot: '頭盔', rarity: '稀有', description: "依照設計基準打造的稀有頭盔。", bonus: '生命 +150 · 防禦 +15', icon: 'shield-check', minLevel: 21, equipmentLevel: 3 },
  { name: '狂戰士骨盔', slot: '頭盔', rarity: '稀有', description: "依照設計基準打造的稀有頭盔。", bonus: '生命 +100 · 防禦 +11 · 力量 +17', icon: 'shield-check', minLevel: 21, equipmentLevel: 3 },
  { name: '曙光聖衛胸甲', setId: 'dawn-warden', slot: '胸甲', rarity: '稀有', description: "曙光聖衛套裝的胸甲，承受最猛烈的衝擊。", bonus: '生命 +140 · 防禦 +15 · 力量 +11', icon: 'shield', minLevel: 21, equipmentLevel: 3 },
  { name: '暗影皮革胸甲', slot: '胸甲', rarity: '稀有', description: "依照設計基準打造的稀有胸甲。", bonus: '生命 +100 · 防禦 +11 · 力量 +15 · 閃避率 +3.8%', icon: 'shield', minLevel: 21, equipmentLevel: 3 },
  { name: '星空秘法長袍', slot: '胸甲', rarity: '稀有', description: "依照設計基準打造的稀有胸甲。", bonus: '生命 +110 · 防禦 +10 · 智力 +19', icon: 'shield', minLevel: 21, equipmentLevel: 3 },
  { name: '熔岩重鎧', slot: '胸甲', rarity: '稀有', description: "依照設計基準打造的稀有胸甲。", bonus: '生命 +150 · 防禦 +15', icon: 'shield', minLevel: 21, equipmentLevel: 3 },
  { name: '疾風獵手輕甲', slot: '胸甲', rarity: '稀有', description: "依照設計基準打造的稀有胸甲。", bonus: '生命 +90 · 防禦 +12 · 力量 +14 · 閃避率 +3.0%', icon: 'shield', minLevel: 21, equipmentLevel: 3 },
  { name: '曙光聖衛護腿', setId: 'dawn-warden', slot: '護腿', rarity: '稀有', description: "曙光聖衛套裝的護腿，穩住每一步防線。", bonus: '生命 +120 · 防禦 +14 · 力量 +12', icon: 'target', minLevel: 21, equipmentLevel: 3 },
  { name: '暗影皮革護腿', slot: '護腿', rarity: '稀有', description: "依照設計基準打造的稀有護腿。", bonus: '防禦 +10 · 力量 +13 · 閃避率 +3.2%', icon: 'target', minLevel: 21, equipmentLevel: 3 },
  { name: '星空秘法長褲', slot: '護腿', rarity: '稀有', description: "依照設計基準打造的稀有護腿。", bonus: '生命 +85 · 防禦 +9 · 智力 +15', icon: 'target', minLevel: 21, equipmentLevel: 3 },
  { name: '熔岩護腿', slot: '護腿', rarity: '稀有', description: "依照設計基準打造的稀有護腿。", bonus: '生命 +130 · 防禦 +15', icon: 'target', minLevel: 21, equipmentLevel: 3 },
  { name: '疾風獵手護腿', slot: '護腿', rarity: '稀有', description: "依照設計基準打造的稀有護腿。", bonus: '防禦 +11 · 力量 +12 · 閃避率 +4.0%', icon: 'target', minLevel: 21, equipmentLevel: 3 },
  { name: '曙光聖衛徽章', setId: 'dawn-warden', slot: '護身符', rarity: '稀有', description: "曙光聖衛套裝的徽章，銘刻守護誓言。", bonus: '生命 +110 · 力量 +18', icon: 'star', minLevel: 21, equipmentLevel: 3 },
  { name: '魔力源泉項鏈', slot: '護身符', rarity: '稀有', description: "依照設計基準打造的稀有護身符。", bonus: '生命 +90 · 智力 +20', icon: 'star', minLevel: 21, equipmentLevel: 3 },
  { name: '巨龍之鱗護符', slot: '護身符', rarity: '稀有', description: "依照設計基準打造的稀有護身符。", bonus: '生命 +140 · 防禦 +14', icon: 'star', minLevel: 21, equipmentLevel: 3 },
  { name: '致命影爪吊墜', slot: '護身符', rarity: '稀有', description: "依照設計基準打造的稀有護身符。", bonus: '力量 +16 · 閃避率 +3.5%', icon: 'star', minLevel: 21, equipmentLevel: 3 },
  { name: '靈動風神護符', slot: '護身符', rarity: '稀有', description: "依照設計基準打造的稀有護身符。", bonus: '防禦 +10 · 智力 +12 · 閃避率 +3.0%', icon: 'star', minLevel: 21, equipmentLevel: 3 },
  { name: '星界賢者冠', setId: 'astral-sage', slot: '頭盔', rarity: '史詩', description: "星界賢者套裝的頭冠，映照群星智慧。", bonus: '生命 +180 · 防禦 +22 · 力量 +26', icon: 'shield-check', minLevel: 31, equipmentLevel: 4 },
  { name: '夜魔暗影頭飾', slot: '頭盔', rarity: '史詩', description: "依照設計基準打造的史詩頭盔。", bonus: '防禦 +18 · 力量 +30 · 閃避率 +5.5%', icon: 'shield-check', minLevel: 31, equipmentLevel: 4 },
  { name: '大天使冠冕', slot: '頭盔', rarity: '史詩', description: "依照設計基準打造的史詩頭盔。", bonus: '生命 +160 · 防禦 +17 · 智力 +33', icon: 'shield-check', minLevel: 31, equipmentLevel: 4 },
  { name: '不朽巨魔鐵盔', slot: '頭盔', rarity: '史詩', description: "依照設計基準打造的史詩頭盔。", bonus: '生命 +200 · 防禦 +25', icon: 'shield-check', minLevel: 31, equipmentLevel: 4 },
  { name: '風暴主宰面具', slot: '頭盔', rarity: '史詩', description: "依照設計基準打造的史詩頭盔。", bonus: '生命 +150 · 防禦 +20 · 力量 +18 · 智力 +22', icon: 'shield-check', minLevel: 31, equipmentLevel: 4 },
  { name: '星界賢者法袍', setId: 'astral-sage', slot: '胸甲', rarity: '史詩', description: "星界賢者套裝的法袍，流動著星軌奧能。", bonus: '生命 +190 · 防禦 +24 · 力量 +28', icon: 'shield', minLevel: 31, equipmentLevel: 4 },
  { name: '虛空獵手皮甲', slot: '胸甲', rarity: '史詩', description: "依照設計基準打造的史詩胸甲。", bonus: '生命 +160 · 防禦 +18 · 力量 +32 · 閃避率 +6.0%', icon: 'shield', minLevel: 31, equipmentLevel: 4 },
  { name: '大元素師長袍', slot: '胸甲', rarity: '史詩', description: "依照設計基準打造的史詩胸甲。", bonus: '生命 +170 · 防禦 +16 · 智力 +35', icon: 'shield', minLevel: 31, equipmentLevel: 4 },
  { name: '泰坦壁壘重甲', slot: '胸甲', rarity: '史詩', description: "依照設計基準打造的史詩胸甲。", bonus: '生命 +200 · 防禦 +25', icon: 'shield', minLevel: 31, equipmentLevel: 4 },
  { name: '幻影幽靈胸甲', slot: '胸甲', rarity: '史詩', description: "依照設計基準打造的史詩胸甲。", bonus: '生命 +150 · 防禦 +20 · 力量 +25 · 閃避率 +5.0%', icon: 'shield', minLevel: 31, equipmentLevel: 4 },
  { name: '星界賢者長褲', setId: 'astral-sage', slot: '護腿', rarity: '史詩', description: "星界賢者套裝的長褲，讓施法步伐更加穩定。", bonus: '生命 +175 · 防禦 +21 · 力量 +25', icon: 'target', minLevel: 31, equipmentLevel: 4 },
  { name: '虛空獵手護腿', slot: '護腿', rarity: '史詩', description: "依照設計基準打造的史詩護腿。", bonus: '防禦 +17 · 力量 +28 · 閃避率 +5.8%', icon: 'target', minLevel: 31, equipmentLevel: 4 },
  { name: '大元素師長褲', slot: '護腿', rarity: '史詩', description: "依照設計基準打造的史詩護腿。", bonus: '生命 +150 · 防禦 +16 · 智力 +29', icon: 'target', minLevel: 31, equipmentLevel: 4 },
  { name: '泰坦壁壘護腿', slot: '護腿', rarity: '史詩', description: "依照設計基準打造的史詩護腿。", bonus: '生命 +190 · 防禦 +23', icon: 'target', minLevel: 31, equipmentLevel: 4 },
  { name: '幻影幽靈護腿', slot: '護腿', rarity: '史詩', description: "依照設計基準打造的史詩護腿。", bonus: '防禦 +18 · 力量 +24 · 閃避率 +6.5%', icon: 'target', minLevel: 31, equipmentLevel: 4 },
  { name: '星界賢者星印', setId: 'astral-sage', slot: '護身符', rarity: '史詩', description: "星界賢者套裝的星印，凝聚純粹奧術。", bonus: '生命 +160 · 力量 +33', icon: 'star', minLevel: 31, equipmentLevel: 4 },
  { name: '靈魂吞噬者護符', slot: '護身符', rarity: '史詩', description: "依照設計基準打造的史詩護身符。", bonus: '生命 +150 · 智力 +34', icon: 'star', minLevel: 31, equipmentLevel: 4 },
  { name: '不滅之星護符', slot: '護身符', rarity: '史詩', description: "依照設計基準打造的史詩護身符。", bonus: '生命 +180 · 防禦 +24', icon: 'star', minLevel: 31, equipmentLevel: 4 },
  { name: '影之刺客吊墜', slot: '護身符', rarity: '史詩', description: "依照設計基準打造的史詩護身符。", bonus: '力量 +30 · 閃避率 +6.0%', icon: 'star', minLevel: 31, equipmentLevel: 4 },
  { name: '時空樞紐護符', slot: '護身符', rarity: '史詩', description: "依照設計基準打造的史詩護身符。", bonus: '防禦 +19 · 智力 +28 · 閃避率 +4.5%', icon: 'star', minLevel: 31, equipmentLevel: 4 },
  { name: '霜影獵行兜帽', setId: 'frost-stalker', slot: '頭盔', rarity: '傳說', description: "霜影獵行套裝的兜帽，藏身於無聲寒霧。", bonus: '生命 +240 · 防禦 +32 · 力量 +46', icon: 'shield-check', minLevel: 41, equipmentLevel: 5 },
  { name: '夜魔主宰面具', slot: '頭盔', rarity: '傳說', description: "依照設計基準打造的傳說頭盔。", bonus: '防禦 +28 · 力量 +52 · 閃避率 +8.5%', icon: 'shield-check', minLevel: 41, equipmentLevel: 5 },
  { name: '星辰智者之冠', slot: '頭盔', rarity: '傳說', description: "依照設計基準打造的傳說頭盔。", bonus: '生命 +220 · 防禦 +26 · 智力 +53', icon: 'shield-check', minLevel: 41, equipmentLevel: 5 },
  { name: '永恆山脈巨盔', slot: '頭盔', rarity: '傳說', description: "依照設計基準打造的傳說頭盔。", bonus: '生命 +280 · 防禦 +40', icon: 'shield-check', minLevel: 41, equipmentLevel: 5 },
  { name: '鳳凰涅槃面具', slot: '頭盔', rarity: '傳說', description: "依照設計基準打造的傳說頭盔。", bonus: '生命 +260 · 防禦 +30 · 力量 +38 · 智力 +38', icon: 'shield-check', minLevel: 41, equipmentLevel: 5 },
  { name: '霜影獵行皮甲', setId: 'frost-stalker', slot: '胸甲', rarity: '傳說', description: "霜影獵行套裝的皮甲，貼合獵人的身形。", bonus: '生命 +270 · 防禦 +38 · 力量 +42', icon: 'shield', minLevel: 41, equipmentLevel: 5 },
  { name: '深淵獵手皮革', slot: '胸甲', rarity: '傳說', description: "依照設計基準打造的傳說胸甲。", bonus: '生命 +210 · 防禦 +28 · 力量 +52 · 閃避率 +9.5%', icon: 'shield', minLevel: 41, equipmentLevel: 5 },
  { name: '真理之門法袍', slot: '胸甲', rarity: '傳說', description: "依照設計基準打造的傳說胸甲。", bonus: '生命 +230 · 防禦 +27 · 智力 +55', icon: 'shield', minLevel: 41, equipmentLevel: 5 },
  { name: '神聖守護者之壁', slot: '胸甲', rarity: '傳說', description: "依照設計基準打造的傳說胸甲。", bonus: '生命 +280 · 防禦 +40', icon: 'shield', minLevel: 41, equipmentLevel: 5 },
  { name: '疾風劍聖法衣', slot: '胸甲', rarity: '傳說', description: "依照設計基準打造的傳說胸甲。", bonus: '生命 +220 · 防禦 +30 · 力量 +48 · 閃避率 +8.0%', icon: 'shield', minLevel: 41, equipmentLevel: 5 },
  { name: '霜影獵行護腿', setId: 'frost-stalker', slot: '護腿', rarity: '傳說', description: "霜影獵行套裝的護腿，追蹤時不留足跡。", bonus: '生命 +230 · 防禦 +31 · 力量 +41', icon: 'target', minLevel: 41, equipmentLevel: 5 },
  { name: '夜魔主宰護腿', slot: '護腿', rarity: '傳說', description: "依照設計基準打造的傳說護腿。", bonus: '防禦 +27 · 力量 +46 · 閃避率 +8.8%', icon: 'target', minLevel: 41, equipmentLevel: 5 },
  { name: '星辰智者長褲', slot: '護腿', rarity: '傳說', description: "依照設計基準打造的傳說護腿。", bonus: '生命 +200 · 防禦 +26 · 智力 +45', icon: 'target', minLevel: 41, equipmentLevel: 5 },
  { name: '永恆山脈護腿', slot: '護腿', rarity: '傳說', description: "依照設計基準打造的傳說護腿。", bonus: '生命 +260 · 防禦 +36', icon: 'target', minLevel: 41, equipmentLevel: 5 },
  { name: '疾風劍聖護腿', slot: '護腿', rarity: '傳說', description: "依照設計基準打造的傳說護腿。", bonus: '防禦 +28 · 力量 +44 · 閃避率 +10.0%', icon: 'target', minLevel: 41, equipmentLevel: 5 },
  { name: '霜影獵行護符', setId: 'frost-stalker', slot: '護身符', rarity: '傳說', description: "霜影獵行套裝的護符，封存寒星獵意。", bonus: '生命 +220 · 力量 +50 · 智力 +45', icon: 'star', minLevel: 41, equipmentLevel: 5 },
  { name: '美杜莎之瞳', slot: '護身符', rarity: '傳說', description: "依照設計基準打造的傳說護身符。", bonus: '力量 +48 · 閃避率 +9.0%', icon: 'star', minLevel: 41, equipmentLevel: 5 },
  { name: '利維坦之心', slot: '護身符', rarity: '傳說', description: "依照設計基準打造的傳說護身符。", bonus: '生命 +280 · 防禦 +35', icon: 'star', minLevel: 41, equipmentLevel: 5 },
  { name: '獵王之牙', slot: '護身符', rarity: '傳說', description: "依照設計基準打造的傳說護身符。", bonus: '力量 +54 · 閃避率 +7.0%', icon: 'star', minLevel: 41, equipmentLevel: 5 },
  { name: '時空交界水晶', slot: '護身符', rarity: '傳說', description: "依照設計基準打造的傳說護身符。", bonus: '防禦 +29 · 智力 +48 · 閃避率 +8.5%', icon: 'star', minLevel: 41, equipmentLevel: 5 },
  { name: '深淵征服戰盔', setId: 'abyss-conqueror', slot: '頭盔', rarity: '神話', description: "深淵征服套裝的戰盔，直面終焉黑潮。", bonus: '生命 +350 · 防禦 +52 · 力量 +65 · 智力 +60', icon: 'shield-check', minLevel: 51, equipmentLevel: 6 },
  { name: '虛空之主·終焉面具', slot: '頭盔', rarity: '神話', description: "依照設計基準打造的神話頭盔。", bonus: '防禦 +45 · 力量 +78 · 閃避率 +13.5%', icon: 'shield-check', minLevel: 51, equipmentLevel: 6 },
  { name: '全知者·真理之冠', slot: '頭盔', rarity: '神話', description: "依照設計基準打造的神話頭盔。", bonus: '生命 +320 · 防禦 +42 · 智力 +80', icon: 'shield-check', minLevel: 51, equipmentLevel: 6 },
  { name: '滅世巨神·荒古重盔 (極品)', slot: '頭盔', rarity: '神話', description: "依照設計基準打造的神話頭盔。", bonus: '生命 +400 · 防禦 +65', icon: 'shield-check', minLevel: 51, equipmentLevel: 6 },
  { name: '末日狂刃·血神之面 (極品)', slot: '頭盔', rarity: '神話', description: "依照設計基準打造的神話頭盔。", bonus: '生命 +320 · 防禦 +48 · 力量 +85', icon: 'shield-check', minLevel: 51, equipmentLevel: 6 },
  { name: '深淵征服重甲', setId: 'abyss-conqueror', slot: '胸甲', rarity: '神話', description: "深淵征服套裝的重甲，承載征服者的意志。", bonus: '生命 +370 · 防禦 +58 · 力量 +60 · 智力 +60', icon: 'shield', minLevel: 51, equipmentLevel: 6 },
  { name: '虛空之主·無形影甲', slot: '胸甲', rarity: '神話', description: "依照設計基準打造的神話胸甲。", bonus: '生命 +300 · 防禦 +43 · 力量 +76 · 閃避率 +15.0%', icon: 'shield', minLevel: 51, equipmentLevel: 6 },
  { name: '全知者·元素起源法袍', slot: '胸甲', rarity: '神話', description: "依照設計基準打造的神話胸甲。", bonus: '生命 +310 · 防禦 +41 · 智力 +78', icon: 'shield', minLevel: 51, equipmentLevel: 6 },
  { name: '滅世巨神·永恆堡壘 (極品)', slot: '胸甲', rarity: '神話', description: "依照設計基準打造的神話胸甲。", bonus: '生命 +400 · 防禦 +65', icon: 'shield', minLevel: 51, equipmentLevel: 6 },
  { name: '末日狂刃·屠戮胸甲 (極品)', slot: '胸甲', rarity: '神話', description: "依照設計基準打造的神話胸甲。", bonus: '生命 +350 · 防禦 +50 · 力量 +85', icon: 'shield', minLevel: 51, equipmentLevel: 6 },
  { name: '深淵征服護腿', setId: 'abyss-conqueror', slot: '護腿', rarity: '神話', description: "深淵征服套裝的護腿，踏過破碎星界。", bonus: '生命 +320 · 防禦 +48 · 力量 +62 · 智力 +58', icon: 'target', minLevel: 51, equipmentLevel: 6 },
  { name: '虛空之主·幻影護腿', slot: '護腿', rarity: '神話', description: "依照設計基準打造的神話護腿。", bonus: '防禦 +42 · 力量 +72 · 閃避率 +13.0%', icon: 'target', minLevel: 51, equipmentLevel: 6 },
  { name: '全知者·星軌長褲', slot: '護腿', rarity: '神話', description: "依照設計基準打造的神話護腿。", bonus: '生命 +290 · 防禦 +41 · 智力 +70', icon: 'target', minLevel: 51, equipmentLevel: 6 },
  { name: '滅世巨神·大地之足', slot: '護腿', rarity: '神話', description: "依照設計基準打造的神話護腿。", bonus: '生命 +360 · 防禦 +55', icon: 'target', minLevel: 51, equipmentLevel: 6 },
  { name: '末日狂刃·疾風戰腿', slot: '護腿', rarity: '神話', description: "依照設計基準打造的神話護腿。", bonus: '防禦 +44 · 力量 +75 · 閃避率 +12.0%', icon: 'target', minLevel: 51, equipmentLevel: 6 },
  { name: '深淵征服核心', setId: 'abyss-conqueror', slot: '護身符', rarity: '神話', description: "深淵征服套裝的核心，燃燒著終焉之力。", bonus: '生命 +380 · 防禦 +50 · 力量 +80 · 智力 +80 · 閃避率 +11.0%', icon: 'star', minLevel: 51, equipmentLevel: 6 },
  { name: '深淵之眼·終極恐懼 (極品)', slot: '護身符', rarity: '神話', description: "依照設計基準打造的神話護身符。", bonus: '力量 +85 · 閃避率 +14.0%', icon: 'star', minLevel: 51, equipmentLevel: 6 },
  { name: '時光之輪·永恆交響', slot: '護身符', rarity: '神話', description: "依照設計基準打造的神話護身符。", bonus: '生命 +340 · 防禦 +48 · 智力 +75 · 閃避率 +12.5%', icon: 'star', minLevel: 51, equipmentLevel: 6 },
  { name: '阿瓦隆之庇護·神聖之心 (極品)', slot: '護身符', rarity: '神話', description: "依照設計基準打造的神話護身符。", bonus: '生命 +400 · 防禦 +60', icon: 'star', minLevel: 51, equipmentLevel: 6 },
  { name: '諸神黃昏·毀滅之鏈 (極品)', slot: '護身符', rarity: '神話', description: "依照設計基準打造的神話護身符。", bonus: '力量 +85 · 智力 +85', icon: 'star', minLevel: 51, equipmentLevel: 6 },
  { name: '晨星皮盔', slot: '頭盔', rarity: '普通', description: "冒險者工坊為普通階打造的原創裝備。", bonus: '生命 +40 · 防禦 +3', icon: 'shield-check', minLevel: 1, equipmentLevel: 1 },
  { name: '銅脊短劍', slot: '武器', weaponType: '劍', rarity: '普通', description: "冒險者工坊為普通階打造的原創裝備。", bonus: '力量 +4 · 暴擊率 +2% · 暴擊傷害 +8%', icon: 'sword', minLevel: 1, equipmentLevel: 1 },
  { name: '旅團軟甲', slot: '胸甲', rarity: '普通', description: "冒險者工坊為普通階打造的原創裝備。", bonus: '生命 +45 · 防禦 +3', icon: 'shield', minLevel: 1, equipmentLevel: 1 },
  { name: '踏風護腿', slot: '護腿', rarity: '普通', description: "冒險者工坊為普通階打造的原創裝備。", bonus: '防禦 +2 · 閃避率 +0.8%', icon: 'target', minLevel: 1, equipmentLevel: 1 },
  { name: '守夜符印', slot: '護身符', rarity: '普通', description: "冒險者工坊為普通階打造的原創裝備。", bonus: '智力 +4 · 防禦 +2', icon: 'star', minLevel: 1, equipmentLevel: 1 },
  { name: '銀羽盔', slot: '頭盔', rarity: '精良', description: "冒險者工坊為精良階打造的原創裝備。", bonus: '生命 +70 · 防禦 +6', icon: 'shield-check', minLevel: 11, equipmentLevel: 2 },
  { name: '巡星長弓', slot: '武器', weaponType: '弓', rarity: '精良', description: "冒險者工坊為精良階打造的原創裝備。", bonus: '力量 +9 · 閃避率 +1.5% · 暴擊率 +2% · 暴擊傷害 +14%', icon: 'sword', minLevel: 11, equipmentLevel: 2 },
  { name: '月鋼胸甲', slot: '胸甲', rarity: '精良', description: "冒險者工坊為精良階打造的原創裝備。", bonus: '生命 +65 · 防禦 +7', icon: 'shield', minLevel: 11, equipmentLevel: 2 },
  { name: '疾行護腿', slot: '護腿', rarity: '精良', description: "冒險者工坊為精良階打造的原創裝備。", bonus: '力量 +6 · 防禦 +5', icon: 'target', minLevel: 11, equipmentLevel: 2 },
  { name: '湛藍符文', slot: '護身符', rarity: '精良', description: "冒險者工坊為精良階打造的原創裝備。", bonus: '智力 +9 · 生命 +55', icon: 'star', minLevel: 11, equipmentLevel: 2 },
  { name: '霜狼戰盔', slot: '頭盔', rarity: '稀有', description: "冒險者工坊為稀有階打造的原創裝備。", bonus: '生命 +120 · 防禦 +12', icon: 'shield-check', minLevel: 21, equipmentLevel: 3 },
  { name: '赤曜長劍', slot: '武器', weaponType: '劍', rarity: '稀有', description: "冒險者工坊為稀有階打造的原創裝備。", bonus: '力量 +18 · 暴擊率 +2% · 暴擊傷害 +12%', icon: 'sword', minLevel: 21, equipmentLevel: 3 },
  { name: '秘銀胸甲', slot: '胸甲', rarity: '稀有', description: "冒險者工坊為稀有階打造的原創裝備。", bonus: '生命 +145 · 防禦 +14', icon: 'shield', minLevel: 21, equipmentLevel: 3 },
  { name: '疾影護腿', slot: '護腿', rarity: '稀有', description: "冒險者工坊為稀有階打造的原創裝備。", bonus: '力量 +13 · 閃避率 +3.5%', icon: 'target', minLevel: 21, equipmentLevel: 3 },
  { name: '星語護符', slot: '護身符', rarity: '稀有', description: "冒險者工坊為稀有階打造的原創裝備。", bonus: '智力 +17 · 防禦 +10', icon: 'star', minLevel: 21, equipmentLevel: 3 },
  { name: '蒼龍冠', slot: '頭盔', rarity: '史詩', description: "冒險者工坊為史詩階打造的原創裝備。", bonus: '生命 +175 · 防禦 +23 · 智力 +21', icon: 'shield-check', minLevel: 31, equipmentLevel: 4 },
  { name: '雷鳴巨刃', slot: '武器', weaponType: '劍', rarity: '史詩', description: "冒險者工坊為史詩階打造的原創裝備。", bonus: '力量 +35 · 暴擊率 +3% · 暴擊傷害 +16%', icon: 'sword', minLevel: 31, equipmentLevel: 4 },
  { name: '王庭戰鎧', slot: '胸甲', rarity: '史詩', description: "冒險者工坊為史詩階打造的原創裝備。", bonus: '生命 +195 · 防禦 +24', icon: 'shield', minLevel: 31, equipmentLevel: 4 },
  { name: '幻風護腿', slot: '護腿', rarity: '史詩', description: "冒險者工坊為史詩階打造的原創裝備。", bonus: '力量 +27 · 閃避率 +5.5%', icon: 'target', minLevel: 31, equipmentLevel: 4 },
  { name: '深海核心', slot: '護身符', rarity: '史詩', description: "冒險者工坊為史詩階打造的原創裝備。", bonus: '智力 +34 · 生命 +160', icon: 'star', minLevel: 31, equipmentLevel: 4 },
  { name: '天穹王盔', slot: '頭盔', rarity: '傳說', description: "冒險者工坊為傳說階打造的原創裝備。", bonus: '生命 +250 · 防禦 +35 · 力量 +40', icon: 'shield-check', minLevel: 41, equipmentLevel: 5 },
  { name: '焚星神弓', slot: '武器', weaponType: '弓', rarity: '傳說', description: "冒險者工坊為傳說階打造的原創裝備。", bonus: '力量 +55 · 閃避率 +7.5% · 暴擊率 +5% · 暴擊傷害 +28%', icon: 'sword', minLevel: 41, equipmentLevel: 5 },
  { name: '神諭聖甲', slot: '胸甲', rarity: '傳說', description: "冒險者工坊為傳說階打造的原創裝備。", bonus: '生命 +275 · 防禦 +39', icon: 'shield', minLevel: 41, equipmentLevel: 5 },
  { name: '影月護腿', slot: '護腿', rarity: '傳說', description: "冒險者工坊為傳說階打造的原創裝備。", bonus: '力量 +45 · 閃避率 +9.0%', icon: 'target', minLevel: 41, equipmentLevel: 5 },
  { name: '永恆星核', slot: '護身符', rarity: '傳說', description: "冒險者工坊為傳說階打造的原創裝備。", bonus: '智力 +52 · 生命 +220', icon: 'star', minLevel: 41, equipmentLevel: 5 },
  { name: '萬象冠冕', slot: '頭盔', rarity: '神話', description: "冒險者工坊為神話階打造的原創裝備。", bonus: '生命 +360 · 防禦 +60 · 智力 +70', icon: 'shield-check', minLevel: 51, equipmentLevel: 6 },
  { name: '終界斬艦', slot: '武器', weaponType: '劍', rarity: '神話', description: "冒險者工坊為神話階打造的原創裝備。", bonus: '力量 +80 · 閃避率 +12.0% · 暴擊率 +5% · 暴擊傷害 +25%', icon: 'sword', minLevel: 51, equipmentLevel: 6 },
  { name: '創星神鎧', slot: '胸甲', rarity: '神話', description: "冒險者工坊為神話階打造的原創裝備。", bonus: '生命 +380 · 防禦 +62 · 力量 +60', icon: 'shield', minLevel: 51, equipmentLevel: 6 },
  { name: '逐日神腿', slot: '護腿', rarity: '神話', description: "冒險者工坊為神話階打造的原創裝備。", bonus: '力量 +78 · 閃避率 +14.0%', icon: 'target', minLevel: 51, equipmentLevel: 6 },
  { name: '宇宙心印', slot: '護身符', rarity: '神話', description: "冒險者工坊為神話階打造的原創裝備。", bonus: '生命 +380 · 智力 +85 · 防禦 +55', icon: 'star', minLevel: 51, equipmentLevel: 6 },
];

const weaponNameSets: Record<WeaponType, string[]> = {
  劍: ["曙光劍", "鐵衛劍", "月影劍", "王道劍", "星界劍"],
  短刀: ["獵影短刀", "迅牙短刀", "毒棘短刀", "幻步短刀", "虛空短刀"],
  弓: ["林風弓", "沙羽弓", "月弦弓", "天穹弓", "日輪弓"],
  法杖: ["木靈法杖", "藍晶法杖", "星語法杖", "炎脈法杖", "創世法杖"],
};

const staffElements: WeaponElement[] = ["自然", "冰霜", "奧術", "火焰", "雷電"];
const staffCastSpeedByLevel = [3, 5, 8, 11, 14, 18];

const weaponRarityProfiles = [
  { rarity: "普通", minLevel: 1, equipmentLevel: 1, label: "粗製", values: [3, 3, 4, 4, 5] },
  { rarity: "精良", minLevel: 11, equipmentLevel: 2, label: "精製", values: [6, 7, 8, 9, 10] },
  { rarity: "稀有", minLevel: 21, equipmentLevel: 3, label: "秘銀", values: [11, 13, 15, 18, 20] },
  { rarity: "史詩", minLevel: 31, equipmentLevel: 4, label: "史詩", values: [21, 24, 28, 32, 35] },
  { rarity: "傳說", minLevel: 41, equipmentLevel: 5, label: "傳說", values: [36, 41, 46, 51, 55] },
  { rarity: "神話", minLevel: 51, equipmentLevel: 6, label: "神話", values: [56, 62, 68, 74, 80] },
] as const;

const weaponCritRateByType: Record<WeaponType, number[]> = {
  劍: [1, 1, 2, 3, 4, 5],
  短刀: [2, 3, 4, 5, 6, 7],
  弓: [1, 2, 3, 4, 5, 6],
  法杖: [0, 0, 0, 0, 0, 0],
};

const weaponCritDamageByType: Record<WeaponType, number[]> = {
  劍: [5, 8, 12, 16, 20, 25],
  短刀: [8, 12, 16, 20, 25, 30],
  弓: [10, 14, 18, 22, 28, 35],
  法杖: [0, 0, 0, 0, 0, 0],
};

const generatedWeaponTemplates: EquipmentDatabaseTemplate[] = weaponRarityProfiles.flatMap(
  profile =>
    (Object.entries(weaponNameSets) as [WeaponType, string[]][]).flatMap(
      ([weaponType, names]) =>
        names.map((name, index) => ({
          name: `${profile.label}·${name}`,
          slot: "武器" as const,
          weaponType,
          element: weaponType === "法杖" ? staffElements[index] : undefined,
          rarity: profile.rarity,
          description: `符合${profile.rarity}裝備等級基準的${weaponType}${weaponType === "法杖" ? `，蘊含${staffElements[index]}元素` : ""}。`,
          bonus: `${weaponType === "法杖" ? "智力" : "力量"} +${profile.values[index]}${weaponType === "法杖" ? ` · 施法速度 +${staffCastSpeedByLevel[profile.equipmentLevel - 1]}%` : ` · 暴擊率 +${weaponCritRateByType[weaponType][profile.equipmentLevel - 1]}% · 暴擊傷害 +${weaponCritDamageByType[weaponType][profile.equipmentLevel - 1]}%`}`,
          icon: weaponType === "法杖" ? "sparkles" : weaponType === "弓" ? "target" : "sword",
          minLevel: profile.minLevel,
          equipmentLevel: profile.equipmentLevel,
        }))
    )
);

export const RPG_EQUIPMENT_TEMPLATES: EquipmentDatabaseTemplate[] = [
  ...LEGACY_EQUIPMENT_TEMPLATES,
  ...generatedWeaponTemplates,
];
