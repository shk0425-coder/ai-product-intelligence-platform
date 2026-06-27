# REVIEW.md (Sprint 3-3 Workspace API & Supabase DB Integration Review)

본 문서는 **Sprint 3-3 (Workspace API & Supabase DB 연동)** 완료 후, **ChatGPT (Project Manager)**의 코드 리뷰와 승인을 지원하기 위해 작성된 스프린트 리뷰 보고서입니다.

---

## 1. Sprint 정보
* **Sprint 번호**: Sprint 3-3
* **대상 작업**: Workspace API & Supabase DB 연동 (CRUD, BaseRepository, Soft Delete, DTO, Pagination)
* **Commit Message**: `feat(workspace): implement workspace module`

---

## 2. 구현 내용
* **BaseRepository 구현**: Supabase Client 기반의 공통 데이터베이스 연산(`findById`, `create`, `update`, `delete`, `exists`, `findAll`)을 추상화하여, 향후 다른 도메인(Market, Review 등)에서 코드 재사용이 용이하도록 상속 구조를 적용하였습니다.
* **Workspace CRUD**: 작업 공간의 등록, 조회(단건/목록), 수정(이름), 삭제(소프트 딜리트) 기능을 완비했습니다.
* **Owner 검증 강화**: Workspace는 멀티테넌트 최상위 리소스이므로 단건 조회(`GET /:id`), 수정(`PATCH /:id`), 삭제(`DELETE /:id`) 시에 로그인한 유저(`request.user.userId`)가 해당 Workspace의 Owner(`org_id`)와 일치하는지 철저하게 검증합니다.
* **DTO 적용**: Controller 계층은 Entity를 직접 반환하지 않고, `WorkspaceResponseDto`를 사용하여 클라이언트에게 필요한 필드만 직렬화하고 스네이크 케이스를 카멜 케이스 구조로 정제하여 제공합니다.
* **Zod UUID & Body Validation**: 파라미터 `:id`에 대한 UUID 규격 검사 및 생성/수정 요청 시 Zod Schema Validation을 적용하고 위반 시 규격화된 400 Validation Error 구조를 응답하도록 바인딩하였습니다.
* **Soft Delete 정책**: 삭제 시 DB 로우를 실제로 제거하지 않고 `deleted_at` 컬럼에 타임스탬프를 기입하며, 기본 조회 시 `deleted_at IS NULL` 조건만 필터링하도록 구현하였습니다.
* **Pagination 공통화**: 목록 조회(`GET /`) API 호출 시 `page`, `limit`, `sort`, `order` 쿼리 파라미터를 통해 페이징 처리를 수행하며, BaseRepository 수준에서 `PaginatedResult<T>` 규격으로 감싸서 리턴합니다.
* **Supabase Error Mapping**: Unique Constraint 위반(예: 동일 워크스페이스 명 중복) 등의 DB 에러 코드를 감지하여 `WORKSPACE_ALREADY_EXISTS` 등 비즈니스 예외 예러로 정밀 매핑해 대응합니다.
* **비동기 Hook 및 Transaction stubs**: 비즈니스 확장성을 고려해 트랜잭션 흐름 구조(TODO)와 감사 로그용 stubs(TODO) 주석을 서비스 레이어에 설계 반영했습니다.

---

## 3. 변경 파일
* **데이터베이스 마이그레이션**:
  * [28_add_workspace_deleted_at.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/28_add_workspace_deleted_at.sql): `workspaces` 테이블에 `deleted_at` 컬럼 추가 마이그레이션
* **공통 레이어 & 베이스 리포지토리**:
  * [errors/index.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/common/errors/index.ts): `WORKSPACE_NOT_FOUND`, `WORKSPACE_ALREADY_EXISTS`, `WORKSPACE_FORBIDDEN` 커스텀 에러 정의 추가
  * [base.repository.ts (Interface)](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/repositories/interfaces/base.repository.ts): `IBaseRepository`, `PaginationOptions`, `PaginatedResult` 정의
  * [base.repository.ts (Implementation)](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/repositories/implementations/base.repository.ts): Supabase postgREST 기반 공통 DB 쿼리 구현체 작성
* **Workspace 모듈**:
  * [types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/types.ts): Entity 모델 및 `IWorkspaceRepository` 규격 정의
  * [dto.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/dto.ts): `CreateWorkspaceDto`, `UpdateWorkspaceDto`, `WorkspaceResponseDto` 및 DTO 변환 헬퍼 정의
  * [schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/schema.ts): Zod 파라미터 및 바디 검증 스키마 선언
  * [repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/repository.ts): `BaseRepository<Workspace>`를 확장하고 중복명칭 조회 및 소유자 워크스페이스 페이징 목록 쿼리 추가
  * [service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/service.ts): 소유주 검증 논리식, 소프트 딜리트 기입 지시, 예외 매핑, 트랜잭션/감사로그 stubs 배치
  * [controller.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/controller.ts): 요청 핸들러 바인딩 및 성공 규격 응답 매핑
  * [route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/route.ts): `/api/v1/workspaces` 경로 세부 등록 및 Zod 미들웨어 탑재
* **애플리케이션 연동 및 테스트**:
  * [app.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/app.ts): workspaceRoutes 모듈을 API 라우터에 바인딩
  * [workspace.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/workspace.test.ts): Workspace 생성, 페이징 조회, 단건 조회, 소유자 검증 통과/차단(조회, 수정, 삭제), 중복 확인, UUID 규격 검사 실패 등 14개 통합 검증 시나리오 작성

---

## 4. 테스트 결과
Vitest를 활용하여 신규 작성된 14개 통합 테스트를 포함한 총 27개 케이스가 모두 정상 통과되었습니다.
```text
 ✓ tests/health.test.ts  (1 test) 58ms
 ✓ tests/auth.test.ts  (12 tests) 1586ms
 ✓ tests/workspace.test.ts  (14 tests) 150ms

 Test Files  3 passed (3)
      Tests  27 passed (27)
```

---

## 5. Self Review
* [x] **Workspace CRUD 완성**: Workspace 등록, 목록 조회, 단건 조회, 수정, 삭제 처리 전체 구현 성공.
* [x] **Supabase Repository 연동**: BaseRepository와 상속체를 이용하여 PostgREST로 원활히 연동되도록 구현 완료.
* [x] **JWT 인증 연동**: 모든 워크스페이스 엔드포인트에 `authMiddleware`가 적용되어 유효 토큰 및 `request.user`가 주입되는 환경 확인.
* [x] **Owner 검증 성공 및 타인 차단**: 조회, 수정, 삭제 전 경로에 대해 소유자(`org_id`)와 호출자 ID 일치성을 점검하여 타인의 조작 및 불법 정보 유출 차단 검증.
* [x] **Pagination 및 DTO 매핑**: 목록 요청 시 페이징 쿼리가 정상 주입되며 응답 DTO 규격으로 필터링되어 반환됨을 확인.
* [x] **Soft Delete 적용**: 삭제 시 `deleted_at`이 업데이트되고, 조회 시 쿼리 조건 `deleted_at IS NULL`이 자동으로 필터링됨을 확인.
* [x] **Zod Validation**: path parameter `:id`가 UUID 형식이 아닐 시 또는 바디 필드 규칙 위반 시 400 Validation Error가 표준 응답으로 반환됨을 확인.
* [x] **ESLint / TypeScript 오류 없음**: Strict 모드 내에서 빌드 100% 컴파일 성공 및 style 린터 경고를 모두 해소하여 0개 에러 통과 확인.

---

## 6. Known Issues
```text
None
```
