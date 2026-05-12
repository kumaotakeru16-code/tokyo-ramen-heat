import type { StoreTrend } from '@/lib/types'
import type { Lang } from '@/lib/i18n'
import RankRow from './RankRow'

interface RankingListProps {
  items:     StoreTrend[]
  lang:      Lang
  category?: string
}

export default function RankingList({ items, lang, category = 'hot' }: RankingListProps) {
  return (
    <div style={{ marginTop: 18 }}>
      {items.map(item => (
        <RankRow key={item.rank} item={item} lang={lang} category={category} />
      ))}
    </div>
  )
}
