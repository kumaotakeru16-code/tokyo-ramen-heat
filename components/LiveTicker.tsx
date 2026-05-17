import { T, FONT_JP, FONT_NUM, FONT_DISP } from '@/lib/tokens'
import type { StoreTrend } from '@/lib/types'

interface LiveTickerProps {
  items: StoreTrend[]
}

function buildTickerItems(items: StoreTrend[]) {
  const result: { rank: number | string; name: string; delta: string }[] = []

  // レビュー増加あり
  const withDelta = items.filter(t => !t.isInitialSnapshot && t.reviewsDelta > 0).slice(0, 6)
  for (const it of withDelta) {
    result.push({ rank: it.rank, name: it.name, delta: `+${it.reviewsDelta} reviews` })
  }

  // 評価上昇
  const ratingUp = items.filter(t => !t.isInitialSnapshot && t.ratingDelta > 0).slice(0, 3)
  for (const it of ratingUp) {
    result.push({ rank: '↑', name: it.name, delta: `+${it.ratingDelta.toFixed(1)} ★` })
  }

  // デルタデータなし（初回インポート直後）→ レビュー件数で表示
  if (result.length === 0) {
    for (const it of items.slice(0, 5)) {
      result.push({ rank: it.rank, name: it.name, delta: `${it.reviewCount.toLocaleString()} reviews` })
    }
  }

  return result
}

export default function LiveTicker({ items }: LiveTickerProps) {
  const base    = buildTickerItems(items)
  const display = base.length > 0 ? [...base, ...base, ...base] : []

  return (
    <div
      style={{
        borderBottom: `1px solid ${T.inkLine}`,
        background: T.ink2,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        height: 30,
        position: 'sticky',
        top: 0,
        zIndex: 30,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* LIVE dot */}
      <div
        style={{
          flexShrink: 0,
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          borderRight: `1px solid ${T.inkLine}`,
          height: '100%',
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: 99,
            background: T.crimson,
            boxShadow: `0 0 8px ${T.crimson}`,
            animation: 'trhPulse 1.4s ease-in-out infinite',
          }}
        />
        <span
          style={{
            fontFamily: FONT_DISP,
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 2,
            color: T.crimson,
          }}
        >
          LIVE
        </span>
      </div>

      {/* scrolling row */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%' }}>
        <div
          style={{
            display: 'flex',
            gap: 24,
            alignItems: 'center',
            whiteSpace: 'nowrap',
            animation: display.length > 0 ? 'trhTicker 28s linear infinite' : 'none',
            height: '100%',
            paddingLeft: 16,
          }}
        >
          {display.map((t, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 10,
                fontFamily: FONT_JP,
                color: T.textMute,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_NUM,
                  fontSize: 9,
                  fontWeight: 800,
                  color: T.ember,
                  padding: '1px 5px',
                  borderRadius: 3,
                  background: T.emberSurf,
                  border: `1px solid ${T.emberLine}`,
                  letterSpacing: 0.5,
                }}
              >
                {typeof t.rank === 'number' ? `#${t.rank}` : t.rank}
              </span>
              <span style={{ color: T.text, fontWeight: 600 }}>{t.name}</span>
              <span style={{ color: T.amber, fontFamily: FONT_NUM, fontWeight: 700 }}>
                {t.delta}
              </span>
              <span style={{ color: T.textGhost, padding: '0 4px' }}>·</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
