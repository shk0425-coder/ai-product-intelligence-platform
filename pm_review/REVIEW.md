# REVIEW.md (Sprint 4-2 Review)

본 문서는 **Sprint 4-2 (JTBD Information Extraction Prompt Engine)** 완료 후, **ChatGPT (Project Manager)**의 코드 리뷰와 승인을 지원하기 위해 작성된 스프린트 리뷰 보고서입니다.

---

## 1. Sprint 정보
* **Sprint 번호**: Sprint 4-2
* **대상 작업**: AI Review Analyzer 수집 리뷰를 가공해 JTBD 정보(고객 요구)를 구조화하여 추출하는 프롬프트 엔진(`jtbd`) 모듈 설계 및 검증
* **Commit Message**: `feat(jtbd): Sprint 4-2 JTBD Information Extraction Prompt Engine`

---

## 2. 구현 내용
* **Zod 기반 스키마 단일 정의 및 strict() 제한**:
  * schema.ts 파일에 `jtbdAnalysisResultSchema` Zod 스키마를 정의하고 `.strict()` 제약을 설정하여 LLM 응답 시 규격 외 Unknown Field 차단 검증을 수행합니다.
* **zod-to-json-schema 동기화**:
  * Zod Schema를 `zod-to-json-schema` 라이브러리로 컴파일하여 Prompt String에 내장될 JSON Schema 7을 동적으로 생성하고, 이를 통해 스키마 변경 시 Prompt와 Validator가 단 하나의 선언으로 자동 100% 동기화되도록 아키텍처를 단순화했습니다.
* **parser.ts 구현**:
  * 마크다운 기호(\`\`\`json 등), 코드 블록, 설명 텍스트 등이 유입될 경우 JSON 괄호 시작과 끝을 감지해 순수 JSON만 발취해 내어 Zod 파싱 전단에서 완벽하게 정제합니다.
* **validator.ts 구현**:
  * Zod의 `safeParse` 를 통해 null/undefined 누락, 빈 문자열, Enum 범위 이탈, 문자/배열 최대 길이 한계 초과 등을 검사하며, 오류 발생 시 필드별 원인을 합산해 명확한 Error 메시지를 발생시킵니다.
* **prompt.ts 구현**:
  * constants.ts 의 템플릿에 데이터(상품명, 키워드, 리뷰 목록, AI Review Analysis 요약) 및 JSON Schema를 포맷팅 주입하며, Date/Random/Env 등의 의존성이 전혀 없어 동일 인풋 시 100% 동일한 프롬프트 문자열이 결정론적으로 생성되도록 구축했습니다.
* **service.ts 및 index.ts 구현**:
  * `AIProvider` 인터페이스를 주입(DI)받아 연동 오케스트레이션(Prompt ➡️ 호출 ➡️ Parsing ➡️ Validation ➡️ DTO 반환)을 수행하는 Stateless 계산 서비스 구조를 채택했습니다.
* **테스트 및 린트**:
  * Vitest 유닛 테스트를 통해 경계값 분기, 에러 발생 상세, 결정론적 100회 실행, Mock DI Provider 연동을 입증하여 **커버리지 100%** 및 린트/컴파일 무오류를 확인했습니다.

---

## 3. 변경 파일
* **jtbd 모듈 (신규)**:
  * [backend/src/modules/jtbd/types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/jtbd/types.ts)
  * [backend/src/modules/jtbd/constants.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/jtbd/constants.ts)
  * [backend/src/modules/jtbd/schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/jtbd/schema.ts)
  * [backend/src/modules/jtbd/parser.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/jtbd/parser.ts)
  * [backend/src/modules/jtbd/validator.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/jtbd/validator.ts)
  * [backend/src/modules/jtbd/prompt.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/jtbd/prompt.ts)
  * [backend/src/modules/jtbd/service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/jtbd/service.ts)
  * [backend/src/modules/jtbd/index.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/jtbd/index.ts)
* **테스트**:
  * [backend/tests/jtbd.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/jtbd.test.ts)

---

## 4. 테스트 결과
```text
 RUN  v1.6.1 /Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend
      Coverage enabled with v8

 ✓ tests/jtbd.test.ts  (19 tests) 22ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  22:20:31
   Duration  246ms (transform 50ms, setup 0ms, collect 70ms, tests 21ms, environment 0ms, prepare 68ms)

 % Coverage report from v8
--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------|---------|----------|---------|---------|-------------------
All files     |     100 |      100 |     100 |     100 |                   
 constants.ts |     100 |      100 |     100 |     100 |                   
 index.ts     |     100 |      100 |     100 |     100 |                   
 parser.ts    |     100 |      100 |     100 |     100 |                   
 prompt.ts    |     100 |      100 |     100 |     100 |                   
 schema.ts    |     100 |      100 |     100 |     100 |                   
 service.ts   |     100 |      100 |     100 |     100 |                   
 types.ts     |     100 |      100 |     100 |     100 |                   
 validator.ts |     100 |      100 |     100 |     100 |                   
--------------|---------|----------|---------|---------|-------------------
```

---

## 5. Self Review
* [x] **Zod 및 JSON Schema 단일 정의 준수**: `zod-to-json-schema` 를 통해 validator용 Zod 와 프롬프트용 스키마 문자열을 중복 없이 한곳에서 싱크 처리했습니다.
* [x] **Markdown/자연어 설명 우회 정제**: 파서 단에서 trim 및 brace index tracking 을 이식해 LLM이 규격을 위반하고 마크다운 코드블록을 반환해도 에러 없이 안전하게 정제 파싱을 완료합니다.
* [x] **외부 의존성 배제**: Math.random(), new Date(), DB/Repository/Rule Engine 접근을 일절 금지하여 Pure한 Stateless Layer를 유지했습니다.
* [x] **100% 커버리지 만족**: Statements, Lines, Branches, Functions 모두 누락 없이 커버리지 100% 만족.

---

## 6. Known Issues
```text
None
```
