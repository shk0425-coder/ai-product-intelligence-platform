# Sprint 3-6: Review Intelligence Pipeline & First Provider Integration Implementation Plan (Final Approved)

Implementation plan to build the Review Intelligence Pipeline, define the standard Review DTO, construct the Review Mapper, implement the Review Repository, and build the Crawl API under a frozen database schema.

---

## 1. Sprint 목표
* **Review Pipeline 구축**: Keyword -> Provider -> Mapper -> Repository -> Database로 이어지는 플랫폼 비종속적인 수집 파이프라인 구축.
* **첫 번째 Provider 연동**: 실제 Naver Shopping 상품 리뷰 공개 API를 첫 번째 수집 Provider로 연동 (Timeout, Retry, Backoff 포함).
* **Crawl API 개발**: `POST /api/v1/reviews/crawl` API 개발 및 Zod 유효성 검사 (runId 배제).

---

## 2. 구현 범위

### 구현 대상 (In-Scope)
* **First Review Provider (Naver Shopping)**:
  * 네이버 스마트스토어 상품 리뷰 공개 API (`smartstore.naver.com/i/v1/contents/reviews`) 연동.
  * Timeout(10초), Retry(3회), Exponential Backoff(1초, 2초, 4초) 회복성 로직 장착.
* **Review 표준 DTO 및 Mapper**:
  * 플랫폼 간 비종속적인 표준 `ReviewDto` 정의.
  * 타입 형변환, Null 가공, 기본값 지정을 수행하는 `ReviewMapper` 구현.
* **Review Repository**:
  * 데이터베이스 DDL 변경 없이 기존 `customer_reviews` 테이블 구조 (`review_id`, `run_id`, `raw_text`, `rating`, `collected_at`)를 그대로 재사용.
  * 데이터베이스 constraints (NOT NULL `run_id`) 충족을 위해 DB 내 임의의 기존 `run_id` 자동 조회 후 임시 바인딩 (Default fallback UUID 지정).
  * Bulk Insert 및 중복 방지(`ON CONFLICT (review_id, collected_at) DO NOTHING`) 연동.
  * Bulk Insert 결과 반환 설계 (`insertedCount`, `duplicateCount`, `failedCount`).
* **Crawl API**:
  * `POST /api/v1/reviews/crawl` (body: `provider`, `keyword`).
* **Vitest 통합 테스트**:
  * Provider(JSON fetch, Timeout, Retry), Mapper(Null 처리, DTO 변환), Repository(Insert, Duplicate 처리, failedCount 처리), API(401, 400, 200) 통합 테스트 수립.

### 제외 대상 (Out-Scope)
* AI 감성 분석 및 JTBD 분류.
* Database Schema 변경, Migration 생성, 기존 DDL 수정.

---

## 3. 수정 대상 파일
* [app.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/app.ts): 신규 review 라우트 프리픽스 연동 등록

---

## 4. 신규 생성 파일
* **Review Module**:
  * [modules/review/types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/types.ts): 표준 `Review` 엔티티 정의, `ReviewDto` 및 리포지토리 인터페이스 정의
  * [modules/review/dto.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/dto.ts): DTO 규격 선언
  * [modules/review/mapper.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/mapper.ts): Provider raw json 데이터 ➡️ 표준 DTO 매퍼
  * [modules/review/repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/repository.ts): `customer_reviews` 테이블 Bulk Insert 구현
  * [modules/review/service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/service.ts): 파이프라인 흐름 제어
  * [modules/review/controller.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/controller.ts): Crawl 요청 중계 및 결과 건수 반환
  * [modules/review/schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/schema.ts): Zod를 이용한 API 요청 유효성 스키마 선언
  * [modules/review/route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/route.ts): 라우트 등록
* **Scraper Module/Interface 확장**:
  * [modules/scraper/providers/naver-review.provider.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/scraper/providers/naver-review.provider.ts): Naver Smartstore 리뷰 실 연동 프로바이더 (Timeout, Retry 포함)
* **테스트**:
  * [tests/review-pipeline.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/review-pipeline.test.ts): 통합 검증 테스트

---

## 5. Database 정책 및 데이터 매핑 전략

### 5-1. Database Schema 동결 (Freeze)
* DDL 수정, 컬럼 추가 및 신규 Migration 파일 생성을 일체 진행하지 않고 기존 스키마를 재사용합니다.

### 5-2. 데이터 매핑 전략
* `ReviewDto`의 플랫폼 독립 필드 중 데이터베이스 컬럼에 상응하는 정보만 선별 매핑하여 `customer_reviews`에 삽입합니다:
  * `review_id` ⬅️ `ReviewDto.reviewId` (UUID)
  * `raw_text` ⬅️ `ReviewDto.reviewContent` (원본 텍스트)
  * `rating` ⬅️ `ReviewDto.rating` (별점)
  * `collected_at` ⬅️ `ReviewDto.collectedAt` (수집 일시)
* `run_id`는 외래키 제약조건 및 NOT NULL 제약을 충족하기 위해 데이터베이스 내 임의의 기존 `run_id`를 자동 조회 후 임시 바인딩 (Default fallback UUID 지정).

---

## 6. API 설계

### POST `/api/v1/reviews/crawl` (리뷰 수집 실행)
* **Headers**: `Authorization: Bearer <JWT>`
* **Request Body**:
  ```json
  {
    "provider": "naver",
    "keyword": "강아지 유모차"
  }
  ```
* **Validation 규칙**:
  * `provider`: `'naver'` 필수.
  * `keyword`: 필수 입력, 앞뒤 공백 제거(Trim), 빈 문자열(Empty) 차단, 최대 50자 제한.
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "provider": "naver",
      "keyword": "강아지 유모차",
      "insertedCount": 20,
      "duplicateCount": 0,
      "failedCount": 0
    },
    "message": "Successfully crawled reviews"
  }
  ```

---

## 7. Retry 및 Timeout 상세 사양
* **Timeout**: 각 HTTP 요청당 최대 10초 대기 제한.
* **Retry 정책**: HTTP 429 (Too Many Requests), HTTP 403 (Forbidden), Timeout 에러 발생 시 최대 3회 재시도.
* **Exponential Backoff**:
  * 1차 재시도 대기 시간: 1초
  * 2차 재시도 대기 시간: 2초
  * 3차 재시도 대기 시간: 4초

---

## 8. 확장 가능한 Provider Interface 설계
```typescript
export interface CrawlRequest {
  keyword: string;
  maxReviews?: number;
  sort?: 'latest' | 'best';
}

export interface RawReviewData {
  id: string;
  productName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  reviewer: string;
  helpfulCount: number;
  brand?: string;
  optionName?: string;
  raw: Record<string, unknown>;
}

export interface IReviewProvider {
  getName(): string;
  crawl(request: CrawlRequest): Promise<RawReviewData[]>;
}
```

---

## 9. Review Mapper 및 DTO 설계
* 표준 `ReviewDto` 구조:
  ```typescript
  export interface ReviewDto {
    provider: string;
    keyword: string;
    reviewId: string;
    providerProductId: string;
    providerReviewId: string;
    productName: string;
    rating: number;
    reviewTitle: string;
    reviewContent: string;
    reviewer: string;
    reviewDate: string;
    helpfulCount: number;
    brand: string;
    optionName: string;
    collectedAt: string;
    metadata: Record<string, unknown>;
  }
  ```

---

## 10. Review Repository & Bulk Insert 결과 구조
* **Bulk Insert 결과 규격**:
  ```typescript
  export interface BulkInsertResult {
    insertedCount: number;
    duplicateCount: number;
    failedCount: number;
  }
  ```

---

## 11. 테스트 계획
* **Provider**: JSON Fetch 성공 케이스, Timeout 강제 에러 처리, 3회 Retry 동작 검증.
* **Mapper**: Null 처리 기본값 변환, DTO 맵핑 완료, metadata 보존 여부 검사.
* **Repository**: 대량 삽입 성공, 중복 레코드 DO NOTHING 무시, 제약조건 위반 실패 카운트 처리.
* **API**: 401 Unauthorized, 400 Validation, 200 OK 동작 확인.
