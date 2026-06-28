# Implementation Plan - Sprint 8-1 (Final v2.2)

# Next.js Scaffolding & Auth / Workspace Integration

---

# Sprint 목적

Sprint 8-0에서 확정된 Design Freeze를 기반으로 Frontend 프로젝트를 시작한다.

Backend API는 Sprint 7-5 Freeze 버전을 그대로 사용하며, Frontend는 API Consumer 역할만 수행한다.

이번 Sprint의 목표는 Frontend 프로젝트의 기반 아키텍처를 구축하고 Authentication 및 Workspace 연동을 완료하는 것이다.

---

# 구현 범위

## 1. Frontend 프로젝트 생성

기술스택

* Next.js 14 (App Router)
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Radix UI
* React Query
* Zustand
* React Hook Form
* Zod
* Axios

구성

* ESLint
* Prettier
* Husky
* lint-staged

---

## 2. 프로젝트 구조

FRONTEND_ARCHITECTURE.md를 기준으로 구성한다.

```text
frontend/

src/
 ├── app/
 ├── components/
 ├── features/
 ├── hooks/
 ├── layouts/
 ├── lib/
 ├── providers/
 ├── services/
 ├── stores/
 ├── styles/
 ├── types/
 └── utils/
```

---

## 3. Provider 구축

* Theme Provider
* React Query Provider
* Auth Provider
* Workspace Provider
* Toast Provider

Root Layout에 등록한다.

---

## 4. Authentication

구현

* Login
* Logout
* Session Restore
* Token Refresh
* Unauthorized Redirect

규칙

* JWT는 HttpOnly Cookie 정책 사용
* Frontend는 Access Token을 직접 저장하지 않는다.

---

## 5. Workspace

구현

* Workspace 목록
* Workspace 선택
* Workspace Context
* Workspace 전환

모든 API는 Workspace Context 기반으로 동작한다.

---

## 6. Axios Client

구현

* Base Client
* Request Interceptor
* Response Interceptor
* Timeout
* Retry
* Error Handler

API_INTEGRATION_GUIDE.md를 그대로 따른다.

---

## 7. Global State

Zustand

* Auth Store
* Workspace Store
* UI Store

비즈니스 데이터는 React Query만 사용한다.

---

## 8. React Query

구현

* QueryClient
* Cache
* Invalidation
* Error Handling

---

## 9. Layout

구현

* Sidebar
* Header
* Content Layout

디자인 변경 금지

---

## 10. Routing

생성

* /
* /login
* /dashboard
* /workspace
* /settings

---

## 11. Error 처리

구현

* Loading
* Error
* NotFound
* Suspense

---

## 12. Environment

구현

* .env.example
* API Endpoint
* Build Config

---

# 구현 규칙

* Sprint 8-0 Design Freeze를 변경하지 않는다.
* Backend API를 변경하지 않는다.
* Backend 비즈니스 로직을 Frontend로 이동하지 않는다.
* 구현은 DESIGN_SYSTEM.md, FRONTEND_ARCHITECTURE.md, API_INTEGRATION_GUIDE.md를 그대로 따른다.
* implementation_plan.md는 수정하지 않는다.

---

# Deliverables

* Next.js Project
* App Router
* Providers
* Authentication
* Workspace Integration
* Axios Client
* React Query
* Zustand
* Common Layout
* Routing
* Environment Configuration

---

# 완료 조건 (Definition of Done)

* Next.js 프로젝트 생성 완료
* App Router 정상 동작
* Authentication 연동 완료
* Workspace 연동 완료
* Axios Client 구축 완료
* React Query 구축 완료
* Zustand 구축 완료
* 공통 Layout 구축 완료
* Routing 완료
* TypeScript Build 성공
* ESLint Error 0
* 프로젝트 정상 실행 확인

---

# Sprint 종료 후 필수 작업

## 1. 프로젝트 검증

반드시 수행한다.

* Build 성공
* TypeScript Compile 성공
* ESLint Error 0
* Test 통과
* 프로젝트 정상 실행 확인

---

## 2. Git 관리

반드시 아래 순서를 수행한다.

* 변경사항 검토
* Commit 생성
* Commit Message 작성
* 작업 브랜치 최신 상태 확인

Commit Message는 Conventional Commits 규칙을 따른다.

---

## 3. 프로젝트 문서 업데이트

최신 Sprint 기준으로 업데이트한다.

* CONTEXT.md
* REVIEW.md
* DECISIONS.md
* walkthrough.md

---

## 4. PM Review Package 생성

`pm_review` 폴더를 최신 상태로 갱신한다.

### 포함 파일

* backend_code.zip
* frontend_code.zip
* database_and_reviews.zip
* CONTEXT.md
* REVIEW.md
* DECISIONS.md
* walkthrough.md
* PM_REVIEW_PACKAGE.md

### Design 문서

Design 산출물이 변경된 Sprint인 경우에만 아래 파일을 갱신하여 포함한다.

* design_review.zip
* design_full.zip

Design 변경이 없는 Sprint에서는 기존 파일을 그대로 유지하며 재생성하지 않는다.

---

## 5. PM_REVIEW_PACKAGE.md 생성

### Sprint 정보

* Sprint 번호
* Sprint 목적
* 구현 범위
* 구현 요약
* 완료 여부

### 변경 내역

* 신규 파일
* 수정 파일
* 삭제 파일

### 시스템 변경

* Backend 변경 사항
* Frontend 변경 사항
* Database 변경 사항
* API 변경 사항

### 검증 결과

* Build 결과
* TypeScript 결과
* ESLint 결과
* Test 결과

### Known Issues

### Review Blockers

PM 승인을 막을 수 있는 항목을 작성한다.

예시

* Build 실패
* ESLint Error 존재
* Test 실패
* API Mapping 불일치
* Deliverables 누락

없으면

```text
None
```

으로 작성한다.

### Definition of Done 충족 여부

### 다음 Sprint 진입 조건

### Submission Manifest

```text
backend_code.zip
frontend_code.zip
database_and_reviews.zip

CONTEXT.md
REVIEW.md
DECISIONS.md
walkthrough.md

PM_REVIEW_PACKAGE.md

(Design 변경 시)
design_review.zip
design_full.zip
```

### PM Review Priority

★★★★★ 반드시 검토

★★★★☆

★★★☆☆

각 파일마다

* 목적
* 변경 내용
* 검토 포인트

를 작성한다.

---

## 6. PM Review Self Validation

PM Review 요청 전에 반드시 아래 항목을 확인한다.

* 모든 Deliverables 생성 완료
* Build 성공
* TypeScript Compile 성공
* ESLint Error 0
* Test 통과
* API Mapping 최신 상태
* CONTEXT.md 최신화
* REVIEW.md 최신화
* DECISIONS.md 최신화
* walkthrough.md 최신화
* PM_REVIEW_PACKAGE.md 최신화
* pm_review 폴더 누락 파일 없음

모든 항목이 완료된 경우에만 PM Review를 요청한다.

---

## 7. 완료 보고

PM Review Package 생성이 완료되면 아래 형식으로 완료 보고를 작성한다.

* Sprint 완료 여부
* Definition of Done 충족 여부
* Build 결과
* Test 결과
* ESLint 결과
* 생성된 Deliverables 수
* 생성된 코드 파일 수
* 생성된 문서 수
* Known Issues
* 제출 파일 목록

완료 보고와 함께 PM Review를 요청한다.

---

## 8. 제출

PM에게는 `pm_review` 폴더 전체를 제출한다.

PM은 아래 순서로 검토를 진행한다.

1. PM_REVIEW_PACKAGE.md
2. REVIEW.md
3. CONTEXT.md
4. backend_code.zip
5. frontend_code.zip
6. database_and_reviews.zip
7. (Design 변경 시) design_review.zip
8. 필요 시 design_full.zip

---

# Sprint 종료 체크리스트

Sprint 종료 전 아래 항목을 모두 완료해야 한다.

* Build 성공
* TypeScript Compile 성공
* ESLint Error 0
* Test 통과
* 프로젝트 실행 확인
* Git Commit 완료
* CONTEXT.md 업데이트
* REVIEW.md 작성
* DECISIONS.md 업데이트
* walkthrough.md 작성
* PM_REVIEW_PACKAGE.md 작성
* backend_code.zip 생성
* frontend_code.zip 생성
* database_and_reviews.zip 생성
* Design 변경 시 design_review.zip 및 design_full.zip 갱신
* PM Review Self Validation 완료
* 완료 보고 작성
* pm_review 폴더 최종 검증 완료

Sprint는 위 체크리스트를 모두 만족하고 PM Review Package 생성 및 완료 보고까지 끝난 경우에만 종료된 것으로 간주한다.
