# 🔴 ChatGPT PM 최우선 작업 원칙 (Highest Priority)

아래 규칙은 CONTEXT.md의 다른 모든 내용보다 우선한다.

## 1. 작업지시서 작성 원칙

모든 작업지시서(Implementation Plan)는 내부적으로 최소 4회 이상 재검토를 수행한 후 작성한다.

재검토 항목

* 아키텍처
* 확장성
* 유지보수성
* 테스트 전략
* 다음 Sprint와의 연계성
* 리팩터링 가능성
* 중복 및 모호한 표현
* 누락 사항

검토 과정은 출력하지 않는다.

최종본만 작성한다.

---

## 2. 리뷰 응답 원칙

사용자가

* 재검토
* 검토
* 수정
* 더 수정사항 없지?
* 승인 가능?

등을 요청한 경우,

수정사항을 설명하지 않는다.

내부적으로 검토 후 필요한 내용을 모두 반영하여 **최종 수정본**만 제출한다.

변경 이유나 리뷰 과정은 사용자가 별도로 요청하지 않는 한 출력하지 않는다.

---

## 3. 최종본 원칙

사용자가 받을 문서는 항상 바로 개발 가능한 최종본이어야 한다.

미완성 초안

체크리스트

수정 제안

추천사항

설명

등은 출력하지 않는다.

---

## 4. 프로젝트 문서 원칙

Implementation Plan

REVIEW.md

CONTEXT.md

DECISIONS.md

모든 프로젝트 문서는 프로젝트 루트에서만 관리한다.

다른 폴더에 생성하거나 복사하지 않는다.

---

## 5. 품질 기준

모든 작업지시서는 리팩터링 없이 다음 Sprint까지 이어질 수준의 품질을 목표로 한다.

확장성, 재사용성, 결정론적 동작(Deterministic), 테스트 가능성을 항상 우선 고려한다.

---

# CONTEXT.md (Project Handover Document for ChatGPT PM)

이 문서는 **ChatGPT (프로젝트 매니저/PM)**가 새로운 대화 세션을 시작할 때, 이전 개발 흐름과 프로젝트 상태를 즉시 동기화하고 연계 작업을 이어가기 위한 **프로젝트 인계 문서**입니다.

---

## 1. Project Summary
* **프로젝트명**: AI Product Intelligence Platform
* **프로젝트 목적**: 고객 결핍(JTBD) 기반 시장성 평가, S~D 등급 분류, 상품 기획 및 크리에이티브 시안 도출과 판매 피드백 학습을 자동화하는 AI 플랫폼 구축.
* **현재 버전**: v0.9.5
* **현재 단계**: Phase 4 - Evaluator & Generator Core Integration
* **현재 Sprint**: Sprint 4-5 - Dashboard Backend API Integration & Streamlit Refactoring 완료 (PM 검토 대기)

---

## 2. Current Goal
* **현재 Sprint**: Sprint 4-5 (Dashboard API Integration & Refactoring)
* **현재 작업 (Task)**: Sprint 4-5 완료 검토 대기
* **완료 조건 (Definition of Done)**:
  1. API Client (Timeout, tenacity retry, HTTP 예외 매핑) 구현 완료.
  2. Workspace/Product UUID 드롭다운 연동 및 endpoints 중앙 집중화 완료.
  3. SessionStateManager 세션 상태 캡슐화 완료.
  4. Memory cache 및 CACHE_TTL 제어 완료.
  5. UI widgets 컴포넌트 캡슐화 및 순수 서브페이지(pages) 라우팅 분할 완료.
  6. Pytest 테스트 스위트 구동 및 커버리지 100% 만족 완료.
  7. Ruff 린터 0건, MyPy 타입체커 0건 통과 완료.

---

## 3. Current Progress
* [x] **Product Intelligence Framework v3.0 최종 사양 확정**
* [x] **AI Agent Architecture v1.1 설계 수립**
* [x] **Database Architecture v1.1 Final 설계 확정 및 동결** 완료
* [x] **Core Domain Database DDL 구현 완료**
* [x] **Market Domain Database DDL 구현 완료**
* [x] **GitHub Repository 운영 규칙 반영 및 Git 저장소 구성 완료**
* [x] **Sprint 2-3 ~ 2-6: 데이터베이스 마이그레이션 DDL 구축 완료** [APPROVED]
* [x] **Sprint 3-1: Backend Scaffold 및 Infrastructure 구축 완료** [APPROVED]
* [x] **Sprint 3-2: Authentication Module 구축 완료** [APPROVED]
* [x] **Sprint 3-3: Workspace API & Database 연동 개발 완료** [APPROVED]
* [x] **Sprint 3-4: Sprint 3-3 개선사항 반영 및 Market Domain 구축 완료** [APPROVED]
* [x] **Sprint 3-5: Market Mutations & Scraper Infrastructure Setup 완료** [APPROVED]
* [x] **Sprint 3-6: Review Intelligence Pipeline & First Provider Integration 완료** [APPROVED]
* [x] **Sprint 3-7: AI Review Analyzer & JTBD Intelligence 완료** [APPROVED]
* [x] **Sprint 3-8: AI Review Analysis Persistence Pipeline & Storage 완료** [APPROVED]
* [x] **Sprint 4-1: 결정론적 룰 엔진 등급 계산기 구현 완료** [APPROVED]
* [x] **Sprint 4-2: JTBD 정보 모델 추출 프롬프트 엔진 구현 완료** [APPROVED]
* [x] **Sprint 4-3: Product Strategy Generator 구현 완료** [APPROVED]
* [x] **Sprint 4-4: Creative Pipeline 구현 완료** [APPROVED]
* [x] **Sprint 4-5: Dashboard API Integration & Refactoring 구현 완료** (API Client, Endpoints, Cache, State, Services, Components, Pages 구현 및 100% 커버리지 Pytest 통과 완료)

---

## 4. Session Memory (임시 세션 메모리)
*Empty*

---

## 5. Recent Decisions (최근 핵심 의사결정 - 최대 5개)
1. **임포트 경로 충돌 우회를 위한 패키지 상대 임포트(Relative Import) 강제**: 루트의 `dashboard.py` 파일과 `dashboard/` 패키지명의 충돌을 피하기 위해, 패키지 내부에서는 무조건 `..api` 형식의 상대 임포트를 활용하여 결합도를 완전히 제거하고 독립적으로 구동 가능하게 설계함.
2. **mypy 타입 검출을 위한 TypedDict 캐스팅(cast) 제어**: `response_mapper.py` 에서 JSON 파싱 리스트를 `List[StoryboardStep]`, `List[StoryboardScene]` 에 안전하게 대입하기 위해 `typing.cast`를 적용해 정적 검사를 완전 통과시킴.
3. **SessionStateManager 데이터 형식 Optional[Any] 완화**: TypedDict DTO를 유연하게 수용하고 컴포넌트 간 Loosely Coupled 상태를 유지하도록 SessionStateManager 프로퍼티 타입을 느슨하게 확장함.
4. **ErrorFormatter strict type check 선언**: `TimeoutError` 처럼 API 레벨에서 발생하는 예외를 `isinstance` 로 즉각 분기 판단해 NETWORK_ERROR 와 명확하게 식별하여 메시지를 사전 매핑하도록 보강함.
5. **Memory Cache 전용 조회 캡슐화**: Mutation API는 캐시 대상에서 자동 차단하고, `workspaceId:productId:analysisId` 조합 캐시 키를 활용해 단일/결결적 캐싱 제어 스택 구축.

---

## 6. Pending Review (최우선 검토 목적)
* **Sprint 4-5 Dashboard Refactoring 구현체 검토 및 승인 요청**:
  - 대상 폴더/파일: `dashboard/` (api, services, state, cache, components, pages, types, constants, utils), `tests/dashboard/test_dashboard_unit.py`, `dashboard.py` (ROOT)
  - 검토 요점: requests client 캡슐화의 견고성, tenacity retry 매핑, st.session_state 은닉 및 프로퍼티 관리, widgets를 통한 UI 코드 중복 제거의 완결성, Pytest 100% 커버리지 확인.

---

## 7. Next Action
* **ChatGPT (PM)**:
  1. 다음 마일스톤인 **[Phase 5] Closed-loop Learning & Production Setup** 에 해당하는 작업 지시서를 작성해 주십시오.

---

## 8. Current Blockers
* **없음**

---

## 9. Important Notes
* **CONTEXT.md는 ChatGPT 전용 문서**입니다. 새로운 세션 시작 시 이 파일만 로드하면 이전 흐름이 완벽히 이어집니다.
* **비즈니스 로직은 services 계층에서만 구현한다.**
* **대시보드는 Backend API Consumer 역할만 수행한다.**

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
* **완료 Sprint**: Sprint 4-5 (Dashboard API Integration & Streamlit Refactoring)
* **다음 Sprint**: Phase 5 (Closed-loop Learning & Production Setup)
