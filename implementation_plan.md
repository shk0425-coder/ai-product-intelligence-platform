# Implementation Plan: Sprint 4-2 JTBD Information Extraction Prompt Engine

본 스프린트(4-2)에서는 AI Review Analyzer가 수집한 리뷰 데이터를 기반으로 JTBD(Job To Be Done) 정보를 구조화하여 추출하는 `jtbd` 모듈을 구축합니다.

본 모듈은 Database, Repository, Rule Engine과 완전히 분리된 독립 모듈이며, Prompt 생성, AI 호출, 응답 Parsing, Schema Validation만 담당하는 Stateless 레이어로 구현합니다.

---

# Proposed Changes

신규 모듈 생성

```text
backend/src/modules/jtbd/
```

구성

```text
jtbd/
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

# backend/src/modules/jtbd/

## [NEW] types.ts

정의

* JTBDAnalysisInput
* JTBDAnalysisResult
* JTBD
* PainPoint
* DesiredOutcome
* PurchaseMotivation
* PurchaseBarrier
* UsageContext
* CustomerSegment
* UnexpectedInsight

Enum

* Severity
* Priority

---

## [NEW] constants.ts

관리 대상

* PROMPT_VERSION
* PROMPT_TEMPLATE
* MAX_REVIEWS
* MAX_TOKENS
* TEMPERATURE
* VALIDATION_LIMITS
* OUTPUT_RULES

Prompt 내부 문자열 및 Validation 관련 상수는 모두 이 파일에서만 관리한다.

---

## [NEW] schema.ts

Zod Schema 단일 정의

```text
jtbdAnalysisResultSchema
```

Schema는 반드시 `.strict()`를 사용한다.

Prompt용 JSON Schema와 Runtime Validator는 동일한 Zod Schema를 공유한다.

JSON Schema는

```text
zod-to-json-schema
```

를 이용하여 생성한다.

Schema를 중복 작성하지 않는다.

---

## [NEW] parser.ts

역할

* Markdown 제거
* Code Block 제거
* JSON 추출
* JSON Parse

Validation 수행 금지

비즈니스 로직 금지

Prompt 수정 금지

---

## [NEW] validator.ts

검증

* Required Field
* Unknown Field
* Enum
* Number
* String
* Array
* Object
* null
* undefined
* 빈 문자열
* 최대 길이
* 최소 길이

Validation 실패 시 명확한 Error를 발생시킨다.

---

## [NEW] prompt.ts

Prompt 생성 전담

입력

* 상품명
* 키워드
* 리뷰 목록
* AI Review Analysis 결과

출력

Prompt String

Prompt에는 반드시 포함

* Role
* Objective
* Input Data
* Output Rules
* JSON Schema
* Constraints

동일 입력는 항상 동일 Prompt를 생성해야 한다.

---

## [NEW] service.ts

실행 순서

```text
Prompt 생성

↓

AI 호출

↓

Parser

↓

Validator

↓

DTO 반환
```

Retry

Fallback

Database

Repository

Rule Engine

비즈니스 로직

모두 금지

AI Provider는 생성하지 않고 DI(Dependency Injection) 방식으로 주입받아 사용한다.

---

## [NEW] index.ts

Export

* Service
* Types
* Constants

---

# AI 출력 규칙

AI는 반드시 JSON만 반환한다.

금지

* Markdown
* Code Block
* 설명
* 자연어
* 주석
* Schema 외 Field

---

# 테스트

## tests/jtbd.test.ts

### Prompt

동일 입력

100회 실행

동일 Prompt 생성

---

### Schema

Prompt에 포함된 JSON Schema와

Validator가 사용하는 Zod Schema가 항상 동일함을 검증

---

### Parser

* 정상 JSON
* Markdown JSON
* Code Block JSON
* Invalid JSON
* 설명 포함 JSON

---

### Validator

* Required Field 누락
* Unknown Field
* Enum 오류
* 잘못된 타입
* null
* undefined
* 빈 문자열
* 최대 길이 초과

---

### Service

* Prompt → AI → Parser → Validator → DTO 전체 흐름 검증
* AI Provider Mock 주입 검증
* Provider 호출 횟수 검증(1회)
* Validation 실패 시 예외 전파 검증

---

### Coverage

jtbd 모듈

Statements 100%

Lines 100%

Functions 100%

Branches 100%

---

# Verification Plan

```bash
npx vitest run tests/jtbd.test.ts
npm run lint
npm run build
npx vitest run --coverage --coverage.include="src/modules/jtbd/**" tests/jtbd.test.ts
```

성공 조건

* Vitest 전체 통과
* ESLint 오류 0건
* TypeScript Strict 오류 0건
* jtbd 모듈 Coverage 100%

---

# 구현 원칙

다음 기능은 구현하지 않는다.

* Database 접근
* Repository 사용
* Rule Engine 호출
* Retry
* Fallback
* Date
* Date.now()
* new Date()
* Math.random()
* Environment 접근

입력 → 출력만 수행하는 Stateless 구조를 유지한다.
