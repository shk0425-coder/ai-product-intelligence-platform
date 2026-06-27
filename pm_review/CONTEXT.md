# CONTEXT.md (Project Handover Document for ChatGPT PM)

이 문서는 **ChatGPT (프로젝트 매니저/PM)**가 새로운 대화 세션을 시작할 때, 이전 개발 흐름과 프로젝트 상태를 즉시 동기화하고 연계 작업을 이어가기 위한 **프로젝트 인계 문서**입니다.

---

## 1. Project Summary
* **프로젝트명**: AI Product Intelligence Platform
* **프로젝트 목적**: 고객 결핍(JTBD) 기반 시장성 평가, S~D 등급 분류, 상품 기획 및 크리에이티브 시안 도출과 판매 피드백 학습을 자동화하는 AI 플랫폼 구축.
* **현재 버전**: v0.9.0
* **현재 단계**: Phase 4 - Evaluator & Generator Core Integration
* **현재 Sprint**: Sprint 4-1 - 결정론적 룰 엔진 등급 계산기 구현 (준비 중)

---

## 2. Current Goal
* **현재 Sprint**: Sprint 4-1 (결정론적 룰 엔진 등급 계산기 구현)
* **현재 작업 (Task)**: Sprint 4-1 설계 수립 및 PM 작업 지시 대기
* **완료 조건 (Definition of Done)**:
  1. 결정론적 룰 엔진(Deterministic Rule Engine) 등급 컷오프(S~D) 계산기 구현.
  2. Vitest 유닛 테스트 작성 및 통과.
  3. POS 문서 최신화 및 Git Push 자율 완수.

---

## 3. Current Progress
* [x] **Product Intelligence Framework v3.0 최종 사양 확정** (JTBD 상황 모델링, S~D 등급제)
* [x] **AI Agent Architecture v1.1 설계 수립** (Task Planner 및 비동기 Orchestrator)
* [x] **Database Architecture v1.1 Final 설계 확정 및 동결** 완료
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
* [x] **Sprint 3-7: AI Review Analyzer & JTBD Intelligence 완료** [APPROVED]
* [x] **Sprint 3-8: AI Review Analysis Persistence Pipeline & Storage 완료** (영속성 레이어 분리, Identity Generator, AIAnalysisRepository, Persistence & Query Service 구축, POST analyze 캐싱 및 GET 쿼리 API 연동 완료)

---

## 4. Session Memory (임시 세션 메모리)
*Empty*

---

## 5. Recent Decisions (최근 핵심 의사결정 - 최대 5개)
1. **AI 분석 결과 영속 및 캐싱 정책 적용** (2026-06-27): 동일한 분석 요청에 대해 AI API 재호출 비용과 지연을 방지하기 위해 SHA-256 Identity 해시 기반 캐시 조회 메커니즘을 통합 구축함.
2. **Identity Generator 컴포넌트 신설** (2026-06-27): `provider`, `keyword`, `reviewCount`, `latestCollectedAt`, `promptVersion`, `model`, `temperature`, `maxOutputTokens`를 줄바꿈(`\n`)으로 결합해 SHA-256 해시를 구하는 로직을 Service 밖으로 꺼내 자율 관리함.
3. **Repository 접근 전담 및 비즈니스 격리** (2026-06-27): `AIAnalysisRepository`는 순수 Supabase CRUD 연산만 대행하며, AI 호출이나 비즈니스 검증, 프롬프트 생성 등은 일절 배제하여 아키텍처 규칙을 고수함.
4. **API Query 파라미터 및 URL Params Zod 검증 통합** (2026-06-27): `GET /analysis` 및 `GET /analysis/:id` API를 설계하고, 각각 Zod 스키마 검증(UUID 및 Keyword 형식 규격)을 preValidation 훅에 매핑함.
5. **글로벌 Fetch Stubbing을 통한 Vitest 격리 강화** (2026-06-27): 동시성 병렬 테스트 간 글로벌 fetch mocking 오염을 방지하기 위해 `vi.stubGlobal` 기법을 적용하여 완벽하게 테스트 케이스를 격리 검증함.

---

## 6. Pending Review (최우선 검토 목적)
* **None**

---

## 7. Next Action
* **ChatGPT (PM)**:
  1. **[Sprint 4-1] 결정론적 룰 엔진 등급 계산기 구현 작업 지시서**를 작성해 주십시오.

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
* **완료 Sprint**: Sprint 3-8 (AI Review Analysis Persistence Pipeline & Storage)
* **다음 Sprint**: Sprint 4-1 (Deterministic Rule Engine 등급 계산기)
