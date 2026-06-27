# CONTEXT.md (Project Handover Document for ChatGPT PM)

이 문서는 **ChatGPT (프로젝트 매니저/PM)**가 새로운 대화 세션을 시작할 때, 이전 개발 흐름과 프로젝트 상태를 즉시 동기화하고 연계 작업을 이어가기 위한 **프로젝트 인계 문서**입니다.

---

## 1. Project Summary
* **프로젝트명**: AI Product Intelligence Platform
* **프로젝트 목적**: 고객 결핍(JTBD) 기반 시장성 평가, S~D 등급 분류, 상품 기획 및 크리에이티브 시안 도출과 판매 피드백 학습을 자동화하는 AI 플랫폼 구축.
* **현재 버전**: v0.7.0
* **현재 단계**: Phase 3 - Scaffolding Backend & Scraper
* **현재 Sprint**: Sprint 3-8 - AI Review Analysis Persistence Pipeline & Storage (Final)

---

## 2. Current Goal
* **현재 Sprint**: Sprint 3-8 (AI Review Analysis Persistence Pipeline & Storage)
* **현재 작업 (Task)**: Sprint 3-8 구현 계획 승인 대기 및 구현 준비
* **완료 조건 (Definition of Done)**:
  1. `31_create_review_analysis_results.sql` 신규 마이그레이션 생성 완료.
  2. `AIAnalysisRepository` (Save, FindByIdentity, FindLatest, FindById, Exists) 구현 완료.
  3. `ReviewAnalysisPersistenceService` (SHA-256 Identity 생성, Cache Hit/Miss 분기 및 DB 저장/조회 연동) 구현 완료.
  4. `ReviewAnalysisQueryService` (Latest 조회 및 ID 기반 단일 조회) 구현 완료.
  5. `POST /api/v1/reviews/analyze` 영속성 결합 및 cached 필드(true/false) 추가 완료.
  6. `GET /api/v1/reviews/analysis` (Latest) 및 `GET /api/v1/reviews/analysis/:id` (ID 조회) API 신설 완료.
  7. Vitest 테스트(`analysis-persistence.test.ts`) 작성 및 전체 테스트 패스.
  8. ESLint 및 TypeScript Strict Mode 컴파일 경고/오류 0건.
  9. Sprint 종료에 따른 POS 문서(`REVIEW.md`, `CONTEXT.md`, `DECISIONS.md`, `TODO.md`, `SESSION.md`, `CHANGELOG.md`) 업데이트 자율 완수.
  10. 원격 저장소(`develop` 브랜치) Push 완료 및 PM 리뷰 요청.

---

## 3. Current Progress
* [x] **Product Intelligence Framework v3.0 최종 사양 확정** (JTBD 상황 모델 모델링, S~D 등급제)
* [x] **AI Agent Architecture v1.1 설계 수립** (Task Planner 및 비동기 Orchestrator)
* [x] **Database Architecture v1.1 Final 설계 확정 및 동결** 완료
* [x] **Core Domain Database DDL 구현 완료** (`01_extensions.sql` ~ `07_triggers.sql`)
* [x] **Market Domain Database DDL 구현 완료** (`08_market_tables.sql` ~ `11_market_triggers.sql`)
* [x] **Sprint 2-3: Review Domain Database DDL 구현 완료** (`12_review_tables.sql` ~ `15_review_triggers.sql`)
* [x] **Sprint 2-4: Sourcing / Margin Domain Database DDL 구현 완료** (`16_sourcing_tables.sql` ~ `19_sourcing_triggers.sql`)
* [x] **Sprint 2-5: Strategy / Creative Domain Database DDL 구현 완료** (`20_strategy_tables.sql` ~ `23_strategy_triggers.sql`)
* [x] **Sprint 2-6: Audit / Learning Domain Database DDL 구현 완료** (`24_audit_tables.sql` ~ `27_audit_triggers.sql`)
* [x] **Sprint 3-1: Backend Scaffold 및 Infrastructure 구축 완료** (Fastify, TS Strict, Zod, Pino)
* [x] **Sprint 3-2: Auth 및 Workspace API 개발 완료** (JWT 인증 및 워크스페이스 제어)
* [x] **Sprint 3-3: Market Metric 수집 및 크롤러 연동 완료**
* [x] **Sprint 3-4: Customer Review 수집 파이프라인 완료**
* [x] **Sprint 3-5: Sourcing & Margin API 최적화 완료**
* [x] **Sprint 3-6: Strategy & Creative Brief 모듈 구축 완료**
* [x] **Sprint 3-7: AI Review Analyzer & JTBD Intelligence 엔진 구축 완료** (Gemini 연동, Token 관리, Zod Validation)

---

## 4. Session Memory (임시 세션 메모리)
*Empty*

---

## 5. Recent Decisions (최근 핵심 의사결정 - 최대 5개)
1. **Gemini API 연동 시 60초 Timeout 및 2회 Exponential Backoff 적용** (2026-06-27): 대량 리뷰 분석 시 LLM 호출 지연에 대처하고 일시적인 오류(429/500) 상황을 자율적으로 복구하도록 재시도 메커니즘을 통합함.
2. **리뷰 Token Truncation 엔진 수립** (2026-06-27): 모델 Context Limit을 초과하는 리뷰 입력에 대비해 최신 리뷰를 보존하며 토큰 한계(4096 tokens)까지 안전하게 축소하도록 TokenManager 설계.
3. **Response Schema 강제 및 비즈니스 검증 탑재** (2026-06-27): Zod 검증을 통해 구조 신뢰성을 보장하고, 긍정/부정 감성 수치 합산 100% 검증 등 비즈니스 벨리데이션을 추가 구현함.
4. **Backend Framework로 Fastify 채택** (2026-06-27): Express 대비 높은 성능과 플러그인 생태계를 갖춘 Fastify를 백엔드 웹 프레임워크로 채택함.
5. **선택적 GIN 인덱싱 및 Audit/Learning DDL 완료** (2026-06-27): `storyboard` JSONB에만 GIN 인덱스를 적용하고, `decision_audits`, `knowledge_assets`, `learning_feedback_logs`를 포함한 DDL 작업을 최종 마무리함.

---

## 6. Pending Review (최우선 검토 목적)
* **Sprint 3-8 AI Review Analysis Persistence Pipeline & Storage 구현 계획**:
  - 대상 문서: [implementation_plan.md](file:///Users/kimsanghyeon/.gemini/antigravity-ide/brain/4f384c2a-76ae-4a88-9bf1-2374fec85ea4/implementation_plan.md)
  - 검토 요점: Identity 해시 생성 규칙, 캐싱(Cache Hit/Miss) 파이프라인 구조, 신규 `review_analysis_results` 테이블 마이그레이션 및 쿼리 API 설계 정합성.

---

## 7. Next Action
* **Antigravity (Lead Developer)**:
  1. ChatGPT PM의 구현 계획 승인 후 `31_create_review_analysis_results.sql` 신규 마이그레이션 반영.
  2. `repository.ts`, `persistence-service.ts`, `query-service.ts` 구현 및 기존 API 라우트/컨트롤러 리팩토링.
  3. `analysis-persistence.test.ts` Vitest 테스트 스위트 통과 완료.

---

## 8. Current Blockers
* **없음**

---

## 9. Important Notes
* **CONTEXT.md는 ChatGPT 전용 문서**입니다. 새로운 세션 시작 시 이 파일만 로드하면 이전 흐름이 완벽히 이어집니다.
* **모든 신규 기능은 modules 기반으로 개발한다.**
* **비즈니스 로직은 services 계층에서만 구현한다.**
* **Repository는 Database 접근만 담당한다.**

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
* **완료 Sprint**: Sprint 3-7 (AI Review Analyzer)
* **다음 Sprint**: Sprint 3-8 (AI Review Analysis Persistence Pipeline & Storage)
