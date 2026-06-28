# USER_FLOW.md

# 사용자 흐름도 (User Flow Diagram)

본 문서는 사용자가 플랫폼 내에서 완수하는 핵심 시나리오 4가지에 대한 다이어그램과 절차를 기술한다.

---

## 1. 신규 시장성 및 JTBD 분석 흐름 (Market & JTBD Analysis Flow)

판매자가 특정 네이버 쇼핑 키워드를 대상으로 시장 분석 및 고객 결핍을 추출하는 흐름이다.

```mermaid
sequenceDiagram
    actor Seller as 판매자
    participant FE as 프론트엔드 (Next.js)
    participant BE as 백엔드 (Fastify)
    participant SC as 크롤러 (Playwright)
    participant AI as AI 분석 엔진 (Gemini)

    Seller->>FE: 키워드 입력 및 수집 건수 선택 후 [분석 시작] 클릭
    FE->>BE: POST /api/products/analyze (payload: keyword, reviewCount)
    BE->>SC: 크롤러 데몬 기동 및 네이버 리뷰 데이터 수집 요청
    Note over SC: 수집 진행률 백엔드 전송
    BE-->>FE: SSE (Server-Sent Events) 분석 상태 갱신 (Status: SCRAPING)
    FE-->>Seller: "리뷰 수집 중..." 진행 바 업데이트
    SC->>BE: 리뷰 데이터 적재 완료
    BE->>AI: 리뷰 텍스트 기반 감성분석 및 JTBD 결핍 분류 요청
    BE-->>FE: SSE 분석 상태 갱신 (Status: ANALYZING)
    FE-->>Seller: "AI 고객 결핍 분석 중..." 진행 바 업데이트
    AI->>BE: JTBD 인사이트 데이터 반환
    BE->>BE: S~D 등급 규칙 계산기 기동 및 결과 저장
    BE-->>FE: SSE 분석 상태 갱신 (Status: COMPLETED, productId)
    FE->>Seller: 상세 분석 리포트 화면으로 자동 리다이렉트
```

---

## 2. AI 상품 기획 스토리보드 생성 및 승인 흐름 (AI Strategy & Approval Flow)

분석된 결핍 데이터를 기반으로 상세페이지 8단계 스토리보드를 생성하고, 관리자의 승인을 얻어 상세 스펙을 확정하는 흐름이다.

```mermaid
graph TD
    A[사용자: 상품 상세 분석 화면 진입] --> B[기획안 생성 버튼 클릭]
    B --> C[프론트엔드: POST /api/products/:id/strategy 호출]
    C --> D[백엔드: LLM 프롬프트 조립 & Strategy Generator 기동]
    D --> E{Zod Custom Validation 통과 여부?}
    E -->|실패| F[3회 한도 내 재시도 실행]
    E -->|성공| G[스토리보드 DB 임시 저장 & 상태: WAITING_APPROVAL]
    G --> H[프론트엔드: 승인 대기 화면 노출 & 관리자 알림 발송]
    H --> I[관리자/대표: 검토 후 승인 버튼 클릭]
    I --> J[프론트엔드: PUT /api/products/:id/strategy/approve 호출]
    J --> K[백엔드: FLUX API 이미지 생성 요청 & 기획 상태: APPROVED 확정]
    K --> L[기획 완료 및 상품 상세페이지 와이어프레임 화면 노출]
```

---

## 3. 성과 지표 등록 및 Closed-Loop 피드백 학습 흐름 (Closed-Loop Learning Flow)

실제 출시한 상품의 실적 데이터를 입력하여 AI 기획 모델을 자가 개선하는 흐름이다.

```mermaid
sequenceDiagram
    actor Seller as 판매자
    participant FE as 프론트엔드 (Next.js)
    participant BE as 백엔드 (Fastify)
    participant CL as Closed-Loop Learning 모듈

    Seller->>FE: 상품 관리 탭에서 [실적 데이터 갱신] 클릭
    FE->>Seller: 실적 입력 모달 노출 (매출액, 평점, 긍정피드백 등)
    Seller->>FE: 실적 값 입력 및 저장
    FE->>BE: POST /api/products/:id/performance (payload: revenue, rating)
    BE->>BE: PL/pgSQL RPC 멱등 Upsert 트랜잭션 수행
    BE->>CL: Closed-loop Learning trigger
    Note over CL: 성공 패턴 감지 및 피드백 가중치 재조정
    CL->>BE: 피드백 감사 로그 및 가중치 업데이트 반영
    BE-->>FE: 성공 피드백 학습 완료 알림 데이터 전송
    FE-->>Seller: "AI가 상품 성공 패턴 2건을 추가 학습했습니다" 토스트 팝업
```

---

## 4. 보안 감사 로그 및 Quota 조회 흐름 (Audit & Quota Flow)

매니저가 사용자의 오용을 감사하고, 전체 워크스페이스의 호출 한도를 관리하는 흐름이다.

```mermaid
graph LR
    A[매니저: 운영 센터 진입] --> B[감사 탭 클릭]
    B --> C[FE: GET /api/operations/audit 호출]
    C --> D[BE: 테넌트 격리 필터 적용 후 로그 반환]
    D --> E[FE: 타임라인 테이블 및 CSV 다운로드 버튼 렌더링]
    
    A --> F[Quota 탭 클릭]
    F --> G[FE: GET /api/operations/quota 호출]
    G --> H[BE: dynamic Quota Gate 임계치 및 실시간 사용량 반환]
    H --> I[FE: 한도 임계치 도달 경고 및 프로그레스 바 표시]
```
