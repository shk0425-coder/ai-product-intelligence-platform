-- 14_review_indexes.sql
-- Indexes for Review Domain (B-tree for FKs, GIN for JSONB)

-- 1. customer_reviews Indexes
CREATE INDEX IF NOT EXISTS idx_customer_reviews_run_id 
    ON public.customer_reviews USING btree (run_id);

-- 2. review_embeddings Indexes
-- customer_reviews의 복합 기본키를 참조하는 복합 외래키(review_id, collected_at) 성능 최적화용 B-tree 인덱스
CREATE INDEX IF NOT EXISTS idx_review_embeddings_review_composite 
    ON public.review_embeddings USING btree (review_id, collected_at);

-- 3. jtbd_profiles Indexes
CREATE INDEX IF NOT EXISTS idx_jtbd_profiles_run_id 
    ON public.jtbd_profiles USING btree (run_id);

-- JSONB 검색 가속을 위한 GIN 인덱싱
CREATE INDEX IF NOT EXISTS idx_jtbd_profiles_persona 
    ON public.jtbd_profiles USING gin (persona);

CREATE INDEX IF NOT EXISTS idx_jtbd_profiles_usage_scenario 
    ON public.jtbd_profiles USING gin (usage_scenario);
