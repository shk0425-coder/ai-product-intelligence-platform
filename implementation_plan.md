# Sprint 3-4: Sprint 3-3 Reviews Refinement & Market Domain Foundation

Implementation plan for refining common database query structures and establishing the Market Domain API foundation in the AI Product Intelligence Platform (v0.6.0).

## User Review Required

> [!IMPORTANT]
> - **Soft Delete Refinement**: `BaseRepository.update()` and `delete()` will now append `.is('deleted_at', null)` to enforce that soft-deleted rows cannot be updated or re-deleted.
> - **Database Constraint Check**: Duplicate checks on Workspace creation will catch database SQLSTATE `23505` constraints and map them to business error codes.
> - **Pagination Limits & Sorting Whitelist**: Max pagination page (100,000) and limit (100) are enforced in Zod. Sort columns are strictly validated via Zod enum whitelist.
> - **Market Domain (Read-Only)**: Only `GET /api/v1/markets` and `GET /api/v1/markets/:id` will be implemented. Mutation routes are out of scope.

---

## Proposed Changes

We will apply modifications to the common layer and establish the Market module under `src/modules/market/`.

---

### Src - Common Error Additions

#### [MODIFY] [errors/index.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/common/errors/index.ts)
Add custom error classes:
- `MARKET_NOT_FOUND` (404)
- `MARKET_FORBIDDEN` (403)

---

### Src - Base Repository Refinement

#### [MODIFY] [base.repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/repositories/implementations/base.repository.ts)
- Update `update(id, data)` to include `.is('deleted_at', null)`.
- Update `delete(id)` to include `.is('deleted_at', null)`.

---

### Src - Workspace Module Refinements

#### [MODIFY] [schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/schema.ts)
Enforce pagination boundaries and whitelist sorting columns via Zod:
```typescript
export const workspaceQuerySchema = z.object({
  page: z.coerce.number().int().positive().max(100000).default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.enum(['created_at', 'updated_at', 'name']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});
```

#### [MODIFY] [service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/service.ts)
Wrap `repository.create` in a try-catch to detect database constraint violation error code `23505` and map it to `WorkspaceAlreadyExistsError`.

---

### Src - Market Migration

#### [NEW] [29_add_market_deleted_at.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/29_add_market_deleted_at.sql)
Add `deleted_at` soft delete column to `market_metrics`:
```sql
ALTER TABLE market_metrics
ADD COLUMN deleted_at TIMESTAMPTZ NULL;

COMMENT ON COLUMN market_metrics.deleted_at IS '소프트 딜리트 삭제 처리 일시';
```

---

### Src - Market Module

#### [NEW] [types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/types.ts)
Defines:
- `MarketMetric` database entity interface matching `market_metrics` DDL.
- `IMarketRepository` extending `IBaseRepository<MarketMetric>`.

#### [NEW] [dto.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/dto.ts)
Defines:
- `MarketResponseDto`
- Mapping helpers: `toResponseDto(entity: MarketMetric): MarketResponseDto`

#### [NEW] [schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/schema.ts)
Zod schemas:
- `marketIdParamSchema`: id (valid UUID).
- `marketQuerySchema`: page (max 100,000), limit (max 100), sort whitelisted columns (`total_monthly_search`, `trend_slope`, `seasonality_classification`), order (`asc`, `desc`).

#### [NEW] [repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/repository.ts)
Market repository:
- `MarketRepository` extends `BaseRepository<MarketMetric>` implements `IMarketRepository`.
- Exposes:
  - `findByIdWithOwner(id: string, ownerId: string): Promise<MarketMetric | null>`
  - `findAllByOwner(ownerId: string, options: PaginationOptions): Promise<PaginatedResult<MarketMetric>>`

#### [NEW] [service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/service.ts)
Market Service:
- `findAll(userId, options)`: fetches paginated market metrics belonging to workspaces owned by the user.
- `findById(id, userId)`: fetches single market metric, verifying ownership.

#### [NEW] [controller.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/controller.ts)
Market Controller:
- Processes queries, maps entities to DTO responses.

#### [NEW] [route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/market/route.ts)
Routes registration:
- `GET /`
- `GET /:id`
Binds `authMiddleware` hook.

---

### Src - Application Route Registration

#### [MODIFY] [app.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/app.ts)
Register market routes under `/api/v1/markets`.

---

### Src - Unit & Integration Tests

#### [NEW] [market.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/market.test.ts)
Integration tests via Vitest:
- Get markets (pagination validation, sort whitelist checking, pagination limit verification).
- Get market by ID (UUID check, existence check, owner verification, soft-delete filtering).

---

## Verification Plan

### Automated Tests
- Build verification: Run typescript compile check `npm run build`
- Style check: Run ESLint validation `npm run lint`
- Test suite execution: Run unit tests `npx vitest run`

### Manual Verification
- Run local server `npm run dev` and test:
  1. GET `http://localhost:3000/api/v1/markets`
  2. GET `http://localhost:3000/api/v1/markets/:id`
