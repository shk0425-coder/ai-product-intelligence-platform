# Implementation Plan: Sprint 4-3 Product Strategy Generator (8-Step Storyboard Builder)

본 스프린트(4-3)에서는 JTBD 분석 결과와 AI Review Analysis 결과를 기반으로 판매 전략 중심의 상세페이지 8단계 스토리보드를 생성하는 `product-strategy` 모듈을 신설 구축합니다.

이 모듈은 데이터베이스 저장 및 HTML/이미지 렌더링 파이프라인과 격리되어, 오직 입력 가공, 8단계 구조 정합성 검증, AI 호출 및 DTO 반환 흐름만을 전담하는 Stateless Pure Function 레이어로 완성합니다.

---

## User Review Required

> [!IMPORTANT]
> **1. 8단계 스토리보드 정합성 2차 유효성 검증 (Custom Validation)**
> Zod의 기본 JSON 타입 검증을 마친 후, `validator.ts`에서 상세페이지 8단계 스토리보드 규격(정확히 8개 단계, Step 1~8 순차 배치, 중복 금지, 타입 및 이름 일치)에 대해 2차 정밀 수동 검사를 강제합니다. 이로써 LLM의 구조적 이탈 가능성을 100% 방어합니다.
> 
> **2. 8단계 스토리보드 강제 순서 (Storyboard Rules)**
> Prompt에 아래 순서를 강제하여 생성 품질과 정합성을 보장합니다.
> `1 Attention ➡️ 2 Problem ➡️ 3 Empathy ➡️ 4 Solution ➡️ 5 Differentiation ➡️ 6 Trust ➡️ 7 Offer ➡️ 8 CTA`

---

## Proposed Changes

새로운 모듈을 생성합니다.

```text
backend/src/modules/product-strategy/
```

구성

```text
product-strategy/
    prompt.ts
    schema.ts
    parser.ts
    validator.ts
    service.ts
    types.ts
    constants.ts
    index.ts
```

---

## 1. backend/src/modules/product-strategy/

### [NEW] types.ts
* `ProductStrategyInput`, `ProductStrategyResult`, `Storyboard`, `StoryboardStep`, `CustomerEmotion`, `CustomerQuestion`, `SellingPoint`, `RecommendedContent`, `CTA` 타입 정의.
* `StoryboardStepType` Enum 타입('Attention' | 'Problem' | 'Empathy' | 'Solution' | 'Differentiation' | 'Trust' | 'Offer' | 'CTA') 선언.

### [NEW] constants.ts
* `PROMPT_VERSION` 상수 선언.
* `PROMPT_TEMPLATE`: Role, Objective, Input Data, Storyboard Rules, JSON Schema, Constraints 플레이스홀더 템플릿 정의.
* `STORYBOARD_STEPS`: 스텝별 번호(1~8), 타입(StoryboardStepType), 이름 매칭 테이블 상수 정의.
* `VALIDATION_LIMITS`: 문자열 최대/최소 길이 선언.
* `MAX_TOKENS`, `TEMPERATURE`: AI 호출용 하이퍼 파라미터.
* `OUTPUT_RULES` 선언.

### [NEW] schema.ts
* `productStrategySchema`: Zod 기반 strict() 검증 스키마 정의 (스토리보드 array min(8)/max(8) 및 세부 DTO).
* `getJsonSchemaString()`: `zod-to-json-schema`를 호출해 템플릿용 JSON Schema v7 문자열 반환.

### [NEW] parser.ts
* `parseResponse(raw)`: markdown 백틱 정제 및 JSON Parse 수행 (jtbd 파서 정제식 이식).

### [NEW] validator.ts
* `validateResult(parsed)`:
  * 1단계: Zod schema validation (타입 오류, Required 누락, null/undefined, 빈 문자열, strict unknown key 체크).
  * 2단계: 8개 단계 여부, step 1~8 번호 검사, 중복/누락 검사, 순서 유지 검사, 단계 이름 일치 검사 (`STORYBOARD_STEPS` 테이블 순차 매칭).
  * 실패 시 상세 에러 throw.

### [NEW] prompt.ts
* `buildPrompt(input)`: 상품명, 키워드, JTBD 결과, AI 감성/리뷰 요약을 템플릿에 이식해 결정론적 스토리보드 생성 프롬프트 빌드.

### [NEW] service.ts
* `ProductStrategyService`: `AIProvider` 를 DI 방식으로 주입받아 Prompt 빌드 ➡️ AI 호출 ➡️ Parsing ➡️ Validation ➡️ DTO 반환의 Stateless 오케스트레이션 수행.

### [NEW] index.ts
* 외부 연동용 Service, Types, Constants 일괄 export.

---

## 2. 테스트 명세

### [NEW] tests/product-strategy.test.ts

* **Prompt Spec**: 동일 입력 100회 실행 시 항상 동일한 프롬프트 조립 문자열이 생성되는지 검증 (Date, Random 무의존성).
* **Schema Spec**: Zod 스키마로부터 생성된 JSON Schema 가 Prompt 내용 내 `{jsonSchema}` 와 일치하는지 검증.
* **Parser Spec**: 정상 JSON, 백틱 정제 파싱, 잘못된 포맷(Invalid JSON) 입력 시 에러 발산 검증.
* **Validator Spec**:
  * Storyboard 단계 개수 미달/초과(예: 7개 혹은 9개) 시 에러 검사.
  * Step 순서가 뒤섞였거나 누락이 있는 경우(예: step 1, 3, 2, 4...) 에러 검사.
  * Step 타입/이름 명칭이 불일치하는 경우 에러 검사.
  * Required 필드 누락, Unknown field 존재 시 Zod.strict() 검출 검사.
  * null, undefined, 빈 문자열, 최대 길이 초과 시 검출 검사.
* **Service Spec**: Prompt ➡️ AI ➡️ Parser ➡️ Validator ➡️ DTO 전체 흐름 및 Mock Provider 1회 호출 정합성 검증.
* **Coverage**: `product-strategy` 모듈 Statements/Branches/Lines/Functions 100% 커버리지 검증.

---

## Verification Plan

### Automated Tests
```bash
npx vitest run tests/product-strategy.test.ts
npm run lint
npm run build
npx vitest run --coverage --coverage.include="src/modules/product-strategy/**" tests/product-strategy.test.ts
```

성공 조건
* Vitest 전체 통과
* ESLint 오류 0건
* TypeScript Strict 오류 0건
* `product-strategy` 모듈 커버리지 100% 만족
