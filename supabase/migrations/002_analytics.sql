-- ──────────────────────────────────────────────────────────────
-- Tokyo Ramen Heat — Analytics Events
-- イベント名やmetadataは将来 Gadget Heat / Creator Gear Heat でも流用できる構造
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS analytics_events (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  anon_user_id TEXT        NOT NULL,
  event_name   TEXT        NOT NULL,
  path         TEXT,
  language     TEXT,
  category     TEXT,
  store_id     UUID,
  store_name   TEXT,
  area         TEXT,
  metadata     JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ae_created_at    ON analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ae_event_name    ON analytics_events (event_name);
CREATE INDEX IF NOT EXISTS idx_ae_anon_user_id  ON analytics_events (anon_user_id);
CREATE INDEX IF NOT EXISTS idx_ae_category      ON analytics_events (category);
CREATE INDEX IF NOT EXISTS idx_ae_store_id      ON analytics_events (store_id);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- INSERT: API経由（service_role）でのみ挿入。クライアントから直接アクセスは不要
-- SELECT: service_role は RLS をバイパスするため adminページで読み取り可能
-- anon/authenticated ユーザーは読み取り不可
CREATE POLICY "deny_public_select" ON analytics_events
  FOR SELECT TO anon, authenticated USING (false);
