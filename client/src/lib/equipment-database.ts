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
  { name: '皮質兜帽', slot: '頭盔', rarity: '普通', description: "「皮質兜帽」在古老工坊的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +35 · 防禦 +2 · 閃避率 +0.5%', icon: 'shield-check', minLevel: 1, equipmentLevel: 1 },
  { name: '粗鐵面罩', slot: '頭盔', rarity: '普通', description: "「粗鐵面罩」在山巔祭壇的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '防禦 +4 · 力量 +3', icon: 'shield-check', minLevel: 1, equipmentLevel: 1 },
  { name: '學徒法帽', slot: '頭盔', rarity: '普通', description: "「學徒法帽」在失落遺跡的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '防禦 +2 · 智力 +4', icon: 'shield-check', minLevel: 1, equipmentLevel: 1 },
  { name: '獵人軟帽', slot: '頭盔', rarity: '普通', description: "「獵人軟帽」在海岸燈塔的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '防禦 +3 · 閃避率 +1.0%', icon: 'shield-check', minLevel: 1, equipmentLevel: 1 },
  { name: '破舊鐵盔', slot: '頭盔', rarity: '普通', description: "「破舊鐵盔」在山巔祭壇的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +45 · 防禦 +3', icon: 'shield-check', minLevel: 1, equipmentLevel: 1 },
  { name: '亞麻便衣', slot: '胸甲', rarity: '普通', description: "「亞麻便衣」在山巔祭壇的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +50 · 防禦 +3', icon: 'shield', minLevel: 1, equipmentLevel: 1 },
  { name: '硬皮胸甲', slot: '胸甲', rarity: '普通', description: "「硬皮胸甲」在失落遺跡的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +30 · 防禦 +4 · 閃避率 +0.8%', icon: 'shield', minLevel: 1, equipmentLevel: 1 },
  { name: '生鐵鏈甲', slot: '胸甲', rarity: '普通', description: "「生鐵鏈甲」在王城戰場的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '防禦 +4 · 力量 +4', icon: 'shield', minLevel: 1, equipmentLevel: 1 },
  { name: '學士長袍', slot: '胸甲', rarity: '普通', description: "「學士長袍」在海岸燈塔的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +35 · 防禦 +2 · 智力 +5', icon: 'shield', minLevel: 1, equipmentLevel: 1 },
  { name: '獵犬皮革衣', slot: '胸甲', rarity: '普通', description: "「獵犬皮革衣」在海岸燈塔的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +40 · 防禦 +3 · 閃避率 +0.5%', icon: 'shield', minLevel: 1, equipmentLevel: 1 },
  { name: '粗布長褲', slot: '護腿', rarity: '普通', description: "「粗布長褲」在海岸燈塔的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '生命 +35 · 防禦 +2', icon: 'target', minLevel: 1, equipmentLevel: 1 },
  { name: '熟皮護腿', slot: '護腿', rarity: '普通', description: "「熟皮護腿」在古老工坊的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '防禦 +3 · 閃避率 +0.7%', icon: 'target', minLevel: 1, equipmentLevel: 1 },
  { name: '生鐵護腿', slot: '護腿', rarity: '普通', description: "「生鐵護腿」在王城戰場的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '防禦 +4 · 力量 +3', icon: 'target', minLevel: 1, equipmentLevel: 1 },
  { name: '學徒長裙', slot: '護腿', rarity: '普通', description: "「學徒長裙」在王城戰場的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '生命 +30 · 防禦 +2 · 智力 +4', icon: 'target', minLevel: 1, equipmentLevel: 1 },
  { name: '輕便皮褲', slot: '護腿', rarity: '普通', description: "「輕便皮褲」在失落遺跡的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '防禦 +3 · 閃避率 +1.0%', icon: 'target', minLevel: 1, equipmentLevel: 1 },
  { name: '銅質項鏈', slot: '護身符', rarity: '普通', description: "「銅質項鏈」在王城戰場的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '生命 +45 · 防禦 +2', icon: 'star', minLevel: 1, equipmentLevel: 1 },
  { name: '力量吊墜', slot: '護身符', rarity: '普通', description: "「力量吊墜」在邊境哨站的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '力量 +5', icon: 'star', minLevel: 1, equipmentLevel: 1 },
  { name: '智力水晶', slot: '護身符', rarity: '普通', description: "「智力水晶」在古老工坊的鍛造火光中成形，以深海的回聲淬鍊出普通階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '智力 +5', icon: 'star', minLevel: 1, equipmentLevel: 1 },
  { name: '獵戶護符', slot: '護身符', rarity: '普通', description: "「獵戶護符」在王城戰場的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '力量 +3 · 閃避率 +0.5%', icon: 'star', minLevel: 1, equipmentLevel: 1 },
  { name: '靈巧護符', slot: '護身符', rarity: '普通', description: "「靈巧護符」在邊境哨站的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '防禦 +3 · 閃避率 +1.0%', icon: 'star', minLevel: 1, equipmentLevel: 1 },
  { name: '精鍛鐵盔', slot: '頭盔', rarity: '精良', description: "「精鍛鐵盔」在邊境哨站的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +65 · 防禦 +7 · 力量 +6', icon: 'shield-check', minLevel: 11, equipmentLevel: 2 },
  { name: '巡林者兜帽', slot: '頭盔', rarity: '精良', description: "「巡林者兜帽」在失落遺跡的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '防禦 +5 · 力量 +7 · 閃避率 +1.5%', icon: 'shield-check', minLevel: 11, equipmentLevel: 2 },
  { name: '元素師圓帽', slot: '頭盔', rarity: '精良', description: "「元素師圓帽」在失落遺跡的鍛造火光中成形，以流動的秘法淬鍊出精良階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +50 · 防禦 +5 · 智力 +9', icon: 'shield-check', minLevel: 11, equipmentLevel: 2 },
  { name: '重型鋼盔', slot: '頭盔', rarity: '精良', description: "「重型鋼盔」在王城戰場的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +80 · 防禦 +8', icon: 'shield-check', minLevel: 11, equipmentLevel: 2 },
  { name: '游俠面具', slot: '頭盔', rarity: '精良', description: "「游俠面具」在山巔祭壇的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '防禦 +6 · 力量 +8 · 閃避率 +1.2%', icon: 'shield-check', minLevel: 11, equipmentLevel: 2 },
  { name: '精鍛鋼胸甲', slot: '胸甲', rarity: '精良', description: "「精鍛鋼胸甲」在海岸燈塔的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +75 · 防禦 +8 · 力量 +7', icon: 'shield', minLevel: 11, equipmentLevel: 2 },
  { name: '蜥蜴皮甲', slot: '胸甲', rarity: '精良', description: "「蜥蜴皮甲」在海岸燈塔的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +55 · 防禦 +6 · 閃避率 +2.0%', icon: 'shield', minLevel: 11, equipmentLevel: 2 },
  { name: '學士法袍', slot: '胸甲', rarity: '精良', description: "「學士法袍」在古老工坊的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +60 · 防禦 +5 · 智力 +10', icon: 'shield', minLevel: 11, equipmentLevel: 2 },
  { name: '鎖子重甲', slot: '胸甲', rarity: '精良', description: "「鎖子重甲」在古老工坊的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +80 · 防禦 +8', icon: 'shield', minLevel: 11, equipmentLevel: 2 },
  { name: '巡邏輕甲', slot: '胸甲', rarity: '精良', description: "「巡邏輕甲」在山巔祭壇的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +50 · 防禦 +6 · 力量 +8 · 閃避率 +1.2%', icon: 'shield', minLevel: 11, equipmentLevel: 2 },
  { name: '精鍛鋼護腿', slot: '護腿', rarity: '精良', description: "「精鍛鋼護腿」在山巔祭壇的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '生命 +65 · 防禦 +7 · 力量 +6', icon: 'target', minLevel: 11, equipmentLevel: 2 },
  { name: '蜥蜴皮護腿', slot: '護腿', rarity: '精良', description: "「蜥蜴皮護腿」在古老工坊的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '防禦 +6 · 閃避率 +1.8%', icon: 'target', minLevel: 11, equipmentLevel: 2 },
  { name: '絲綢長褲', slot: '護腿', rarity: '精良', description: "「絲綢長褲」在山巔祭壇的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '生命 +50 · 防禦 +5 · 智力 +8', icon: 'target', minLevel: 11, equipmentLevel: 2 },
  { name: '重型鋼護腿', slot: '護腿', rarity: '精良', description: "「重型鋼護腿」在邊境哨站的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '生命 +70 · 防禦 +8', icon: 'target', minLevel: 11, equipmentLevel: 2 },
  { name: '輕風護腿', slot: '護腿', rarity: '精良', description: "「輕風護腿」在海岸燈塔的鍛造火光中成形，以穿谷而過的疾風淬鍊出精良階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '防禦 +5 · 力量 +6 · 閃避率 +1.5%', icon: 'target', minLevel: 11, equipmentLevel: 2 },
  { name: '紅寶石項鏈', slot: '護身符', rarity: '精良', description: "「紅寶石項鏈」在古老工坊的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '生命 +75 · 力量 +8', icon: 'star', minLevel: 11, equipmentLevel: 2 },
  { name: '藍寶石智力護符', slot: '護身符', rarity: '精良', description: "「藍寶石智力護符」在邊境哨站的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '生命 +50 · 智力 +10', icon: 'star', minLevel: 11, equipmentLevel: 2 },
  { name: '綠翡翠護符', slot: '護身符', rarity: '精良', description: "「綠翡翠護符」在邊境哨站的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '生命 +60 · 防禦 +7', icon: 'star', minLevel: 11, equipmentLevel: 2 },
  { name: '疾風護符', slot: '護身符', rarity: '精良', description: "「疾風護符」在海岸燈塔的鍛造火光中成形，以穿谷而過的疾風淬鍊出精良階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '力量 +6 · 閃避率 +2.0%', icon: 'star', minLevel: 11, equipmentLevel: 2 },
  { name: '堅固防禦護符', slot: '護身符', rarity: '精良', description: "「堅固防禦護符」在邊境哨站的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '生命 +60 · 防禦 +8', icon: 'star', minLevel: 11, equipmentLevel: 2 },
  { name: '騎士榮耀鐵盔', slot: '頭盔', rarity: '稀有', description: "「騎士榮耀鐵盔」在失落遺跡的鍛造火光中成形，以漫長旅途中的微光淬鍊出稀有階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +130 · 防禦 +13 · 力量 +12', icon: 'shield-check', minLevel: 21, equipmentLevel: 3 },
  { name: '幻影刺客兜帽', slot: '頭盔', rarity: '稀有', description: "「幻影刺客兜帽」在山巔祭壇的鍛造火光中成形，以無聲的暗影淬鍊出稀有階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '防禦 +10 · 力量 +16 · 閃避率 +3.5%', icon: 'shield-check', minLevel: 21, equipmentLevel: 3 },
  { name: '大魔法師面罩', slot: '頭盔', rarity: '稀有', description: "「大魔法師面罩」在失落遺跡的鍛造火光中成形，以流動的秘法淬鍊出稀有階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +90 · 防禦 +9 · 智力 +18', icon: 'shield-check', minLevel: 21, equipmentLevel: 3 },
  { name: '大地守護者鋼盔', slot: '頭盔', rarity: '稀有', description: "「大地守護者鋼盔」在古老工坊的鍛造火光中成形，以大地深處的脈動淬鍊出稀有階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +150 · 防禦 +15', icon: 'shield-check', minLevel: 21, equipmentLevel: 3 },
  { name: '狂戰士骨盔', slot: '頭盔', rarity: '稀有', description: "「狂戰士骨盔」在古老工坊的鍛造火光中成形，以漫長旅途中的微光淬鍊出稀有階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +100 · 防禦 +11 · 力量 +17', icon: 'shield-check', minLevel: 21, equipmentLevel: 3 },
  { name: '聖殿騎士胸甲', slot: '胸甲', rarity: '稀有', description: "「聖殿騎士胸甲」在失落遺跡的鍛造火光中成形，以漫長旅途中的微光淬鍊出稀有階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +140 · 防禦 +15 · 力量 +11', icon: 'shield', minLevel: 21, equipmentLevel: 3 },
  { name: '暗影皮革胸甲', slot: '胸甲', rarity: '稀有', description: "「暗影皮革胸甲」在古老工坊的鍛造火光中成形，以無聲的暗影淬鍊出稀有階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +100 · 防禦 +11 · 力量 +15 · 閃避率 +3.8%', icon: 'shield', minLevel: 21, equipmentLevel: 3 },
  { name: '星空秘法長袍', slot: '胸甲', rarity: '稀有', description: "「星空秘法長袍」在王城戰場的鍛造火光中成形，以遙遠的星辰淬鍊出稀有階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +110 · 防禦 +10 · 智力 +19', icon: 'shield', minLevel: 21, equipmentLevel: 3 },
  { name: '熔岩重鎧', slot: '胸甲', rarity: '稀有', description: "「熔岩重鎧」在古老工坊的鍛造火光中成形，以不熄的餘燼淬鍊出稀有階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +150 · 防禦 +15', icon: 'shield', minLevel: 21, equipmentLevel: 3 },
  { name: '疾風獵手輕甲', slot: '胸甲', rarity: '稀有', description: "「疾風獵手輕甲」在古老工坊的鍛造火光中成形，以穿谷而過的疾風淬鍊出稀有階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +90 · 防禦 +12 · 力量 +14 · 閃避率 +3.0%', icon: 'shield', minLevel: 21, equipmentLevel: 3 },
  { name: '聖殿騎士護腿', slot: '護腿', rarity: '稀有', description: "「聖殿騎士護腿」在王城戰場的鍛造火光中成形，以漫長旅途中的微光淬鍊出稀有階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '生命 +120 · 防禦 +14 · 力量 +12', icon: 'target', minLevel: 21, equipmentLevel: 3 },
  { name: '暗影皮革護腿', slot: '護腿', rarity: '稀有', description: "「暗影皮革護腿」在海岸燈塔的鍛造火光中成形，以無聲的暗影淬鍊出稀有階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '防禦 +10 · 力量 +13 · 閃避率 +3.2%', icon: 'target', minLevel: 21, equipmentLevel: 3 },
  { name: '星空秘法長褲', slot: '護腿', rarity: '稀有', description: "「星空秘法長褲」在海岸燈塔的鍛造火光中成形，以遙遠的星辰淬鍊出稀有階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '生命 +85 · 防禦 +9 · 智力 +15', icon: 'target', minLevel: 21, equipmentLevel: 3 },
  { name: '熔岩護腿', slot: '護腿', rarity: '稀有', description: "「熔岩護腿」在古老工坊的鍛造火光中成形，以不熄的餘燼淬鍊出稀有階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '生命 +130 · 防禦 +15', icon: 'target', minLevel: 21, equipmentLevel: 3 },
  { name: '疾風獵手護腿', slot: '護腿', rarity: '稀有', description: "「疾風獵手護腿」在失落遺跡的鍛造火光中成形，以穿谷而過的疾風淬鍊出稀有階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '防禦 +11 · 力量 +12 · 閃避率 +4.0%', icon: 'target', minLevel: 21, equipmentLevel: 3 },
  { name: '血色誓約護符', slot: '護身符', rarity: '稀有', description: "「血色誓約護符」在王城戰場的鍛造火光中成形，以漫長旅途中的微光淬鍊出稀有階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '生命 +110 · 力量 +18', icon: 'star', minLevel: 21, equipmentLevel: 3 },
  { name: '魔力源泉項鏈', slot: '護身符', rarity: '稀有', description: "「魔力源泉項鏈」在古老工坊的鍛造火光中成形，以漫長旅途中的微光淬鍊出稀有階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '生命 +90 · 智力 +20', icon: 'star', minLevel: 21, equipmentLevel: 3 },
  { name: '巨龍之鱗護符', slot: '護身符', rarity: '稀有', description: "「巨龍之鱗護符」在邊境哨站的鍛造火光中成形，以沉睡的龍息淬鍊出稀有階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '生命 +140 · 防禦 +14', icon: 'star', minLevel: 21, equipmentLevel: 3 },
  { name: '致命影爪吊墜', slot: '護身符', rarity: '稀有', description: "「致命影爪吊墜」在邊境哨站的鍛造火光中成形，以無聲的暗影淬鍊出稀有階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '力量 +16 · 閃避率 +3.5%', icon: 'star', minLevel: 21, equipmentLevel: 3 },
  { name: '靈動風神護符', slot: '護身符', rarity: '稀有', description: "「靈動風神護符」在王城戰場的鍛造火光中成形，以穿谷而過的疾風淬鍊出稀有階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '防禦 +10 · 智力 +12 · 閃避率 +3.0%', icon: 'star', minLevel: 21, equipmentLevel: 3 },
  { name: '龍骨戰盔', slot: '頭盔', rarity: '史詩', description: "「龍骨戰盔」在山巔祭壇的鍛造火光中成形，以沉睡的龍息淬鍊出史詩階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +180 · 防禦 +22 · 力量 +26', icon: 'shield-check', minLevel: 31, equipmentLevel: 4 },
  { name: '夜魔暗影頭飾', slot: '頭盔', rarity: '史詩', description: "「夜魔暗影頭飾」在古老工坊的鍛造火光中成形，以無聲的暗影淬鍊出史詩階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '防禦 +18 · 力量 +30 · 閃避率 +5.5%', icon: 'shield-check', minLevel: 31, equipmentLevel: 4 },
  { name: '大天使冠冕', slot: '頭盔', rarity: '史詩', description: "「大天使冠冕」在王城戰場的鍛造火光中成形，以漫長旅途中的微光淬鍊出史詩階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +160 · 防禦 +17 · 智力 +33', icon: 'shield-check', minLevel: 31, equipmentLevel: 4 },
  { name: '不朽巨魔鐵盔', slot: '頭盔', rarity: '史詩', description: "「不朽巨魔鐵盔」在山巔祭壇的鍛造火光中成形，以漫長旅途中的微光淬鍊出史詩階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +200 · 防禦 +25', icon: 'shield-check', minLevel: 31, equipmentLevel: 4 },
  { name: '風暴主宰面具', slot: '頭盔', rarity: '史詩', description: "「風暴主宰面具」在邊境哨站的鍛造火光中成形，以穿谷而過的疾風淬鍊出史詩階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +150 · 防禦 +20 · 力量 +18 · 智力 +22', icon: 'shield-check', minLevel: 31, equipmentLevel: 4 },
  { name: '滅世者重鎧', slot: '胸甲', rarity: '史詩', description: "「滅世者重鎧」在失落遺跡的鍛造火光中成形，以漫長旅途中的微光淬鍊出史詩階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +190 · 防禦 +24 · 力量 +28', icon: 'shield', minLevel: 31, equipmentLevel: 4 },
  { name: '虛空獵手皮甲', slot: '胸甲', rarity: '史詩', description: "「虛空獵手皮甲」在古老工坊的鍛造火光中成形，以無聲的暗影淬鍊出史詩階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +160 · 防禦 +18 · 力量 +32 · 閃避率 +6.0%', icon: 'shield', minLevel: 31, equipmentLevel: 4 },
  { name: '大元素師長袍', slot: '胸甲', rarity: '史詩', description: "「大元素師長袍」在海岸燈塔的鍛造火光中成形，以流動的秘法淬鍊出史詩階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +170 · 防禦 +16 · 智力 +35', icon: 'shield', minLevel: 31, equipmentLevel: 4 },
  { name: '泰坦壁壘重甲', slot: '胸甲', rarity: '史詩', description: "「泰坦壁壘重甲」在失落遺跡的鍛造火光中成形，以大地深處的脈動淬鍊出史詩階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +200 · 防禦 +25', icon: 'shield', minLevel: 31, equipmentLevel: 4 },
  { name: '幻影幽靈胸甲', slot: '胸甲', rarity: '史詩', description: "「幻影幽靈胸甲」在山巔祭壇的鍛造火光中成形，以無聲的暗影淬鍊出史詩階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +150 · 防禦 +20 · 力量 +25 · 閃避率 +5.0%', icon: 'shield', minLevel: 31, equipmentLevel: 4 },
  { name: '滅世者護腿', slot: '護腿', rarity: '史詩', description: "「滅世者護腿」在失落遺跡的鍛造火光中成形，以漫長旅途中的微光淬鍊出史詩階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '生命 +175 · 防禦 +21 · 力量 +25', icon: 'target', minLevel: 31, equipmentLevel: 4 },
  { name: '虛空獵手護腿', slot: '護腿', rarity: '史詩', description: "「虛空獵手護腿」在海岸燈塔的鍛造火光中成形，以無聲的暗影淬鍊出史詩階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '防禦 +17 · 力量 +28 · 閃避率 +5.8%', icon: 'target', minLevel: 31, equipmentLevel: 4 },
  { name: '大元素師長褲', slot: '護腿', rarity: '史詩', description: "「大元素師長褲」在王城戰場的鍛造火光中成形，以流動的秘法淬鍊出史詩階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '生命 +150 · 防禦 +16 · 智力 +29', icon: 'target', minLevel: 31, equipmentLevel: 4 },
  { name: '泰坦壁壘護腿', slot: '護腿', rarity: '史詩', description: "「泰坦壁壘護腿」在古老工坊的鍛造火光中成形，以大地深處的脈動淬鍊出史詩階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '生命 +190 · 防禦 +23', icon: 'target', minLevel: 31, equipmentLevel: 4 },
  { name: '幻影幽靈護腿', slot: '護腿', rarity: '史詩', description: "「幻影幽靈護腿」在古老工坊的鍛造火光中成形，以無聲的暗影淬鍊出史詩階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '防禦 +18 · 力量 +24 · 閃避率 +6.5%', icon: 'target', minLevel: 31, equipmentLevel: 4 },
  { name: '屠龍者胸針', slot: '護身符', rarity: '史詩', description: "「屠龍者胸針」在古老工坊的鍛造火光中成形，以沉睡的龍息淬鍊出史詩階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '生命 +160 · 力量 +33', icon: 'star', minLevel: 31, equipmentLevel: 4 },
  { name: '靈魂吞噬者護符', slot: '護身符', rarity: '史詩', description: "「靈魂吞噬者護符」在王城戰場的鍛造火光中成形，以漫長旅途中的微光淬鍊出史詩階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '生命 +150 · 智力 +34', icon: 'star', minLevel: 31, equipmentLevel: 4 },
  { name: '不滅之星護符', slot: '護身符', rarity: '史詩', description: "「不滅之星護符」在海岸燈塔的鍛造火光中成形，以遙遠的星辰淬鍊出史詩階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '生命 +180 · 防禦 +24', icon: 'star', minLevel: 31, equipmentLevel: 4 },
  { name: '影之刺客吊墜', slot: '護身符', rarity: '史詩', description: "「影之刺客吊墜」在邊境哨站的鍛造火光中成形，以無聲的暗影淬鍊出史詩階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '力量 +30 · 閃避率 +6.0%', icon: 'star', minLevel: 31, equipmentLevel: 4 },
  { name: '時空樞紐護符', slot: '護身符', rarity: '史詩', description: "「時空樞紐護符」在古老工坊的鍛造火光中成形，以漫長旅途中的微光淬鍊出史詩階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '防禦 +19 · 智力 +28 · 閃避率 +4.5%', icon: 'star', minLevel: 31, equipmentLevel: 4 },
  { name: '阿修羅戰神兜盔', slot: '頭盔', rarity: '傳說', description: "「阿修羅戰神兜盔」在失落遺跡的鍛造火光中成形，以漫長旅途中的微光淬鍊出傳說階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +240 · 防禦 +32 · 力量 +46', icon: 'shield-check', minLevel: 41, equipmentLevel: 5 },
  { name: '夜魔主宰面具', slot: '頭盔', rarity: '傳說', description: "「夜魔主宰面具」在邊境哨站的鍛造火光中成形，以無聲的暗影淬鍊出傳說階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '防禦 +28 · 力量 +52 · 閃避率 +8.5%', icon: 'shield-check', minLevel: 41, equipmentLevel: 5 },
  { name: '星辰智者之冠', slot: '頭盔', rarity: '傳說', description: "「星辰智者之冠」在山巔祭壇的鍛造火光中成形，以遙遠的星辰淬鍊出傳說階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +220 · 防禦 +26 · 智力 +53', icon: 'shield-check', minLevel: 41, equipmentLevel: 5 },
  { name: '永恆山脈巨盔', slot: '頭盔', rarity: '傳說', description: "「永恆山脈巨盔」在古老工坊的鍛造火光中成形，以大地深處的脈動淬鍊出傳說階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +280 · 防禦 +40', icon: 'shield-check', minLevel: 41, equipmentLevel: 5 },
  { name: '鳳凰涅槃面具', slot: '頭盔', rarity: '傳說', description: "「鳳凰涅槃面具」在失落遺跡的鍛造火光中成形，以不熄的餘燼淬鍊出傳說階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +260 · 防禦 +30 · 力量 +38 · 智力 +38', icon: 'shield-check', minLevel: 41, equipmentLevel: 5 },
  { name: '帝王光輝聖甲', slot: '胸甲', rarity: '傳說', description: "「帝王光輝聖甲」在失落遺跡的鍛造火光中成形，以漫長旅途中的微光淬鍊出傳說階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +270 · 防禦 +38 · 力量 +42', icon: 'shield', minLevel: 41, equipmentLevel: 5 },
  { name: '深淵獵手皮革', slot: '胸甲', rarity: '傳說', description: "「深淵獵手皮革」在古老工坊的鍛造火光中成形，以漫長旅途中的微光淬鍊出傳說階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +210 · 防禦 +28 · 力量 +52 · 閃避率 +9.5%', icon: 'shield', minLevel: 41, equipmentLevel: 5 },
  { name: '真理之門法袍', slot: '胸甲', rarity: '傳說', description: "「真理之門法袍」在失落遺跡的鍛造火光中成形，以流動的秘法淬鍊出傳說階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +230 · 防禦 +27 · 智力 +55', icon: 'shield', minLevel: 41, equipmentLevel: 5 },
  { name: '神聖守護者之壁', slot: '胸甲', rarity: '傳說', description: "「神聖守護者之壁」在王城戰場的鍛造火光中成形，以漫長旅途中的微光淬鍊出傳說階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +280 · 防禦 +40', icon: 'shield', minLevel: 41, equipmentLevel: 5 },
  { name: '疾風劍聖法衣', slot: '胸甲', rarity: '傳說', description: "「疾風劍聖法衣」在山巔祭壇的鍛造火光中成形，以穿谷而過的疾風淬鍊出傳說階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +220 · 防禦 +30 · 力量 +48 · 閃避率 +8.0%', icon: 'shield', minLevel: 41, equipmentLevel: 5 },
  { name: '阿修羅戰神護腿', slot: '護腿', rarity: '傳說', description: "「阿修羅戰神護腿」在邊境哨站的鍛造火光中成形，以漫長旅途中的微光淬鍊出傳說階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '生命 +230 · 防禦 +31 · 力量 +41', icon: 'target', minLevel: 41, equipmentLevel: 5 },
  { name: '夜魔主宰護腿', slot: '護腿', rarity: '傳說', description: "「夜魔主宰護腿」在海岸燈塔的鍛造火光中成形，以無聲的暗影淬鍊出傳說階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '防禦 +27 · 力量 +46 · 閃避率 +8.8%', icon: 'target', minLevel: 41, equipmentLevel: 5 },
  { name: '星辰智者長褲', slot: '護腿', rarity: '傳說', description: "「星辰智者長褲」在古老工坊的鍛造火光中成形，以遙遠的星辰淬鍊出傳說階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '生命 +200 · 防禦 +26 · 智力 +45', icon: 'target', minLevel: 41, equipmentLevel: 5 },
  { name: '永恆山脈護腿', slot: '護腿', rarity: '傳說', description: "「永恆山脈護腿」在古老工坊的鍛造火光中成形，以大地深處的脈動淬鍊出傳說階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '生命 +260 · 防禦 +36', icon: 'target', minLevel: 41, equipmentLevel: 5 },
  { name: '疾風劍聖護腿', slot: '護腿', rarity: '傳說', description: "「疾風劍聖護腿」在山巔祭壇的鍛造火光中成形，以穿谷而過的疾風淬鍊出傳說階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '防禦 +28 · 力量 +44 · 閃避率 +10.0%', icon: 'target', minLevel: 41, equipmentLevel: 5 },
  { name: '太陽神之眼', slot: '護身符', rarity: '傳說', description: "「太陽神之眼」在王城戰場的鍛造火光中成形，以初升的晨光淬鍊出傳說階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '生命 +220 · 力量 +50 · 智力 +45', icon: 'star', minLevel: 41, equipmentLevel: 5 },
  { name: '美杜莎之瞳', slot: '護身符', rarity: '傳說', description: "「美杜莎之瞳」在邊境哨站的鍛造火光中成形，以漫長旅途中的微光淬鍊出傳說階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '力量 +48 · 閃避率 +9.0%', icon: 'star', minLevel: 41, equipmentLevel: 5 },
  { name: '利維坦之心', slot: '護身符', rarity: '傳說', description: "「利維坦之心」在邊境哨站的鍛造火光中成形，以漫長旅途中的微光淬鍊出傳說階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '生命 +280 · 防禦 +35', icon: 'star', minLevel: 41, equipmentLevel: 5 },
  { name: '獵王之牙', slot: '護身符', rarity: '傳說', description: "「獵王之牙」在王城戰場的鍛造火光中成形，以漫長旅途中的微光淬鍊出傳說階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '力量 +54 · 閃避率 +7.0%', icon: 'star', minLevel: 41, equipmentLevel: 5 },
  { name: '時空交界水晶', slot: '護身符', rarity: '傳說', description: "「時空交界水晶」在邊境哨站的鍛造火光中成形，以深海的回聲淬鍊出傳說階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '防禦 +29 · 智力 +48 · 閃避率 +8.5%', icon: 'star', minLevel: 41, equipmentLevel: 5 },
  { name: '創世者·秩序之冠', slot: '頭盔', rarity: '神話', description: "「創世者·秩序之冠」在失落遺跡的鍛造火光中成形，以漫長旅途中的微光淬鍊出神話階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +350 · 防禦 +52 · 力量 +65 · 智力 +60', icon: 'shield-check', minLevel: 51, equipmentLevel: 6 },
  { name: '虛空之主·終焉面具', slot: '頭盔', rarity: '神話', description: "「虛空之主·終焉面具」在邊境哨站的鍛造火光中成形，以無聲的暗影淬鍊出神話階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '防禦 +45 · 力量 +78 · 閃避率 +13.5%', icon: 'shield-check', minLevel: 51, equipmentLevel: 6 },
  { name: '全知者·真理之冠', slot: '頭盔', rarity: '神話', description: "「全知者·真理之冠」在山巔祭壇的鍛造火光中成形，以流動的秘法淬鍊出神話階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +320 · 防禦 +42 · 智力 +80', icon: 'shield-check', minLevel: 51, equipmentLevel: 6 },
  { name: '滅世巨神·荒古重盔 (極品)', slot: '頭盔', rarity: '神話', description: "「滅世巨神·荒古重盔 (極品)」在邊境哨站的鍛造火光中成形，以大地深處的脈動淬鍊出神話階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +400 · 防禦 +65', icon: 'shield-check', minLevel: 51, equipmentLevel: 6 },
  { name: '末日狂刃·血神之面 (極品)', slot: '頭盔', rarity: '神話', description: "「末日狂刃·血神之面 (極品)」在邊境哨站的鍛造火光中成形，以漫長旅途中的微光淬鍊出神話階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +320 · 防禦 +48 · 力量 +85', icon: 'shield-check', minLevel: 51, equipmentLevel: 6 },
  { name: '創世者·不朽聖軀', slot: '胸甲', rarity: '神話', description: "「創世者·不朽聖軀」在海岸燈塔的鍛造火光中成形，以漫長旅途中的微光淬鍊出神話階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +370 · 防禦 +58 · 力量 +60 · 智力 +60', icon: 'shield', minLevel: 51, equipmentLevel: 6 },
  { name: '虛空之主·無形影甲', slot: '胸甲', rarity: '神話', description: "「虛空之主·無形影甲」在邊境哨站的鍛造火光中成形，以無聲的暗影淬鍊出神話階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +300 · 防禦 +43 · 力量 +76 · 閃避率 +15.0%', icon: 'shield', minLevel: 51, equipmentLevel: 6 },
  { name: '全知者·元素起源法袍', slot: '胸甲', rarity: '神話', description: "「全知者·元素起源法袍」在古老工坊的鍛造火光中成形，以流動的秘法淬鍊出神話階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +310 · 防禦 +41 · 智力 +78', icon: 'shield', minLevel: 51, equipmentLevel: 6 },
  { name: '滅世巨神·永恆堡壘 (極品)', slot: '胸甲', rarity: '神話', description: "「滅世巨神·永恆堡壘 (極品)」在失落遺跡的鍛造火光中成形，以大地深處的脈動淬鍊出神話階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +400 · 防禦 +65', icon: 'shield', minLevel: 51, equipmentLevel: 6 },
  { name: '末日狂刃·屠戮胸甲 (極品)', slot: '胸甲', rarity: '神話', description: "「末日狂刃·屠戮胸甲 (極品)」在古老工坊的鍛造火光中成形，以漫長旅途中的微光淬鍊出神話階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +350 · 防禦 +50 · 力量 +85', icon: 'shield', minLevel: 51, equipmentLevel: 6 },
  { name: '創世者·踏空神履', slot: '護腿', rarity: '神話', description: "「創世者·踏空神履」在海岸燈塔的鍛造火光中成形，以漫長旅途中的微光淬鍊出神話階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '生命 +320 · 防禦 +48 · 力量 +62 · 智力 +58', icon: 'target', minLevel: 51, equipmentLevel: 6 },
  { name: '虛空之主·幻影護腿', slot: '護腿', rarity: '神話', description: "「虛空之主·幻影護腿」在邊境哨站的鍛造火光中成形，以無聲的暗影淬鍊出神話階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '防禦 +42 · 力量 +72 · 閃避率 +13.0%', icon: 'target', minLevel: 51, equipmentLevel: 6 },
  { name: '全知者·星軌長褲', slot: '護腿', rarity: '神話', description: "「全知者·星軌長褲」在古老工坊的鍛造火光中成形，以遙遠的星辰淬鍊出神話階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '生命 +290 · 防禦 +41 · 智力 +70', icon: 'target', minLevel: 51, equipmentLevel: 6 },
  { name: '滅世巨神·大地之足', slot: '護腿', rarity: '神話', description: "「滅世巨神·大地之足」在山巔祭壇的鍛造火光中成形，以大地深處的脈動淬鍊出神話階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '生命 +360 · 防禦 +55', icon: 'target', minLevel: 51, equipmentLevel: 6 },
  { name: '末日狂刃·疾風戰腿', slot: '護腿', rarity: '神話', description: "「末日狂刃·疾風戰腿」在海岸燈塔的鍛造火光中成形，以穿谷而過的疾風淬鍊出神話階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '防禦 +44 · 力量 +75 · 閃避率 +12.0%', icon: 'target', minLevel: 51, equipmentLevel: 6 },
  { name: '創世核心·萬物之源 (極品)', slot: '護身符', rarity: '神話', description: "「創世核心·萬物之源 (極品)」在邊境哨站的鍛造火光中成形，以漫長旅途中的微光淬鍊出神話階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '生命 +380 · 防禦 +50 · 力量 +80 · 智力 +80 · 閃避率 +11.0%', icon: 'star', minLevel: 51, equipmentLevel: 6 },
  { name: '深淵之眼·終極恐懼 (極品)', slot: '護身符', rarity: '神話', description: "「深淵之眼·終極恐懼 (極品)」在邊境哨站的鍛造火光中成形，以漫長旅途中的微光淬鍊出神話階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '力量 +85 · 閃避率 +14.0%', icon: 'star', minLevel: 51, equipmentLevel: 6 },
  { name: '時光之輪·永恆交響', slot: '護身符', rarity: '神話', description: "「時光之輪·永恆交響」在邊境哨站的鍛造火光中成形，以漫長旅途中的微光淬鍊出神話階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '生命 +340 · 防禦 +48 · 智力 +75 · 閃避率 +12.5%', icon: 'star', minLevel: 51, equipmentLevel: 6 },
  { name: '阿瓦隆之庇護·神聖之心 (極品)', slot: '護身符', rarity: '神話', description: "「阿瓦隆之庇護·神聖之心 (極品)」在邊境哨站的鍛造火光中成形，以漫長旅途中的微光淬鍊出神話階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '生命 +400 · 防禦 +60', icon: 'star', minLevel: 51, equipmentLevel: 6 },
  { name: '諸神黃昏·毀滅之鏈 (極品)', slot: '護身符', rarity: '神話', description: "「諸神黃昏·毀滅之鏈 (極品)」在王城戰場的鍛造火光中成形，以漫長旅途中的微光淬鍊出神話階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '力量 +85 · 智力 +85', icon: 'star', minLevel: 51, equipmentLevel: 6 },
  { name: '晨星皮盔', slot: '頭盔', rarity: '普通', description: "「晨星皮盔」在古老工坊的鍛造火光中成形，以初升的晨光淬鍊出普通階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +40 · 防禦 +3', icon: 'shield-check', minLevel: 1, equipmentLevel: 1 },
  { name: '銅脊短劍', slot: '武器', weaponType: '劍', rarity: '普通', description: "「銅脊短劍」在古老工坊的鍛造火光中成形，以漫長旅途中的微光淬鍊出一柄普通階的劍；出鞘的瞬間，古老的誓言隨刃光一同甦醒。", bonus: '力量 +4 · 暴擊率 +2% · 暴擊傷害 +8%', icon: 'sword', minLevel: 1, equipmentLevel: 1 },
  { name: '旅團軟甲', slot: '胸甲', rarity: '普通', description: "「旅團軟甲」在王城戰場的鍛造火光中成形，以漫長旅途中的微光淬鍊出普通階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +45 · 防禦 +3', icon: 'shield', minLevel: 1, equipmentLevel: 1 },
  { name: '踏風護腿', slot: '護腿', rarity: '普通', description: "「踏風護腿」在古老工坊的鍛造火光中成形，以穿谷而過的疾風淬鍊出普通階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '防禦 +2 · 閃避率 +0.8%', icon: 'target', minLevel: 1, equipmentLevel: 1 },
  { name: '守夜符印', slot: '護身符', rarity: '普通', description: "「守夜符印」在失落遺跡的鍛造火光中成形，以無聲的暗影淬鍊出普通階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '智力 +4 · 防禦 +2', icon: 'star', minLevel: 1, equipmentLevel: 1 },
  { name: '銀羽盔', slot: '頭盔', rarity: '精良', description: "「銀羽盔」在海岸燈塔的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +70 · 防禦 +6', icon: 'shield-check', minLevel: 11, equipmentLevel: 2 },
  { name: '巡星長弓', slot: '武器', weaponType: '弓', rarity: '精良', description: "「巡星長弓」在王城戰場的鍛造火光中成形，以遙遠的星辰淬鍊出一柄精良階的弓；弓弦一響，遠方的風便替它指出獵物。", bonus: '力量 +9 · 閃避率 +1.5% · 暴擊率 +2% · 暴擊傷害 +14%', icon: 'sword', minLevel: 11, equipmentLevel: 2 },
  { name: '月鋼胸甲', slot: '胸甲', rarity: '精良', description: "「月鋼胸甲」在王城戰場的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +65 · 防禦 +7', icon: 'shield', minLevel: 11, equipmentLevel: 2 },
  { name: '疾行護腿', slot: '護腿', rarity: '精良', description: "「疾行護腿」在失落遺跡的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '力量 +6 · 防禦 +5', icon: 'target', minLevel: 11, equipmentLevel: 2 },
  { name: '湛藍符文', slot: '護身符', rarity: '精良', description: "「湛藍符文」在山巔祭壇的鍛造火光中成形，以漫長旅途中的微光淬鍊出精良階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '智力 +9 · 生命 +55', icon: 'star', minLevel: 11, equipmentLevel: 2 },
  { name: '霜狼戰盔', slot: '頭盔', rarity: '稀有', description: "「霜狼戰盔」在失落遺跡的鍛造火光中成形，以凜冽的霜意淬鍊出稀有階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +120 · 防禦 +12', icon: 'shield-check', minLevel: 21, equipmentLevel: 3 },
  { name: '赤曜長劍', slot: '武器', weaponType: '劍', rarity: '稀有', description: "「赤曜長劍」在失落遺跡的鍛造火光中成形，以漫長旅途中的微光淬鍊出一柄稀有階的劍；出鞘的瞬間，古老的誓言隨刃光一同甦醒。", bonus: '力量 +18 · 暴擊率 +2% · 暴擊傷害 +12%', icon: 'sword', minLevel: 21, equipmentLevel: 3 },
  { name: '秘銀胸甲', slot: '胸甲', rarity: '稀有', description: "「秘銀胸甲」在王城戰場的鍛造火光中成形，以漫長旅途中的微光淬鍊出稀有階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +145 · 防禦 +14', icon: 'shield', minLevel: 21, equipmentLevel: 3 },
  { name: '疾影護腿', slot: '護腿', rarity: '稀有', description: "「疾影護腿」在山巔祭壇的鍛造火光中成形，以無聲的暗影淬鍊出稀有階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '力量 +13 · 閃避率 +3.5%', icon: 'target', minLevel: 21, equipmentLevel: 3 },
  { name: '星語護符', slot: '護身符', rarity: '稀有', description: "「星語護符」在王城戰場的鍛造火光中成形，以遙遠的星辰淬鍊出稀有階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '智力 +17 · 防禦 +10', icon: 'star', minLevel: 21, equipmentLevel: 3 },
  { name: '蒼龍冠', slot: '頭盔', rarity: '史詩', description: "「蒼龍冠」在山巔祭壇的鍛造火光中成形，以沉睡的龍息淬鍊出史詩階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +175 · 防禦 +23 · 智力 +21', icon: 'shield-check', minLevel: 31, equipmentLevel: 4 },
  { name: '雷鳴巨刃', slot: '武器', weaponType: '劍', rarity: '史詩', description: "「雷鳴巨刃」在失落遺跡的鍛造火光中成形，以穿谷而過的疾風淬鍊出一柄史詩階的劍；出鞘的瞬間，古老的誓言隨刃光一同甦醒。", bonus: '力量 +35 · 暴擊率 +3% · 暴擊傷害 +16%', icon: 'sword', minLevel: 31, equipmentLevel: 4 },
  { name: '王庭戰鎧', slot: '胸甲', rarity: '史詩', description: "「王庭戰鎧」在山巔祭壇的鍛造火光中成形，以漫長旅途中的微光淬鍊出史詩階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +195 · 防禦 +24', icon: 'shield', minLevel: 31, equipmentLevel: 4 },
  { name: '幻風護腿', slot: '護腿', rarity: '史詩', description: "「幻風護腿」在古老工坊的鍛造火光中成形，以穿谷而過的疾風淬鍊出史詩階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '力量 +27 · 閃避率 +5.5%', icon: 'target', minLevel: 31, equipmentLevel: 4 },
  { name: '深海核心', slot: '護身符', rarity: '史詩', description: "「深海核心」在海岸燈塔的鍛造火光中成形，以深海的回聲淬鍊出史詩階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '智力 +34 · 生命 +160', icon: 'star', minLevel: 31, equipmentLevel: 4 },
  { name: '天穹王盔', slot: '頭盔', rarity: '傳說', description: "「天穹王盔」在山巔祭壇的鍛造火光中成形，以遙遠的星辰淬鍊出傳說階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +250 · 防禦 +35 · 力量 +40', icon: 'shield-check', minLevel: 41, equipmentLevel: 5 },
  { name: '焚星神弓', slot: '武器', weaponType: '弓', rarity: '傳說', description: "「焚星神弓」在失落遺跡的鍛造火光中成形，以遙遠的星辰淬鍊出一柄傳說階的弓；弓弦一響，遠方的風便替它指出獵物。", bonus: '力量 +55 · 閃避率 +7.5% · 暴擊率 +5% · 暴擊傷害 +28%', icon: 'sword', minLevel: 41, equipmentLevel: 5 },
  { name: '神諭聖甲', slot: '胸甲', rarity: '傳說', description: "「神諭聖甲」在海岸燈塔的鍛造火光中成形，以漫長旅途中的微光淬鍊出傳說階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +275 · 防禦 +39', icon: 'shield', minLevel: 41, equipmentLevel: 5 },
  { name: '影月護腿', slot: '護腿', rarity: '傳說', description: "「影月護腿」在海岸燈塔的鍛造火光中成形，以無聲的暗影淬鍊出傳說階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '力量 +45 · 閃避率 +9.0%', icon: 'target', minLevel: 41, equipmentLevel: 5 },
  { name: '永恆星核', slot: '護身符', rarity: '傳說', description: "「永恆星核」在海岸燈塔的鍛造火光中成形，以遙遠的星辰淬鍊出傳說階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '智力 +52 · 生命 +220', icon: 'star', minLevel: 41, equipmentLevel: 5 },
  { name: '萬象冠冕', slot: '頭盔', rarity: '神話', description: "「萬象冠冕」在王城戰場的鍛造火光中成形，以漫長旅途中的微光淬鍊出神話階的頭盔；守住視線與意志，讓持有者在混亂中仍能看清前路。", bonus: '生命 +360 · 防禦 +60 · 智力 +70', icon: 'shield-check', minLevel: 51, equipmentLevel: 6 },
  { name: '終界斬艦', slot: '武器', weaponType: '劍', rarity: '神話', description: "「終界斬艦」在失落遺跡的鍛造火光中成形，以漫長旅途中的微光淬鍊出一柄神話階的劍；出鞘的瞬間，古老的誓言隨刃光一同甦醒。", bonus: '力量 +80 · 閃避率 +12.0% · 暴擊率 +5% · 暴擊傷害 +25%', icon: 'sword', minLevel: 51, equipmentLevel: 6 },
  { name: '創星神鎧', slot: '胸甲', rarity: '神話', description: "「創星神鎧」在山巔祭壇的鍛造火光中成形，以遙遠的星辰淬鍊出神話階的胸甲；替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地。", bonus: '生命 +380 · 防禦 +62 · 力量 +60', icon: 'shield', minLevel: 51, equipmentLevel: 6 },
  { name: '逐日神腿', slot: '護腿', rarity: '神話', description: "「逐日神腿」在失落遺跡的鍛造火光中成形，以漫長旅途中的微光淬鍊出神話階的護腿；把每一步都化成穩定的力量，陪持有者走過危險地形。", bonus: '力量 +78 · 閃避率 +14.0%', icon: 'target', minLevel: 51, equipmentLevel: 6 },
  { name: '宇宙心印', slot: '護身符', rarity: '神話', description: "「宇宙心印」在古老工坊的鍛造火光中成形，以遙遠的星辰淬鍊出神話階的護身符；將持有者的誓言收進微光裡，在最需要時回應那份信念。", bonus: '生命 +380 · 智力 +85 · 防禦 +55', icon: 'star', minLevel: 51, equipmentLevel: 6 },
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
          description: `「${profile.label}·${name}」是${profile.rarity}階的${weaponType}${weaponType === "法杖" ? `，${staffElements[index]}元素在其中靜靜流轉` : ""}；${weaponType === "弓" ? "弓弦一響，遠方的風便替它指出獵物" : weaponType === "短刀" ? "刀鋒貼著寂靜掠過，只留下無人察覺的寒光" : weaponType === "法杖" ? "杖端亮起微光，將沉睡的力量喚回人間" : "出鞘的瞬間，古老的誓言隨刃光一同甦醒"}。`,
          bonus: `${weaponType === "法杖" ? "智力" : "力量"} +${profile.values[index]}${weaponType === "法杖" ? ` · 施法速度 +${staffCastSpeedByLevel[profile.equipmentLevel - 1]}%` : ` · 暴擊率 +${weaponCritRateByType[weaponType][profile.equipmentLevel - 1]}% · 暴擊傷害 +${weaponCritDamageByType[weaponType][profile.equipmentLevel - 1]}%`}`,
          icon: weaponType === "法杖" ? "sparkles" : weaponType === "弓" ? "target" : "sword",
          minLevel: profile.minLevel,
          equipmentLevel: profile.equipmentLevel,
        }))
    )
);

const sixSetThemes = [
  { id: "dawn-warden", name: "曙光聖衛", story: "守望黎明、替迷途者點亮歸途" },
  { id: "moon-stalker", name: "影月獵行", story: "藏身月影、在無聲夜色中追獵邪祟" },
  { id: "astral-sage", name: "星界賢者", story: "仰望群星、將遠古智慧帶回凡世" },
  { id: "titan-bastion", name: "鐵壁巨神", story: "承受山嶽重量、以不倒的意志守住陣線" },
  { id: "storm-sword", name: "風暴劍魂", story: "喚起雷霆與疾風、以一往無前的鋒芒破陣" },
  { id: "azure-dragon", name: "蒼龍天命", story: "承接蒼龍血脈、在雲海之上宣告新的時代" },
] as const;

const setPieceNames: Record<EquipmentDatabaseTemplate["slot"], string> = {
  頭盔: "盔",
  胸甲: "胸甲",
  武器: "武器",
  護腿: "護腿",
  護身符: "徽記",
};
const setSlotStories: Record<EquipmentDatabaseTemplate["slot"], string> = {
  頭盔: "它替佩戴者守住視線與信念，讓混亂中的道路重新清晰",
  胸甲: "它擋下最沉重的衝擊，也替身後的同伴留下反擊的時機",
  武器: "它在出鞘時回應持有者的誓言，將戰意化為無可阻擋的一擊",
  護腿: "它把每一步都化成穩定的力量，陪英雄走過最危險的疆域",
  護身符: "它收納歷代守護者的祈願，在最需要的時刻回應勇者",
};

const weaponFamilyIndex: Record<string, number> = {
  "曙光劍": 0,
  "獵影短刀": 0,
  "林風弓": 0,
  "木靈法杖": 0,
  "鐵衛劍": 1,
  "迅牙短刀": 1,
  "沙羽弓": 1,
  "藍晶法杖": 1,
  "月影劍": 2,
  "毒棘短刀": 2,
  "月弦弓": 2,
  "星語法杖": 2,
  "王道劍": 3,
  "幻步短刀": 3,
  "天穹弓": 3,
  "炎脈法杖": 3,
  "星界劍": 4,
  "虛空短刀": 4,
  "日輪弓": 4,
  "創世法杖": 4,
};

const storyMotifs = [
  { keywords: ["曙光", "晨星", "日輪", "太陽"], motif: "初升的晨光" },
  { keywords: ["影", "暗", "夜", "虛空", "幽靈"], motif: "無聲的暗影" },
  { keywords: ["星", "宇宙", "天穹", "星辰", "銀河"], motif: "遙遠的星辰" },
  { keywords: ["龍", "巨龍", "蒼龍"], motif: "沉睡的龍息" },
  { keywords: ["風", "疾風", "幻風", "雷", "風暴"], motif: "穿谷而過的疾風" },
  { keywords: ["火", "炎", "熔岩", "焚", "鳳凰"], motif: "不熄的餘燼" },
  { keywords: ["冰", "霜", "寒"], motif: "凜冽的霜意" },
  { keywords: ["海", "深海", "潮", "水"], motif: "深海的回聲" },
  { keywords: ["大地", "山", "泰坦", "巨神", "鐵壁"], motif: "大地深處的脈動" },
  { keywords: ["魔法", "秘法", "元素", "法師", "真理"], motif: "流動的秘法" },
] as const;

const storyScenes = [
  "邊境哨站", "古老工坊", "王城戰場", "山巔祭壇", "失落遺跡", "海岸燈塔",
] as const;

function getEquipmentStoryMotif(name: string) {
  return storyMotifs.find(item => item.keywords.some(keyword => name.includes(keyword)))?.motif ?? "漫長旅途中的微光";
}

function getEquipmentStoryScene(name: string) {
  const seed = [...name].reduce((total, char) => total + char.charCodeAt(0), 0);
  return storyScenes[seed % storyScenes.length];
}

function buildEquipmentStory(template: EquipmentDatabaseTemplate) {
  const { name, rarity, slot, weaponType, element } = template;
  const motif = getEquipmentStoryMotif(name);
  const scene = getEquipmentStoryScene(name);
  const rarityLabel = `${rarity}階`;

  if (slot === "武器") {
    const weaponLabel = weaponType ?? "武器";
    const elementStory = element ? `，${element}元素在其中靜靜流轉` : "";
    const weaponAction = weaponType === "弓"
      ? "弓弦一響，遠方的風便替它指出獵物"
      : weaponType === "短刀"
        ? "刀鋒貼著寂靜掠過，只留下無人察覺的寒光"
        : weaponType === "法杖"
          ? "杖端亮起微光，將沉睡的力量喚回人間"
          : "出鞘的瞬間，古老的誓言隨刃光一同甦醒";
    return `「${name}」在${scene}的鍛造火光中成形，以${motif}淬鍊出一柄${rarityLabel}的${weaponLabel}${elementStory}；${weaponAction}。`;
  }

  const equipmentAction = slot === "頭盔"
    ? "守住視線與意志，讓持有者在混亂中仍能看清前路"
    : slot === "胸甲"
      ? "替持有者擋下迎面而來的衝擊，也替身後的人留下喘息之地"
      : slot === "護腿"
        ? "把每一步都化成穩定的力量，陪持有者走過危險地形"
        : "將持有者的誓言收進微光裡，在最需要時回應那份信念";
  return `「${name}」在${scene}的鍛造火光中成形，以${motif}淬鍊出${rarityLabel}的${slot}；${equipmentAction}。`;
}

const originalRpgEquipmentTemplates = [
  ...LEGACY_EQUIPMENT_TEMPLATES.map(template => ({
    ...template,
    description: buildEquipmentStory(template),
  })),
  ...generatedWeaponTemplates.map(template => ({
    ...template,
    description: buildEquipmentStory(template),
  })),
];

function getSetFamilyIndex(
  template: EquipmentDatabaseTemplate,
  templates: EquipmentDatabaseTemplate[]
) {
  if (template.slot === "武器") {
    const weaponKey = Object.keys(weaponFamilyIndex).find(key =>
      template.name.includes(key)
    );
    return weaponKey ? weaponFamilyIndex[weaponKey] : 5;
  }
  return templates.filter(
    item => item.rarity === template.rarity && item.slot === template.slot
  ).indexOf(template) % sixSetThemes.length;
}

const sixSetEquipmentTemplates: EquipmentDatabaseTemplate[] =
  originalRpgEquipmentTemplates.map(template => {
    const familyIndex = getSetFamilyIndex(template, originalRpgEquipmentTemplates);
    const theme = sixSetThemes[familyIndex];
    const pieceName = template.weaponType
      ? `${template.weaponType}${setPieceNames.武器}`
      : setPieceNames[template.slot];
    return {
      ...template,
      setId: `${theme.id}-${template.rarity}`,
      name: `${theme.name}·${template.rarity}${pieceName}`,
      description: `「${theme.name}·${template.rarity}${pieceName}」承載${theme.story}的傳承；${setSlotStories[template.slot]}。`,
    };
  });

export const RPG_EQUIPMENT_TEMPLATES: EquipmentDatabaseTemplate[] = [
  ...originalRpgEquipmentTemplates,
  ...sixSetEquipmentTemplates,
];
