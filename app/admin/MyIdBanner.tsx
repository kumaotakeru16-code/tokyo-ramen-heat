'use client'

import { useState, useEffect } from 'react'
import { T, FONT_DISP, FONT_NUM, FONT_JP } from '@/lib/tokens'

interface MyIdBannerProps {
  excludedIds: string[]
}

const code: React.CSSProperties = {
  fontFamily:   FONT_NUM,
  fontSize:     10,
  color:        T.textFaint,
  background:   T.ink3,
  padding:      '1px 5px',
  borderRadius: 3,
}

export default function MyIdBanner({ excludedIds }: MyIdBannerProps) {
  const [id,     setId]     = useState<string | null>(null)
  const [copied, setCopied] = useState<'id' | 'env' | null>(null)

  useEffect(() => {
    setId(localStorage.getItem('trh_anon_user_id'))
  }, [])

  const isAlreadyExcluded = id ? excludedIds.includes(id) : false

  const newList     = id && !isAlreadyExcluded ? [...excludedIds, id] : excludedIds
  const envVarStr   = `EXCLUDED_ANON_IDS=${newList.join(',')}`

  const copyId = () => {
    if (!id) return
    navigator.clipboard.writeText(id)
      .then(() => { setCopied('id');  setTimeout(() => setCopied(null), 2000) })
      .catch(() => {})
  }

  const copyEnv = () => {
    navigator.clipboard.writeText(envVarStr)
      .then(() => { setCopied('env'); setTimeout(() => setCopied(null), 2000) })
      .catch(() => {})
  }

  return (
    <div style={{
      padding:      '14px 16px',
      background:   T.ink2,
      border:       `1px solid ${T.inkLine}`,
      borderRadius: 10,
      display:      'flex',
      flexDirection:'column',
      gap:          14,
    }}>

      {/* ── This device ─────────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <div style={{
            fontFamily: FONT_DISP, fontSize: 8, fontWeight: 800,
            letterSpacing: 2, color: T.textFaint, marginBottom: 6,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            THIS DEVICE
            {id && isAlreadyExcluded && (
              <span style={{
                fontFamily: FONT_DISP, fontSize: 7, fontWeight: 800,
                letterSpacing: 1, color: T.green, background: 'rgba(72,199,142,0.12)',
                border: `1px solid rgba(72,199,142,0.3)`, borderRadius: 3,
                padding: '1px 6px',
              }}>
                EXCLUDED ✓
              </span>
            )}
          </div>
          {id ? (
            <div style={{ fontFamily: FONT_NUM, fontSize: 12, color: T.textMute, letterSpacing: 0.4, wordBreak: 'break-all' }}>
              {id}
            </div>
          ) : (
            <div style={{ fontFamily: FONT_NUM, fontSize: 11, color: T.textGhost }}>
              No ID found — visit the app first to generate one.
            </div>
          )}
        </div>
        {id && (
          <button
            onClick={copyId}
            style={{
              flexShrink: 0, padding: '6px 16px',
              background:    copied === 'id' ? T.green : 'transparent',
              border:        `1px solid ${copied === 'id' ? T.green : T.inkLine}`,
              borderRadius:  7,
              color:         copied === 'id' ? '#fff' : T.textFaint,
              fontFamily:    FONT_DISP, fontWeight: 800,
              fontSize: 9, letterSpacing: 1.5, cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {copied === 'id' ? 'COPIED ✓' : 'COPY'}
          </button>
        )}
      </div>

      {/* ── Currently excluded IDs ───────────────────────── */}
      {excludedIds.length > 0 && (
        <div style={{ borderTop: `1px solid ${T.inkLineSft}`, paddingTop: 10 }}>
          <div style={{
            fontFamily: FONT_DISP, fontSize: 8, fontWeight: 800,
            letterSpacing: 2, color: T.textFaint, marginBottom: 8,
          }}>
            EXCLUDED  ·  {excludedIds.length} DEVICE{excludedIds.length !== 1 ? 'S' : ''}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {excludedIds.map((eid, i) => (
              <div key={eid} style={{
                fontFamily:  FONT_NUM, fontSize: 11, color: T.textGhost,
                letterSpacing: 0.3, wordBreak: 'break-all',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ color: T.textFaint, flexShrink: 0, fontSize: 9 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{eid}</span>
                {id && eid === id && (
                  <span style={{ fontFamily: FONT_DISP, fontSize: 7, color: T.ice, flexShrink: 0 }}>
                    ← this device
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Env var to set ───────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${T.inkLineSft}`, paddingTop: 10 }}>
        <div style={{
          fontFamily: FONT_DISP, fontSize: 8, fontWeight: 800,
          letterSpacing: 2, color: T.textFaint, marginBottom: 8,
        }}>
          {!isAlreadyExcluded && id
            ? 'SET THIS ENV VAR TO EXCLUDE ALL  (includes this device)'
            : 'CURRENT EXCLUSION ENV VAR'}
        </div>
        <div style={{
          fontFamily:   FONT_NUM, fontSize: 10, color: T.textMute,
          background:   T.ink3, border: `1px solid ${T.inkLine}`,
          borderRadius: 6, padding: '8px 10px',
          wordBreak: 'break-all', letterSpacing: 0.2, lineHeight: 1.6,
        }}>
          {envVarStr}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
          <button
            onClick={copyEnv}
            style={{
              padding: '6px 16px',
              background:   copied === 'env' ? T.green : 'transparent',
              border:       `1px solid ${copied === 'env' ? T.green : T.inkLine}`,
              borderRadius: 7,
              color:        copied === 'env' ? '#fff' : T.textFaint,
              fontFamily:   FONT_DISP, fontWeight: 800,
              fontSize: 9, letterSpacing: 1.5, cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {copied === 'env' ? 'COPIED ✓' : 'COPY ENV VAR'}
          </button>
          <div style={{ fontFamily: FONT_JP, fontSize: 10, color: T.textGhost, lineHeight: 1.6 }}>
            Vercel → Settings → Environment Variables →{' '}
            <span style={code}>EXCLUDED_ANON_IDS</span>
          </div>
        </div>
      </div>

    </div>
  )
}
