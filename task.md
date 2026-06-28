# Task List - Sprint 8-1 (Version 1.0)

## [ ] 1. Frontend 프로젝트 생성 및 설정
- [ ] Next.js 14 App Router 프로젝트 생성 및 종속성 패키지 설치
- [ ] ESLint, Prettier, Husky, lint-staged 설정 구성

## [ ] 2. 프로젝트 디렉터리 구조 수립
- [ ] `frontend/src/` 아래 `app`, `components`, `features`, `hooks`, `layouts`, `lib`, `providers`, `services`, `stores`, `styles`, `types`, `utils` 구조화

## [ ] 3. 글로벌 상태 및 Axios 클라이언트 구축
- [ ] Zustand 스토어 (`AuthStore`, `WorkspaceStore`, `UiStore`) 구현
- [ ] Axios Client 및 Interceptor 작성 (JWT HttpOnly Cookie, Retry, Error Handling)

## [ ] 4. Providers 및 Root Layout 구성
- [ ] Theme, React Query, Auth, Workspace, Toast Providers 구현
- [ ] Root Layout (`app/layout.tsx`)에 Providers 및 전역 스타일 등록

## [ ] 5. Authentication 기능 구현
- [ ] 로그인, 로그아웃, 세션 복원, 토큰 갱신, 미인증 리다이렉션 흐름 구현

## [ ] 6. Workspace 연동 및 Context 구현
- [ ] 워크스페이스 목록 조회, 선택, 컨텍스트 스위칭 연동

## [ ] 7. 공통 레이아웃 및 라우팅 페이지 구성
- [ ] Sidebar, Header, Content Layout 컴포넌트 개발 (디자인 프리즈 준수)
- [ ] `/`, `/login`, `/dashboard`, `/workspace`, `/settings` 라우트 페이지 뼈대 생성

## [ ] 8. 예외 및 환경 설정 구성
- [ ] Loading, Error, NotFound, Suspense 처리 페이지 구현
- [ ] `.env.example` 및 환경변수 설정 구성

## [ ] 9. 검증 및 문서 갱신
- [ ] 전체 빌드, TypeScript 컴파일, ESLint 검사 수행
- [ ] CONTEXT.md, REVIEW.md, DECISIONS.md, walkthrough.md 최신화
- [ ] PM_REVIEW_PACKAGE.md 생성 및 pm_review 패키지 압축 빌드
