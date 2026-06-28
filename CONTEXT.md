# CONTEXT.md (Project Handover Document for ChatGPT PM)

이 문서는 **ChatGPT (프로젝트 매니저/PM)**가 새로운 대화 세션을 시작할 때, 이전 개발 흐름과 프로젝트 상태를 즉시 동기화하고 연계 작업을 이어가기 위한 **프로젝트 인계 문서**입니다.

---

## 1. Project Summary
* **프로젝트명**: AI Product Intelligence Platform
* **프로젝트 목적**: 고객 결핍(JTBD) 기반 시장성 평가, S~D 등급 분류, 상품 기획 및 크리에이티브 시안 도출과 판매 피드백 학습을 자동화하는 AI 플랫폼 구축.
* **현재 버전**: v2.1.0
* **현재 단계**: Phase 8-0 - Product Design Sprint & UX Architecture Foundation
* **현재 Sprint**: Sprint 8-0 완료 [APPROVED 대기]

---

## 2. Current Goal
* **현재 Sprint**: Phase 8-0 - Product Design Sprint & UX Architecture Foundation
* **현재 작업 (Task)**: ChatGPT PM의 Sprint 8-0 UX/UI 설계 산출물 검토 및 승인 대기
* **완료 조건 (Definition of Done)**:
  - 22개 디자인 사양서 및 1개 디자인 토큰 JSON 생성 완료.
  - Sprint 8-0 최종 승인 획득.

---

## 3. Current Progress
* [x] **Product Intelligence Framework v3.0 최종 사양 확정**
* [x] **AI Agent Architecture v1.1 설계 수립**
* [x] **Database Architecture v1.1 Final 설계 확정 및 동결** 완료
* [x] **Core Domain Database DDL 구현 완료**
* [x] **Market Domain Database DDL 구현 완료**
* [x] **GitHub Repository 운영 규칙 반영 및 Git 저장소 구성 완료**
* [x] **Sprint 2-3 ~ 2-6: 데이터베이스 마이그레이션 DDL 구축 완료** [APPROVED]
* [x] **Sprint 3-1 ~ 3-8: Backend Scaffold, Auth, Workspace, Scraper, AI Review Analyzer 및 Persistence 완료** [APPROVED]
* [x] **Sprint 4-1 ~ 4-5: 룰 엔진, JTBD 추출 프롬프트, Product Strategy, Creative Pipeline, Dashboard API 연동 및 리팩터링 완료** [APPROVED]
* [x] **Sprint 5-1 ~ 5-5: 성능 피드백 토대, 등급 산정 엔진, 자가학습 인텔리전스 및 배포 자동화 완료** [APPROVED]
* [x] **Sprint 6-1 ~ 6-5: Distributed Async Job Worker 및 Multi-Agent Workflow Core 완료** [APPROVED]
* [x] **Sprint 7-1 ~ 7-5: 분산 락, 멱등 복구, 감사 로그, 기능 Capability 통제 등 엔터프라이즈 기능 고도화 완료** [APPROVED]
* [x] **Sprint 8-0: Product Design Sprint & UX Architecture Foundation 완료** [APPROVED 대기]

---

## 4. Session Memory (임시 세션 메모리)
*Empty*

---

## 5. Recent Decisions (최근 핵심 의사결정 - 최대 5개)
1. **[DDL-01] 슬레이트(Slate) 기반의 프리미엄 다크 테마 기본 채택**: HSL Hues와 Indigo primary 조합을 선정하여 미래지향적인 비주얼 완성.
2. **[DDL-02] 상품 상세 뷰 내 로컬 탭(Local Tab) 네비게이션 적용**: 잦은 페이지 라우팅에 의한 리로드 지연을 억제하기 위해 단일 상품 레이아웃 내 동적 탭 전환 방식 적용.
3. **[DDL-03] AI 스토리보드 단계적 Progressive Disclosure 적용**: 8단계 상세페이지 기획의 인지 부하를 차단하기 위해 아코디언 토글 전개 방식 강제.
4. **[DDL-04] 감사 이력 조회 시 페이지네이션(Pagination) 단일 표준 채택**: 정확한 시점 검색 및 스크롤 유지를 위해 무한 스크롤 대신 표준 페이지네이터 도입.
5. **[DDL-05] Frontend Next.js 14 App Router 고정**: Radix UI 및 Tailwind, shadcn/ui 템플릿의 안정적인 결합을 보장하기 위해 Next.js 14 버전을 프론트엔드 기준 스택으로 선택.

---

## 6. Pending Review (최우선 검토 목적)
* **Sprint 8-0 완료 검토 요청**:
  - [pm_review/REVIEW.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/pm_review/REVIEW.md)
  - [design/](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/design/) 디렉터리 내 22개 마크다운 문서 및 `tokens/design-tokens.json` 파일 내용.

---

## 7. Next Action
* **ChatGPT (PM)**:
  1. **Sprint 8-0** 설계 산출물의 품질을 검토하고 승인을 확정해주십시오.
  2. 승인 완료 후 다음 구현 연계 스프린트인 **Sprint 8-1** (Next.js 골격 생성 및 로그인/워크스페이스 스위처 연동) 개시를 지시해주십시오.

---

## 8. Current Blockers
* **없음**

---

## 9. Important Notes
* **CONTEXT.md는 ChatGPT 전용 문서**입니다. 새로운 세션 시작 시 이 파일만 로드하면 이전 흐름이 완벽히 이어집니다.
* **대시보드는 Backend API Consumer 역할만 수행하며, 핵심 비즈니스 로직을 프론트엔드단에 직접 탑재하지 않는다.**
* **모든 디자인/설계 산출물은 `design/` 폴더에 구조화한다.**

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
* **업데이트 날짜**: 2026-06-28
* **완료 Sprint**: Sprint 8-0 (Product Design Sprint & UX Architecture Foundation) [APPROVED 대기]
* **다음 Sprint**: Sprint 8-1 (Next.js Scaffolding & Auth/Workspace Integration)
