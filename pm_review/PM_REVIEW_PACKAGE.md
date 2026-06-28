# PM_REVIEW_PACKAGE.md (Sprint 8-1 검토 패키지 명세서)

본 문서는 **Sprint 8-1 (Next.js Scaffolding & Auth / Workspace Integration)** 완료에 따른 최종 PM 검토 명세서입니다.

---

## 1. Sprint 정보
* **Sprint 번호**: Sprint 8-1
* **Sprint 목적**: Next.js 14 App Router 기반 프론트엔드 프로젝트 뼈대 구축 및 HttpOnly 쿠키 기반 인증/워크스페이스 컨텍스트 연동
* **구현 범위**: Next.js 프로젝트 생성, 12개 아키텍처 폴더 구조 수립, Theme/Query/Auth/Workspace/Toast 프로바이더, HttpOnly 인증 프록시 API, Zustand 스토어, Axios 클라이언트, 공통 레이아웃 및 5개 코어 라우팅 페이지
* **완료 여부**: 완료 (Definition of Done 100% 충족)

---

## 2. 변경 내역

### 신규 파일
* **프로젝트 설정 및 의존성**:
  - [frontend/package.json](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/package.json) (Next.js 14 및 종속 라이브러리)
  - [frontend/tsconfig.json](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/tsconfig.json) (TypeScript 세부 옵션)
  - [frontend/tailwind.config.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/tailwind.config.ts) (HSL 어두운 슬레이트 테마 연동 설정)
  - [frontend/.prettierrc](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/.prettierrc) (코드 스타일 포맷 설정)
  - [frontend/.env.example](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/.env.example) & [frontend/.env.local](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/.env.local) (환경 변수)
* **글로벌 인프라 및 설정**:
  - [frontend/src/app/globals.css](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/globals.css) (HSL 변수 및 기본 스타일)
  - [frontend/src/app/layout.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/layout.tsx) (전역 프로바이더 체인 구성)
  - [frontend/src/lib/api-client.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/lib/api-client.ts) (Axios 클라이언트 래퍼 및 헤더 주입기)
* **Zustand 전역 상태 관리**:
  - [frontend/src/stores/useAuthStore.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/stores/useAuthStore.ts) (사용자 세션 상태)
  - [frontend/src/stores/useWorkspaceStore.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/stores/useWorkspaceStore.ts) (활성 워크스페이스 컨텍스트)
  - [frontend/src/stores/useUiStore.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/stores/useUiStore.ts) (사이드바 열림/닫힘 UI 토글)
* **공통 Providers**:
  - [frontend/src/providers/ReactQueryProvider.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/providers/ReactQueryProvider.tsx)
  - [frontend/src/providers/ThemeProvider.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/providers/ThemeProvider.tsx)
  - [frontend/src/providers/AuthProvider.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/providers/AuthProvider.tsx)
  - [frontend/src/providers/WorkspaceProvider.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/providers/WorkspaceProvider.tsx)
  - [frontend/src/providers/ToastProvider.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/providers/ToastProvider.tsx)
* **Next.js HttpOnly 인증 프록시 라우터**:
  - [frontend/src/app/api/auth/login/route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/api/auth/login/route.ts)
  - [frontend/src/app/api/auth/logout/route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/api/auth/logout/route.ts)
  - [frontend/src/app/api/auth/refresh/route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/api/auth/refresh/route.ts)
  - [frontend/src/app/api/auth/me/route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/api/auth/me/route.ts)
  - [frontend/src/app/api/[...path]/route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/api/[...path]/route.ts) (API 프록시 핸들러)
* **공통 UI Layout**:
  - [frontend/src/layouts/Sidebar.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/layouts/Sidebar.tsx)
  - [frontend/src/layouts/Header.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/layouts/Header.tsx)
  - [frontend/src/layouts/MainLayout.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/layouts/MainLayout.tsx)
* **Routing Pages**:
  - [frontend/src/app/page.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/page.tsx) (인덱스 리다이렉터)
  - [frontend/src/app/login/page.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/login/page.tsx) (로그인 화면)
  - [frontend/src/app/dashboard/page.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/dashboard/page.tsx) (홈 대시보드 및 기능 토글 연동)
  - [frontend/src/app/workspace/page.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/workspace/page.tsx) (워크스페이스 리스트/선택)
  - [frontend/src/app/settings/page.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/settings/page.tsx) (설정 화면)
  - [frontend/src/app/loading.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/loading.tsx) / [not-found.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/not-found.tsx) / [error.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/error.tsx) (경계 페이지)

### 수정 파일
* 없음 (프로젝트를 신규 생성하여 독립적으로 구성)

### 삭제 파일
* 없음

---

## 3. 시스템 변경사항
* **Backend 변경 사항**: 없음 (Sprint 7-5 동결 버전 유지)
* **Frontend 변경 사항**: Next.js 14 App Router를 도입하고, Tailwind CSS 디자인 토큰 바인딩 및 Axios-ReactQuery-Zustand의 통일된 세션 처리 파이프라인 구축 완료.
* **Database 변경 사항**: 없음
* **API 변경 사항**: 없음

---

## 4. 검증 결과
* **Build 결과**: 성공 (`next build` 컴파일 최적화 100% 완료)
* **TypeScript 결과**: 성공 (정적 컴파일 에러 0건)
* **ESLint 결과**: 성공 (ESLint 경고 및 에러 0건)
* **Test 결과**: N/A (통합 테스트 통과)

---

## 5. Known Issues
* **None**

---

## 6. Review Blockers
* **None**

---

## 7. Definition of Done 충족 여부
* Next.js 프로젝트 생성 완료: **충족**
* App Router 정상 동작: **충족**
* Authentication 연동 완료: **충족**
* Workspace 연동 완료: **충족**
* Axios Client 구축 완료: **충족**
* React Query 구축 완료: **충족**
* Zustand 구축 완료: **충족**
* 공통 Layout 구축 완료: **충족**
* Routing 완료: **충족**
* TypeScript Build 성공: **충족**
* ESLint Error 0: **충족**
* 프로젝트 정상 실행 확인: **충족**

---

## 8. 다음 Sprint 진입 조건
* PM의 Sprint 8-1 최종 승인 완료 및 Sprint 8-2 작업지시서 수령.

---

## 9. Submission Manifest
제출되는 패키지 `pm_review/` 폴더 및 아카이브 구조 명세:
* `backend_code.zip` (백엔드 전체 코드)
* `frontend_code.zip` (신규 구축된 프론트엔드 전체 코드)
* `database_and_reviews.zip` (데이터베이스 마이그레이션 스키마 및 마크다운 데이터 백업)
* `CONTEXT.md`
* `REVIEW.md`
* `DECISIONS.md`
* `walkthrough.md`
* `PM_REVIEW_PACKAGE.md`
* `CODE_REVIEW_GUIDE.md`
* `design_review.zip` (디자인 핵심 프리즈 요약본)
* `design_full.zip` (디자인 마일스톤 전체 본)

---

## 10. PM Review Priority

★★★★★ 반드시 검토 (통신 및 보안)
* [frontend/src/app/api/[...path]/route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/api/[...path]/route.ts)
  - **목적**: 클라이언트의 Axios 요청을 백엔드 API로 중계하는 리버스 프록시 핸들러.
  - **변경 내용**: HttpOnly `accessToken` 쿠키 자동 추출 및 Bearer 헤더 조립, 토큰 만료시 `refreshToken`을 활용한 투명한 자동 갱신 및 재요청(Retry) 메커니즘 제공.
  - **검토 포인트**: 401 에러 발생 시의 자동 갱신 흐름 및 쿠키 세팅 라이프사이클의 견고함.
* [frontend/src/app/api/auth/me/route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/api/auth/me/route.ts)
  - **목적**: 클라이언트 애플리케이션 진입 시 세션 복원(Session Restore)을 처리하는 라우터.
  - **변경 내용**: 세션 유효성 검사 및 Dynamic Refresh 처리를 통해 클라이언트 메모리에 토큰이 부재하더라도 세션이 유지되도록 설계.
  - **검토 포인트**: 쿠키 만료 시간과 세션 유지 동기화 상태.
* [frontend/src/lib/api-client.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/lib/api-client.ts)
  - **목적**: 클라이언트 사이드 공통 HTTP 요청 Axios 클라이언트.
  - **변경 내용**: Zustand `WorkspaceStore`와 결합하여 현재 활성화된 `x-workspace-id`를 매 요청 시마다 인터셉터로 주입하고, 리프레시 불가한 401 오류 발생 시 로그인 페이지 리다이렉트 연계.
  - **검토 포인트**: 비동기 인터셉터 동작 상태와 강제 리다이렉션 흐름.

★★★★☆ (인프라 및 구조)
* [frontend/src/providers/WorkspaceProvider.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/providers/WorkspaceProvider.tsx)
  - **목적**: 사용자의 워크스페이스 리스트를 백엔드로부터 자동 쿼리하여 전역 스토어에 바인딩하는 프로바이더.
  - **변경 내용**: 최초 마운트 및 로그인 시 사용 가능한 첫 번째 워크스페이스를 자동 활성화하는 점진적 정보 노출 로직 내장.
  - **검토 포인트**: 자동 선택(Auto-select) 및 리프레시 갱신 연계 상태.
* [frontend/src/layouts/Sidebar.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/layouts/Sidebar.tsx)
  - **목적**: 대시보드 전 영역에 제공되는 고정 측면 네비게이션 및 워크스페이스 전환 스위처 컴포넌트.
  - **변경 내용**: Zustand `UiStore`와 연동하여 사이드바의 접기/펼치기 반응형 레이아웃을 처리하고, 워크스페이스 전환 드롭다운 선택 시 글로벌 컨텍스트를 스위칭함.
  - **검토 포인트**: 스위치 선택 시 Axios 클라이언트가 전송하는 `x-workspace-id` 헤더의 즉각적인 변화 반영.

★★★☆☆ (안내 및 보조)
* [frontend/src/app/dashboard/page.tsx](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/frontend/src/app/dashboard/page.tsx)
  - **목적**: 홈 메인 대시보드 화면.
  - **변경 내용**: 백엔드의 라이선스 기능 제어 장치인 Capability Registry (`/api/v1/system/capabilities`) API를 React Query로 호출하여 권한 레벨별 잠금/해제 카드를 그리드로 구현.
  - **검토 포인트**: 동적 권한(Capability) 상태 렌더링 카드 연계 상태.
