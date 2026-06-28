# FRONTEND_ARCHITECTURE.md

# 프론트엔드 아키텍처 정의서 (Frontend Architecture)

본 문서는 **AI Product Intelligence Platform** 프론트엔드 어플리케이션(Next.js App Router 기반)의 구조, 디렉터리 구성 정책, 상태 관리 모델 및 데이터 캐싱 전략을 정의한다.

---

## 1. 디렉터리 구조 표준 (Folder Structure)

프론트엔드는 관심사 분리(SoC)와 shadcn/ui 연동 규격을 충족하기 위해 아래 구조를 고수한다.

```text
src/
├── app/                      # Next.js App Router (Layout, Page, Loading, Error)
│   ├── (auth)/               # 비로그인 영역 (login, signup)
│   ├── (dashboard)/          # 로그인 워크스페이스 대시보드 영역
│   │   ├── page.tsx          # 홈 포털 대시보드
│   │   ├── products/         # 상품 기획 센터
│   │   ├── operations/       # 운영 Governance 센터
│   │   └── settings/         # 개인 설정 및 요약 사용량
│   ├── layout.tsx            # 전역 Root Layout
│   └── providers.tsx         # 전역 Providers (QueryClient, Theme, Toast)
│
├── components/               # 재사용 UI 컴포넌트
│   ├── ui/                   # shadcn/ui 기본 컴포넌트 (원형 유지)
│   ├── common/               # Sidebar, Header, Footer 등 레이아웃 컴포넌트
│   └── dashboard/            # QuotaProgress, GradeBadge 등 도메인 특화 위젯
│
├── hooks/                    # 커스텀 React Hooks (useAuth, useActiveWorkspace 등)
│
├── lib/                      # 핵심 유틸리티 및 설정
│   ├── api-client.ts         # Axios/Fetch API 래퍼 (JWT, Interceptor, ErrorFormatter)
│   └── utils.ts              # Tailwind merge (clsx + tailwind-merge)
│
├── store/                    # Zustand 전역 상태 저장소
│   ├── useWorkspaceStore.ts  # 활성 워크스페이스 상태 관리
│   └── useUiStore.ts         # 사이드바 토글, 모달 전역 오픈 상태
│
└── types/                    # TypeScript 전역 타입 선언 (.d.ts 및 DTO interface)
```

---

## 2. 상태 관리 아키텍처 (State Management)

### 2.1. 글로벌 클라이언트 상태 (Zustand)
* **목적**: 브라우저 메모리에 유지되는 전역 상태(선택된 워크스페이스 ID, 사이드바 개폐 여부, 사용자 정보 등)를 통제한다.
* **원칙**:
  - 데이터베이스 동기화가 필요한 비즈니스 데이터는 Zustand에 넣지 않고 React Query에서 전담한다.
  - 전역 스토어는 원자적(Atomic)으로 쪼개어 불필요한 리렌더링을 억제한다.

### 2.2. 서버 상태 및 캐싱 (React Query / @tanstack/react-query)
* **목적**: 백엔드 REST API 데이터의 패칭, 캐싱, 동기화를 수행한다.
* **설정 규칙**:
  - `staleTime`: 기본 30초 (`30000ms`). 잦은 렌더링에 의한 중복 GET 호출 차단.
  - `gcTime` (구 cacheTime): 기본 5분 (`300000ms`).
  - **Mutation Flow**: POST/PUT/DELETE 성공 시, 반드시 관련 쿼리 키를 무효화(`queryClient.invalidateQueries`)하여 화면 데이터의 100% 실시간 신선도를 보장한다.
    - 예: `POST /api/products/analyze` 성공 ➡️ `['products']` 쿼리 무효화 실행.

---

## 3. API 통신 계층 (API Client Wrapper)

* **Axios 인스턴스 구축**: `lib/api-client.ts`에 일원화하여 설정한다.
* **보안 헤더**: Request Interceptor를 통해 로컬 스토리지에 보관된 JWT 토큰을 `Authorization: Bearer <Token>` 헤더에 자동으로 주입한다.
* **네트워크 실패 대응 (Resilience)**:
  - 백엔드 Redis CB 정책과 맞추어, API Gateway 실패 시 UI 레벨에서 지수 대기 재시도(Exponential Backoff)를 수행하도록 React Query 클라이언트에 기본 탑재한다.
