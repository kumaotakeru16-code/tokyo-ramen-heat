import type { StoreTrend } from './types'

// ── Supabase クエリ結果の型 ────────────────────────────────────

export type SnapshotRow = {
  rating: number | null
  review_count: number | null
  captured_at: string
}

export type StoreRow = {
  id: string
  name: string
  area: string | null
  google_maps_url: string | null
  store_snapshots: SnapshotRow[]
}

// ── スコア計算 ────────────────────────────────────────────────

/**
 * デルタあり: reviewsDelta * 0.55 + growthRate * 100 * 0.30 + ratingDelta * 100 * 0.15
 * 初回のみ : latestReviews * 0.001（レビュー数で代理ソート、正規化後に有意な差が出る）
 */
function computeRawScore(opts: {
  isInitialSnapshot: boolean
  reviewsDelta: number
  growthRate: number
  ratingDelta: number
  latestReviews: number
}): number {
  if (opts.isInitialSnapshot) {
    return opts.latestReviews * 0.001
  }
  return (
    opts.reviewsDelta * 0.55 +
    opts.growthRate   * 100 * 0.30 +
    opts.ratingDelta  * 100 * 0.15
  )
}

// ── メイン関数 ─────────────────────────────────────────────────

export function buildRankings(stores: StoreRow[]): StoreTrend[] {
  const computed = stores
    .filter(s => s.store_snapshots.length >= 1)
    .map(store => {
      // 新しい順にソート
      const snaps = [...store.store_snapshots].sort(
        (a, b) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime(),
      )

      const latest   = snaps[0]
      const previous = snaps[1] ?? null

      const latestRating  = latest.rating       ?? 0
      const latestReviews = latest.review_count ?? 0

      // ── スナップショットが1件 = 初回データ ──────────────────
      const isInitialSnapshot = previous === null

      let reviewsDelta   = 0
      let ratingDelta    = 0
      let ratingDeltaPct = 0
      let growthRate     = 0

      if (!isInitialSnapshot) {
        const prevRating  = previous.rating       ?? latestRating
        const prevReviews = previous.review_count ?? latestReviews

        reviewsDelta   = latestReviews - prevReviews
        ratingDelta    = latestRating  - prevRating
        ratingDeltaPct = prevRating > 0 ? (ratingDelta / prevRating) * 100 : 0
        growthRate     = prevReviews > 0 ? reviewsDelta / prevReviews : 0
      }

      const score = computeRawScore({
        isInitialSnapshot,
        reviewsDelta,
        growthRate,
        ratingDelta,
        latestReviews,
      })

      // スパークライン: 古い順→新しい順の review_count（最大10点）
      const sparkSnaps = snaps.slice(0, 10).reverse()
      const spark = sparkSnaps.map(s => s.review_count ?? 0)
      // 最低2点ないとスパークラインが描画できないので複製
      if (spark.length < 2) spark.push(spark[spark.length - 1] ?? 0)

      return {
        store,
        reviewsDelta,
        ratingDelta,
        ratingDeltaPct,
        latestRating,
        latestReviews,
        isInitialSnapshot,
        score,
        spark,
      }
    })

  if (computed.length === 0) return []

  // 0–100 正規化
  const scores = computed.map(c => c.score)
  const maxS   = Math.max(...scores)
  const minS   = Math.min(...scores)
  const range  = maxS - minS || 1

  return computed
    .map(c => ({
      rank: 0,
      name:              c.store.name,
      area:              c.store.area ?? '東京',
      rating:            c.latestRating,
      ratingDelta:       c.ratingDelta,
      ratingDeltaPct:    c.ratingDeltaPct,
      reviewCount:       c.latestReviews,
      reviewsDelta:      c.reviewsDelta,
      trendScore:        Math.max(1, Math.round(((c.score - minS) / range) * 100)),
      spark:             c.spark,
      googleMapsUrl:     c.store.google_maps_url ?? '',
      isInitialSnapshot: c.isInitialSnapshot,
    }))
    .sort((a, b) => b.trendScore - a.trendScore)
    .map((s, i) => ({ ...s, rank: i + 1 }))
}
