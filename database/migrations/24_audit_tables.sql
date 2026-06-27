BEGIN;

-- 1. decision_audits Table
CREATE TABLE IF NOT EXISTS public.decision_audits (
    audit_id UUID NOT NULL DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL,
    score_breakdown JSONB NOT NULL,
    grade_rationale TEXT NOT NULL,
    confidence_score NUMERIC(5,2) NOT NULL
);

COMMENT ON TABLE public.decision_audits IS '등급 판정(S~D) 시 룰 엔진이 가중 연산한 결과 및 근거 보존 테이블';
COMMENT ON COLUMN public.decision_audits.audit_id IS '의사결정 감사 기록 고유 식별 UUID';
COMMENT ON COLUMN public.decision_audits.run_id IS '연관된 분석 실행 ID (1:1 관계)';
COMMENT ON COLUMN public.decision_audits.score_breakdown IS '가중치 계산 세부 결과 로그 데이터 (JSONB)';
COMMENT ON COLUMN public.decision_audits.grade_rationale IS '등급 판정 근거 및 사유 설명';
COMMENT ON COLUMN public.decision_audits.confidence_score IS '수집 및 분석 신뢰도 지수';

-- 2. knowledge_assets Table
CREATE TABLE IF NOT EXISTS public.knowledge_assets (
    asset_id UUID NOT NULL DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    source_run_id UUID NULL,
    category knowledge_category NOT NULL,
    winning_formula TEXT NOT NULL,
    created_by_agent VARCHAR(50) NOT NULL,
    quality_score NUMERIC(4,2) NOT NULL DEFAULT 0.00,
    usage_count INTEGER NOT NULL DEFAULT 0,
    last_used_at TIMESTAMPTZ NULL,
    promoted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.knowledge_assets IS '판매 성과가 증명되어 AI의 Few-shot 지식 사전에 등록된 검증된 지식 에셋 테이블';
COMMENT ON COLUMN public.knowledge_assets.asset_id IS '지식 에셋 고유 식별 UUID';
COMMENT ON COLUMN public.knowledge_assets.workspace_id IS '소속 작업 공간 UUID';
COMMENT ON COLUMN public.knowledge_assets.source_run_id IS '지식 승격의 원천이 된 분석 실행 ID (삭제 시 SET NULL)';
COMMENT ON COLUMN public.knowledge_assets.category IS '지식 에셋 카테고리 (JTBD_PATTERN | USP_FORMULA | COPY_SUCCESS)';
COMMENT ON COLUMN public.knowledge_assets.winning_formula IS '검증된 성공 공식/지식 템플릿 내용';
COMMENT ON COLUMN public.knowledge_assets.created_by_agent IS '에셋을 생성한 에이전트 식별자';
COMMENT ON COLUMN public.knowledge_assets.quality_score IS '지식의 등급 및 성공 기여도 평가 점수';
COMMENT ON COLUMN public.knowledge_assets.usage_count IS 'Few-shot 매핑 및 참조 누적 횟수';
COMMENT ON COLUMN public.knowledge_assets.last_used_at IS '최근 참조/사용 일시';
COMMENT ON COLUMN public.knowledge_assets.promoted_at IS '지식 에셋 승격 등록 일시';

-- 3. learning_feedback_logs Table
CREATE TABLE IF NOT EXISTS public.learning_feedback_logs (
    log_id UUID NOT NULL DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL,
    actual_sales_data JSONB NOT NULL,
    adjusted_weights JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.learning_feedback_logs IS '실제 성과와 예측치를 상호 분석하여 가중치 조정을 제안한 기록 테이블';
COMMENT ON COLUMN public.learning_feedback_logs.log_id IS '학습 피드백 로그 고유 식별 UUID';
COMMENT ON COLUMN public.learning_feedback_logs.run_id IS '연관된 분석 실행 ID';
COMMENT ON COLUMN public.learning_feedback_logs.actual_sales_data IS '실제 판매 실적 데이터 (JSONB)';
COMMENT ON COLUMN public.learning_feedback_logs.adjusted_weights IS '보정된 추천 가중치 데이터 (JSONB)';
COMMENT ON COLUMN public.learning_feedback_logs.created_at IS '로그 기록 생성 일시';

COMMIT;
