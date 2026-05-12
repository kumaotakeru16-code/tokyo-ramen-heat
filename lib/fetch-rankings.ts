import { HOT_NOW } from '@/data/mockStores'
import type { StoreTrend } from './types'

// ── 戻り値の型 ────────────────────────────────────────────────

export type DataSource = 'supabase' | 'mock'

export type FetchRankingsResult = {
  data: StoreTrend[]
  source: DataSource
}

// ── Supabase 設定チェック ──────────────────────────────────────

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

// ── メイン関数 ────────────────────────────────────────────────

/**
 * Supabase からランキングを取得する。サーバーコンポーネント専用。
 *
 * ┌──────────────────────────────────────────────────────┐
 * │ 状態                   │ 戻り値                       │
 * ├──────────────────────────────────────────────────────┤
 * │ 環境変数未設定          │ mock データ (source='mock')  │
 * │ 設定済み・データなし    │ 空配列 (source='supabase')   │ ← mock に落とさない
 * │ 設定済み・データあり    │ 実データ (source='supabase') │
 * │ 設定済み・ネットワーク等エラー │ mock データ (source='mock')  │
 * └──────────────────────────────────────────────────────┘
 */
export async function fetchHotNow(): Promise<FetchRankingsResult> {
  if (!isSupabaseConfigured()) {
    return { data: HOT_NOW, source: 'mock' }
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
      console.error('[fetchHotNow] Supabase error:', error.message)
      // 接続・認証エラーはモックにフォールバック
      return { data: HOT_NOW, source: 'mock' }
    }

    // Supabase が設定済みで stores テーブルが空 → 空配列を返す（モックに落とさない）
    if (!stores || stores.length === 0) {
      return { data: [], source: 'supabase' }
    }

    const { buildRankings } = await import('./build-rankings')
    const rankings = buildRankings(stores)

    // buildRankings が 0 件（スナップショットなし等）
    if (rankings.length === 0) {
      return { data: [], source: 'supabase' }
    }

    return { data: rankings.slice(0, 100), source: 'supabase' }
  } catch (err) {
    console.error('[fetchHotNow] Unexpected error:', err)
    return { data: HOT_NOW, source: 'mock' }
  }
}
