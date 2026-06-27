# REVIEW.md (Sprint 3-2 Authentication Module Review)

본 문서는 **Sprint 3-2 (Authentication Module 구축)** 완료 후, **ChatGPT (Project Manager)**의 코드 리뷰와 승인을 지원하기 위해 자동으로 생성된 스프린트 리뷰 요약서입니다.

---

## 1. Sprint 정보
* **Sprint 번호**: Sprint 3-2
* **대상 작업**: Authentication Module 구축 (로그인, 로그아웃, 토큰 재발급, JWT 미들웨어, 유닛 테스트)
* **Commit Message**: `feat(auth): implement authentication module`

---

## 2. 구현 내용
* **JWT Token Provider 추상화**: `jsonwebtoken` 라이브러리에 직접 결합되지 않도록 `TokenProvider` 인터페이스를 수립하고, `JwtTokenProvider` 구현체가 이를 따르도록 설계했습니다. 향후 Clerk, Auth0 등으로 교체 시 서비스 레이어 수정 없이 주입만 교체 가능합니다.
* **사용자 패스워드 암호화**: `bcrypt` (12 Salt Rounds) 유틸리티를 적용하여 암호 비밀번호를 안전하게 해싱 및 비교합니다.
* **계정 데이터 모델 & 역할군(Role) 반영**: `UserRole` Enum (`ADMIN`, `MANAGER`, `USER`)을 추가하고 `JwtPayload` 구조에 바인딩하여 향후 역할 기반 접근 제어(RBAC) 확장의 기틀을 마련했습니다.
* **Mock User Repository**: DB 없이 구동 가능한 독립형 `MockAuthRepository`를 설계하여, Sprint 3-3 실제 DB 연동 저장소 교체 시 충돌이 나지 않도록 인터페이스(`IAuthRepository`)로 분격 격리하였습니다.
* **Zod 검증 정책**: 로그인 및 토큰 리프레시 요청 시 Zod 스키마 검증 훅을 Fastify 라우터와 연동하여 400 Validation Error가 규격 응답 포맷으로 발생하도록 제어하였습니다.
* **토큰 재발급 제한**: Refresh Token은 오직 Access Token 재발급 용도로만 활용할 수 있도록 하고, 일반 Access Token을 전달한 오용 호출 시 즉시 401 Unauthorized 코드를 반환하게 강제했습니다.
* **경로 권한 보호**: `auth.middleware.ts`를 구현하여 Authorization Bearer 토큰의 유무 및 서명/만료를 체크하고 `request.user`를 채워 넣는 공통 검증기(preHandler hook)를 제공합니다.

---

## 3. 변경 파일
* **설정 및 환경**:
  * [package.json](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/package.json): `jsonwebtoken`, `bcrypt` 및 관련 타입 종속성 추가
  * [.env.example](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/.env.example) / [.env](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/.env): JWT access/refresh secret 및 만료 시간 환경변수 적재
  * [.gitignore](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/.gitignore): `node_modules/`, `dist/`, `.env` 등을 Git 추적에서 제외
  * [env.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/config/env.ts): 새로운 JWT 환경변수들의 Zod 타입 검증 조건 추가
  * [errors/index.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/common/errors/index.ts): `AUTH_INVALID_TOKEN`, `AUTH_EXPIRED_TOKEN`, `AUTH_INVALID_CREDENTIALS`, `AUTH_UNAUTHORIZED`에 매칭되는 예외 클래스 추가
* **유틸리티 및 미들웨어**:
  * [jwt.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/utils/jwt.ts): `TokenProvider` 인터페이스 및 `JwtTokenProvider` 구현체 작성
  * [password.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/utils/password.ts): bcrypt 비밀번호 해싱 및 매칭 함수 정의
  * [auth.middleware.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/middleware/auth.middleware.ts): 공통 HTTP Bearer 토큰 검사 미들웨어 훅 구축
* **Auth 모듈**:
  * [types.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/types.ts): `UserRole` Enum, `JwtPayload`, `User` 인터페이스 및 FastifyRequest user 데코레이션 정의
  * [schema.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/schema.ts): 로그인 및 토큰 리프레시 Zod 검증 스키마
  * [repository.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/repository.ts): `IAuthRepository` 및 Mock 구현체 작성 (admin@test.com 계정 내장)
  * [service.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/service.ts): 비즈니스 로그인, 갱신 및 로그아웃 메서드 정의
  * [controller.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/controller.ts): 요청 수용 및 성공 포맷 응답
  * [route.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/modules/auth/route.ts): `/api/v1/auth` 세부 라우팅 및 검증 바인딩
* **애플리케이션 연동 및 테스트**:
  * [app.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/src/app.ts): authRoutes 모듈 등록 및 `/api/v1/protected` 테스트 전용 보호 경로 생성
  * [auth.test.ts](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/backend/tests/auth.test.ts): 로그인 성공/실패, 토큰 리프레시 재발급/오용 차단, JWT 유틸 서명/만료, 미들웨어 인증 무결성 테스트 추가

---

## 4. 테스트 결과
Vitest를 활용하여 13개 통합 테스트 케이스가 무결하게 통과함을 성공적으로 확인했습니다.
```text
 ✓ tests/health.test.ts  (1 test) 58ms
 ✓ tests/auth.test.ts  (12 tests) 1605ms

 Test Files  2 passed (2)
      Tests  13 passed (13)
```

---

## 5. Self Review
* [x] **비밀번호 평문 저장 금지**: bcrypt를 이용해 `admin@test.com`의 패스워드를 `$2b$12$...` 해시로 가공 적재했습니다.
* [x] **JWT Secret 하드코딩 금지**: 모든 토큰 서명 키와 만료시간 설정은 Zod가 파싱/검증하는 환경 변수 파일(`.env`)로부터 로드됩니다.
* [x] **모듈식 캡슐화**: 인증에 연관된 모든 제어기, 서비스, 스키마, 라우팅 정보가 `src/modules/auth/` 내부에 온전히 집적되어 있습니다.
* [x] **ESLint / TypeScript 오류 없음**: TS Strict 모드 하에서 정상적으로 빌드 완료 및 린트 검사 0개 오류 상태를 통과하였습니다.

---

## 6. Known Issues
```text
None
```
