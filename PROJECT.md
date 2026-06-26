# PROJECT.md (Project Blueprint)

## 1. 프로젝트 기본 정보
* **프로젝트명**: AI Product Intelligence Platform
* **저장소 위치**: `/Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard`
* **개발 목표**: 시장성 검증부터 JTBD 문제 매핑, USP 상품 기획, 마케팅 시각 소재 구성안 생성 및 실제 출시 성과 피드백 분석을 자동화하는 지능형 상품기획 아키텍처 구현.

---

## 2. 기술 스택 (Technology Stack)
* **Backend Framework**: Python (FastAPI 예정)
* **Frontend UI**: Streamlit (현재 `dashboard.py` 기반 프로토타입 구동 중)
* **Database**: PostgreSQL (Supabase) + pgvector (벡터 저장소 내장)
* **Scraper / Collector**: Playwright (네이버 쇼핑 스크래핑 및 B2B 소싱 데이터 수집용)
* **Orchestration**: Asyncio 병렬 실행 기반 멀티 에이전트 프레임워크
* **AI Models (LLM / Image)**: Gemini 1.5 (Pro/Flash), Claude 3.5 Sonnet, GPT-4o, Qwen 2.5, FLUX.1 (썸네일 생성용)

---

## 3. 핵심 아키텍처 및 설계 문서
본 프로젝트는 코드 구현 전에 작성된 아래 설계 사양서들을 코어로 삼아 개발됩니다.

* **[product_intelligence_framework.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/product_intelligence_framework.md)**: AI의 6단계 분석 의사결정 파이프라인 및 JTBD, 등급 체계(S~D) 명세서.
* **[ai_agent_architecture.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/ai_agent_architecture.md)**: Task Planner, 오케스트레이터, 9개 Specialized Agent 및 추상화 기능 레이블(Capability Layer) 규격서.
* **[database_architecture.md](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database_architecture.md)**: Supabase PostgreSQL 및 pgvector를 활용한 지식 매핑 구조 및 이력 감사(Audit), 3-Tier 메모리 아키텍처 명세서.

---

## 4. 멤버 및 역할 정의
* **대표님 (User)** ➡️ **Product Owner (PO)**: 최종 등급 평가 가중치 승인 및 사업적 요건 결정.
* **ChatGPT** ➡️ **PM + AI Framework Designer**: 에이전트 시나리오 구상, 프롬프트 엔지니어링 설계.
* **Antigravity IDE (본인)** ➡️ **Chief System Architect & Lead Software Engineer**: 백엔드/데이터베이스/크롤러 아키텍처 설계 및 프로덕션 수준의 구현 코딩 실행.
