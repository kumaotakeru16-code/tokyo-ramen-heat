import { T, FONT_JP, FONT_NUM, FONT_DISP, FONT_STORE } from '@/lib/tokens'
import { dict, type Lang } from '@/lib/i18n'
import { formatArea } from '@/lib/area-en'
import { track } from '@/lib/analytics'
import type { StoreTrend } from '@/lib/types'
import Stars from './Stars'
import Sparkline from './Sparkline'
import MapPin from './MapPin'

interface RankRowProps {
  item:      StoreTrend
  lang:      Lang
  category?: string
}

export default function RankRow({ item, lang, category = 'hot' }: RankRowProps) {
  const t      = dict[lang]
  const isDown = item.ratingDelta < 0
  const accent = isDown ? T.ice : T.ember
  const surf   = isDown ? T.iceSurf : T.emberSurf

  return (
    <article
      style={{
        display: 'grid',
        gridTemplateColumns: '28px 1fr auto',
        gap: 12,
        alignItems: 'flex-start',
        padding: '16px 16px',
        borderBottom: `1px solid ${T.inkLineSft}`,
        position: 'relative',
      }}
    >
      {/* rank */}
      <div
        style={{
          fontFamily: FONT_NUM,
          fontWeight: 800,
          fontSize: 20,
          color: T.textMute,
          letterSpacing: -0.5,
          lineHeight: 1.1,
          fontVariantNumeric: 'tabular-nums',
          paddingTop: 2,
        }}
      >
        {String(item.rank).padStart(2, '0')}
      </div>

      {/* name + meta */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <h3
            style={{
              margin: 0,
              fontFamily: FONT_STORE,
              fontWeight: 800,
              fontSize: 15,
              color: T.white,
              letterSpacing: -0.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.name}
          </h3>
          {item.badge === 'NEW' && (
            <span
              style={{
                fontSize: 8,
                fontFamily: FONT_DISP,
                fontWeight: 800,
                letterSpacing: 1,
                padding: '1px 5px',
                borderRadius: 3,
                background: T.crimson,
                color: '#fff',
              }}
            >
              NEW
            </span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            fontSize: 10,
            color: T.textFaint,
            fontFamily: FONT_JP,
            flexWrap: 'wrap',
          }}
        >
          <span>{formatArea(item.area, lang)}</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <Stars value={item.rating} size={8} />
            <span
              style={{
                fontFamily: FONT_NUM,
                color: T.textMute,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {item.rating.toFixed(1)}
            </span>
          </span>
          {!item.isInitialSnapshot && item.ratingDelta !== 0 && (
            <span
              style={{
                fontFamily: FONT_NUM,
                fontWeight: 700,
                color: isDown ? T.ice : T.amber,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {item.ratingDelta > 0 ? '+' : ''}{item.ratingDelta.toFixed(1)}
            </span>
          )}
        </div>

        {item.note && (
          <div
            style={{
              marginTop: 5,
              fontSize: 9.5,
              color: T.amber,
              fontFamily: FONT_JP,
              lineHeight: 1.3,
            }}
          >
            ⚠ {lang === 'en' && item.noteEn ? item.noteEn : item.note}
          </div>
        )}

        <a
          href={item.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track({
            event_name: 'google_maps_click',
            language: lang,
            category,
            store_name: item.name,
            area: item.area,
            metadata: {
              ranking_position: item.rank,
              reviews_delta: item.reviewsDelta,
              rating: item.rating,
              trend_score: item.trendScore,
            },
          })}
          style={{
            marginTop: 6,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 10,
            fontFamily: FONT_JP,
            fontWeight: 700,
            color: T.ember,
            textDecoration: 'none',
          }}
        >
          <MapPin /> {t.mapsLinkShort}{' '}
          <span style={{ fontFamily: FONT_NUM, opacity: 0.7 }}>→</span>
        </a>
      </div>

      {/* right: reviews delta + spark + score */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 2,
          paddingTop: 2,
        }}
      >
        <div
          style={{
            fontSize: 8,
            fontFamily: FONT_DISP,
            letterSpacing: 1.5,
            fontWeight: 700,
            color: T.textFaint,
          }}
        >
          {item.isInitialSnapshot ? t.rankInitLabel : t.rankWeekLabel}
        </div>

        {item.isInitialSnapshot ? (
          <div
            style={{
              fontFamily: FONT_JP,
              fontSize: 11,
              color: T.textGhost,
              fontWeight: 600,
              lineHeight: 1.4,
              textAlign: 'right',
              paddingTop: 2,
            }}
          >
            --<br />
            <span style={{ fontSize: 9 }}>{t.rankInitNext}</span>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 1,
              fontFamily: FONT_NUM,
              fontWeight: 900,
              color: isDown ? T.ice : T.white,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: -0.5,
              textShadow: isDown ? 'none' : `0 0 10px ${T.emberGlow}`,
            }}
          >
            <span style={{ fontSize: 14, color: isDown ? T.ice : T.crimson }}>
              {isDown ? '' : '+'}
            </span>
            <span style={{ fontSize: 22 }}>{item.reviewsDelta}</span>
          </div>
        )}

        <Sparkline
          data={item.spark}
          w={70}
          h={16}
          stroke={item.isInitialSnapshot ? T.inkLine : accent}
        />
        <div
          style={{
            marginTop: 3,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 7px',
            borderRadius: 99,
            background: surf,
            border: `1px solid ${isDown ? T.iceLine : T.emberLine}`,
            fontSize: 9,
            fontFamily: FONT_DISP,
            fontWeight: 700,
            letterSpacing: 1,
            color: T.textMute,
          }}
        >
          <span>SCORE</span>
          <span
            style={{
              fontFamily: FONT_NUM,
              fontWeight: 800,
              fontSize: 11,
              color: isDown ? T.ice : T.amber,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: 0,
            }}
          >
            {item.trendScore}
          </span>
        </div>
      </div>
    </article>
  )
}
