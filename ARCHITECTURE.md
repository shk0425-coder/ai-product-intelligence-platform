# ARCHITECTURE.md (System Architecture)

이 문서는 **AI Product Intelligence Platform**의 소스 코드 구조(Directory Scaffolding)와 핵심 컴포넌트 간의 연계 관계를 정의하는 시스템 아키텍처 설계도입니다.

---

## 1. 프로젝트 디렉토리 Scaffolding 설계 (Target Structure)
프로젝트는 다음과 같이 완전히 모듈화되고 독립적인 테스팅이 가능한 폴더 구조로 점진적으로 구현될 예정입니다.

```
naver_shopping_dashboard/
├── AI_START.md                     # AI 작업 개시 메인 진입점
├── PROJECT.md                      # 프로젝트 스펙 및 메타데이터
├── SESSION.md                      # 현재 개발 세션 인계사항
├── TODO.md                         # 태스크 진행 상태 관리판
├── DECISIONS.md                    # 기술/설계 의사결정 레코드 (ADR)
├── ARCHITECTURE.md                 # 본 시스템 폴더 및 아키텍처 설계서
├── CHANGELOG.md                    # 개발 변경 이력 로그
├── BACKLOG.md                      # 장기 플랫폼 기획 백로그
│
├── product_intelligence_framework.md  # 코어 비즈니스 프레임워크 v3.0 명세
├── ai_agent_architecture.md           # 멀티 에이전트 v1.1 설계서
├── database_architecture.md           # DB & pgvector 데이터 설계서
│
├── backend/                        # FastAPI 웹 백엔드 서비스
│   ├── main.py                     # API 서버 시작점
│   ├── config.py                   # 환경변수 및 API 키 설정 로더
│   ├── requirements.txt            # 백엔드 종속성 패키지 명세
│   │
│   ├── agents/                     # Specialized Agent 모듈 그룹
│   │   ├── base.py                 # Agent 추상 기본 클래스
│   │   ├── market_agent.py         # STAGE 1 수집 연산
│   │   ├── competitor_agent.py     # STAGE 2 수집 연산
│   │   ├── customer_agent.py       # STAGE 3 감성 분석
│   │   ├── jtbd_agent.py           # STAGE 3 JTBD 모델링
│   │   ├── sourcing_agent.py       # STAGE 4 1688 수집 및 위험 분석
│   │   ├── profit_agent.py         # STAGE 5 마진 연산
│   │   ├── strategy_agent.py       # STAGE 6 기획안 생성
│   │   ├── creative_agent.py       # STAGE 6 썸네일/상세페이지 스토리보드
│   │   └── learning_agent.py       # 성과 피드백 분석
│   │
│   ├── core/                       # 코어 엔진 및 라이프사이클 관리
│   │   ├── orchestrator.py         # 비동기 병렬 DAG 실행 제어
│   │   ├── task_planner.py         # 사용자 인텐트 기반 에이전트 라우팅
│   │   ├── decision_engine.py      # 결정론적 S/A/B/C/D 룰 계산기
│   │   └── llm_gateway.py          # Capability Layer 추상화 및 API 라우터
│   │
│   ├── database/                   # Supabase 연결 및 쿼리 레이어
│   │   ├── connection.py           # Supabase Client 생성 및 세션 풀
│   │   ├── crud.py                 # RDBMS 및 pgvector 쿼리 실행 함수군
│   │   └── migrations/             # SQL DDL 스키마 백업 폴더
│   │
│   ├── scrapers/                   # 수집기 라이브러리
│   │   ├── naver_api.py            # 네이버 쇼핑 검색 OpenAPI 모듈
│   │   └── play_scraper.py         # Playwright 기반 1688/리뷰 크롤링 모듈
│   │
│   └── tests/                      # 각 모듈별 유닛 테스트
│
├── frontend/                       # 사용자 화면 (Streamlit)
│   ├── app.py                      # 메인 화면
│   ├── components/                 # 차트, 요약 카드 및 공통 UI 컴포넌트
│   └── assets/                     # 테마 및 정적 시각 리소스
│
└── requirements.txt                # 프로젝트 전체 통합 파이썬 라이브러리
```

---

## 2. 컴포넌트 간 데이터 통신 사양
* **REST API**: 백엔드(`backend/`)는 FastAPI를 통해 각 에이전트 실행 및 데이터 조회를 제어하는 RESTful 엔드포인트를 제공하며, 프론트엔드(`frontend/`)는 이에 통신합니다.
* **Pydantic Validation**: 에이전트와 데이터베이스 레이어 간에 전달되는 모든 데이터는 Pydantic 스키마 형식을 사용해 정합성을 강제합니다.
* **비동기 큐 & DAG**: 에이전트의 복잡한 실행 의존성은 `backend/core/orchestrator.py` 내부에서 비동기 `await` 태스크 그룹핑(`asyncio.gather`)으로 처리되어 I/O 병목을 해결합니다.
