# Project Decisions

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
