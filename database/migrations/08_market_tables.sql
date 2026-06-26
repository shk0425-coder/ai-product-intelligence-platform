BEGIN;

-- market_metrics table
CREATE TABLE IF NOT EXISTS market_metrics (
    metric_id UUID NOT NULL DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL,
    total_monthly_search INTEGER NOT NULL,
    trend_slope NUMERIC(6,3) NOT NULL,
    seasonality_classification VARCHAR(20) NOT NULL,
    raw_trend_json JSONB NOT NULL
);

COMMENT ON TABLE market_metrics IS '시장 전체 정량 수요 통계 테이블';
COMMENT ON COLUMN market_metrics.metric_id IS '수요 통계 고유 식별 UUID';
COMMENT ON COLUMN market_metrics.run_id IS '연관된 분석 실행 ID (1:1)';
COMMENT ON COLUMN market_metrics.total_monthly_search IS '최근 월간 총 검색량';
COMMENT ON COLUMN market_metrics.trend_slope IS '12개월 검색 트렌드 추세선 기울기';
COMMENT ON COLUMN market_metrics.seasonality_classification IS '시즌성 분류 등급 (HIGH | MEDIUM | LOW)';
COMMENT ON COLUMN market_metrics.raw_trend_json IS '일자별 원시 검색 트렌드 수치 배열 캐시';

-- competitor_products table
CREATE TABLE IF NOT EXISTS competitor_products (
    comp_product_id UUID NOT NULL DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL,
    rank INTEGER NOT NULL,
    brand_name VARCHAR(100) NOT NULL,
    mall_type VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL,
    review_count INTEGER NOT NULL,
    raw_mall_name VARCHAR(100) NULL
);

COMMENT ON TABLE competitor_products IS '수집 시점 상위 경쟁 상품 목록 테이블';
COMMENT ON COLUMN competitor_products.comp_product_id IS '경쟁 상품 고유 식별 UUID';
COMMENT ON COLUMN competitor_products.run_id IS '연관된 분석 실행 ID';
COMMENT ON COLUMN competitor_products.rank IS '노출 순위';
COMMENT ON COLUMN competitor_products.brand_name IS '브랜드명';
COMMENT ON COLUMN competitor_products.mall_type IS '쇼핑몰 유형 (스마트스토어 | 브랜드스토어 | 대형몰 등)';
COMMENT ON COLUMN competitor_products.price IS '판매 가격 (원)';
COMMENT ON COLUMN competitor_products.review_count IS '누적 리뷰 수';
COMMENT ON COLUMN competitor_products.raw_mall_name IS '수집된 원본 쇼핑몰 이름';

COMMIT;
