import type { StoreTrend, RatingMover, FallingStore, NewEntry } from './types'

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

// ── 評価急上昇 ─────────────────────────────────────────────────

export function buildRatingMovers(trends: StoreTrend[]): RatingMover[] {
  return trends
    .filter(t => !t.isInitialSnapshot && t.ratingDelta > 0)
    .sort((a, b) => b.ratingDelta - a.ratingDelta)
    .map(t => ({
      name:          t.name,
      area:          t.area,
      delta:         t.ratingDelta,
      rating:        t.rating,
      pct:           t.ratingDeltaPct,
      googleMapsUrl: t.googleMapsUrl,
    }))
}

// ── 急落ウォッチ ───────────────────────────────────────────────

export function buildFallingWatch(trends: StoreTrend[]): FallingStore[] {
  // レビューが増えているが評価が下がった店舗のみ（マイナスレビューは除外）
  const eligible = trends.filter(t =>
    !t.isInitialSnapshot && t.reviewsDelta > 0 && t.ratingDelta < 0
  )

  // 閾値: reviewsDelta >= 5 && ratingDelta <= -0.1 を優先、該当が少なければ緩い条件にフォールバック
  const strict = eligible.filter(t => t.reviewsDelta >= 5 && t.ratingDelta <= -0.1)
  const source = strict.length > 0 ? strict : eligible

  return source
    .sort((a, b) => a.ratingDelta - b.ratingDelta)  // 評価下落幅が大きい順
    .map(t => ({
      name:          t.name,
      area:          t.area,
      rating:        t.rating,
      delta:         t.ratingDelta,
      pct:           t.ratingDeltaPct,
      reviewsDelta:  t.reviewsDelta,
      googleMapsUrl: t.googleMapsUrl,
    }))
}

// ── バッチ検出 ─────────────────────────────────────────────────

type BatchInfo = {
  currentBatchStart: number   // 最新バッチの最古 timestamp (ms) — これ以前 = 前回バッチ
  latestBatchMin:    number   // 最新バッチの最古 timestamp (ms)
  latestBatchMax:    number   // 最新バッチの最新 timestamp (ms)
  prevBatchMin:      number   // 前回バッチの最古 timestamp (ms)
  prevBatchMax:      number   // 前回バッチの最新 timestamp (ms)
  totalBatches:      number
}

function toJST(ms: number): string {
  const d = new Date(ms + 9 * 60 * 60 * 1000)
  const yyyy = d.getUTCFullYear()
  const mm   = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd   = String(d.getUTCDate()).padStart(2, '0')
  const hh   = String(d.getUTCHours()).padStart(2, '0')
  const min  = String(d.getUTCMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min} JST`
}

/**
 * import-places は複数店舗を連続 insert するため captured_at がほぼ同時刻になる。
 * 1時間以上の空白をバッチ境界とみなし、最新バッチと前回バッチを特定する。
 *
 * @returns BatchInfo — バッチ2つ以上あった場合の詳細
 *          null     — バッチが1つしか存在しない場合（比較不能）
 */
function detectBatches(stores: StoreRow[]): BatchInfo | null {
  const GAP_MS = 60 * 60 * 1000  // 1 時間

  // 全スナップショットの captured_at を重複排除して昇順ソート
  const tsSet = new Set<number>()
  for (const store of stores) {
    for (const snap of store.store_snapshots) {
      tsSet.add(new Date(snap.captured_at).getTime())
    }
  }
  if (tsSet.size === 0) return null

  const sorted = [...tsSet].sort((a, b) => a - b)

  // バッチに分割（1時間以上の空白 = 新しいバッチ）
  const batches: number[][] = [[sorted[0]]]
  for (let i = 1; i < sorted.length; i++) {
    const last = batches[batches.length - 1]
    if (sorted[i] - last[last.length - 1] > GAP_MS) {
      batches.push([sorted[i]])
    } else {
      last.push(sorted[i])
    }
  }

  if (batches.length < 2) return null

  const latest = batches[batches.length - 1]
  const prev   = batches[batches.length - 2]

  return {
    currentBatchStart: latest[0],
    latestBatchMin:    latest[0],
    latestBatchMax:    latest[latest.length - 1],
    prevBatchMin:      prev[0],
    prevBatchMax:      prev[prev.length - 1],
    totalBatches:      batches.length,
  }
}

// ── 初ランクイン ───────────────────────────────────────────────

/**
 * 前回バッチのスナップショットだけで仮ランキングを再構築し、
 * 今回トップ100 に入っているが前回トップ100 にいなかった店舗を返す。
 *
 * 前回バッチが存在しない（スナップショット1回分のみ）場合は空配列を返す。
 */
export function buildNewEntries(
  stores: StoreRow[],
  currentRankings: StoreTrend[],
): NewEntry[] {
  const batchInfo = detectBatches(stores)

  console.log('[buildNewEntries] total batches detected:', batchInfo?.totalBatches ?? 1)
  if (batchInfo) {
    console.log('[buildNewEntries] latest batch :', toJST(batchInfo.latestBatchMin), '~', toJST(batchInfo.latestBatchMax))
    console.log('[buildNewEntries] previous batch:', toJST(batchInfo.prevBatchMin),   '~', toJST(batchInfo.prevBatchMax))
  } else {
    console.log('[buildNewEntries] only 1 batch found — new entry detection skipped')
    return []
  }

  const { currentBatchStart } = batchInfo

  // 前回バッチ以前のスナップショットだけ残す（= 前回バッチでの状態）
  const prevStores: StoreRow[] = stores
    .map(s => ({
      ...s,
      store_snapshots: s.store_snapshots.filter(
        snap => new Date(snap.captured_at).getTime() < currentBatchStart
      ),
    }))
    .filter(s => s.store_snapshots.length > 0)

  if (prevStores.length === 0) {
    console.log('[buildNewEntries] no stores found in previous batch')
    return []
  }

  // 前回ランキングを再構築
  const prevRankings = buildRankings(prevStores)
  const prevRankMap  = new Map<string, number>(prevRankings.map(r => [r.name, r.rank]))

  // 今回トップ100 に入っているが前回トップ100 圏外だった店舗
  const result = currentRankings
    .filter(curr => curr.rank <= 100)
    .filter(curr => {
      const prevRank = prevRankMap.get(curr.name)
      return prevRank === undefined || prevRank > 100
    })
    .map(curr => {
      const prevRank = prevRankMap.get(curr.name)
      return {
        name:          curr.name,
        area:          curr.area,
        rating:        curr.rating,
        googleMapsUrl: curr.googleMapsUrl,
        from:          prevRank !== undefined ? String(prevRank) : '−',
        to:            curr.rank,
      }
    })
    .slice(0, 20)

  console.log('[buildNewEntries] newEntries count:', result.length)
  return result
}
