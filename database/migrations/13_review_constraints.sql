-- 13_review_constraints.sql
-- Constraints for Review Domain (PK, FK, Unique)

-- 1. customer_reviews Constraints
ALTER TABLE public.customer_reviews
    ADD CONSTRAINT pk_customer_reviews PRIMARY KEY (review_id, collected_at);

ALTER TABLE public.customer_reviews
    ADD CONSTRAINT fk_customer_reviews_analysis_runs FOREIGN KEY (run_id)
    REFERENCES public.analysis_runs(run_id) ON DELETE CASCADE;

-- 2. review_embeddings Constraints
ALTER TABLE public.review_embeddings
    ADD CONSTRAINT pk_review_embeddings PRIMARY KEY (embedding_id, collected_at);

ALTER TABLE public.review_embeddings
    ADD CONSTRAINT fk_review_embeddings_customer_reviews FOREIGN KEY (review_id, collected_at)
    REFERENCES public.customer_reviews(review_id, collected_at) ON DELETE CASCADE;

-- 3. jtbd_profiles Constraints
ALTER TABLE public.jtbd_profiles
    ADD CONSTRAINT pk_jtbd_profiles PRIMARY KEY (jtbd_id);

ALTER TABLE public.jtbd_profiles
    ADD CONSTRAINT fk_jtbd_profiles_analysis_runs FOREIGN KEY (run_id)
    REFERENCES public.analysis_runs(run_id) ON DELETE CASCADE;

ALTER TABLE public.jtbd_profiles
    ADD CONSTRAINT uq_jtbd_profiles_run_id UNIQUE (run_id);
