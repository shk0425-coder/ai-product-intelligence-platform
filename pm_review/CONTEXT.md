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
* **현재 버전**: v0.9.0
* **현재 단계**: Phase 4 - Evaluator & Generator Core Integration
* **현재 Sprint**: Sprint 4-3 - Product Strategy Generator (8-Step Storyboard Builder) 구현 완료 (PM 검토 대기)

---

## 2. Current Goal
* **현재 Sprint**: Sprint 4-3 (Product Strategy Generator 구현)
* **현재 작업 (Task)**: Sprint 4-3 완료 검토 대기
* **완료 조건 (Definition of Done)**:
  1. 8단계 상세페이지 스토리보드(Attention~CTA) 순서, 중복, 타입/이름 매칭 custom validator 탑재.
  2. Zod Schema strict() 및 zod-to-json-schema 를 이용해 JSON Schema 와 validator 단일 싱크 기법 적용 완료.
  3. parser, validator, prompt, service 컴포넌트 분리 완료.
  4. Vitest 유닛 테스트 작성 및 **100% 테스트 커버리지** 통과.
  5. POS 문서 최신화 및 Git Push 자율 완수.

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
* [x] **Sprint 3-8: AI Review Analysis Persistence Pipeline & Storage 완료** [APPROVED]
* [x] **Sprint 4-1: 결정론적 룰 엔진 등급 계산기 구현 완료** [APPROVED]
* [x] **Sprint 4-2: JTBD 정보 모델 추출 프롬프트 엔진 구현 완료** [APPROVED]
* [x] **Sprint 4-3: Product Strategy Generator (8-Step Storyboard Builder) 구현 완료** (schema/prompt/parser/validator/service/index 구현, 100% 커버리지 유닛 테스트 통과 완료)

---

## 4. Session Memory (임시 세션 메모리)
*Empty*

---

## 5. Recent Decisions (최근 핵심 의사결정 - 최대 5개)
1. **8단계 스토리보드 정합성 2차 유효성 검증(Custom Validation)** (2026-06-27): Zod 의 기본 타입 파싱에 더해 step 1~8 순차 배치, 중복, 타입 및 이름 일치를 validator.ts에 구현해 LLM의 이탈 가능성을 완전 차단함.
2. **zod-to-json-schema 동기화 아키텍처** (2026-06-27): Zod Schema를 `zod-to-json-schema` 로 동적 변환하여 프롬프트에 주입하고 Validator도 이를 공유해 스키마 변경 시 두 요소가 100% 자동 동기화되도록 설계함.
3. **Markdown 및 코드 블록 우회 정제** (2026-06-27): LLM의 마크다운 포맷팅 위반에 대응하여, parser단에서 trim 및 brace tracking 을 탑재해 순수 JSON만 안전하게 통과시키도록 구현함.
4. **Stateless Pure Layer 설계 및 AIProvider DI 의존성 주입** (2026-06-27): DB, Repository, Rule Engine, Retry, Fallback 등 외부 요소를 격리하고 AI 호출부를 DI 방식으로 구성해 결합도를 원천 차단함.
5. **결정론적 프롬프트 조립** (2026-06-27): 프롬프트 생성 시 Date, Random, Env의 개입을 금지하여 동일 입력 시 항상 동일한 프롬프트 문자열을 100% 결정론적으로 반환하도록 설계함.

---

## 6. Pending Review (최우선 검토 목적)
* **Sprint 4-3 Product Strategy Generator 구현체 검토 및 승인 요청**:
  - 대상 폴더/파일: `backend/src/modules/product-strategy/` (Types, Constants, Schema, Parser, Validator, Prompt, Service, Index), `backend/tests/product-strategy.test.ts`
  - 검토 요점: Zod 기반 스키마 단일 싱크의 적정성, 8단계 스토리보드(Attention~CTA) 순차 정합성 수동 검출의 정확성, parser의 마크다운 백틱 정제성, Vitest 100% 커버리지 만족 여부.

---

## 7. Next Action
* **ChatGPT (PM)**:
  1. 다음 마일스톤인 **[Sprint 4-4] Creative Pipeline (FLUX API 연동 및 이미지 프롬프트 빌더) 연동 작업 지시서**를 작성해 주십시오.

---

## 8. Current Blockers
* **없음**

---

## 9. Important Notes
* **CONTEXT.md는 ChatGPT 전용 문서**입니다. 새로운 세션 시작 시 이 파일만 로드하면 이전 흐름이 완벽히 이어집니다.
* **모든 신규 기능은 modules 기반으로 개발한다.**
* **비즈니스 로직은 services 계층에서만 구현한다.**
* **Repository는 Database 접근만 담당한다.**

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
* **완료 Sprint**: Sprint 4-3 (Product Strategy Generator)
* **다음 Sprint**: Sprint 4-4 (Creative Pipeline 연동)
