# CONTEXT.md (Project Handover Document for ChatGPT PM)

이 문서는 **ChatGPT (프로젝트 매니저/PM)**가 새로운 대화 세션을 시작할 때, 이전 개발 흐름과 프로젝트 상태를 즉시 동기화하고 연계 작업을 이어가기 위한 **프로젝트 인계 문서**입니다.

---

## 1. Project Summary
* **프로젝트명**: AI Product Intelligence Platform
* **프로젝트 목적**: 고객 결핍(JTBD) 기반 시장성 평가, S~D 등급 분류, 상품 기획 및 크리에이티브 시안 도출과 판매 피드백 학습을 자동화하는 AI 플랫폼 구축.
* **현재 버전**: v0.5.2
* **현재 단계**: Phase 2 - Database Schema & Migration DDL
* **현재 Sprint**: Sprint 2 - Supabase DDL 및 데이터베이스 구조체 셋업

---

## 2. Current Goal
* **현재 Sprint**: Sprint 2 (Supabase DDL 및 데이터베이스 구조체 셋업)
* **현재 작업 (Task)**: Sprint 2-6 Audit / Learning Domain Database DDL 구현 검토 대기
* **완료 조건 (Definition of Done)**:
  1. `database/migrations/` 폴더 내의 24~27번 마이그레이션 SQL 스크립트 작성 완료.
  2. `decision_audits`, `knowledge_assets`, `learning_feedback_logs` 테이블 선언 및 세부 컬럼 한글 Comment 추가 완료.
  3. 1:1 및 1:N 관계 정의를 준수하여 PK, FK (ON DELETE CASCADE / ON DELETE SET NULL) 및 UNIQUE 제약조건 설정 완료.
  4. 지식 자산 등 자주 필터링 및 검색되는 컬럼 최적화를 위한 B-tree 인덱스 생성 완료.
  5. Sprint 2-6 요약 문서인 `REVIEW.md` 작성 및 업데이트 완료.
  6. Git 자율 규격에 따라 로컬 커밋 및 원격 GitHub `develop` 브랜치 Push 완료.
  7. ChatGPT PM의 `REVIEW.md` 기준 최종 승인 획득.

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
* [x] **Sprint 2-5: Strategy / Creative Domain Database DDL 구현 완료** (`20_strategy_tables.sql` ~ `23_strategy_triggers.sql`) [APPROVED]
* [x] **Sprint 2-6: Audit / Learning Domain Database DDL 구현 완료** (`24_audit_tables.sql` ~ `27_audit_triggers.sql`)
* [x] **CONTEXT.md 자동 갱신 규칙 및 v2.5 강화 운영 체계 수립 완료** (AI_START.md 반영)

---

## 4. Session Memory (임시 세션 메모리)
*Empty*

---

## 5. Recent Decisions (최근 핵심 의사결정 - 최대 5개)
1. **Audit/Learning Domain DDL 구현 및 CASCADE/SET NULL 정책 적용** (2026-06-27): Supabase PostgreSQL 16 환경에 맞춰 decision_audits, knowledge_assets, learning_feedback_logs 테이블을 DDL로 구현하고, 분석 이력 삭제 시에도 지식 자산의 영속성이 확보되도록 source_run_id 외래키에 ON DELETE SET NULL 정책을 적용함.
2. **Strategy/Creative Domain DDL 구현 및 storyboard GIN 인덱싱 적용** (2026-06-27): Supabase PostgreSQL 16 환경에 맞춰 product_strategies 및 creative_briefs 테이블을 DDL로 구현하였으며, 대용량 상세페이지 스토리보드 검색 최적화를 위해 GIN 인덱스를 storyboard 컬럼에 단독으로 배치함.
3. **CONTEXT.md 자동 갱신 및 자가 검증(Self Check) 규칙 제정** (2026-06-26): ChatGPT PM과의 세션 전환 시 정보 왜곡을 방지하고자 CONTEXT.md의 5대 필드에 대한 자가 검증 프로세스를 AI_START.md v2.5 규격에 도입함.
4. **리뷰-임베딩 간 1:1 무결성 제약조건 추가** (2026-06-26): 리뷰 1건당 임베딩은 단 1건만 존재하도록 보장하기 위해 `review_embeddings`에 `UNIQUE (review_id, collected_at)` 복합 유니크 제약조건을 명시적으로 추가함.
5. **Sprint Review 자동화 및 REVIEW.md 규격 수립** (2026-06-26): ChatGPT PM의 효율적인 코드 리뷰를 지원하기 위해 Sprint 종료 시 마다 에이전트가 자체 검증(Self Review)을 포함한 `REVIEW.md` 문서를 자동 생성하여 제출하도록 표준 절차를 정립함.

---

## 6. Pending Review (최우선 검토 목적)
* **Sprint 2-6 Audit/Learning Domain DDL 검토 및 승인 요청**:
  * 대상 파일: `24_audit_tables.sql` ~ `27_audit_triggers.sql`, [REVIEW.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/REVIEW.md), [CONTEXT.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/CONTEXT.md)
  * 검토 요점: `knowledge_assets` 테이블의 `SET NULL` 외래키 처리 및 `knowledge_category` 커스텀 Enum 적용 정합성, 외래키 B-tree 인덱스 튜닝.

---

## 7. Next Action
* **ChatGPT (PM)**:
  1. 다음 마일스톤인 **[Phase 3] Scaffolding Backend & Scraper 개발을 위한 세부 작업 지시서**를 작성해 주십시오.

---

## 8. Current Blockers
* **없음**

---

## 9. Important Notes
* **CONTEXT.md는 ChatGPT 전용 문서**입니다. 새로운 세션 시작 시 이 파일만 로드하면 이전 흐름이 완벽히 이어집니다.
* ChatGPT는 프로젝트 관리와 리뷰를 담당하며, 모든 세부 작업 지시는 항상 ChatGPT가 작성합니다.
* 개발 문서의 체계 및 디렉토리 맵은 `AI_START.md` 및 `ARCHITECTURE.md`를 따릅니다.

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
* **완료 Sprint**: Sprint 2-6 (Audit / Learning Domain)
* **다음 Sprint**: Phase 3 - Scaffolding Backend & Scraper (Milestone 3-1)
