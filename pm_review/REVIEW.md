# REVIEW.md (Sprint 3-4 Review)

본 문서는 **Sprint 3-4 (Sprint 3-3 개선사항 반영 및 Market Domain 기반 구축)** 완료 후, **ChatGPT (Project Manager)**의 코드 리뷰와 승인을 지원하기 위해 작성된 스프린트 리뷰 보고서입니다.

---

## 1. Sprint 정보
* **Sprint 번호**: Sprint 3-4
* **대상 작업**: Sprint 3-3 리뷰 피드백 보완 및 Market Domain API 기반 구축 (조회 전용, Pagination, Sort Validation, Soft Delete 적용)
* **Commit Message**: `feat(market): implement market domain basic read queries`

---

## 2. 구현 내용
* **BaseRepository 소프트 딜리트 보완**: `update` 및 `delete` 수행 시 `.is('deleted_at', null)`을 추가로 체이닝하여, 이미 삭제(Soft Delete)된 대상에 대한 무분별한 수정 및 재삭제 요청을 원천 차단했습니다.
* **Pagination 제한 및 Sort Whitelist**:
  * Workspace 및 Market의 목록 조회 페이지네이션 범위 제한(최대 page: 100,000 / limit: 100)을 Zod를 통해 엄격하게 적용하여 비정상적인 Offset 요청을 차단했습니다.
  * 정렬 시 화이트리스트 검증(Workspace: `created_at`, `updated_at`, `name` / Market: `total_monthly_search`, `trend_slope`, `seasonality_classification`)을 Zod enum 스키마로 구현하여, 잘못된 정렬 기준 입력 시 즉시 400 Validation Error가 발생하도록 보안 및 성능을 최적화했습니다.
* **Workspace 중복 생성(Unique) 예외 처리 개선**: 워크스페이스 생성 서비스에서 사전 조회를 유지하되, 최종 생성 시 데이터베이스 Unique Constraint 에러(SQLSTATE `23505`)가 발생할 경우 이를 포착하여 비즈니스 예외 `WorkspaceAlreadyExistsError`로 매핑 처리하게 보완했습니다.
* **Market Module 생성 및 Read API 구축**:
  * Scraper 및 AI 분석 기능과 연동될 `market_metrics` 테이블의 기본 도메인 아키텍처 및 `GET /api/v1/markets`, `GET /api/v1/markets/:id` 조회를 구현했습니다.
  * `MarketMetric` 레포지토리는 `BaseRepository`를 상속하며, `market_metrics.run_id` ➡️ `analysis_runs` ➡️ `products` ➡️ `workspaces` ➡️ `org_id` 구조의 관계형 데이터 맵핑을 지원하는 `findByIdWithOwner` 및 `findAllByOwner` 메서드를 구현했습니다.
  * 단건 조회 및 목록 조회 모두 `request.user.userId`가 소유한 워크스페이스 하위의 메트릭만 조회되도록 철저히 소유권(Owner Verification)을 교차 검증하고 타인 정보 노출을 차단합니다.
  * Entity 직접 유출을 방지하기 위해 `MarketResponseDto`만을 반환하게 통제했습니다.

---

## 3. 변경 파일
* **데이터베이스 마이그레이션**:
  * [29_add_market_deleted_at.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/29_add_market_deleted_at.sql): `market_metrics` 테이블 소프트 딜리트 처리를 위한 `deleted_at` 컬럼 추가
* **공통 레이어 & 베이스 리포지토리**:
  * [errors/index.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/common/errors/index.ts): `MARKET_NOT_FOUND`, `MARKET_FORBIDDEN` 에러 추가
  * [base.repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/repositories/implementations/base.repository.ts): `update()` 및 `delete()`에 `.is('deleted_at', null)` 필터 체인 추가
* **Workspace 모듈 개선**:
  * [schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/schema.ts): workspaceQuerySchema Zod Enum 정렬 화이트리스트 및 페이징 상한값 제한 기입
  * [service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/service.ts): DB Unique constraint 위반 (`23505`) 감지 try/catch mapping 코드 추가
* **Market 모듈**:
  * [types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/types.ts): Entity 모델 및 `IMarketRepository` 규격
  * [dto.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/dto.ts): DTO 및 맵핑 헬퍼 함수
  * [schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/schema.ts): Zod 파라미터 UUID 및 whitelisted 정렬 목록 선언
  * [repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/repository.ts): `BaseRepository<MarketMetric>` 상속 및 workspace/owner inner join 쿼리 구현
  * [service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/service.ts): 다층 소유자 검증 및 조회 예외 제어 서비스 정의
  * [controller.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/controller.ts): 요청 수용 및 DTO 변환 반환
  * [route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/route.ts): `/api/v1/markets` 세부 라우팅 설정
* **애플리케이션 연동 및 테스트**:
  * [app.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/app.ts): marketRoutes 모듈 프리픽스 연동 등록
  * [market.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/market.test.ts): 목록 조회, 단건 조회, 정렬 화이트리스트 오류, 페이징 초과 예외, 타인 소유 조회 404 차단 검증 시나리오 등 8개 통합 검사 추가

---

## 4. 테스트 결과
Vitest를 활용하여 4개 테스트 파일 총 34개 시나리오가 모두 완벽히 무결 통과되었습니다.
```text
 ✓ tests/health.test.ts  (1 test) 58ms
 ✓ tests/auth.test.ts  (12 tests) 1595ms
 ✓ tests/workspace.test.ts  (14 tests) 150ms
 ✓ tests/market.test.ts  (7 tests) 88ms

 Test Files  4 passed (4)
      Tests  34 passed (34)
```

---

## 5. Self Review
* [x] **Soft Delete 보완 완료**: `update` 및 `delete` 호출 시 `.is('deleted_at', null)`가 올바르게 수행되어 삭제 데이터 접근 불가 확인.
* [x] **Zod Sort Whitelist / Pagination 범위 검증**: 100,000 페이지 초과 또는 100 limit 초과, 비화이트리스트 컬럼 정렬 요청 시 즉각적인 400 에러 처리 작동 확인.
* [x] **Database Constraint 신뢰**: 중복 발생 시 DB `23505` 코드를 `WorkspaceAlreadyExistsError`로 매핑 확인.
* [x] **Market Module 완성**: DTO, Service, Repository, Validation, Controller 계층 분리 수립 완료.
* [x] **ESLint / TypeScript 오류 없음**: Strict 컴파일 성공 및 경고 외 린터 통과 확인.

---

## 6. Known Issues
```text
None
```
