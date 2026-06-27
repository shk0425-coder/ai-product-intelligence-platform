# CONTEXT.md (Project Handover Document for ChatGPT PM)

이 문서는 **ChatGPT (프로젝트 매니저/PM)**가 새로운 대화 세션을 시작할 때, 이전 개발 흐름과 프로젝트 상태를 즉시 동기화하고 연계 작업을 이어가기 위한 **프로젝트 인계 문서**입니다.

---

## 1. Project Summary
* **프로젝트명**: AI Product Intelligence Platform
* **프로젝트 목적**: 고객 결핍(JTBD) 기반 시장성 평가, S~D 등급 분류, 상품 기획 및 크리에이티브 시안 도출과 판매 피드백 학습을 자동화하는 AI 플랫폼 구축.
* **현재 버전**: v0.6.0
* **현재 단계**: Phase 3 - Scaffolding Backend & Scraper
* **현재 Sprint**: Sprint 3 - Backend 및 수집기 개발

---

## 2. Current Goal
* **현재 Sprint**: Sprint 3-2 (Authentication Module 개발)
* **현재 작업 (Task)**: Authentication Module & Workspace API 개발 준비
* **완료 조건 (Definition of Done)**:
  1. Supabase Auth 연동 및 사용자 인증 토큰 처리 미들웨어 구현 완료.
  2. Workspace 생성, 조회, 수정 API 설계 및 구현 완료.
  3. API Endpoint Zod Schema Validation 및 에러 처리 확인.
  4. 관련 Route 및 Controller 테스트 작성 및 검증 성공.
  5. `pm_review/REVIEW.md` 및 `pm_review/CONTEXT.md` 갱신 및 Git Commit & Push 자율 완수.

---

## 3. Current Progress
* [x] **Product Intelligence Framework v3.0 최종 사양 확정** (JTBD 상황 모델링, S~D 등급제)
* [x] **AI Agent Architecture v1.1 설계 수립** (Task Planner 및 비동기 Orchestrator)
* [x] **Database Architecture v1.1 Final 설계 확정 및 동결(Freeze)** 완료
* [x] **Core Domain Database DDL 구현 완료** (`01_extensions.sql` ~ `07_triggers.sql`)
* [x] **Market Domain Database DDL 구현 완료** (`08_market_tables.sql` ~ `11_market_triggers.sql`)
* [x] **GitHub Repository 운영 규칙 반영 및 Git 저장소 구성 완료** (.gitignore 작성, develop 브랜치 운용)
* [x] **Sprint 2-3: Review Domain Database DDL 구현 완료** (`12_review_tables.sql` ~ `15_review_triggers.sql`)
* [x] **Sprint 2-4: Sourcing / Margin Domain Database DDL 구현 완료** (`16_sourcing_tables.sql` ~ `19_sourcing_triggers.sql`)
* [x] **Sprint 2-5: Strategy / Creative Domain Database DDL 구현 완료** (`20_strategy_tables.sql` ~ `23_strategy_triggers.sql`)
* [x] **Sprint 2-6: Audit / Learning Domain Database DDL 구현 완료** (`24_audit_tables.sql` ~ `27_audit_triggers.sql`)
* [x] **Backend Scaffold 및 Infrastructure 구축 완료** (Fastify, TS Strict, Zod, Pino) [APPROVED]
* [x] **CONTEXT.md 자동 갱신 규칙 및 v2.5 강화 운영 체계 수립 완료** (AI_START.md 반영)

---

## 4. Session Memory (임시 세션 메모리)
*Empty*

---

## 5. Recent Decisions (최근 핵심 의사결정 - 최대 5개)
1. **Backend Framework로 Fastify 채택** (2026-06-27): Express 대비 높은 성능과 플러그인 생태계를 갖춘 Fastify를 백엔드 웹 프레임워크로 채택함.
2. **TypeScript Strict Mode 적용** (2026-06-27): 엄격한 타입 검사를 통해 런타임 오류를 차단하고 any 사용을 금지하여 코드 정합성을 높임.
3. **공통 Response 규격 통일** (2026-06-27): 모든 API의 정상/오류 응답을 동일한 JSON 규격으로 표준화하고, Fastify 글로벌 에러 핸들러와 연동시킴.
4. **Docker 개발환경 구축** (2026-06-27): Node.js 22 LTS 환경 기반의 핫 리로딩 및 볼륨 마운트가 가능한 백엔드 독립형 컨테이너 Dockerfile 및 compose 설정을 구축함.
5. **선택적 GIN 인덱싱 및 Audit/Learning DDL 완료** (2026-06-27): `storyboard` JSONB에만 GIN 인덱스를 적용하고, `decision_audits`, `knowledge_assets`, `learning_feedback_logs`를 포함한 DDL 작업을 최종 마무리함.

---

## 6. Pending Review (최우선 검토 목적)
* **None** (Sprint 3-1 승인 완료됨)

---

## 7. Next Action
* **ChatGPT (PM)**:
  1. 다음 마일스톤인 **[Sprint 3-2] Authentication Module 개발을 위한 세부 작업 지시서**를 작성해 주십시오.

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
* **완료 Sprint**: Sprint 3-1 (Backend Scaffolding)
* **다음 Sprint**: Sprint 3-2 (Authentication Module)
