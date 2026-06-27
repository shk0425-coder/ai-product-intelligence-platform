# CONTEXT.md (Project Handover Document for ChatGPT PM)

이 문서는 **ChatGPT (프로젝트 매니저/PM)**가 새로운 대화 세션을 시작할 때, 이전 개발 흐름과 프로젝트 상태를 즉시 동기화하고 연계 작업을 이어가기 위한 **프로젝트 인계 문서**입니다.

---

## 1. Project Summary
* **프로젝트명**: AI Product Intelligence Platform
* **프로젝트 목적**: 고객 결핍(JTBD) 기반 시장성 평가, S~D 등급 분류, 상품 기획 및 크리에이티브 시안 도출과 판매 피드백 학습을 자동화하는 AI 플랫폼 구축.
* **현재 버전**: v0.7.0
* **현재 단계**: Phase 3 - Scaffolding Backend & Scraper
* **현재 Sprint**: Sprint 3-7 - AI Review Analyzer & JTBD Intelligence 완료 (PM 검토 대기)

---

## 2. Current Goal
* **현재 Sprint**: Sprint 3-7 (AI Review Analyzer & JTBD Intelligence)
* **현재 작업 (Task)**: Sprint 3-7 완료 검토 대기
* **완료 조건 (Definition of Done)**:
  1. AI 모듈(`modules/ai/`)을 독립 설계하여 비즈니스 레이어 격리.
  2. Gemini API 호출용 `GeminiProvider`를 Node.js 내장 `fetch` 기반으로 무의존성 경량 구현 및 60초 타임아웃, 2회 재시도, Exponential backoff(1s, 2s) 이식.
  3. `PromptBuilder`를 Role -> Task -> Rules -> Output JSON Schema -> Review Data 구조로 컴파일하도록 제어.
  4. 토큰 연산식 및 4096 한계 도달 시 수집 일시 기준 최신 리뷰 목록만 유지하고 자동 절단하는 `TokenManager` 이식.
  5. Markdown 백틱을 제거하고 파싱하는 `ResponseParser` 및 Zod / 100% 비율 검사를 수행하는 2단계 `AIValidator` 구축.
  6. Database 저장 금지 정책 준수 (DB 적재 생략 및 스키마 변경 미수행).
  7. API endpoint `POST /api/v1/reviews/analyze` 개발, JWT 인증 및 Zod 유효성 검증 적용.
  8. Vitest를 활용하여 7개 테스트 파일 총 73개 성공 완수.
  9. `REVIEW.md`, `CONTEXT.md`, `DECISIONS.md` 갱신 및 Git Commit & Push 완료.

---

## 3. Current Progress
* [x] **Product Intelligence Framework v3.0 최종 사양 확정** (JTBD 상황 모델링, S~D 등급제)
* [x] **AI Agent Architecture v1.1 설계 수립** (Task Planner 및 비동기 Orchestrator)
* [x] **Database Architecture v1.1 Final 설계 확정 및 동결(Freeze)** 완료
* [x] **Core Domain Database DDL 구현 완료** (`01_extensions.sql` ~ `07_triggers.sql`)
* [x] **Market Domain Database DDL 구현 완료** (`08_market_tables.sql` ~ `11_market_triggers.sql`)
* [x] **GitHub Repository 운영 규칙 반영 및 Git 저장소 구성 완료** (.gitignore 작성, develop 브랜치 운용)
* [x] **Sprint 2-3 ~ 2-6: 데이터베이스 마이그레이션 DDL 구축 완료** [APPROVED]
* [x] **Sprint 3-1: Backend Scaffold 및 Infrastructure 구축 완료** [APPROVED]
* [x] **Sprint 3-2: Authentication Module 구축 완료** [APPROVED]
* [x] **Sprint 3-3: Workspace API & Database 연동 개발 완료** [APPROVED]
* [x] **Sprint 3-4: Sprint 3-3 개선사항 반영 및 Market Domain 구축 완료** [APPROVED]
* [x] **Sprint 3-5: Market Mutations & Scraper Infrastructure Setup 완료** [APPROVED]
* [x] **Sprint 3-6: Review Intelligence Pipeline & First Provider Integration 완료** [APPROVED]
* [x] **Sprint 3-7: AI Review Analyzer & JTBD Intelligence 완료** (AI 분석 엔진 분리, TokenManager, Gemini Provider, Parser, Validator, Analyze API 구현 완료 및 DB 저장 생략 준수)

---

## 4. Session Memory (임시 세션 메모리)
*Empty*

---

## 5. Recent Decisions (최근 핵심 의사결정 - 최대 5개)
1. **AI 분석 영속 저장 배제 정책** (2026-06-27): 이번 스프린트에서는 데이터 저장을 완전히 금지하고 분석 수행 후 API Response까지만 결과를 구성해 반환하도록 아키텍처를 단순화함.
2. **Token Manager 컴포넌트 신설 및 Truncation** (2026-06-27): 프롬프트 토큰 계산(`Math.ceil(length / 3)`) 및 최대 토큰 제한(4096 tokens)을 도입하고, 토큰 한계 초과 시 수집 일시(`collected_at`)를 기준으로 정렬하여 최신 리뷰는 유지하고 초과 분을 절단하는 기능을 TokenManager에 설계함.
3. **AI Provider Framework 및 Request Options 표준화** (2026-06-27): `AIProvider` 인터페이스 시그니처에 `options: AIRequestOptions`를 통합 적용하여 모델 정보, 온도(`0.2`), 타임아웃(`60초`), 최대 출력 토큰(`4096`), 버전(`v1`) 등을 유연하게 주입받도록 구성함.
4. **다단계 유효성 검증 적용** (2026-06-27): AI 응답의 구조 및 신뢰성을 검증하기 위해 Zod schema validation과 긍정/부정 비율 백분율 합산 100% 조건 불충족 시 `AIResponseValidationError`를 throw 하는 Business validation 레이어를 통합함.
5. **무의존성 Gemini Provider 이식** (2026-06-27): 외부 npm 의존성을 늘리지 않고 native fetch와 AbortController를 사용하여 60초 Timeout, 2회 Retry, Exponential Backoff를 안전하게 처리함.

---

## 6. Pending Review (최우선 검토 목적)
* **Sprint 3-7 AI Review Analyzer Engine 구현체 검토 및 승인 요청**:
  * 대상 폴더/파일: `backend/src/modules/ai/`, `backend/tests/review-analysis.test.ts`
  * 검토 요점: TokenManager 한도 연산 및 최신 순 Truncation, 2단계 Validation(Zod 및 sentiment 합산 100%), Gemini fetch Retry/Timeout 및 DB 미저장 정책 준수 여부.

---

## 7. Next Action
* **ChatGPT (PM)**:
  1. 다음 마일스톤인 **[Sprint 3-8] AI Review Analysis Persistent Pipeline & Storage 작업 지시서**를 작성해 주십시오.

---

## 8. Current Blockers
* **없음**

---

## 9. Important Notes
* **CONTEXT.md는 ChatGPT 전용 문서**입니다. 새로운 세션 시작 시 이 파일만 로드하면 이전 흐름이 완벽히 이어집니다.
* **모든 신규 기능은 modules 기반으로 개발한다.**
* **비즈니스 로직은 services 계층에서만 구현한다.**
* **Repository는 Database 접근만 담당한다.**
* ChatGPT는 프로젝트 관리와 리뷰를 담당하며, 모든 세부 작업 지시는 항상 ChatGPT가 작성합니다.

---

## 10. Conversation Resume (대화 재개 절차)
0. **Project Summary** 확인
1. **Current Goal** 확인
2. **Recent Decisions** 확인
3. **Pending Review** 수행
4. **Next Action** 작성
5. Antigravity 작업지시 생성
6. **CONTEXT.md** 업데이트

---

## 11. Last Update
* **업데이트 날짜**: 2026-06-27
* **완료 Sprint**: Sprint 3-7 (AI Review Analyzer & JTBD Intelligence)
* **다음 Sprint**: Sprint 3-8 (Analysis Persistence Pipeline)
