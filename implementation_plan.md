# Sprint 3-3: Workspace API & Supabase Database Integration Implementation Plan

Implementation plan to build the Workspace API and connect to Supabase Database for the AI Product Intelligence Platform (v0.6.0) using Fastify, TypeScript, Supabase, Zod, and Vitest.

## User Review Required

> [!IMPORTANT]
> - All workspace API routes (`/api/v1/workspaces`) require authentication via `authMiddleware` and use `request.user.userId`.
> - BaseRepository is introduced to decouple Supabase queries and allow reusability across all future domains.
> - Transaction handling and Audit Logging are stubbed using TODO comments as requested.

## Open Questions

> [!WARNING]
> ### `workspaces` Table Schema Mismatch vs. Soft Delete Requirement
> - **The Issue**: The DDL in `database/migrations/03_tables.sql` and the specification in `database_architecture.md` define `workspaces` without a `deleted_at` column. However, the Sprint 3-3 instructions state: **"Soft Delete 정책 적용: deleted_at NULL -> 활성, NOT NULL -> 삭제"** and **"DDL DDL 수정은 금지한다 (DDL modification is forbidden)"**.
> - **Proposed Solutions**:
>   - **Option A (Recommended)**: Allow a minor DDL migration extension to add `deleted_at TIMESTAMPTZ NULL` to the `workspaces` table so that database-level soft delete can function correctly.
>   - **Option B**: Simulate soft delete entirely at the application/mock level, which will not align with database queries.
>   - *Please advise on how to proceed.*

---

## Proposed Changes

We will implement the workspace module under `src/modules/workspace/`.

---

### Src - Common Error Additions

#### [MODIFY] [errors/index.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/common/errors/index.ts)
Add custom error classes:
- `WORKSPACE_NOT_FOUND` (404)
- `WORKSPACE_ALREADY_EXISTS` (409)
- `WORKSPACE_FORBIDDEN` (403)

---

### Src - Base Repository

#### [NEW] [base.repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/repositories/interfaces/base.repository.ts)
Interface declaration for reusable database operations:
```typescript
export interface PaginationOptions {
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
```

#### [NEW] [base.repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/repositories/implementations/base.repository.ts)
Supabase concrete implementation of `IBaseRepository<T>`.

---

### Src - Workspace Module

#### [NEW] [types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/types.ts)
Defines:
- `Workspace` database entity interface matching DDL.
- `IWorkspaceRepository` extending `IBaseRepository<Workspace>`.

#### [NEW] [dto.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/dto.ts)
Defines DTO structures:
- `CreateWorkspaceDto`
- `UpdateWorkspaceDto`
- `WorkspaceResponseDto`
- Mapping helpers: `toResponseDto(entity: Workspace): WorkspaceResponseDto`

#### [NEW] [schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/schema.ts)
Zod schemas:
- `createWorkspaceSchema`: name (trimmed, 2-50 chars).
- `updateWorkspaceSchema`: name (trimmed, 2-50 chars).
- `workspaceIdParamSchema`: id (valid UUID).
- `workspaceQuerySchema`: page, limit, sort, order.

#### [NEW] [repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/repository.ts)
Workspace repository:
- `WorkspaceRepository` extends `BaseRepository<Workspace>` implements `IWorkspaceRepository`.
- Exposes `findByName(name: string)` and `findAll(ownerId: string, options: PaginationOptions)`.

#### [NEW] [service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/service.ts)
Workspace Service:
- `create(dto, userId)`: checks unique workspace name, creates workspace. Includes Audit Hook TODO comments and Transaction TODO structure.
- `findAll(userId, options)`: fetches paginated workspaces.
- `findById(id)`: fetches workspace by ID.
- `update(id, dto, userId)`: checks owner matches userId (Owner verification), modifies name.
- `delete(id, userId)`: checks owner matches userId, executes soft delete.

#### [NEW] [controller.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/controller.ts)
Workspace Controller:
- Processes input payloads, enforces DTO responses.

#### [NEW] [route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/workspace/route.ts)
Sub-route registration:
- `POST /`
- `GET /`
- `GET /:id`
- `PATCH /:id`
- `DELETE /:id`
Enforces `authMiddleware` across all routes.

---

### Src - Application Route Registration

#### [MODIFY] [app.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/app.ts)
Register workspace routes under `/api/v1/workspaces`.

---

### Src - Unit & Integration Tests

#### [NEW] [workspace.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/workspace.test.ts)
Integration tests via Vitest:
- Create workspace successfully.
- Get workspaces (pagination verification).
- Get workspace by ID.
- Update workspace successfully (owner check).
- Update workspace failure (non-owner).
- Delete workspace (soft delete verification).
- Delete workspace failure (non-owner).
- Duplicate workspace name prevention.
- UUID validation checks on parameters.

---

## Verification Plan

### Automated Tests
- Build verification: Run typescript compile check `npm run build`
- Style check: Run ESLint validation `npm run lint`
- Test suite execution: Run unit tests `npx vitest run`

### Manual Verification
- Run local server `npm run dev` and test:
  1. POST `http://localhost:3000/api/v1/workspaces`
  2. GET `http://localhost:3000/api/v1/workspaces`
  3. PATCH `http://localhost:3000/api/v1/workspaces/:id`
  4. DELETE `http://localhost:3000/api/v1/workspaces/:id`
