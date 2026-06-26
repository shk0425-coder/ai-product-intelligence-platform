# CONTEXT.md (Project Handover Document for ChatGPT PM)

이 문서는 **ChatGPT (프로젝트 매니저/PM)**가 새로운 대화 세션을 시작할 때, 이전 개발 흐름과 프로젝트 상태를 즉시 동기화하고 연계 작업을 이어가기 위한 **프로젝트 인계 문서**입니다.

---

## 1. Project Summary
* **프로젝트명**: AI Product Intelligence Platform
* **프로젝트 목적**: 고객 결핍(JTBD) 기반 시장성 평가, S~D 등급 분류, 상품 기획 및 크리에이티브 시안 도출과 판매 피드백 학습을 자동화하는 AI 플랫폼 구축.
* **현재 버전**: v0.4.1
* **현재 단계**: Phase 2 - Database Schema & Migration DDL
* **현재 Sprint**: Sprint 2 - Supabase DDL 및 데이터베이스 구조체 셋업

---

## 2. Current Goal
* **현재 Sprint**: Sprint 2 (Supabase DDL 및 데이터베이스 구조체 셋업)
* **현재 작업 (Task)**: Sprint Review 자동화 프로세스 반영 및 Sprint 2-1, 2-2 통합 REVIEW.md 작성/코드 리뷰 대기
* **완료 조건 (Definition of Done)**:
  1. `database/migrations/` 폴더 내의 11대 마이그레이션 SQL 스크립트 작성 및 로컬 검증 완료.
  2. GitHub Repository 운영 규칙(Branch 정책, 커밋 메시지 규칙 등) 수립 및 `AI_START.md` 반영 완료.
  3. Sprint 종료 절차(8단계 프로세스) 및 `REVIEW.md` 생성 규칙 정의 및 `AI_START.md` 반영 완료.
  4. Sprint 2-1 및 2-2 통합 리뷰를 위한 `REVIEW.md` 파일 생성 완료.
  5. 로컬 Git 저장소 초기화(`git init`) 및 브랜치(`develop`) 분할 커밋 생성 완료.
  6. ChatGPT PM의 `REVIEW.md` 기준 최종 승인 획득.

---

## 3. Current Progress
* [x] **Product Intelligence Framework v3.0 최종 사양 확정** (JTBD 상황 모델링, S~D 등급제)
* [x] **AI Agent Architecture v1.1 설계 수립** (Task Planner 및 비동기 Orchestrator)
* [x] **Database Architecture v1.1 Final 설계 확정 및 동결(Freeze)** 완료
* [x] **Core Domain Database DDL 구현 완료** (`01_extensions.sql` ~ `07_triggers.sql`)
* [x] **Market Domain Database DDL 구현 완료** (`08_market_tables.sql` ~ `11_market_triggers.sql`)
* [x] **POS v2.3 운영 규격 안착** (CONTEXT.md 비움 규칙 및 대화 재개 프로세스 통합 완료)
* [x] **GitHub Repository 운영 규칙 수립 및 로컬 Git 초기화 완료** (main/develop 브랜치 및 커밋 규칙 수립)
* [x] **Sprint Review 자동화 프로세스 정립 및 REVIEW.md 규격 도입** (AI_START.md 최신화)

---

## 4. Session Memory (임시 세션 메모리)
*(현재 세션 종료 규칙에 따라 중요 의사결정은 Recent Decisions로 검토/이동되었으며, 메모 영역은 비워진 상태입니다.)*

---

## 5. Recent Decisions (최근 핵심 의사결정 - 최대 5개)
1. **Sprint Review 자동화 및 REVIEW.md 규격 수립** (2026-06-26): ChatGPT PM의 효율적인 코드 리뷰를 지원하기 위해 Sprint 종료 시 마다 에이전트가 자체 검증(Self Review)을 포함한 `REVIEW.md` 문서를 자동 생성하여 제출하도록 표준 절차를 정립함.
2. **GitHub Repository 운영 원칙 및 자율 Commit/Push 지침 수립** (2026-06-26): 프로젝트 소스코드 일관성을 위해 GitHub를 Single Source of Truth(SSOT)로 지정하고, 개발 에이전트(Antigravity)는 각 Sprint 완료 시 별도 사용자 지시 없이 자율적으로 적절한 커밋 메시지 작성 후 로컬 커밋 및 원격(develop 브랜치) Push를 즉시 수행하도록 규칙을 수립함.
3. **Market Domain DDL 구현 완료** (2026-06-26): 외부 데이터 수집 저장소 성격인 Market Domain(2개 테이블)의 DDL 구현을 완료하여 원시 분석 데이터 적재 인프라를 수립함.
4. **Core Domain DDL 우선 구현** (2026-06-26): 데이터베이스 셋업 단계에서 Core Domain(7개 테이블)만 1차 DDL로 구현하여 의존성 순환 오류를 차단하고, 기타 세부 도메인은 2차 구현으로 격리함.
5. **Database Architecture v1.1 Final 동결** (2026-06-26): SaaS 다중 테넌시 구조 및 Product 중심의 코어 도메인 계층 구조를 수립하고 데이터베이스 아키텍처를 최종 확정(Freeze)함.

---

## 6. Pending Review (최우선 검토 목적)
* **Sprint 2-1 및 Sprint 2-2 DDL 스크립트 코드 리뷰**: 루트 경로에 생성된 `REVIEW.md`를 바탕으로 01~11번 DDL 마이그레이션 스크립트의 Supabase PostgreSQL 16 적합성, 제약조건 설계 검증.
* **Sprint Review 자동화 표준 가이드라인**: `AI_START.md`에 추가된 신규 8단계 프로세스 및 `REVIEW.md` 템플릿 적정성 검토.

---

## 7. Next Action
* **ChatGPT (PM)**: 
  1. 루트 경로에 마련된 `REVIEW.md` 문서를 단일 기준으로 사용하여 Sprint 2-1 및 2-2 DDL 변경 사항에 대한 통합 코드 리뷰 및 승인을 진행해 주십시오.
  2. 리뷰 완료 후, 다음 마일스톤인 **[Sprint 2-3] Customer/JTBD Domain DDL 구현을 위한 세부 작업 지시서**를 작성해 주십시오.

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
* **업데이트 날짜**: 2026-06-26
* **완료 Sprint**: Sprint 1 (시스템 설계 및 운영 문서 셋업 완료)
* **다음 Sprint**: Sprint 2 (Supabase DDL 및 데이터베이스 구조체 셋업)
