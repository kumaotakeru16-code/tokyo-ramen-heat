import type { StoreTrend, TickerItem, FallingStore, NewEntry, RatingMover } from '@/lib/types'

export const HOT_NOW: StoreTrend[] = [
  {
    rank: 1,
    name: '麺屋 炎',
    area: '新宿',
    rating: 4.4,
    ratingDelta: 0.2,
    ratingDeltaPct: 4.7,
    reviewCount: 1738,
    reviewsDelta: 82,
    trendScore: 98,
    spark: [12, 14, 13, 18, 22, 30, 41, 58, 74, 82],
    badge: 'PEAK',
    googleMapsUrl: 'https://maps.google.com/?q=麺屋+炎+新宿',
  },
  {
    rank: 2,
    name: 'RAMEN PULSE',
    area: '渋谷',
    rating: 4.6,
    ratingDelta: 0.1,
    ratingDeltaPct: 2.2,
    reviewCount: 2964,
    reviewsDelta: 64,
    trendScore: 88,
    spark: [40, 42, 44, 48, 50, 54, 58, 60, 63, 64],
    googleMapsUrl: 'https://maps.google.com/?q=RAMEN+PULSE+渋谷',
  },
  {
    rank: 3,
    name: '中華そば 熱源',
    area: '池袋',
    rating: 4.3,
    ratingDelta: 0.3,
    ratingDeltaPct: 7.5,
    reviewCount: 612,
    reviewsDelta: 41,
    trendScore: 81,
    spark: [8, 9, 11, 12, 18, 24, 28, 33, 38, 41],
    badge: 'NEW',
    googleMapsUrl: 'https://maps.google.com/?q=中華そば+熱源+池袋',
  },
  {
    rank: 4,
    name: '麺処 Rising',
    area: '上野',
    rating: 4.1,
    ratingDelta: -0.1,
    ratingDeltaPct: -2.3,
    reviewCount: 1284,
    reviewsDelta: 95,
    trendScore: 74,
    spark: [60, 62, 70, 75, 78, 82, 85, 88, 92, 95],
    note: '評価は微減 / レビューは増加',
    noteEn: 'Rating slightly down / Reviews growing',
    googleMapsUrl: 'https://maps.google.com/?q=麺処+Rising+上野',
  },
  {
    rank: 5,
    name: '煮干中華 黒潮',
    area: '神田',
    rating: 4.2,
    ratingDelta: 0.1,
    ratingDeltaPct: 2.4,
    reviewCount: 421,
    reviewsDelta: 37,
    trendScore: 68,
    spark: [10, 11, 14, 16, 20, 24, 27, 30, 34, 37],
    googleMapsUrl: 'https://maps.google.com/?q=煮干中華+黒潮+神田',
  },
  {
    rank: 6,
    name: '麺の 輝穂',
    area: '鷺ノ宮',
    rating: 4.5,
    ratingDelta: 0.1,
    ratingDeltaPct: 2.3,
    reviewCount: 1102,
    reviewsDelta: 29,
    trendScore: 62,
    spark: [12, 14, 16, 18, 19, 22, 24, 26, 28, 29],
    googleMapsUrl: 'https://maps.google.com/?q=麺の+輝穂+鷺ノ宮',
  },
  {
    rank: 7,
    name: '鶏白湯 姫',
    area: '高田馬場',
    rating: 4.0,
    ratingDelta: 0.2,
    ratingDeltaPct: 5.3,
    reviewCount: 348,
    reviewsDelta: 24,
    trendScore: 58,
    spark: [4, 5, 8, 10, 12, 15, 18, 21, 23, 24],
    googleMapsUrl: 'https://maps.google.com/?q=鶏白湯+姫+高田馬場',
  },
]

export const TICKER_DATA: TickerItem[] = [
  { rank: 1, name: '麺屋 炎', delta: '+82 reviews' },
  { rank: 2, name: 'RAMEN PULSE', delta: '+64 reviews' },
  { rank: 3, name: '中華そば 熱源', delta: '+41 reviews' },
  { rank: '+', name: '麺処 Rising', delta: '+0.3 ↑' },
  { rank: '↑', name: '煮干中華 黒潮', delta: '+5.3% rating' },
  { rank: 'NEW', name: '中華そば 熱源', delta: 'first ranked-in' },
]

export const NEW_ENTRIES: NewEntry[] = [
  { name: '中華そば 熱源', area: '池袋',  rating: 4.3, from: '−', to: 3,  googleMapsUrl: 'https://maps.google.com/?q=中華そば+熱源+池袋' },
  { name: '極麺 龍乃心',  area: '荻窪',  rating: 4.1, from: '−', to: 18, googleMapsUrl: 'https://maps.google.com/?q=極麺+龍乃心+荻窪' },
  { name: '濃厚煮干 海凪', area: '御徒町', rating: 4.0, from: '−', to: 24, googleMapsUrl: 'https://maps.google.com/?q=濃厚煮干+海凪+御徒町' },
]

export const RATING_MOVERS: RatingMover[] = [
  { name: '中華そば 熱源', area: '池袋',   delta: 0.3, rating: 4.3, pct: 7.5, googleMapsUrl: 'https://maps.google.com/?q=中華そば+熱源+池袋' },
  { name: '鶏白湯 姫',    area: '高田馬場', delta: 0.2, rating: 4.0, pct: 5.3, googleMapsUrl: 'https://maps.google.com/?q=鶏白湯+姫+高田馬場' },
  { name: '麺屋 炎',      area: '新宿',    delta: 0.2, rating: 4.4, pct: 4.7, googleMapsUrl: 'https://maps.google.com/?q=麺屋+炎+新宿' },
]

// 急落ウォッチ: reviewsDelta >= 5 かつ delta <= -0.1
// レビューは増えているのに評価が下がっている店（注目増・質に懸念）
export const FALLING_WATCH: FallingStore[] = [
  { name: '麺工房 旧来軒', area: '本郷',   rating: 3.9, delta: -0.3, pct: -6.8, reviewsDelta: 18, googleMapsUrl: 'https://maps.google.com/?q=麺工房+旧来軒+本郷' },
  { name: '豚骨 いろは軒', area: '神保町', rating: 4.1, delta: -0.2, pct: -4.5, reviewsDelta: 12, googleMapsUrl: 'https://maps.google.com/?q=豚骨+いろは軒+神保町' },
]
