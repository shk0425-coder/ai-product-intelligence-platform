# REVIEW.md (Sprint 3-7 Review)

본 문서는 **Sprint 3-7 (AI Review Analyzer & JTBD Intelligence)** 완료 후, **ChatGPT (Project Manager)**의 코드 리뷰와 승인을 지원하기 위해 작성된 스프린트 리뷰 보고서입니다.

---

## 1. Sprint 정보
* **Sprint 번호**: Sprint 3-7
* **대상 작업**: AI Review Analyzer Engine 구축, TokenManager(토큰 계산 및 최신 리뷰 우선 축소 기능) 설계, Gemini API 호출 통합(Retry, Exponential Backoff, Timeout), Response Parser 및 2단계 유효성 검사 적용, Analyze API 개발
* **Commit Message**: `feat(ai): implement ai review analyzer engine and token manager`

---

## 2. 구현 내용
* **AI Module 구축**:
  * `backend/src/modules/ai/` 폴더를 신설하여 AI 분석 관련 모든 로직을 완전 분리 및 독립 관리했습니다. (Review 모듈 침범 차단)
* **AI Request Options & Provider Framework**:
  * `AIProvider` 인터페이스와 `AIRequestOptions` DTO를 정의하고, `ProviderFactory`를 설계했습니다.
  * Node.js 내장 `fetch` API를 사용하여 60초 Timeout, 2회 Retry, Exponential backoff (1초, 2초)가 장착된 `GeminiProvider`를 완벽히 독립 구현했습니다.
* **Prompt Builder & Token Manager**:
  * System Prompt, Analysis Instruction, Output JSON Schema, Review Data 순으로 조립하는 `PromptBuilder`를 구현했습니다.
  * 한글/영문 토큰 추정 알고리즘(`Math.ceil(length / 3)`)을 적용하고, 4096 토큰 초과 시 수집일시(`collected_at` 내림차순) 기준으로 정렬 후 한도 내의 최신 리뷰 목록만 유지 및 자동 축소하는 `TokenManager`를 완성했습니다.
* **Response Parser & Validators (2단계 검증)**:
  * Markdown 백틱(\`\`\`json) 정제 및 JSON Parse를 수행하는 `ResponseParser`를 구현했습니다.
  * Zod Schema Validation 및 Business Validation(요약 존재 여부, 강점/약점 최소 1개 이상 존재 여부, **Sentiment 긍정/중립/부정 비율 합산 정확히 100% 검증**)을 만족하지 못할 시 `AIResponseValidationError`를 throw 하도록 구축했습니다.
* **Database 저장 금지 정책 준수**:
  * 이번 스프린트 범위에 맞춰 DB Schema 변경, DDL 수정, Migration 파일 작성을 일절 하지 않았으며, 분석 데이터베이스 저장을 완전히 생략하여 API Response까지만 생성하여 반환하도록 구성했습니다.
* **POST `/api/v1/reviews/analyze` API**:
  * Trim, 최대 50자 제한, Zod input validation, JWT 인증 미들웨어 및 에러 전역 바인딩을 연동 완료했습니다.

---

## 3. 변경 파일
* **공통 레이어**:
  * [app.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/app.ts): 신규 AI 라우트 프리픽스 `/api/v1/reviews` 프리픽스로 연동 등록
  * [common/errors/index.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/common/errors/index.ts): `AIResponseValidationError` 예외 클래스 추가
* **AI 모듈 (신규)**:
  * [modules/ai/types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/types.ts): DTO 및 Provider/Repository 인터페이스 선언
  * [modules/ai/provider.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/provider.ts): `AIProvider` 추상 인터페이스 정의
  * [modules/ai/provider-factory.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/provider-factory.ts): `ProviderFactory` 팩토리
  * [modules/ai/providers/gemini.provider.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/providers/gemini.provider.ts): Gemini API 호출기 (fetch, Retry/Timeout 내장)
  * [modules/ai/prompt-builder.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/prompt-builder.ts): 프롬프트 템플릿 제어
  * [modules/ai/token-manager.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/token-manager.ts): Token 연산 및 리뷰 축소기
  * [modules/ai/parser.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/parser.ts): Markdown & Json Parser
  * [modules/ai/validator.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/validator.ts): Zod 및 100% 합산 등 Business Validator
  * [modules/ai/service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/service.ts): AI 리뷰 분석 통합 서비스
  * [modules/ai/controller.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/controller.ts): Fastify 요청 컨트롤러
  * [modules/ai/schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/schema.ts): API 요청 Zod 스키마
  * [modules/ai/route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/ai/route.ts): API 라우터 등록
* **테스트**:
  * [tests/review-analysis.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/review-analysis.test.ts): AI 분석 전체 레이어 및 API 통합 테스트 수립
  * [tests/review-pipeline.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/review-pipeline.test.ts): 기존 Naver provider timeout mock 에러(테스트 timeout) 수정 반영

---

## 4. 테스트 결과
Vitest를 활용하여 7개 테스트 파일 총 73개 시나리오가 모두 완벽히 통과되었습니다.
```text
 ✓ tests/health.test.ts  (1 test) 58ms
 ✓ tests/auth.test.ts  (12 tests) 1621ms
 ✓ tests/workspace.test.ts  (14 tests) 150ms
 ✓ tests/market.test.ts  (7 tests) 88ms
 ✓ tests/market-mutation.test.ts  (12 tests) 190ms
 ✓ tests/review-pipeline.test.ts  (11 tests) 4103ms
 ✓ tests/review-analysis.test.ts  (16 tests) 3100ms

 Test Files  7 passed (7)
      Tests  73 passed (73)
```

---

## 5. Self Review
* [x] **Database 저장 금지 준수**: DDL 변경, Migration 생성이 일절 없으며 DB 적재 로직을 완전히 생략해 API Response로 처리했습니다.
* [x] **Token Truncation 보존 정책**: 토큰 초과 시 수집시간 기준 최신 리뷰부터 유지하며, 안전하게 토큰 제한선(4096) 이하로 자동 축소되도록 검증했습니다.
* [x] **다단계 유효성 검증**: Schema와 긍정/부정 비율 백분율 합산 100% 조건 불충족 시 `AIResponseValidationError`가 발생함을 완벽히 테스트 검증 완료했습니다.
* [x] **ESLint / TypeScript Strict Mode 무오류**: 엄격 컴파일 및 스타일 체크 통과 완료.

---

## 6. Known Issues
```text
None
```
