# PHASE8_ROADMAP.md

# Phase 8 구현 로드맵 (Phase 8 Implementation Roadmap)

본 문서는 Phase 8-0 설계 단계 완료 후 진행될 **Phase 8-1 ~ 8-5** 프론트엔드 연동 개발 스프린트의 마일스톤과 주차별 마감 조건을 기술한다.

---

## 1. 스프린트 일정 및 목표 (Sprint Milestones)

```text
[Sprint 8-0: 설계] ➡️ [Sprint 8-1: 골격] ➡️ [Sprint 8-2: 기획] ➡️ [Sprint 8-3: 성과] ➡️ [Sprint 8-4: 거버넌스] ➡️ [Sprint 8-5: 통합]
```

### 1.1. Sprint 8-1: Next.js 골격 및 Auth/Workspace 연동 (Scaffolding & Auth)
* **목표**: 프론트엔드 기본 구조를 수립하고 로그인 및 테넌트 분리 스위처를 연동한다.
* **주요 인도물**: Next.js 프로젝트 생성, Tailwind/Design Token 이식, API Client(Axios) 연동, 로그인 화면 및 워크스페이스 목록 구현.
* **마감 조건**: 이메일 로그인 후 토큰이 정상 저장되고, 권한이 있는 워크스페이스 리스트가 헤더 스위처에 자동 출력될 것.

### 1.2. Sprint 8-2: 상품 시장 분석 및 JTBD/스토리보드 화면 (Market & AI Storyboard)
* **목표**: 키워드 크롤러 구동 피드백 및 8단계 기획 스토리보드 전개 뷰를 완성한다.
* **주요 인도물**: 신규 수집 마법사 위저드, JTBD 결핍 분류 카드 그리드, 8단계 아코디언 피드, FLUX 이미지 시안 라이트박스 팝업.
* **마감 조건**: 분석 진행률이 SSE로 갱신되고, 완료 시 자동으로 스토리보드가 렌더링되며, 승인 버튼 클릭 시 이미지 API를 트리거할 것.

### 1.3. Sprint 8-3: 성과 등록 및 Closed-Loop 학습 연계 (Performance & Feedback)
* **목표**: 실제 출시 상품의 실적 피드백을 기록하고 학습 피드백 엔진을 트리거한다.
* **주요 인도물**: 실적 동기화 모달 폼, 성공 패턴 피드백 보드, 가중치 학습 로그 뷰.
* **마감 조건**: 실적 데이터 입력 즉시 PL/pgSQL RPC가 실행되고, 가중치 재계산 후 "학습 완료" 토스트 알림이 정확히 출력될 것.

### 1.4. Sprint 8-4: Operations 감사 및 Resilience 모니터링 (Ops Governance & Resilience)
* **목표**: 중앙 감사 센터와 탄력성/Circuit Breaker 관리자 도구를 탑재한다.
* **주요 인도물**: 감사 로그 타임라인 및 필터링 검색 바, CSV/JSON 다운로더, Resilience 회복 대시보드(DLQ 수동 재처리 버튼).
* **마감 조건**: Warning/Critical 감사 내역이 정확히 테이블로 출력되고, CSV 다운로드가 작동하며, 유지보수 모드 토글 시 쓰기 요청이 차단될 것.

### 1.5. Sprint 8-5: 통합 배포 검증 및 예외 테스트 (Hardening & Delivery)
* **목표**: 전 기능 통합 테스트를 수행하고 예외 복구 시나리오를 최종 검증하여 배포한다.
* **주요 인도물**: 종합 테스트 시나리오 수행 결과 리포트, LightHouse 웹 최적화 점수 리포트, 배포 파일.
* **마감 조건**: LightHouse 사용성/접근성 90점 이상 달성, JWT 만료 시 자동 로그아웃 및 토큰 갱신 기능 정상 작동 완료.
