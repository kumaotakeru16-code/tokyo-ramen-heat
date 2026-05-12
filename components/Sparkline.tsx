'use client'

import { useId } from 'react'
import { T } from '@/lib/tokens'

interface SparklineProps {
  data: number[]
  w?: number
  h?: number
  stroke?: string
  fill?: boolean
}

export default function Sparkline({
  data,
  w = 96,
  h = 28,
  stroke = T.ember,
  fill = true,
}: SparklineProps) {
  const id = useId()
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const step = w / (data.length - 1)
  const pts = data.map((v, i) => [i * step, h - ((v - min) / range) * (h - 4) - 2])
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ')
  const dFill = `${d} L${w},${h} L0,${h} Z`
  const last = pts[pts.length - 1]

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`sp-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.45" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
        <filter id={`gl-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>
      {fill && <path d={dFill} fill={`url(#sp-${id})`} />}
      <path
        d={d}
        stroke={stroke}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#gl-${id})`}
        opacity="0.55"
      />
      <path
        d={d}
        stroke={stroke}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r="2.2" fill={stroke}>
        <animate attributeName="r" values="2.2;3.4;2.2" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
