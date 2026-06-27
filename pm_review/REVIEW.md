# REVIEW.md (Sprint 3-8 Review)

본 문서는 **Sprint 3-8 (AI Review Analysis Persistence Pipeline & Storage)** 완료 후, **ChatGPT (Project Manager)**의 코드 리뷰와 승인을 지원하기 위해 작성된 스프린트 리뷰 보고서입니다.

---

## 1. Sprint 정보
* **Sprint 번호**: Sprint 3-8
* **대상 작업**: AI 분석 결과 영속 저장 및 조회 인프라 구축, Identity Generator 설계(SHA-256 해싱), Cache Hit/Miss 파이프라인 연동, Query API 및 By ID 단일 조회 API 추가
* **Commit Message**: `feat(ai): Sprint 3-8 AI Analysis Persistence`

---

## 2. 구현 내용
* **Analysis Persistence Layer**:
  * AI 모듈 내부에 영속성 계층을 신설하여 Analyzer, Identity, Persistence, Query 책임을 확실하게 분리했습니다.
* **Identity Generator 개발**:
  * `identity-generator.ts`를 신설하여 `provider`, `keyword`, `reviewCount`, `latestCollectedAt`, `promptVersion`, `model`, `temperature`, `maxOutputTokens` 파라미터를 줄바꿈 기호(`\n`)로 결합한 Canonical String을 만들고, `crypto` 모듈을 이용해 64자 Hex String SHA-256 해시를 생성하도록 완전히 독립 구현했습니다.
* **Analysis Repository 구현**:
  * `repository.ts`를 신설하여 Supabase Database의 `review_analysis_results` 테이블 CRUD 처리를 전담하게 하였으며, Prompt 생성, AI 호출, 비즈니스 검증 로직은 배제했습니다.
  * 메소드: `save`, `findByIdentity`, `findLatest`, `findById`, `exists`.
* **Persistence & Query Services 구현**:
  * `persistence-service.ts`의 `ReviewAnalysisPersistenceService`를 신설하여 Identity 생성, Cache 조회, Cache Miss 판단, AI 분석 실행, 유효성 검증, DB 영속 저장 오케스트레이션을 완성했습니다.
  * `query-service.ts`를 신설하여 최신 분석 이력 조회(`getLatestAnalysis`) 및 단일 ID 조회(`getAnalysisById`)를 제공합니다.
* **POST `/api/v1/reviews/analyze` API 캐싱 연동**:
  * 캐시 히트 시 DB 조회 정보와 `"cached": true`를 즉시 반환하고, 캐시 미스 시 AI 분석 및 검증을 마친 후 DB 적재 및 `"cached": false`를 반환하도록 고도화했습니다.
* **Query API 2종 추가**:
  * `GET /api/v1/reviews/analysis` (Latest 조회, query validation 탑재)
  * `GET /api/v1/reviews/analysis/:id` (ID 조회, UUID validation 탑재)
* **Database Migration 완료**:
  * `31_create_review_analysis_results.sql` 테이블 스크립트를 추가하여 하위 호환성을 완벽히 충족하는 영속 테이블 및 최적화용 인덱스 3종을 생성했습니다.

---

## 3. 변경 파일
* **공통 레이어**:
  * [app.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/app.ts): 라우터 프리픽스 `/api/v1/reviews` 프리픽스로 aiRoutes 및 주석 추가 등록
  * [common/errors/index.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/common/errors/index.ts): `NotFoundError` 예외 클래스 추가 정의
* **AI 모듈 (신규 및 수정)**:
  * [modules/ai/types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/types.ts): `StoredAnalysis` DTO 인터페이스 선언 추가
  * [modules/ai/identity-generator.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/identity-generator.ts): SHA-256 Identity 생성 헬퍼
  * [modules/ai/repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/repository.ts): Supabase `review_analysis_results` CRUD 저장소
  * [modules/ai/persistence-service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/persistence-service.ts): 캐싱 비즈니스 오케스트레이션 서비스
  * [modules/ai/query-service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/query-service.ts): 이력 및 단일 조회 전용 서비스
  * [modules/ai/service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/service.ts): AI 리뷰 분석 fetch 및 analyzePreparedReviews 결합 분리 리팩토링
  * [modules/ai/controller.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/controller.ts): 캐시 히트 반영 및 GET 쿼리 API 컨트롤러 액션 추가
  * [modules/ai/schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/schema.ts): API 쿼리 및 URL Params Zod 검증 스키마 추가
  * [modules/ai/route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/route.ts): API GET 라우트 신설 매핑 및 preValidation 검증 장착
* **테스트**:
  * [tests/analysis-persistence.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/analysis-persistence.test.ts): 신규 Repository, Service, E2E 라우트, Zod 검증, 해시 중복 및 SQL 마이그레이션 통합 테스트 스위트 수립
  * [tests/review-analysis.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/review-analysis.test.ts): 캐시 도입 및 Supabase 테이블 insert 모킹 격리 충돌 방지 보완

---

## 4. 테스트 결과
Vitest를 활용하여 8개 테스트 파일 총 92개 시나리오가 모두 완벽히 통과되었습니다.
```text
 ✓ tests/health.test.ts  (1 test)
 ✓ tests/auth.test.ts  (12 tests)
 ✓ tests/workspace.test.ts  (14 tests)
 ✓ tests/market.test.ts  (7 tests)
 ✓ tests/market-mutation.test.ts  (12 tests)
 ✓ tests/review-pipeline.test.ts  (11 tests)
 ✓ tests/review-analysis.test.ts  (16 tests)
 ✓ tests/analysis-persistence.test.ts  (19 tests)

 Test Files  8 passed (8)
      Tests  92 passed (92)
```

---

## 5. Self Review
* [x] **Repository 원칙 준수**: repository.ts 에서는 순수 DB insert/select 만 수행하며, AI 호출 및 비즈니스 검증은 일절 포함하지 않았습니다.
* [x] **Identity Generator 분리**: SHA-256 생성 룰을 Service 밖으로 꺼내 Canonical String 정렬 결합 형식으로 독립 구현했습니다.
* [x] **Database 하위 호환성**: 신규 review_analysis_results 테이블만 추가하고 기존 DDL 구조 및 타 모듈 테이블은 전혀 침범하지 않았습니다.
* [x] **ESLint / TypeScript Strict Mode 무오류**: explicitly any 제거 등 타입 안정성을 강화해 무오류 컴파일 통과 완료.

---

## 6. Known Issues
```text
None
```
