import { HOT_NOW, NEW_ENTRIES, RATING_MOVERS, FALLING_WATCH } from '@/data/mockStores'
import type { StoreTrend, FallingStore, RatingMover, NewEntry } from './types'

// ── 戻り値の型 ────────────────────────────────────────────────

export type DataSource = 'supabase' | 'mock'

export type FetchRankingsResult = {
  data: StoreTrend[]
  source: DataSource
}

export type AllDataResult = {
  hotNow:       StoreTrend[]
  ratingMovers: RatingMover[]
  fallingWatch: FallingStore[]
  newEntries:   NewEntry[]
  lastUpdated:  string | null
  storeCount:   number
  source:       DataSource
}

// ── Supabase 設定チェック ──────────────────────────────────────

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

// ── 後方互換: admin ページなどが fetchHotNow() を使用 ─────────

export async function fetchHotNow(): Promise<FetchRankingsResult> {
  const result = await fetchAllData()
  return { data: result.hotNow, source: result.source }
}

// ── メイン: 全カテゴリ + メタデータを返す ─────────────────────

/**
 * ┌────────────────────────────────────────────────────────────────┐
 * │ 状態                        │ 戻り値                           │
 * ├────────────────────────────────────────────────────────────────┤
 * │ 環境変数未設定               │ mock データ (source='mock')       │
 * │ 設定済み・データなし          │ 空配列 (source='supabase')        │
 * │ 設定済み・データあり          │ 実データ (source='supabase')      │
 * │ 設定済み・エラー             │ mock データ (source='mock')       │
 * └────────────────────────────────────────────────────────────────┘
 */
export async function fetchAllData(): Promise<AllDataResult> {
  if (!isSupabaseConfigured()) {
    return {
      hotNow:       HOT_NOW,
      ratingMovers: RATING_MOVERS,
      fallingWatch: FALLING_WATCH,
      newEntries:   NEW_ENTRIES,
      lastUpdated:  null,
      storeCount:   HOT_NOW.length,
      source:       'mock',
    }
  }

  try {
    const { createAdminClient } = await import('./supabase/server')
    const supabase = createAdminClient()

    const { data: stores, error } = await supabase
      .from('stores')
      .select(
        `id, name, area, google_maps_url,
         store_snapshots ( rating, review_count, captured_at )`
      )

    if (error) {
      console.error('[fetchAllData] Supabase error:', error.message)
      return {
        hotNow:       HOT_NOW,
        ratingMovers: RATING_MOVERS,
        fallingWatch: FALLING_WATCH,
        newEntries:   NEW_ENTRIES,
        lastUpdated:  null,
        storeCount:   HOT_NOW.length,
        source:       'mock',
      }
    }

    if (!stores || stores.length === 0) {
      return {
        hotNow: [], ratingMovers: [], fallingWatch: [],
        newEntries: [], lastUpdated: null, storeCount: 0, source: 'supabase',
      }
    }

    // 最新 captured_at を全スナップショットから取得
    let lastUpdated: string | null = null
    for (const store of stores) {
      for (const snap of (store.store_snapshots as { captured_at: string }[])) {
        if (!lastUpdated || snap.captured_at > lastUpdated) {
          lastUpdated = snap.captured_at
        }
      }
    }

    const { buildRankings, buildRatingMovers, buildFallingWatch, buildNewEntries } = await import('./build-rankings')
    const rankings = buildRankings(stores)

    if (rankings.length === 0) {
      return {
        hotNow: [], ratingMovers: [], fallingWatch: [],
        newEntries: [], lastUpdated, storeCount: stores.length, source: 'supabase',
      }
    }

    const hotNow       = rankings.slice(0, 100)
    const ratingMovers = buildRatingMovers(hotNow)
    const fallingWatch = buildFallingWatch(hotNow)
    const newEntries   = buildNewEntries(stores, hotNow)

    console.log('[fetchAllData] fallingWatch count:', fallingWatch.length)
    console.log('[fetchAllData] newEntries count   :', newEntries.length)

    return {
      hotNow,
      ratingMovers,
      fallingWatch,
      newEntries,
      lastUpdated,
      storeCount: stores.length,
      source:     'supabase',
    }
  } catch (err) {
    console.error('[fetchAllData] Unexpected error:', err)
    return {
      hotNow:       HOT_NOW,
      ratingMovers: RATING_MOVERS,
      fallingWatch: FALLING_WATCH,
      newEntries:   NEW_ENTRIES,
      lastUpdated:  null,
      storeCount:   HOT_NOW.length,
      source:       'mock',
    }
  }
}
