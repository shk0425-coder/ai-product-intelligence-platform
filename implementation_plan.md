# Sprint 3-2: Authentication Module Implementation Plan (Revised)

Implementation plan to build the Authentication module for the AI Product Intelligence Platform (v0.6.0) using Fastify, TypeScript, bcrypt, JWT, Zod, and Vitest.

## User Review Required

> [!IMPORTANT]
> - Database operations are completely mocked in this sprint using a bcrypt-hashed mock user. DB integration will happen in Sprint 3-3.
> - Password hashing uses `bcrypt` with `12` salt rounds.
> - JWT Access tokens expire in 15 minutes, Refresh tokens expire in 7 days, signed with `HS256`.
> - All new routes, schemas, and controllers are encapsulated in `src/modules/auth/` directory.

### 1. JWT Payload Specification
The token payload is explicitly defined as follows:
```typescript
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
```
This payload is used for both Access Tokens and Refresh Tokens. `request.user` is extended to use this type.

### 2. Refresh Token Policies
- **Reissue Only**: The Refresh Token is strictly used for requesting a new Access Token.
- **Access Control**: The Refresh API (`/api/v1/auth/refresh`) cannot be accessed using an Access Token; it requires a valid Refresh Token.
- **Error Responses**: Any failure during verification of the Refresh Token (invalid signature, expired, etc.) returns a standard `401 Unauthorized` response with code `AUTH_INVALID_TOKEN` or `AUTH_EXPIRED_TOKEN`.

### 3. Mock Repository Interface Design
`src/modules/auth/repository.ts` defines the interface `IAuthRepository` to decouple implementation details:
```typescript
import { User } from './types.js';

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
}

export class MockAuthRepository implements IAuthRepository {
  // Mock implementations containing hashed admin@test.com password
}
```
This enables seamless database replacement in Sprint 3-3.

## Open Questions

None.

## Proposed Changes

We will implement the authentication system step-by-step.

---

### Config & Environment Variables

#### [MODIFY] [.env.example](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/.env.example) / [.env](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/.env)
Add variables:
- `JWT_SECRET`: Secret key for Access Token.
- `JWT_REFRESH_SECRET`: Secret key for Refresh Token.
- `ACCESS_TOKEN_EXPIRES`: Expiry duration for Access Token (default `15m`).
- `REFRESH_TOKEN_EXPIRES`: Expiry duration for Refresh Token (default `7d`).

#### [MODIFY] [env.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/config/env.ts)
Update Zod validation schema for environment variables to require:
- `JWT_SECRET` (string, min length 32)
- `JWT_REFRESH_SECRET` (string, min length 32)
- `ACCESS_TOKEN_EXPIRES` (string, default `15m`)
- `REFRESH_TOKEN_EXPIRES` (string, default `7d`)

---

### Src - Common Error Additions

#### [MODIFY] [errors/index.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/common/errors/index.ts)
Add custom error classes matching requirements:
- `AUTH_INVALID_TOKEN` (mapped to `AuthenticationError` / 401)
- `AUTH_EXPIRED_TOKEN` (mapped to `AuthenticationError` / 401)
- `AUTH_INVALID_CREDENTIALS` (mapped to `AuthenticationError` / 401)
- `AUTH_UNAUTHORIZED` (mapped to `AuthenticationError` / 401)

---

### Src - Utilities

#### [NEW] [jwt.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/utils/jwt.ts)
Exposes token utility functions using `jsonwebtoken` library with explicit types:
- `generateAccessToken(payload: JwtPayload): string`
- `generateRefreshToken(payload: JwtPayload): string`
- `verifyAccessToken(token: string): JwtPayload`
- `verifyRefreshToken(token: string): JwtPayload`

#### [NEW] [password.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/utils/password.ts)
Exposes password hashing utilities with explicit return types:
- `hashPassword(password: string): Promise<string>`
- `comparePassword(password: string, hash: string): Promise<boolean>`

---

### Src - Middlewares

#### [NEW] [auth.middleware.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/middleware/auth.middleware.ts)
Fastify onRequest/preHandler hook:
- Validates the `Authorization: Bearer <token>` header.
- Verifies the signature and expiration of the JWT using `verifyAccessToken`.
- Injects the decoded user payload into `request.user` (typed as `JwtPayload`).

---

### Src - Auth Module

#### [MODIFY] [schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/schema.ts)
Defines validation schemas using Zod:
- `loginSchema`: requires `email` (valid email) and `password` (string).
- `refreshSchema`: requires `refreshToken` (string).

#### [MODIFY] [types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/types.ts)
Defines TypeScript interfaces including:
- `JwtPayload` structure.
- `User` structure representing the database user model.
- Login and refresh request payload interfaces.

#### [MODIFY] [repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/repository.ts)
Defines `IAuthRepository` interface and its mock implementation `MockAuthRepository`. Holds mock database user `admin@test.com` with hashed password.

#### [MODIFY] [service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/service.ts)
Auth Service (injecting `IAuthRepository`):
- `login(email, password)`: validates user, checks credentials, returns Access & Refresh tokens.
- `refresh(token)`: verifies refresh token, issues new access token.
- `logout()`: validates token session removal.

#### [MODIFY] [controller.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/controller.ts)
Auth Controller:
- Maps incoming request bodies, forwards validations, handles controller responses.

#### [MODIFY] [route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/route.ts)
Sub-route definitions under `/api/v1/auth` prefix:
- `POST /login`: executes validation and login.
- `POST /logout`: executes logout.
- `POST /refresh`: executes token refresh (validates refresh token, rejects access token).

---

### Src - Application Routing Registration

#### [MODIFY] [app.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/app.ts)
- Register `authRoutes` under prefix `/api/v1/auth`.
- Register a test endpoint `GET /api/v1/protected` using `auth.middleware.ts` to verify authorization checks.

---

### Src - Unit & Integration Tests

#### [NEW] [auth.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/auth.test.ts)
Integration tests via Vitest:
- Success and failed login scenarios.
- Token refresh validation (success / failure cases).
- JWT utility verification tests.
- Protected Route tests:
  - `GET /api/v1/protected` with valid JWT Access Token (returns 200).
  - `GET /api/v1/protected` without JWT (returns 401).
  - `GET /api/v1/protected` with expired JWT (returns 401).

---

## Verification Plan

### Automated Tests
- Build verification: Run typescript compile check `npm run build`
- Style check: Run ESLint validation `npm run lint`
- Test suite execution: Run unit tests `npx vitest run`

### Manual Verification
- Run local server `npm run dev` and test:
  1. Login API via POST `http://localhost:3000/api/v1/auth/login`
  2. Refresh API via POST `http://localhost:3000/api/v1/auth/refresh`
  3. Validate access control of a route (such as a mock protected route) using JWT headers.
