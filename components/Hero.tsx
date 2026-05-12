'use client'

import { T, FONT_JP, FONT_NUM, FONT_DISP } from '@/lib/tokens'
import { dict, type Lang } from '@/lib/i18n'
import FlameMark from './FlameMark'

interface HeroProps {
  tab:     'week' | 'month'
  setTab:  (t: 'week' | 'month') => void
  lang:    Lang
  setLang: (l: Lang) => void
}

function HeatTotalChip({ lang }: { lang: Lang }) {
  const t = dict[lang]
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 10,
        color: T.textMute,
        fontFamily: FONT_JP,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: 99,
          background: T.amber,
          boxShadow: `0 0 6px ${T.amber}`,
          animation: 'trhPulse 1.6s ease-in-out infinite',
          display: 'inline-block',
        }}
      />
      <span
        style={{ color: T.text, fontWeight: 700, fontFamily: FONT_NUM }}
      >
        {t.monitoring(284)}
      </span>
    </div>
  )
}

export default function Hero({ tab, setTab, lang, setLang }: HeroProps) {
  const t = dict[lang]

  const TABS: { k: 'week' | 'month'; label: string; sub: string }[] = [
    { k: 'week',  label: t.tabWeek,  sub: t.tabWeekSub  },
    { k: 'month', label: t.tabMonth, sub: t.tabMonthSub },
  ]

  const gradientStyle = {
    background: `linear-gradient(110deg, ${T.amber} 0%, ${T.emberHot} 50%, ${T.crimson} 100%)`,
    WebkitBackgroundClip: 'text' as const,
    backgroundClip: 'text' as const,
    color: 'transparent' as const,
  }

  return (
    <section style={{ position: 'relative', padding: '20px 18px 16px', overflow: 'hidden' }}>
      {/* radial glow */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 520,
          height: 520,
          pointerEvents: 'none',
          background: `radial-gradient(circle at center, ${T.emberGlow} 0%, transparent 55%)`,
          filter: 'blur(12px)',
        }}
      />

      {/* wordmark row */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* left: logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FlameMark size={18} />
          <div>
            <div
              style={{
                fontFamily: FONT_DISP,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 4,
                color: T.ember,
              }}
            >
              TOKYO RAMEN
            </div>
            <div
              style={{
                fontFamily: FONT_DISP,
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: 6,
                color: T.white,
                marginTop: -2,
              }}
            >
              HEAT
            </div>
          </div>
        </div>

        {/* right: lang toggle + updated */}
        <div style={{ textAlign: 'right' }}>
          {/* JP / EN toggle */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              marginBottom: 7,
              border: `1px solid ${T.inkLine}`,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            {(['jp', 'en'] as Lang[]).map((l, i) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: '3px 7px',
                  background: lang === l ? T.ink3 : 'transparent',
                  border: 'none',
                  borderRight: i === 0 ? `1px solid ${T.inkLine}` : 'none',
                  cursor: 'pointer',
                  fontFamily: FONT_DISP,
                  fontWeight: 800,
                  fontSize: 8,
                  letterSpacing: 1.5,
                  color: lang === l ? T.text : T.textGhost,
                  transition: 'color 0.2s',
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* updated */}
          <div
            style={{
              fontSize: 9,
              color: T.textFaint,
              fontFamily: FONT_NUM,
              letterSpacing: 1,
            }}
          >
            <div>UPDATED</div>
            <div style={{ color: T.textMute, fontWeight: 600 }}>2026.05.09 · 18:40 JST</div>
          </div>
        </div>
      </div>

      {/* headline copy */}
      <div style={{ position: 'relative', marginTop: 22 }}>
        <h1
          style={{
            margin: 0,
            fontFamily: FONT_JP,
            fontWeight: 900,
            fontSize: 34,
            lineHeight: 1.15,
            letterSpacing: -1,
            color: T.white,
          }}
        >
          {lang === 'jp' ? (
            <>
              {t.headLine1}
              <br />
              <span style={gradientStyle}>{t.headGrad}</span>
              <span>{t.headLine2}</span>
            </>
          ) : (
            <>
              {t.headLine1}
              <br />
              {t.headLine2}{' '}
              <span style={gradientStyle}>{t.headGrad}</span>
            </>
          )}
        </h1>
        <p
          style={{
            margin: '12px 0 0',
            fontSize: 12,
            lineHeight: 1.7,
            color: T.textMute,
            fontFamily: FONT_JP,
            maxWidth: 320,
            whiteSpace: 'pre-line',
          }}
        >
          {t.subcopy}
        </p>

        {/* SCORE chip */}
        <div
          style={{
            marginTop: 12,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 8px 4px 6px',
            background: 'transparent',
            border: `1px solid ${T.inkLine}`,
            borderRadius: 6,
            fontFamily: FONT_JP,
            fontSize: 10,
            color: T.textFaint,
            lineHeight: 1.3,
          }}
        >
          <span
            style={{
              fontFamily: FONT_DISP,
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: T.textFaint,
            }}
          >
            SCORE
          </span>
          <span style={{ color: T.textGhost }}>=</span>
          <span>{t.scoreChip.replace('SCORE = ', '')}</span>
        </div>
      </div>

      {/* tab + monitored count */}
      <div
        style={{
          position: 'relative',
          marginTop: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            padding: 3,
            borderRadius: 99,
            background: T.ink3,
            border: `1px solid ${T.inkLine}`,
          }}
        >
          {TABS.map(tb => (
            <button
              key={tb.k}
              onClick={() => setTab(tb.k)}
              style={{
                padding: '6px 14px 7px',
                borderRadius: 99,
                border: 'none',
                cursor: 'pointer',
                fontFamily: FONT_JP,
                fontWeight: 700,
                fontSize: 11,
                background: tab === tb.k ? T.ember : 'transparent',
                color: tab === tb.k ? '#fff' : T.textMute,
                boxShadow: tab === tb.k ? `0 6px 16px -6px ${T.emberGlow}` : 'none',
                letterSpacing: 1,
                transition: 'all 0.25s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                lineHeight: 1.1,
              }}
            >
              <span>{tb.label}</span>
              <span
                style={{
                  fontSize: 8,
                  letterSpacing: 0.5,
                  fontWeight: 600,
                  color: tab === tb.k ? 'rgba(255,255,255,0.78)' : T.textGhost,
                  marginTop: 1,
                }}
              >
                {tb.sub}
              </span>
            </button>
          ))}
        </div>

        <HeatTotalChip lang={lang} />
      </div>
    </section>
  )
}
