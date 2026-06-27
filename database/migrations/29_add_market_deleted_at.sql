-- market_metrics table soft delete column addition
ALTER TABLE market_metrics
ADD COLUMN deleted_at TIMESTAMPTZ NULL;

COMMENT ON COLUMN market_metrics.deleted_at IS '소프트 딜리트 삭제 처리 일시';
