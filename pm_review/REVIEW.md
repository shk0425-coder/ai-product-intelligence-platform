# REVIEW.md (Sprint 3-6 Review)

본 문서는 **Sprint 3-6 (Review Intelligence Pipeline 구축 및 첫 번째 Provider 연동)** 완료 후, **ChatGPT (Project Manager)**의 코드 리뷰와 승인을 지원하기 위해 작성된 스프린트 리뷰 보고서입니다.

---

## 1. Sprint 정보
* **Sprint 번호**: Sprint 3-6
* **대상 작업**: 플랫폼 독립형 Review Intelligence Pipeline 설계, DTO 표준화, Naver Smartstore API 실연동 크롤러 구현, Bulk Insert 중복 처리 및 Crawl API 개발
* **Commit Message**: `feat(review): implement review intelligence pipeline and naver smartstore provider`

---

## 2. 구현 내용
* **Review Intelligence Pipeline 구축**:
  * Keyword ➡️ Review Provider ➡️ Review Mapper ➡️ Review Repository ➡️ customer_reviews 흐름 완비.
* **First Review Provider (Naver Shopping)**:
  * 스마트스토어 상품 리뷰 공개 API (`smartstore.naver.com/i/v1/contents/reviews`) 연동.
  * 10초 `AbortController` 타임아웃, 429/403 및 타임아웃 발생 시 최대 3회 재시도, Exponential Backoff (1초, 2초, 4초) 로직을 이식하여 장애 탄력성 확보.
* **표준 Review DTO & Mapper**:
  * 플랫폼 비종속적 공통 DTO 설계 및 MapperNull 필드 기본값 가공.
  * 중복 방지 감지를 위해 `provider`, `productId`, `reviewId` 조합의 deterministic UUID 생성기 구현.
* **Review Repository**:
  * Database Freeze 원칙을 준수하기 위해 DDL 및 마이그레이션 생성 일체 미발생.
  * NOT NULL 외래키 제약조건(`run_id`) 충족을 위해 DB 내 기존 `run_id` 동적 바인딩 및 fallback UUID 장치 구현.
  * `ON CONFLICT (review_id, collected_at) DO NOTHING` 기반 `upsert` 실행으로 중복은 `duplicateCount`로 분류하고 그 외 DB 오류는 `failedCount`로 정확히 분류 반환.
* **Crawl API**:
  * `POST /api/v1/reviews/crawl` (body: `provider`, `keyword`).
  * JWT 인증 및 Zod 유효성 검사 적용 완료.

---

## 3. 변경 파일
* **공통 레이어**:
  * [app.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/app.ts): 신규 review 라우트 프리픽스 연동 등록
* **Review 모듈 (신규)**:
  * [review/types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/types.ts): DTO 및 Provider/Repository 인터페이스 선언
  * [review/dto.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/dto.ts): Request/Response DTO 정의
  * [review/mapper.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/mapper.ts): Raw 데이터 ➡️ DTO 매핑 및 deterministic UUID 생성
  * [review/repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/repository.ts): `customer_reviews` Bulk Insert & ON CONFLICT 무시 구현
  * [review/service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/service.ts): 파이프라인 중계 서비스
  * [review/controller.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/controller.ts): Fastify 요청 핸들러
  * [review/schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/schema.ts): Zod validation 스키마
  * [review/route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/route.ts): API 라우트 및 미들웨어 바인딩
* **Scraper 모듈 (신규)**:
  * [scraper/providers/naver-review.provider.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/scraper/providers/naver-review.provider.ts): Naver Smartstore API fetch 및 Retry/Timeout 이식
* **테스트**:
  * [review-pipeline.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/review-pipeline.test.ts): Provider, Mapper, Repository, API 모의/통합 테스트 수립

---

## 4. 테스트 결과
Vitest를 활용하여 6개 테스트 파일 총 57개 시나리오가 모두 완벽히 통과되었습니다.
```text
 ✓ tests/health.test.ts  (1 test) 58ms
 ✓ tests/auth.test.ts  (12 tests) 1621ms
 ✓ tests/workspace.test.ts  (14 tests) 150ms
 ✓ tests/market.test.ts  (7 tests) 88ms
 ✓ tests/market-mutation.test.ts  (12 tests) 190ms
 ✓ tests/review-pipeline.test.ts  (11 tests) 2269ms

 Test Files  6 passed (6)
      Tests  57 passed (57)
```

---

## 5. Self Review
* [x] **Database Freeze 원칙 준수**: DDL 변경이나 마이그레이션 파일 추가 없이 기존 DB 컬럼 구조를 완벽히 재사용하였습니다.
* [x] **Naver Provider 연동 안정성**: Axios 등 외부 npm 설치를 피하기 위해 내장 `fetch` 및 `AbortController`를 활용하여 안전하고 속도가 빠른 스마트스토어 공개 API 연동을 마쳤습니다.
* [x] **재시도 회복력**: 429/403/Timeout에 대응하는 Exponential backoff retry 정책을 정상 검증했습니다.
* [x] **ESLint / TypeScript Strict Mode 무오류**: 엄격 컴파일 및 스타일 체크 통과 완료.

---

## 6. Known Issues
```text
None
```
