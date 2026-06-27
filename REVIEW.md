# REVIEW.md (Sprint 4-4 Review)

본 문서는 **Sprint 4-4 (Creative Pipeline - FLUX API Integration & Image Prompt Builder)** 완료 후, **ChatGPT (Project Manager)**의 코드 리뷰와 승인을 지원하기 위해 작성된 스프린트 리뷰 보고서입니다.

---

## 1. Sprint 정보
* **Sprint 번호**: Sprint 4-4
* **대상 작업**: Product Strategy 8단계 스토리보드를 이미지 생성용 프롬프트 명세로 가공하고, FLUX 이미지 생성 요청 스펙을 완성하는 `creative` 모듈 설계 및 검증
* **Commit Message**: `feat(creative): Sprint 4-4 Creative Pipeline`

---

## 2. 구현 내용
* **Zod strict 스키마 및 zod-to-json-schema 동기화**:
  * schema.ts 파일에 `creativeResultSchema` Zod 스키마를 선언하고 `.strict()` 제약을 가해 Unknown Field 유입을 완벽 차단했습니다.
  * Zod Schema를 `zod-to-json-schema` 로 동적 파싱하여 프롬프트의 JSON Schema v7 플레이스홀더를 동적으로 바인딩했습니다.
* **parser.ts 구현**:
  * markdown 백틱 기호(```json), 외부 설명 텍스트를 제거하고 순수 JSON 본체만을 안전하게 분리해 Zod validator단으로 매핑합니다.
* **validator.ts 구현 (Zod 검증 + Custom Validation)**:
  * 1단계: Zod safeParse를 통한 타입, 필수 누락, null/undefined, 빈 문자열, strict check 검증.
  * 2단계: 스토리보드 8개 Scene 정합성(정확히 8개, step 1~8 순차 오름차순 배치, 중복/누락 없음, 씬 타입/이름이 `Attention`, `Problem`, `Empathy`, `Solution`, `Differentiation`, `Trust`, `Offer`, `CTA` 와 완벽히 일치하는지)을 수동 순회 검사하여 불일치 시 명확한 에러를 throw 하도록 구축했습니다.
* **provider.ts 구현 (FLUX API 및 추상화 인터페이스)**:
  * `ImageGenerationProvider` 추상 인터페이스를 선언하여 향후 Stable Diffusion, Gemini Image 등으로의 교체 구조를 확보했습니다.
  * `FluxImageProvider` 구현체 내에 Replicate/BFL API Spec에 매핑되는 Request Payload 빌드 및 fetch, 응답 URL 파싱 로직을 이식 완료했습니다.
* **service.ts 및 index.ts 구현**:
  * `AIProvider` 와 `ImageGenerationProvider`를 DI 방식으로 안전하게 주입받는 `CreativeService` 설계 및 오케스트레이션 구현.
* **테스트 및 린트**:
  * Vitest 유닛 테스트를 통해 경계값 분기, 에러 발생 상세, 결정론적 100회 실행, Mock DI Provider 연동, Replicate/BFL 응답 매핑 분기 테스트를 전개하여 **커버리지 100%** 및 린트/컴파일 무오류를 확인했습니다.

---

## 3. 변경 파일
* **creative 모듈 (신규)**:
  * [backend/src/modules/creative/types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/creative/types.ts)
  * [backend/src/modules/creative/constants.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/creative/constants.ts)
  * [backend/src/modules/creative/schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/creative/schema.ts)
  * [backend/src/modules/creative/parser.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/creative/parser.ts)
  * [backend/src/modules/creative/validator.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/creative/validator.ts)
  * [backend/src/modules/creative/prompt.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/creative/prompt.ts)
  * [backend/src/modules/creative/provider.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/creative/provider.ts)
  * [backend/src/modules/creative/service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/creative/service.ts)
  * [backend/src/modules/creative/index.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/creative/index.ts)
* **테스트**:
  * [backend/tests/creative.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/creative.test.ts)

---

## 4. 테스트 결과
```text
 RUN  v1.6.1 /Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend
      Coverage enabled with v8

 ✓ tests/creative.test.ts  (26 tests) 68ms

 Test Files  1 passed (1)
      Tests  26 passed (26)
   Start at  22:40:15
   Duration  285ms (transform 63ms, setup 0ms, collect 83ms, tests 68ms, environment 0ms, prepare 51ms)

 % Coverage report from v8
--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------|---------|----------|---------|---------|-------------------
All files     |     100 |      100 |     100 |     100 |                   
 constants.ts |     100 |      100 |     100 |     100 |                   
 index.ts     |     100 |      100 |     100 |     100 |                   
 parser.ts    |     100 |      100 |     100 |     100 |                   
 prompt.ts    |     100 |      100 |     100 |     100 |                   
 provider.ts  |     100 |      100 |     100 |     100 |                   
 schema.ts    |     100 |      100 |     100 |     100 |                   
 service.ts   |     100 |      100 |     100 |     100 |                   
 types.ts     |     100 |      100 |     100 |     100 |                   
 validator.ts |     100 |      100 |     100 |     100 |                   
--------------|---------|----------|---------|---------|-------------------
```

---

## 5. Self Review
* [x] **Zod 및 Custom Double-Check 유효성 검사**: Zod 의 strict() 검출과 더불어 step 1~8 배치, 중복/누락, 씬 명칭이 스토리보드 순서와 정합하는지 수동 validator.ts에 추가 기입해 LLM의 논리적 이탈을 100% 차단합니다.
* [x] **Markdown/자연어 설명 우회 정제**: 파서 단에서 trim 및 brace index tracking 을 이식해 LLM이 규격을 위반하고 마크다운 코드블록을 반환해도 에러 없이 안전하게 정제 파싱을 완료합니다.
* [x] **외부 의존성 배제**: Math.random(), new Date(), DB/Repository 접근을 일절 금지하여 Pure한 Stateless Layer를 유지했습니다.
* [x] **100% 커버리지 만족**: Statements, Lines, Branches, Functions 모두 누락 없이 커버리지 100% 만족.

---

## 6. Known Issues
```text
None
```
