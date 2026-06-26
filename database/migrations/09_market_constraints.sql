BEGIN;

-- 1. Primary Keys
ALTER TABLE market_metrics ADD CONSTRAINT pk_market_metrics PRIMARY KEY (metric_id);
ALTER TABLE competitor_products ADD CONSTRAINT pk_competitor_products PRIMARY KEY (comp_product_id);

-- 2. Unique Constraints
ALTER TABLE market_metrics ADD CONSTRAINT uq_market_metrics_run_id UNIQUE (run_id);

-- 3. Foreign Keys
ALTER TABLE market_metrics 
    ADD CONSTRAINT fk_market_metrics_analysis_runs 
    FOREIGN KEY (run_id) REFERENCES analysis_runs(run_id) 
    ON DELETE CASCADE;

ALTER TABLE competitor_products 
    ADD CONSTRAINT fk_competitor_products_analysis_runs 
    FOREIGN KEY (run_id) REFERENCES analysis_runs(run_id) 
    ON DELETE CASCADE;

COMMIT;
