import { T, FONT_JP, FONT_NUM, FONT_DISP } from '@/lib/tokens'
import { TICKER_DATA } from '@/data/mockStores'

export default function LiveTicker() {
  const items = [...TICKER_DATA, ...TICKER_DATA, ...TICKER_DATA]

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
            animation: 'trhTicker 28s linear infinite',
            height: '100%',
            paddingLeft: 16,
          }}
        >
          {items.map((t, i) => (
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
