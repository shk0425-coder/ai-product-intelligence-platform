# TODO.md (Task Board)

본 태스크 보드는 AI 에이전트의 개발 우선순위를 추적하고 상태를 관리하는 중앙 보드입니다.

- `[x]` 완료된 작업
- `[/]` 진행 중인 작업 (세션 진행 태스크)
- `[ ]` 대기 중인 작업

---

## 📅 로드맵 및 진척 현황

### [Phase 1] Core Specification & System Design
- [x] Product Intelligence Framework v3.0 최종 명세서 작성
- [x] AI Agent Architecture v1.1 설계 수립
- [x] Database Architecture v1.1 Final 설계 확정 및 동결(Freeze) 완료
- [x] Project Operating System v2.3 (POS v2.3) 최종 구축 완료

### [Phase 2] Database Schema & Migration DDL (Next Milestone)
- [x] Sprint 2-1: Core Domain Database DDL 구현 완료
- [x] Sprint 2-2: Market Domain Database DDL 구현 완료
- [x] GitHub Repository 운영 규칙 반영 및 Git 저장소 구성 완료
- [x] Sprint 2-3: Customer/JTBD Domain Database DDL 구현 완료
- [x] Sprint 2-4: Sourcing/Margin Domain Database DDL 구현 완료
- [x] Sprint 2-5: Strategy/Creative Domain Database DDL 구현 완료
- [x] Sprint 2-6: Audit/Learning Domain Database DDL 구현 완료
- [x] pgvector 확장 활성화 및 HNSW 인덱싱 쿼리 작성 완료
- [x] 테이블 파티셔닝(Range Partitioning) 셋업 쿼리 작성 완료

### [Phase 3] Scaffolding Backend & Scraper (Fastify & TS)
- [x] Sprint 3-1: Fastify 프로젝트 기본 구조 및 인프라 구축 완료
- [x] Sprint 3-2: Auth 모듈 (Authentication) 및 Workspace API 개발 완료
- [x] Sprint 3-3: Market Metric 수집 및 크롤러 연동 완료
- [x] Sprint 3-4: Customer Review 수집 파이프라인 완료
- [x] Sprint 3-5: Sourcing & Margin API 최적화 완료
- [x] Sprint 3-6: Strategy & Creative Brief 모듈 구축 완료
- [x] Sprint 3-7: AI Review Analyzer & JTBD Intelligence 엔진 구축 완료
- [x] Sprint 3-8: AI Review Analysis Persistence Pipeline & Storage 구축 완료

### [Phase 4] Evaluator & Generator Core Integration
- [x] Sprint 4-1: 결정론적 룰 엔진(Deterministic Rule Engine) 등급 컷오프(S~D) 계산기 구현 완료
- [x] Sprint 4-2: JTBD 정보 모델 추출 프롬프트 엔진 구현 완료
- [ ] Product Strategy Generator 구현 (상세페이지 8단계 스토리보드 빌드) (Sprint 4-3)
- [ ] Creative Pipeline (FLUX API 연동 및 이미지 프롬프트 빌더) 연동 (Sprint 4-4)
- [ ] Streamlit 대시보드 리팩토링 및 API 서버 연계 (Sprint 4-5)

### [Phase 5] Closed-loop Learning & Production Setup
- [ ] 출시 상품 실적 수집 모듈 및 피드백 루프 연계
- [ ] 가중치 자동 보정 알고리즘 통합 테스트
- [ ] Supabase 배포 및 최종 운영 최적화
