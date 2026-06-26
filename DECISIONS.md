# DECISIONS.md (Architecture Decision Records)

이 문서는 **AI Product Intelligence Platform** 프로젝트의 설계와 기술 선택 과정에서 결정된 주요 의사결정(Architecture Decision Records, ADR)을 기록하는 저장소입니다.

---

## [ADR-001] pgvector 기반 지식 메모리 아키텍처 채택
* **날짜**: 2026-06-26
* **결정**: 독립적인 Vector DB(예: Pinecone, Milvus)를 구축하는 대신, Supabase PostgreSQL의 `pgvector` 확장을 활용해 단일 하이브리드 데이터베이스로 운영합니다.
* **이유**:
  * **아키텍처 단순성**: 별도의 인프라 서버를 관리하지 않고, 트랜잭션 정보와 고밀도 임베딩 벡터 데이터를 단일 Supabase 인스턴스에서 통합 관계 조인(SQL JOIN)할 수 있습니다.
  * **보안 및 관리 편의성**: Supabase의 내장 인증(Auth) 및 RLS(Row Level Security) 정책을 그대로 벡터 데이터 검색 레이어에도 일관되게 적용할 수 있습니다.

---

## [ADR-002] 결정론적 룰 엔진(Deterministic Rule Engine)과 LLM의 분리
* **날짜**: 2026-06-26
* **결정**: 시장 분석 정량 데이터 처리 및 최종 등급 판정(S~D)은 결정론적 Python/SQL 룰 엔진으로만 구동하고, LLM은 정성적 텍스트 분류(Customer), 상황 인지(JTBD), 전략 생성(Planner, Creative)에만 제한 사용합니다.
* **이유**:
  * **신뢰성 보장**: 생성형 AI의 환각 현상(Hallucination)에 의한 오작동으로 D등급 상품을 S등급으로 오판하여 사업적 손해를 입는 리스크를 완벽히 제거합니다.
  * **비용 및 Latency 최적화**: 매번 LLM API를 호출하는 횟수를 절반 이하로 줄여, 시스템 구동 비용을 절감하고 즉각적인 등급 산출 응답 속도를 확보합니다.

---

## [ADR-003] Capability Layer를 활용한 LLM 인프라 추상화
* **날짜**: 2026-06-26
* **결정**: 에이전트 내부에 특정 LLM 모델의 API 구현 코드를 직접 작성하는 대신, `Extract`, `Classify`, `Reason` 등의 동작 규격인 `Capability Layer`와 `LLM Gateway`를 통해 호출을 간접 처리합니다.
* **이유**:
  * **모델 독립성**: 시스템 구동 중에 Claude, Gemini, GPT 등 어떤 모델이라도 시스템 전체의 코드 수정 없이 설정 및 환경 변수 변경만으로 즉각적인 교체 및 다중 라우팅이 가능해집니다.

---

## [ADR-004] 특정 도메인 엔티티(페르소나/시나리오) JSONB 역정규화 허용
* **날짜**: 2026-06-26
* **결정**: `jtbd_profiles` 테이블의 페르소나 데이터와 8단계 사용 시나리오 데이터를 관계형 자식 테이블로 쪼개지 않고, 하나의 JSONB 필드 내에 통합 적재합니다.
* **이유**:
  * **성능 및 LLM 컨텍스트 전달 최적화**: 해당 데이터들은 개별 RDBMS 필드로서 단독 조인 연산되거나 업데이트될 유스케이스가 없으며, 오직 LLM 에이전트가 한 번에 JSON 스키마 형태로 소비하는 정보입니다. 복잡한 다대다 관계 조인을 방지해 I/O 성능을 극대화합니다.
