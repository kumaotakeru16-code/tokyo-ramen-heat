'use client'

import { T, FONT_JP } from '@/lib/tokens'
import { dict, type Lang } from '@/lib/i18n'

interface CategoryTabsProps {
  active:    string
  setActive: (k: string) => void
  lang:      Lang
}

export default function CategoryTabs({ active, setActive, lang }: CategoryTabsProps) {
  const t = dict[lang]

  const CATS = [
    { key: 'hot',  icon: '🔥', label: t.catHot  },
    { key: 'new',  icon: '🆕', label: t.catNew  },
    { key: 'up',   icon: '⬆',  label: t.catUp   },
    { key: 'down', icon: '📉', label: t.catDown, cool: true },
  ]

  return (
    <div
      style={{
        display: 'flex',
        gap: 6,
        padding: '12px 18px 12px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        borderTop: `1px solid ${T.inkLine}`,
        borderBottom: `1px solid ${T.inkLine}`,
      }}
    >
      {CATS.map(c => {
        const isOn   = active === c.key
        const accent = c.cool ? T.ice : T.ember
        const surf   = c.cool ? T.iceSurf : T.emberSurf
        const line   = c.cool ? T.iceLine : T.emberLine
        return (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 99,
              background: isOn ? surf : 'transparent',
              border: `1px solid ${isOn ? line : T.inkLine}`,
              color: isOn ? accent : T.textMute,
              fontFamily: FONT_JP,
              fontWeight: 700,
              fontSize: 11,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: 12 }}>{c.icon}</span>
            {c.label}
          </button>
        )
      })}
    </div>
  )
}
