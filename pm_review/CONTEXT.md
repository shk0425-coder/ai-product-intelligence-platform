# CONTEXT.md (Project Handover Document for ChatGPT PM)

이 문서는 **ChatGPT (프로젝트 매니저/PM)**가 새로운 대화 세션을 시작할 때, 이전 개발 흐름과 프로젝트 상태를 즉시 동기화하고 연계 작업을 이어가기 위한 **프로젝트 인계 문서**입니다.

---

## 1. Project Summary
* **프로젝트명**: AI Product Intelligence Platform
* **프로젝트 목적**: 고객 결핍(JTBD) 기반 시장성 평가, S~D 등급 분류, 상품 기획 및 크리에이티브 시안 도출과 판매 피드백 학습을 자동화하는 AI 플랫폼 구축.
* **현재 버전**: v0.6.0
* **현재 단계**: Phase 3 - Scaffolding Backend & Scraper
* **현재 Sprint**: Sprint 3-3 - Workspace API & Database 연동 개발

---

## 2. Current Goal
* **현재 Sprint**: Sprint 3-3 (Workspace API 및 Database 연동)
* **현재 작업 (Task)**: Workspace API 및 Database 연동 설계 수립
* **완료 조건 (Definition of Done)**:
  1. Supabase Client와 연계하여 실제 Database의 `workspaces` 테이블 CRUD 연동 구현 완료.
  2. Workspace 생성, 조회, 수정, 삭제 API 구현 완료.
  3. Auth Module의 Mock Repository를 실제 Supabase 연동 Repository로 대체 완료.
  4. API Endpoint Zod Schema Validation 및 에러 처리 확인.
  5. 관련 Route 및 Controller 테스트 작성 및 검증 성공.
  6. `pm_review/REVIEW.md` 및 `pm_review/CONTEXT.md` 갱신 및 Git Commit & Push 자율 완수.

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
* [x] **Sprint 3-1: Backend Scaffold 및 Infrastructure 구축 완료** (Fastify, TS Strict, Zod, Pino) [APPROVED]
* [x] **Sprint 3-2: Authentication Module 구축 완료** (JWT TokenProvider 추상화, bcrypt 해싱, Zod 유효성 체크, Vitest 100% 성공) [APPROVED]
* [x] **CONTEXT.md 자동 갱신 규칙 및 v2.5 강화 운영 체계 수립 완료** (AI_START.md 반영)

---

## 4. Session Memory (임시 세션 메모리)
*Empty*

---

## 5. Recent Decisions (최근 핵심 의사결정 - 최대 5개)
1. **TokenProvider 추상 인터페이스화 및 JwtTokenProvider 구현** (2026-06-27): jsonwebtoken 라이브러리와 서비스 결합도를 제거하여, 향후 Clerk/Auth0/Supabase Auth 등으로 서비스 코드 변경 없이 변경이 가능하도록 함.
2. **UserRole Enum 적용** (2026-06-27): `ADMIN`, `MANAGER`, `USER` 구조의 Enum을 JWT 페이로드에 적용하여 향후 RBAC(역할기반 접근 제어) 구현 시 스키마 변경 최소화.
3. **Repository Interface 분리** (2026-06-27): `IAuthRepository` 규격을 정의하고 `MockAuthRepository`가 이를 구현하여, 다음 Sprint에서 DB 테이블 연결용 Repository로의 쉬운 교체가 가능하도록 함.
4. **CORS 및 API 버전 v1 통일** (2026-06-27): 모든 웹 API 엔드포인트 접두어를 `/api/v1` 경로로 일원화하고 CORS 모듈 부착.
5. **Backend Framework로 Fastify 채택 및 TS Strict 모드 적용** (2026-06-27): 런타임 오류 방지와 any 타입 금지를 강제화함.

---

## 6. Pending Review (최우선 검토 목적)
* **None** (Sprint 3-2 승인 완료됨)

---

## 7. Next Action
* **ChatGPT (PM)**:
  1. 다음 마일스톤인 **[Sprint 3-3] Workspace API 및 Supabase DB 연동 개발을 위한 세부 작업 지시서**를 작성해 주십시오.

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
* **완료 Sprint**: Sprint 3-2 (Authentication)
* **다음 Sprint**: Sprint 3-3 (Workspace API & DB 연동)
