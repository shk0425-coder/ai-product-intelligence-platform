BEGIN;

-- B-tree indexes for Foreign Keys
CREATE INDEX IF NOT EXISTS idx_market_metrics_run_id ON market_metrics (run_id);
CREATE INDEX IF NOT EXISTS idx_competitor_products_run_id ON competitor_products (run_id);

-- B-tree search index for commonly queried columns
CREATE INDEX IF NOT EXISTS idx_competitor_products_brand_name ON competitor_products (brand_name);

-- GIN index for JSONB column in market_metrics
CREATE INDEX IF NOT EXISTS idx_market_metrics_raw_trend_json ON market_metrics USING GIN (raw_trend_json);

COMMIT;
