'use client'

import { useState } from 'react'
import { T, FONT_DISP, FONT_JP, FONT_NUM } from '@/lib/tokens'
import type { StoreTrend } from '@/lib/types'
import PostGenerator, { type Template } from './PostGenerator'
import ImageGenerator from './ImageGenerator'

type Lang = 'jp' | 'en'

// ── Shared control styles ──────────────────────────────────────

const ctrlLabel: React.CSSProperties = {
  display:       'block',
  fontFamily:    FONT_DISP,
  fontSize:      8,
  fontWeight:    800,
  letterSpacing: 2,
  color:         T.textFaint,
  marginBottom:  6,
}

const ctrlSelect: React.CSSProperties = {
  padding:      '7px 12px',
  background:   T.ink3,
  border:       `1px solid ${T.inkLine}`,
  borderRadius: 8,
  color:        T.textMute,
  fontFamily:   FONT_JP,
  fontSize:     11,
  cursor:       'pointer',
  outline:      'none',
  minWidth:     220,
}

// ── Component ─────────────────────────────────────────────────

interface PostingPanelProps {
  items:   StoreTrend[]
  siteUrl: string
}

export default function PostingPanel({ items, siteUrl }: PostingPanelProps) {
  const [rankSel,  setRankSel]  = useState<string>('0')
  const [template, setTemplate] = useState<Template>('simple')
  const [lang,     setLang]     = useState<Lang>('jp')

  const top3      = items.slice(0, 3)
  const isSummary = rankSel === 'summary'
  const rankIdx   = isSummary ? -1 : Number(rankSel)
  const singleItem = isSummary ? null : (top3[rankIdx] ?? top3[0])

  if (top3.length === 0) return (
    <div style={{ padding: '32px 0', color: T.textGhost, fontFamily: FONT_JP, fontSize: 12 }}>
      データがありません
    </div>
  )

  return (
    <div>

      {/* ── Controls: Rank + Template + Lang ─────────────────── */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20, alignItems: 'flex-end' }}>

        {/* Rank */}
        <div>
          <label style={ctrlLabel}>RANK</label>
          <select
            style={ctrlSelect}
            value={rankSel}
            onChange={e => setRankSel(e.target.value)}
          >
            {top3.map((it, i) => {
              const noData = it.isInitialSnapshot || it.reviewsDelta === 0
              return (
                <option key={i} value={String(i)} disabled={noData}>
                  {`#${String(it.rank).padStart(2, '0')}  ${it.name}${noData ? '  (no delta)' : `  +${it.reviewsDelta}`}`}
                </option>
              )
            })}
            <option value="summary">🔥 Weekly Top 3 Summary</option>
          </select>
        </div>

        {/* Template (hidden in summary mode) */}
        {!isSummary && (
          <div>
            <label style={ctrlLabel}>TEMPLATE</label>
            <select
              style={ctrlSelect}
              value={template}
              onChange={e => setTemplate(e.target.value as Template)}
            >
              <option value="simple">Simple</option>
              <option value="data_insight">Data Insight</option>
            </select>
          </div>
        )}

        {/* Language toggle */}
        <div>
          <label style={ctrlLabel}>LANG</label>
          <div style={{ display: 'flex', border: `1px solid ${T.inkLine}`, borderRadius: 8, overflow: 'hidden' }}>
            {(['jp', 'en'] as Lang[]).map((l, i) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding:       '7px 24px',
                  fontFamily:    FONT_DISP,
                  fontWeight:    800,
                  fontSize:      10,
                  letterSpacing: 1.5,
                  cursor:        'pointer',
                  border:        'none',
                  borderRight:   i === 0 ? `1px solid ${T.inkLine}` : 'none',
                  background:    lang === l ? T.ember : 'transparent',
                  color:         lang === l ? '#fff'  : T.textFaint,
                  transition:    'background 0.15s, color 0.15s',
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ── Selected store preview ───────────────────────────── */}
      {isSummary ? (
        <div style={{
          padding:      '10px 14px',
          background:   T.ink2,
          border:       `1px solid ${T.inkLine}`,
          borderRadius: 10,
          marginBottom: 24,
          display:      'flex',
          alignItems:   'center',
          gap:          12,
          flexWrap:     'wrap',
        }}>
          <span style={{
            fontFamily:    FONT_DISP,
            fontWeight:    800,
            fontSize:      9,
            letterSpacing: 1.5,
            color:         T.ember,
          }}>
            🔥 TOP 3
          </span>
          {top3
            .filter(it => !it.isInitialSnapshot && it.reviewsDelta > 0)
            .map(it => (
              <span key={it.rank} style={{
                fontFamily:   FONT_NUM,
                fontSize:     11,
                color:        T.textMute,
                background:   T.ink3,
                border:       `1px solid ${T.inkLine}`,
                borderRadius: 5,
                padding:      '2px 8px',
                whiteSpace:   'nowrap',
              }}>
                <span style={{ color: T.amber, fontWeight: 700 }}>#{it.rank}</span>
                {' '}{it.name.length > 14 ? it.name.slice(0, 13) + '…' : it.name}
                {' '}<span style={{ color: T.amber }}>+{it.reviewsDelta}</span>
              </span>
            ))
          }
        </div>
      ) : singleItem ? (
        <div style={{
          padding:      '10px 14px',
          background:   T.ink2,
          border:       `1px solid ${T.inkLine}`,
          borderRadius: 10,
          marginBottom: 24,
          display:      'flex',
          alignItems:   'center',
          gap:          14,
        }}>
          <span style={{
            fontFamily:         FONT_NUM,
            fontWeight:         900,
            fontSize:           22,
            color:              T.amber,
            fontVariantNumeric: 'tabular-nums',
            minWidth:           40,
          }}>
            #{String(singleItem.rank).padStart(2, '0')}
          </span>
          <div>
            <div style={{ fontFamily: FONT_JP, fontWeight: 700, fontSize: 14, color: T.white }}>
              {singleItem.name}
            </div>
            <div style={{ fontFamily: FONT_NUM, fontSize: 11, color: T.textFaint, marginTop: 3 }}>
              {singleItem.area}
              {!singleItem.isInitialSnapshot && singleItem.reviewsDelta > 0 && (
                <> · <span style={{ color: T.amber }}>+{singleItem.reviewsDelta} reviews</span></>
              )}
              {' '} · score {singleItem.trendScore}
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Post text ────────────────────────────────────────── */}
      <div style={{
        fontFamily:    FONT_DISP,
        fontSize:      9,
        fontWeight:    800,
        letterSpacing: 3,
        color:         T.ember,
        marginBottom:  14,
      }}>
        POST TEXT
      </div>

      {isSummary ? (
        <PostGenerator mode="summary" items={top3}        siteUrl={siteUrl} lang={lang} />
      ) : singleItem ? (
        <PostGenerator mode="single"  item={singleItem}  template={template} siteUrl={siteUrl} lang={lang} />
      ) : null}

      {/* ── Divider ──────────────────────────────────────────── */}
      <div style={{ height: 1, background: T.inkLine, margin: '32px 0 24px' }} />

      {/* ── Image card ───────────────────────────────────────── */}
      <div style={{
        fontFamily:    FONT_DISP,
        fontSize:      9,
        fontWeight:    800,
        letterSpacing: 3,
        color:         T.ice,
        marginBottom:  16,
      }}>
        IMAGE CARD
      </div>

      {isSummary ? (
        <ImageGenerator mode="summary" items={top3}       siteUrl={siteUrl} lang={lang} />
      ) : singleItem ? (
        <ImageGenerator mode="single"  item={singleItem} siteUrl={siteUrl} lang={lang} />
      ) : null}

    </div>
  )
}
