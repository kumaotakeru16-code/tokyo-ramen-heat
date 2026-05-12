import { T } from '@/lib/tokens'

interface FlameMarkProps {
  size?: number
}

export default function FlameMark({ size = 16 }: FlameMarkProps) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 18 21" fill="none">
      <defs>
        <linearGradient id="flameG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={T.amber} />
          <stop offset="55%" stopColor={T.emberHot} />
          <stop offset="100%" stopColor={T.crimson} />
        </linearGradient>
      </defs>
      <path
        d="M9 1 C 11 5 14 6 14 11 C 14 15 12 19 9 20 C 6 19 4 15 4 11 C 4 8 5 7 6 5 C 7 7 7 8 9 1 Z"
        fill="url(#flameG)"
      />
      <path
        d="M9 9 C 10 11 11 12 11 14 C 11 16 10 18 9 18 C 8 18 7 16 7 14 C 7 13 7.5 12 9 9 Z"
        fill="#FFEAB6"
        opacity="0.9"
      />
    </svg>
  )
}
