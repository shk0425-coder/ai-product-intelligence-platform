# Sprint 3-5: Market Mutations & Scraper Infrastructure Setup Implementation Plan

Implementation plan to build Market mutation APIs (Create, Update, Delete) and establish the Scraper Infrastructure stubs for the AI Product Intelligence Platform (v0.6.0).

---

## 1. Sprint 목표
* **Market CRUD 완성**: `market_metrics` 테이블에 대한 Create, Update, Delete API를 완비하고 테넌트 소유권 검증 연동.
* **Scraper Infrastructure 설계**: 네이버 쇼핑 키워드 크롤링 및 경쟁사 데이터를 추합하기 위한 표준 스크래퍼 인터페이스(`IScraperService`) 및 스텁(Stub) 모듈 구축.

---

## 2. 구현 범위

### 구현 대상
* **Market Mutations**:
  * `POST /api/v1/markets`
  * `PATCH /api/v1/markets/:id`
  * `DELETE /api/v1/markets/:id`
* **Scraper Infrastructure**:
  * `src/modules/scraper/` 신설 및 표준 크롤러 인터페이스(`IScraperService`) 설계.
  * 크롤링 데이터 모델 규격 수립 (검색 수치, 트렌드, 경쟁사 상위 10개 정보).
* **Owner 검증**:
  * 수정/삭제 요청 시 JWT 소유주 매칭 검사.
  * 생성 요청 시 지정된 `runId`가 현재 사용자 소유인지 검사 (중요 보완 사항).
* **Zod Validation & DTO**:
  * 생성/수정 페이로드 검증 스키마 추가.
  * `CreateMarketDto`, `UpdateMarketDto` 작성.
* **Unit & Integration Tests**:
  * 생성 성공, 타인의 `runId`를 이용한 생성 시도 차단(403), 수정 성공/실패, 삭제 성공/실패, Zod 유효성 검사.

### 제외 대상
* 실제 네이버 쇼핑 HTTP 크롤러 엔진(Axios/Puppeteer) 연동 동작 (Sprint 3-6 구현 예정).
* AI 분석(JTBD) Orchestration 엔진 연동.

---

## 3. 수정 대상 파일
* [app.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/app.ts): 신규 scraper 모듈 의존성 주입 또는 stubs 등록
* [modules/market/dto.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/dto.ts): `CreateMarketDto`, `UpdateMarketDto` 기입
* [modules/market/schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/schema.ts): Zod create/update 바디 스키마 선언
* [modules/market/service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/service.ts): 생성, 수정, 삭제 비즈니스 로직 작성
* [modules/market/controller.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/controller.ts): 요청 핸들러 바인딩
* [modules/market/route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/route.ts): POST, PATCH, DELETE 라우팅 등록

---

## 4. 신규 생성 파일
* [modules/scraper/types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/scraper/types.ts): 스크래퍼 인터페이스, 데이터 전송 규격 수립
* [modules/scraper/service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/scraper/service.ts): 모의 스크래핑 스텁 서비스
* [tests/market-mutation.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/market-mutation.test.ts): Mutation 검증용 유닛/통합 테스트

---

## 5. Database 변경 여부
* **변경 없음**: Sprint 3-4에서 `market_metrics` 테이블에 `deleted_at` 소프트 딜리트 컬럼 추가 마이그레이션(`29_add_market_deleted_at.sql`)을 이미 실행했으므로 물리 DDL 변경은 불필요합니다.

---

## 6. API 설계

### 6-1. POST `/api/v1/markets` (시장 지표 생성)
* **Headers**: `Authorization: Bearer <JWT>`
* **Request Body**:
  ```json
  {
    "runId": "uuid-here",
    "totalMonthlySearch": 15000,
    "trendSlope": 0.85,
    "seasonalityClassification": "MEDIUM",
    "rawTrendJson": [
      { "date": "2026-05-01", "value": 1200 },
      { "date": "2026-06-01", "value": 1500 }
    ]
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "metricId": "generated-metric-uuid",
      "runId": "uuid-here",
      "totalMonthlySearch": 15000,
      "trendSlope": 0.85,
      "seasonalityClassification": "MEDIUM",
      "rawTrendJson": [...]
    },
    "message": "Market metric created successfully"
  }
  ```

### 6-2. PATCH `/api/v1/markets/:id` (시장 지표 수정)
* **Headers**: `Authorization: Bearer <JWT>`
* **Request Body**:
  ```json
  {
    "totalMonthlySearch": 20000
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "metricId": "metric-uuid",
      "totalMonthlySearch": 20000,
      ...
    },
    "message": "Market metric updated successfully"
  }
  ```

### 6-3. DELETE `/api/v1/markets/:id` (시장 지표 삭제)
* **Headers**: `Authorization: Bearer <JWT>`
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Market metric deleted successfully"
  }
  ```

---

## 7. Scraper Infrastructure 설계
* **의존성 격리**: 백엔드 컨트롤러나 비즈니스 도메인이 크롤러 엔진(Axios, Puppeteer 등)에 직접 의존하지 않도록 `IScraperService` 추상 인터페이스를 선언합니다.
* **표준 타입**:
  ```typescript
  export interface ScrapedCompetitor {
    rank: number;
    brandName: string;
    mallType: string;
    price: number;
    reviewCount: number;
    rawMallName?: string;
  }

  export interface ScrapedMarketData {
    totalMonthlySearch: number;
    trendSlope: number;
    seasonalityClassification: 'HIGH' | 'MEDIUM' | 'LOW';
    rawTrendJson: Record<string, unknown> | unknown[];
    competitors: ScrapedCompetitor[];
  }

  export interface IScraperService {
    scrapeKeyword(keyword: string): Promise<ScrapedMarketData>;
  }
  ```
* **Stub 서비스**: `MockScraperService`를 작성하여, 호출 시 가상의 검색 볼륨 및 경쟁사 10개 목록 데이터를 결정론적으로 반환하게 구현해 Sprint 3-6에서 persist/save 연결만 하도록 스텁화합니다.

---

## 8. Market Create / Update / Delete 구현 방식
* **생성 시 Run 소유주 대조 검증**:
  * 마켓 메트릭 생성 시 전달받은 `runId`가 실제 로그인한 유저의 소유인지 검사하기 위해, `analysis_runs` 테이블을 조회하여 연계된 `products` ➡️ `workspaces` ➡️ `org_id`가 유저 ID와 일치하는지 Service 레이어에서 선제 점검합니다.
* **수정/삭제 시 메트릭 소유주 검증**:
  * `findByIdWithOwner`를 사용하여 호출 유저의 소유가 확인된 경우에만 `update()` 및 `delete()` 명령을 실행합니다.
* **Soft Delete 준수**:
  * 이미 삭제된 건은 BaseRepository 수준에서 수정 및 재삭제가 원천 방어되므로, 예외 상황 발생 시 404/403 예외가 정밀 반환됩니다.

---

## 9. 테스트 계획

### Vitest 검증 시나리오
* **POST /api/v1/markets**
  * 로그인 유저 소유의 `runId`인 경우 정상 생성 확인.
  * 타인 소유의 `runId`로 위장 생성 요청 시 403 Forbidden 차단 확인.
  * 잘못된 페이로드 전달 시 Zod가 캐치하여 400 Validation Error 처리.
* **PATCH /api/v1/markets/:id**
  * 메트릭 소유주인 경우 정상 수정 완료 확인.
  * 타인 메트릭 수정 요청 시 404/403 예외 처리.
  * 이미 Soft-Deleted 된 건에 대한 수정 요청 시 404 차단 확인.
* **DELETE /api/v1/markets/:id**
  * 소유주인 경우 soft-delete (`deleted_at` 갱신) 성공 확인.
  * 타인 메트릭 삭제 요청 시 차단 확인.
  * 이미 삭제된 대상을 재삭제 시도할 때 차단 확인.

---

## 10. 예상 리스크
* **외래키 관계 조인 성능**: `run_id` ➡️ `products` ➡️ `workspaces` 다층 관계 조인이 PostgREST 쿼리에서 잦은 Latency를 유발할 위험이 존재합니다.
  * *대응책*: Supabase 인덱싱에 적합한 외래키 설정이 구현되어 있으므로, 쿼리 플래너가 정상 동작하는지 모니터링하고 필요시 `analysis_runs` 단에 소유주 ID를 역정규화로 캐싱할 수 있습니다.

---

## 11. REVIEW.md / CONTEXT.md / DECISIONS.md 업데이트 계획
* **REVIEW.md**: 구현 기능, 변경/신규 파일, 테스트 34+개 합격 결과 및 Self Review 등재.
* **CONTEXT.md**: Sprint 3-5 완료 상태 및 Sprint 3-6 Scraper 실연동 인계 가이드 작성.
* **DECISIONS.md**: Scraper 추상 아키텍처 및 Run ID 생성 검증 정책 누적 등재.
