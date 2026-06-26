# BACKLOG.md (Future Backlog)

이 문서는 **AI Product Intelligence Platform** 프로젝트의 단기/장기 마일스톤에 따라 분류된 향후 기능 구현 백로그(Product Backlog) 목록입니다.

---

## 1. 단기 구현 백로그 (Short-term Backlog)
* [ ] **Supabase DDL 스크립트 작성 및 테이블 생성**:
  - `database_architecture.md`에 명시된 테이블 구조의 DDL 작성.
  - pgvector 활성화 및 HNSW 인덱싱 설정.
* [ ] **Playwright 기반 쇼핑 리뷰 및 소싱 스크래퍼 모듈화**:
  - Naver Shopping 리뷰 다중 페이지 자동 스크롤 수집기 구현.
  - 1688 및 알리바바 상품 상세 데이터 크롤러 구현.
* [ ] **FastAPI 기반 Capability Layer / Gateway 구축**:
  - Gemini, Claude, GPT API 연동 및 Failover 로직 테스트.
  - Pydantic 입력 스키마 에러 복원 기능 구현.

---

## 2. 중기 마일스톤 백로그 (Mid-term Backlog)
* [ ] **FLUX.1 API 연동 썸네일 생성 파이프라인 연계**:
  - `Creative Strategy Agent`가 빌드한 이미지 프롬프트를 바탕으로 고품질 썸네일 초안을 직접 생성하고 저장하는 미디어 서브 파이프라인 개발.
* [ ] **상세페이지 자동 빌더/렌더러 프로토타입**:
  - 상세페이지 스토리보드 설계 결과를 HTML/CSS 및 마크다운으로 렌더링하고 다운로드할 수 있는 웹 빌더 인터페이스 구현.
* [ ] **데일리 크론 Trend Intelligence 데몬 통합**:
  - 검색량 50% 급상승, 가격 폭락, 신규 셀러 급등 등을 매일 아침 스캔하여 룰 엔진의 가중치 데이터베이스를 주기적으로 보정하는 백그라운드 태스크 엔진 구축.

---

## 3. 장기 비전 및 플랫폼 확장 백로그 (Long-term Backlog)
* [ ] **Problem First Pipeline으로 전면 확장**:
  - 키워드 입력 이전에 고객의 불만 상황이나 니즈 키워드셋을 입력하여 AI가 역으로 "기획 가치가 있는 상품군 카테고리 후보군"을 우선 추천하고, 선정 후 분석하는 전체 파이프라인의 상위 레이어 추가 개발.
* [ ] **다국어 소싱 및 로컬라이징 번역 에이전트 추가**:
  - 중국어 B2B 상품 스펙을 한국어로 정밀 로컬라이징하고, 통관 규격 및 KC인증 적합성을 AI 법률 어시스턴트가 2차 스크리닝하는 특화 Agent 추가.
