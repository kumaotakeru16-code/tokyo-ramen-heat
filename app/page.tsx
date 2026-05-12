import { fetchHotNow } from '@/lib/fetch-rankings'
import HomeClient from '@/components/HomeClient'

export default async function HomePage() {
  const { data: hotNow, source } = await fetchHotNow()
  return <HomeClient hotNow={hotNow} dataSource={source} />
}
