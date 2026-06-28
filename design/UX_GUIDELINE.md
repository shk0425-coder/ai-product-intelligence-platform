# UX_GUIDELINE.md

# 핵심 UX 가이드라인 (UX Guideline)

본 문서는 **AI Product Intelligence Platform**의 제품 철학인 **"도구가 아닌 동료(AI Assistant)"**를 화면 설계와 인터랙션으로 구현하기 위한 핵심 UX 원칙을 규정한다.

---

## 1. 3대 핵심 UX 원칙

### 원칙 1: 점진적 정보 노출 (Progressive Disclosure)
* **정의**: 사용자가 처음 접하는 화면에는 가장 중요하고 직관적인 결론(요약)만 보여주고, 상세 데이터는 클릭이나 토글을 통해 확장해 나갈 수 있도록 구성한다.
* **적용**:
  - **As-Is**: 8단계 상세페이지 기획안의 모든 본문과 이미지 프롬프트를 한 화면에 무조건 다 적재하여 스크롤 압박 유발.
  - **To-Be**: 스토리보드 각 단계의 **'제목'**과 **'AI 핵심 권고 요약'**만 피드로 보여주고, 상세 문구 및 연동 프롬프트는 아코디언 토글 클릭 시 하단으로 슬라이드 다운 렌더링.

### 원칙 2: 투명한 피드백과 대기 시간 케어 (Progressive Loading State)
* **정의**: AI 가동, 크롤링 등 시간이 걸리는 비동기 작업 시 사용자가 불안을 느끼지 않도록 현재 작업의 상세 현황과 남은 시간을 명확히 전달한다.
* **적용**:
  - 단순 로딩 스피너(Spinner) 사용 금지.
  - 다단계 프로그레스 바(Multi-step progress bar)를 적용하고, 현재 스텝명을 명시한다: `네이버 쇼핑 평점 1점 리뷰 수집 중 (45%)` ➡️ `Gemini 결핍 분류 연동 중` ➡️ `S~D 등급 계산 중` ➡️ `완료`.

### 원칙 3: 테넌트 격리 및 안전성 인지 (Tenant Isolation Visibility)
* **정의**: 다중 워크스페이스 환경에서 사용자가 자신이 어느 컨텍스트(조직)에 있는지 항상 명확히 인식하게 하고, 권한 외 작업 시 안전한 거부 메시지를 제공한다.
* **적용**:
  - 화면 상단 GNB 영역에 현재 소속된 `워크스페이스 명`과 `구독 플랜 등급(Starter, Enterprise)`을 배지 형태로 상시 노출.
  - 중요 삭제/설정 변경 시, 단순 경고 모달이 아닌 "워크스페이스 명을 입력하세요" 등의 2차 안전 장치(Confirmation Guard) 적용.

---

## 2. 상태별 UX 인터랙션 표준 (State Interaction Standards)

| UI 상태 | UX 처리 기준 | 권장 요소 (UI Component) |
|:---|:---|:---|
| **최초 진입 (Empty State)** | 사용자가 방황하지 않도록 Primary Action 버튼을 중앙에 크게 노출하고, 튜토리얼 가이드 카드 연계. | Centered Welcome Card + Core CTA Button |
| **데이터 로딩 (Loading State)** | 픽셀이 갑자기 튀는 현상을 막기 위해 실제 컨텐츠 형태와 동일한 스켈레톤(Skeleton) 레이아웃 적용. | Shimmer CSS Skeleton Grid |
| **작업 에러 (Error State)** | 기술적인 에러 코드(예: "500 Internal Server Error")를 날것으로 노출하지 않고, 사용자 조치법(예: "재시도") 제안. | Illustrative Dialog + Retry Button |
| **성공 알림 (Success State)** | 화면 전체를 덮는 성공 확인 창을 배제하고, 우측 상단 토스트(Toast) 메시지나 숏 애니메이션 배지 적용. | Toast Notification (Auto-dismiss in 3s) |
