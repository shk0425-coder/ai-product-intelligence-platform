# Implementation Plan: Sprint 4-4 Creative Pipeline (FLUX API Integration & Image Prompt Builder)

본 스프린트(4-4)에서는 Product Strategy 가 도출한 8단계 상세페이지 스토리보드를 이미지 생성용 프롬프트 명세(Image Prompt, Negative Prompt, Style, Camera, Lighting, Composition)로 가공하고, FLUX 이미지 생성 요청 스펙을 완성하는 `creative` 모듈을 신설 구축합니다.

이 모듈은 이미지 파일 로컬 저장 및 HTML 빌드 연동을 제외하고, 오직 씬별 프롬프트 구조화 생성, FLUX Provider 인터페이스 연동, AI 응답 파싱 및 엄격한 8개 씬 정합성 검증 흐름을 전담하는 Stateless Pure Function 레이어로 설계합니다.

---

## User Review Required

> [!IMPORTANT]
> **1. Image Generation Provider 인터페이스 추상화**
> 향후 Stable Diffusion, Gemini Image, OpenAI DALL-E 등으로의 플러그인 교체가 자유롭도록 `ImageGenerationProvider` 인터페이스를 `provider.ts`에 독립 수립하고, FLUX API 전용 payload를 조립하여 호출하는 `FluxImageProvider` 구현체를 이식합니다.
> 
> **2. 8개 Scene 정합성 검증 (Custom Validation)**
> Zod basic validation을 거친 뒤, `validator.ts`에서 각 Scene의 `step` 번호(1~8 순차 오름차순), 중복 금지, 씬 이름(Attention~CTA)이 스토리보드 원본과 일대일 정합하는지 2차 정밀 수동 검사를 강제합니다.

---

## Proposed Changes

새로운 모듈을 생성합니다.

```text
backend/src/modules/creative/
```

구성

```text
creative/
    prompt.ts
    schema.ts
    parser.ts
    validator.ts
    provider.ts
    service.ts
    types.ts
    constants.ts
    index.ts
```

---

## 1. backend/src/modules/creative/

### [NEW] types.ts
* `CreativeInput`, `CreativeResult`, `StoryboardScene`, `ImagePrompt`, `NegativePrompt`, `ImageStyle`, `CameraAngle`, `Lighting`, `Composition` 타입 정의.
* `SceneType` ('Attention' | 'Problem' ...), `PromptLanguage`, `AspectRatio` Enum 정의.

### [NEW] constants.ts
* `PROMPT_VERSION` 상수 선언.
* `PROMPT_TEMPLATE`: Role, Objective, Storyboard, Image Rules, Output Rules, JSON Schema, Constraints 플레이스홀더 정의.
* `IMAGE_STYLE_RULES` 및 `FLUX_DEFAULT_OPTIONS` (aspect ratio, steps, guidance scale 등) 선언.
* `VALIDATION_LIMITS` 문자열 제한 상수 선언.

### [NEW] schema.ts
* `creativeResultSchema`: Zod 기반 strict() 검증 스키마 정의 (8개 scenes 및 세부 DTO).
* `getJsonSchemaString()`: `zod-to-json-schema`를 호출해 템플릿용 JSON Schema v7 문자열 반환.

### [NEW] parser.ts
* `parseResponse(raw)`: markdown 백틱 정제 및 JSON Parse 수행 (jtbd/product-strategy 와 동일 구조).

### [NEW] validator.ts
* `validateResult(parsed)`:
  * 1단계: Zod schema validation (타입 오류, Required 누락, null/undefined, 빈 문자열, strict unknown key 체크).
  * 2단계: 8개 Scene 여부, step 1~8 번호 검사, 중복/누락 검사, 순서 유지 검사, 단계 이름 일치 검사 (`STORYBOARD_STEPS` 테이블 순차 매칭).
  * 실패 시 상세 에러 throw.

### [NEW] provider.ts
* `ImageGenerationProvider` 추상 인터페이스 정의.
* `FluxImageProvider`: `ImageGenerationProvider`를 구현하며, FLUX API Request Payload를 생성하고 mock/실제 연동을 대행하는 역할 탑재.

### [NEW] service.ts
* `CreativeService`: `AIProvider` (텍스트 프롬프트 생성용) 및 `ImageGenerationProvider` (FLUX 이미지 생성용)를 DI 주입받아, Prompt 빌드 ➡️ AI 호출 ➡️ Parsing ➡️ Validation ➡️ DTO 반환의 Stateless 오케스트레이션 수행.

### [NEW] index.ts
* 외부 연동용 Service, Provider, Types, Constants 일괄 export.

---

## 2. 테스트 명세

### [NEW] tests/creative.test.ts

* **Prompt Spec**: 동일 입력 100회 실행 시 항상 동일한 프롬프트 조립 문자열이 생성되는지 검증 (Date, Random 무의존성).
* **Schema Spec**: Zod 스키마로부터 생성된 JSON Schema 가 Prompt 내용 내 `{jsonSchema}` 와 일치하는지 검증.
* **Parser Spec**: 정상 JSON, 백틱 정제 파싱, 잘못된 포맷(Invalid JSON) 입력 시 에러 발산 검증.
* **Validator Spec**:
  * Scene 단계 개수 미달/초과(예: 7개 혹은 9개) 시 에러 검사.
  * Step 순서가 뒤섞였거나 누락이 있는 경우(예: step 1, 3, 2, 4...) 에러 검사.
  * Step 명칭이 불일치하는 경우 에러 검사.
  * Required 필드 누락, Unknown field 존재 시 Zod.strict() 검출 검사.
  * null, undefined, 빈 문자열, 최대 길이 초과 시 검출 검사.
* **Provider Spec**:
  * Request payload 조립 및 parameters 검증.
  * Response mapping 검증 및 Mock Provider 검증.
  * 호출 횟수 1회 보장 검증.
* **Service Spec**: Prompt ➡️ AI Provider ➡️ Parser ➡️ Validator ➡️ DTO 전체 흐름 및 Provider 예외 전파 검증.
* **Coverage**: `creative` 모듈 Statements/Branches/Lines/Functions 100% 커버리지 검증.

---

## Verification Plan

### Automated Tests
```bash
npx vitest run tests/creative.test.ts
npm run lint
npm run build
npx vitest run --coverage --coverage.include="src/modules/creative/**" tests/creative.test.ts
```

성공 조건
* Vitest 전체 통과
* ESLint 오류 0건
* TypeScript Strict 오류 0건
* `creative` 모듈 커버리지 100% 만족
