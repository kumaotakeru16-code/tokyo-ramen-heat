// CategoryPreview — 非急上昇タブの Compact Heat Cards

import { T, FONT_JP, FONT_NUM, FONT_DISP, FONT_STORE } from '@/lib/tokens'
import { dict, type Lang } from '@/lib/i18n'
import { formatArea } from '@/lib/area-en'
import { track } from '@/lib/analytics'
import type { FallingStore, RatingMover, NewEntry } from '@/lib/types'
import type { DataSource } from '@/lib/fetch-rankings'
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

// ── 共通: カテゴリ別 空状態 ────────────────────────────────────
const CAT_EMPTY: Record<'new' | 'up' | 'down', { jp: string; en: string }> = {
  new: {
    jp: '今回は初ランクイン店舗が検出されませんでした。\n次回更新後に再確認してください。',
    en: 'No new entries detected this time.\nCheck again after the next update.',
  },
  up: {
    jp: '今回は評価上昇の店舗がありません。\n次回更新後に再確認してください。',
    en: 'No rating movers this time.\nCheck again after the next update.',
  },
  down: {
    jp: '今回は急落ウォッチの対象店舗がありません。\n次回更新後に再確認してください。',
    en: 'No stores in watch list this time.\nCheck again after the next update.',
  },
}

function CatEmptyState({ cat, lang }: { cat: 'new' | 'up' | 'down'; lang: Lang }) {
  const msg = CAT_EMPTY[cat][lang]
  return (
    <div style={{
      padding: '24px 16px',
      background: T.ink2,
      border: `1px solid ${T.inkLine}`,
      borderRadius: 12,
      fontFamily: FONT_JP,
      fontSize: 12,
      color: T.textGhost,
      lineHeight: 1.8,
      whiteSpace: 'pre-line',
      textAlign: 'center',
    }}>
      {msg}
    </div>
  )
}

// ── 初ランクイン ──────────────────────────────────────────────
function NewInsPanel({ items, lang }: { items: NewEntry[]; lang: Lang }) {
  const t = dict[lang]
  if (items.length === 0) return <CatEmptyState cat="new" lang={lang} />
  return (
    <div>
      {items.map((it, i) => (
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
function RatingMoversPanel({ items, lang }: { items: RatingMover[]; lang: Lang }) {
  const t = dict[lang]
  if (items.length === 0) return <CatEmptyState cat="up" lang={lang} />
  return (
    <div>
      {items.map((it, i) => (
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
function FallingWatchPanel({ items, lang }: { items: FallingStore[]; lang: Lang }) {
  const t = dict[lang]
  if (items.length === 0) return <CatEmptyState cat="down" lang={lang} />
  return (
    <div>
      {items.map((it, i) => (
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
  cat:          string
  lang:         Lang
  newEntries:   NewEntry[]
  ratingMovers: RatingMover[]
  fallingWatch: FallingStore[]
  source:       DataSource
}

export default function CategoryPreview({
  cat, lang, newEntries, ratingMovers, fallingWatch, source,
}: CategoryPreviewProps) {
  if (cat === 'new')  return <NewInsPanel    items={newEntries}   lang={lang} />
  if (cat === 'up')   return <RatingMoversPanel items={ratingMovers} lang={lang} />
  if (cat === 'down') return <FallingWatchPanel items={fallingWatch} lang={lang} />
  return null
}
