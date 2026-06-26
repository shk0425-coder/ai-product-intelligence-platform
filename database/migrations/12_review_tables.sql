-- 12_review_tables.sql
-- Review Domain Tables (customer_reviews, review_embeddings, jtbd_profiles)

-- 1. customer_reviews Table
CREATE TABLE IF NOT EXISTS public.customer_reviews (
    review_id UUID NOT NULL,
    run_id UUID NOT NULL,
    raw_text TEXT NOT NULL,
    rating INTEGER NOT NULL,
    collected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.customer_reviews IS '수집된 고객 리뷰 원본 텍스트 데이터';
COMMENT ON COLUMN public.customer_reviews.review_id IS '리뷰 고유 UUID (수집 출처 식별자)';
COMMENT ON COLUMN public.customer_reviews.run_id IS '분석 실행 이력 참조 UUID';
COMMENT ON COLUMN public.customer_reviews.raw_text IS '고객 작성 원본 텍스트';
COMMENT ON COLUMN public.customer_reviews.rating IS '평가 별점 (정수형)';
COMMENT ON COLUMN public.customer_reviews.collected_at IS '리뷰 수집 일시 (월별 파티셔닝 기준 컬럼)';

-- 2. review_embeddings Table
CREATE TABLE IF NOT EXISTS public.review_embeddings (
    embedding_id UUID NOT NULL,
    review_id UUID NOT NULL,
    vector_embedding vector(1536) NOT NULL,
    collected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.review_embeddings IS '리뷰 텍스트의 고차원 벡터 임베딩 저장 테이블';
COMMENT ON COLUMN public.review_embeddings.embedding_id IS '임베딩 고유 UUID';
COMMENT ON COLUMN public.review_embeddings.review_id IS '참조 대상 리뷰 UUID';
COMMENT ON COLUMN public.review_embeddings.vector_embedding IS '1536차원 고차원 벡터 데이터 (pgvector)';
COMMENT ON COLUMN public.review_embeddings.collected_at IS '임베딩 생성/수집 일시 (복합키 및 파티셔닝 매핑용)';

-- 3. jtbd_profiles Table
CREATE TABLE IF NOT EXISTS public.jtbd_profiles (
    jtbd_id UUID NOT NULL DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL,
    context TEXT NOT NULL,
    job TEXT NOT NULL,
    persona JSONB NOT NULL,
    usage_scenario JSONB NOT NULL,
    purchase_trigger TEXT NOT NULL,
    emotional_outcome TEXT NOT NULL
);

COMMENT ON TABLE public.jtbd_profiles IS '리뷰 감성 분석을 통해 도출된 고객 과업(JTBD) 프로필';
COMMENT ON COLUMN public.jtbd_profiles.jtbd_id IS 'JTBD 프로필 고유 UUID';
COMMENT ON COLUMN public.jtbd_profiles.run_id IS '분석 실행 이력 참조 UUID (1:1 관계)';
COMMENT ON COLUMN public.jtbd_profiles.context IS '사용 맥락 및 배경';
COMMENT ON COLUMN public.jtbd_profiles.job IS '핵심 과업 (Core Job)';
COMMENT ON COLUMN public.jtbd_profiles.persona IS '대표 타겟 페르소나 데이터 (JSONB)';
COMMENT ON COLUMN public.jtbd_profiles.usage_scenario IS '사용 시나리오 데이터 (JSONB)';
COMMENT ON COLUMN public.jtbd_profiles.purchase_trigger IS '구매 트리거 요인';
COMMENT ON COLUMN public.jtbd_profiles.emotional_outcome IS '과업 완수 시 감성적 성과';
