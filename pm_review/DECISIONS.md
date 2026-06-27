# Project Decisions

## Sprint 3-5

- **플러그인형 Scraper Provider 구조 도입**: Naver, Coupang, 1688 등 다중 쇼핑 플랫폼 수집 채널을 손쉽게 붙이고 확장할 수 있도록 `IScraperProvider` 및 `ScraperService` 레지스트리 기반의 모듈 아키텍처를 도입함.
- **결정론적 Mock Scraper Stub 설계**: 테스트의 Flaikness 방지 및 재현성을 보장하고자 난수(Random) 사용을 지양하고 입력 키워드 해시 해상도 비례 결정론적 응답 stubs를 도입함.
- **Run ID 소유주 위장 등록 예방 조인 대조 정책**: 마켓 메트릭 생성 시 전달받은 `runId`가 현재 API를 호출한 유저 소유의 워크스페이스에 매핑된 상품의 분석 건인지 레포지토리 레이어 조인을 통해 검증함.
- **도메인 명확화를 위한 DTO 명칭 개정**: `CreateMarketMetricDto`, `UpdateMarketMetricDto` 등으로 개정하여 엔티티 모델링 규격과 명칭 싱크를 맞춤.
- **중복 메트릭 Conflict 매핑 정책**: `run_id` 1:1 유니크 제약 조건 충돌에 따른 DB Unique Constraint 위반(`23505`)을 감지하여 `MarketMetricAlreadyExistsError` (409 Conflict)로 매핑 반환함.

---

## Sprint 3-4

- **BaseRepository 내 소프트 딜리트 수정/삭제 차단 정책**: Soft Delete 처리가 끝난 로우의 추가 수정 및 재삭제 연산을 차단하고자 `BaseRepository.update` 및 `delete`에 `.is('deleted_at', null)` 필터를 기본 기입함.
- **Zod 기반의 페이징 상한 규격화 및 정렬 화이트리스트 검사**: page 최대 100,000, limit 최대 100 조건 및 명칭 화이트리스트 외 정렬을 라우트 Zod 검증 레이어에서 즉시 오류 반환 처리함.
- **최종 중복 검사의 DB Constraint 위반 감지 이관**: 최종 중복 식별은 DB Unique Constraint를 의존하여 Supabase 23505 에러 감지를 통해 `WorkspaceAlreadyExistsError`로 변환하도록 구조 개선함.
- **마켓 메트릭 다단계 조인 소유주 필터링**: `market_metrics` 테이블과 `workspaces`의 `org_id`를 연결하는 조인 경로 필터링을 Repository 단에 적용함.
- **마켓 테이블 soft delete용 DDL 추가**: DDL 직접 수정 금지령에 맞추어 `29_add_market_deleted_at.sql` 마이그레이션을 신설 적용함.

---

## Sprint 3-3

- **workspaces.deleted_at 신규 마이그레이션 적용**: DDL 직접 수정 금지 정책에 의거하여, `28_add_workspace_deleted_at.sql`을 새로 생성하여 소프트 딜리트 타임스탬프 필드를 점진적으로 안전하게 추가함.
- **워크스페이스 조회(GET) Owner 검증 적용**: 테넌트 격리 원칙을 준수하기 위해 단건 조회 시에도 다른 계정의 워크스페이스에 대한 접근을 403 Forbidden으로 원천 차단함.
- **BaseRepository 내 페이징 조회(findAll) 공통화**: 모든 도메인(Workspace, Market, Review 등)에서 다대일 페이징 쿼리가 동일 구조로 서빙되도록 `findAll(options: PaginationOptions): Promise<PaginatedResult<T>>` 메서드를 설계 수립함.

---

## Sprint 3-2

- **TokenProvider 추상 인터페이스화 및 JwtTokenProvider 구현**: jsonwebtoken 라이브러리와 서비스 레이어의 직접적인 결합을 제거하여, 향후 Clerk/Auth0/Supabase Auth 등으로 서비스 코드 변경 없이 변경이 가능하도록 아키텍처적 유연성을 확보함.
- **UserRole Enum 및 JwtPayload 설계**: `ADMIN`, `MANAGER`, `USER` 구조의 Enum을 적용하여 향후 역할 기반 접근 제어(RBAC) 구현 시 JWT 스키마 변경을 최소화함.

---

## Sprint 3-1

- **Fastify 채택**: Express 대비 높은 처리 성능과 플러그인 기반 아키텍처를 제공하는 Fastify를 백엔드 웹 프레임워크로 선정함.
- **TypeScript Strict Mode 적용**: 런타임 오류 방지와 any 타입의 배제를 위해 엄격한 타입 검사(Strict Mode)를 강제 설정함.
- **API Prefix를 /api/v1로 통일**: API 버전 관리를 고려하여 모든 라우트가 `/api/v1` 경로로 서빙되도록 일원화함.
- **Repository Interface 분리**: 데이터 접근의 유연성과 단위 테스트 작성을 극대화하기 위해 레포지토리 인터페이스와 실제 구현 레이어를 격리함.
- **Common Layer 추가**: 공통 응답 규격(`responses`), 오류 처리(`errors`), 벨리데이터(`validators`), 상수(`constants`)의 중앙식 관리를 위해 `src/common` 레이어를 신설함.

---

## Past Decisions (ADR Ledger)

### [ADR-001] pgvector 기반 지식 메모리 아키텍처 채택
* **날짜**: 2026-06-26
* **결정**: 독립적인 Vector DB(예: Pinecone, Milvus)를 구축하는 대신, Supabase PostgreSQL of `pgvector` 확장을 활용해 단일 하이브리드 데이터베이스로 운영합니다.
* **이유**:
  * **아키텍처 단순성**: 별도의 인프라 서버를 관리하지 않고, 트랜잭션 정보와 고밀도 임베딩 벡터 데이터를 단일 Supabase 인스턴스에서 통합 관계 조인(SQL JOIN)할 수 있습니다.
  * **보안 및 관리 편의성**: Supabase의 내장 인증(Auth) 및 RLS(Row Level Security) 정책을 그대로 벡터 데이터 검색 레이어에도 일관되게 적용할 수 있습니다.

### [ADR-002] 결정론적 룰 엔진(Deterministic Rule Engine)과 LLM의 분리
* **날짜**: 2026-06-26
* **결정**: 시장 분석 정량 데이터 처리 및 최종 등급 판정(S~D)은 결정론적 Python/SQL 룰 엔진으로만 구동하고, LLM은 정성적 텍스트 분류(Customer), 상황 인지(JTBD), 전략 생성(Planner, Creative)에만 제한 사용합니다.
* **이유**:
  * **신뢰성 보장**: 생성형 AI의 환각 현상(Hallucination)에 의한 오작동으로 D등급 상품을 S등급으로 오판하여 사업적 손해를 입는 리스크를 완벽히 제거합니다.
  * **비용 및 Latency 최적화**: 매번 LLM API를 호출하는 횟수를 절반 이하로 줄여, 시스템 구동 비용을 절감하고 즉각적인 등급 산출 응답 속도를 확보합니다.

### [ADR-003] Capability Layer를 활용한 LLM 인프라 추상화
* **날짜**: 2026-06-26
* **결정**: 에이전트 내부에 특정 LLM 모델의 API 구현 코드를 직접 작성하는 대신, `Extract`, `Classify`, `Reason` 등의 동작 규격인 `Capability Layer`와 `LLM Gateway`를 통해 호출을 간접 처리합니다.
* **이유**:
  * **모델 독립성**: 시스템 구동 중에 Claude, Gemini, GPT 등 어떤 모델이라도 시스템 전체의 코드 수정 없이 설정 및 환경 변수 변경만으로 즉각적인 교체 및 다중 라우팅이 가능해집니다.

### [ADR-004] 특정 도메인 엔티티(페르소나/시나리오) JSONB 역정규화 허용
* **날짜**: 2026-06-26
* **결정**: `jtbd_profiles` 테이블의 페르소나 데이터와 8단계 사용 시나리오 데이터를 관계형 자식 테이블로 쪼개지 않고, 하나의 JSONB 필드 내에 통합 적재합니다.
* **이유**:
  * **성능 및 LLM 컨텍스트 전달 최적화**: 해당 데이터들은 개별 RDBMS 필드로서 단독 조인 연산되거나 업데이트될 유스케이스가 없으며, 오직 LLM 에이전트가 한 번에 JSON 스키마 형태로 소비하는 정보입니다. 복잡한 다대다 관계 조인을 방지해 I/O 성능을 극대화합니다.
