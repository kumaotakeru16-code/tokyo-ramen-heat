import { T, FONT_DISP, FONT_JP, FONT_NUM } from '@/lib/tokens'
import { isSupabaseConfigured, createAdminClient } from '@/lib/supabase/server'
import { fetchHotNow } from '@/lib/fetch-rankings'
import { EXCLUDED_IDS } from '@/lib/excluded-users'
import AdminShell from './AdminShell'
import PostingPanel from './PostingPanel'
import MyIdBanner from './MyIdBanner'

// ── 期間 ──────────────────────────────────────────────────────

type Period = 'today' | '7d' | '30d' | 'all'
const VALID_PERIODS: Period[] = ['today', '7d', '30d', 'all']
const PERIOD_LABELS: Record<Period, string> = {
  today: 'Today',
  '7d':  '7 Days',
  '30d': '30 Days',
  all:   'All Time',
}

function getStartDate(period: Period): Date | null {
  switch (period) {
    case 'today': {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      return d
    }
    case '7d':  return new Date(Date.now() - 7  * 86_400_000)
    case '30d': return new Date(Date.now() - 30 * 86_400_000)
    case 'all': return null
  }
}

// ── 型 ────────────────────────────────────────────────────────

interface AEvent {
  anon_user_id: string
  event_name:   string
  language:     string | null
  category:     string | null
  store_name:   string | null
  area:         string | null
  metadata:     Record<string, unknown>
  created_at:   string
}

// ── 指標計算 ──────────────────────────────────────────────────

function computeMetrics(events: AEvent[]) {
  const pv      = events.filter(e => e.event_name === 'page_view')
  const maps    = events.filter(e => e.event_name === 'google_maps_click')
  const catEvts = events.filter(e => e.event_name === 'category_view')

  const pvCount     = pv.length
  const uniqueUsers = new Set(pv.map(e => e.anon_user_id)).size
  const mapsClicks  = maps.length
  const ctr         = pvCount > 0 ? (mapsClicks / pvCount * 100) : 0

  const userDays = new Map<string, Set<string>>()
  for (const e of pv) {
    const day = e.created_at.slice(0, 10)
    if (!userDays.has(e.anon_user_id)) userDays.set(e.anon_user_id, new Set())
    userDays.get(e.anon_user_id)!.add(day)
  }
  const returningUsers = [...userDays.values()].filter(s => s.size >= 2).length

  const jpPv   = pv.filter(e => e.language === 'jp').length
  const enPv   = pv.filter(e => e.language === 'en').length
  const jpMaps = maps.filter(e => e.language === 'jp').length
  const enMaps = maps.filter(e => e.language === 'en').length

  const catMap = new Map<string, number>()
  for (const e of catEvts) {
    const k = e.category ?? 'unknown'
    catMap.set(k, (catMap.get(k) ?? 0) + 1)
  }
  const categoryRanking = [...catMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([cat, views]) => ({ cat, views }))

  const storeMap = new Map<string, { store_name: string; area: string; category: string; count: number }>()
  for (const e of maps) {
    const key = e.store_name ?? '−'
    if (!storeMap.has(key)) {
      storeMap.set(key, {
        store_name: e.store_name ?? '−',
        area:       e.area       ?? '−',
        category:   e.category   ?? '−',
        count:      0,
      })
    }
    storeMap.get(key)!.count++
  }
  const storeRanking = [...storeMap.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)

  return {
    pvCount, uniqueUsers, returningUsers, mapsClicks, ctr,
    jpPv, enPv, jpMaps, enMaps,
    categoryRanking, storeRanking,
  }
}

// ── カテゴリ表示名 ────────────────────────────────────────────

const CAT_LABEL: Record<string, string> = {
  hot:  '急上昇 / Trending',
  new:  '初ランクイン / New Entries',
  up:   '評価急上昇 / Rating Movers',
  down: '急落ウォッチ / Watch List',
}

// ── UI parts ─────────────────────────────────────────────────

function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{
      padding: '14px 16px 16px',
      background: T.ink2, border: `1px solid ${T.inkLine}`, borderRadius: 12,
    }}>
      <div style={{
        fontFamily: FONT_DISP, fontSize: 8, fontWeight: 800,
        letterSpacing: 2, color: T.textFaint, marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: FONT_NUM, fontWeight: 900, fontSize: 30,
        color: T.white, letterSpacing: -1, fontVariantNumeric: 'tabular-nums', lineHeight: 1,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ marginTop: 5, fontFamily: FONT_JP, fontSize: 10, color: T.textGhost }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: FONT_DISP, fontSize: 9, fontWeight: 800,
      letterSpacing: 3, color: T.ember, marginBottom: 12, marginTop: 32,
    }}>
      {children}
    </div>
  )
}

// ── メインページ ──────────────────────────────────────────────

interface AdminPageProps {
  searchParams: Promise<{ secret?: string; period?: string }>
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params      = await searchParams
  const secret      = params.secret ?? ''
  const adminSecret = process.env.ADMIN_SECRET ?? ''

  if (!adminSecret || secret !== adminSecret) {
    return (
      <div style={{
        minHeight: '100vh', background: T.ink,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT_DISP, fontSize: 12, color: T.textFaint, letterSpacing: 2,
      }}>
        403 UNAUTHORIZED
      </div>
    )
  }

  const rawPeriod = params.period
  const period: Period = VALID_PERIODS.includes(rawPeriod as Period) ? (rawPeriod as Period) : '7d'
  const startDate     = getStartDate(period)

  // ── Analytics query
  let events: AEvent[] = []
  let fetchError = false

  if (!isSupabaseConfigured()) {
    fetchError = true
  } else {
    try {
      const supabase = createAdminClient()
      let q = supabase
        .from('analytics_events')
        .select('anon_user_id, event_name, language, category, store_name, area, metadata, created_at')
        .order('created_at', { ascending: false })
        .limit(50_000)
      if (startDate) q = q.gte('created_at', startDate.toISOString())
      const { data, error } = await q
      if (error) throw error
      events = (data ?? []) as AEvent[]
    } catch {
      fetchError = true
    }
  }

  const filteredEvents  = EXCLUDED_IDS.size > 0
    ? events.filter(e => !EXCLUDED_IDS.has(e.anon_user_id))
    : events
  const excludedCount = events.length - filteredEvents.length

  const m = computeMetrics(filteredEvents)

  // ── Posting data
  const { data: hotNow } = await fetchHotNow()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tokyo-ramen-heat.vercel.app'

  // ── Period nav
  const navUrl = (p: Period) => `?secret=${encodeURIComponent(secret)}&period=${p}`

  // ── Table styles (defined here to stay in scope for analytics JSX)
  const th: React.CSSProperties = {
    padding: '8px 12px', fontFamily: FONT_DISP, fontSize: 8,
    fontWeight: 800, letterSpacing: 2, color: T.textFaint,
    textAlign: 'left', borderBottom: `1px solid ${T.inkLine}`, background: T.ink2,
  }
  const td: React.CSSProperties = {
    padding: '10px 12px', fontFamily: FONT_JP, fontSize: 12,
    color: T.textMute, borderBottom: `1px solid ${T.inkLineSft}`,
  }
  const tdNum: React.CSSProperties = {
    padding: '10px 12px', fontFamily: FONT_NUM, fontSize: 13,
    fontWeight: 700, color: T.white, fontVariantNumeric: 'tabular-nums',
    borderBottom: `1px solid ${T.inkLineSft}`,
  }
  const tableStyle: React.CSSProperties = {
    width: '100%', borderCollapse: 'collapse',
    border: `1px solid ${T.inkLine}`, borderRadius: 12, overflow: 'hidden',
  }

  // ── Analytics content (server-rendered, passed to AdminShell as ReactNode)
  const analyticsContent = (
    <div>

      {/* Supabase error */}
      {fetchError && (
        <div style={{
          padding: '16px 18px', background: T.ink2,
          border: `1px solid ${T.inkLine}`, borderRadius: 12,
          fontFamily: FONT_JP, fontSize: 12, color: T.textMute, marginBottom: 24,
        }}>
          {isSupabaseConfigured()
            ? '⚠ Supabase query failed. Check your connection.'
            : '⚠ Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local to enable analytics.'}
        </div>
      )}

      {/* Period filter */}
      <div style={{
        display: 'inline-flex', border: `1px solid ${T.inkLine}`,
        borderRadius: 8, overflow: 'hidden', marginBottom: 28,
      }}>
        {VALID_PERIODS.map((p, i) => (
          <a
            key={p}
            href={navUrl(p)}
            style={{
              padding: '7px 16px', fontFamily: FONT_DISP, fontSize: 9,
              fontWeight: 800, letterSpacing: 1.5,
              color:      period === p ? T.white : T.textGhost,
              background: period === p ? T.ink3  : 'transparent',
              borderRight: i < VALID_PERIODS.length - 1 ? `1px solid ${T.inkLine}` : 'none',
              textDecoration: 'none', display: 'block',
            }}
          >
            {PERIOD_LABELS[p]}
          </a>
        ))}
      </div>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
        <KpiCard label="PAGE VIEWS"   value={m.pvCount.toLocaleString()} />
        <KpiCard label="UNIQUE USERS" value={m.uniqueUsers.toLocaleString()} />
        <KpiCard label="RETURNING"    value={m.returningUsers.toLocaleString()} sub="2+ visit days" />
        <KpiCard label="MAPS CLICKS"  value={m.mapsClicks.toLocaleString()} />
        <KpiCard label="MAPS CTR"     value={`${m.ctr.toFixed(1)}%`} sub="clicks / page views" />
        <KpiCard label="JP VIEWS"     value={m.jpPv.toLocaleString()} />
        <KpiCard label="EN VIEWS"     value={m.enPv.toLocaleString()} />
      </div>

      {/* Category views */}
      <SectionTitle>CATEGORY VIEWS</SectionTitle>
      {m.categoryRanking.length === 0 ? (
        <div style={{ color: T.textGhost, fontFamily: FONT_JP, fontSize: 12 }}>No data</div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={th}>CATEGORY</th>
              <th style={{ ...th, textAlign: 'right' }}>VIEWS</th>
            </tr>
          </thead>
          <tbody>
            {m.categoryRanking.map(row => (
              <tr key={row.cat}>
                <td style={td}>{CAT_LABEL[row.cat] ?? row.cat}</td>
                <td style={{ ...tdNum, textAlign: 'right' }}>{row.views.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Store click ranking */}
      <SectionTitle>STORE CLICK RANKING</SectionTitle>
      {m.storeRanking.length === 0 ? (
        <div style={{ color: T.textGhost, fontFamily: FONT_JP, fontSize: 12 }}>No data</div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...th, width: 32 }}>#</th>
              <th style={th}>STORE</th>
              <th style={th}>AREA</th>
              <th style={th}>CATEGORY</th>
              <th style={{ ...th, textAlign: 'right' }}>CLICKS</th>
            </tr>
          </thead>
          <tbody>
            {m.storeRanking.map((row, i) => (
              <tr key={row.store_name}>
                <td style={{ ...tdNum, color: T.textFaint, fontSize: 11 }}>{i + 1}</td>
                <td style={td}>{row.store_name}</td>
                <td style={{ ...td, color: T.textGhost }}>{row.area}</td>
                <td style={{ ...td, color: T.textGhost }}>{CAT_LABEL[row.category] ?? row.category}</td>
                <td style={{ ...tdNum, textAlign: 'right', color: T.amber }}>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Language breakdown */}
      <SectionTitle>LANGUAGE BREAKDOWN</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
        <KpiCard label="JP PAGE VIEWS"  value={m.jpPv.toLocaleString()} />
        <KpiCard label="EN PAGE VIEWS"  value={m.enPv.toLocaleString()} />
        <KpiCard label="JP MAPS CLICKS" value={m.jpMaps.toLocaleString()} />
        <KpiCard label="EN MAPS CLICKS" value={m.enMaps.toLocaleString()} />
      </div>

      {/* Your anon ID */}
      <SectionTitle>YOUR ANON ID</SectionTitle>
      <MyIdBanner excludedIds={[...EXCLUDED_IDS]} />

      {/* Footer */}
      <div style={{
        marginTop: 48, paddingTop: 16, borderTop: `1px solid ${T.inkLine}`,
        fontFamily: FONT_DISP, fontSize: 8, color: T.textGhost, letterSpacing: 1,
      }}>
        TOKYO RAMEN HEAT ADMIN · {new Date().toISOString().slice(0, 10)}
        {' · '}{filteredEvents.length.toLocaleString()} events
        {excludedCount > 0 && ` · ${excludedCount.toLocaleString()} excluded`}
      </div>

    </div>
  )

  return (
    <div style={{
      minHeight:  '100vh',
      background: T.ink,
      color:      T.text,
      fontFamily: FONT_JP,
      padding:    '24px 24px 64px',
      maxWidth:   960,
      margin:     '0 auto',
    }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{
            fontFamily: FONT_DISP, fontSize: 8, fontWeight: 800,
            letterSpacing: 4, color: T.ember, marginBottom: 4,
          }}>
            TOKYO RAMEN HEAT
          </div>
          <div style={{ fontFamily: FONT_DISP, fontSize: 20, fontWeight: 900, letterSpacing: 2, color: T.white }}>
            ADMIN
          </div>
        </div>
        <a
          href="/"
          style={{
            fontFamily: FONT_DISP, fontSize: 9, fontWeight: 700,
            letterSpacing: 1.5, color: T.textFaint, textDecoration: 'none',
            border: `1px solid ${T.inkLine}`, padding: '6px 12px', borderRadius: 6,
          }}
        >
          ← APP
        </a>
      </div>

      {/* ── Tabs ────────────────────────────────────────────── */}
      <AdminShell
        analytics={analyticsContent}
        posting={<PostingPanel items={hotNow.slice(0, 3)} siteUrl={siteUrl} />}
      />

    </div>
  )
}
