# Sprint 3-2 Walkthrough

This document outlines the accomplishments, directory structure, dependencies, and test results for **Sprint 3-2: Authentication Module 구축**.

## Changes Implemented

We created the User Authentication module inside the `backend/` directory:

### 1. Project Configuration & Dependencies
- **[package.json](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/package.json)**: Added `jsonwebtoken`, `bcrypt` dependencies and `@types/jsonwebtoken`, `@types/bcrypt` devDependencies.
- **[.env.example](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/.env.example)** / **[.env](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/.env)**: Set secrets and token expiry definitions (`JWT_SECRET`, `JWT_REFRESH_SECRET`, `ACCESS_TOKEN_EXPIRES`, `REFRESH_TOKEN_EXPIRES`).
- **[env.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/config/env.ts)**: Configured Zod variables validation to throw descriptive errors if parameters are invalid/short.
- **[errors/index.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/common/errors/index.ts)**: Declared `AUTH_INVALID_TOKEN`, `AUTH_EXPIRED_TOKEN`, `AUTH_INVALID_CREDENTIALS`, and `AUTH_UNAUTHORIZED` errors.
- **[.gitignore](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/.gitignore)**: New backend gitignore to exclude `node_modules/`, local secrets, and compiled `dist/` artifacts.

### 2. Authentication Utilities
- **[src/utils/jwt.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/utils/jwt.ts)**: Defines the `TokenProvider` interface to decouple token signatures from core libraries, and implements `JwtTokenProvider` using `jsonwebtoken` with strict type definitions.
- **[src/utils/password.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/utils/password.ts)**: Defines typed hashing and comparison functions via `bcrypt`.

### 3. Middleware & Routes
- **[src/middleware/auth.middleware.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/middleware/auth.middleware.ts)**: Authorization header parser and token verification hook. Exposes a preHandler hook.
- **[src/app.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/app.ts)**: Registers subroutes under `/api/v1/auth` and registers `/api/v1/protected` mock endpoint to test middleware protection.

### 4. Auth Module Structure
- **[types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/types.ts)**: Declares typed `JwtPayload`, `UserRole` enum (`ADMIN`, `MANAGER`, `USER`), and Fastify Request extensions.
- **[schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/schema.ts)**: Login and token refresh Zod validation schemas.
- **[repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/repository.ts)**: Declares the decoupled `IAuthRepository` interface and its mock implementation `MockAuthRepository` (with mock `admin@test.com` details).
- **[service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/service.ts)**: Performs credential checking, JWT generation, and token refresh verification logic.
- **[controller.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/controller.ts)**: Maps routes to services and returns standard JSON payloads.
- **[route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/route.ts)**: Defines `/login`, `/logout`, `/refresh` routes.

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
 ✓ tests/auth.test.ts  (12 tests) 1605ms

 Test Files  2 passed (2)
      Tests  13 passed (13)
```
Status: **PASSED**
