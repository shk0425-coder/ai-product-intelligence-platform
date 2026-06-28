# Implementation Plan - Phase 8-0 (Final Version 2.1)

# Product Design Sprint & UX Architecture Foundation

## Sprint 목적

Phase 8 Frontend 개발에 앞서 제품(Product)의 UX/UI 기준을 완전히 확정하는 설계 전용 Sprint이다.

코드 구현을 진행하지 않으며, 제품 철학, 사용자 경험, 정보 구조, 디자인 시스템, 사용자 여정, Frontend Architecture를 완성하여 이후 Sprint에서는 설계 변경 없이 구현만 진행할 수 있도록 한다.

본 문서는 Phase 8 전체의 Single Source of Truth가 된다.

---

## AI 모델 규칙

주 모델: Claude Opus 4.x (모든 설계 결정 담당)
보조 모델: Gemini Flash (문서 포맷/표 정리만 허용, UX/IA 설계 결정 금지)

---

## Deliverables (22개 문서 + 1 JSON)

```text
design/
├── PRODUCT_VISION.md
├── PRODUCT_PHILOSOPHY.md
├── COMPETITIVE_UX_RESEARCH.md
├── PERSONA.md
├── USER_JOURNEY.md
├── UX_GUIDELINE.md
├── UI_GUIDELINE.md
├── INFORMATION_ARCHITECTURE.md
├── SCREEN_INVENTORY.md
├── USER_FLOW.md
├── UX_WRITING.md
├── DESIGN_TOKEN.md
├── DESIGN_SYSTEM.md
├── UX_PATTERN.md
├── COMPONENT_CATALOG.md
├── FRONTEND_ARCHITECTURE.md
├── API_INTEGRATION_GUIDE.md
├── USER_TEST_SCENARIO.md
├── DESIGN_DECISION_LOG.md
├── WIREFRAME.md
├── PHASE8_ROADMAP.md
└── tokens/
    └── design-tokens.json
```

---

## Frontend 기술스택

- Next.js App Router + React + TypeScript
- Tailwind CSS + shadcn/ui
- React Query (서버 상태) + Zustand (글로벌 상태)

---

## Phase 8 Design Gate

Sprint 8-1 시작 조건

- Product Vision / UX / IA / Wireframe / Design System / API Mapping / Component System 전체 승인
- Backend Freeze 확인
- PM / CTO 최종 승인
