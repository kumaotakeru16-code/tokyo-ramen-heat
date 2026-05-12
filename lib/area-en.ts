import type { Lang } from './i18n'

// 東京主要エリア 日英対応辞書
// Google Places API から返ってくるエリア名（area フィールド）に対応
const AREA_EN: Record<string, string> = {
  // 山手線沿線
  '新宿':   'Shinjuku',
  '渋谷':   'Shibuya',
  '池袋':   'Ikebukuro',
  '上野':   'Ueno',
  '秋葉原': 'Akihabara',
  '品川':   'Shinagawa',
  '新橋':   'Shimbashi',
  '有楽町': 'Yurakucho',
  '東京':   'Tokyo',
  '東京駅': 'Tokyo Station',
  '神田':   'Kanda',
  '御徒町': 'Okachimachi',
  '鶯谷':   'Uguisudani',
  '日暮里': 'Nippori',
  '西日暮里': 'Nishi-Nippori',
  '田端':   'Tabata',
  '駒込':   'Komagome',
  '巣鴨':   'Sugamo',
  '大塚':   'Otsuka',
  '目白':   'Mejiro',
  '高田馬場': 'Takadanobaba',
  '新大久保': 'Shin-Okubo',
  '代々木': 'Yoyogi',
  '原宿':   'Harajuku',
  '恵比寿': 'Ebisu',
  '目黒':   'Meguro',
  '五反田': 'Gotanda',
  '大崎':   'Osaki',

  // 中央線沿線
  '吉祥寺': 'Kichijoji',
  '三鷹':   'Mitaka',
  '荻窪':   'Ogikubo',
  '阿佐ヶ谷': 'Asagaya',
  '高円寺': 'Koenji',
  '中野':   'Nakano',

  // 西武・丸ノ内ほか
  '鷺ノ宮': 'Saginomiya',
  '練馬':   'Nerima',

  // 神保町・本郷エリア
  '神保町': 'Jinbocho',
  '本郷':   'Hongo',
  '御茶ノ水': 'Ochanomizu',
  '水道橋': 'Suidobashi',

  // 下町エリア
  '浅草':   'Asakusa',
  '押上':   'Oshiage',
  '錦糸町': 'Kinshicho',
  '亀戸':   'Kameido',
  '両国':   'Ryogoku',

  // 郊外
  '立川':   'Tachikawa',
  '八王子': 'Hachioji',
  '町田':   'Machida',

  // 副都心
  '六本木': 'Roppongi',
  '麻布':   'Azabu',
  '赤坂':   'Akasaka',
  '青山':   'Aoyama',
  '表参道': 'Omotesando',
  '二子玉川': 'Futako-Tamagawa',
  '自由が丘': 'Jiyugaoka',
}

/**
 * JP では元のエリア名を返す。
 * EN では英語表記に変換し、辞書にない場合はローマ字のまま返す（変換できない場合はそのまま）。
 */
export function formatArea(area: string, lang: Lang): string {
  if (lang === 'jp') return area
  return AREA_EN[area] ?? area
}
