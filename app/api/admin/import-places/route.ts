import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// ── 対象エリア ────────────────────────────────────────────────
const AREAS = [
  '新宿', '渋谷', '池袋', '上野', '神田',
  '秋葉原', '吉祥寺', '荻窪', '高円寺', '東京駅',
] as const

const PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchText'

// ── Google Places API 型 ──────────────────────────────────────
type PlaceResult = {
  id: string
  displayName: { text: string; languageCode: string }
  formattedAddress: string
  rating?: number
  userRatingCount?: number
  googleMapsUri: string
  location: { latitude: number; longitude: number }
}

type PlacesResponse = {
  places?: PlaceResult[]
}

// ── エリア単位の検索 ──────────────────────────────────────────
async function searchPlacesByArea(
  area: string,
  apiKey: string,
): Promise<PlaceResult[]> {
  const res = await fetch(PLACES_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': [
        'places.id',
        'places.displayName',
        'places.formattedAddress',
        'places.rating',
        'places.userRatingCount',
        'places.googleMapsUri',
        'places.location',
      ].join(','),
    },
    body: JSON.stringify({
      textQuery: `${area} ラーメン`,
      languageCode: 'ja',
      regionCode: 'JP',
      maxResultCount: 20,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Places API ${res.status} for "${area}": ${body}`)
  }

  const data: PlacesResponse = await res.json()
  return data.places ?? []
}

// ── POST ハンドラ ─────────────────────────────────────────────
export async function POST(request: Request) {
  // ---- 簡易管理認証 ----
  const secret = request.headers.get('x-admin-secret')
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GOOGLE_PLACES_API_KEY is not set' },
      { status: 500 },
    )
  }

  const supabase = createAdminClient()

  // ── メトリクスカウンター ───────────────────────────────────
  let processedAreas   = 0   // 正常処理できたエリア数
  let fetchedPlaces    = 0   // Google API が返した総件数
  let storesUpserted   = 0   // stores テーブルへの upsert 成功数
  let snapshotsInserted = 0  // store_snapshots への insert 成功数
  let duplicatesMerged = 0   // 同一 google_place_id の重複（今回実行内）

  const errors: string[] = []

  // 今回の実行内で処理済みの place_id を追跡（クロスエリア重複の検出）
  const seenPlaceIds = new Set<string>()

  for (const area of AREAS) {
    let places: PlaceResult[] = []

    try {
      places = await searchPlacesByArea(area, apiKey)
    } catch (err) {
      errors.push(`[${area}] Places API error: ${String(err)}`)
      continue
    }

    fetchedPlaces += places.length

    for (const place of places) {
      // ── クロスエリア重複チェック ──────────────────────────
      if (seenPlaceIds.has(place.id)) {
        duplicatesMerged++
        continue // 同一実行内での重複はスキップ
      }
      seenPlaceIds.add(place.id)

      // ── stores upsert (google_place_id でユニーク) ────────
      const { data: store, error: storeErr } = await supabase
        .from('stores')
        .upsert(
          {
            name:            place.displayName.text,
            area,
            google_place_id: place.id,
            google_maps_url: place.googleMapsUri,
            address:         place.formattedAddress,
            lat:             place.location.latitude,
            lng:             place.location.longitude,
          },
          { onConflict: 'google_place_id' },
        )
        .select('id')
        .single()

      if (storeErr || !store) {
        errors.push(
          `[${area}] store upsert failed for "${place.displayName.text}": ${storeErr?.message ?? 'no data'}`,
        )
        continue
      }
      storesUpserted++

      // ── store_snapshots insert ────────────────────────────
      const { error: snapErr } = await supabase
        .from('store_snapshots')
        .insert({
          store_id:     store.id,
          rating:       place.rating            ?? null,
          review_count: place.userRatingCount   ?? null,
        })

      if (snapErr) {
        errors.push(
          `[${area}] snapshot insert failed for "${place.displayName.text}": ${snapErr.message}`,
        )
        continue
      }
      snapshotsInserted++
    }

    processedAreas++

    // Places API レートリミット対策: エリア間に 250ms のウェイト
    await new Promise(r => setTimeout(r, 250))
  }

  return NextResponse.json({
    ok:               true,
    processedAreas,
    fetchedPlaces,
    storesUpserted,
    snapshotsInserted,
    duplicatesMerged,
    errors:           errors.length > 0 ? errors : undefined,
  })
}
