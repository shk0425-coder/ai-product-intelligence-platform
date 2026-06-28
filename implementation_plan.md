# Implementation Plan - Sprint 8-2 (Final v3.0)

# Dashboard Foundation & Product List Integration

---

# Sprint 목적

Sprint 8-1에서 구축한 Frontend Foundation(App Router, Authentication, Workspace)을 기반으로 실제 서비스를 사용할 수 있는 첫 번째 사용자 화면을 구현한다.

이번 Sprint에서는 Dashboard와 Product List를 구축하고 Backend API와 실제 연동을 완료한다.

Frontend는 API Consumer 역할만 수행하며 Backend의 비즈니스 로직을 절대 구현하지 않는다.

Backend Sprint 7-5 Freeze API를 그대로 사용한다.

---

# 구현 범위

## 1. Dashboard 구축

구현 화면

* Dashboard Home
* KPI Summary Cards
* Recent Analyses
* Recent Activities
* Quick Actions

KPI 계산은 Backend 결과만 출력한다.

Frontend 계산 금지.

---

## 2. Dashboard API Integration

연동 대상

* Dashboard Summary
* Dashboard Statistics
* Recent Analyses
* Recent Activities

구현

* React Query
* Loading
* Error
* Empty
* Retry
* Suspense

Query Key 표준을 적용한다.

---

## 3. Product List

구현

* Product Table
* Search
* Filter
* Sorting
* Pagination
* Status Badge

표시 컬럼

* Product Name
* Brand
* Category
* Market Score
* Grade
* Status
* Created At
* Updated At

---

## 4. Product Detail Routing

Product List → Product Detail

라우팅만 생성한다.

Product Detail은 Skeleton Layout까지만 구현한다.

실제 기능은 Sprint 8-3에서 구현한다.

---

## 5. Search

지원

* 상품명
* 브랜드
* 카테고리

Debounce 적용

React Query와 연동한다.

---

## 6. Filter

지원

* Grade
* Category
* Status

Workspace 기준으로 동작한다.

---

## 7. Pagination

Server Pagination만 사용한다.

Frontend Pagination 금지.

지원

* Page
* Page Size

Cursor Pagination은 사용하지 않는다.

---

## 8. Table Component

공통 컴포넌트 생성

* Table
* Header
* Empty State
* Loading Skeleton
* Badge
* Pagination

Component Catalog를 그대로 따른다.

---

## 9. React Query

생성

* Dashboard Query
* Product Query

규칙

* Query Key 표준화
* staleTime
* cacheTime
* invalidateQueries
* retry 정책
* refetchOnWindowFocus 정책

---

## 10. API Service Layer

생성

services/

* dashboard.service.ts
* product.service.ts

Axios Client만 사용한다.

직접 fetch 사용 금지.

---

## 11. DTO 및 Type

생성

types/

* dashboard.ts
* product.ts

Backend DTO와 동일하게 유지한다.

Frontend DTO 수정 금지.

---

## 12. Global State

Zustand 사용

허용

* UI State
* Sidebar
* Theme

금지

* Server Data 저장

Server Data는 React Query만 사용한다.

---

## 13. Route Guard

구현

* Protected Route
* Login Redirect
* Unauthorized Redirect
* Workspace Validation

---

## 14. Error Handling

구현

* Error Boundary
* API Error
* Forbidden
* Unauthorized
* NotFound
* Network Error

UX Guideline을 따른다.

---

## 15. Loading UX

구현

* Skeleton
* Spinner
* Suspense
* Progressive Loading

---

## 16. Empty State

구현

* Dashboard Empty
* Product Empty
* Search Empty

UX Writing 문서를 그대로 따른다.

---

## 17. Responsive

지원

* Desktop
* Tablet
* Mobile

반응형 규칙 변경 금지.

---

# 구현 규칙

* Sprint 8-0 Design Freeze 변경 금지
* Backend API 변경 금지
* Backend 비즈니스 로직 구현 금지
* Hard Coding 금지
* Mock Data 금지
* TypeScript any 금지
* fetch 사용 금지
* Axios Client만 사용
* React Query만 Server State 관리
* Zustand는 UI State만 관리
* API Contract 변경 금지
* Component Catalog 준수
* API_INTEGRATION_GUIDE.md 준수
* DESIGN_SYSTEM.md 준수
* FRONTEND_ARCHITECTURE.md 준수
* Server Component와 Client Component를 목적에 맞게 사용한다.
* Client Component 남용을 금지한다.
* React Query 외 Server State 저장을 금지한다.
* Server Action은 사용하지 않는다.
* Backend API를 우회하여 Database에 직접 접근하지 않는다.
* Backend API Contract를 임의로 변경하지 않는다.
* Request DTO와 Response DTO를 수정하지 않는다.
* Workspace Header 누락을 금지한다.

---

# API 구현 규칙

* 모든 API 호출은 Axios Client를 사용한다.
* fetch를 직접 사용하지 않는다.
* 모든 API는 API_INTEGRATION_GUIDE.md를 따른다.
* Query Key는 표준 규칙을 적용한다.
* React Query Cache 정책을 준수한다.

---

# Deliverables

* Dashboard
* Dashboard API Integration
* Product List
* Search
* Filter
* Pagination
* Product Detail Skeleton
* Dashboard Service
* Product Service
* Dashboard Types
* Product Types
* Common Table Components
* Route Guard
* Error Boundary
* Protected Routes
* Dashboard Layout
* Loading Components
* Empty State Components
* Error Components
* Shared UI Components

---

# 완료 조건 (Definition of Done)

* Dashboard 정상 동작
* Dashboard API 연동 완료
* KPI 정상 출력
* Product List 정상 출력
* Search 정상
* Filter 정상
* Pagination 정상
* Product Detail Routing 완료
* Route Guard 정상
* Error Boundary 정상
* Responsive 확인
* Build 성공
* TypeScript Compile 성공
* ESLint Error 0
* Test 통과
* 프로젝트 정상 실행
* Protected Route 정상 동작
* Unauthorized Redirect 정상 동작
* Loading UX 확인
* Empty UX 확인
* Error UX 확인
* API Contract와 Backend API 100% 일치
* Workspace Context 정상 적용

---

# Sprint 종료 후 필수 작업

반드시 수행한다.

## 1. 프로젝트 검증 및 증적(Evidence) 생성

* Build 성공
* TypeScript Compile 성공
* ESLint Error 0
* Test 통과
* 프로젝트 정상 실행 확인
* API Response Sample 수집
* 실행 화면 캡처

검증 결과는 REVIEW.md와 PM_REVIEW_PACKAGE.md에 모두 기록한다.

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

## 4. 코드 리뷰 문서 작성

아래 4개 보고서를 필수 작성한다.

* **FRONTEND_REVIEW.md** (구현 요약, 생성/수정/삭제 파일, 컴포넌트/훅/프로바이더 변경 사항, API 연동 결과 및 Self Review)
* **BACKEND_REVIEW.md** (Backend 변경 사항이 없을 경우 반드시 `No Backend Changes` 기입)
* **API_MAPPING_REPORT.md** (Endpoint, Method, DTO, 서비스/쿼리 매핑 및 연동 화면 기입)
* **IMPLEMENTATION_SUMMARY.md** (구현 결과 규모, 신규 컴포넌트/프로바이더/훅/서비스 목록화)
* **ARCHITECTURE_DIFF.md** (아키텍처 변경 대조표)
* **API_CHANGELOG.md** (Backend 변경 사항이 없을 경우 반드시 `No API Changes` 기입)
* **SUBMISSION_MANIFEST.md** (제출물 대조표)

---

## 5. PM Review Package 생성

`pm_review` 폴더를 최신 상태로 갱신한다.

### 포함 디렉터리 및 파일

```
pm_review/
├── PM_REVIEW_PACKAGE.md
├── README.md
├── CODE_REVIEW_GUIDE.md
├── CONTEXT.md
├── REVIEW.md
├── DECISIONS.md
├── walkthrough.md
├── FRONTEND_REVIEW.md
├── BACKEND_REVIEW.md
├── IMPLEMENTATION_SUMMARY.md
├── API_MAPPING_REPORT.md
├── ARCHITECTURE_DIFF.md
├── API_CHANGELOG.md
├── SUBMISSION_MANIFEST.md
├── CHANGELOG.md
├── backend_code.zip
├── frontend_code.zip
├── database_and_reviews.zip
├── screenshots/
│   ├── login.png
│   ├── dashboard.png
│   ├── product-list.png
│   ├── product-detail.png
│   ├── loading.png
│   ├── empty.png
│   ├── error.png
│   ├── desktop.png
│   ├── tablet.png
│   └── mobile.png
├── api_samples/
└── evidence/
```

Design 변경이 없는 Sprint에서는 기존 디자인 zip(design_review.zip, design_full.zip)을 그대로 유지하며 재생성하지 않는다.

---

## 6. PM_REVIEW_PACKAGE.md 생성

다음 내용을 포함한다.

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

PM 승인을 막을 수 있는 항목을 작성한다. 없으면 `None`으로 작성한다.

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
FRONTEND_REVIEW.md
BACKEND_REVIEW.md
IMPLEMENTATION_SUMMARY.md
API_MAPPING_REPORT.md
ARCHITECTURE_DIFF.md
API_CHANGELOG.md
SUBMISSION_MANIFEST.md
CHANGELOG.md
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

## 7. PM Review Self Validation

PM Review 요청 전에 반드시 아래 항목을 확인한다.

* 모든 Deliverables 생성 완료
* API Mapping 확인
* Query Key 확인
* Cache 정책 확인
* Workspace Header 확인
* Route Guard 확인
* Unauthorized Redirect 확인
* Responsive 확인
* Dark Theme 확인
* Build 성공
* TypeScript Compile 성공
* ESLint Error 0
* Test 통과
* CONTEXT.md 최신화
* REVIEW.md 최신화
* DECISIONS.md 최신화
* walkthrough.md 최신화
* PM_REVIEW_PACKAGE.md 최신화
* 코드 리뷰 문서 생성 완료
* pm_review 폴더 누락 파일 없음

모든 항목이 완료된 경우에만 PM Review를 요청한다.

---

## 8. 완료 보고

PM Review Package 생성이 완료되면 아래 형식으로 완료 보고를 작성한다.

* Sprint 번호
* Sprint 완료 여부
* Definition of Done 충족 여부
* 구현 기능 요약
* Build 결과
* TypeScript 결과
* ESLint 결과
* Test 결과
* 생성 코드 파일 수
* 생성 문서 수
* Known Issues
* 제출 파일 목록

완료 보고와 함께 PM Review를 요청한다.

---

## 9. 제출

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

* Dashboard 완료
* Product List 완료
* Dashboard API 완료
* Search 완료
* Filter 완료
* Pagination 완료
* Route Guard 완료
* Error Boundary 완료
* Build 성공
* TypeScript Compile 성공
* ESLint Error 0
* Test 통과
* 실행 확인
* Git Commit 완료
* CONTEXT 업데이트
* REVIEW 작성
* DECISIONS 업데이트
* walkthrough 작성
* FRONTEND_REVIEW.md 생성
* BACKEND_REVIEW.md 생성
* IMPLEMENTATION_SUMMARY.md 생성
* API_MAPPING_REPORT.md 생성
* ARCHITECTURE_DIFF.md 생성
* API_CHANGELOG.md 생성
* SUBMISSION_MANIFEST.md 생성
* CHANGELOG.md 생성
* PM_REVIEW_PACKAGE.md 작성
* backend_code.zip 생성
* frontend_code.zip 생성
* database_and_reviews.zip 생성
* Design 변경 시 design_review.zip 및 design_full.zip 갱신
* PM Review Self Validation 완료
* 완료 보고 작성
* pm_review 폴더 최종 검증 완료

스프린트는 위 체크리스트를 모두 만족하고 완료 보고까지 끝난 경우에만 종료된 것으로 간주한다.
