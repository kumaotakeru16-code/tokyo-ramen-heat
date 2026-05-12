export type StoreTrend = {
  rank: number
  name: string
  area: string
  rating: number
  ratingDelta: number
  ratingDeltaPct: number
  reviewCount: number
  reviewsDelta: number
  trendScore: number
  spark: number[]
  badge?: 'PEAK' | 'NEW'
  note?: string
  noteEn?: string
  googleMapsUrl: string
  /** スナップショットが1件のみ — デルタ計算不可 */
  isInitialSnapshot?: boolean
}

export type TickerItem = {
  rank: number | string
  name: string
  delta: string
}

export type FallingStore = {
  name: string
  area: string
  rating: number
  /** 評価変化（必ず負値: <= -0.1） */
  delta: number
  /** 評価変化率（%） */
  pct: number
  /** レビュー増加数（必ず正値: >= 5）— 注目は増えているのに評価が落ちている店 */
  reviewsDelta: number
  googleMapsUrl: string
}

export type NewEntry = {
  name: string
  area: string
  rating: number
  from: string
  to: number
  googleMapsUrl: string
}

export type RatingMover = {
  name: string
  area: string
  delta: number
  rating: number
  pct: number
  googleMapsUrl: string
}
