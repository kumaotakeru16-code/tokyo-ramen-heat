-- ──────────────────────────────────────────────────────────────
-- Tokyo Ramen Heat — 初期スキーマ
-- ──────────────────────────────────────────────────────────────

-- stores: 店舗マスタ（google_place_id が一意キー）
CREATE TABLE IF NOT EXISTS stores (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT        NOT NULL,
  area             TEXT,
  google_place_id  TEXT        UNIQUE NOT NULL,
  google_maps_url  TEXT,
  address          TEXT,
  lat              DOUBLE PRECISION,
  lng              DOUBLE PRECISION,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- store_snapshots: 評価・レビュー数のスナップショット（定期取得ごとに1行）
CREATE TABLE IF NOT EXISTS store_snapshots (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id     UUID        NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  rating       NUMERIC(3,1),
  review_count INTEGER,
  captured_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── インデックス ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_snapshots_store_id
  ON store_snapshots(store_id);

CREATE INDEX IF NOT EXISTS idx_snapshots_captured_at
  ON store_snapshots(captured_at DESC);

-- store × 時系列の結合クエリに使う複合インデックス
CREATE INDEX IF NOT EXISTS idx_snapshots_store_captured
  ON store_snapshots(store_id, captured_at DESC);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE stores          ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_snapshots ENABLE ROW LEVEL SECURITY;

-- 公開読み取り（アプリのランキング表示用）
CREATE POLICY "stores_public_read"
  ON stores FOR SELECT USING (true);

CREATE POLICY "snapshots_public_read"
  ON store_snapshots FOR SELECT USING (true);

-- 書き込みは service_role のみ（API ルートで使用）
-- service_role は RLS をバイパスするため追加ポリシー不要
