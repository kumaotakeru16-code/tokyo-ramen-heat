'use client'

import { useState, useEffect } from 'react'
import { T, FONT_JP, FONT_DISP, FONT_NUM } from '@/lib/tokens'
import { dict, type Lang } from '@/lib/i18n'
import { track } from '@/lib/analytics'
import type { StoreTrend } from '@/lib/types'
import type { DataSource } from '@/lib/fetch-rankings'
import { NEW_ENTRIES, RATING_MOVERS, FALLING_WATCH } from '@/data/mockStores'

import LiveTicker      from './LiveTicker'
import Hero            from './Hero'
import CategoryTabs    from './CategoryTabs'
import SectionHeader   from './SectionHeader'
import CatDesc         from './CatDesc'
import FeaturedCard    from './FeaturedCard'
import RankingList     from './RankingList'
import CategoryPreview from './CategoryPreview'
import Footer          from './Footer'
import FlameMark       from './FlameMark'

type CatKey = 'hot' | 'new' | 'up' | 'down'

const HOT_INITIAL  = 5
const HOT_EXPANDED = 20

// ── 空状態（Supabase 設定済み・データ0件） ─────────────────────

function EmptyState({ lang }: { lang: Lang }) {
  const t = dict[lang]
  return (
    <div
      style={{
        padding: '48px 18px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        textAlign: 'center',
      }}
    >
      <FlameMark size={32} />
      <div>
        <div
          style={{
            fontFamily: FONT_DISP,
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 3,
            color: T.ember,
            marginBottom: 8,
          }}
        >
          {t.emptyKicker}
        </div>
        <div
          style={{
            fontFamily: FONT_JP,
            fontSize: 16,
            fontWeight: 700,
            color: T.white,
            lineHeight: 1.5,
          }}
        >
          {t.emptyTitle}
        </div>
        <div
          style={{
            fontFamily: FONT_JP,
            fontSize: 12,
            color: T.textMute,
            marginTop: 8,
            lineHeight: 1.7,
            maxWidth: 280,
            whiteSpace: 'pre-line',
          }}
        >
          {t.emptySub}
        </div>
      </div>
      <div
        style={{
          marginTop: 8,
          padding: '10px 16px',
          background: T.ink2,
          border: `1px solid ${T.inkLine}`,
          borderRadius: 8,
          fontFamily: FONT_NUM,
          fontSize: 11,
          color: T.textFaint,
          letterSpacing: 0.5,
        }}
      >
        POST /api/admin/import-places
      </div>
    </div>
  )
}

// ── ブラウザ言語検出 (初回訪問時のみ使用) ────────────────────────
function detectBrowserLang(): Lang {
  try {
    const primary = (navigator.languages?.[0] ?? navigator.language ?? '').toLowerCase()
    return primary.startsWith('ja') ? 'jp' : 'en'
  } catch {
    return 'jp'
  }
}

// ── メイン ────────────────────────────────────────────────────

interface HomeClientProps {
  hotNow:     StoreTrend[]
  dataSource: DataSource
}

export default function HomeClient({ hotNow, dataSource }: HomeClientProps) {
  const [tab,      setTab]      = useState<'week' | 'month'>('week')
  const [cat,      setCat]      = useState<CatKey>('hot')
  const [expanded, setExpanded] = useState(false)
  const [lang,     setLang]     = useState<Lang>('jp')

  // localStorage 復元 + page_view を1つの effect にまとめる
  // 保存済みがあればそれを最優先、なければブラウザ言語で自動判定
  useEffect(() => {
    const savedLang = localStorage.getItem('trh-lang') as Lang | null
    const effectiveLang: Lang = (savedLang === 'jp' || savedLang === 'en')
      ? savedLang
      : detectBrowserLang()
    setLang(effectiveLang)
    track({ event_name: 'page_view', path: '/', language: effectiveLang })
  // マウント時に1回だけ実行
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSetLang = (l: Lang) => {
    track({ event_name: 'language_change', language: l, metadata: { from: lang, to: l } })
    setLang(l)
    localStorage.setItem('trh-lang', l)
  }

  const handleSetCat = (k: string) => {
    setCat(k as CatKey)
    setExpanded(false)
    track({ event_name: 'category_view', language: lang, category: k })
  }

  const handleToggleExpand = () => {
    const willExpand = !expanded
    setExpanded(willExpand)
    track({
      event_name: willExpand ? 'expand_ranking' : 'collapse_ranking',
      language: lang,
      category: 'hot',
    })
  }

  const t = dict[lang]

  const period = tab === 'week' ? t.periodWeekly : t.periodMonthly

  const KICKER: Record<CatKey, string> = {
    hot:  t.kickerHot,
    new:  t.kickerNew,
    up:   t.kickerUp,
    down: t.kickerDown,
  }
  const TITLE: Record<CatKey, string> = {
    hot:  t.titleHot,
    new:  t.titleNew,
    up:   t.titleUp,
    down: t.titleDown,
  }

  const kicker = `${period} · ${KICKER[cat]}`
  const title  = TITLE[cat]

  const visibleHot = expanded
    ? Math.min(hotNow.length, HOT_EXPANDED)
    : Math.min(hotNow.length, HOT_INITIAL)

  const NON_HOT_COUNTS: Record<'new' | 'up' | 'down', number> = {
    new:  NEW_ENTRIES.length,
    up:   RATING_MOVERS.length,
    down: FALLING_WATCH.length,
  }

  const countLabel = cat === 'hot'
    ? t.topStores(visibleHot, hotNow.length)
    : t.storesDetected(NON_HOT_COUNTS[cat as 'new' | 'up' | 'down'])

  const hotIsEmpty = dataSource === 'supabase' && hotNow.length === 0

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        background: T.ink,
        color: T.text,
        minHeight: '100vh',
        fontFamily: FONT_JP,
        position: 'relative',
      }}
    >
      <LiveTicker />
      <Hero tab={tab} setTab={setTab} lang={lang} setLang={handleSetLang} />

      <CategoryTabs active={cat} setActive={handleSetCat} lang={lang} />

      <SectionHeader kicker={kicker} title={title} countLabel={countLabel} />

      <CatDesc cat={cat} lang={lang} />

      {cat === 'hot' ? (
        hotIsEmpty ? (
          <EmptyState lang={lang} />
        ) : (
          <>
            <FeaturedCard item={hotNow[0]} lang={lang} />

            <RankingList items={hotNow.slice(1, visibleHot)} lang={lang} category="hot" />

            {hotNow.length > HOT_INITIAL && (
              <div style={{ padding: '16px 18px 0' }}>
                <button
                  onClick={handleToggleExpand}
                  style={{
                    width: '100%',
                    padding: '11px',
                    background: 'transparent',
                    border: `1px solid ${T.inkLine}`,
                    borderRadius: 10,
                    color: T.textMute,
                    fontFamily: FONT_JP,
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: 'pointer',
                    letterSpacing: 1,
                  }}
                >
                  {expanded
                    ? t.collapse
                    : t.showMore(Math.min(hotNow.length, HOT_EXPANDED))}
                </button>
              </div>
            )}
          </>
        )
      ) : (
        <div style={{ padding: '0 18px' }}>
          <CategoryPreview cat={cat} lang={lang} />
        </div>
      )}

      <Footer lang={lang} />
    </div>
  )
}
