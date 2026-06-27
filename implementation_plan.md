# Implementation Plan: Sprint 4-1 Deterministic Rule Engine

본 스프린트(4-1)에서는 AI 분석 결과를 바탕으로 100% 결정론적인 상품 등급 평가를 수행하는 룰 엔진(`rule-engine`) 모듈을 구축합니다. 본 모듈은 외부 의존성(DB, AI, Env, Date 등)이 일절 배제된 Stateless Pure Function 형태로 설계됩니다.

---

## User Review Required

> [!IMPORTANT]
> **1. 지표 정규화 및 스케일링 정책**
> 입력값 중 `reviewVolume`(예: 2134) 및 `marketGrowth`(예: 11.2)는 0~100 범위의 일반 Score와 단위가 다릅니다. 왜곡 없는 가중합 산출을 위해, `constants.ts`에 정의된 한계치(`min`/`max`)를 기준으로 두 지표를 0~100점 사이로 선형 변환(Linear Interpolation)한 뒤 가중합을 계산하도록 설계했습니다.
> 
> **2. 최소 Reason 보장 알고리즘 (Edge Case)**
> "최소 3개, 최대 10개의 Reason 보장" 규칙을 준수하기 위해, 조건(80 이상 혹은 40 이하)에 완벽히 매칭되는 지표가 3개 미만일 경우, 임계치(80 또는 40)와의 거리(차이)가 가장 작은 지표들부터 순서대로 강제 추출하여 최소 3개를 반드시 충족한 후 반환하도록 로직을 강화했습니다.

---

## Proposed Changes

새로운 모듈 `backend/src/modules/rule-engine/` 하위에 9개의 파일들을 추가하고, 독립적인 라이브러리로 작동하게 배포합니다.

### 1. `backend/src/modules/rule-engine/`

#### [NEW] [types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/rule-engine/types.ts)
* `RuleEngineInput` (8개 분석 지표 포함 DTO) 정의.
* `Grade` (S, A, B, C, D) Enum 정의.
* `RuleEngineOutput`, `RuleEngineOptions` 정의.

#### [NEW] [constants.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/rule-engine/constants.ts)
* `WEIGHTS`: 8개 지표의 가중합 가중치 선언 (합계 1.0).
* `SCALING_RULES`: `reviewVolume` 및 `marketGrowth` 최소/최대 변환 기준 설정.
* `GRADE_RULES`: 등급 구간(S~D) 테이블 데이터 선언.
* `VALIDATION_LIMITS`: NaN, Infinity, 음수 및 상한 임계치 필터 규격.
* `REASON_RULES`: 지표별 긍정/부정 판단 임계치 및 우선순위(`priority`), 메시지 선언.

#### [NEW] [validator.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/rule-engine/validator.ts)
* `validateInput(input)`: 필수 키, NaN/Infinity, 음수/상한 한도 검사 및 예외 throw 전담.

#### [NEW] [score.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/rule-engine/score.ts)
* `calculateNormalizedScore(value, rule)`: 원시 데이터 선형 스케일링.
* `calculateWeightedScore(input)`: 가중치 곱 계산 및 `Math.round(WeightedSum)`을 통한 정수 점수 리턴.

#### [NEW] [grade.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/rule-engine/grade.ts)
* `determineGrade(score)`: `GRADE_RULES` 테이블을 순회하며 일치하는 `Grade` 반환.

#### [NEW] [reason.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/rule-engine/reason.ts)
* `generateReasons(input, normalizedScores)`: 임계치(>=80, <=40) 대조 및 정렬. 최소 3개 미만 시 거리 기반 강제 보간, 10개 초과 시 priority 기반 Truncation.

#### [NEW] [calculator.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/rule-engine/calculator.ts)
* `calculateGradeAndScore(input, options)`: 검증 ➡️ 정규화 ➡️ 가중합 ➡️ 등급 ➡️ 이유 연쇄 오케스트레이션. options.debug에 따른 debug 메타 구조화.

#### [NEW] [engine.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/rule-engine/engine.ts)
* `calculate(input, options)`: 딥 카피 및 `Object.freeze` 기법을 적용해 입력 객체 불변을 완전히 보장하는 진입점.

#### [NEW] [index.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/rule-engine/index.ts)
* 모듈 공개 진입 인터페이스(Engine, Types, Constants) 일괄 export.

---

### 2. `backend/tests/`

#### [NEW] [rule-engine.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/rule-engine.test.ts)
* **경계값 테스트**: 49, 50, 69, 70, 84, 85, 94, 95 점수 경계 등급 분기 확인.
* **가중합 검증**: `constants.ts`에 정의된 가중합 정합성 테스트.
* **예외 처리**: undefined, null, NaN, Infinity, 음수, 101 이상(Score 기준) 입력 시 에러 발산 검증.
* **결정론적 검증**: 동일 입력 100회 실행 시 항상 동일한 결과, 동일 순서 Reason 검증.
* **불변성 검증**: `Object.freeze(input)` 적용 후 `calculate()` 시 입력 객체가 전혀 변형되지 않는지 검증.
* **정렬 무관성**: 입력 키(Key) 순서가 무작위인 객체에 대해서 동일한 연산 결과 리턴 검증.
* **Reason 검증**: 최소 3개 및 최대 10개 강제 보장 및 Truncation 룰 작동 확인.
* **디버그 옵션**: `debug=true` 및 `debug=false` 시 반환 키 분기 확인.
* **커버리지 100%** 도달 테스트 스위트 수립.

---

## Verification Plan

### Automated Tests
* `npx vitest run tests/rule-engine.test.ts` 를 통해 모든 격리 테스트 100% 성공 검증.
* `npm run lint` 및 `npm run build` 를 실행하여 린트 컴파일 에러 0건 보장.

### Manual Verification
* `npx vitest run --coverage` (또는 c8/v8 연동)를 통해 `rule-engine` 모듈 내 TS 코드라인 100% 커버리지 확인.
