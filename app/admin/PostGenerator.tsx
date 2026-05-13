'use client'

import { useState } from 'react'
import { T, FONT_DISP, FONT_JP } from '@/lib/tokens'
import { formatArea } from '@/lib/area-en'
import type { StoreTrend } from '@/lib/types'

export type Template = 'simple' | 'data_insight'

const FALLBACK_URL = 'https://tokyo-ramen-heat.vercel.app'

// ── Helpers ────────────────────────────────────────────────────

function truncateName(name: string, max = 20): string {
  return name.length <= max ? name : name.slice(0, max - 1) + '…'
}

// ── 単店舗投稿文 ───────────────────────────────────────────────

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

// ── Top 3 Summary 投稿文 ───────────────────────────────────────

function buildSummaryPost(
  items:   StoreTrend[],
  lang:    'jp' | 'en',
  siteUrl: string,
): string {
  const url      = siteUrl || FALLBACK_URL
  const eligible = items
    .filter(it => !it.isInitialSnapshot && it.reviewsDelta > 0)
    .slice(0, 3)

  const lines = eligible.map(it => {
    const name = truncateName(it.name)
    const area = lang === 'en' ? formatArea(it.area, 'en') : it.area
    return `#${it.rank} ${name} ${area} (+${it.reviewsDelta})`
  })

  if (lang === 'jp') return [
    '今週、東京で急上昇しているラーメン店 Top3。',
    '',
    ...lines,
    '',
    '🍜 TOKYO RAMEN HEAT',
    url,
  ].join('\n')

  return [
    'Tokyo ramen shops trending this week:',
    '',
    ...lines,
    '',
    '🍜 TOKYO RAMEN HEAT',
    url,
  ].join('\n')
}

// ── Props ──────────────────────────────────────────────────────

type PostGeneratorProps =
  | { mode: 'single';  item: StoreTrend; template: Template; siteUrl: string; lang: 'jp' | 'en' }
  | { mode: 'summary'; items: StoreTrend[];                  siteUrl: string; lang: 'jp' | 'en' }

// ── Component ─────────────────────────────────────────────────

export default function PostGenerator(props: PostGeneratorProps) {
  const [copied, setCopied] = useState(false)

  const { lang, siteUrl } = props

  const hasData = props.mode === 'single'
    ? !props.item.isInitialSnapshot && props.item.reviewsDelta > 0
    : props.items.some(it => !it.isInitialSnapshot && it.reviewsDelta > 0)

  const post = hasData
    ? props.mode === 'single'
        ? buildPost(props.item, lang, props.template, siteUrl)
        : buildSummaryPost(props.items, lang, siteUrl)
    : ''

  const copyTo = () => {
    if (!post) return
    navigator.clipboard.writeText(post)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }

  if (!hasData) return (
    <div style={{
      padding:      '16px 14px',
      background:   T.ink2,
      border:       `1px solid ${T.inkLine}`,
      borderRadius: 10,
      fontFamily:   FONT_JP,
      fontSize:     12,
      color:        T.textGhost,
      lineHeight:   1.8,
    }}>
      差分データ取得後に生成できます。
      <br />
      <span style={{ fontFamily: FONT_DISP, fontSize: 10, letterSpacing: 0.5 }}>
        (Available after the first ranking update with delta data.)
      </span>
    </div>
  )

  return (
    <div>
      <textarea
        readOnly
        value={post}
        style={{
          display:      'block',
          width:        '100%',
          padding:      '12px 14px',
          background:   T.ink3,
          border:       `1px solid ${T.inkLine}`,
          borderRadius: 10,
          color:        T.text,
          fontFamily:   FONT_JP,
          fontSize:     12,
          lineHeight:   1.9,
          resize:       'vertical',
          outline:      'none',
          boxSizing:    'border-box',
          minHeight:    props.mode === 'summary' ? 160 : 180,
        }}
      />
      <button
        onClick={copyTo}
        style={{
          marginTop:     8,
          padding:       '7px 18px',
          background:    copied ? T.green : 'transparent',
          border:        `1px solid ${copied ? T.green : T.inkLine}`,
          borderRadius:  8,
          color:         copied ? '#fff' : T.textMute,
          fontFamily:    FONT_DISP,
          fontWeight:    800,
          fontSize:      9,
          letterSpacing: 1.5,
          cursor:        'pointer',
          transition:    'all 0.2s',
        }}
      >
        {copied ? 'COPIED ✓' : `COPY ${lang.toUpperCase()}`}
      </button>
    </div>
  )
}
