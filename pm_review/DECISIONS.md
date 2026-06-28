# Project Decisions

## Sprint 8-0

- **[DDL-01] 슬레이트(Slate) 기반의 프리미엄 다크 테마 기본 채택**: HSL Hues and Indigo primary.
- **[DDL-02] 상품 상세 뷰 내 로컬 탭(Local Tab) 네비게이션 적용**: dynamic tabs to reduce reload latency.
- **[DDL-03] AI 스토리보드 단계적 Progressive Disclosure 적용**: Accordion components for storyboard details.
- **[DDL-04] 감사 이력 조회 시 페이지네이션(Pagination) 단일 표준 채택**: Standard pagination for historical auditing.

---

## Sprint 7-2

- **AsyncLocalStorage (Context Propagation)**: HTTP 요청, Queue, EventBus, AI Workflow를 관통하는 Trace ID 및 Correlation ID의 맥락 보존 보장.
- **Instrumentation Layer 분리**: 서비스 로직 침투 없이 Http, Redis, Queue, AI, EventBus의 메트릭과 트레이스를 비간섭적으로 자동 수집하는 레이어 구성.
- **Log Sinks & Masking**: Console, File, OTLP 등 교체 가능한 Sink 규격 설계 및 이메일, 전화번호, API Key 등의 선제 정규식 기반 마스킹 필터 구축.
- **Alert Storm Protection**: Cooldown(대기 시간) 및 Deduplication, Severity Escalation 기법을 적용해 반복 장애 시 경보 폭주를 방어함.
- **Dashboard Cache & Diagnostics**: 대시보드 API 호출 부하 방지를 위해 Redis Cache 및 Background Refresh를 연계하고, CPU/Memory/Event Loop/GC Pause Time을 결합한 런타임 자가 진단 리포트를 노출함.

---

## Sprint 7-1

- **Cache Stampede (Single Flight)**: 캐시 미스 시 동시 다발적인 연산 중복 호출을 차단하기 위해 `SingleFlight` 매니저가 동일 Key 연산 Promise를 그룹핑하여 1회만 계산 함수를 실행하고 동일 결과를 병합 공유 분출하도록 통제함.
- **Lock Owner Token & Lua Release**: 분산 락의 소유권 보호와 원자적 해제를 수행하기 위해 UUID ownerToken 토큰 체크와 Redis Lua Script 비교 삭제(Compare and Delete) 에뮬레이션을 설계 적용함.
- **Graceful Shutdown (이벤트 유실 차단)**: SIGTERM/SIGINT 신호 발생 시 신규 publish 진입을 차단하고, 10초 Graceful Timeout 동안 inflight 핸들러가 모두 완료될 때까지 안전하게 대기한 후 자원을 완전하게 해제함.
- **Redis Circuit Breaker (Failover & Recovery)**: CLOSED ➡️ OPEN ➡️ HALF_OPEN 상태기 기반 자동 핫스위칭 캐시 fallback 및 Ping 자가 치유 복구 기법을 도입해 인프라 회복 탄력성을 보장함.
- **Event Idempotency**: 이벤트 유니크 UUID 및 10분 TTL 멱등 캐시를 결합하여 중복 메시징에 대한 멱등 보장을 확립함.

---

## Sprint 6-5

- **Human-in-the-loop (Workflow Resume)**: 승인 노드 진입 시 워크플로우 실행을 `WAITING` 상태로 전환시키고 snapshot 덤프를 저장하며, 승인 시 중단 지점부터 멱등하게 실행을 재개(Resume)하도록 `WorkflowResumeManager` 및 `WorkflowExecutor` 콜백을 결합 설계함.
- **Exception 격리 Sandbox**: 외부 HTTP/Search 등 IO 연동 시 Sandbox 래퍼를 구성하여 예외, 메모리 과소비, 타임아웃 오류가 Workflow 메인 스레드로 전이/유출되지 않고 FAILED status 결과로 격리 캡슐화 처리함.
- **AJV JSON Schema Validator**: 외부 라이브러리인 ajv에 대한 컴파일/의존성 오염 우려를 차단하기 위해, properties 속성을 recursive하게 validation 검사하는 custom JSON Schema validator를 직접 내장 설계함.
- **SHA-256 캐시 레이어**: Version, Request, Workspace, Capability 매핑 기반 10분 TTL 캐시를 구성하고 Redis 등 분산 캐시 전환을 위한 인터페이스 격리(`ToolCacheInterface`) 설계를 확립함.

---

## Sprint 6-4

- **Immutable State Machine**: 모든 Workflow 및 Step의 상태(PENDING, RUNNING, WAITING, SUCCESS, FAILED, CANCELLED, TIMEOUT) 전이는 Repository 직접 변경을 금지하고 `WorkflowStateMachine` 클래스만을 통하도록 설계하여 원자적(Atomic) 단방향 상태 이동을 강제함.
- **DAG Validator**: 실행 전 DFS 탐색을 기동하여 DAG 구조 내에 순환(Cycle)이 포함되어 있는지 검출하고 시작/종료 노드와 연계되지 않은 고아(Orphan) Step을 판별해 `ValidationError`로 선제 차단함.
- **Stateless Step Engine**: 개별 Step은 Immutable Context를 주입받아 Prompt 렌더링 및 Gateway API 조율만 처리하는 Stateless 구조를 고수하여 멀티에이전트 확장성을 확보함.
- **Graceful Cancellation & Step Retry**: CancellationToken 전파를 이용해 취소 시 하위 Step을 안전하게 폐기하고 실행 중이던 context 진행 상태를 Snapshot(JSONB) 필드에 적재하여 Resume 확장을 대비함.
- **Topological Level Grouping**: BFS 레벨 정렬(Topological Level Grouping)을 통해 병렬(Parallel) 실행 그룹과 순차(Sequential) 실행 그룹을 오케스트레이션하여 멱등성 및 동시 실행 흐름을 제어함.

---

## Sprint 6-3

- **Prompt Versioning & DRAFT 회귀 제어**: 수정 불가능한 버전 엔티티를 확립하고 템플릿 변경 시 자동으로 `DRAFT` 상태로 회귀하여 승인 플로우가 안전하게 재가동되도록 통제함.
- **Dynamic Context Builder 고정 순서 순회**: Workspace ➡️ User ➡️ Product ➡️ Review ➡️ JTBD ➡️ Market ➡️ History ➡️ Custom 순서로 `ContextProvider`들을 호출하여, 멱등 렌더링 결과(checksum)를 보장하고 데이터베이스 중복 참조 부하를 차단함.
- **Variable Parser 연산자 해석**: `{{variable}}`, 기본값 `|`, nullable `?` 조합 해석기 및 dynamic injection 매핑 구조를 통해 변수 미전달 시 Gateway 호출 전 validation 수준에서 원천 차단함.
- **Gateway 인터페이스 격리**: Gateway와 Prompt 모듈은 오직 `AIProviderRequest` 및 `GenerateResponse` 인터페이스 형태만 공유하도록 느슨한 결합을 유지하여 향후 모듈 교체 및 Agent Workflow 이식이 쉽도록 격리함.
- **Prompt SHA-256 캐시 레이어**: In-Memory 10분 TTL 렌더링 캐시를 완비하며, Redis 분산 캐시 전환 피드백을 반영해 `PromptCacheInterface`로 인터페이스를 분리함.

---

## Sprint 6-2

- **Provider Resolver 계층 추가**: Gateway에서 Provider 선택 정책 및 책임을 직접 가지지 않도록 `ProviderResolver`를 독립 계층으로 격리 수립하여 책임을 느슨히 결합(Loose Coupling)함.
- **Response Validator 파이프라인 결합**: SDK 정규화 직후, 토큰/비용 계산 이전에 응답의 스키마, JSON Structured schema, NaN 비용, 비어있는 응답 여부 및 허용 Finish Reason을 선제 검사하여 `ValidationError`를 발생시킴.
- **Dynamic Capability Matching**: Dynamic Property Check 방식을 사용하여 Provider metadata 내 supportsText/supportsVision 등의 변수를 대소문자 무관하게 dynamic matching 하도록 구현함.
- **Chunk Wrapper 기반 스트리밍 하방 호환성**: 스트리밍 미지원 모델도 일반 단발성 Response를 텍스트 토큰 청크로 쪼개어 Gateway단에서 스트리밍 변환(AsyncIterable)을 에뮬레이트하도록 캡슐화함.
- **API Key 환경 변수 격리**: API Key 및 Secret PII는 절대 DB에 저장하지 않고 process.env로부터 직접 로드하며, Mocking/Test 시 dynamic 주입이 가능하게 처리함.
- **분산 캐시 및 다차원 레이트 리밋 확장성 확보**: 운영 인프라 확장 시 In-Memory Cache를 Redis 등 분산 캐시로 교환할 수 있는 구조를 유지하며, Workspace/사용자/API Key별 다차원 Rate Limit 정책 및 세부 Model Metadata(Vision 입력 제한, Function calling 제약 등)에 대한 필드 유연성을 견지하여 설계함.

---

## Sprint 6-1

- **원자성 임대 획득 (Optimistic Lock)**: 수동 점유 상태 체크 대신 데이터베이스 수준의 단일 SQL Update 트랜잭션을 낙관적 락으로 적용하여 중복 임대를 원천 차단함.
- **30초 Heartbeat / 60초 Visibility Timeout**: 백그라운드 스케줄링을 통해 매 30초마다 생존 신고를 전송하고, 60초 이내에 갱신되지 않은 임대는 자동으로 타임아웃 회수 처리함.
- **Exponential Backoff 정책**: 최대 3회로 재시도 한계를 제어하고, 실패 시 실패 횟수에 비례한 지수 대기 정책을 가동하여 인프라 부하를 최소화함.
- **Graceful Shutdown**: 워커 동작 루프 내부 및 API 취소 단에서 `cancel_requested` 플래그를 주기적으로 검사하여 자원을 즉시 안전하게 반환하도록 구현함.
- **DLQ(Dead Letter Queue) 자동 격리 및 수동 복구**: 3회 연속 실패한 작업을 `job_dead_letters`로 자동 이관하고, 복구 API를 통해 새로운 Pending 작업으로 즉시 재생성 및 자동 삭제하도록 보장함.

---

## Sprint 5-5

- **격리형 Planner Architecture**: AI 기획 플래너(`ProductionPlanner`) 내부에서 Supabase 데이터베이스나 리포지토리 레이어 호출, 도메인 이벤트 발행을 전면 차단하여 LLM 프롬프트 빌딩과 실행 간의 책임을 완전히 격리 및 단일화함.
- **동일 프롬프트 인메모리 캐싱**: 조립 완료된 프롬프트의 SHA-256 체크섬을 Key로 캐싱하는 `promptCache` 를 기동하여, 동일 기획 전략 생성 시 중복 API 조회를 억제하는 아키텍처 최적화를 실현함.
- **가속 및 중복제거 필터링**: `quality_score >= 70` 및 `confidence >= 70%` 필터를 거친 학습 지식들을 내림차순 정렬 후, 동일 `feature_summary` 와 `success_pattern` 을 가진 자산들을 Deduplicate 처리하여 프롬프트 내 장황함을 배제함.
- **엄격 재시도 Count 제한**: 자동화 실패 작업(`/retry`) 시, 오직 `FAILED` 상태인 건에 한해서만 최대 3회까지의 재시도를 보장하고 `SUCCESS` 나 `RUNNING` 상태의 재동작은 원천 격리함.
- **다계층 Execution Log 감사**: 자동화 시작부터 종료까지의 모든 세부 프로세스 단위(LOAD, FILTER, BUILD, VALIDATE, PLANNER) 마다 성공 여부 및 소요 밀리초(`duration_ms`) 감사 내역을 적재함.

---

## Sprint 5-2

- **평가 연산의 결정론적 순수 함수화**: 외부 요인(시간, 난수, API)을 차단하여 동일한 성과 지표 입력에 대해 항상 100% 동일한 점수 및 등급 결과를 보장하도록 `normalization.ts`, `grading.ts`, `calculator.ts`를 순수 함수로 개발함.
- **부팅 단계 가중치 합산 체크**: 잘못된 가중치 배분 설정이 데이터베이스에 적재되거나 서비스 계산에 사용되지 않도록, 가중치 총합이 100이 아닐 경우 프로세스를 강제 종료(`process.exit(1)`)하는 `validateWeights` 유효성 검사 모듈을 서버 시작점(`app.ts`)에 바인딩함.
- **복합 제약 및 인덱스를 활용한 피드백 이력 정규화**: 성과 스냅샷과 포뮬러 버전 단위의 멱등 계산을 보장하고자 `(performance_id, formula_version)` UNIQUE 제약조건을 이식하고, 시계열 히스토리 조회를 위해 BTREE 다차원 인덱스를 구성함.
- **재계산 버전 관리 메커니즘 수립**: 평가 계산 데이터가 이미 존재하는 상황에서 재계산 요청이 들어왔을 때, `calculation_version` 차수를 1씩 누적 증가시켜 이력을 추적하도록 트랜잭션 수립 및 Supabase 쿼리에 연동시킴.
- **Inner Join 조인 구조를 이용한 접근 제어 수립**: 피드백 및 상품, 워크스페이스 간 권한 검증에 따르는 복잡한 다중 DB 호출 오버헤드를 막기 위해 inner join SQL 형태의 verify 헬퍼를 리포지토리에 수립해 보안성을 강화함.

---

## Sprint 5-1

- **PL/pgSQL RPC를 통한 복합 멱등 Upsert 구현**: 동시성 이슈 및 락(Lock) 경쟁을 배제하고 단일 데이터베이스 트랜잭션 내에서 `product_performance`, `performance_metrics`, `performance_sources` 갱신 및 `performance_audit_logs` 생성 원자성을 보장하기 위해 PL/pgSQL 함수 `upsert_performance_foundation`을 구축함.
- **감사 로그 JSON 스키마 규격 수립**: 감사 로그 내 변경 추이를 정확히 추적할 수 있도록 `previous`와 `current` 스냅샷 구조를 정의한 JSON 스키마를 수립하고, Upsert/Update/Delete 시점에 자동 기록하도록 영속 레이어에 이식함.
- **Inner Join 활용 권한 검증 수립**: Service 단의 DI 복잡도를 제어하고 데이터베이스 측면에서 빠른 권한 식별을 보장하기 위해 SQL Inner Join 문을 활용하여 workspaces(org_id)와 actor_id 간 매칭을 수행하는 verify 헬퍼를 리포지토리에 수립함.
- **Domain Event Hook 지점 확보**: Sprint 5-2 연계를 위해 `PerformanceCreated`, `PerformanceUpdated`, `PerformanceDeleted` 훅 구조를 `hooks.ts` 파일로 분리하고 서비스 흐름 마감 단계에 결합해 둠.
- **ESM 확장자 호환을 위한 JS 명시**: ESM 환경의 번들 빌드 환경에 맞추어 `types`, `dto`, `schema`, `hooks` 등의 모듈 임포트 구문에 명시적으로 `.js` 확장자를 사용하도록 정렬함.

---

## Sprint 4-5

- **임포트 경로 충돌 우회를 위한 패키지 상대 임포트(Relative Import) 강제**: 루트의 `dashboard.py` 파일과 `dashboard/` 패키지명의 충돌을 피하기 위해, 패키지 내부에서는 무조건 `..api` 형식의 상대 임포트를 활용하여 결합도를 완전히 제거하고 독립적으로 구동 가능하게 설계함.
- **mypy 타입 검출을 위한 TypedDict 캐스팅(cast) 제어**: `response_mapper.py` 에서 JSON 파싱 리스트를 `List[StoryboardStep]`, `List[StoryboardScene]` 에 안전하게 대입하기 위해 `typing.cast`를 적용해 정적 검사를 완전 통과시킴.
- **SessionStateManager 데이터 형식 Optional[Any] 완화**: TypedDict DTO를 유연하게 수용하고 컴포넌트 간 Loosely Coupled 상태를 유지하도록 SessionStateManager 프로퍼티 타입을 느슨하게 확장함.
- **ErrorFormatter strict type check 선언**: `TimeoutError` 처럼 API 레벨에서 발생하는 예외를 `isinstance` 로 즉각 분기 판단해 NETWORK_ERROR 와 명확하게 식별하여 메시지를 사전 매핑하도록 보강함.
- **Memory Cache 전용 조회 캡슐화**: Mutation API는 캐시 대상에서 자동 차단하고, `workspaceId:productId:analysisId` 조합 캐시 키를 활용해 단일/결결적 캐싱 제어 스택 구축.

---

## Sprint 4-4

- **Image Generation Provider 인터페이스 추상화 및 다중 포맷 파싱**: Stable Diffusion, Gemini Image 등과의 자유로운 플러그인 교체를 위해 ImageGenerationProvider 인터페이스를 수립하고, FluxImageProvider에 Replicate output 및 BFL sample response 구조를 동시 수용하게 설계함.
- **스토리보드 Scene 8개 정합성 2차 유효성 검증(Custom Validation)**: Zod 의 기본 타입 파싱에 더해 step 1~8 순차 배치, 중복, 타입 및 이름 일치를 validator.ts에 구현해 LLM의 이탈 가능성을 완전 차단함.
- **zod-to-json-schema 동기화 아키텍처**: Zod Schema를 `zod-to-json-schema` 로 동적 변환하여 프롬프트에 주입하고 Validator도 이를 공유해 스키마 변경 시 두 요소가 100% 자동 동기화되도록 설계함.
- **Markdown 및 코드 블록 우회 정제**: LLM의 마크다운 포맷팅 위반에 대응하여, parser단에서 trim 및 brace tracking 을 탑재해 순수 JSON만 안전하게 통과시키도록 구현함.
- **Stateless Pure Layer 설계 및 AIProvider DI 의존성 주입**: DB, Repository, Rule Engine, Retry, Fallback 등 외부 요소를 격리하고 AI 호출부를 DI 방식으로 구성해 결합도를 원천 차단함.

---

## Sprint 4-3

- **8단계 스토리보드 정합성 2차 유효성 검증(Custom Validation)**: Zod 의 기본 타입 파싱에 더해 step 1~8 순차 배치, 중복, 타입 및 이름 일치를 validator.ts에 구현해 LLM의 이탈 가능성을 완전 차단함.
- **zod-to-json-schema 동기화 아키텍처**: Zod Schema를 `zod-to-json-schema` 로 동적 변환하여 프롬프트에 주입하고 Validator도 이를 공유해 스키마 변경 시 두 요소가 100% 자동 동기화되도록 설계함.
- **Markdown 및 코드 블록 우회 정제**: LLM의 마크다운 포맷팅 위반에 대응하여, parser단에서 trim 및 brace tracking 을 탑재해 순수 JSON만 안전하게 통과시키도록 구현함.
- **Stateless Pure Layer 설계 및 AIProvider DI 의존성 주입**: DB, Repository, Rule Engine, Retry, Fallback 등 외부 요소를 격리하고 AI 호출부를 DI 방식으로 구성해 결합도를 원천 차단함.
- **결정론적 프롬프트 조립**: 프롬프트 생성 시 Date, Random, Env의 개입을 금지하여 동일 입력 시 항상 동일한 프롬프트 문자열을 100% 결정론적으로 반환하도록 설계함.

---

## Sprint 4-2

- **zod-to-json-schema 동기화 아키텍처**: Zod Schema를 `zod-to-json-schema` 로 동적 변환하여 프롬프트에 주입하고 Validator도 이를 공유해 스키마 변경 시 두 요소가 100% 자동 동기화되도록 설계함.
- **Markdown 및 코드 블록 우회 정제**: LLM의 마크다운 포맷팅 위반에 대응하여, parser단에서 trim 및 brace tracking 을 탑재해 순수 JSON만 안전하게 통과시키도록 구현함.
- **Stateless Pure Layer 설계 및 AIProvider DI 의존성 주입**: DB, Repository, Rule Engine, Retry, Fallback 등 외부 요소를 격리하고 AI 호출부를 DI 방식으로 구성해 결합도를 원천 차단함.
- **결정론적 프롬프트 조립**: 프롬프트 생성 시 Date, Random, Env의 개입을 금지하여 동일 입력 시 항상 동일한 프롬프트 문자열을 100% 결정론적으로 반환하도록 설계함.
- **엄격한 스키마 위반 감지(strict)**: Zod 스키마 선언 시 `.strict()`를 설정하고 Validator 단에서 ZodError를 예외 throw 처리하여 LLM의 임의 필드 생성을 원천 차단함.

---

## Sprint 4-1

- **Stateless Pure Function 룰 엔진 모듈 설계**: DB, AI, 외부 리소스를 일절 격리하여 순수 입력과 출력만 전담하는 Stateless 계산 모듈 `rule-engine`을 신설함.
- **비선형 지표 선형 정규화 및 스케일링**: 스케일이 서로 다른 `reviewVolume` 과 `marketGrowth` raw value를 `constants.ts` 의 SCALING_RULES 로 선형 변환하여 정밀한 가중합을 계산하도록 처리함.
- **규칙 테이블(Rule Table) 기반 등급 분기 설계**: 등급 계산 시 if-else 체인을 사용하지 않고 `GRADE_RULES` 배열 데이터를 find로 탐색하는 구조를 취해 AA/AAA 등급 추가 확장성을 보장함.
- **거리 정렬을 활용한 최소 Reason 3개 보장**: 긍정/부정 임계치(80/40) 매칭 사유가 3개 미만 시, 각 지표와 임계치의 거리가 가장 가까운 것부터 보간해 최소 3개 및 최대 10개 사유를 priority 순으로 정렬 리턴하도록 구축함.
- **딥 카피 기반 원본 불변성 보장**: `engine.ts` 진입점에서 인풋 파라미터를 딥 카피한 후 계산 연산자들에 바인딩하여 룰 엔진 작동 시 외부 원본 객체 오염 가능성을 완전히 차단함.
