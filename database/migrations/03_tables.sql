BEGIN;

-- organizations table
CREATE TABLE IF NOT EXISTS organizations (
    org_id UUID NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE organizations IS '최상위 고객 회사/단체 계정 테이블';
COMMENT ON COLUMN organizations.org_id IS '조직 고유 식별 UUID';
COMMENT ON COLUMN organizations.name IS '조직명';
COMMENT ON COLUMN organizations.created_at IS '생성 일시';
COMMENT ON COLUMN organizations.updated_at IS '최근 수정 일시';

-- workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    workspace_id UUID NOT NULL DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE workspaces IS '조직 내 독립된 프로젝트/브랜드 단위 작업 공간 테이블';
COMMENT ON COLUMN workspaces.workspace_id IS '작업 공간 고유 식별 UUID';
COMMENT ON COLUMN workspaces.org_id IS '소속 조직 UUID';
COMMENT ON COLUMN workspaces.name IS '작업 공간명';
COMMENT ON COLUMN workspaces.created_at IS '생성 일시';
COMMENT ON COLUMN workspaces.updated_at IS '최근 수정 일시';

-- users table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID NOT NULL DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    email VARCHAR(255) NOT NULL,
    role workspace_role NOT NULL DEFAULT 'MEMBER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE users IS '사용자 계정 및 권한 관리 테이블';
COMMENT ON COLUMN users.user_id IS '사용자 고유 식별 UUID';
COMMENT ON COLUMN users.workspace_id IS '소속 작업 공간 UUID';
COMMENT ON COLUMN users.email IS '사용자 이메일 주소';
COMMENT ON COLUMN users.role IS '작업 공간 내 권한 역할 (ADMIN | MEMBER | VIEWER)';
COMMENT ON COLUMN users.created_at IS '생성 일시';
COMMENT ON COLUMN users.updated_at IS '최근 수정 일시';

-- products table
CREATE TABLE IF NOT EXISTS products (
    product_id UUID NOT NULL DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    keyword VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    status product_status NOT NULL DEFAULT 'ACTIVE',
    deleted_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE products IS '분석 및 기획 대상 상품 테이블';
COMMENT ON COLUMN products.product_id IS '상품 고유 식별 UUID';
COMMENT ON COLUMN products.workspace_id IS '소속 작업 공간 UUID';
COMMENT ON COLUMN products.keyword IS '분석 기준 핵심 검색 키워드';
COMMENT ON COLUMN products.name IS '상품명';
COMMENT ON COLUMN products.status IS '상품 노출 및 판매 상태 (ACTIVE | ARCHIVAL | DELETED)';
COMMENT ON COLUMN products.deleted_at IS '소프트 딜리트 삭제 처리 일시';
COMMENT ON COLUMN products.created_at IS '생성 일시';
COMMENT ON COLUMN products.updated_at IS '최근 수정 일시';

-- product_images table
CREATE TABLE IF NOT EXISTS product_images (
    image_id UUID NOT NULL DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    image_url TEXT NOT NULL,
    is_representative BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE product_images IS '상품 관련 기획 이미지 정보 테이블';
COMMENT ON COLUMN product_images.image_id IS '이미지 고유 식별 UUID';
COMMENT ON COLUMN product_images.product_id IS '대상 상품 UUID';
COMMENT ON COLUMN product_images.image_url IS '이미지 리소스 저장소 URL';
COMMENT ON COLUMN product_images.is_representative IS '대표 썸네일 노출 여부';
COMMENT ON COLUMN product_images.created_at IS '등록 일시';

-- version_registry table
CREATE TABLE IF NOT EXISTS version_registry (
    version_id UUID NOT NULL DEFAULT gen_random_uuid(),
    prompt_version VARCHAR(50) NOT NULL,
    rule_engine_version VARCHAR(50) NOT NULL,
    embedding_model_version VARCHAR(100) NOT NULL,
    llm_model_version VARCHAR(100) NOT NULL,
    crawler_version VARCHAR(50) NOT NULL,
    planning_template_version VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_to TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE version_registry IS 'AI 모델, 크롤러, 룰 엔진 등의 시스템 컴포넌트 버전 등록 대장 테이블';
COMMENT ON COLUMN version_registry.version_id IS '버전 설정 세트 고유 식별 UUID';
COMMENT ON COLUMN version_registry.prompt_version IS '프롬프트 템플릿 배포 버전';
COMMENT ON COLUMN version_registry.rule_engine_version IS '룰 엔진 가중치 배포 버전';
COMMENT ON COLUMN version_registry.embedding_model_version IS '임베딩 모델 버전';
COMMENT ON COLUMN version_registry.llm_model_version IS '추론/기획 생성용 LLM 모델 버전';
COMMENT ON COLUMN version_registry.crawler_version IS '크롤러 스크립트 릴리즈 버전';
COMMENT ON COLUMN version_registry.planning_template_version IS '상세페이지 기획서 레이아웃 버전';
COMMENT ON COLUMN version_registry.is_active IS '해당 버전 활성화 여부';
COMMENT ON COLUMN version_registry.valid_from IS '버전 사용 시작 일시';
COMMENT ON COLUMN version_registry.valid_to IS '버전 만료/종료 일시';
COMMENT ON COLUMN version_registry.created_at IS '레코드 생성 일시';

-- analysis_runs table
CREATE TABLE IF NOT EXISTS analysis_runs (
    run_id UUID NOT NULL DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    version_id UUID NOT NULL,
    run_number INTEGER NOT NULL,
    status analysis_status NOT NULL DEFAULT 'RUNNING',
    evaluation_grade VARCHAR(2) NULL,
    confidence_score NUMERIC(5,2) NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ NULL
);

COMMENT ON TABLE analysis_runs IS '상품별 시계열 분석 및 평가 실행 이력 테이블';
COMMENT ON COLUMN analysis_runs.run_id IS '분석 실행 건별 고유 식별 UUID';
COMMENT ON COLUMN analysis_runs.product_id IS '분석 대상 상품 UUID';
COMMENT ON COLUMN analysis_runs.version_id IS '분석 시점에 적용된 시스템 컴포넌트 버전 UUID';
COMMENT ON COLUMN analysis_runs.run_number IS '상품별 누적 분석 차수';
COMMENT ON COLUMN analysis_runs.status IS '분석 상태 (RUNNING | COMPLETED | FAILED)';
COMMENT ON COLUMN analysis_runs.evaluation_grade IS '룰 엔진에 의한 최종 종합 등급 (S | A | B | C | D)';
COMMENT ON COLUMN analysis_runs.confidence_score IS '수집 신뢰도 지수';
COMMENT ON COLUMN analysis_runs.started_at IS '분석 시작 일시';
COMMENT ON COLUMN analysis_runs.completed_at IS '분석 완료 일시';

COMMIT;
