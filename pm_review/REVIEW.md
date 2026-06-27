# REVIEW.md (Sprint 3-5 Review)

본 문서는 **Sprint 3-5 (Market Mutations & Scraper Infrastructure Setup)** 완료 후, **ChatGPT (Project Manager)**의 코드 리뷰와 승인을 지원하기 위해 작성된 스프린트 리뷰 보고서입니다.

---

## 1. Sprint 정보
* **Sprint 번호**: Sprint 3-5
* **대상 작업**: Market Domain CRUD(Create, Update, Delete) 구현 및 Scraper Infrastructure 설계 (Multi-provider stubs 및 Deterministic mock stubs 완비)
* **Commit Message**: `feat(market): implement market mutations and scraper infrastructure stubs`

---

## 2. 구현 내용
* **Market Mutations API 완비**:
  * `POST /api/v1/markets`: 시장 수요 통계 데이터 생성.
  * `PATCH /api/v1/markets/:id`: 기존 시장 수요 통계 데이터 수정.
  * `DELETE /api/v1/markets/:id`: 기존 시장 수요 통계 데이터 Soft Delete 처리.
* **소유권 및 위장 가입 검증 (Owner Verification & Tenant Isolation)**:
  * 마켓 메트릭 생성 시 전달받은 `runId`가 현재 요청한 유저가 소유한 워크스페이스 하위의 리소스인지 `verifyRunOwner(runId, userId)`를 리포지토리 수준에 추가하여 철저히 검증하였습니다. 타인 소유의 `runId`로 생성하려고 시도할 경우 403 Forbidden 오류로 명확히 차단됩니다.
  * 수정/삭제 요청 시 `findByIdWithOwner`를 활용하여 요청자가 소유주인 경우에만 변경/삭제가 이뤄집니다. 타인의 ID로 접근 시 404 Not Found를 응답하여 보안을 공고히 했습니다.
* **Duplicate 생성 차단**:
  * 마켓 메트릭의 `runId`는 UNIQUE Constraint가 걸려 있습니다. 동일한 `runId`에 대해 중복 생성을 시도할 경우 데이터베이스 unique constraint 에러 코드 `23505`를 catch하여 비즈니스 에러 `MarketMetricAlreadyExistsError` (409 Conflict)로 매핑 처리하였습니다.
* **Soft Delete 재삭제 및 수정 차단**:
  * 이미 삭제된 건에 대해서는 `findById` 단에서 조회 차단되므로 수정 및 재삭제 시도가 들어오더라도 404 Not Found로 처리하여 상태의 불변성을 유지합니다.
* **Scraper Infrastructure 설계 (Extensible Provider-based Architecture)**:
  * 향후 여러 플랫폼 (Naver, Coupang, 1688 등) 연동 확장이 용이하도록 `IScraperProvider` 인터페이스와 `BaseScraperProvider` 추상 클래스를 선언하고, `ScraperService` 내 레지스트리에 프로바이더들을 보관 등록하여 실행하는 플러그인형 아키텍처로 구현하였습니다.
* **MockScraperService 결정론적 스텁화**:
  * 크롤러 데이터의 재현성 및 자동 테스트의 결정론성을 위해, 난수 생성 방식이 아닌 키워드의 해시값에 비례해 항상 동일한 값 집합을 연산하여 반환하는 **Deterministic Stub**(`NaverScraperProvider`)을 개발 수립하였습니다.

---

## 3. 변경 파일
* **공통 레이어**:
  * [errors/index.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/common/errors/index.ts): `MarketMetricAlreadyExistsError` (409) 에러 정의
* **Market 모듈**:
  * [types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/types.ts): `verifyRunOwner` 리포지토리 선언 추가
  * [dto.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/dto.ts): `CreateMarketMetricDto`, `UpdateMarketMetricDto` 명칭 및 필드 수립
  * [schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/schema.ts): Zod를 이용한 생성/수정 요청 바디 스키마 선언
  * [repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/repository.ts): `verifyRunOwner` 및 `BaseRepository` 메서드 상속
  * [service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/service.ts): 생성(중복 차단 및 owner 체크), 수정, 삭제(soft delete 검증) 구현
  * [controller.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/controller.ts): 신규 POST, PATCH, DELETE 요청 매핑
  * [route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/route.ts): 신규 뮤테이션 경로 바인딩 및 Zod 바디 벨리데이터 삽입
* **Scraper 모듈 (신규)**:
  * [scraper/types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/scraper/types.ts): 스크래퍼 프로바이더 및 수집 데이터 인터페이스
  * [scraper/providers/base.provider.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/scraper/providers/base.provider.ts): 공통 해시 기능 추상 클래스
  * [scraper/providers/naver.provider.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/scraper/providers/naver.provider.ts): 결정론적 스텁 연산 Naver 프로바이더 구현
  * [scraper/service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/scraper/service.ts): Scraper 레지스트리 및 위임 구현
* **테스트**:
  * [market-mutation.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/market-mutation.test.ts): 인증 없음, 만료 JWT, 타인 권한 403, 존재하지 않는 Run 400, 중복 생성 409, 소프트 딜리트 대상 수정/삭제 차단, Scraper 결정론성 등 통합 테스트 수립

---

## 4. 테스트 결과
Vitest를 활용하여 5개 테스트 파일 총 46개 시나리오가 모두 완벽히 통과되었습니다.
```text
 ✓ tests/health.test.ts  (1 test) 58ms
 ✓ tests/auth.test.ts  (12 tests) 1614ms
 ✓ tests/workspace.test.ts  (14 tests) 150ms
 ✓ tests/market.test.ts  (7 tests) 88ms
 ✓ tests/market-mutation.test.ts  (12 tests) 190ms

 Test Files  5 passed (5)
      Tests  46 passed (46)
```

---

## 5. Self Review
* [x] **MockScraperService 결정론적 동작**: 임의 난수가 아닌 해시 해상도 기반으로 재현성이 확실한 스텁 구현.
* [x] **테스트 보강 사양 준수**: 무인증, 만료 토큰, 비소유주 차단, 중복 생성 Conflict, Soft Delete 재삭제 불가 보장.
* [x] **DTO 명칭 개정**: `CreateMarketMetricDto`, `UpdateMarketMetricDto` 형태의 정밀 도메인 명칭 개편 완료.
* [x] **ESLint / TypeScript 오류 없음**: Strict 모드 컴파일 성공 및 linter 무경고 통과.

---

## 6. Known Issues
```text
None
```
