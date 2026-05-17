import { fetchAllData } from '@/lib/fetch-rankings'
import HomeClient from '@/components/HomeClient'

export default async function HomePage() {
  const result = await fetchAllData()
  return <HomeClient {...result} />
}
