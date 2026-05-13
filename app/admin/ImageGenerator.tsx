'use client'

import { useState, useRef } from 'react'
import { T, FONT_DISP, FONT_JP, FONT_NUM } from '@/lib/tokens'
import { formatArea } from '@/lib/area-en'
import type { StoreTrend } from '@/lib/types'

type Lang = 'jp' | 'en'

const CARD_W = 600
const CARD_H = 315

// ── Shared card decorations ────────────────────────────────────

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: CARD_W, height: CARD_H,
      background: '#050507',
      position: 'relative', overflow: 'hidden',
      fontFamily: FONT_JP, flexShrink: 0,
    }}>
      {/* ember glow top-left */}
      <div style={{
        position: 'absolute', top: -100, left: -60,
        width: 420, height: 420, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,69,33,0.14) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      {/* ice glow bottom-right */}
      <div style={{
        position: 'absolute', bottom: -60, right: -40,
        width: 240, height: 240, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(61,174,255,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        background: 'linear-gradient(to bottom, #FF4521 0%, #FF2D3F 55%, rgba(255,45,63,0.2) 100%)',
      }} />
      {/* bottom line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(to right, rgba(255,69,33,0.45), rgba(255,69,33,0.08) 60%, transparent)',
      }} />
      {children}
    </div>
  )
}

// ── CardHeader (logo + badge) ──────────────────────────────────

function CardHeader({ badge }: { badge: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{
        fontFamily: FONT_DISP, fontWeight: 900, fontSize: 12,
        letterSpacing: 2.5, color: T.ember,
      }}>
        🍜 TOKYO RAMEN HEAT
      </div>
      <div style={{
        fontFamily: FONT_DISP, fontWeight: 800, fontSize: 8,
        letterSpacing: 1.5, color: T.emberSoft,
        background: 'rgba(255,69,33,0.12)',
        border: '1px solid rgba(255,69,33,0.28)',
        borderRadius: 3, padding: '3px 9px',
      }}>
        {badge}
      </div>
    </div>
  )
}

// ── OgCard (single store) ──────────────────────────────────────

interface OgCardProps { item: StoreTrend; lang: Lang; siteUrl: string }

function OgCard({ item, lang, siteUrl }: OgCardProps) {
  const area    = formatArea(item.area, lang)
  const rankStr = String(item.rank).padStart(2, '0')
  const hasData = !item.isInitialSnapshot && item.reviewsDelta > 0
  const urlHost = siteUrl.replace(/^https?:\/\//, '')
  const badge   = lang === 'jp' ? '今週の急上昇' : 'WEEKLY TOP MOVER'
  const rvLabel = lang === 'jp' ? 'REVIEWS / 7日' : 'REVIEWS / 7 DAYS'

  return (
    <CardShell>
      <div style={{
        position: 'absolute', inset: 0,
        padding: '26px 32px 24px 42px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        boxSizing: 'border-box',
      }}>
        <CardHeader badge={badge} />

        {/* rank + name + area */}
        <div>
          <div style={{
            fontFamily: FONT_NUM, fontWeight: 900, fontSize: 68,
            color: T.amber, letterSpacing: -3, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums', opacity: 0.92,
          }}>
            #{rankStr}
          </div>
          <div style={{
            fontFamily: FONT_JP, fontWeight: 700,
            fontSize: lang === 'en' ? 22 : 24,
            color: '#F4F4F6', lineHeight: 1.25,
            marginTop: 8, letterSpacing: -0.3, maxWidth: 460,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
          }}>
            {item.name}
          </div>
          <div style={{
            fontFamily: FONT_NUM, fontSize: 12,
            color: 'rgba(244,244,246,0.42)', marginTop: 6, letterSpacing: 0.3,
          }}>
            {area}
          </div>
        </div>

        {/* stats + URL */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {hasData && (
              <>
                <div>
                  <div style={{
                    fontFamily: FONT_NUM, fontWeight: 900, fontSize: 32,
                    color: T.amber, letterSpacing: -1, lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    +{item.reviewsDelta}
                  </div>
                  <div style={{
                    fontFamily: FONT_DISP, fontSize: 7.5, fontWeight: 700,
                    letterSpacing: 1.5, color: 'rgba(244,244,246,0.32)', marginTop: 4,
                  }}>
                    {rvLabel}
                  </div>
                </div>
                <div style={{
                  width: 1, height: 38, background: 'rgba(255,255,255,0.07)',
                  margin: '0 20px', flexShrink: 0,
                }} />
              </>
            )}
            <div>
              <div style={{
                fontFamily: FONT_NUM, fontWeight: 900, fontSize: 32,
                color: '#F4F4F6', letterSpacing: -1, lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {item.rating.toFixed(1)}
              </div>
              <div style={{
                fontFamily: FONT_DISP, fontSize: 7.5, fontWeight: 700,
                letterSpacing: 1.5, color: 'rgba(244,244,246,0.32)', marginTop: 4,
              }}>
                RATING ★
              </div>
            </div>
          </div>
          <div style={{
            fontFamily: FONT_NUM, fontSize: 9,
            color: 'rgba(244,244,246,0.20)', letterSpacing: 0.3,
          }}>
            {urlHost}
          </div>
        </div>
      </div>
    </CardShell>
  )
}

// ── SummaryOgCard (top 3) ──────────────────────────────────────

interface SummaryCardProps { items: StoreTrend[]; lang: Lang; siteUrl: string }

function SummaryOgCard({ items, lang, siteUrl }: SummaryCardProps) {
  const urlHost  = siteUrl.replace(/^https?:\/\//, '')
  const badge    = lang === 'jp' ? '今週の急上昇 Top 3' : 'WEEKLY TOP 3'
  const rvLabel  = lang === 'jp' ? 'REVIEWS / 7日' : 'REVIEWS'
  const eligible = items
    .filter(it => !it.isInitialSnapshot && it.reviewsDelta > 0)
    .slice(0, 3)

  return (
    <CardShell>
      <div style={{
        position: 'absolute', inset: 0,
        padding: '24px 28px 22px 40px',
        display: 'flex', flexDirection: 'column',
        boxSizing: 'border-box',
        gap: 0,
      }}>
        <CardHeader badge={badge} />

        {/* store rows */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0, marginTop: 10 }}>
          {eligible.map((it, i) => (
            <div key={it.rank}>
              {i > 0 && (
                <div style={{
                  height: 1,
                  background: 'rgba(255,255,255,0.05)',
                  margin: '10px 0',
                }} />
              )}
              <div style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                padding:        i === 0 ? '6px 8px' : '4px 8px',
                borderRadius:   6,
                background:     i === 0 ? 'rgba(255,179,65,0.05)' : 'transparent',
              }}>
                {/* left: rank + name + area */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontFamily: FONT_NUM, fontWeight: 900,
                    fontSize: i === 0 ? 18 : 14,
                    color: T.amber, flexShrink: 0,
                    fontVariantNumeric: 'tabular-nums',
                    minWidth: 26,
                  }}>
                    #{it.rank}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily:    FONT_JP,
                      fontWeight:    700,
                      fontSize:      i === 0 ? 15 : 13,
                      color:         '#F4F4F6',
                      letterSpacing: -0.2,
                    }}>
                      {it.name.length > 22 ? it.name.slice(0, 21) + '…' : it.name}
                    </div>
                    <div style={{
                      fontFamily: FONT_NUM,
                      fontSize:   10,
                      color:      'rgba(244,244,246,0.38)',
                      marginTop:  2,
                      letterSpacing: 0.2,
                    }}>
                      {formatArea(it.area, lang)}  ·  ★{it.rating.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* right: delta */}
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                  <div style={{
                    fontFamily:         FONT_NUM,
                    fontWeight:         900,
                    fontSize:           i === 0 ? 26 : 20,
                    color:              T.amber,
                    letterSpacing:      -0.5,
                    lineHeight:         1,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    +{it.reviewsDelta}
                  </div>
                  <div style={{
                    fontFamily:    FONT_DISP,
                    fontSize:      7,
                    fontWeight:    700,
                    letterSpacing: 1,
                    color:         'rgba(244,244,246,0.28)',
                    marginTop:     3,
                  }}>
                    {rvLabel}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* url */}
        <div style={{
          fontFamily: FONT_NUM, fontSize: 9,
          color: 'rgba(244,244,246,0.18)', letterSpacing: 0.3,
          textAlign: 'right', marginTop: 8,
        }}>
          {urlHost}
        </div>
      </div>
    </CardShell>
  )
}

// ── ImageGenerator ─────────────────────────────────────────────

type ImageGeneratorProps =
  | { mode: 'single';  item: StoreTrend;   siteUrl: string; lang: Lang }
  | { mode: 'summary'; items: StoreTrend[]; siteUrl: string; lang: Lang }

export default function ImageGenerator(props: ImageGeneratorProps) {
  const [downloading, setDownloading] = useState(false)
  const lang = props.lang

  const cardRef = useRef<HTMLDivElement>(null)

  const downloadName = props.mode === 'summary'
    ? `trh-top3-${lang}-${Date.now()}.png`
    : `trh-rank${String(props.item.rank).padStart(2, '0')}-${lang}-${Date.now()}.png`

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return
    setDownloading(true)
    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio:      2,
        backgroundColor: '#050507',
        cacheBust:       true,
      })
      const a = document.createElement('a')
      a.download = downloadName
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

      {/* download */}
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            padding:       '7px 18px',
            background:    downloading ? T.ink3 : T.ember,
            border:        `1px solid ${downloading ? T.inkLine : T.ember}`,
            borderRadius:  8,
            color:         downloading ? T.textFaint : '#fff',
            fontFamily:    FONT_DISP, fontWeight: 800,
            fontSize:      9, letterSpacing: 1.5,
            cursor:        downloading ? 'not-allowed' : 'pointer',
            transition:    'all 0.2s',
          }}
        >
          {downloading ? 'GENERATING…' : '↓ DOWNLOAD PNG  (1200×630)'}
        </button>
      </div>

      {/* preview */}
      <div style={{
        overflowX: 'auto', background: '#000', borderRadius: 12,
        padding: 12, border: `1px solid ${T.inkLine}`,
        display: 'inline-block', maxWidth: '100%',
      }}>
        <div style={{
          fontFamily: FONT_DISP, fontSize: 8,
          letterSpacing: 1.5, color: T.textGhost, marginBottom: 8,
        }}>
          PREVIEW  ·  1200 × 630 px  (save = ↓ DOWNLOAD PNG)
        </div>

        <div ref={cardRef} style={{ display: 'inline-block', lineHeight: 0 }}>
          {props.mode === 'single'
            ? <OgCard        item={props.item}   lang={lang} siteUrl={props.siteUrl} />
            : <SummaryOgCard items={props.items} lang={lang} siteUrl={props.siteUrl} />
          }
        </div>
      </div>

    </div>
  )
}
