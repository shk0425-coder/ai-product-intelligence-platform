# AI_START.md (AI Project Entry Point v2.3)

이 문서는 **AI Product Intelligence Platform** 프로젝트에 참여하는 모든 AI 에이전트가 작업을 개시할 때 **가장 먼저 읽고 작동 지침을 확인하는 시작점**입니다.

---

## 1. 프로젝트 목표
* **최종 목표**: 고객의 문제(JTBD)를 발견하고, 시장성을 검증하며, 판매 가능한 상품 전략 및 시각 자료 기획안을 생성하고, 실제 판매 데이터를 피드백 받아 스스로 개선하는 **AI Product Intelligence Platform** 구축.

---

## 2. 문서 인덱스 및 읽는 순서
새로운 세션이 시작되거나 새로운 AI가 투입될 때, 반드시 아래 정의된 순서대로 문서를 순차적으로 완독해야 합니다.

1. 📌 **[CONTEXT.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/CONTEXT.md)**: ChatGPT PM의 초고속 맥락 동기화를 위한 **프로젝트 인계 문서 (Project Handover Document)**.
2. **[PROJECT.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/PROJECT.md)**: 프로젝트 전체 현황 및 누적 히스토리.
3. **[SESSION.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/SESSION.md)**: 현재 개발 세션의 진행 상황 및 금일 완료 사항.
4. **[TODO.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/TODO.md)**: 실시간 우선순위 태스크 리스트 및 진척도 체크보드.
5. **[DECISIONS.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/DECISIONS.md)**: 주요 기술적/아키텍처 의사결정 이력(ADR Ledger).
6. **[ARCHITECTURE.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/ARCHITECTURE.md)**: 시스템 폴더 구조 및 컴포넌트 간 연계 규격서.
7. **[CHANGELOG.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/CHANGELOG.md)**: 릴리즈 및 개발 변경 사항 이력 관리.

---

## 3. 고정 개발자 역할 (Role)
* **대표님 (User)** ➡️ **Product Owner (PO)**: 최종 의사결정, 가치 평가 기준 승인.
* **ChatGPT** ➡️ **PM + AI Framework Designer**: 비즈니스 로직 구상, 프롬프트 설계, 작업 지시 및 코드 리뷰.
* **Antigravity IDE (Gemini - 본인)** ➡️ **Chief System Architect & Lead Software Engineer**: 시스템 설계, DB/API 설계, 크롤러 및 백엔드 구현 실행, 개발 상태 문서 업데이트.

---

## 4. CONTEXT.md 운영 및 관리 규칙 (v2.3 최종 안착 규격)
`CONTEXT.md`는 개발용 설명서나 프로젝트 종료 보고서가 아닙니다. **새로운 대화 세션에서 ChatGPT PM이 프로젝트 상태를 즉각 동기화하고 개발의 연속성을 유지하기 위한 전용 인계 문서(Project Handover Document)**입니다.

* **POS 문서는 빈번하게 변경하지 않는다.**
* **운영 규칙은 실제 프로젝트 진행 중 반복적으로 필요한 경우에만 수정한다.**

### 4-1. 업데이트 타이밍
다음 작업이 완료될 때마다 즉시 `CONTEXT.md`를 업데이트하여 반영합니다.
* Sprint 완료 시
* 주요 의사결정(Decision) 발생 시
* Architecture Review 완료 시
* 작업지시 변경 시
* 프로젝트 단계(Phase) 변경 시

### 4-2. 필드별 유지 및 관리 규칙
항상 다음 11대 항목을 최신 상태로 유지하며, 규칙에 따라 작성합니다.

1. **Project Summary**: 플랫폼명, 목적, 현재 버전, 단계, Sprint 상태 명시.
2. **Current Goal**: 항상 **실제 프로젝트의 시스템 개발 작업**만 기록합니다.
   * **기록 배제 대상**: 문서 수정, 운영체계 개선, 일회성 관리 태스크 등
   * **필수 포함 요소**: Current Sprint, Current Task, Progress (선택), Definition of Done (DoD)
3. **Current Progress**: 완료된 핵심 마일스톤 위주로 간결하게 보존.
4. **Session Memory**: 현재 세션 진행 중 발생한 아이디어/관찰을 기록하는 임시 공간입니다.
   * 세션 종료 시 반드시 분석 검토하여, 중요도가 높은 내용만 `Recent Decisions`로 승격 이동합니다.
   * 승격되지 않은 나머지 내용은 모두 삭제하며, **세션 종료 시 비어있는 상태(Empty)를 유지하는 것을 원칙**으로 합니다.
5. **Recent Decisions**: 프로젝트 최근 핵심 결정 기록입니다. (최신순 정렬, **최대 5개만 유지**, 현재 개발에 직접적 영향을 주는 사항만 보존하며 초과분은 삭제).
6. **Pending Review**: 파일 링크가 아닌 **검토 목적**을 구체적으로 기록합니다. (예: `pgvector 전략 검토`, `Agent Workflow 검토`). 검토 완료 시 즉시 목록에서 제외합니다.
7. **Next Action**: 다음에 ChatGPT가 수행해야 할 관리/리뷰 작업을 명시합니다.
8. **Current Blockers**: 해결되지 않은 장애물 기술 (없으면 "없음"으로 강제 표기).
9. **Important Notes**: ChatGPT PM 전용 문서로서의 운영 규칙 고수.
10. **Conversation Resume (대화 재개 절차)**: 다음 순서를 엄격히 준수하여 문서화합니다.
    0. `Project Summary` 확인
    1. `Current Goal` 확인
    2. `Recent Decisions` 확인
    3. `Pending Review` 수행
    4. `Next Action` 작성
    5. Antigravity 작업지시 생성
    6. `CONTEXT.md` 업데이트
11. **Last Update**: 날짜, 완료 Sprint, 다음 Sprint 메타 적재.

---

## 5. GitHub Repository 운영 규칙 (v1.0 도입)
GitHub Repository는 프로젝트의 공식 기준(Single Source of Truth, SSOT)입니다. 로컬 파일과 GitHub 내용은 항상 동기화되어야 하며, 브랜치 및 커밋 규칙을 엄격히 준수합니다.

### 5-1. Branch 정책
* **main**: 안정 배포 버전 브랜치.
* **develop**: 신규 개발 및 스프린트 진행 브랜치.
* 새로운 스프린트/작업은 항상 `develop` 브랜치에서 진행하며, ChatGPT PM의 최종 리뷰 및 승인 후에만 `main`으로 Merge합니다.

### 5-2. 작업 완료 후 필수 절차
각 Sprint 또는 기능 개발 작업이 완료되면 다음 절차를 차례대로 완수해야 합니다.
1. **코드 정리 및 검증**: 작성한 소스코드 정리 및 문법/호환성 검사.
2. **Git Commit**: Commit 규칙에 맞춰 커밋 작성.
3. **Git Push**: 원격 GitHub Repository에 Push.
4. **프로젝트 문서 업데이트**: `CONTEXT.md`, `SESSION.md`, `TODO.md` 등 POS 문서 최신화.
5. **Pull Request 생성**: 아래 명세에 맞춰 PR을 생성하고, ChatGPT PM에게 코드 리뷰 요청.
6. **ChatGPT PM 승인 획득**: 승인이 완료되기 전에는 `main`으로 Merge 및 다음 Sprint를 시작하지 않습니다.

### 5-3. Commit 메시지 규칙
Commit Message는 반드시 아래 접두어 및 형식을 따릅니다.
* `feat(core): Sprint 2-1 Core Domain DDL`
* `feat(market): Sprint 2-2 Market Domain DDL`
* `feat(review): Sprint 2-3 Review Domain DDL`
* `feat(ai): Sprint 2-4 AI Domain DDL`
* `fix(database): FK constraint correction`
* `docs(context): update project context`

### 5-4. Pull Request (PR) 명세서 필수 포함 항목
각 스프린트 종료 후 Pull Request 생성 시, 본문에는 반드시 아래 내용을 포함해야 합니다.
* **변경 내용**: 이번 작업으로 추가/수정된 핵심 비즈니스 로직 및 기능.
* **생성된 파일**: 추가된 소스코드 및 DDL, 마이그레이션 파일 목록.
* **Architecture 영향 여부**: 시스템 구조나 기존 컴포넌트 간 연계 규격에 미치는 영향.
* **Migration 영향 여부**: 기존 데이터베이스 스키마 마이그레이션 필요 여부 및 영향도.
* **테스트 결과**: Supabase 구문 검증, 로컬 테스트 또는 쿼리 검사 결과.

---

## 6. AI 작업 시작 절차
1. 본 문서(`AI_START.md`) 실행.
2. 지시에 따라 **[CONTEXT.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/CONTEXT.md)**를 가장 먼저 읽고 프로젝트 상태를 파악합니다.
3. 현재 세션의 프로젝트 상태를 요약 브리핑합니다.
4. `CONTEXT.md`의 `Current Goal`을 수행합니다.

---

## 7. AI 작업 종료 절차
작업이 정상 완료되었거나 세션을 종료(Handover)할 시, 반드시 아래 절차 및 문서를 업데이트한 후 세션을 마쳐야 합니다.

* **1단계: 소스코드 정리 및 Git Commit & Push**
  * `AI_START.md` 5-3 커밋 규칙에 맞춰 Git Commit을 실행합니다.
  * 원격 저장소(`develop` 브랜치)로 Git Push 및 Pull Request 가이드라인을 작성합니다.
* **2단계: 프로젝트 문서 업데이트**
  * **[CONTEXT.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/CONTEXT.md)** (가장 최신 상태로 동기화 및 Session Memory 정리, 승인 대기 목록 갱신)
  * **[PROJECT.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/PROJECT.md)** (누적 현황 업데이트)
  * **[SESSION.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/SESSION.md)** (오늘 한 일 및 이어할 다음 포인트 명시)
  * **[TODO.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/TODO.md)** (완료 항목 `[x]` 처리 및 진행 중 `[/]` 마킹)
  * **[CHANGELOG.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/CHANGELOG.md)** (기술적 변경점 기록)
