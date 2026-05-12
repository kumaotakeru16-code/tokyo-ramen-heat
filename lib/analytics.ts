'use client'

// ── クライアント側軽量アナリティクス ──────────────────────────
// Supabase は触らない。/api/analytics/track にPOSTしてサーバー側でinsert。
// 失敗してもUXを壊さない。開発中は console で失敗理由が見える。

export interface TrackPayload {
  event_name: string
  path?: string
  language?: string
  category?: string
  store_id?: string
  store_name?: string
  area?: string
  metadata?: Record<string, unknown>
}

const DEV = process.env.NODE_ENV === 'development'

// localStorage + crypto.randomUUID を安全に使う
// 取得できなければ 'anonymous' を返すだけで、fetch は止めない
function getAnonUserId(): string {
  try {
    let id = localStorage.getItem('trh_anon_user_id')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('trh_anon_user_id', id)
    }
    return id
  } catch (err) {
    if (DEV) console.warn('[TRH] getAnonUserId failed (localStorage/crypto unavailable):', err)
    return 'anonymous'
  }
}

export function track(payload: TrackPayload): void {
  // サーバーサイドレンダリング中は実行しない
  if (typeof window === 'undefined') return

  const anon_user_id = getAnonUserId()

  if (DEV) {
    console.log(`[TRH] ▶ track(${payload.event_name})`, payload)
  }

  // JSON化に失敗するとしたら metadata に循環参照がある場合のみ
  let body: string
  try {
    body = JSON.stringify({ ...payload, anon_user_id })
  } catch (err) {
    if (DEV) console.warn('[TRH] JSON.stringify failed:', err, payload)
    return
  }

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
    .then(async res => {
      if (DEV) {
        if (res.ok) {
          console.log(`[TRH] ✓ ${payload.event_name}`)
        } else {
          // 失敗時は API からのエラー詳細も表示する
          const resBody = await res.json().catch(() => null)
          console.warn(`[TRH] ✗ ${payload.event_name} — HTTP ${res.status}`, resBody)
        }
      }
    })
    .catch(err => {
      if (DEV) console.warn(`[TRH] ✗ ${payload.event_name} — network error:`, err)
    })
}
