# CONTEXT.md (Project Handover Document for ChatGPT PM)

이 문서는 **ChatGPT (프로젝트 매니저/PM)**가 새로운 대화 세션을 시작할 때, 이전 개발 흐름과 프로젝트 상태를 즉시 동기화하고 연계 작업을 이어가기 위한 **프로젝트 인계 문서**입니다.

---

## 1. Project Summary
* **프로젝트명**: AI Product Intelligence Platform
* **프로젝트 목적**: 고객 결핍(JTBD) 기반 시장성 평가, S~D 등급 분류, 상품 기획 및 크리에이티브 시안 도출과 판매 피드백 학습을 자동화하는 AI 플랫폼 구축.
* **현재 버전**: v0.6.0
* **현재 단계**: Phase 3 - Scaffolding Backend & Scraper
* **현재 Sprint**: Sprint 3-5 - Market Mutations & Scraper Infrastructure Setup 완료 (PM 검토 대기)

---

## 2. Current Goal
* **현재 Sprint**: Sprint 3-5 (Market Mutations & Scraper Infrastructure Setup)
* **현재 작업 (Task)**: Sprint 3-5 완료 검토 대기
* **완료 조건 (Definition of Done)**:
  1. `POST /api/v1/markets`, `PATCH /api/v1/markets/:id`, `DELETE /api/v1/markets/:id` API를 완성하고 테넌트 소유권 교차 검증 연동 완료.
  2. 마켓 메트릭 생성 시 전달받은 `runId`가 현재 사용자의 소유인지 `verifyRunOwner(runId, userId)`를 리포지토리 수준에 신설하여 서비스 레이어에서 교차 대조 검증.
  3. UNIQUE Constraint로 인한 `runId` 중복 메트릭 생성 요청 시 `MarketMetricAlreadyExistsError` (409 Conflict) 매핑 완료.
  4. 다중 크롤링 채널(Naver, Coupang, 1688 등) 확장이 자연스러운 `IScraperProvider` 및 `BaseScraperProvider` 플러그인형 아키텍처 설계 및 stubs 모듈 완비.
  5. 키워드 해시 변환 연산을 통해 100% 동일 재현 데이터를 반환하는 **Deterministic Mock Scraper Provider** 구현 완료.
  6. DTO 명칭을 명확한 도메인 단위인 `CreateMarketMetricDto` 및 `UpdateMarketMetricDto`로 개정 적용.
  7. 인증 부재, 만료 토큰, 타인 권한 침범, 잘못된 Run ID, 중복 생성 Conflict, 소프트 딜리트 재수정/재삭제 차단 및 스크래퍼 결정론성 검증을 포함한 12개 통합 테스트 성공 완수.
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
* [x] **Sprint 3-4: Sprint 3-3 개선사항 반영 및 Market Domain 기반 구축 완료** [APPROVED]
* [x] **Sprint 3-5: Market Mutations & Scraper Infrastructure Setup 완료** (CRUD Mutations, Provider-based Scraper 아키텍처 설계, Deterministic stubs, 소유권 교차 검증 보강 완료)

---

## 4. Session Memory (임시 세션 메모리)
*Empty*

---

## 5. Recent Decisions (최근 핵심 의사결정 - 최대 5개)
1. **다중 외부 크롤러 확장을 고려한 Provider-based Scraper 아키텍처 도입** (2026-06-27): 백엔드 비즈니스 로직과 특정 크롤러 엔진 간의 결합도를 낮추기 위해 `IScraperProvider` 플러그인 구조를 정립함.
2. **Deterministic Mock Scraper Stub 구현** (2026-06-27): 테스트 자동화 시 재현성을 보장하고 무작위 난수로 인한 테스트 Flaikness를 원천 방지하기 위해 키워드 문자열 해싱 기반의 결정론적 스텁을 구현함.
3. **Run ID 소유주 위장 가입 검증 추가** (2026-06-27): 시장 지표 등록 시 사용되는 `runId`가 해당 로그인 유저 소유의 워크스페이스에 매핑된 상품의 분석 건인지 리포지토리 레이어 조인을 통해 검증함.
4. **도메인 성격을 명확히 한 DTO 네이밍 개정** (2026-06-27): 범용적인 Market 의미보다 상세 데이터 성격을 띠는 `CreateMarketMetricDto`, `UpdateMarketMetricDto`로 개정 적용.
5. **Soft Delete 및 중복 생성의 완벽한 예외 매핑** (2026-06-27): 소프트 딜리트 처리 완료 건에 대한 수정/재삭제 시도를 findByIdWithOwner(deleted_at IS NULL) 단에서 404 차단하고, 중복 runId 등록 시 409 Conflict 매핑 완료.

---

## 6. Pending Review (최우선 검토 목적)
* **Sprint 3-5 Market Mutations & Scraper Infrastructure Setup 구현체 검토 및 승인 요청**:
  * 대상 폴더/파일: `backend/src/modules/market/`, `backend/src/modules/scraper/`, `backend/tests/market-mutation.test.ts`
  * 검토 요점: Multi-provider scraper 설계 규격, 해싱 기반 Deterministic stubs, API 권한/중복/만료 검사의 테스트 보강 신뢰성.

---

## 7. Next Action
* **ChatGPT (PM)**:
  1. 다음 마일스톤인 **[Sprint 3-6] Naver Shopping Crawler 실연동 및 DB 저장 연동 작업 지시서**를 작성해 주십시오.

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
* **완료 Sprint**: Sprint 3-5 (Market Mutations & Scraper Infrastructure Setup)
* **다음 Sprint**: Sprint 3-6 (Naver Shopping Crawler Integration)
