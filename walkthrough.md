# Sprint 3-6 Walkthrough

This document outlines the accomplishments, directory structure, dependencies, and test results for **Sprint 3-6: Review Intelligence Pipeline & First Provider Integration**.

## Changes Implemented

### 1. Extensible Review Provider Framework
- **[modules/review/types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/types.ts)**:
  - Formulated pluggable interfaces `IReviewProvider` and `CrawlRequest` supporting future channels (Naver, Coupang, Amazon, AliExpress).
- **[modules/scraper/providers/naver-review.provider.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/scraper/providers/naver-review.provider.ts)**:
  - Implemented the first real review provider utilizing Naver Smartstore public JSON endpoint fetching.
  - Deployed connection robustness with 10-second `AbortController` timeouts, 3 retries, and exponential backoff (1s, 2s, 4s) on HTTP 429/403 and timeout errors.

### 2. Standard Review DTO & Mapper
- **[modules/review/mapper.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/mapper.ts)**:
  - Implemented `ReviewMapper` to safely translate raw provider payloads to standard `ReviewDto` structures.
  - Added default value logic for null/missing properties (`rating` to 0, `helpfulCount` to 0, etc.) and populated metadata dictionary.
  - Implemented deterministic UUID v5-like generator to uniquely identify reviews based on `provider`, `productId` and `reviewId`, ensuring collision-based duplicate detection.

### 3. Review Repository
- **[modules/review/repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/repository.ts)**:
  - Configured repository targeting frozen `customer_reviews` database schema.
  - Dynamically fetches an existing database `run_id` to satisfy foreign key constraints.
  - Implemented bulk insert with `ON CONFLICT (review_id, collected_at) DO NOTHING` via Supabase `upsert` and returns computed `insertedCount`, `duplicateCount`, and `failedCount`.

### 4. Crawl API & Routing
- **[modules/review/schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/schema.ts)**:
  - Zod validation enforcing provider selection (`'naver'`) and trimmed keyword validation.
- **[modules/review/route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/review/route.ts)**:
  - Mounted Crawl API under `/api/v1/reviews/crawl`.
- **[app.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/app.ts)**:
  - Mounted review routes under the standard `/api/v1/reviews` path.

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
 ✓ tests/auth.test.ts  (12 tests) 1621ms
 ✓ tests/workspace.test.ts  (14 tests) 150ms
 ✓ tests/market.test.ts  (7 tests) 88ms
 ✓ tests/market-mutation.test.ts  (12 tests) 190ms
 ✓ tests/review-pipeline.test.ts  (11 tests) 2269ms

 Test Files  6 passed (6)
      Tests  57 passed (57)
```
Status: **PASSED**
