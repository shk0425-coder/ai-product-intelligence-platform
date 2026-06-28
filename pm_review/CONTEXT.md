# CONTEXT.md (Project Handover Document for ChatGPT PM)

이 문서는 **ChatGPT (프로젝트 매니저/PM)**가 새로운 대화 세션을 시작할 때, 이전 개발 흐름과 프로젝트 상태를 즉시 동기화하고 연계 작업을 이어가기 위한 **프로젝트 인계 문서**입니다.

---

## 1. Project Summary
* **프로젝트명**: AI Product Intelligence Platform
* **프로젝트 목적**: 고객 결핍(JTBD) 기반 시장성 평가, S~D 등급 분류, 상품 기획 및 크리에이티브 시안 도출과 판매 피드백 학습을 자동화하는 AI 플랫폼 구축.
* **현재 버전**: v2.2.0
* **현재 단계**: Phase 8-1 - Next.js Scaffolding & Auth / Workspace Integration
* **현재 Sprint**: Sprint 8-1 완료 [APPROVED 대기]

---

## 2. Current Goal
* **현재 Sprint**: Phase 8-1 - Next.js Scaffolding & Auth / Workspace Integration
* **현재 작업 (Task)**: ChatGPT PM의 Sprint 8-1 프론트엔드 프로젝트 아키텍처 및 세션 연동 검토/승인 대기
* **완료 조건 (Definition of Done)**:
  - Next.js 14 App Router 기반 프로젝트 생성 및 디렉터리 구성 완료
  - HttpOnly 쿠키와 API 프록시 라우터를 활용한 JWT 세션 및 토큰 갱신 흐름 구축 완료
  - Zustand 스토어 및 Axios/React Query 프로바이더 통합 완료
  - Sidebar/Header 공통 레이아웃 및 5대 핵심 페이지 라우팅 설정 완료
  - 전체 빌드 및 ESLint 0 에러 통과 확인 완료

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
* [x] **Sprint 8-0: Product Design Sprint & UX Architecture Foundation 완료** [APPROVED]
* [x] **Sprint 8-1: Next.js Scaffolding & Auth / Workspace Integration 완료** [APPROVED 대기]

---

## 4. Session Memory (임시 세션 메모리)
* *Empty*

---

## 5. Recent Decisions (최근 핵심 의사결정 - 최대 5개)
1. **[DDL-06] Next.js Route Handler 기반 HttpOnly 쿠키 프록시 기법 도입**: 프론트엔드 단독으로 Access Token을 로컬 스토리지에 노출시키지 않기 위해 Next.js 서버를 프록시로 사용하여 HttpOnly 쿠키를 세팅하고, 백엔드로의 요청 시 Bearer 토큰을 자동으로 가로채 주입하는 구조 채택.
2. **[DDL-07] Zustand 전역 스토어와 React Query 역할 엄격 분리**: 비즈니스 정보(워크스페이스 리스트, 상품 분석 목록 등)는 React Query 캐시로만 관리하며, Zustand 스토어(`useAuthStore`, `useWorkspaceStore`, `useUiStore`)는 오직 유저 세션 및 선택된 활성 컨텍스트 ID 등 순수 UI 메타 정보 관리용으로 격리.
3. **[DDL-08] API 통신용 Axios 인터셉터 내 워크스페이스 헤더 자동 주입**: 모든 백엔드 요청에 활성 워크스페이스 컨텍스트를 주입하기 위해 `apiClient` 인터셉터가 `useWorkspaceStore`에서 `currentWorkspaceId`를 실시간 취득하여 `x-workspace-id` 헤더에 삽입하도록 처리.
4. **[DDL-09] 401 오류 처리 통합 및 동적 리프레시 바이패스**: 토큰이 만료되어 백엔드에서 401 Unauthorized를 응답할 시, Next.js 프록시가 내부적으로 `refreshToken` 쿠키를 읽어 토큰을 자동 갱신(Retry)하고, 리프레시조차 실패할 경우에만 클라이언트 세션을 삭제하여 로그인 페이지로 강제 리다이렉트 처리.

---

## 6. Pending Review (최우선 검토 목적)
* **Sprint 8-1 완료 검토 요청**:
  - [pm_review/PM_REVIEW_PACKAGE.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/pm_review/PM_REVIEW_PACKAGE.md) (PM 검사 목록 및 리뷰 우선순위 인덱스)
  - [pm_review/REVIEW.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/pm_review/REVIEW.md) (자체 세부 평가 보고서)
  - `frontend/` 디렉터리 내 신규 추가된 프론트엔드 소스코드 전체.

---

## 7. Next Action
* **Reply/Direction (PM)**:
  1. **Sprint 8-1** 결과물에 대해 빌드 및 인증 프록시 연동 정합성을 검토하고 승인해주십시오.
  2. 승인 완료 후 다음 프론트엔드 연동 마일스톤인 **Sprint 8-2** (네이버 쇼핑 상품 크롤러 및 수집 모듈 연동 개발) 작업지시서를 제공해주십시오.

---

## 8. Current Blockers
* **없음**

---

## 9. Important Notes
* **CONTEXT.md는 ChatGPT 전용 문서**입니다. 새로운 세션 시작 시 이 파일만 로드하면 이전 흐름이 완벽히 이어집니다.
* **모든 API 호출 시 활성 워크스페이스 컨텍스트(`x-workspace-id` 헤더)가 올바르게 전송되는지 검증해야 한다.**

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
* **완료 Sprint**: Sprint 8-1 (Next.js Scaffolding & Auth/Workspace Integration) [APPROVED 대기]
* **다음 Sprint**: Sprint 8-2 (Naver Shopping Product Crawler & Scraping Module Integration)
