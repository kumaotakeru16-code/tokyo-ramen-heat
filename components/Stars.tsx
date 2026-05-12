import { T } from '@/lib/tokens'

interface StarsProps {
  value: number
  size?: number
}

export default function Stars({ value, size = 9 }: StarsProps) {
  const key = value.toFixed(1).replace('.', '_')
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 1, marginRight: 4 }}>
      {[0, 1, 2, 3, 4].map(i => {
        const diff = value - i
        const filled = diff >= 0.75 ? 1 : diff >= 0.25 ? 0.5 : 0
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 10 10">
            <defs>
              <linearGradient id={`star-${i}-${key}`} x1="0" x2="1">
                <stop offset={`${filled * 100}%`} stopColor={T.amber} />
                <stop offset={`${filled * 100}%`} stopColor={T.inkLine} />
              </linearGradient>
            </defs>
            <path
              d="M5 1L6.2 3.6L9 4L7 6L7.5 9L5 7.6L2.5 9L3 6L1 4L3.8 3.6Z"
              fill={`url(#star-${i}-${key})`}
            />
          </svg>
        )
      })}
    </div>
  )
}
