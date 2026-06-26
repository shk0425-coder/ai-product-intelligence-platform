# CHANGELOG.md (Release Ledger)

이 문서는 **AI Product Intelligence Platform** 프로젝트의 모든 설계, 아키텍처 변경, 그리고 코드 커밋 내역을 기록하는 공식 로그 파일입니다.

---

## [Unreleased] - 2026-06-26
### Added (새로 설계 및 추가된 사항)
* **GitHub Repository 운영 규칙 반영 및 Git 저장소 구성**:
  * 소스코드와 프로젝트 문서의 일관성 유지를 위해 GitHub Repository를 Single Source of Truth(SSOT)로 지정.
  * `.gitignore` 파일 작성 및 로컬 Git 저장소 초기화 (`git init`).
  * 브랜치 정책(`main` / `develop`) 수립 및 `develop` 브랜치 상에 Sprint 2-1 및 2-2 DDL 분할 커밋 생성.
  * ChatGPT PM 리뷰 승인 하에 `main`으로 Merge 및 다음 Sprint를 전개하는 PR(Pull Request) 규격 수립.
  * `AI_START.md` 및 `CONTEXT.md` 내에 커밋 규칙 및 작업 완료 후 필수 절차 적용.
* **Sprint 2-2: Market Domain Database DDL 구현 완료**:
  * `database/migrations/` 경로 내에 Supabase 호환 4대 DDL 마이그레이션 파일 작성 완료.
  * 2대 마켓 데이터 수집 테이블(`market_metrics`, `competitor_products`) 생성 및 주석(Comment) 기술 스크립트 작성 (`08_market_tables.sql`).
  * 기본키(pk), 고유키(uq), 외래키(fk) 제약조건 설정 스크립트 작성 (`09_market_constraints.sql`).
  * 외래키 검색 속도 보장을 위한 B-tree 인덱스 및 JSONB 데이터(`raw_trend_json`) 조회를 위한 GIN 인덱스 생성 스크립트 작성 (`10_market_indexes.sql`).
  * 스냅샷 성격 테이블로 `updated_at` 컬럼이 없어 트리거 생략 요건을 포괄 처리한 스크립트 작성 (`11_market_triggers.sql`).
* **Sprint 2-1: Core Domain Database DDL 구현 완료**:
  * `database/migrations/` 경로 내에 Supabase 호환 7대 DDL 마이그레이션 파일 작성 완료.
  * pgcrypto 및 pgvector 확장 기능 활성화 스크립트 작성 (`01_extensions.sql`).
  * 6대 상태 및 역할 제어를 위한 Enum 타입 생성 스크립트 작성 (`02_enums.sql`).
  * 7대 코어 테이블 생성 및 주석(Comment) 기술 스크립트 작성 (`03_tables.sql`).
  * 기본키(pk), 고유키(uq), 외래키(fk) 제약조건 설정 스크립트 작성 (`04_constraints.sql`).
  * B-tree 인덱싱 스크립트 작성 (`05_indexes.sql`).
  * `updated_at` 타임스탬프 자동 갱신 공통 함수 작성 (`06_functions.sql`).
  * 마스터 테이블 대상 타임스탬프 트리거 결합 스크립트 작성 (`07_triggers.sql`).
* **Database Architecture v1.1 Final 확정 및 동결(Freeze)**:
  * SaaS 다중 테넌트 관리 계층(`organizations`, `workspaces`, `users`) 수립.
  * 기존 `AnalysisRun` 중심에서 `Product` 중심 도메인 계층 구조로 리팩토링 완료.
  * `customer_reviews`와 `review_embeddings` 엔티티 분리 설계 및 월별 Range Partitioning 적용 요건 명시.
  * `knowledge_assets` 에이전트 출처 메타데이터 강화.
  * 다차원 버전 관리 구조(`version_registry` 엔티티) 신설하여 Prompt, Rule, LLM, Embedding, Crawler, Template 등의 배포 추적 지원.
* **Project Operating System v2.3 (POS v2.3) 구축**:
  * AI 협업 및 세션 인계를 보장하기 위한 `AI_START.md`, `PROJECT.md`, `SESSION.md`, `TODO.md` 및 ChatGPT PM 전용 프로젝트 인계 문서인 `CONTEXT.md` v2.3 최종본 동기화 완료.

### Changed
* **Product Intelligence Framework v3.0 코어 플랫폼 규격 설계**:
  * JTBD 상황적 문제 모델링 스키마 탑재.
  * PASS/FAIL 시스템을 대체하는 S/A/B/C/D 5단계 등급 평가 및 컷오프 수식 설계.
  * Product Strategy Generator (USP, 8단계 상세페이지 스토리보드 기획 등) 구성.
  * 데일리 크론 트렌드 분석 데몬(`Trend Intelligence Engine`) 명세화.
  * 성과 지표 피드백 루프(`Learning Loop Engine`) 갱신 알고리즘 설계.
* **AI Agent Architecture v1.1 설계 수립**:
  * `Task Planner` 및 비동기 병렬 `Orchestrator` 사양 정의.
  * 9개 Specialized Agent의 개별 데이터 입출력(JSON Schema) 및 Pydantic 검증 모델 정의.
  * LLM Gateway 및 기능 단위 Capability Layer 추상화 정의.

---

## [0.1.0] - 2026-06-25
### Added
* **초기 프로토타입 대시보드 및 테스트 스크립트 작성**:
  * 네이버 쇼핑 OpenAPI 연동을 통한 실시간 상품 검색 데이터 수집 코드 (`scrape_api.py`) 및 CSV 백업 테스트 완료.
  * Streamlit 기반 시장 분석 대시보드 (`dashboard.py`) 구축.
  * Plotly Express를 활용한 가격대 빈도 분포 히스토그램 및 상위 브랜드 점유율 파이 차트 렌더링 기능 추가.
  * 대시보드 화면 내 생성형 AI용 분석 프롬프트 자동 복사 스니펫 탑재.
