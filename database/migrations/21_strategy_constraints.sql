BEGIN;

-- 1. Primary Keys
ALTER TABLE public.product_strategies ADD CONSTRAINT pk_product_strategies PRIMARY KEY (strategy_id);
ALTER TABLE public.creative_briefs ADD CONSTRAINT pk_creative_briefs PRIMARY KEY (brief_id);

-- 2. Unique Constraints
ALTER TABLE public.product_strategies ADD CONSTRAINT uq_product_strategies_run_id UNIQUE (run_id);
ALTER TABLE public.creative_briefs ADD CONSTRAINT uq_creative_briefs_run_id UNIQUE (run_id);

-- 3. Foreign Keys
ALTER TABLE public.product_strategies
    ADD CONSTRAINT fk_product_strategies_analysis_runs
    FOREIGN KEY (run_id) REFERENCES public.analysis_runs(run_id)
    ON DELETE CASCADE;

ALTER TABLE public.creative_briefs
    ADD CONSTRAINT fk_creative_briefs_analysis_runs
    FOREIGN KEY (run_id) REFERENCES public.analysis_runs(run_id)
    ON DELETE CASCADE;

COMMIT;
