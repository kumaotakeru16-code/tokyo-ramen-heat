'use client'

import { useState } from 'react'
import { T, FONT_DISP, FONT_JP, FONT_NUM } from '@/lib/tokens'
import { formatArea } from '@/lib/area-en'
import type { StoreTrend } from '@/lib/types'

type Template = 'simple' | 'data_insight'

const FALLBACK_URL = 'https://tokyo-ramen-heat.vercel.app'

// ── 投稿文生成 ─────────────────────────────────────────────────

function buildPost(
  item:     StoreTrend,
  lang:     'jp' | 'en',
  template: Template,
  siteUrl:  string,
): string {
  const area  = lang === 'en' ? formatArea(item.area, 'en') : item.area
  const name  = item.name
  const delta = item.reviewsDelta
  const url   = siteUrl || FALLBACK_URL

  if (lang === 'jp' && template === 'simple') return [
    '今週、東京で最も伸びているラーメン店。',
    '',
    `${area}の`,
    `「${name}」`,
    '',
    `7日で Googleレビュー +${delta}。`,
    '',
    '🍜 TOKYO RAMEN HEAT',
    url,
  ].join('\n')

  if (lang === 'jp' && template === 'data_insight') return [
    'Googleレビュー増加で見ると、',
    '今週もっとも伸びた東京ラーメン店は',
    `「${name}」。`,
    '',
    `7日で +${delta} reviews。`,
    '',
    `${area}周辺のインバウンド/話題店の伸びが目立ちます。`,
    '',
    '🍜 TOKYO RAMEN HEAT',
    url,
  ].join('\n')

  if (lang === 'en' && template === 'simple') return [
    "Tokyo's hottest ramen shop this week:",
    '',
    name,
    `+${delta} Google reviews in 7 days.`,
    '',
    '🍜 TOKYO RAMEN HEAT',
    url,
  ].join('\n')

  // en / data_insight
  return [
    'By Google review momentum,',
    "this week's fastest-growing ramen shop in Tokyo is:",
    '',
    name,
    '',
    `+${delta} reviews in 7 days.`,
    '',
    '🍜 TOKYO RAMEN HEAT',
    url,
  ].join('\n')
}

// ── Props ──────────────────────────────────────────────────────

interface PostGeneratorProps {
  /** ランキング上位3件（hotNow[0..2]） */
  items:   StoreTrend[]
  siteUrl: string
}

// ── Component ─────────────────────────────────────────────────

export default function PostGenerator({ items, siteUrl }: PostGeneratorProps) {
  const [rankIdx,  setRankIdx]  = useState(0)
  const [template, setTemplate] = useState<Template>('simple')
  const [copied,   setCopied]   = useState<'jp' | 'en' | null>(null)

  const top3    = items.slice(0, 3)
  const item    = top3[rankIdx] ?? top3[0]
  const hasData = !!item && !item.isInitialSnapshot && item.reviewsDelta > 0

  const jpPost = hasData ? buildPost(item, 'jp', template, siteUrl) : ''
  const enPost = hasData ? buildPost(item, 'en', template, siteUrl) : ''

  const copyTo = (text: string, lang: 'jp' | 'en') => {
    if (!text) return
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(lang)
        setTimeout(() => setCopied(null), 2000)
      })
      .catch(() => {})
  }

  // ── Styles
  const ctrl = {
    label: {
      display: 'block',
      fontFamily: FONT_DISP,
      fontSize: 8,
      fontWeight: 800 as const,
      letterSpacing: 2,
      color: T.textFaint,
      marginBottom: 6,
    },
    select: {
      padding: '7px 12px',
      background: T.ink3,
      border: `1px solid ${T.inkLine}`,
      borderRadius: 8,
      color: T.textMute,
      fontFamily: FONT_JP,
      fontSize: 11,
      cursor: 'pointer',
      outline: 'none',
      minWidth: 200,
    } as React.CSSProperties,
  }

  const copyBtnStyle = (lang: 'jp' | 'en'): React.CSSProperties => ({
    marginTop: 8,
    padding: '7px 16px',
    background: copied === lang ? T.green : 'transparent',
    border: `1px solid ${copied === lang ? T.green : T.inkLine}`,
    borderRadius: 8,
    color: copied === lang ? '#fff' : T.textMute,
    fontFamily: FONT_DISP,
    fontWeight: 800,
    fontSize: 9,
    letterSpacing: 1.5,
    cursor: 'pointer',
    transition: 'all 0.2s',
  })

  const taStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '12px 14px',
    background: T.ink3,
    border: `1px solid ${T.inkLine}`,
    borderRadius: 10,
    color: T.text,
    fontFamily: FONT_JP,
    fontSize: 12,
    lineHeight: 1.9,
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    minHeight: 180,
  }

  return (
    <div>

      {/* ── コントロール行 */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
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
          <label style={ctrl.label}>TEMPLATE</label>
          <select
            style={ctrl.select}
            value={template}
            onChange={e => setTemplate(e.target.value as Template)}
          >
            <option value="simple">Simple</option>
            <option value="data_insight">Data Insight</option>
          </select>
        </div>
      </div>

      {/* ── 選択中店舗プレビュー */}
      {item && (
        <div style={{
          padding: '10px 14px',
          background: T.ink2,
          border: `1px solid ${T.inkLine}`,
          borderRadius: 10,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <span style={{
            fontFamily: FONT_NUM,
            fontWeight: 900,
            fontSize: 22,
            color: T.amber,
            fontVariantNumeric: 'tabular-nums',
            minWidth: 40,
          }}>
            #{String(item.rank).padStart(2, '0')}
          </span>
          <div>
            <div style={{ fontFamily: FONT_JP, fontWeight: 700, fontSize: 14, color: T.white }}>
              {item.name}
            </div>
            <div style={{ fontFamily: FONT_NUM, fontSize: 11, color: T.textFaint, marginTop: 3 }}>
              {item.area}
              {!item.isInitialSnapshot && item.reviewsDelta > 0 && (
                <>  ·  <span style={{ color: T.amber }}>+{item.reviewsDelta} reviews</span></>
              )}
              {' '}  ·  score {item.trendScore}
            </div>
          </div>
        </div>
      )}

      {/* ── データなし */}
      {!hasData && (
        <div style={{
          padding: '16px 14px',
          background: T.ink2,
          border: `1px solid ${T.inkLine}`,
          borderRadius: 10,
          fontFamily: FONT_JP,
          fontSize: 12,
          color: T.textGhost,
          lineHeight: 1.8,
        }}>
          差分データ取得後に生成できます。
          <br />
          <span style={{ fontFamily: FONT_DISP, fontSize: 10, letterSpacing: 0.5 }}>
            (Available after the first ranking update with delta data.)
          </span>
        </div>
      )}

      {/* ── JP / EN テキストエリア */}
      {hasData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* JP */}
          <div>
            <div style={{
              fontFamily: FONT_DISP,
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: 2,
              color: T.ember,
              marginBottom: 8,
            }}>
              JP
            </div>
            <textarea
              readOnly
              style={taStyle}
              value={jpPost}
            />
            <button style={copyBtnStyle('jp')} onClick={() => copyTo(jpPost, 'jp')}>
              {copied === 'jp' ? 'COPIED ✓' : 'COPY JP'}
            </button>
          </div>

          {/* EN */}
          <div>
            <div style={{
              fontFamily: FONT_DISP,
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: 2,
              color: T.ice,
              marginBottom: 8,
            }}>
              EN
            </div>
            <textarea
              readOnly
              style={taStyle}
              value={enPost}
            />
            <button style={copyBtnStyle('en')} onClick={() => copyTo(enPost, 'en')}>
              {copied === 'en' ? 'COPIED ✓' : 'COPY EN'}
            </button>
          </div>

        </div>
      )}

    </div>
  )
}
