# AI Product Intelligence Platform: Core Specification v3.0

---

## 1. Mission Statement (플랫폼 철학)

> **"고객의 문제를 가장 먼저 발견하고, 그 문제를 가장 잘 해결하는 상품을 설계하며, 실제 판매 데이터를 통해 스스로 더 똑똑해지는 AI Product Intelligence Platform을 구축한다."**

---

## 2. Core System Architecture: Dual-Pipeline 설계

본 플랫폼은 현재 작동 중인 **상품 키워드 중심(Keyword-Driven) 파이프라인**을 지원함과 동시에, 장기적으로 확장될 **문제 중심(Problem-Driven) 파이프라인**을 통합 수용할 수 있는 추상화 인터페이스를 제공하도록 설계되었습니다.

```mermaid
flowchart TD
    %% 1. 문제 중심 입력 버퍼
    subgraph Problem_Driven [Problem-Driven Pipeline (Future)]
        P1[고객의 결핍/불편 상황 입력] --> P2[AI JTBD 분석기]
        P2 --> P3[문제 해결형 상품 카테고리 후보 추천]
    end

    %% 2. 상품 중심 입력 버퍼
    subgraph Keyword_Driven [Keyword-Driven Pipeline (Current)]
        K1[상품 키워드 입력] --> K2[시장 데이터 수집 및 색인]
    end

    %% 3. 통합 매핑 레이어
    P3 -->|분석할 핵심 키워드로 변환| K2

    %% 4. 코어 분석 엔진
    K2 --> S1[STAGE 1: Demand & Context Intelligence]
    S1 --> S2[STAGE 2: Competitor & Barrier Intelligence]
    S2 --> S3[STAGE 3: JTBD & Pain Point Intelligence]
    S3 --> S4[STAGE 4: Source Intelligence]
    S4 --> S5[STAGE 5: Profit & Margin Optimization]
    
    %% 5. 등급 평가 및 전략 생성
    S5 --> G{Evaluation Engine}
    G -->|D등급 보류/금지| Reject[C/D 등급 기획 중단]
    G -->|S/A/B등급 통과| S6[STAGE 6: Product Strategy Generator]

    %% 6. 실제 비즈니스 및 학습 루프
    S6 --> Launch[상품 출시 및 판매 채널 등록]
    Launch --> Loop[Learning Loop Engine]
    Loop -->|평가 가중치 피드백| G
```

---

## 3. 6-Stage Core Engine Specification

각 분석 단계는 향후 데이터베이스 테이블 및 REST API 스키마 설계를 위해 **Input Data Package**, **Analysis Logic**, **Output Data Package**, **Decision & Score Matrix**로 구체화하여 정의합니다.

---

### STAGE 1. Demand & Context Intelligence (시장 수요 및 탐색 인텔리전스)
* **목적**: 입력된 키워드/문제 카테고리에 대해 충분한 잠재 고객 규모와 검색 트렌드가 작동하는지 정량적으로 검증합니다.
* **Input Data Package**
  ```json
  {
    "input_keyword": "string (예: 차량용선풍기)",
    "target_period_months": "integer (기본값: 12)",
    "raw_search_volume": {
      "monthly_pc_search": "integer",
      "monthly_mobile_search": "integer"
    },
    "monthly_trend_indices": "array of float [0.0 - 100.0]"
  }
  ```
* **Analysis Logic**
  1. 최근 1년 총 검색량의 단순 평균 및 모바일 편중 비율(Mobile Ratio) 계산.
  2. 최소 제곱법(Least Squares Method)을 활용한 12개월 트렌드 선형 추세선 기울기($\beta$) 연산 (우상향/정체/우하향 판별).
* **Output Data Package**
  ```json
  {
    "stage_status": "string (SUCCESS | FAIL)",
    "metrics": {
      "total_monthly_search": "integer",
      "trend_direction": "string (UPWARD | FLAT | DOWNWARD)",
      "trend_slope": "float",
      "seasonality_factor": "string (HIGH | MEDIUM | LOW)"
    }
  }
  ```
* **Decision Rule (Score: Max 100)**
  - $Score = (TotalSearch / 10000 \times 40) + (TrendFactor \times 40) + (SeasonalityFactor \times 20)$
  - **Threshold**: 점수 50점 이상 시 STAGE 2로 전이. 50점 미만 시 D등급(진입 금지) 부여 검토.

---

### STAGE 2. Competitor & Barrier Intelligence (경쟁 및 장벽 인텔리전스)
* **목적**: 대기업의 독점 상태 및 상위권 판매처들의 신뢰도 장벽을 파악하여 신규 브랜드의 침투 가능 영역을 도출합니다.
* **Input Data Package**
  ```json
  {
    "top_products": [
      {
        "rank": "integer",
        "brand_name": "string",
        "mall_type": "string (스마트스토어 | 브랜드스토어 | 오픈마켓 | 대형몰)",
        "review_count": "integer",
        "registration_date": "date"
      }
    ]
  }
  ```
* **Analysis Logic**
  1. 상위 15개 상품 중 메이저 브랜드 점유율 산출.
  2. 등록 기간 180일 미만 상품의 Top 15 진입 개수를 추적하여 '신규 진입 역동성(Market Fluidity)' 연산.
* **Output Data Package**
  ```json
  {
    "brand_dominance_ratio": "float (0.0 - 1.0)",
    "market_fluidity_score": "integer (0 - 100)",
    "average_review_barrier": "integer",
    "barrier_classification": "string (ULTRA_HIGH | HIGH | MEDIUM | LOW)"
  }
  ```
* **Decision Rule**
  - **Threshold**: 대기업 독점 비중 70% 이상이고 신규 진입 개수가 0개일 경우, 시장 폐쇄형 장벽으로 판단하여 등급 감점 요인으로 반영.

---

### STAGE 3. JTBD & Pain Point Intelligence (고객 과업 및 결핍 분석)
* **목적**: 고객의 사용 상황적 맥락(Context)을 매핑하고, 기존 대안 제품에 만족하지 못하는 구체적인 과업적 결핍(Unmet Needs)을 모델링합니다.
* **Input Data Package**
  ```json
  {
    "competitor_negative_reviews": [
      {
        "product_id": "string",
        "rating": "integer (1-3)",
        "review_text": "string",
        "date": "date"
      }
    ]
  }
  ```
* **Analysis Logic**
  1. 부정 리뷰 텍스트를 대상 상황적(Context), 기능적(Functional), 정서적(Emotional) 불만으로 분류하는 다중 라벨링(Multi-labeling) LLM 기법 적용.
  2. 불편 빈도가 가장 높게 집계된 3대 결핍 상황을 JTBD 구조로 공식화.
* **Output Data Package (`jtbd_profile`)**
  ```json
  {
    "context": "string (고객이 직면한 물리적/시간적 정황)",
    "job_to_be_done": "string (해결하려는 실질적 핵심 과업)",
    "target_persona": {
      "demographic_profile": "string",
      "core_values": "array of string"
    },
    "usage_scenario": "array of string (단계별 사용 흐름)",
    "purchase_trigger": "string (기존 대안을 포기하게 만드는 결정적 시점)",
    "emotional_outcome": "string (해결 시 느끼는 정서적 보상)",
    "core_pain_points": [
      {
        "category": "string",
        "frequency_ratio": "float",
        "severity": "string (HIGH | MEDIUM)"
      }
    ]
  }
  ```

---

### STAGE 4. Source Intelligence (소싱 및 규제 인텔리전스)
* **목적**: 기획된 결핍 해결형 제품의 물리적 공급 가능 여부, 제조 조건, 인증 규제 및 특허 위험을 조기에 탐지합니다.
* **Input Data Package**
  ```json
  {
    "candidate_sourcing_platforms": ["1688", "Alibaba", "Domestic_Consignment"],
    "sourcing_keyword": "string (중국어/영어 소싱 키워드)"
  }
  ```
* **Analysis Logic**
  1. 해외/국내 소싱처의 평균 단가, 최소 주문 수량(MOQ), 맞춤형 로고/디자인 제작(OEM/ODM) 지원 여부 크롤링 및 분석.
  2. 통관 및 유통을 위한 전기안전/어린이제품 등 필수 안전인증(KC) 요구사항 식별.
  3. 국내 등록된 디자인권 및 실용신안/특허 분쟁 소지가 다분한 구조적 디자인 특성 스크리닝.
* **Output Data Package (`sourcing_intelligence`)**
  ```json
  {
    "recommended_platform": "string",
    "base_cost_usd": "float",
    "minimum_order_quantity": "integer",
    "oem_availability": "boolean",
    "regulatory_requirements": {
      "kc_certification_needed": "boolean",
      "certification_type": "string (안전인증 | 안전확인 | 공급자적합성확인)",
      "estimated_cert_cost": "integer"
    },
    "risk_factors": {
      "patent_infringement_risk": "string (HIGH | MEDIUM | LOW)",
      "supply_chain_stability": "string (STABLE | VOLATILE)"
    }
  }
  ```

---

### STAGE 5. Profit & Margin Optimization (마진 및 가격 최적화)
* **목적**: 소싱원가, 규제/인증비용, 물류 배송비 및 플랫폼 수수료를 기초로 비즈니스 지속성을 보장하는 최적의 마진 테이블을 계산합니다.
* **Input Data Package**
  ```json
  {
    "market_average_price": "integer",
    "sourcing_cost": "integer",
    "kc_certification_amortized_cost": "integer",
    "shipping_and_handling_fee": "integer",
    "sales_channel_commission_rate": "float"
  }
  ```
* **Analysis Logic**
  1. $NetMargin = ProposedPrice - (SourcingCost + ShippingFee + (ProposedPrice \times CommissionRate))$ 수식 기반 시뮬레이션.
  2. 목표 순마진율(Target Margin %) 충족도 및 광고 집행 한계 비용(Break-Even ROAS) 자동 산출.
* **Output Data Package (`margin_optimization`)**
  ```json
  {
    "proposed_retail_price": "integer",
    "estimated_net_margin_ratio": "float (0.0 - 1.0)",
    "break_even_roas": "float (percentage)",
    "target_cpa": "integer (목표 신규고객 획득비용)",
    "margin_grade": "string (EXCELLENT | GOOD | POOR)"
  }
  ```

---

### STAGE 6. Product Strategy Generator (제품 전략 생성기)
* **목적**: S/A/B 등급을 부여받아 시장 가치가 입증된 제품에 대해 즉시 비즈니스 실행이 가능한 세부 상품화 전략 및 크리에이티브 시나리오를 설계합니다.
* **Input Data Package**
  - STAGE 3의 `jtbd_profile`
  - STAGE 4의 `sourcing_intelligence`
  - STAGE 5의 `margin_optimization`
* **Analysis Logic**
  1. 기획된 상품의 JTBD와 결핍 극복 요소를 직관적인 비주얼 컨셉으로 변환하는 LLM 카피라이팅 엔진.
  2. 고객 설득 8단계 퍼널에 따른 랜딩페이지 구성 설계 알고리즘 작동.
* **Output Data Package (`product_strategy`)**
  ```json
  {
    "target_segment": {
      "primary_target": "string",
      "demographic_details": "string"
    },
    "product_concept": {
      "slogan": "string (한 줄 카피)",
      "core_value_proposition": "string"
    },
    "core_usps": [
      {
        "usp_title": "string",
        "usp_description": "string",
        "pain_solved": "string"
      }
    ],
    "pricing_strategy": {
      "strategy_type": "string (PREMIUM | MATCHING | VALUE)",
      "target_price": "integer"
    },
    "distribution_strategy": {
      "recommended_channels": "array of string",
      "marketing_mix_priority": "array of string"
    },
    "thumbnail_direction": {
      "visual_layout_concept": "string",
      "key_visual_elements": "array of string",
      "overlay_copy": "string"
    },
    "landing_page_storyboard": [
      {
        "section_sequence": "integer",
        "section_name": "string",
        "goal_context": "string",
        "visual_asset_guide": "string",
        "copywriting_text": "string"
      }
    ]
  }
  ```

---

## 4. Evaluation Engine (상품 등급 평가 엔진)

단순한 합격/불합격(PASS/FAIL) 판별 방식에서 벗어나 정량·정성적 분석치를 가중 합산하여 **S/A/B/C/D 5단계 등급 평가 시스템**으로 전면 개편합니다.

### 등급 정의 및 후속 조치
* **S (즉시 진행)**: 독보적인 결핍 요소가 확인되고 마진율 50% 이상, 위탁/OEM 공급이 완벽히 안정적이며 규제 리스크가 없음. 즉각 상품 기획 및 런칭 돌입.
* **A (우선 테스트)**: 시장성은 검증되었으나 마진율이 다소 낮거나(35~40%), 약한 경쟁자가 존재함. 소규모 사입 또는 예약 판매 테스트 진행.
* **B (관찰)**: 검색 트렌드가 불안정하거나 차별화 요소가 약함. 시장 추이를 모니터링하며 디자인 보강 요건 추가 수집.
* **C (보류)**: 소싱 단가 협의 불가, 높은 KC 인증비용(예: 300만원 이상), 디자인 특허 침해 우려 있음. 공급 조건 대폭 개선 시 재평가.
* **D (진입 금지)**: 대기업 독점율 70% 초과, 마진 확보 불가, 안전 규제 통과 불가. 즉시 기획 드랍.

### 평가 등급 생성 Data Package
```json
{
  "evaluation_grade": "string (S | A | B | C | D)",
  "total_score": "integer (0 - 100)",
  "grade_rationale": "string (등급 부여 요약 설명)",
  "decision_factors": {
    "demand_score": "integer",
    "barrier_score": "integer",
    "pain_point_score": "integer",
    "sourcing_score": "integer",
    "profit_score": "integer"
  },
  "risk_factors": [
    {
      "risk_name": "string",
      "risk_level": "string (HIGH | MEDIUM)",
      "mitigation_strategy": "string"
    }
  ],
  "opportunity_factors": ["array of string"]
}
```

---

## 5. Trend Intelligence Engine (데일리 트렌드 데몬 스펙)

* **수집 및 실행 주기**: 매일 오전 04:00 (배치 크론 크롤러 작동)
* **목적**: 지정된 관심 카테고리 및 시장에서 이상 징후(Anomaly)를 감지하고 기획 판단 모델에 실시간 가중치 변동 요소를 공급합니다.
* **주요 탐지 항목 및 트리거 조건**
  1. **검색량 급상승**: 특정 키워드의 7일 평균 검색량이 전주 대비 50% 이상 폭증할 때.
  2. **신규 파괴적 경쟁자 등장**: 신규 스토어의 등록일이 30일 이내이면서 리뷰 증가율 속도가 상위 5% 이내일 때.
  3. **가격 붕괴 시그널**: 상위 10개 업체의 평균 단가가 3일 연속으로 15% 이상 전반적으로 하락(치킨게임 돌입)할 때.
  4. **SNS 급상승 니즈**: 인스타그램/틱톡 내 특정 키워드 언급 빈도가 전월 대비 100% 이상 상승 시.

---

## 6. Closed-Loop Learning Engine (학습 루프 스펙)

실제 출시 후 누적된 성과 지표와 대시보드의 예측치를 대조 분석하여, AI 평가 엔진의 각 Stage 스코어 임계값(Threshold)과 가중치(Weight)를 자동으로 역전파(Backpropagation) 학습시키는 모듈입니다.

```
[출시 상품 실적 데이터 수집]
       │
       ├─► traffic_metrics  (Ad CTR, CPC, CPM)
       ├─► sales_metrics    (CVR, Order Qty, Revenue)
       └─► quality_metrics  (Return %, Review Rating, CS Count)
       │
       ▼
[AI 포스트모텀 (Post-Mortem) 분석 엔진]
       │
       ├─► [가정 검증] STAGE 3의 JTBD 결핍과 실제 구매 후기가 일치하는가?
       ├─► [정밀도 측정] 예견 마진율과 실제 집행 마진율 오차가 오차범위 내인가?
       │
       ▼
[의사결정 코어 가중치 최적화]
       │ (Stage 1~5 합격 컷오프 점수 및 변수 가중치 튜닝)
       ▼
[다음 상품 평가 및 등급 연산에 반영]
```

### Feedback Loop 수집 스키마
```json
{
  "product_id": "string",
  "evaluated_grade_at_planning": "string (S | A | B)",
  "operational_metrics": {
    "ad_ctr": "float (percentage)",
    "purchase_cvr": "float (percentage)",
    "total_revenue_krw": "integer",
    "actual_net_margin_ratio": "float (0.0 - 1.0)",
    "customer_return_ratio": "float (percentage)",
    "average_customer_rating": "float (0.0 - 5.0)",
    "cs_ticket_count_per_100_orders": "integer"
  }
}
```

---

## 7. Next Steps & Role Definition (역할 정의)

본 문서는 플랫폼 개발을 이끌기 위한 최상위 설계 명세서(Core Specification)로 기능합니다. 최종 결정된 역할 분담에 따라 다음 개발 과정을 추진할 예정입니다.

* **역할 분담**
  - **Product Owner (대표님)**: 최종 상품성 평가 등급(S~D) 컷오프 기준 승인 및 사업 방향성 조율.
  - **PM + AI Framework Designer (ChatGPT)**: JTBD 세부 프롬프트 설계 및 사용자 시나리오 구조 구체화.
  - **Chief Architect + Lead Developer (Antigravity IDE - 본인)**: 본 스펙을 바탕으로 Supabase DB 스키마 설계, Python FastAPI 엔드포인트 설계, Playwright 수집기 구축 및 전체 디렉토리 아키텍처 코딩 실행.

* **다음 단계 계획**
  - [ ] **Database Architecture 설계**: STAGE 1~6의 Input/Output 데이터를 영속화하기 위한 PostgreSQL/Supabase 테이블 스키마 릴레이션 다이어그램 및 DDL 작성.
