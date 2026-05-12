// CategoryPreview — 非急上昇タブの Compact Heat Cards

import { T, FONT_JP, FONT_NUM, FONT_DISP, FONT_STORE } from '@/lib/tokens'
import { dict, type Lang } from '@/lib/i18n'
import { formatArea } from '@/lib/area-en'
import { track } from '@/lib/analytics'
import { NEW_ENTRIES, RATING_MOVERS, FALLING_WATCH } from '@/data/mockStores'
import Stars from './Stars'
import MapPin from './MapPin'

// ── 共通: Compact カードのマップリンク ────────────────────────
function MapsLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      style={{
        marginTop: 10,
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
      <MapPin /> {label}{' '}
      <span style={{ fontFamily: FONT_NUM, opacity: 0.7 }}>→</span>
    </a>
  )
}

// ── 共通: カード外枠 ──────────────────────────────────────────
function CompactCard({ children }: { children: React.ReactNode }) {
  return (
    <article
      style={{
        padding: '14px 16px',
        marginBottom: 8,
        background: T.ink2,
        border: `1px solid ${T.inkLine}`,
        borderRadius: 12,
      }}
    >
      {children}
    </article>
  )
}

// ── 共通: 店名 + エリア + 評価 ────────────────────────────────
function StoreInfo({ name, area, rating, lang }: { name: string; area: string; rating: number; lang: Lang }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontFamily: FONT_STORE,
          fontWeight: 700,
          fontSize: 15,
          color: T.white,
          letterSpacing: -0.3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          marginTop: 4,
          fontSize: 10,
          color: T.textFaint,
          fontFamily: FONT_JP,
        }}
      >
        <span>{formatArea(area, lang)}</span>
        <span style={{ opacity: 0.3 }}>·</span>
        <Stars value={rating} size={8} />
        <span
          style={{
            fontFamily: FONT_NUM,
            color: T.textMute,
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {rating.toFixed(1)}
        </span>
      </div>
    </div>
  )
}

// ── 初ランクイン ──────────────────────────────────────────────
function NewInsPanel({ lang }: { lang: Lang }) {
  const t = dict[lang]
  if (NEW_ENTRIES.length === 0) return null
  return (
    <div>
      {NEW_ENTRIES.map((it, i) => (
        <CompactCard key={i}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'flex-start' }}>
            <StoreInfo name={it.name} area={it.area} rating={it.rating} lang={lang} />
            <div style={{ textAlign: 'right', paddingTop: 2 }}>
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
              <div
                style={{
                  fontFamily: FONT_NUM,
                  fontWeight: 900,
                  fontSize: 24,
                  color: T.amber,
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: -0.5,
                  lineHeight: 1.1,
                  marginTop: 5,
                }}
              >
                #{it.to}
              </div>
            </div>
          </div>
          <MapsLink
            href={it.googleMapsUrl}
            label={t.mapsLinkShort}
            onClick={() => track({
              event_name: 'google_maps_click',
              language: lang,
              category: 'new',
              store_name: it.name,
              area: it.area,
              metadata: { ranking_position: it.to, rating: it.rating },
            })}
          />
        </CompactCard>
      ))}
    </div>
  )
}

// ── 評価急上昇 ─────────────────────────────────────────────────
function RatingMoversPanel({ lang }: { lang: Lang }) {
  const t = dict[lang]
  if (RATING_MOVERS.length === 0) return null
  return (
    <div>
      {RATING_MOVERS.map((it, i) => (
        <CompactCard key={i}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'flex-start' }}>
            <StoreInfo name={it.name} area={it.area} rating={it.rating} lang={lang} />
            <div style={{ textAlign: 'right', paddingTop: 2 }}>
              <div
                style={{
                  fontSize: 8,
                  color: T.textFaint,
                  fontFamily: FONT_DISP,
                  letterSpacing: 1,
                  fontWeight: 700,
                }}
              >
                {t.ratingRise.toUpperCase()}
              </div>
              <div
                style={{
                  fontFamily: FONT_NUM,
                  fontWeight: 800,
                  fontSize: 22,
                  color: T.amber,
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: -0.5,
                  lineHeight: 1.2,
                  marginTop: 3,
                }}
              >
                +{it.delta.toFixed(1)}
              </div>
            </div>
          </div>
          <MapsLink
            href={it.googleMapsUrl}
            label={t.mapsLinkShort}
            onClick={() => track({
              event_name: 'google_maps_click',
              language: lang,
              category: 'up',
              store_name: it.name,
              area: it.area,
              metadata: { delta: it.delta, pct: it.pct, rating: it.rating, ranking_position: i + 1 },
            })}
          />
        </CompactCard>
      ))}
    </div>
  )
}

// ── 急落ウォッチ ───────────────────────────────────────────────
function FallingWatchPanel({ lang }: { lang: Lang }) {
  const t = dict[lang]
  if (FALLING_WATCH.length === 0) return null
  return (
    <div>
      {FALLING_WATCH.map((it, i) => (
        <CompactCard key={i}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'flex-start' }}>
            <StoreInfo name={it.name} area={it.area} rating={it.rating} lang={lang} />
            <div style={{ textAlign: 'right', paddingTop: 2 }}>
              <div
                style={{
                  fontSize: 8,
                  color: T.textFaint,
                  fontFamily: FONT_DISP,
                  letterSpacing: 1,
                  fontWeight: 700,
                }}
              >
                {t.ratingFall.toUpperCase()}
              </div>
              <div
                style={{
                  fontFamily: FONT_NUM,
                  fontWeight: 800,
                  fontSize: 22,
                  color: T.ice,
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: -0.5,
                  lineHeight: 1.2,
                  marginTop: 3,
                }}
              >
                {it.delta.toFixed(1)}
              </div>
              <div
                style={{
                  fontFamily: FONT_NUM,
                  fontSize: 10,
                  color: T.textMute,
                  fontWeight: 600,
                  fontVariantNumeric: 'tabular-nums',
                  marginTop: 2,
                }}
              >
                +{it.reviewsDelta} {t.reviews}
              </div>
            </div>
          </div>
          <MapsLink
            href={it.googleMapsUrl}
            label={t.mapsLinkShort}
            onClick={() => track({
              event_name: 'google_maps_click',
              language: lang,
              category: 'down',
              store_name: it.name,
              area: it.area,
              metadata: {
                delta: it.delta,
                pct: it.pct,
                reviews_delta: it.reviewsDelta,
                rating: it.rating,
                ranking_position: i + 1,
              },
            })}
          />
        </CompactCard>
      ))}
    </div>
  )
}

// ── デフォルトエクスポート ────────────────────────────────────
interface CategoryPreviewProps {
  cat:  string
  lang: Lang
}

export default function CategoryPreview({ cat, lang }: CategoryPreviewProps) {
  if (cat === 'new')  return <NewInsPanel lang={lang} />
  if (cat === 'up')   return <RatingMoversPanel lang={lang} />
  if (cat === 'down') return <FallingWatchPanel lang={lang} />
  return null
}
