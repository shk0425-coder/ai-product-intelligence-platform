# CONTEXT.md (Project Handover Document for ChatGPT PM)

이 문서는 **ChatGPT (프로젝트 매니저/PM)**가 새로운 대화 세션을 시작할 때, 이전 개발 흐름과 프로젝트 상태를 즉시 동기화하고 연계 작업을 이어가기 위한 **프로젝트 인계 문서**입니다.

---

## 1. Project Summary
* **프로젝트명**: AI Product Intelligence Platform
* **프로젝트 목적**: 고객 결핍(JTBD) 기반 시장성 평가, S~D 등급 분류, 상품 기획 및 크리에이티브 시안 도출과 판매 피드백 학습을 자동화하는 AI 플랫폼 구축.
* **현재 버전**: v0.6.0
* **현재 단계**: Phase 3 - Scaffolding Backend & Scraper
* **현재 Sprint**: Sprint 3-6 - Review Intelligence Pipeline & First Provider Integration 완료 (PM 검토 대기)

---

## 2. Current Goal
* **현재 Sprint**: Sprint 3-6 (Review Intelligence Pipeline & First Provider Integration)
* **현재 작업 (Task)**: Sprint 3-6 완료 검토 대기
* **완료 조건 (Definition of Done)**:
  1. Keyword ➡️ Review Provider ➡️ Review Mapper ➡️ Review Repository ➡️ customer_reviews 흐름 완비.
  2. 실제 Naver Shopping Smartstore API 연동 프로바이더 개발 및 AbortController 기반 10초 타임아웃, 3회 재시도, 1s/2s/4s Exponential Backoff 장애 처리 장착.
  3. DTO 표준 구조 설계 및 Mapper를 통한 Null 필드 기본값 가공. 중복 삽입 감지를 위해 `provider`, `productId`, `reviewId` 조합의 deterministic UUID 생성기 장착.
  4. Repository 내 `ON CONFLICT (review_id, collected_at) DO NOTHING` 기반 `upsert` 실행으로 중복은 `duplicateCount`로 분류하고 그 외 DB 오류는 `failedCount`로 정확히 분류 반환.
  5. DB DDL 스키마 및 마이그레이션 변경 없이, NOT NULL 외래키 제약조건(`run_id`) 충족을 위해 DB 내 기존 `run_id` 동적 바인딩 및 fallback UUID 장치 구현.
  6. API endpoint `POST /api/v1/reviews/crawl` 개발, JWT 인증 및 Zod 유효성 검증 적용.
  7. Vitest를 활용하여 Provider, Mapper, Repository, API 모의/통합 테스트 총 57개 성공 완수.
  8. `REVIEW.md`, `CONTEXT.md`, `DECISIONS.md` 갱신 및 Git Commit & Push 완료.

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
* [x] **Sprint 3-6: Review Intelligence Pipeline & First Provider Integration 완료** (Smartstore 실연동, Mapper, Repo, Crawl API, Timeout/Retry 회복성 연동 및 DB Freeze 유지 완료)

---

## 4. Session Memory (임시 세션 메모리)
*Empty*

---

## 5. Recent Decisions (최근 핵심 의사결정 - 최대 5개)
1. **Database Freeze 원칙 준수** (2026-06-27): 스키마 변경, 신규 컬럼 추가 및 마이그레이션 생성을 완전히 지양하고, 기존 `customer_reviews` 테이블의 NOT NULL 외래키 제약조건(`run_id`) 충족을 위해 DB 내 기존 `run_id` 동적 바인딩 및 fallback UUID 장치를 통해 데이터 삽입을 처리함.
2. **Exponential Backoff Retry 및 AbortController Timeout 적용** (2026-06-27): HTTP 429/403/Timeout 에러 발생 시 최대 3회 재시도를 지원하며 Exponential Backoff (1초 -> 2초 -> 4초) 및 요청당 최대 10초 타임아웃 제한을 Naver Shopping Provider에 적용하여 회복성을 강화함.
3. **Deterministic UUID 생성기를 통한 Duplicate 감지** (2026-06-27): 중복 리뷰가 데이터베이스의 composite primary key `(review_id, collected_at)` 상에서 동일 UUID 충돌을 일으키도록 `provider`, `productId`, `reviewId` 조합의 SHA-256 해싱 deterministic UUID 생성기를 Mapper에 설계함.
4. **의존성 추가 배제 목적의 Node.js 내장 fetch 및 AbortController 활용** (2026-06-27): `axios` 설치를 피해 패키지 종속성을 최소화하고자 Node.js v18+ 글로벌 내장 fetch 및 AbortController API를 도입함.
5. **Crawl API 역할 한정** (2026-06-27): AI 분석 및 감성 분석을 제외하고 순수 수집/매핑/DB 적재 및 결과 카운트 반환 단계로만 역할을 한정하여 파이프라인의 결합도를 낮춤.

---

## 6. Pending Review (최우선 검토 목적)
* **Sprint 3-6 Review Pipeline & Naver Smartstore API 실연동 구현체 검토 및 승인 요청**:
  * 대상 폴더/파일: `backend/src/modules/review/`, `backend/src/modules/scraper/providers/naver-review.provider.ts`, `backend/tests/review-pipeline.test.ts`
  * 검토 요점: 내장 fetch 기반 Naver Smartstore JSON 수집 및 Retry/Timeout 동작성, Mapper Null 기본값 처리, Repo Bulk Insert 및 Skip 카운트 테스트 정합성.

---

## 7. Next Action
* **ChatGPT (PM)**:
  1. 다음 마일스톤인 **[Sprint 3-7] AI Review Analyzer & JTBD 분석 작업 지시서**를 작성해 주십시오.

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
* **완료 Sprint**: Sprint 3-6 (Review Intelligence Pipeline & First Provider Integration)
* **다음 Sprint**: Sprint 3-7 (AI Review Analyzer)
