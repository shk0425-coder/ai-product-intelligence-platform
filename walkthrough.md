# Sprint 3-4 Walkthrough

This document outlines the accomplishments, directory structure, dependencies, and test results for **Sprint 3-4: Sprint 3-3 개선사항 반영 및 Market Domain 기반 구축**.

## Changes Implemented

### 1. Refinements (from Sprint 3-3 Review Feedback)
- **[implementations/base.repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/repositories/implementations/base.repository.ts)**:
  - Added `.is('deleted_at', null)` to `update()` and `delete()` operations to enforce that soft-deleted entities are immutable and cannot be re-deleted.
- **[workspace/schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/schema.ts)**:
  - Enforced pagination bounds: `page` max 100,000, `limit` max 100.
  - Whitelisted sort columns using Zod enum: `created_at`, `updated_at`, `name`.
- **[workspace/service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/service.ts)**:
  - Wrapped `repository.create` in try-catch to parse database Unique Constraint violation error code `23505` and map it to `WorkspaceAlreadyExistsError`.

### 2. Market Migration
- **[database/migrations/29_add_market_deleted_at.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/29_add_market_deleted_at.sql)**: Adds the `deleted_at` TIMESTAMPTZ column to `market_metrics` table for soft delete support.

### 3. Market Module (Read-Only)
- **[types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/types.ts)**: Defines `MarketMetric` database entity model mapping and repository interface `IMarketRepository`.
- **[dto.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/dto.ts)**: Defines `MarketResponseDto` and typed mappers.
- **[schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/schema.ts)**: Declares Zod schemas whitelisting sort columns (`total_monthly_search`, `trend_slope`, `seasonality_classification`) and pagination boundaries.
- **[repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/repository.ts)**: Extends `BaseRepository<MarketMetric>` and implements relational joins (`market_metrics` -> `analysis_runs` -> `products` -> `workspaces` -> `org_id`) to filter records owned by the current user.
- **[service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/service.ts)**: Implements read-only queries with owner validation.
- **[controller.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/controller.ts)**: Processes query inputs, maps responses to DTO structures.
- **[route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/route.ts)**: Registers `GET /` and `GET /:id` routes with `authMiddleware` and validation schemas.

### 4. Route Registration
- **[app.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/app.ts)**: Registered `marketRoutes` under prefix `/api/v1/markets`.

---

## Verification Results

### 1. TypeScript Strict Compile Check
Ran `npm run build` to confirm compiler compiles successfully without warnings.
```bash
> tsc
```
Status: **PASSED**

### 2. ESLint Code Lint Check
Ran `npm run lint` and confirmed there are 0 style or parsing errors (2 warnings only for startup console logging).
```bash
> eslint src
```
Status: **PASSED**

### 3. Unit Test Suite Execution
Ran Vitest test execution suite:
```bash
$ npx vitest run
```
Output:
```text
 ✓ tests/health.test.ts  (1 test) 58ms
 ✓ tests/auth.test.ts  (12 tests) 1586ms
 ✓ tests/workspace.test.ts  (14 tests) 150ms
 ✓ tests/market.test.ts  (7 tests) 88ms

 Test Files  4 passed (4)
      Tests  34 passed (34)
```
Status: **PASSED**
