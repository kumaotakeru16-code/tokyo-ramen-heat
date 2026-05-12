import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured, createAdminClient } from '@/lib/supabase/server'

const ALLOWED_EVENTS = new Set([
  'page_view',
  'language_change',
  'category_view',
  'google_maps_click',
  'expand_ranking',
  'collapse_ranking',
])

const DEV = process.env.NODE_ENV === 'development'

export async function POST(req: NextRequest) {
  // ── 開発中: 環境変数の存在だけ確認（値は絶対にログしない）
  if (DEV) {
    console.log('[analytics/track] env:', {
      SUPABASE_URL_SET:        !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SERVICE_ROLE_KEY_SET:    !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    })
  }

  // ── JSON parse
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  // ── バリデーション
  if (!body.anon_user_id || typeof body.anon_user_id !== 'string') {
    if (DEV) console.error('[analytics/track] missing anon_user_id')
    return NextResponse.json({ ok: false, error: 'missing_anon_user_id' }, { status: 400 })
  }
  if (!body.event_name || !ALLOWED_EVENTS.has(body.event_name as string)) {
    if (DEV) console.error('[analytics/track] invalid event_name:', body.event_name)
    return NextResponse.json({ ok: false, error: 'invalid_event_name' }, { status: 400 })
  }

  // ── Supabase 未設定チェック
  if (!isSupabaseConfigured()) {
    if (DEV) {
      console.error(
        '[analytics/track] Supabase not configured.\n' +
        '  → NEXT_PUBLIC_SUPABASE_URL:   ' + (process.env.NEXT_PUBLIC_SUPABASE_URL   ? '✓ set' : '✗ missing') + '\n' +
        '  → SUPABASE_SERVICE_ROLE_KEY:  ' + (process.env.SUPABASE_SERVICE_ROLE_KEY  ? '✓ set' : '✗ missing')
      )
    }
    return NextResponse.json({ ok: false, error: 'supabase_not_configured' }, { status: 503 })
  }

  // ── Supabase insert（結果を必ず確認する）
  const supabase = createAdminClient()
  const { error } = await supabase.from('analytics_events').insert({
    anon_user_id: String(body.anon_user_id).slice(0, 64),
    event_name:   body.event_name,
    path:         body.path       ?? null,
    language:     body.language   ?? null,
    category:     body.category   ?? null,
    store_id:     body.store_id   ?? null,
    store_name:   body.store_name ?? null,
    area:         body.area       ?? null,
    metadata:     body.metadata   ?? {},
  })

  if (error) {
    // insert 失敗: 必ずログを出して 500 を返す
    console.error('[analytics/track] insert failed:', {
      message: error.message,
      code:    error.code,
      details: error.details,
      hint:    error.hint,
    })
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  if (DEV) console.log(`[analytics/track] inserted: ${body.event_name as string}`)

  return NextResponse.json({ ok: true, inserted: true })
}
