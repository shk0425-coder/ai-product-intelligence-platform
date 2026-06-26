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

## 4. CONTEXT.md 운영 및 관리 규칙 (v2.5 강화 규격)
`CONTEXT.md`는 새로운 대화 세션에서 ChatGPT PM이 프로젝트 상태를 즉시 이어받기 위한 **프로젝트 단일 최신 상태 문서(Single Source of Truth, SSOT)**입니다. Sprint 완료 시마다 과거의 흔적을 남기지 않고 항상 **"현재 시점"의 실제 개발 상태만**을 기록해야 합니다.

### 4-1. 업데이트 타이밍
다음 작업이 완료될 때마다 즉시 `CONTEXT.md`를 업데이트하여 반영합니다.
* Sprint 완료 시 (승인 대기 및 승인 직후 포함)
* 주요 의사결정(Decision) 발생 시
* Architecture Review 완료 시
* 작업지시 변경 시
* 프로젝트 단계(Phase) 변경 시

### 4-2. 필드별 유지 및 관리 규칙 (현재 시점 동기화)
항상 다음 11대 항목을 최신 상태로 유지하며, 과거 Sprint 기준 정보가 잔존하는 것을 방지합니다.

1. **Project Summary**: 플랫폼명, 목적, 현재 버전, 단계, Sprint 상태 명시.
2. **Current Goal (작성 원칙)**:
   * **현재 진행 또는 대기 중인 실제 작업**만 작성합니다. (완료된 Sprint는 제외)
   * 승인이 완료되어 대기 상태가 끝난 경우, 즉시 "Review 대기" 문구를 제거하고 다음 스프린트 준비 상태(예: `Sprint 2-5 구현 준비`) 등으로 즉시 변경합니다.
3. **Current Progress**: 실제 완료된 Sprint 내역을 모두 동기화하여 현재 상태와 항상 100% 일치시킵니다.
4. **Session Memory**: 항상 비워진 상태(`Empty`)를 원칙으로 고수하며, 장기 정보를 저장하지 않고 중요 이력은 즉시 `Recent Decisions`로 이동합니다.
5. **Recent Decisions**: 이번 Sprint에서 실제 결정된 핵심 비즈니스/기술적 결정 사항만 추가하고, **최신 5개만 내림차순 정렬 유지**하며 초과분은 자동 삭제합니다.
6. **Pending Review**:
   * 스프린트 검토 요청 시 검토 대상을 상세히 기입합니다.
   * **리뷰 및 승인이 완료된 직후에는 반드시 `None`으로 변경**하여 과거의 대기 항목을 남겨두지 않습니다.
7. **Next Action**: 항상 다음에 진행해야 할 다음 Sprint의 공식 명칭과 상세 목표를 기입합니다.
8. **Current Blockers**: 해결되지 않은 장애물 기술 (없으면 `None` 또는 "없음"으로 강제 표기).
9. **Important Notes**: ChatGPT PM 전용 문서로서의 운영 규칙 및 단일 문서 맥락 복제 성격 명시.
10. **Conversation Resume (대화 재개 절차)**: 다음 순서에 따라 PM이 프로젝트를 이해하도록 작성합니다.
    * 0. `Project Summary` 확인 ➡️ 1. `Current Goal` 확인 ➡️ 2. `Recent Decisions` 확인 ➡️ 3. `Pending Review` 수행 ➡️ 4. `Next Action` 작성
11. **Last Update**: 업데이트 날짜, 완료 Sprint, 다음 Sprint 메타가 실제 프로젝트의 현재 단계 및 상태와 빈틈없이 일치하도록 기록합니다.

### 4-3. 제출 전 필수 자동 검증 (Self Check)
에이전트(Antigravity)는 `CONTEXT.md`를 저장 및 제출하기 직전, 반드시 아래 **5대 필수 항목**이 최신 기준인지 검사해야 하며, 과거의 잔재가 남아있는 경우 수정을 보완한 뒤 저장해야 합니다.
* [ ] **Current Goal 최신화**: 완료된 스프린트 정보 배제 및 현재 대기/진행 태스크 명시 여부
* [ ] **Progress 최신화**: 완료된 스프린트 체크박스(`[x]`)의 전체 동기화 여부
* [ ] **Pending Review 최신화**: 승인 직후 `None` 전환 여부 또는 이번 스프린트 검토 내용 한정 여부
* [ ] **Next Action 최신화**: 다음 진행할 마일스톤 명시 여부
* [ ] **Last Update 최신화**: 날짜, 완료/다음 스프린트 메타 정보의 일치 여부

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

> [!IMPORTANT]
> **에이전트 자율 수행 의무**: 개발 에이전트(Antigravity)는 각 Sprint 또는 개별 작업 완료 시, 사용자로부터 별도 지시를 받지 않더라도 **스스로 커밋 규칙에 맞춰 로컬 Git Commit을 수행하고 원격 GitHub Repository(`develop` 브랜치)에 Push까지 원스톱으로 즉시 실행**해야 합니다. 이는 프로세스 누락 방지를 위한 필수 조건입니다.

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

## 7. Sprint 종료 및 AI 작업 종료 절차 (v2.4 개편)
스프린트가 완료되었거나 작업을 마쳐 세션을 종료(Handover)할 시, 다음의 필수 절차를 엄격히 준수합니다.

### 7-1. Sprint 종료 필수 8단계 프로세스
1. **개발 완료**: 스프린트 범위 내의 기능/소스코드/DDL 구현 완수.
2. **Self Review**: `REVIEW.md`에 명시된 자체 점검 요건 검토.
3. **Git Commit**: `AI_START.md` 5-3 커밋 규칙을 준수하여 커밋 메시지 작성 및 커밋. (예: `feat(core): Sprint 2-1 Core Domain DDL`)
4. **Git Push**: 원격 GitHub Repository(`develop` 브랜치)로 Push (에이전트 자율 수행 의무).
5. **프로젝트 문서 업데이트**: `CONTEXT.md`, `SESSION.md`, `TODO.md`, `CHANGELOG.md`, `PROJECT.md` 최신화.
6. **REVIEW.md 생성**: 리뷰 산출물 표준 포맷에 맞추어 `REVIEW.md` 파일 생성 (이전 리뷰 덮어쓰기 또는 갱신).
7. **ChatGPT (Project Manager) Review 요청**: 생성한 `REVIEW.md`와 `CONTEXT.md`를 제출하여 코드 리뷰 요청.
8. **승인 후 다음 Sprint 진행**: ChatGPT PM의 승인 획득 후 다음 Sprint 개시. (승인 전 절대 다음 스프린트 이행 금지)

### 7-2. REVIEW.md 생성 규칙
모든 Sprint 종료 시, ChatGPT PM이 빠른 변경사항 파악과 일관된 품질 관리를 수행할 수 있도록 루트 경로에 **[REVIEW.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/REVIEW.md)**를 반드시 생성해야 합니다.

#### [REVIEW.md 필수 구성 요소]
1. **Sprint 정보**: Sprint 번호, 대상 Domain, Commit Message 명시.
2. **변경된 파일**: 이번 Sprint에서 생성/수정된 구체적 파일 경로 목록.
3. **변경 요약**: 주요 추가/수정 사항 기술.
4. **Migration 정보**: 생성된 Migration 파일 목록 및 실행 순서, 기존 Migration 수정 여부 (단, 기존 Migration은 수정하지 않음을 원칙으로 명시).
5. **Self Review (자체 점검 결과)**:
   * PostgreSQL 16 호환 여부
   * Supabase 호환 여부
   * FK 순환참조 유무
   * Trigger 정상 동작 확인
   * Migration 순서 검증
   * Architecture 명세와 차이 없음 여부
6. **Known Issues**: 인지하고 있는 버그나 미해결 사항 (없을 시 `None` 기입).
7. **Review Request**: ChatGPT PM이 특별히 집중해서 검토해야 할 항목 (SQL 품질, FK 정책, 인덱스 전략, 아키텍처 일치 여부 등).

### 7-3. ChatGPT 리뷰 제출 및 피드백 규칙
Sprint가 종료되면 PM에게 아래 자료를 함께 제출해야 합니다.
* **필수 제출**: `REVIEW.md`, `CONTEXT.md`
* **필요 시 제출**: 이번 Sprint에서 생성된 SQL DDL 파일 내용, ERD 다이어그램 등
* **운영 원칙**: ChatGPT PM은 제출된 `REVIEW.md`를 단일 기준으로 활용하여 검토하고 승인 여부를 결정합니다.
