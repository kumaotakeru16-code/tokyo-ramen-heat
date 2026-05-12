import { T, FONT_DISP, FONT_JP, FONT_NUM } from '@/lib/tokens'

interface SectionHeaderProps {
  kicker: string
  title: string
  /** 任意: "Top 5 / 100 stores" などの自由文字列 */
  countLabel?: string
}

export default function SectionHeader({ kicker, title, countLabel }: SectionHeaderProps) {
  return (
    <div
      style={{
        padding: '18px 18px 10px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div
          style={{
            fontFamily: FONT_DISP,
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 3,
            color: T.ember,
            marginBottom: 3,
          }}
        >
          {kicker}
        </div>
        <h2
          style={{
            margin: 0,
            fontFamily: FONT_JP,
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: -0.5,
            color: T.white,
          }}
        >
          {title}
        </h2>
      </div>
      {countLabel && (
        <div
          style={{
            fontFamily: FONT_NUM,
            fontSize: 10,
            fontWeight: 600,
            color: T.textFaint,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: 0.5,
            textAlign: 'right',
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
          }}
        >
          {countLabel}
        </div>
      )}
    </div>
  )
}
