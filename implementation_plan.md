# Implementation Plan - Sprint 8-2 (Final v3.1)

# Next.js Dashboard Foundation & Product List Integration

---

# 1. Sprint 목적

Sprint 8-1에서 구축한 Frontend Foundation(App Router, Authentication, Workspace)을 기반으로 실제 서비스를 사용할 수 있는 첫 번째 사용자 화면을 구현한다.

이번 Sprint에서는 Dashboard와 Product List를 구축하고 Backend API와 실제 연동을 완료한다.

Frontend는 API Consumer 역할만 수행하며 Backend의 비즈니스 로직을 절대 구현하지 않는다.

Backend Sprint 7-5 Freeze API를 그대로 사용한다.

---

# 2. 구현 범위

## 1. Dashboard 구축
구현 화면
* Dashboard Home
* KPI Summary Cards
* Recent Analyses
* Recent Activities
* Quick Actions

KPI 계산은 Backend 결과만 출력한다. (Frontend 계산 금지)

## 2. Dashboard API Integration
연동 대상
* Dashboard Summary
* Dashboard Statistics
* Recent Analyses
* Recent Activities

구현
* React Query (Query Key 표준 적용)
* Loading / Error / Empty / Retry / Suspense

## 3. Product List
구현
* Product Table (Search, Filter, Sorting, Pagination, Status Badge)

표시 컬럼
* Product Name, Brand, Category, Market Score, Grade, Status, Created At, Updated At

## 4. Product Detail Routing
* Product List → Product Detail 라우팅 링크 생성
* Product Detail은 Skeleton Layout까지만 구현 (실제 기능은 Sprint 8-3에서 구현)

## 5. Search
* 지원: 상품명, 브랜드, 카테고리
* Debounce 적용 및 React Query 연동

## 6. Filter
* 지원: Grade, Category, Status (Workspace 기준으로 동작)

## 7. Pagination
* Server Pagination만 사용 (Frontend Pagination 금지)
* 지원: Page, Page Size (Cursor Pagination 제외)

## 8. Table Component
* 공통 컴포넌트 생성: Table, Header, Empty State, Loading Skeleton, Badge, Pagination (Component Catalog 준수)

## 9. React Query
* 생성: Dashboard Query, Product Query
* 규칙: Query Key 표준화, staleTime, cacheTime, invalidateQueries, retry 및 refetchOnWindowFocus 정책 수립

## 10. API Service Layer
* 생성: `services/dashboard.service.ts`, `services/product.service.ts`
* Axios Client만 사용 (직접 fetch 사용 금지)

## 11. DTO 및 Type
* 생성: `types/dashboard.ts`, `types/product.ts` (Backend DTO와 100% 동일하게 유지, 임의 수정 금지)

## 12. Global State
* Zustand 사용: UI State(Sidebar, Theme 등)만 허용
* 서버 데이터(Server State) 저장 금지: 서버 데이터는 React Query만 사용

## 13. Route Guard
* 구현: Protected Route, Login Redirect, Unauthorized Redirect, Workspace Validation

## 14. Error Handling
* 구현: Error Boundary, API Error, Forbidden, Unauthorized, NotFound, Network Error (UX Guideline 준수)

## 15. Loading UX
* 구현: Skeleton, Spinner, Suspense, Progressive Loading

## 16. Empty State
* 구현: Dashboard Empty, Product Empty, Search Empty (UX Writing 문서 준수)

## 17. Responsive
* 지원: Desktop, Tablet, Mobile (반응형 규격 준수)

---

# 3. 구현 규칙

* Sprint 8-0 Design Freeze 변경 금지
* Backend API 변경 금지
* Backend 비즈니스 로직 구현 금지
* Hard Coding 금지
* Mock Data 금지
* TypeScript any 금지
* fetch 사용 금지 (Axios Client만 사용)
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
* Server Action 사용을 금지한다.
* Backend API를 우회하여 Database에 직접 접근하지 않는다.
* Backend API Contract를 임의로 변경하지 않는다.
* Request DTO와 Response DTO를 수정하지 않는다.
* Workspace Header 누락을 금지한다.

---

# 4. API 구현 규칙

* 모든 API 호출은 Axios Client를 사용한다.
* fetch 직접 사용을 금지한다.
* API_INTEGRATION_GUIDE.md를 반드시 따른다.
* Query Key 표준 규칙을 적용한다.
* React Query Cache 정책을 준수한다.

---

# 5. Deliverables

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

# 6. Definition of Done

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

# 7. Sprint 종료 및 PM 제출

Sprint 종료 시점에 아래 프로세스를 거쳐 산출물을 패키징한다.

## 프로젝트 검증
반드시 수행하고 결과를 문서들에 수록한다.
* Build 성공
* TypeScript Compile 성공
* ESLint Error 0
* Test 통과
* 프로젝트 정상 실행
* API Response Sample 생성
* 실행 화면 캡처

검증 결과는 REVIEW.md와 PM_REVIEW_PACKAGE.md에 모두 기록한다.

## Evidence 생성
아래 로그 및 증적 파일을 반드시 생성한다.
```text
evidence/
├── build.log
├── eslint.log
├── typescript.log
├── test.log
├── performance.md
└── api-response.json
```
README.md에는 Evidence 확인 방법을 반드시 기술한다.

## 프로젝트 문서 업데이트
최신 Sprint 기준으로 업데이트한다.
* CONTEXT.md
* REVIEW.md
* DECISIONS.md
* walkthrough.md

## 리뷰 문서 생성
아래 리뷰 문서를 필수 작성하여 검토를 지원한다.
* **FRONTEND_REVIEW.md** (목표, 기능, 컴포넌트/훅/스토어 변경 사항)
* **BACKEND_REVIEW.md** (Backend 변경이 없는 경우 반드시 `No Backend Changes` 기입)
* **API_MAPPING_REPORT.md** (Endpoint, DTO, 서비스/쿼리 매핑 및 연동 화면 기입)
* **IMPLEMENTATION_SUMMARY.md** (구현 결과 규모 및 신규 요소 리스팅)
* **ARCHITECTURE_DIFF.md** (아키텍처 대조 차이 분석)
* **API_CHANGELOG.md** (API 변경이 없는 경우 반드시 `No API Changes` 기입)
* **SUBMISSION_MANIFEST.md** (제출물 체크 매니페스트)
* **CHANGELOG.md** (Conventional Commits 기반 변경 로그)

## PM Review Package 생성
`pm_review/` 폴더를 아래 구조로 최신화하여 구성한다.
```text
pm_review/
├── README.md
├── CODE_REVIEW_GUIDE.md
├── PM_REVIEW_PACKAGE.md
├── CONTEXT.md
├── REVIEW.md
├── DECISIONS.md
├── walkthrough.md
├── FRONTEND_REVIEW.md
├── BACKEND_REVIEW.md
├── API_MAPPING_REPORT.md
├── IMPLEMENTATION_SUMMARY.md
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
Design 변경이 없는 Sprint에서는 `design_review.zip` 및 `design_full.zip`을 재생성하지 않는다.

## README.md 작성 규칙
`pm_review/README.md`에는 반드시 아래 내용을 포함한다.
* Sprint 요약
* 제출 파일 설명 및 ZIP 파일 설명
* 검토 순서
* Known Issues
* 프로젝트 실행 방법
* Evidence 확인 방법

---

# 8. PM Review Self Validation

PM Review 요청 전에 반드시 아래 항목을 확인한다.
* Deliverables 완료
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
* Review 문서 생성 완료
* Evidence 생성 완료
* pm_review 폴더 누락 파일 없음

추가로 아래 절차를 반드시 수행한다.
* `implementation_plan.md` 재확인
* Definition of Done 재확인
* PM Review Self Validation 재확인
* 모든 항목 충족 여부를 자체 검토한 후에만 PM Review를 요청한다.

---

# 9. 완료 보고

완료 보고는 반드시 아래 형식을 따른다.
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

---

# 10. 제출

PM에게는 pm_review 폴더 전체를 제출한다.

검토 순서는 아래와 같다.
1. PM_REVIEW_PACKAGE.md
2. REVIEW.md
3. CONTEXT.md
4. backend_code.zip
5. frontend_code.zip
6. database_and_reviews.zip
7. design_review.zip (Design 변경 시)
8. design_full.zip (Design 변경 시)

---

# 11. Sprint 종료 체크리스트

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
* README.md 작성 완료
* Evidence 생성 완료
* build.log 생성
* eslint.log 생성
* typescript.log 생성
* test.log 생성
* performance.md 생성
* api-response.json 생성
* screenshots 생성
* api_samples 생성
* implementation_plan 재검토 완료
* Definition of Done 재검토 완료
* PM Review Self Validation 재검토 완료
* pm_review 폴더 최종 검증 완료
