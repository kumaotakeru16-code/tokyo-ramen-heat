'use client'

import { useState } from 'react'
import { T, FONT_DISP } from '@/lib/tokens'

type AdminTab = 'analytics' | 'posting'

const TABS: { k: AdminTab; label: string }[] = [
  { k: 'analytics', label: 'ANALYTICS' },
  { k: 'posting',   label: 'POSTING'   },
]

interface AdminShellProps {
  analytics: React.ReactNode
  posting:   React.ReactNode
}

export default function AdminShell({ analytics, posting }: AdminShellProps) {
  const [tab, setTab] = useState<AdminTab>('analytics')

  return (
    <>
      {/* ── Main tab bar ────────────────────────────────────── */}
      <div style={{
        display:      'flex',
        gap:          3,
        marginBottom: 28,
        background:   T.ink2,
        border:       `1px solid ${T.inkLine}`,
        borderRadius: 11,
        padding:      4,
        width:        'fit-content',
      }}>
        {TABS.map(({ k, label }) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{
              padding:       '9px 28px',
              fontFamily:    FONT_DISP,
              fontWeight:    800,
              fontSize:      10,
              letterSpacing: 2,
              border:        'none',
              borderRadius:  8,
              cursor:        'pointer',
              transition:    'background 0.15s, color 0.15s',
              background:    tab === k ? T.ember : 'transparent',
              color:         tab === k ? '#fff'  : T.textFaint,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab content ─────────────────────────────────────── */}
      {tab === 'analytics' ? analytics : posting}
    </>
  )
}
