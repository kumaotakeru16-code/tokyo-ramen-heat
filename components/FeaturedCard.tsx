import { T, FONT_JP, FONT_NUM, FONT_DISP, FONT_STORE } from '@/lib/tokens'
import { dict, type Lang } from '@/lib/i18n'
import { formatArea } from '@/lib/area-en'
import { track } from '@/lib/analytics'
import type { StoreTrend } from '@/lib/types'
import Stars from './Stars'
import Sparkline from './Sparkline'
import MapPin from './MapPin'

interface FeaturedCardProps {
  item: StoreTrend
  lang: Lang
}

export default function FeaturedCard({ item, lang }: FeaturedCardProps) {
  const t = dict[lang]

  return (
    <article
      style={{
        position: 'relative',
        margin: '0 18px',
        padding: '16px 18px 14px',
        borderRadius: 16,
        overflow: 'hidden',
        background: `linear-gradient(160deg, #160806 0%, ${T.ink2} 70%)`,
        border: `1px solid ${T.emberLine}`,
        boxShadow: `0 18px 40px -22px rgba(255,69,33,0.35)`,
      }}
    >
      {/* TOP MOVER badge */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 7px 2px 5px',
          borderRadius: 3,
          background: T.emberSurf,
          border: `1px solid ${T.emberLine}`,
          fontFamily: FONT_DISP,
          fontWeight: 800,
          fontSize: 8,
          letterSpacing: 1.5,
          color: T.amber,
        }}
      >
        <span
          style={{
            width: 4,
            height: 4,
            borderRadius: 99,
            background: T.crimson,
            boxShadow: `0 0 6px ${T.crimson}`,
          }}
        />
        TOP MOVER
      </div>

      {/* rank + name */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div
          style={{
            fontFamily: FONT_NUM,
            fontWeight: 900,
            fontSize: 36,
            lineHeight: 1,
            letterSpacing: -1.5,
            color: T.amber,
            fontVariantNumeric: 'tabular-nums',
            minWidth: 44,
          }}
        >
          {String(item.rank).padStart(2, '0')}
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
          <div
            style={{
              fontSize: 10,
              fontFamily: FONT_JP,
              fontWeight: 600,
              color: T.amber,
              marginBottom: 3,
              letterSpacing: 0.5,
            }}
          >
            {formatArea(item.area, lang)}
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: FONT_STORE,
              fontWeight: 800,
              fontSize: 24,
              letterSpacing: -0.5,
              lineHeight: 1.1,
              color: T.white,
            }}
          >
            {item.name}
          </h2>
        </div>
      </div>

      {/* hero number — reviews delta */}
      <div
        style={{
          position: 'relative',
          marginTop: 16,
          padding: '14px 16px 12px',
          background: `linear-gradient(135deg, rgba(255,69,33,0.18) 0%, rgba(255,69,33,0.04) 100%)`,
          border: `1px solid ${T.emberLine}`,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            fontSize: 9,
            fontFamily: FONT_DISP,
            letterSpacing: 2,
            fontWeight: 700,
          }}
        >
          <span style={{ color: T.amber }}>{t.featWeekLabel}</span>
          <span style={{ color: T.textFaint }}>{t.feat7days}</span>
        </div>

        {item.isInitialSnapshot ? (
          <div
            style={{
              marginTop: 10,
              padding: '10px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: FONT_JP,
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.textMute,
                  lineHeight: 1.6,
                }}
              >
                {t.featInitTitle}
              </div>
              <div
                style={{
                  fontFamily: FONT_JP,
                  fontSize: 10,
                  color: T.textFaint,
                  marginTop: 2,
                }}
              >
                {t.featInitSub}
              </div>
            </div>
            <Sparkline data={item.spark} w={86} h={32} stroke={T.inkLine} />
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 12,
              marginTop: 4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span
                style={{
                  fontFamily: FONT_NUM,
                  fontWeight: 800,
                  fontSize: 22,
                  color: T.crimson,
                  letterSpacing: -1,
                }}
              >
                +
              </span>
              <span
                style={{
                  fontFamily: FONT_NUM,
                  fontWeight: 900,
                  fontSize: 56,
                  color: T.white,
                  letterSpacing: -3,
                  lineHeight: 0.9,
                  fontVariantNumeric: 'tabular-nums',
                  textShadow: `0 0 24px ${T.emberGlow}`,
                }}
              >
                {item.reviewsDelta}
              </span>
              <span
                style={{
                  fontFamily: FONT_DISP,
                  fontWeight: 700,
                  fontSize: 11,
                  color: T.textMute,
                  letterSpacing: 1,
                  marginLeft: 6,
                }}
              >
                {t.reviews}
              </span>
            </div>
            <Sparkline data={item.spark} w={86} h={32} stroke={T.ember} />
          </div>
        )}
      </div>

      {/* rating + trend score */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
        <div
          style={{
            padding: '10px 11px',
            background: T.inkGlass,
            borderRadius: 10,
            border: `1px solid ${T.inkLine}`,
          }}
        >
          <div
            style={{
              fontSize: 8,
              fontFamily: FONT_DISP,
              letterSpacing: 2,
              color: T.textFaint,
              fontWeight: 700,
              marginBottom: 5,
            }}
          >
            RATING
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <Stars value={item.rating} />
            <div
              style={{
                fontFamily: FONT_NUM,
                fontWeight: 800,
                fontSize: 17,
                color: T.white,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {item.rating.toFixed(1)}
            </div>
          </div>
          {!item.isInitialSnapshot && item.ratingDelta !== 0 && (
            <div
              style={{
                marginTop: 3,
                fontSize: 11,
                fontFamily: FONT_NUM,
                color: item.ratingDelta < 0 ? T.ice : T.amber,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {item.ratingDelta > 0 ? '+' : ''}{item.ratingDelta.toFixed(1)}
            </div>
          )}
        </div>

        <div
          style={{
            padding: '10px 11px',
            background: T.inkGlass,
            borderRadius: 10,
            border: `1px solid ${T.inkLine}`,
          }}
        >
          <div
            style={{
              fontSize: 8,
              fontFamily: FONT_DISP,
              letterSpacing: 2,
              color: T.textFaint,
              fontWeight: 700,
              marginBottom: 5,
            }}
          >
            SCORE
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <div
              style={{
                fontFamily: FONT_NUM,
                fontWeight: 800,
                fontSize: 22,
                color: T.crimson,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: -0.5,
              }}
            >
              {item.trendScore}
            </div>
          </div>
          <div
            style={{
              marginTop: 5,
              height: 3,
              borderRadius: 2,
              background: T.inkLine,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${item.trendScore}%`,
                background: `linear-gradient(90deg, ${T.amber}, ${T.crimson})`,
                boxShadow: `0 0 6px ${T.emberGlow}`,
              }}
            />
          </div>
        </div>
      </div>

      {/* maps button */}
      <a
        href={item.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track({
          event_name: 'google_maps_click',
          language: lang,
          category: 'hot',
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
          marginTop: 14,
          display: 'flex',
          width: '100%',
          padding: '11px',
          background: 'transparent',
          border: `1px solid ${T.emberLine}`,
          borderRadius: 10,
          color: T.ember,
          fontFamily: FONT_JP,
          fontWeight: 700,
          fontSize: 12,
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          textDecoration: 'none',
        }}
      >
        <MapPin />
        {t.mapsLink}
        <span style={{ fontFamily: FONT_NUM }}>→</span>
      </a>
    </article>
  )
}
