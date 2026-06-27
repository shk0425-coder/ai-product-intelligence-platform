# CONTEXT.md (Project Handover Document for ChatGPT PM)

이 문서는 **ChatGPT (프로젝트 매니저/PM)**가 새로운 대화 세션을 시작할 때, 이전 개발 흐름과 프로젝트 상태를 즉시 동기화하고 연계 작업을 이어가기 위한 **프로젝트 인계 문서**입니다.

---

## 1. Project Summary
* **프로젝트명**: AI Product Intelligence Platform
* **프로젝트 목적**: 고객 결핍(JTBD) 기반 시장성 평가, S~D 등급 분류, 상품 기획 및 크리에이티브 시안 도출과 판매 피드백 학습을 자동화하는 AI 플랫폼 구축.
* **현재 버전**: v0.6.0
* **현재 단계**: Phase 3 - Scaffolding Backend & Scraper
* **현재 Sprint**: Sprint 3-3 - Workspace API & Database 연동 개발 완료 (PM 검토 대기)

---

## 2. Current Goal
* **현재 Sprint**: Sprint 3-3 (Workspace API 및 Database 연동)
* **현재 작업 (Task)**: Workspace API 및 Database 연동 완료 검토 대기
* **완료 조건 (Definition of Done)**:
  1. Supabase Client와 연계하여 실제 Database의 `workspaces` 테이블 CRUD 연동 구현 완료.
  2. Workspace 생성, 조회, 수정, 삭제 API 구현 완료.
  3. `BaseRepository` 및 `IBaseRepository` 인터페이스/구현체를 신설하여 페이지네이션 및 기본적인 CRUD 연산 쿼리 공통화 달성.
  4. Workspace 조회, 수정, 삭제 시 호출한 유저(`request.user.userId`)와 Workspace 소유주(`org_id`) 간의 소유권(Owner) 일치 여부 철저히 검사.
  5. DTO 분리를 통해 Entity 반환을 차단하고 `WorkspaceResponseDto`만을 반환하도록 맵퍼 구성 완료.
  6. Zod 기반 UUID 포맷 검증 및 Workspace 이름 정책(Trim, 2-50자) 유효성 필터 미들웨어 바인딩 완료.
  7. 신규 마이그레이션 `28_add_workspace_deleted_at.sql`을 작성하여 소프트 딜리트용 컬럼을 구성하고, Repository 조회 시 `deleted_at IS NULL` 필터링 강제 적용.
  8. Vitest 14개 통합 검증 케이스를 포함한 총 27개 테스트 전체 통과 확인.
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
* [x] **Sprint 3-3: Workspace API & Database 연동 개발 완료** (BaseRepository 설계, 소유자 검증 보강, 소프트 딜리트 마이그레이션 탑재)

---

## 4. Session Memory (임시 세션 메모리)
*Empty*

---

## 5. Recent Decisions (최근 핵심 의사결정 - 최대 5개)
1. **마이그레이션을 통한 workspaces.deleted_at 추가** (2026-06-27): 기존 DDL 파일 수정 없이 신규 마이그레이션 `28_add_workspace_deleted_at.sql`을 추가하여 데이터베이스 수준의 소프트 딜리트 정책을 준수함.
2. **조회 API Owner 검증 추가** (2026-06-27): 멀티테넌트 최상위 리소스 특성을 반영해 수정/삭제뿐 아니라 단건 조회(`GET /:id`) 시에도 호출자 ID와 소유자(`org_id`) 일치 여부를 대조하도록 보안 강화.
3. **BaseRepository.findAll 공통 페이징 조회 구현** (2026-06-27): `findAll(options: PaginationOptions)` 공통 인터페이스/구현체를 기획하여 향후 모든 도메인 리포지토리의 표준 템플릿으로 상속 재사용하도록 설계함.
4. **TokenProvider 추상 인터페이스화 및 JwtTokenProvider 구현** (2026-06-27): jsonwebtoken 라이브러리와 서비스 결합도를 제거함.
5. **UserRole Enum 적용** (2026-06-27): JWT 페이로드에 적용하여 향후 RBAC 확장 기반 마련.

---

## 6. Pending Review (최우선 검토 목적)
* **Sprint 3-3 Workspace API & Supabase DB 연동 검토 및 승인 요청**:
  * 대상 폴더/파일: `backend/src/modules/workspace/`, `backend/src/repositories/`, `database/migrations/28_add_workspace_deleted_at.sql`, `backend/tests/workspace.test.ts`
  * 검토 요점: BaseRepository의 페이징 쿼리 및 CRUD 상속 모델, 단건조회/수정/삭제 시 소유주(`org_id` 와 `request.user.userId`) 대조 검증 논리, 소프트 딜리트 갱신 로직의 PostgREST 매핑 신뢰도.

---

## 7. Next Action
* **ChatGPT (PM)**:
  1. 다음 마일스톤인 **[Sprint 3-4] Market Domain API 구축 또는 크롤러 관련 세부 작업 지시서**를 작성해 주십시오.

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
* **완료 Sprint**: Sprint 3-3 (Workspace API & DB Integration)
* **다음 Sprint**: Sprint 3-4 (Market API / Scraping)
