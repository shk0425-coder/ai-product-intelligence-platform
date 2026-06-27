# Implementation Plan: Sprint 4-1 Deterministic Rule Engine

본 스프린트(4-1)에서는 AI 분석 결과를 기반으로 100% 결정론적인 상품 등급 평가를 수행하는 `rule-engine` 모듈을 구축합니다.

본 모듈은 외부 의존성(DB, Repository, AI, Environment, Date, Random)이 완전히 배제된 Stateless Pure Function 라이브러리로 구현합니다.

---

## Proposed Changes

새로운 모듈을 생성합니다.

```text
backend/src/modules/rule-engine/
```

구성

```text
rule-engine/
    calculator.ts
    score.ts
    grade.ts
    reason.ts
    validator.ts
    engine.ts
    types.ts
    constants.ts
    index.ts
```

---

## 1. backend/src/modules/rule-engine/

### [NEW] types.ts

* RuleEngineInput 정의
* RuleEngineOutput 정의
* RuleEngineOptions 정의
* DebugInfo 정의
* Grade Enum(S/A/B/C/D) 정의

---

### [NEW] constants.ts

모든 상수는 이 파일에서만 관리합니다.

포함 항목

* WEIGHTS
* SCALING_RULES
* GRADE_RULES
* VALIDATION_LIMITS
* REASON_RULES
* REASON_PRIORITY
* SCORE_LIMITS

서비스 및 계산 함수 내부에서 숫자와 문자열을 직접 작성하지 않습니다.

---

### [NEW] validator.ts

입력 검증만 담당합니다.

검증 대상

* undefined
* null
* NaN
* Infinity
* 음수
* Score 범위 초과
* reviewVolume 범위
* marketGrowth 범위

검증 실패 시 명확한 Error를 발생시키면 됩니다.

---

### [NEW] score.ts

역할

* reviewVolume 정규화
* marketGrowth 정규화
* Weighted Score 계산

정규화는 constants.ts의 SCALING_RULES 기준으로 수행합니다.

최종 계산

```text
Normalization

↓

Weighted Sum

↓

Math.round()

↓

0~100 Clamp

↓

Return Total Score
```

최종 점수는 반드시

```text
0 <= score <= 100
```

범위를 유지합니다.

---

### [NEW] grade.ts

GRADE_RULES 테이블만 순회하여 Grade를 결정합니다.

if-else 체인 구현을 금지합니다.

향후

* AA
* AAA
* F

등급 추가 시

데이터만 수정하면 동작하도록 구현합니다.

---

### [NEW] reason.ts

Reason 생성 전용 모듈입니다.

생성 규칙

* 80 이상 → 긍정 Reason
* 40 이하 → 부정 Reason
* 40~79 → 생성 제외

조건 만족 Reason이 3개 미만이면

Threshold와의 거리가 가장 가까운 항목부터 순서대로 추가하여 최소 3개를 보장합니다.

Reason 우선순위는 constants.ts에서 관리합니다.

동일 입력은

* 동일 Reason
* 동일 순서

를 항상 반환해야 합니다.

최대 10개까지만 반환합니다.

---

### [NEW] calculator.ts

전체 계산 오케스트레이션

실행 순서

```text
Validation

↓

Normalization

↓

Weighted Score

↓

Grade

↓

Reason

↓

Debug 생성(옵션)

↓

Output
```

---

### [NEW] engine.ts

Rule Engine의 공개 진입점입니다.

제공 API

```text
calculate(input)

calculate(input, options)
```

입력 객체를 절대 수정하지 않습니다.

Pure Function 형태로 calculator를 호출하여 결과만 반환합니다.

---

### [NEW] index.ts

외부 공개 인터페이스

Export 대상

* Engine
* Types
* Constants

---

## 테스트

### backend/tests/rule-engine.test.ts

검증 항목

### Grade Boundary

```text
49
50
69
70
84
85
94
95
```

---

### Weight

가중치 계산 검증

---

### Normalization

reviewVolume

marketGrowth

선형 정규화 검증

---

### Clamp

0 미만

100 초과

Clamp 정상 동작 검증

---

### Validation

* undefined
* null
* NaN
* Infinity
* 음수
* Score 101 이상
* reviewVolume 범위 초과
* marketGrowth 범위 초과

---

### Deterministic

동일 입력

100회 반복

항상 동일 결과

---

### Object Immutability

Object.freeze(input)

calculate()

입력 객체 변경 없음

---

### Object Key Order

입력 Key 순서가 달라도

동일 결과 반환

---

### Reason

최소 3개

최대 10개

동일 입력 시

동일 순서 보장

---

### Debug

debug=false

debug=true

모두 검증

---

### Coverage

Rule Engine 모듈

100%

---

## Verification Plan

### Automated Tests

```bash
npx vitest run tests/rule-engine.test.ts
npm run lint
npm run build
npx vitest run --coverage
```

성공 조건

* Vitest 전체 통과
* ESLint 오류 0건
* TypeScript Strict 오류 0건
* Rule Engine Coverage 100%

---

## 구현 원칙

Rule Engine 내부에서는 다음을 절대 사용하지 않습니다.

* Repository
* Database
* AI 호출
* 외부 API
* Environment
* Date
* Date.now()
* new Date()
* Math.random()

입력 → 출력만 수행하는 Stateless Pure Function 구조를 유지합니다.

---

## 완료 조건 (Definition of Done)

* rule-engine 모듈 생성 완료
* calculator / score / grade / reason / validator / engine 구현 완료
* Grade Enum 구현 완료
* Weight 상수 분리 완료
* Grade Rule Table 구현 완료
* Validation 상수 분리 완료
* Reason 상수 분리 완료
* Scaling Rule 구현 완료
* Clamp 구현 완료
* Debug 옵션 구현 완료
* Pure Function 유지
* Deterministic 보장
* Validation 완료
* Reason 생성 완료
* Vitest 전체 통과
* ESLint Flat Config 오류 0건
* TypeScript Strict 오류 0건
* REVIEW.md 업데이트
* CONTEXT.md 업데이트
* DECISIONS.md 업데이트
* Git Commit 및 Push 완료

---

## 중요

이번 Sprint에서는 Rule Engine만 구현합니다.

Controller, API, Repository, Database와 연결하지 않습니다.

독립 라이브러리처럼 구현하여 다음 Sprint에서 AI Analysis Persistence와 연결할 수 있도록 유지합니다.
