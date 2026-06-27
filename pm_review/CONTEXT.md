# CONTEXT.md (Project Handover Document for ChatGPT PM)

이 문서는 **ChatGPT (프로젝트 매니저/PM)**가 새로운 대화 세션을 시작할 때, 이전 개발 흐름과 프로젝트 상태를 즉시 동기화하고 연계 작업을 이어가기 위한 **프로젝트 인계 문서**입니다.

---

## 1. Project Summary
* **프로젝트명**: AI Product Intelligence Platform
* **프로젝트 목적**: 고객 결핍(JTBD) 기반 시장성 평가, S~D 등급 분류, 상품 기획 및 크리에이티브 시안 도출과 판매 피드백 학습을 자동화하는 AI 플랫폼 구축.
* **현재 버전**: v0.6.0
* **현재 단계**: Phase 3 - Scaffolding Backend & Scraper
* **현재 Sprint**: Sprint 3-4 - Sprint 3-3 개선사항 반영 및 Market Domain 기반 구축 완료 (PM 검토 대기)

---

## 2. Current Goal
* **현재 Sprint**: Sprint 3-4 (Sprint 3-3 개선사항 반영 및 Market Domain 기반 구축)
* **현재 작업 (Task)**: Sprint 3-4 완료 검토 대기
* **완료 조건 (Definition of Done)**:
  1. `BaseRepository` 내 `update()` 및 `delete()` 연산 시 `.is('deleted_at', null)`을 바인딩하여 소프트 딜리트 정책 완수.
  2. Zod validation을 활용하여 페이지네이션 상한선(page: 100,000 / limit: 100) 및 정렬 가능 컬럼의 화이트리스트 검사 적용.
  3. Workspace 생성 실패 예외 처리 시 사전 UX 체크와 더불어 DB Unique Constraint (`23505`) 캐치 후 `WorkspaceAlreadyExistsError` 예외 변환 보완 완료.
  4. Market Domain 모듈(`src/modules/market/`) 구조를 Workspace 모듈과 일관되게 신설.
  5. `GET /api/v1/markets` 및 `GET /api/v1/markets/:id` Read 전용 API 구현 완료.
  6. Market metric 레포지토리에 nested inner join (metrics ➡️ runs ➡️ products ➡️ workspaces ➡️ org_id)을 적용하여 소유주 타겟 페이징 및 단건 조회 구현 완료.
  7. DTO 맵핑 처리 및 Zod UUID/Query parameter 타입 검사 연동.
  8. Vitest 8개 신규 테스트를 포함한 총 34개 테스트 전체 성공 확인.
  9. `REVIEW.md`, `CONTEXT.md`, `DECISIONS.md` 갱신 및 Git Commit & Push 완료.

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
* [x] **Sprint 3-1: Backend Scaffold 및 Infrastructure 구축 완료** [APPROVED]
* [x] **Sprint 3-2: Authentication Module 구축 완료** [APPROVED]
* [x] **Sprint 3-3: Workspace API & Database 연동 개발 완료** [APPROVED]
* [x] **Sprint 3-4: Sprint 3-3 개선사항 반영 및 Market Domain 기반 구축 완료** (BaseRepository soft delete 차단 강화, Zod whitelist 정렬 한계 제한 적용, DB Unique constraint 매핑, Market Read API 구축 완료)

---

## 4. Session Memory (임시 세션 메모리)
*Empty*

---

## 5. Recent Decisions (최근 핵심 의사결정 - 최대 5개)
1. **BaseRepository.update/delete 소프트 딜리트 필터링 강화** (2026-06-27): 삭제 대상이 업데이트되거나 재삭제되지 않도록 `.is('deleted_at', null)`을 SQL 조건절에 기본 부착함.
2. **Zod를 활용한 API 보호** (2026-06-27): 비정상적인 페이징 호출을 Zod 스키마 검증단에서 차단하며, 정렬 컬럼 화이트리스트(`z.enum`)를 선언하여 SQL Injection 우려를 사전에 밀봉함.
3. **DB Exception Mapping 신뢰** (2026-06-27): 워크스페이스 명칭의 중복 최종 감지는 DB Unique Constraint 에러 코드(`23505`) 파싱에 의존하도록 구조 수정.
4. **마켓 메트릭 다단계 릴레이션 소유주 필터링** (2026-06-27): metrics ➡️ runs ➡️ products ➡️ workspaces ➡️ org_id로 이어지는 조인 맵핑을 구현하여 타인의 데이터에 임의 접근하는 현상을 차단함.
5. **마켓 테이블 soft delete용 DDL 추가** (2026-06-27): DDL 직접 수정 금지령에 맞추어 `29_add_market_deleted_at.sql`을 추가 적용함.

---

## 6. Pending Review (최우선 검토 목적)
* **Sprint 3-4 리뷰 보완사항 및 Market Domain 기반 구축 검토 및 승인 요청**:
  * 대상 폴더/파일: `backend/src/repositories/`, `backend/src/modules/market/`, `backend/src/modules/workspace/`, `backend/tests/market.test.ts`
  * 검토 요점: BaseRepository의 Soft Delete 조건절 강제, Zod 정렬/페이징 검사 한계, DB 23505 에러 파싱, Market 도메인 inner join 조회 소유권 검증의 구현 신뢰성.

---

## 7. Next Action
* **ChatGPT (PM)**:
  1. 다음 마일스톤인 **[Sprint 3-5] Market Create/Update/Delete 및 Scraper 연동 인프라 구축 세부 작업 지시서**를 작성해 주십시오.

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
* **완료 Sprint**: Sprint 3-4 (Reviews Refinement & Market Domain Foundation)
* **다음 Sprint**: Sprint 3-5 (Market Mutation & Scraper Setup)
