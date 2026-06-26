-- 17_sourcing_constraints.sql
-- Constraints for Sourcing & Margin Domain (PK, FK, Unique)

-- 1. sourcing_intelligences Constraints
ALTER TABLE public.sourcing_intelligences
    ADD CONSTRAINT pk_sourcing_intelligences PRIMARY KEY (sourcing_id);

ALTER TABLE public.sourcing_intelligences
    ADD CONSTRAINT fk_sourcing_intelligences_analysis_runs FOREIGN KEY (run_id)
    REFERENCES public.analysis_runs(run_id) ON DELETE CASCADE;

ALTER TABLE public.sourcing_intelligences
    ADD CONSTRAINT uq_sourcing_intelligences_run_id UNIQUE (run_id);

-- 2. margin_optimizations Constraints
ALTER TABLE public.margin_optimizations
    ADD CONSTRAINT pk_margin_optimizations PRIMARY KEY (margin_id);

ALTER TABLE public.margin_optimizations
    ADD CONSTRAINT fk_margin_optimizations_analysis_runs FOREIGN KEY (run_id)
    REFERENCES public.analysis_runs(run_id) ON DELETE CASCADE;

ALTER TABLE public.margin_optimizations
    ADD CONSTRAINT uq_margin_optimizations_run_id UNIQUE (run_id);
