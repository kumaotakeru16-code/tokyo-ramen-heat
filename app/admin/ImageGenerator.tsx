'use client'

import { useState, useRef } from 'react'
import { T, FONT_DISP, FONT_JP, FONT_NUM } from '@/lib/tokens'
import { formatArea } from '@/lib/area-en'
import type { StoreTrend } from '@/lib/types'

type Lang = 'jp' | 'en'

// Card dimensions — rendered at this size, exported @2x → 1200×630 PNG
const CARD_W = 600
const CARD_H = 315

// ── OgCard ────────────────────────────────────────────────────

interface CardProps {
  item:    StoreTrend
  lang:    Lang
  siteUrl: string
}

function OgCard({ item, lang, siteUrl }: CardProps) {
  const area     = formatArea(item.area, lang)
  const rankStr  = String(item.rank).padStart(2, '0')
  const hasData  = !item.isInitialSnapshot && item.reviewsDelta > 0
  const urlHost  = siteUrl.replace(/^https?:\/\//, '')
  const badge    = lang === 'jp' ? '今週の急上昇' : 'WEEKLY TOP MOVER'
  const rvLabel  = lang === 'jp' ? 'REVIEWS / 7日' : 'REVIEWS / 7 DAYS'

  return (
    <div style={{
      width:      CARD_W,
      height:     CARD_H,
      background: '#050507',
      position:   'relative',
      overflow:   'hidden',
      fontFamily: FONT_JP,
      flexShrink: 0,
    }}>

      {/* ember glow top-left */}
      <div style={{
        position:     'absolute',
        top: -100, left: -60,
        width: 420, height: 420,
        borderRadius: '50%',
        background:   'radial-gradient(circle, rgba(255,69,33,0.14) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* ice glow bottom-right */}
      <div style={{
        position:     'absolute',
        bottom: -60, right: -40,
        width: 240, height: 240,
        borderRadius: '50%',
        background:   'radial-gradient(circle, rgba(61,174,255,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* left accent bar */}
      <div style={{
        position:   'absolute',
        left: 0, top: 0, bottom: 0,
        width:      3,
        background: 'linear-gradient(to bottom, #FF4521 0%, #FF2D3F 55%, rgba(255,45,63,0.2) 100%)',
      }} />

      {/* bottom border line */}
      <div style={{
        position:   'absolute',
        bottom: 0, left: 0, right: 0,
        height:     1,
        background: 'linear-gradient(to right, rgba(255,69,33,0.45), rgba(255,69,33,0.08) 60%, transparent)',
      }} />

      {/* content */}
      <div style={{
        position:       'absolute',
        inset:          0,
        padding:        '26px 32px 24px 42px',
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'space-between',
        boxSizing:      'border-box',
      }}>

        {/* top: logo + badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            fontFamily:    FONT_DISP,
            fontWeight:    900,
            fontSize:      12,
            letterSpacing: 2.5,
            color:         T.ember,
          }}>
            🍜 TOKYO RAMEN HEAT
          </div>
          <div style={{
            fontFamily:    FONT_DISP,
            fontWeight:    800,
            fontSize:      8,
            letterSpacing: 1.5,
            color:         T.emberSoft,
            background:    'rgba(255,69,33,0.12)',
            border:        '1px solid rgba(255,69,33,0.28)',
            borderRadius:  3,
            padding:       '3px 9px',
          }}>
            {badge}
          </div>
        </div>

        {/* middle: rank + name + area */}
        <div>
          <div style={{
            fontFamily:         FONT_NUM,
            fontWeight:         900,
            fontSize:           68,
            color:              T.amber,
            letterSpacing:      -3,
            lineHeight:         1,
            fontVariantNumeric: 'tabular-nums',
            opacity:            0.92,
          }}>
            #{rankStr}
          </div>

          <div style={{
            fontFamily:    FONT_JP,
            fontWeight:    700,
            fontSize:      lang === 'en' ? 22 : 24,
            color:         '#F4F4F6',
            lineHeight:    1.25,
            marginTop:     8,
            letterSpacing: -0.3,
            maxWidth:      460,
            overflow:      'hidden',
            display:       '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
          }}>
            {item.name}
          </div>

          <div style={{
            fontFamily:    FONT_NUM,
            fontSize:      12,
            color:         'rgba(244,244,246,0.42)',
            marginTop:     6,
            letterSpacing: 0.3,
          }}>
            {area}
          </div>
        </div>

        {/* bottom: stats + URL */}
        <div style={{
          display:        'flex',
          alignItems:     'flex-end',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>

            {hasData && (
              <>
                <div>
                  <div style={{
                    fontFamily:         FONT_NUM,
                    fontWeight:         900,
                    fontSize:           32,
                    color:              T.amber,
                    letterSpacing:      -1,
                    lineHeight:         1,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    +{item.reviewsDelta}
                  </div>
                  <div style={{
                    fontFamily:    FONT_DISP,
                    fontSize:      7.5,
                    fontWeight:    700,
                    letterSpacing: 1.5,
                    color:         'rgba(244,244,246,0.32)',
                    marginTop:     4,
                  }}>
                    {rvLabel}
                  </div>
                </div>

                <div style={{
                  width:      1,
                  height:     38,
                  background: 'rgba(255,255,255,0.07)',
                  margin:     '0 20px',
                  flexShrink: 0,
                }} />
              </>
            )}

            <div>
              <div style={{
                fontFamily:         FONT_NUM,
                fontWeight:         900,
                fontSize:           32,
                color:              '#F4F4F6',
                letterSpacing:      -1,
                lineHeight:         1,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {item.rating.toFixed(1)}
              </div>
              <div style={{
                fontFamily:    FONT_DISP,
                fontSize:      7.5,
                fontWeight:    700,
                letterSpacing: 1.5,
                color:         'rgba(244,244,246,0.32)',
                marginTop:     4,
              }}>
                RATING ★
              </div>
            </div>
          </div>

          <div style={{
            fontFamily:    FONT_NUM,
            fontSize:      9,
            color:         'rgba(244,244,246,0.20)',
            letterSpacing: 0.3,
          }}>
            {urlHost}
          </div>
        </div>

      </div>
    </div>
  )
}

// ── ImageGenerator ────────────────────────────────────────────

interface ImageGeneratorProps {
  items:   StoreTrend[]
  siteUrl: string
}

const ctrl = {
  label: {
    display:       'block',
    fontFamily:    FONT_DISP,
    fontSize:      8,
    fontWeight:    800 as const,
    letterSpacing: 2,
    color:         T.textFaint,
    marginBottom:  6,
  },
  select: {
    padding:      '7px 12px',
    background:   T.ink3,
    border:       `1px solid ${T.inkLine}`,
    borderRadius: 8,
    color:        T.textMute,
    fontFamily:   FONT_JP,
    fontSize:     11,
    cursor:       'pointer',
    outline:      'none',
    minWidth:     200,
  } as React.CSSProperties,
}

export default function ImageGenerator({ items, siteUrl }: ImageGeneratorProps) {
  const [rankIdx,     setRankIdx]     = useState(0)
  const [lang,        setLang]        = useState<Lang>('jp')
  const [downloading, setDownloading] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)

  const top3 = items.slice(0, 3)
  const item = top3[rankIdx] ?? top3[0]

  if (!item) return null

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return
    setDownloading(true)
    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio:      2,          // 600×315 @2x → 1200×630
        backgroundColor: '#050507',
        cacheBust:       true,
      })
      const a = document.createElement('a')
      a.download = `trh-rank${String(item.rank).padStart(2, '0')}-${lang}-${Date.now()}.png`
      a.href = dataUrl
      a.click()
    } catch (err) {
      console.error('[ImageGenerator] toPng failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div>

      {/* ── コントロール行 */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 20, alignItems: 'flex-end' }}>

        <div>
          <label style={ctrl.label}>RANK</label>
          <select
            style={ctrl.select}
            value={rankIdx}
            onChange={e => setRankIdx(Number(e.target.value))}
          >
            {top3.map((it, i) => {
              const noData = it.isInitialSnapshot || it.reviewsDelta === 0
              return (
                <option key={i} value={i} disabled={noData}>
                  {`#${String(it.rank).padStart(2, '0')}  ${it.name}${noData ? '  (no delta)' : `  +${it.reviewsDelta} reviews`}`}
                </option>
              )
            })}
          </select>
        </div>

        <div>
          <label style={ctrl.label}>LANG</label>
          <div style={{ display: 'flex', border: `1px solid ${T.inkLine}`, borderRadius: 8, overflow: 'hidden' }}>
            {(['jp', 'en'] as Lang[]).map((l, i) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding:       '7px 22px',
                  fontFamily:    FONT_DISP,
                  fontWeight:    800,
                  fontSize:      10,
                  letterSpacing: 1.5,
                  cursor:        'pointer',
                  border:        'none',
                  borderRight:   i === 0 ? `1px solid ${T.inkLine}` : 'none',
                  background:    lang === l ? T.ink3 : 'transparent',
                  color:         lang === l ? T.white : T.textFaint,
                  transition:    'all 0.15s',
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            padding:       '8px 20px',
            background:    downloading ? T.ink3 : T.ember,
            border:        `1px solid ${downloading ? T.inkLine : T.ember}`,
            borderRadius:  8,
            color:         downloading ? T.textFaint : '#fff',
            fontFamily:    FONT_DISP,
            fontWeight:    800,
            fontSize:      9,
            letterSpacing: 1.5,
            cursor:        downloading ? 'not-allowed' : 'pointer',
            transition:    'all 0.2s',
          }}
        >
          {downloading ? 'GENERATING…' : '↓ DOWNLOAD PNG  (1200×630)'}
        </button>

      </div>

      {/* ── プレビュー (scroll container for narrower admin layouts) */}
      <div style={{
        overflowX:    'auto',
        background:   '#000',
        borderRadius: 12,
        padding:      16,
        border:       `1px solid ${T.inkLine}`,
        display:      'inline-block',
        maxWidth:     '100%',
      }}>
        <div style={{
          fontFamily:    FONT_DISP,
          fontSize:      8,
          letterSpacing: 1.5,
          color:         T.textGhost,
          marginBottom:  10,
        }}>
          PREVIEW  ·  1200 × 630 px  ·  SAVE = ↓ DOWNLOAD PNG
        </div>

        {/* cardRef is the html-to-image target */}
        <div ref={cardRef} style={{ display: 'inline-block', lineHeight: 0 }}>
          <OgCard item={item} lang={lang} siteUrl={siteUrl} />
        </div>

        <div style={{
          marginTop:     8,
          fontFamily:    FONT_DISP,
          fontSize:      8,
          color:         T.textGhost,
          letterSpacing: 1,
        }}>
          {item.name}  ·  #{item.rank}  ·  {lang.toUpperCase()}
        </div>
      </div>

    </div>
  )
}
