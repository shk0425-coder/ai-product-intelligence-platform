# Sprint 3-1: Backend Scaffolding & Infrastructure Implementation Plan

Implementation plan to build the backend scaffolding and infrastructure for the AI Product Intelligence Platform (v0.6.0) using Fastify, TypeScript, Supabase, Zod, and Pino.

## User Review Required

> [!IMPORTANT]
> The backend will be configured with TypeScript in strict mode, Fastify, and a modular architecture. In this sprint, **no business logic will be implemented**. The focus is solely on laying down a solid foundation.

## Open Questions

None.

## Proposed Changes

We will create a new directory `backend/` and set up the project files.

---

### Project Scaffolding & Config

#### [NEW] [package.json](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/package.json)
Configures dependencies, devDependencies, and npm scripts (`dev`, `build`, `start`, `lint`, `format`, `test`).

#### [NEW] [tsconfig.json](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tsconfig.json)
TypeScript configuration enabling strict mode and absolute path aliases.

#### [NEW] [eslint.config.js](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/eslint.config.js) / [.prettierrc](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/.prettierrc)
ESLint and Prettier code style check and formatting rules.

#### [NEW] [.env.example](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/.env.example)
Example environment variable template.

---

### Src - Configuration & Core Files

#### [NEW] [server.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/server.ts)
Entry point to bootstrap and run the Fastify server.

#### [NEW] [app.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/app.ts)
Creates and configures the Fastify instance, registers plugins, routes, global error handlers, and hooks/middlewares.

#### [NEW] [env.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/config/env.ts)
Loads `.env` via `dotenv` and validates environment variables using `zod`. Exits process on validation failure.

#### [NEW] [logger.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/config/logger.ts)
Pino logger configuration with `pino-pretty` enabled for development.

#### [NEW] [supabase.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/config/supabase.ts)
Singleton client definition for interacting with Supabase.

---

### Src - Plugins & Middleware

#### [NEW] [supabase.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/plugins/supabase.ts)
Registers the Supabase client as a Fastify plugin so it is available globally under `fastify.supabase`.

#### [NEW] [cors.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/plugins/cors.ts)
Configures and registers `@fastify/cors` plugin.

#### [NEW] [logger.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/plugins/logger.ts)
Custom logger plugin registering hooks for logging request lifecycle.

#### [NEW] [request-id.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/middleware/request-id.ts)
Assigns a unique request ID to each incoming request.

#### [NEW] [request-time.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/middleware/request-time.ts)
Tracks the start time of requests to calculate total processing duration.

#### [NEW] [logging.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/middleware/logging.ts)
Logs HTTP request details (method, URL, status, duration).

#### [NEW] [error-handler.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/middleware/error-handler.ts)
Global Fastify error handler wrapping errors (Validation, Database, Auth, Unknown) into the unified response format.

---

### Src - Routes & Modules

#### [NEW] [health.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/routes/health.ts)
Exposes `GET /health` with `{"success": true, "data": {"status": "ok"}}` response format.

---

### Docker & Infrastructure

#### [NEW] [Dockerfile](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/docker/Dockerfile) / [docker-compose.yml](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/docker/docker-compose.yml) / [.dockerignore](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/docker/.dockerignore)
Development docker setup using Node.js 22, mounting source volume, running with hot reload (`tsx watch`).

---

## Verification Plan

### DDL & Integration Check
- Verify that environmental variable loading fails correctly when variables are missing.
- Check typescript compilation status and package manager build/lint commands.

### API Health Check
- Run local development server and hit `GET /health` to confirm standard success response format.

### Docker Development Environment
- Spin up docker-compose and verify that Fastify runs, logs requests, and registers hot reloading on file change.
