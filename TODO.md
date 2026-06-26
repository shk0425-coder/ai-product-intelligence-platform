# TODO.md (Task Board)

본 태스크 보드는 AI 에이전트의 개발 우선순위를 추적하고 상태를 관리하는 중앙 보드입니다.

- `[x]` 완료된 작업
- `[/]` 진행 중인 작업 (세션 진행 태스크)
- `[ ]` 대기 중인 작업

---

## 📅 로드맵 및 진척 현황

### [Phase 1] Core Specification & System Design
- [x] Product Intelligence Framework v3.0 최종 기술 명세서 작성
- [x] AI Agent Architecture v1.1 설계 수립
- [x] Database Architecture v1.1 Final 설계 확정 및 동결(Freeze) 완료
- [x] Project Operating System v2.3 (POS v2.3) 최종 구축 완료

### [Phase 2] Database Schema & Migration DDL (Next Milestone)
- [x] Sprint 2-1: Core Domain Database DDL 구현 완료
- [x] Sprint 2-2: Market Domain Database DDL 구현 완료 (ChatGPT Review 대기 중)
  - [x] 08_market_tables.sql (테이블 및 코멘트) 작성
  - [x] 09_market_constraints.sql (기본키/외래키/유니크 제약조건) 작성
  - [x] 10_market_indexes.sql (B-tree 및 GIN 인덱싱) 작성
  - [x] 11_market_triggers.sql (트리거 생략 명시) 작성
- [x] GitHub Repository 운영 규칙 반영 및 Git 저장소 구성 완료
  - [x] .gitignore 작성 및 로컬 Git 저장소 초기화 (`git init`)
  - [x] main/develop 브랜치 운용 및 스프린트별 분할 커밋 생성
  - [x] AI_START.md 및 CONTEXT.md 에 깃 가이드라인 이식 완료
- [x] Sprint 2-3: Customer/JTBD Domain Database DDL 구현 (ChatGPT Review 대기 중)
  - [x] 12_review_tables.sql (테이블 및 코멘트) 작성
  - [x] 13_review_constraints.sql (기본키/외래키/유니크 제약조건) 작성
  - [x] 14_review_indexes.sql (B-tree 및 GIN 인덱싱) 작성
  - [x] 15_review_triggers.sql (트리거 생략 명시) 작성
- [ ] Sprint 2-4: Sourcing/Margin Domain Database DDL 구현
- [ ] Sprint 2-5: Strategy/Creative Domain Database DDL 구현
- [ ] Sprint 2-6: Audit/Learning Domain Database DDL 구현
- [ ] pgvector 확장 활성화 및 HNSW 인덱싱 쿼리 작성 (2차 분할 구현)
- [ ] 테이블 파티셔닝(Range Partitioning) 셋업 쿼리 작성 (2차 분할 구현)

### [Phase 3] Scaffolding Backend & Scraper
- [ ] FastAPI 프로젝트 기본 구조 생성 (`main.py`, `routers/`, `services/`, `models/` 분리)
- [ ] Playwright 기반 네이버 쇼핑 수집 엔진 구현 (스크롤 다운 처리 포함)
- [ ] 수집된 로우 텍스트 및 JSON 검증을 위한 Pydantic Validation 스키마 코드 구축
- [ ] LLM Gateway 추상화 레이어(Extract, Summarize, Classify, Reason) 구현 및 라이브러리 연동
- [ ] 비동기 병렬 에이전트 오케스트레이터 기본 모듈 구축

### [Phase 4] Evaluator & Generator Core Integration
- [ ] 결정론적 룰 엔진(Deterministic Rule Engine) 등급 컷오프(S~D) 계산기 구현
- [ ] JTBD 정보 모델 추출 LLM 프롬프트 설계
- [ ] Product Strategy Generator 구현 (상세페이지 8단계 스토리보드 빌드)
- [ ] Creative Pipeline (FLUX API 연동 및 이미지 프롬프트 빌더) 연동
- [ ] Streamlit 대시보드 리팩토링 및 API 서버 연계

### [Phase 5] Closed-loop Learning & Production Setup
- [ ] 출시 상품 실적 수집 모듈 및 피드백 루프 연계
- [ ] 가중치 자동 보정 알고리즘 통합 테스트
- [ ] Supabase 배포 및 최종 운영 최적화
