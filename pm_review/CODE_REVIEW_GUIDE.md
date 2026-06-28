# CODE_REVIEW_GUIDE.md (코드 리뷰 가이드 - Sprint 8-0)

본 문서는 **Sprint 8-0 (Product Design Sprint & UX Architecture Foundation)** 완료 후, PM(Project Manager)이 설계 산출물 및 아키텍처 정의 구조를 신속하게 검토할 수 있도록 돕는 안내서입니다.

---

## 1. 변경 파일 목록 (Code Files)

> [!NOTE]
> **Zero-Code 설계 스프린트**: 본 스프린트는 UI/UX 디자인 사양 수립 및 프론트엔드 아키텍처 설계를 전담하는 설계 전용 스프린트이므로, **백엔드/프론트엔드 개발 소스코드의 직접적인 수정이나 생성은 없습니다.**

---

## 2. 파일별 변경 요약
* **해당 사항 없음** (코드 변경이 수반되지 않은 설계 전용 스프린트입니다).

---

## 3. 신규 API (Designed Spec)
실제 백엔드 서버에 라우트가 신규 등록되지는 않았으나, 향후 구현할 API 연동 규격을 [design/API_INTEGRATION_GUIDE.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/design/API_INTEGRATION_GUIDE.md)에 사전 설계 완료하였습니다.
* **설계된 주요 API 연동**:
  - `POST /api/v1/auth/login` (인증 세션 획득)
  - `POST /api/v1/reviews/analyze` (리뷰 수집 및 Job 등록)
  - `GET /api/v1/reviews/products/:productId/analysis` (JTBD 분석 데이터 조회)
  - `POST /api/v1/production/products/:productId/strategy` (기획안 생성/승인 대기)
  - `POST /api/v1/performance` (판매 성과 업서트 및 closed-loop 학습 트리거)

---

## 4. Database 변경
* **Migration**: 해당 사항 없음.
* **Table**: 변경 없음 (기존 42개 스키마 마이그레이션이 동결 상태 유지됨).

---

## 5. 리뷰 우선순위 (설계 산출물 기준)

★★★★★ 반드시 검토 (핵심 설계)
* [INFORMATION_ARCHITECTURE.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/design/INFORMATION_ARCHITECTURE.md) (메뉴 계층도 및 라우팅 구조)
* [API_INTEGRATION_GUIDE.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/design/API_INTEGRATION_GUIDE.md) (동결 백엔드 API와의 프론트엔드 매핑 명세)
* [SCREEN_INVENTORY.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/design/SCREEN_INVENTORY.md) (각 화면 구성요소 및 인터랙티브 상태 정의)

★★★★☆ (구현 표준)
* [FRONTEND_ARCHITECTURE.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/design/FRONTEND_ARCHITECTURE.md) (Zustand 상태 관리 및 React Query 캐싱 전략)
* [design-tokens.json](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/design/tokens/design-tokens.json) (Tailwind 연동용 시각 스타일 JSON 토큰)
* [WIREFRAME.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/design/WIREFRAME.md) (홈, 기획 타임라인, 소싱 계산기 와이어프레임 구조)

★★★☆☆ (가이드라인)
* [UX_GUIDELINE.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/design/UX_GUIDELINE.md) (점진적 정보 노출 및 비동기 상태 가이드라인)
* [UX_WRITING.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/design/UX_WRITING.md) (화면 레이블 및 에러/성공 템플릿 카피라이팅 규칙)
* [PHASE8_ROADMAP.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/design/PHASE8_ROADMAP.md) (스프린트 8-1 ~ 8-5 구현 마일스톤)

---

## 6. 테스트 결과
* **TypeScript 컴파일 및 린트**: 백엔드 및 도구 전반에 걸쳐 `npm run build` 및 `npm run lint` 100% 정상 통과 및 ESLint 오류 0건 확인 완료.
