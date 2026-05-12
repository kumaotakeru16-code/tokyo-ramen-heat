export type Lang = 'jp' | 'en'

export const dict = {
  jp: {
    // ── Hero ─────────────────────────────────────────────────
    headLine1: '今、東京で',
    headGrad:  '熱い',
    headLine2: 'ラーメン店。',
    subcopy:   'Googleレビューの増加と評価変化から、\n急上昇中の店を可視化。',
    scoreChip: 'SCORE = レビュー増加数 × 評価変化',
    tabWeek: '今週', tabWeekSub: 'リアルタイム',
    tabMonth: '今月', tabMonthSub: '安定上昇',
    monitoring: (n: number) => `都内 ${n} 店監視中`,

    // ── Category tabs ─────────────────────────────────────────
    catHot: '急上昇', catNew: '初ランクイン',
    catUp: '評価急上昇', catDown: '急落ウォッチ',

    // ── Section header ────────────────────────────────────────
    periodWeekly: 'WEEKLY', periodMonthly: 'MONTHLY',
    kickerHot: 'TREND RANKING', kickerNew: 'NEW ENTRIES',
    kickerUp: 'RATING MOVERS', kickerDown: 'WATCH LIST',
    titleHot: '急上昇 RANKING', titleNew: '初ランクイン',
    titleUp: '評価急上昇', titleDown: '急落ウォッチ',

    // ── CatDesc ───────────────────────────────────────────────
    descHotLabel: '急上昇',    descNewLabel: '初ランクイン',
    descUpLabel: '評価急上昇', descDownLabel: '急落ウォッチ',
    descHot:  '直近7日でレビュー数と評価が大きく動いた店舗を表示します。',
    descNew:  '今回新たにランキング圏内に入った店舗を表示します。',
    descUp:   '評価値（★）が上昇した店舗を表示します。',
    descDown: '注目は増えているのに、評価が下がった店舗を観察します。',

    // ── カード共通 ────────────────────────────────────────────
    mapsLink: 'Google Mapsで見る', mapsLinkShort: 'Google Maps',
    reviews: 'reviews',
    storesDetected: (n: number) => `${n} stores detected`,
    topStores: (v: number, total: number) => `Top ${v} / ${total} stores`,
    showMore: (n: number) => `もっと見る (Top${n}) →`,
    collapse: 'Top5に戻す ↑',

    // ── FeaturedCard ──────────────────────────────────────────
    featWeekLabel: '🔥 今週 +REVIEWS', feat7days: '7 DAYS',
    featInitTitle: '初回スナップショット取得済み',
    featInitSub:   'レビュー増加数は次回更新後に表示',

    // ── RankRow ───────────────────────────────────────────────
    rankInitLabel: '🔥 初回データ', rankWeekLabel: '🔥 今週 / 7d',
    rankInitNext: '次回更新後',

    // ── CategoryPreview ───────────────────────────────────────
    ratingRise: '評価上昇', ratingFall: '評価低下',

    // ── EmptyState ────────────────────────────────────────────
    emptyKicker: 'COLLECTING DATA',
    emptyTitle:  'データ収集中',
    emptySub:    'import API を実行してください。\n初回インポート後にランキングが表示されます。',

    // ── Footer ────────────────────────────────────────────────
    footerAbout: 'Google Maps の評価とレビュー数の変化を解析し、東京23区のラーメン店をデイリーで集計しています。',
    footerData:  'データ提供: Google',
  },

  en: {
    // ── Hero ─────────────────────────────────────────────────
    headLine1: 'Trending ramen shops',
    headGrad:  'right now.',
    headLine2: 'in Tokyo,',
    subcopy:   'Ranked by Google review momentum\nand rating changes.',
    scoreChip: 'SCORE = review growth × rating change',
    tabWeek: 'Weekly', tabWeekSub: 'Real-time',
    tabMonth: 'Monthly', tabMonthSub: 'Steady rise',
    monitoring: (n: number) => `${n} shops in Tokyo`,

    // ── Category tabs ─────────────────────────────────────────
    catHot: 'Trending', catNew: 'New Entries',
    catUp: 'Rating Movers', catDown: 'Watch List',

    // ── Section header ────────────────────────────────────────
    periodWeekly: 'WEEKLY', periodMonthly: 'MONTHLY',
    kickerHot: 'TREND RANKING', kickerNew: 'NEW ENTRIES',
    kickerUp: 'RATING MOVERS', kickerDown: 'WATCH LIST',
    titleHot: 'Trending RANKING', titleNew: 'New Entries',
    titleUp: 'Rating Movers', titleDown: 'Watch List',

    // ── CatDesc ───────────────────────────────────────────────
    descHotLabel: 'Trending',     descNewLabel: 'New Entries',
    descUpLabel: 'Rating Movers', descDownLabel: 'Watch List',
    descHot:  'Shops with the strongest review and rating momentum over the last 7 days.',
    descNew:  'Shops newly entering the ranking this week.',
    descUp:   'Shops with rising Google ratings.',
    descDown: 'Shops gaining attention while their ratings are falling.',

    // ── カード共通 ────────────────────────────────────────────
    mapsLink: 'View on Google Maps', mapsLinkShort: 'Google Maps',
    reviews: 'reviews',
    storesDetected: (n: number) => `${n} stores detected`,
    topStores: (v: number, total: number) => `Top ${v} / ${total} stores`,
    showMore: (n: number) => `Show more (Top ${n}) →`,
    collapse: 'Back to Top 5 ↑',

    // ── FeaturedCard ──────────────────────────────────────────
    featWeekLabel: '🔥 +REVIEWS THIS WEEK', feat7days: '7 DAYS',
    featInitTitle: 'Initial snapshot recorded',
    featInitSub:   'Review growth will appear after next update',

    // ── RankRow ───────────────────────────────────────────────
    rankInitLabel: '🔥 New data', rankWeekLabel: '🔥 Week / 7d',
    rankInitNext: 'after next update',

    // ── CategoryPreview ───────────────────────────────────────
    ratingRise: 'Rating rise', ratingFall: 'Rating fall',

    // ── EmptyState ────────────────────────────────────────────
    emptyKicker: 'COLLECTING DATA',
    emptyTitle:  'Collecting data',
    emptySub:    'Run the import API to get started.\nRankings will appear after the first import.',

    // ── Footer ────────────────────────────────────────────────
    footerAbout: 'We analyze Google Maps ratings and review counts, tracking ramen shops across Tokyo 23 wards daily.',
    footerData:  'Data: Google',
  },
} as const

export type Dict = typeof dict.jp
