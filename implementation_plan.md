# Implementation Plan - Sprint 8-2 (Final v2.0)

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

---

# Definition of Done

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

---

# Sprint 종료 후 필수 작업

반드시 수행한다.

## 프로젝트 검증

* Build 성공
* TypeScript Compile 성공
* ESLint Error 0
* Test 통과
* 프로젝트 실행 확인

## Git

* 변경사항 검토
* Conventional Commit 작성
* 최신 브랜치 확인

## 문서 업데이트

* CONTEXT.md
* REVIEW.md
* DECISIONS.md
* walkthrough.md

## Code Review 문서 생성

반드시 생성한다.

* FRONTEND_REVIEW.md
* API_MAPPING_REPORT.md

## PM Review Package 생성

생성

* backend_code.zip
* frontend_code.zip
* database_and_reviews.zip
* CONTEXT.md
* REVIEW.md
* DECISIONS.md
* walkthrough.md
* PM_REVIEW_PACKAGE.md

Design 변경 시

* design_review.zip
* design_full.zip

기존 Design 변경이 없으면 재생성하지 않는다.

---

# PM Review Self Validation

반드시 확인한다.

* Dashboard 정상
* Product List 정상
* API Mapping 확인
* Query Key 확인
* DTO 일치
* Build 성공
* Test 통과
* ESLint Error 0
* TypeScript Compile 성공
* Review 문서 생성
* walkthrough 최신화
* CONTEXT 최신화
* DECISIONS 최신화
* PM Review Package 생성 완료

---

# 완료 보고

포함

* Sprint 완료 여부
* DoD 충족 여부
* Dashboard 결과
* Product List 결과
* API 연동 결과
* Build 결과
* Test 결과
* ESLint 결과
* 생성 코드 수
* 생성 문서 수
* Known Issues
* 제출 파일 목록

완료 후 PM Review를 요청한다.

---

# 제출

pm_review 폴더 전체 제출

검토 순서

1. PM_REVIEW_PACKAGE.md
2. REVIEW.md
3. CONTEXT.md
4. backend_code.zip
5. frontend_code.zip
6. database_and_reviews.zip
7. design_review.zip(변경 시)
8. design_full.zip(변경 시)

---

# Sprint 종료 체크리스트

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
* API_MAPPING_REPORT.md 생성
* PM_REVIEW_PACKAGE.md 생성
* backend_code.zip 생성
* frontend_code.zip 생성
* database_and_reviews.zip 생성
* Design 변경 시 design_review.zip 및 design_full.zip 갱신
* PM Review Self Validation 완료
* 완료 보고 작성
* pm_review 폴더 최종 검증 완료

Sprint는 위 체크리스트를 모두 만족한 경우에만 종료된 것으로 간주한다.


# 리뷰 자료 제출 (필수)

Sprint 완료 후 PM Review 요청 전에 아래 자료를 반드시 생성하여 제출한다.

---

# 1. PM Review Package

`pm_review/` 폴더를 최신 상태로 갱신한다.

반드시 포함한다.

```
pm_review/

PM_REVIEW_PACKAGE.md
README.md
CODE_REVIEW_GUIDE.md

backend_code.zip
frontend_code.zip
database_and_reviews.zip

CONTEXT.md
REVIEW.md
DECISIONS.md
walkthrough.md

FRONTEND_REVIEW.md
BACKEND_REVIEW.md
API_MAPPING_REPORT.md
IMPLEMENTATION_SUMMARY.md
CHANGELOG.md

(Design 변경 시)
design_review.zip
design_full.zip
```

---

# 2. 코드 리뷰 문서

## FRONTEND_REVIEW.md

반드시 포함

* Sprint 목표
* 구현 기능
* 생성 파일
* 수정 파일
* 삭제 파일
* 주요 컴포넌트
* 주요 Hook
* Provider 변경
* React Query 변경
* Zustand 변경
* Routing 변경
* API 연동 결과
* Self Review
* Known Issues

---

## BACKEND_REVIEW.md

Backend 변경이 있는 Sprint에서만 생성한다.

포함

* 변경 API
* 변경 Service
* 변경 Repository
* 변경 Entity
* 변경 DTO
* 변경 Middleware
* Database 영향
* 기존 API 영향

Backend 변경이 없으면 아래와 같이 작성한다.

```
No Backend Changes
```

---

# 3. API Mapping Report

API_MAPPING_REPORT.md 생성

반드시 포함

* Endpoint
* Method
* Request DTO
* Response DTO
* Frontend Service
* React Query
* 화면 위치
* 테스트 결과

누락 API가 없어야 한다.

---

# 4. Implementation Summary

IMPLEMENTATION_SUMMARY.md 생성

포함

* Sprint 목표
* 구현 결과
* 주요 기능
* 주요 아키텍처
* 변경 규모
* 생성 코드 수
* 수정 코드 수
* 생성 문서 수
* 신규 컴포넌트
* 신규 Provider
* 신규 Hook
* 신규 Service

---

# 5. Change Log

CHANGELOG.md 생성

포함

## Added

## Changed

## Fixed

## Refactored

## Removed

Conventional Commit 기준으로 작성한다.

---

# 6. 실행 검증 자료

반드시 수행한다.

* Build 성공
* TypeScript Compile 성공
* ESLint Error 0
* Test 통과
* 프로젝트 정상 실행

검증 결과를 REVIEW.md와 PM_REVIEW_PACKAGE.md에 모두 기록한다.

---

# 7. 스크린샷 제출

Frontend 변경이 있는 Sprint에서는 반드시 제출한다.

```
screenshots/

login.png
dashboard.png
product-list.png
product-detail.png
responsive-desktop.png
responsive-tablet.png
responsive-mobile.png
loading.png
empty.png
error.png
```

UI 변경이 없는 Sprint는 생략 가능하다.

---

# 8. 리뷰용 ZIP 생성

반드시 생성한다.

```
backend_code.zip
frontend_code.zip
database_and_reviews.zip
```

압축 기준

backend_code.zip

* backend 전체 소스
* package.json
* migrations

frontend_code.zip

* frontend 전체 소스
* package.json

database_and_reviews.zip

* REVIEW.md
* DECISIONS.md
* CONTEXT.md
* walkthrough.md
* PM_REVIEW_PACKAGE.md
* FRONTEND_REVIEW.md
* BACKEND_REVIEW.md
* API_MAPPING_REPORT.md
* IMPLEMENTATION_SUMMARY.md
* CHANGELOG.md

---

# 9. PM 제출 체크리스트

제출 전 반드시 확인한다.

* Deliverables 완료
* Build 성공
* TypeScript 성공
* ESLint Error 0
* Test 통과
* API Mapping 확인
* Query Key 확인
* DTO 일치 확인
* Context 최신화
* Decisions 최신화
* Walkthrough 최신화
* Review 최신화
* PM Review Package 생성
* Screenshots 생성(해당 시)
* ZIP 생성 완료

---

# 10. PM Review 요청

아래 형식으로 완료 보고를 작성한다.

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

위 자료가 모두 준비된 경우에만 PM Review를 요청한다.
