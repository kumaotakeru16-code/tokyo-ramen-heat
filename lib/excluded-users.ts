// ── Analytics exclusion list ───────────────────────────────────
// Add your own anon_user_id here to exclude your visits from analytics.
// Your ID is shown on the /admin → Analytics screen (YOUR ANON ID section).
//
// You can also set EXCLUDED_ANON_IDS=id1,id2 in .env.local / Vercel env
// to avoid touching this file.

export const EXCLUDED_ANON_USER_IDS: string[] = [
  // '6c21d056-be25-468e-9717-47c37ceb5e7d',
]

function buildExcludedSet(): Set<string> {
  const fromEnv = (process.env.EXCLUDED_ANON_IDS ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
  return new Set([...EXCLUDED_ANON_USER_IDS, ...fromEnv])
}

export const EXCLUDED_IDS: Set<string> = buildExcludedSet()
