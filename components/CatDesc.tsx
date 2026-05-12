import { T, FONT_JP } from '@/lib/tokens'
import { dict, type Lang } from '@/lib/i18n'

interface CatDescProps {
  cat:  string
  lang: Lang
}

export default function CatDesc({ cat, lang }: CatDescProps) {
  const t = dict[lang]

  type CatKey = 'hot' | 'new' | 'up' | 'down'
  const META: Record<CatKey, { icon: string; label: string; body: string; color: string }> = {
    hot:  { icon: '🔥', label: t.descHotLabel,  body: t.descHot,  color: T.ember },
    new:  { icon: '🆕', label: t.descNewLabel,  body: t.descNew,  color: T.ember },
    up:   { icon: '⬆',  label: t.descUpLabel,   body: t.descUp,   color: T.amber },
    down: { icon: '📉', label: t.descDownLabel, body: t.descDown, color: T.ice   },
  }

  const d = META[cat as CatKey]
  if (!d) return null

  return (
    <div
      style={{
        margin: '0 18px 16px',
        padding: '12px 14px',
        background: T.ink2,
        border: `1px solid ${T.inkLine}`,
        borderRadius: 12,
        borderLeft: `3px solid ${d.color}`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: d.color,
          fontFamily: FONT_JP,
          letterSpacing: 1,
        }}
      >
        {d.icon} {d.label}
      </div>
      <div
        style={{
          fontSize: 11,
          color: T.textMute,
          fontFamily: FONT_JP,
          marginTop: 4,
          lineHeight: 1.7,
        }}
      >
        {d.body}
      </div>
    </div>
  )
}
