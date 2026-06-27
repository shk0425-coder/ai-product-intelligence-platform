# Implementation Plan: Sprint 4-5 Dashboard Backend API Integration & Streamlit Refactoring

본 스프린트(4-5)에서는 기존의 단일 거대 스크립트였던 `dashboard.py` 를 백엔드 Fastify API 서버를 소비(Consume)하는 구조로 전면 리팩터링합니다. API Client, Cache, State Wrapper, Service Layer, Component, Page 분할을 포함한 관심사 분리(SoC) 아키텍처를 도입하며, Pytest Statement/Branch/Line/Function 100% 커버리지를 만족하는 테스트 환경을 수립합니다.

---

## Proposed Changes

신규 모듈 및 패키지들을 `dashboard/` 폴더 하위에 생성합니다.

```text
dashboard/
    api/
        client.py
        endpoints.py
    services/
        analysis_service.py
        jtbd_service.py
        strategy_service.py
        creative_service.py
    state/
        session.py
    cache/
        cache.py
    components/
        widgets.py
    pages/
        analysis_page.py
        jtbd_page.py
        strategy_page.py
        creative_page.py
    types/
        __init__.py
    constants/
        constants.py
    utils/
        error_formatter.py
        response_mapper.py
        cache_key.py
```

---

## 1. dashboard/api/

### [NEW] client.py
* `APIClient` 클래스 정의.
* `tenacity` 라이브러리를 활용한 Exponential Backoff Retry (3회) 적용.
* HTTP Status Code (400, 401, 403, 404, 429, 500) 및 Connection/Timeout 예외에 대응하는 커스텀 Exception Class 정의 (`BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `RateLimitError`, `ServerError`, `NetworkError`, `TimeoutError`).
* Bearer Token 인증 헤더 바인딩.

### [NEW] endpoints.py
* `APIEndpoints` 정의: 로그인, 워크스페이스, 크롤링, 분석 결과 조회/요청 경로 중앙 관리.

---

## 2. dashboard/services/

### [NEW] analysis_service.py / jtbd_service.py / strategy_service.py / creative_service.py
* 서비스 클래스 구현: 오직 `APIClient` 만을 사용하여 데이터 통신을 대행하며, 비즈니스 로직을 배제하고 파싱 완료된 DTO 결과만을 리턴.

---

## 3. dashboard/state/

### [NEW] session.py
* `SessionStateManager` 클래스 구현: `st.session_state`로의 직접 접근을 완전히 격리 차단하며, 워크스페이스 ID, 상품 ID, 로딩 상태, 에러 메시지 등을 프로퍼티로 관리.

---

## 4. dashboard/cache/

### [NEW] cache.py
* `DashboardCache` 클래스 구현: 메모리 기반 조회 전용 캐시 기능 제공.
* `constants` 에 정의된 `CACHE_TTL` 적용 및 `workspaceId:productId:analysisId` 조합 캐시 키 제어.

---

## 5. dashboard/components/

### [NEW] widgets.py
* 공통 UI 컴포넌트 렌더러 정의: `render_loading`, `render_error`, `render_empty`, `render_status`, `render_section_header`, `render_storyboard_card`, `render_image_card` 구현.

---

## 6. dashboard/pages/

### [NEW] analysis_page.py / jtbd_page.py / strategy_page.py / creative_page.py
* 각 도메인별 전용 렌더링 뷰 분할. 비즈니스 로직이나 API 직접 호출 없이, 오직 서비스로부터 전달받은 데이터의 조건부 컴포넌트 렌더링만을 담당.

---

## 7. dashboard.py (ROOT)

### [MODIFY] [dashboard.py](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/dashboard.py)
* 사이드바 워크스페이스 및 상품 UUID 입력 UI 바인딩.
* 리팩터링된 서브페이지들로의 🧭 메뉴 이동 탭 라우터 연계 및 기존 네이버 쇼핑 실시간 수집 뷰 하방 호환성 유지.

---

## 8. Verification Plan

### Automated Tests
* `tests/dashboard/test_dashboard_unit.py` 에서 Pytest 테스트 스위트 구동.
* API Client(인증, Retry, 타임아웃, 예외 매핑), Service(DTO 바인딩, 호출 횟수), Cache(Hit, Miss, TTL), State(Getter, Setter, Exception handling), Pages(Mock Service 기반 Success/Error 렌더링 테스트) 26개 케이스 동작 검증.

```bash
PYTHONPATH=. .venv/bin/pytest --cov=dashboard tests/dashboard/test_dashboard_unit.py
.venv/bin/ruff check dashboard/ tests/dashboard/
.venv/bin/mypy dashboard/ tests/dashboard/
```

### Manual Verification
* `streamlit run dashboard.py` 실행 후 사이드바 메뉴 탭 전환 및 버튼 액션 시 Mock/실제 API 로딩/에러/성공 렌더링 모니터링.
