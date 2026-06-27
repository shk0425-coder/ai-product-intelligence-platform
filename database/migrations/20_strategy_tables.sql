BEGIN;

-- 1. product_strategies Table
CREATE TABLE IF NOT EXISTS public.product_strategies (
    strategy_id UUID NOT NULL DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL,
    target_segment JSONB NOT NULL,
    product_concept JSONB NOT NULL,
    core_usps JSONB NOT NULL
);

COMMENT ON TABLE public.product_strategies IS '등급 통과 제품에 한해 수립된 상품화 기획 보고서 테이블';
COMMENT ON COLUMN public.product_strategies.strategy_id IS '상품화 기획 보고서 고유 식별 UUID';
COMMENT ON COLUMN public.product_strategies.run_id IS '분석 실행 이력 참조 UUID (1:1 관계)';
COMMENT ON COLUMN public.product_strategies.target_segment IS '대표 타겟 고객 세그먼트 정보 (JSONB)';
COMMENT ON COLUMN public.product_strategies.product_concept IS '상품 컨셉 정의 (JSONB)';
COMMENT ON COLUMN public.product_strategies.core_usps IS '핵심 차별화 포인트(USP) 정의 (JSONB)';

-- 2. creative_briefs Table
CREATE TABLE IF NOT EXISTS public.creative_briefs (
    brief_id UUID NOT NULL DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL,
    hero_copy TEXT NOT NULL,
    storyboard JSONB NOT NULL,
    thumbnail_guide JSONB NOT NULL
);

COMMENT ON TABLE public.creative_briefs IS '썸네일 디자인 지침 및 상세페이지(랜딩페이지) 기획서 테이블';
COMMENT ON COLUMN public.creative_briefs.brief_id IS '크리에이티브 기획서 고유 식별 UUID';
COMMENT ON COLUMN public.creative_briefs.run_id IS '분석 실행 이력 참조 UUID (1:1 관계)';
COMMENT ON COLUMN public.creative_briefs.hero_copy IS '상세페이지 상단 메인 카피 문구';
COMMENT ON COLUMN public.creative_briefs.storyboard IS '8단계 상세페이지 기획 스토리보드 흐름 (JSONB)';
COMMENT ON COLUMN public.creative_briefs.thumbnail_guide IS '메인 및 서브 썸네일 디자인 가이드 (JSONB)';

COMMIT;
