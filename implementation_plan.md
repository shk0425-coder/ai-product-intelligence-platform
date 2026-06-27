# Sprint 3-7: AI Review Analyzer & JTBD Intelligence Implementation Plan (Final Approved)

Implementation plan to build the AI Review Analyzer Engine, including PromptBuilder, TokenManager, ProviderFactory, GeminiProvider, ResponseParser, Zod/Business validators, and the Analyze API.

---

## 1. Sprint 목표
* **AI Module 구축**: `modules/ai/` 하위에 AI 분석 기능 설계 및 독립성 유지.
* **Gemini Provider 연동**: Gemini API를 이용한 정교한 프롬프트 제어, Timeout(60초) 및 Retry(최대 2회) exponential backoff 탑재.
* **Token Manager 개발**: Prompt 길이 계산, 최대 Token 제한(4096 tokens), 초과 시 최신 리뷰부터 보존하여 리뷰 자동 축소하는 Token 관리 기능 구축.
* **Zod 및 비즈니스 유효성 검증**: JSON 스키마 강제 파싱 후 Zod 유효성 및 긍정/부정 합산 100% 검증.
* **Database 저장 금지**: 이번 스프린트에서는 Database 스키마 수정 및 데이터 저장을 완전히 금지하며, API 응답으로만 결과를 반환합니다.

---

## 2. 구현 범위

### 구현 대상 (In-Scope)
* **AI Provider Framework & Gemini Provider**:
  * `AIProvider` 인터페이스, `AIRequestOptions` DTO, `ProviderFactory` 개발.
  * Node.js native `fetch` API를 사용하여 60초 Timeout, 2회 Retry, Exponential backoff (1초, 2초)가 장착된 `GeminiProvider` 구현.
* **Prompt Builder**:
  * Role, Task, Rules, Output JSON Schema, Review Data 순으로 조립하는 `PromptBuilder` 모듈.
* **Token Manager**:
  * 문자수 비례 Token 추정식(`Math.ceil(length / 3)`)을 활용한 Token 계산기.
  * Token 초과 방지를 위해 최신 리뷰 날짜(`collected_at`)순으로 우선 정렬 후 누적 Token 한계 도달 시까지 리뷰 목록을 유지/축소하는 Truncation 기능 구현.
* **Response Parser**:
  * AI가 반환한 Markdown 및 코드 블록(\`\`\`json)을 정밀 정제하는 Parser.
* **Validators (Zod & Business)**:
  * Zod Schema를 사용해 구조 유효성 검사 수행. 실패 시 `AIResponseValidationError` 발생.
  * Business Validation: `summary` 존재, `strengths`/`weaknesses` 최소 1개, `sentiment` 총합 100% 검증.
* **Analyze API**:
  * `POST /api/v1/reviews/analyze` (validation, pipeline execution, return DTO).

### 제외 대상 (Out-Scope)
* Database 저장 및 DDL 변경, 신규 마이그레이션 생성.
* 시장성 등급 산출 및 점수화.
* 상품 전략 및 Creative 시안 도출.

---

## 3. 수정 대상 파일
* [app.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/app.ts): 신규 AI 라우트 프리픽스 등록 연동.
* [common/errors/index.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/common/errors/index.ts): `AIResponseValidationError` 추가.

---

## 4. 신규 생성 파일
* **AI Module**:
  * [modules/ai/types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/types.ts): DTO 및 AIRequestOptions, Provider 인터페이스 선언
  * [modules/ai/provider.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/provider.ts): `AIProvider` 추상 인터페이스 정의
  * [modules/ai/provider-factory.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/provider-factory.ts): `ProviderFactory` 팩토리
  * [modules/ai/providers/gemini.provider.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/providers/gemini.provider.ts): Gemini API 호출기 (fetch, Retry/Timeout 내장)
  * [modules/ai/prompt-builder.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/prompt-builder.ts): 프롬프트 템플릿 제어
  * [modules/ai/token-manager.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/token-manager.ts): Token 연산 및 리뷰 축소기
  * [modules/ai/parser.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/parser.ts): Markdown & Json Parser
  * [modules/ai/validator.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/validator.ts): Zod 및 100% 합산 등 Business Validator
  * [modules/ai/service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/service.ts): AI 리뷰 분석 통합 서비스 (데이터베이스 저장 제거)
  * [modules/ai/controller.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/controller.ts): Fastify 요청 컨트롤러
  * [modules/ai/schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/schema.ts): API 요청 Zod 스키마
  * [modules/ai/route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/route.ts): API 라우터 등록
* **테스트**:
  * [tests/review-analysis.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/review-analysis.test.ts): AI 분석 전체 레이어 및 API 통합 테스트

---

## 5. Database 정책
* **Database 저장 금지**: 이번 Sprint에서는 분석 결과를 DB에 영속화하지 않고 API Response까지만 생성해 반환합니다.

---

## 6. API 설계

### POST `/api/v1/reviews/analyze` (AI 리뷰 분석 실행)
* **Headers**: `Authorization: Bearer <JWT>`
* **Request Body**:
  ```json
  {
    "provider": "gemini",
    "keyword": "강아지 유모차",
    "maxReviews": 100
  }
  ```
* **Validation 규칙**:
  * `provider`: `'gemini'` 필수.
  * `keyword`: 필수 입력, 앞뒤 공백 제거(Trim), 빈 문자열(Empty) 차단, 최대 50자 제한.
  * `maxReviews`: 100 기본값, 최대 500 제한.
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "reviewCount": 100,
      "summary": "안정성이 돋보이지만 바퀴 조작성이 다소 아쉽다는 평이 지배적입니다.",
      "strengths": ["높은 프레임 안정성", "디자인 우수"],
      "weaknesses": ["바퀴 휠 유격", "무거운 무게"],
      "complaints": ["접고 펼 때 뻑뻑함"],
      "jtbd": ["강아지와 안전하고 쾌적하게 산책하기"],
      "keywords": ["안정성", "유모차", "강아지"],
      "sentiment": {
        "positive": 70,
        "neutral": 20,
        "negative": 10
      }
    },
    "message": "Analysis completed"
  }
  ```

---

## 7. AI 호출 및 Retry 상세 사양
* **Temperature**: `0.2`로 고정하여 결정론적 완성도를 제고.
* **Response Format**: `JSON` 포맷 강제 지정.
* **Timeout**: 최대 60초 대기 제한.
* **Retry 정책**: HTTP 429, 500, 503, Network Error, Timeout 발생 시 최대 2회 재시도.
* **Exponential Backoff**:
  * 1차 재시도 대기 시간: 1초
  * 2차 재시도 대기 시간: 2초

---

## 8. 테스트 계획
* **Prompt Builder**: 조립된 Prompt에 JSON Schema, 키워드, 리뷰 목록이 정상 머지되는지 확인.
* **Token Manager**: 문자수 비례 Token 계산 정합성, Token 한도 초과 시 최신 리뷰 순서대로 자동 축소 및 정렬 유지 여부 검증.
* **Provider**: Gemini API 호출 mock 처리, Timeout 예외 동작, Network error에 따른 2회 Retry 및 Backoff 동작 검사.
* **Parser**: Markdown 백틱(\`\`\`json) 정제 및 JSON Parse 정합성 테스트.
* **Validation**:
  * Schema Validation 및 Sentiment 합산 100% 비즈니스 규칙 위반 시 `AIResponseValidationError` 처리.
* **Service & API**:
  * DB 저장 없이 파이프라인 수행 후 API response 정밀 검증.
  * 400, 401, 500 상황별 응답 확인.
