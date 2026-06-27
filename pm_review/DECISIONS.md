# Project Decisions

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

---

## Sprint 3-8

- **AI 분석 결과 영속성 및 캐시 정책 도입**: 동일한 조건의 AI 분석 요청에 대해 AI API를 다시 호출하지 않고 데이터베이스의 영속성 결과를 캐싱하여 즉시 반환하고, `"cached": true | false` 응답 메타데이터를 통합 제공함.
- **Identity Generator 컴포넌트 신설 및 SHA-256 해싱**: 캐시 판단의 기준이 되는 Identity 생성(Canonical String 조립 및 SHA-256 해싱) 역할을 전담하는 `IdentityGenerator` 를 신설하여 비즈니스 서비스 계층과의 결합도를 제거함.
- **Repository 및 Service 레이어 엄격 분리**: `AIAnalysisRepository`는 순수 Supabase 데이터 CRUD만을 담당하고 AI 호출이나 유효성 검사, 비즈니스 판단 등은 일절 배제하여 모듈 독립성 및 Repository 원칙을 준수함.
- **API 쿼리 및 Params 유효성 검증 통합**: 쿼리 API 2종(`GET /analysis`, `GET /analysis/:id`)을 추가하고 Zod 스키마 검증(UUID 포맷, keyword 등)을 preValidation 훅에 장착함.

---

## Sprint 3-7

- **AI 분석 영속 저장 배제 정책**: 이번 스프린트에서는 데이터 저장을 완전히 금지하고 분석 수행 후 API Response까지만 결과를 구성해 반환하도록 아키텍처를 단순화함.
- **Token Manager 컴포넌트 신설 및 Truncation**: 프롬프트 토큰 계산(`Math.ceil(length / 3)`) 및 최대 토큰 제한(4096 tokens)을 도입하고, 토큰 한계 초과 시 수집 일시(`collected_at`)를 기준으로 정렬하여 최신 리뷰는 유지하고 초과 분을 절단하는 기능을 TokenManager에 설계함.
- **AI Provider Framework 및 Request Options 표준화**: `AIProvider` 인터페이스 시그니처에 `options: AIRequestOptions`를 통합 적용하여 모델 정보, 온도(`0.2`), 타임아웃(`60초`), 최대 출력 토큰(`4096`), 버전(`v1`) 등을 유연하게 주입받도록 구성함.
- **다단계 유효성 검증 적용**: AI 응답의 구조 및 신뢰성을 검증하기 위해 Zod schema validation과 긍정/부정 비율 백분율 합산 100% 조건 불충족 시 `AIResponseValidationError`를 throw 하는 Business validation 레이어를 통합함.
- **무의존성 Gemini Provider 이식**: 외부 npm 의존성을 늘리지 않고 native fetch와 AbortController를 사용하여 60초 Timeout, 2회 Retry, Exponential Backoff를 안전하게 처리함.

---

## Sprint 3-6

- **Database Freeze 원칙 준수**: 스키마 변경, 신규 컬럼 추가 및 마이그레이션 생성을 완전히 지양하고, 기존 `customer_reviews` 테이블의 NOT NULL 외래키 제약조건(`run_id`) 충족을 위해 DB 내 기존 `run_id` 동적 바인딩 및 fallback UUID 장치를 통해 데이터 삽입을 처리함.
- **Exponential Backoff Retry 및 AbortController Timeout 적용**: HTTP 429/403/Timeout 에러 발생 시 최대 3회 재시도를 지원하며 Exponential Backoff (1초 -> 2초 -> 4초) 및 요청당 최대 10초 타임아웃 제한을 Naver Shopping Provider에 적용하여 회복성을 강화함.
- **Deterministic UUID 생성기를 통한 Duplicate 감지**: 중복 리뷰가 데이터베이스의 composite primary key `(review_id, collected_at)` 상에서 동일 UUID 충돌을 일으키도록 `provider`, `productId`, `reviewId` 조합의 SHA-256 해싱 deterministic UUID 생성기를 Mapper에 설계함.
- **의존성 추가 배제 목적의 Node.js 내장 fetch 및 AbortController 활용**: `axios` 설치를 피해 패키지 종속성을 최소화하고자 Node.js v18+ 글로벌 내장 fetch 및 AbortController API를 도입함.
- **Crawl API 역할 한정**: AI 분석 및 감성 분석을 제외하고 순수 수집/매핑/DB 적재 및 결과 카운트 반환 단계로만 역할을 한정하여 파이프라인의 결합도를 낮춤.

---

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
- **마켓 메트릭 다단계 조인 소유주 필터링**: `market_metrics` 테이블 and `workspaces`의 `org_id`를 연결하는 조인 경로 필터링을 Repository 단에 적용함.
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
