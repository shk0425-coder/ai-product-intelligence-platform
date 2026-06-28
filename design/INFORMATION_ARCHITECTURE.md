# INFORMATION_ARCHITECTURE.md

# 정보 구조 (Information Architecture)

본 문서는 **AI Product Intelligence Platform**의 정보 구조를 정의한다. 사용자 메뉴 계층도(Site Map), URL 라우팅 체계, 그리고 백엔드 데이터베이스 엔티티 매핑 정보를 기술하여 프론트엔드의 네비게이션 구조의 뼈대를 형성한다.

---

## 1. 사용자 메뉴 계층도 (Site Map)

글로벌 네비게이션 바(GNB)는 5개의 대메뉴로 구성되며, 각 메뉴 하위에 상세 모듈 화면이 매핑된다.

```text
[Root Portal]
├── 1. 홈 대시보드 (/)
│   ├── 요약 지표 (Workspace Status, Quota Gauge)
│   ├── 실시간 알림 피드 (Incidents, Operations Log)
│   └── 퀵 액션 카드 (시장 분석 시작, 기획안 승인)
│
├── 2. 상품 기획 센터 (/products)
│   ├── 상품 목록 및 상태 그리드 (/products)
│   ├── 신규 상품 소싱 검색 및 카테고리 매핑 (/products/new)
│   └── 개별 상품 상세 대시보드 (/products/[productId])
│       ├── 시장성 분석 & JTBD 결핍 조회 (/products/[productId]/analysis)
│       ├── AI 8단계 스토리보드 & 크리에이티브 시안 (/products/[productId]/strategy)
│       └── 성과 지표 & Closed-Loop 학습 환류 (/products/[productId]/performance)
│
├── 3. 운영 Governance 센터 (/operations) (매니저/대표 전용)
│   ├── 중앙 감사 감사 추적 리스트 (/operations/audit)
│   ├── 복구 자동화 및 Circuit Breaker 모니터 (/operations/resilience)
│   └── Dynamic 설정 & Capability Registry 제어 (/operations/config)
│
├── 4. 워크스페이스 관리 (/workspaces)
│   ├── 워크스페이스 목록 및 생성 (/workspaces)
│   └── 테넌트 격리 진단 & 리포트 (/workspaces/isolation)
│
└── 5. 설정 및 플랜 (/settings)
    ├── 개인 프로필 및 비밀번호 변경 (/settings/profile)
    └── 요약 사용량 & Quota 임계치 관리 (/settings/quota)
```

---

## 2. URL 라우팅 체계 (Routing Table)

Next.js App Router 규격에 기반한 폴더 구조 및 파일 라우팅 정의서이다.

| URL 경로 | 파일 시스템 경로 (Next.js) | 접근 권한 | 연동 백엔드 모듈 |
|:---|:---|:---|:---|
| `/` | `app/page.tsx` | All Users | workspace, quota, audit |
| `/login` | `app/login/page.tsx` | Anonymous | auth |
| `/workspaces` | `app/workspaces/page.tsx` | All Users | workspace |
| `/workspaces/isolation` | `app/workspaces/isolation/page.tsx` | Manager | operations (isolation-auditor) |
| `/products` | `app/products/page.tsx` | All Users | review, product-strategy |
| `/products/new` | `app/products/new/page.tsx` | All Users | scraper, review, market |
| `/products/[id]` | `app/products/[id]/page.tsx` | All Users | product-strategy, performance |
| `/products/[id]/analysis` | `app/products/[id]/analysis/page.tsx` | All Users | jtbd, review, market |
| `/products/[id]/strategy` | `app/products/[id]/strategy/page.tsx` | All Users | product-strategy, creative |
| `/products/[id]/performance`| `app/products/[id]/performance/page.tsx` | All Users | performance, closed-loop-learning |
| `/operations/audit` | `app/operations/audit/page.tsx` | Admin / Manager | audit |
| `/operations/resilience` | `app/operations/resilience/page.tsx` | Admin / Manager | operations (resilience, lock) |
| `/operations/config` | `app/operations/config/page.tsx` | Admin | operations (capability, config) |
| `/settings` | `app/settings/page.tsx` | All Users | workspace, quota |

---

## 3. 데이터베이스 매핑 가이드 (Database Entity Alignment)

각 화면에서 사용하는 주요 UI 컴포넌트와 매핑되는 백엔드 PostgreSQL (Supabase) 테이블 정보이다.

### 3.1. 상품 기획 센터 매핑
* **상품 목록 / 상세**: `products` 테이블.
* **시장성 분석 & JTBD**: `review_analyses` (리뷰 개수, 긍정 비율 등), `jtbd_insights` (고객 결핍 문장, 가중치) 테이블.
* **기획 스토리보드**: `product_strategies` (8단계 스토리보드 JSONB), `creative_briefs` (썸네일 프롬프트, AI 이미지 URL) 테이블.
* **성과 및 피드백 환류**: `product_performances` (매출, 평점), `performance_audit_logs` (학습 로그) 테이블.

### 3.2. Governance & Operations 매핑
* **감사 로그**: `audit_logs` 테이블 (UUID, actor_id, workspace_id, severity, action, change_summary).
* **Quota & 사용량**: `workspace_quotas` (임계 한도), `usage_metering` (실시간 API 호출 횟수) 테이블.
* **설정 및 기능 활성**: `dynamic_configurations` (런타임 JSON), `capability_registries` (기능 플래그 목록) 테이블.
