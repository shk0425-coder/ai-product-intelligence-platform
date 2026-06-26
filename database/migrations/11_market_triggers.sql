BEGIN;

-- Note: No triggers are defined in this migration.
-- market_metrics and competitor_products are snapshot/history-nature tables 
-- that do not contain updated_at columns in the specification, so updated_at triggers are omitted.

COMMIT;
