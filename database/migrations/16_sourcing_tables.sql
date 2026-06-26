-- 16_sourcing_tables.sql
-- Sourcing & Margin Domain Tables (sourcing_intelligences, margin_optimizations)

-- 1. sourcing_intelligences Table
CREATE TABLE IF NOT EXISTS public.sourcing_intelligences (
    sourcing_id UUID NOT NULL DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL,
    supplier_platform VARCHAR(50) NOT NULL,
    cost_krw NUMERIC NOT NULL,
    moq INTEGER NOT NULL,
    oem_availability BOOLEAN NOT NULL DEFAULT FALSE,
    kc_certification_type VARCHAR(100) NOT NULL,
    patent_risk_level VARCHAR(20) NOT NULL
);

COMMENT ON TABLE public.sourcing_intelligences IS '실제 소싱 가용성 정보 및 위험 요소 진단서';
COMMENT ON COLUMN public.sourcing_intelligences.sourcing_id IS '소싱 인텔리전스 고유 UUID';
COMMENT ON COLUMN public.sourcing_intelligences.run_id IS '분석 실행 이력 참조 UUID (1:1 관계)';
COMMENT ON COLUMN public.sourcing_intelligences.supplier_platform IS '공급처 플랫폼 (1688 | Alibaba | Domestic 등)';
COMMENT ON COLUMN public.sourcing_intelligences.cost_krw IS '소싱 원가 (KRW - NUMERIC 타입으로 소수점 연산 오차 방지)';
COMMENT ON COLUMN public.sourcing_intelligences.moq IS '최소 주문 수량 (Minimum Order Quantity)';
COMMENT ON COLUMN public.sourcing_intelligences.oem_availability IS 'OEM 생산 가능 여부';
COMMENT ON COLUMN public.sourcing_intelligences.kc_certification_type IS 'KC 인증 필요 유형 및 정보';
COMMENT ON COLUMN public.sourcing_intelligences.patent_risk_level IS '특허 침해 및 상표 위험도 수준 (HIGH | MEDIUM | LOW)';

-- 2. margin_optimizations Table
CREATE TABLE IF NOT EXISTS public.margin_optimizations (
    margin_id UUID NOT NULL DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL,
    proposed_price NUMERIC NOT NULL,
    net_margin NUMERIC NOT NULL,
    margin_ratio NUMERIC(4,2) NOT NULL,
    break_even_roas NUMERIC(6,2) NOT NULL,
    target_cpa NUMERIC NOT NULL
);

COMMENT ON TABLE public.margin_optimizations IS '가격대별 예상 시뮬레이션 마진 모델';
COMMENT ON COLUMN public.margin_optimizations.margin_id IS '마진 최적화 정보 고유 UUID';
COMMENT ON COLUMN public.margin_optimizations.run_id IS '분석 실행 이력 참조 UUID (1:1 관계)';
COMMENT ON COLUMN public.margin_optimizations.proposed_price IS '제안 판매가 (NUMERIC)';
COMMENT ON COLUMN public.margin_optimizations.net_margin IS '예상 순마진 금액 (NUMERIC)';
COMMENT ON COLUMN public.margin_optimizations.margin_ratio IS '순마진 비율 (NUMERIC)';
COMMENT ON COLUMN public.margin_optimizations.break_even_roas IS '손익분기 광고 수익률 (Break-Even ROAS, %단위)';
COMMENT ON COLUMN public.margin_optimizations.target_cpa IS '목표 타겟 CPA (Cost Per Acquisition, NUMERIC)';
