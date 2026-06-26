-- 18_sourcing_indexes.sql
-- Indexes for Sourcing & Margin Domain (B-tree for FKs)

-- 1. sourcing_intelligences Indexes
CREATE INDEX IF NOT EXISTS idx_sourcing_intelligences_run_id 
    ON public.sourcing_intelligences USING btree (run_id);

-- 2. margin_optimizations Indexes
CREATE INDEX IF NOT EXISTS idx_margin_optimizations_run_id 
    ON public.margin_optimizations USING btree (run_id);
