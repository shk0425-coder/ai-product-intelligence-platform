BEGIN;

-- 1. B-tree indexes for Foreign Keys
CREATE INDEX IF NOT EXISTS idx_product_strategies_run_id 
    ON public.product_strategies USING btree (run_id);

CREATE INDEX IF NOT EXISTS idx_creative_briefs_run_id 
    ON public.creative_briefs USING btree (run_id);

-- 2. GIN index for JSONB column defined as search target in the architecture
CREATE INDEX IF NOT EXISTS idx_creative_briefs_storyboard 
    ON public.creative_briefs USING GIN (storyboard);

COMMIT;
