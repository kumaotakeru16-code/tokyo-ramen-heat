import { T, FONT_JP, FONT_DISP } from '@/lib/tokens'
import { dict, type Lang } from '@/lib/i18n'
import FlameMark from './FlameMark'

export default function Footer({ lang }: { lang: Lang }) {
  const t = dict[lang]
  return (
    <footer
      style={{
        marginTop: 32,
        padding: '24px 18px 36px',
        borderTop: `1px solid ${T.inkLine}`,
        fontFamily: FONT_JP,
        fontSize: 10,
        color: T.textFaint,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <FlameMark size={11} />
        <span
          style={{
            fontFamily: FONT_DISP,
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 3,
            color: T.text,
          }}
        >
          TOKYO RAMEN HEAT
        </span>
      </div>
      <p style={{ margin: 0, lineHeight: 1.7, maxWidth: 320 }}>
        {t.footerAbout}
      </p>
      <div style={{ marginTop: 14, display: 'flex', gap: 12, color: T.textMute }}>
        <span>© 2026 TRH</span>
        <span>·</span>
        <span>{t.footerData}</span>
        <span>·</span>
        <span>NOT AFFILIATED WITH GOOGLE</span>
      </div>
    </footer>
  )
}
