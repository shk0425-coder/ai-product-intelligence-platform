# API_INTEGRATION_GUIDE.md

# API 연동 가이드 및 명세서 (API Integration Guide)

본 문서는 프론트엔드 UI 화면과 백엔드 REST API 엔드포인트 간의 매핑 명세를 정의한다. 모든 API 요청과 응답의 기본 접두사(API Prefix)는 `/api/v1`이다.

---

## 1. 인증 및 워크스페이스 관리 (Auth & Workspace)

### 1.1. 로그인 및 세션 관리
* **화면**: 로그인 페이지 (`/login`)
* **API 엔드포인트**: `POST /api/v1/auth/login`
* **요청 본문 (Payload)**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
* **응답 결과**: JWT 토큰 및 사용자 정보 반환.

### 1.2. 워크스페이스 스위칭
* **화면**: 전역 GNB 워크스페이스 드롭다운
* **API 엔드포인트**: `GET /api/v1/workspaces` (소속 목록 조회), `POST /api/v1/workspaces` (새 워크스페이스 생성).

---

## 2. 상품 기획 센터 (Product Planning Center)

### 2.1. 시장성 분석 및 리뷰 크롤링 실행
* **화면**: 신규 분석 실행 페이지 (`/products/new`)
* **API 엔드포인트**: `POST /api/v1/reviews/analyze`
* **요청 본문**:
  ```json
  {
    "workspaceId": "uuid-workspace",
    "keyword": "세척 용이 텀블러",
    "targetReviewCount": 200
  }
  ```
* **동작**: 백그라운드 Job 스케줄링 후 Job ID 반환. 이후 `GET /api/v1/jobs/:id`를 폴링(Polling)하거나 SSE 채널을 구독하여 실시간 상태 업데이트 수신.

### 2.2. JTBD 결핍 인사이트 조회
* **화면**: 분석 리포트 상세 페이지 (`/products/[id]/analysis`)
* **API 엔드포인트**: `GET /api/v1/reviews/products/:productId/analysis`
* **응답 형태**: 수집 리뷰 통계, 긍/부정 비율, 분류된 JTBD 핵심 요인 및 개별 가중치 데이터.

### 2.3. AI 기획 스토리보드 조회 및 승인
* **화면**: 기획 스토리보드 페이지 (`/products/[id]/strategy`)
* **스토리보드 조회**: `GET /api/v1/production/products/:productId/strategy`
* **기획안 생성 요청**: `POST /api/v1/production/products/:productId/strategy` (Status: `WAITING_APPROVAL`)
* **기획안 승인 완료**: `POST /api/v1/approvals/:approvalId/approve` 또는 `POST /api/v1/production/products/:productId/approve`
  - *참고*: 승인 완료 시 FLUX 이미지 생성이 자동으로 트리거됨.

### 2.4. 출시 상품 성과 기록 및 학습 루프 연계
* **화면**: 성과 분석 및 피드백 페이지 (`/products/[id]/performance`)
* **성과 등록 (Upsert)**: `POST /api/v1/performance`
* **학습 피드백 갱신**: `POST /api/v1/learning/trigger` (성과 데이터를 Closed-loop Learning 엔진에 피딩하여 가중치 갱신).

---

## 3. 운영 및 시스템 모니터링 (Operations & Telemetry)

### 3.1. 보안 감사 로그 조회 및 다운로드
* **화면**: 감사 페이지 (`/operations/audit`)
* **로그 필터 검색**: `POST /api/v1/operations/audit/search`
* **로그 내보내기**: `GET /api/v1/operations/audit/export?format=csv`

### 3.2. Quota 한도 및 실시간 사용량 게이트
* **화면**: 설정/한도 페이지 (`/settings`)
* **API 엔드포인트**: `GET /api/v1/operations/dashboard`
* **반환 항목**: 워크스페이스별 실시간 호출 횟수, 잔여 Quota, 리미트 도달 경고 플래그.

### 3.3. 시스템 기능 활성 정보 (Capability Registry)
* **화면**: 전역 UI 렌더링 검사기
* **API 엔드포인트**: `GET /api/v1/system/capabilities` (SaaS 플랜 라이선스에 따라 활성화 또는 비활성화해야 하는 프론트엔드 기능 명세를 JSON 구조로 제공).
