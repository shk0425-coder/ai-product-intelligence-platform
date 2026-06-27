# Sprint 3-8: AI Review Analysis Persistence Pipeline & Storage (Final)

이 계획서는 Sprint 3-7에서 구현한 AI Review Analyzer의 분석 결과를 영속 저장하고, 중복 분석 시 AI API를 호출하지 않고 캐시 히트(Cache Hit) 데이터베이스 결과를 재사용하기 위한 저장소(Repository), 캐싱 서비스 및 API 라우트 구축을 위한 설계서입니다.

---

## User Review Required

> [!IMPORTANT]
> **데이터베이스 마이그레이션 반영 및 로컬 검증**
> - 신규 테이블 `review_analysis_results` 생성을 위한 마이그레이션 `31_create_review_analysis_results.sql`이 추가됩니다. 
> - 이 마이그레이션 스크립트는 기존의 다른 테이블 구조를 훼손하지 않는 Backward-Compatible 설계를 따릅니다.
> - 로컬 개발환경 및 테스트 실행 환경에서 해당 마이그레이션이 반영되어야 통합 테스트와 API 테스트가 정상 작동합니다.

---

## Open Questions

> [!NOTE]
> 1. **리뷰가 전혀 없는 경우의 Identity 생성 대응**:
>    - 키워드 조건 등으로 조회된 리뷰가 0개일 경우, `latestCollectedAt`에 주입할 최신 수집 일시가 존재하지 않습니다.
>    - 이 경우 기본 일시 문자열로 `new Date(0).toISOString()` (`1970-01-01T00:00:00.000Z`)을 부여해 Identity 해시의 정밀성과 재현성을 보존할 예정입니다.
> 
> 2. **GET /analysis API의 결과 부재 시 응답 처리**:
>    - `GET /api/v1/reviews/analysis?provider=...&keyword=...` 쿼리 시 결과가 존재하지 않을 때 `404 Not Found` (NotFoundError) 에러 응답을 반환하도록 설계하였습니다. 혹시 `200 OK` 응답에 `data: null` 형식으로 전달받기를 선호하시는지 확인해 주시면 반영하겠습니다.

---

## Proposed Changes

### 1. Database Migration

#### [NEW] [31_create_review_analysis_results.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/31_create_review_analysis_results.sql)
- **목적**: AI 분석 결과의 영속성 저장을 위한 신규 테이블 `review_analysis_results` 생성.
- **SQL DDL 스펙**:
  ```sql
  -- 31_create_review_analysis_results.sql
  CREATE TABLE IF NOT EXISTS public.review_analysis_results (
      id UUID NOT NULL DEFAULT gen_random_uuid(),
      analysis_identity VARCHAR(64) NOT NULL, -- SHA-256 해시값 (64자)
      provider VARCHAR(50) NOT NULL,
      model VARCHAR(100) NOT NULL,
      prompt_version VARCHAR(50) NOT NULL,
      keyword VARCHAR(100) NOT NULL,
      review_count INTEGER NOT NULL,
      summary TEXT NOT NULL,
      strengths JSONB NOT NULL,
      weaknesses JSONB NOT NULL,
      complaints JSONB NOT NULL,
      jtbd JSONB NOT NULL,
      keywords JSONB NOT NULL,
      sentiment JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      
      CONSTRAINT pk_review_analysis_results PRIMARY KEY (id),
      CONSTRAINT uq_review_analysis_results_identity UNIQUE (analysis_identity)
  );

  -- Index 정의
  CREATE INDEX IF NOT EXISTS idx_review_analysis_results_keyword 
      ON public.review_analysis_results(keyword);
  CREATE INDEX IF NOT EXISTS idx_review_analysis_results_created_at_desc 
      ON public.review_analysis_results(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_review_analysis_results_identity 
      ON public.review_analysis_results(analysis_identity);
  ```

---

### 2. AI Module (backend/src/modules/ai/)

#### [MODIFY] [types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/types.ts)
- **StoredAnalysis DTO 인터페이스 추가**:
  ```typescript
  export interface StoredAnalysis {
      id: string;
      analysisIdentity: string;
      provider: string;
      model: string;
      promptVersion: string;
      keyword: string;
      reviewCount: number;
      summary: string;
      strengths: string[];
      weaknesses: string[];
      complaints: string[];
      jtbd: string[];
      keywords: string[];
      sentiment: {
          positive: number;
          neutral: number;
          negative: number;
      };
      createdAt: string;
  }
  ```

#### [NEW] [repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/repository.ts)
- **목적**: Supabase Database와 직접 소통하는 데이터 엑세스 계층(DA) 구현.
- **제약사항**: 프롬프트 생성, LLM API 호출, 입력 유효성 검사, 비즈니스 판단 로직은 절대 포함하지 않습니다.
- **구현 인터페이스**:
  - `save(analysis)`: 분석 DTO를 DB에 저장하고 생성된 Row 정보를 반환합니다.
  - `findByIdentity(identity)`: `analysis_identity`가 일치하는 단일 분석 행을 조회합니다. (없을 시 null)
  - `findLatest(provider, keyword)`: provider 및 keyword가 일치하는 분석 목록 중 가장 최근(`created_at DESC`) 등록된 1건을 조회합니다. (없을 시 null)
  - `findById(id)`: UUID 식별자가 일치하는 분석 결과를 조회합니다. (없을 시 null)
  - `exists(identity)`: 특정 Identity 해시값의 존재 여부를 boolean 값으로 신속하게 판정합니다.

#### [NEW] [persistence-service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/persistence-service.ts)
- **목적**: 분석 결과 캐싱 제어 및 데이터 변환 비즈니스 로직 처리.
- **주요 흐름 및 역할**:
  - **Identity 생성 규칙**:
    - 해싱 결합자: `${provider}:${keyword}:${reviewCount}:${latestCollectedAt}:${promptVersion}:${model}`
    - `latestCollectedAt`은 리뷰 배열의 첫 번째 요소(최신 수집 순 정렬 기준)의 `collected_at` 문자열을 사용합니다. 리뷰가 없다면 `new Date(0).toISOString()`을 사용합니다.
    - 해시 알고리즘: Node.js 내장 `crypto.createHash('sha256')`을 이용해 64글자 소문자 16진수 문자열로 생성합니다.
  - **Cache Hit / Miss 분기**:
    1. 데이터베이스에서 리뷰 목록을 우선 조회합니다 (`ReviewAnalyzerService.fetchReviews`).
    2. 수집된 리뷰 정보로 Identity를 계산합니다.
    3. `repository.findByIdentity(identity)`를 호출합니다.
    4. **Cache Hit**: 결과가 존재하는 경우, AI API 호출 없이 DB 조회 결과 DTO를 반환하며 응답 메타데이터에 `cached: true`를 부여합니다.
    5. **Cache Miss**: 결과가 없거나 새로워진 경우, `ReviewAnalyzerService.analyzePreparedReviews`를 호출하여 AI 분석 결과를 수취하고, Zod & Business 유효성 검증을 거친 후 DB에 저장합니다. 이후 저장 결과 DTO를 반환하며 응답 메타데이터에 `cached: false`를 부여합니다.

#### [NEW] [query-service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/query-service.ts)
- **목적**: 분석 결과의 이력 조회 전담 서비스.
- **구현 인터페이스**:
  - `getLatestAnalysis(provider, keyword)`: 특정 검색어의 가장 최근 분석 정보 반환.
  - `getAnalysisById(id)`: 분석 고유 ID 기반 단일 분석 정보 반환.

#### [MODIFY] [service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/service.ts)
- **목적**: 순수 분석 모듈로의 격리 및 하위 호환성 유지.
- **수정 요점**:
  - `fetchReviews(keyword, maxReviews)`를 내부에서 분리하여 외부에서 접근할 수 있도록 노출합니다.
  - `analyzePreparedReviews(providerName, reviews, keyword, options)` 메소드를 신설하여 이미 수집/정제된 리뷰 데이터를 매개변수로 받아 AI 처리를 전담하게 만듭니다.
  - 기존 `analyzeReviews(providerName, keyword, maxReviews)` 메소드는 기존 테스트 호환성을 위해 리팩토링된 하위 메소드들을 순차 호출하는 구조로 그대로 보존합니다.

#### [MODIFY] [controller.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/controller.ts)
- **목적**: 요청 파싱, 비즈니스 서비스 호출 및 공통 Response 규격 전송.
- **구현 API 컨트롤러**:
  - `analyze`: `ReviewAnalysisPersistenceService.analyzeAndPersist`를 호출해 결과 반환. `cached` 필드가 최상위에 융합됩니다.
  - `getLatest`: `ReviewAnalysisQueryService.getLatestAnalysis`를 통해 획득 후 `successResponse` 반환. 없을 시 `NotFoundError` 발생.
  - `getById`: `ReviewAnalysisQueryService.getAnalysisById`를 통해 단일 정보 획득 후 반환. 없을 시 `NotFoundError` 발생.

#### [MODIFY] [schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/schema.ts)
- **목적**: GET Query 및 URL Params 검증 추가.
- **수정 요점**:
  - `getLatestAnalysisSchema` 추가 (Zod object): `provider` (gemini 고정 enum), `keyword` (min 1, max 50 string).
  - `getByIdParamsSchema` 추가 (Zod object): `id` (uuid 포맷 검증).

#### [MODIFY] [route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/route.ts)
- **목적**: 신규 API 종단점 매핑 및 Zod 유효성 검증 미들웨어 결합.
- **추가/수정 API**:
  - `POST /analyze` (Body 검증)
  - `GET /analysis` (Query 검증)
  - `GET /analysis/:id` (Params 검증)

---

### 3. API 라우트 및 응답 예시

#### POST `/api/v1/reviews/analyze` (AI 분석 진행 또는 캐시 반환)
* **Response (Cache Miss / AI 최초 분석 발생)**:
  ```json
  {
    "success": true,
    "data": {
      "cached": false,
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6",
      "analysisIdentity": "4f8a9e223b... (SHA-256 64자)",
      "provider": "gemini",
      "model": "gemini-1.5-flash",
      "promptVersion": "v1",
      "keyword": "유모차",
      "reviewCount": 35,
      "summary": "가볍고 핸들링이 편리하나 바퀴 내구성이 약하다는 지적이 있습니다.",
      "strengths": ["가벼운 알루미늄 프레임", "원핸드 폴딩"],
      "weaknesses": ["우레탄 바퀴 마모 속도"],
      "complaints": ["자갈길 주행 시 진동 소음"],
      "jtbd": ["아기와 도심 공원을 안전하게 산책하기"],
      "keywords": ["주행성", "폴딩", "무게"],
      "sentiment": {
        "positive": 65,
        "neutral": 20,
        "negative": 15
      },
      "createdAt": "2026-06-27T12:00:00.000Z"
    },
    "message": "Analysis processed"
  }
  ```
* **Response (Cache Hit / 동일 조건 재호출)**:
  - 위와 동일한 구조의 `data`가 리턴되되, `"cached": true`로 응답됩니다.

#### GET `/api/v1/reviews/analysis` (가장 최근 분석 이력 반환)
* **Request Query String**: `?provider=gemini&keyword=유모차`
* **Response (200 OK)**:
  - `"cached"` 필드를 제외한 `StoredAnalysis` DTO 데이터 반환.

#### GET `/api/v1/reviews/analysis/:id` (특정 ID 단일 조회)
* **Request Params**: `/api/v1/reviews/analysis/a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6`
* **Response (200 OK)**:
  - `"cached"` 필드를 제외한 `StoredAnalysis` DTO 데이터 반환.

---

## Verification Plan

### Automated Tests (Vitest)
`backend/tests/analysis-persistence.test.ts`에 아래 검증 항목들을 모두 탑재하여 엄격하게 검증합니다.

1. **Repository 단위 테스트**:
   - `save()`를 호출해 DB에 모킹 및 실제 저장 처리 후 식별자(`id`)와 생성시간(`created_at`)이 자동으로 부여되는지 검증.
   - `findByIdentity()`와 `exists()`를 수행하여 중복 생성 체크 기능 검증.
   - 동일 provider 및 keyword에 대해 서로 다른 시각에 생성된 다중 행을 넣고, `findLatest()` 호출 시 `created_at` 기준 내림차순 정렬된 최신 데이터 1건이 선별되는지 검증.
2. **Persistence Service 단위 테스트**:
   - **Cache Miss 시나리오**: 기존 Identity 해시 조회가 실패했을 때, 실제 AI 분석(`analyzePreparedReviews`)이 **정확히 1회 호출**되고, DB 저장 및 반환 결과에 `cached: false`가 설정되는지 검증.
   - **Cache Hit 시나리오**: 기존 Identity 해시가 이미 매치될 경우, AI 분석이 **0회 호출(호출 없음)**되는지 확인하고, DB에 기록되어 있던 정보가 고스란히 복원되며 `cached: true`로 마킹되는지 검증.
3. **API End-to-End 통합 테스트**:
   - `POST /api/v1/reviews/analyze` API의 Zod 검증 실패(비정상 provider, keyword 부재 등) 시 `400 Bad Request` 에러 처리 검증.
   - 동일 payload의 연속 호출에 따른 HTTP Response Level에서의 `cached: false` ➡️ `cached: true` 전이 테스트.
   - `GET /api/v1/reviews/analysis` 호출 시 쿼리 파라미터 유효성 검증 및 최신 1건 반환 테스트.
   - `GET /api/v1/reviews/analysis/:id` 호출 시 올바른 UUID 포맷의 단일 행 조회 기능 및 존재하지 않는 무작위 UUID 호출 시 `404 Not Found` 에러 응답 작동 여부 검증.

### Manual Verification
1. 데이터베이스 마이그레이션 `31_create_review_analysis_results.sql`을 수동/로컬 마이그레이터로 주입합니다.
2. Fastify 서버 실행 후, Postman 또는 curl을 활용해 실제 HTTP 요청으로 캐시 처리 및 영속 저장 이력 조회가 매끄럽게 흐르는지 최종 디버깅을 완수합니다.

---

## Definition of Done (DoD) & Sprint 완료 산출물
- [ ] 전체 기능 구현 및 Vitest 테스트 커버리지 100% 충족 및 통과.
- [ ] ESLint Flat Config 린트 및 TypeScript 컴파일 엄격 모드 경고 0건 유지.
- [ ] Sprint 종료 필수 8단계 준수:
  1. 원격 GitHub `develop` 브랜치에 `feat(ai): Sprint 3-8 AI Analysis Persistence` 메시지 포맷으로 커밋 및 Push 완료.
  2. `pm_review/REVIEW.md` 갱신 및 Self Review 항목 자체 점검 기재 완료.
  3. `pm_review/CONTEXT.md` 갱신 (완료 Sprint 체크, Next Action 재수립, Last Update 정보 동기화).
  4. `pm_review/DECISIONS.md`에 AI 분석 결과 영속성 및 로컬 SHA-256 Identity 캐싱 정책 영구 기록 추가.
  5. 백엔드 산출물 검토용 압축 파일인 `backend_review.zip`을 자율 빌드하여 `pm_review/` 폴더 내에 생성 완료.
