-- 31_create_review_analysis_results.sql
-- Review Analysis Results table for persistent storage and caching

CREATE TABLE IF NOT EXISTS public.review_analysis_results (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    analysis_identity VARCHAR(64) NOT NULL, -- SHA-256 hash (64 hex characters)
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    prompt_version VARCHAR(50) NOT NULL,
    temperature NUMERIC(3, 2) NOT NULL,
    max_output_tokens INTEGER NOT NULL,
    keyword VARCHAR(100) NOT NULL,
    review_count INTEGER NOT NULL,
    summary TEXT NOT NULL,
    strengths JSONB NOT NULL,
    weaknesses JSONB NOT NULL,
    complaints JSONB NOT NULL,
    jtbd JSONB NOT NULL,
    keywords JSONB NOT NULL,
    sentiment JSONB NOT NULL,
    prompt_tokens INTEGER NOT NULL,
    completion_tokens INTEGER NOT NULL,
    total_tokens INTEGER NOT NULL,
    processing_time_ms INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT pk_review_analysis_results PRIMARY KEY (id),
    CONSTRAINT uq_review_analysis_results_identity UNIQUE (analysis_identity)
);

COMMENT ON TABLE public.review_analysis_results IS 'AI를 통해 분석 완료된 고객 리뷰 분석 결과 및 캐시 히트용 테이블';
COMMENT ON COLUMN public.review_analysis_results.id IS '분석 결과 고유 식별 UUID';
COMMENT ON COLUMN public.review_analysis_results.analysis_identity IS '동일 분석 식별용 SHA-256 해시값';
COMMENT ON COLUMN public.review_analysis_results.provider IS 'AI 서비스 제공자 (예: gemini)';
COMMENT ON COLUMN public.review_analysis_results.model IS '사용된 LLM 모델명';
COMMENT ON COLUMN public.review_analysis_results.prompt_version IS '프롬프트 규칙 버전';
COMMENT ON COLUMN public.review_analysis_results.temperature IS '생성 온도 (다양성 파라미터)';
COMMENT ON COLUMN public.review_analysis_results.max_output_tokens IS '최대 출력 토큰 한도';
COMMENT ON COLUMN public.review_analysis_results.keyword IS '검색 핵심 키워드';
COMMENT ON COLUMN public.review_analysis_results.review_count IS '분석에 포함된 실제 리뷰 총 개수';
COMMENT ON COLUMN public.review_analysis_results.summary IS '고객 의견 전체 요약 텍스트';
COMMENT ON COLUMN public.review_analysis_results.strengths IS '주요 긍정 요인/강점 목록 (JSONB)';
COMMENT ON COLUMN public.review_analysis_results.weaknesses IS '주요 부정 요인/약점 목록 (JSONB)';
COMMENT ON COLUMN public.review_analysis_results.complaints IS '주요 불만 및 통증 유발 요소 목록 (JSONB)';
COMMENT ON COLUMN public.review_analysis_results.jtbd IS '고객 핵심 과업(JTBD) 목록 (JSONB)';
COMMENT ON COLUMN public.review_analysis_results.keywords IS '주요 빈출 키워드 목록 (JSONB)';
COMMENT ON COLUMN public.review_analysis_results.sentiment IS '긍정/중립/부정 감성 점수 비율 데이터 (JSONB)';
COMMENT ON COLUMN public.review_analysis_results.prompt_tokens IS '프롬프트 입력에 소비된 토큰 수';
COMMENT ON COLUMN public.review_analysis_results.completion_tokens IS '생성된 답변에 소비된 토큰 수';
COMMENT ON COLUMN public.review_analysis_results.total_tokens IS '총 소비된 토큰 수';
COMMENT ON COLUMN public.review_analysis_results.processing_time_ms IS 'AI 호출 및 처리에 걸린 소요 시간(ms)';
COMMENT ON COLUMN public.review_analysis_results.created_at IS '분석 생성 및 영속 등록 시간';

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_review_analysis_results_identity 
    ON public.review_analysis_results (analysis_identity);

CREATE INDEX IF NOT EXISTS idx_review_analysis_results_keyword 
    ON public.review_analysis_results (keyword);

CREATE INDEX IF NOT EXISTS idx_review_analysis_results_created_at_desc 
    ON public.review_analysis_results (created_at DESC);
