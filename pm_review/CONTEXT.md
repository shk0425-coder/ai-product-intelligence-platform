# CONTEXT.md (Project Handover Document for ChatGPT PM)

이 문서는 **ChatGPT (프로젝트 매니저/PM)**가 새로운 대화 세션을 시작할 때, 이전 개발 흐름과 프로젝트 상태를 즉시 동기화하고 연계 작업을 이어가기 위한 **프로젝트 인계 문서**입니다.

---

## 1. Project Summary
* **프로젝트명**: AI Product Intelligence Platform
* **프로젝트 목적**: 고객 결핍(JTBD) 기반 시장성 평가, S~D 등급 분류, 상품 기획 및 크리에이티브 시안 도출과 판매 피드백 학습을 자동화하는 AI 플랫폼 구축.
* **현재 버전**: v0.9.0
* **현재 단계**: Phase 4 - Evaluator & Generator Core Integration
* **현재 Sprint**: Sprint 4-1 - 결정론적 룰 엔진 등급 계산기 구현 완료 (PM 검토 대기)

---

## 2. Current Goal
* **현재 Sprint**: Sprint 4-1 (결정론적 룰 엔진 등급 계산기 구현)
* **현재 작업 (Task)**: Sprint 4-1 완료 검토 대기
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
* [x] **Sprint 3-8: AI Review Analysis Persistence Pipeline & Storage 완료** [APPROVED]
* [x] **Sprint 4-1: 결정론적 룰 엔진 등급 계산기 구현 완료** (Stateless Pure Function 설계, types/constants/validator/score/grade/reason/calculator/engine 구현, 100% 커버리지 유닛 테스트 통과 완료)

---

## 4. Session Memory (임시 세션 메모리)
*Empty*

---

## 5. Recent Decisions (최근 핵심 의사결정 - 최대 5개)
1. **Stateless Pure Function 룰 엔진 모듈 설계** (2026-06-27): DB, AI, 외부 리소스를 일절 격리하여 순수 입력과 출력만 전담하는 Stateless 계산 모듈 `rule-engine`을 신설함.
2. **비선형 지표 선형 정규화 및 스케일링** (2026-06-27): 스케일이 서로 다른 `reviewVolume` 과 `marketGrowth` raw value를 `constants.ts` 의 SCALING_RULES 로 선형 변환하여 정밀한 가중합을 계산하도록 처리함.
3. **규칙 테이블(Rule Table) 기반 등급 분기 설계** (2026-06-27): 등급 계산 시 if-else 체인을 사용하지 않고 `GRADE_RULES` 배열 데이터를 find로 탐색하는 구조를 취해 AA/AAA 등급 추가 확장성을 보장함.
4. **거리 정렬을 활용한 최소 Reason 3개 보장** (2026-06-27): 긍정/부정 임계치(80/40) 매칭 사유가 3개 미만 시, 각 지표와 임계치의 거리가 가장 가까운 것부터 보간해 최소 3개 및 최대 10개 사유를 priority 순으로 정렬 리턴하도록 구축함.
5. **딥 카피 기반 원본 불변성 보장** (2026-06-27): `engine.ts` 진입점에서 인풋 파라미터를 딥 카피한 후 계산 연산자들에 바인딩하여 룰 엔진 작동 시 외부 원본 객체 오염 가능성을 완전히 차단함.

---

## 6. Pending Review (최우선 검토 목적)
* **Sprint 4-1 Deterministic Rule Engine 구현체 검토 및 승인 요청**:
  - 대상 폴더/파일: `backend/src/modules/rule-engine/` (Types, Constants, Validator, Score, Grade, Reason, Calculator, Engine), `backend/tests/rule-engine.test.ts`
  - 검토 요점: Stateless Pure Function 만족 여부, 가중합 정밀도 및 Clamp 로직, 최소 3개/최대 10개 Reason 우선순위 정렬 보간, Vitest 100% 커버리지 충족도.

---

## 7. Next Action
* **ChatGPT (PM)**:
  1. 다음 마일스톤인 **[Sprint 4-2] JTBD 정보 모델 추출 LLM 프롬프트 설계 작업 지시서**를 작성해 주십시오.

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
* **완료 Sprint**: Sprint 4-1 (Deterministic Rule Engine 등급 계산기)
* **다음 Sprint**: Sprint 4-2 (JTBD LLM 프롬프트 설계)
