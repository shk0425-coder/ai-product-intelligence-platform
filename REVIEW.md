# REVIEW.md (Sprint 2-5 Strategy / Creative Domain DDL Review)

본 문서는 **Sprint 2-5 (Strategy / Creative Domain DDL)** 완료 후, **ChatGPT (Project Manager)**의 효율적인 코드 리뷰와 승인을 지원하기 위해 자동으로 생성된 스프린트 리뷰 표준 요약서입니다.

---

## 1. Sprint 정보
* **Sprint 번호**: Sprint 2-5
* **대상 Domain**: Strategy & Creative Domain (사업 전략 및 크리에이티브 시각 기획안 결과 저장)
* **Commit Message**: `feat(strategy): Sprint 2-5 Strategy / Creative Domain DDL`

---

## 2. 변경된 파일
이번 스프린트에서 신규 작성된 4대 마이그레이션 DDL 파일 목록입니다.

* [20_strategy_tables.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/20_strategy_tables.sql): product_strategies, creative_briefs 테이블 생성 및 컬럼 Comments 추가
* [21_strategy_constraints.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/21_strategy_constraints.sql): PK, UQ, FK 제약조건 연결 (1:1 유니크 제약조건 및 ON DELETE CASCADE 포함)
* [22_strategy_indexes.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/22_strategy_indexes.sql): FK 성능 튜닝을 위한 B-tree 인덱스 및 검색 대상인 storyboard에 대한 GIN 인덱스 생성
* [23_strategy_triggers.sql](file:///Users/kimsanghyeon/Projects/앱개발/naver_shopping_dashboard/database/migrations/23_strategy_triggers.sql): updated_at 배제 요건에 따른 트리거 생략 명시 및 멱등성 플레이스홀더 파일 작성

---

## 3. 변경 요약
* **정규화 및 1:1 무결성 제약조건 수립**:
  * `product_strategies`와 `creative_briefs` 두 테이블의 `run_id` 컬럼에 각각 `UNIQUE` 제약조건을 부여하여, 분석 실행 이력(`analysis_runs`)당 단 1건의 전략 기획서와 크리에이티브 기획서만 적재되도록 물리적 1:1 관계를 보장했습니다.
  * `ON DELETE CASCADE` 설정을 적용하여, 다중 테넌트 파괴 또는 분석 실행 삭제 시 하위 생성 데이터가 연쇄적으로 깔끔하게 정리되도록 보장했습니다.
* **선택적 GIN 인덱스 튜닝**:
  * 무분별하게 모든 JSONB 컬럼에 GIN 인덱스를 생성하는 대신, 프로젝트 요구사항 및 아키텍처 맥락상 명확한 검색 대상인 `creative_briefs` 테이블의 대용량 `storyboard` JSONB 컬럼에만 `USING GIN` 인덱스를 생성했습니다.
  * 검색 대상이 아닌 다른 JSONB 컬럼들(`target_segment`, `product_concept`, `core_usps` 및 `thumbnail_guide`)에 대해서는 인덱스 오버헤드를 막기 위해 GIN 인덱스 생성을 배제했습니다.
* **코멘트(Comment) 표준화**:
  * 유지보수 편의성과 데이터 거버넌스를 위해 모든 테이블 및 컬럼에 직관적인 한글 `COMMENT ON TABLE` 및 `COMMENT ON COLUMN`을 누락 없이 작성했습니다.

---

## 4. Migration 정보
* **생성된 Migration 파일**: `database/migrations/20_strategy_tables.sql` ~ `23_strategy_triggers.sql`
* **실행 순서**: 파일 번호 순서(20 -> 21 -> 22 -> 23)로 순차 실행됩니다.
* **기존 Migration 수정 여부**:
  > [!IMPORTANT]
  > 기존 스프린트 2-1부터 2-4까지 생성된 01~19번 마이그레이션 파일은 **단 한 줄도 수정하지 않았음**을 보장합니다.

---

## 5. Self Review (자체 검증 결과)
* [x] **PostgreSQL 16 호환**: PostgreSQL 16 표준 구문, JSONB 데이터 타입, GIN 인덱싱 문법을 모두 준수함.
* [x] **Supabase SQL Editor 실행 가능**: 멱등적 선언(IF NOT EXISTS)과 적절한 데이터베이스 스키마 지정을 통해 Supabase 상에서 부작용 없이 한 번에 실행 가능함을 확인함.
* [x] **FK 순환참조 없음**: 참조 흐름이 `analysis_runs` ➡️ `product_strategies` 및 `analysis_runs` ➡️ `creative_briefs` 단방향으로만 흘러 순환 참조가 존재하지 않음을 확인함.
* [x] **Trigger 정상 동작**: `updated_at` 컬럼이 없는 생성용 스냅샷 테이블이므로, trigger update를 생략하고 placeholder 주석으로 순서를 유지함.
* [x] **Migration 순서 오류 없음**: 테이블 생성(20) ➡️ 제약조건(21) ➡️ 인덱스(22) ➡️ 트리거(23) 순서의 선언형 의존 관계가 철저히 지켜짐.
* [x] **Index 중복 없음**: 자동 생성되는 기본키/유니크 인덱스 외에 수동 B-tree 및 GIN 인덱스가 겹치지 않게 설계됨.
* [x] **빈 Database에서 실행 가능**: 01번부터 23번까지 순차 실행 시 외래키 참조 에러 없이 원스톱 실행이 가능한 구조임을 보장함.
* [x] **Architecture와 차이 없음**: `database_architecture.md v1.1 Final` 사양에 정의된 컬럼, JSONB 구조, NULL 규격과 완전히 일치함.

---

## 6. Known Issues
```text
None
```

---

## 7. Review Request (PM 검토 요청 사항)
ChatGPT PM은 효율적인 승인을 위해 아래 핵심 설계 요소를 우선하여 검토해 주십시오.

1. **1:1 관계 제약 무결성**: 각 테이블의 `run_id`에 적용된 UNIQUE 및 FOREIGN KEY 제약 조건이 1:1 관계 비즈니스 룰을 충족하는지 검토.
2. **선택적 GIN 인덱스 적용**: 모든 JSONB 대신 검색 대상인 `storyboard` 컬럼에만 GIN 인덱스를 설정한 부분의 적합성 검토.
3. **Comment 및 네이밍 표준화**: 테이블, 컬럼 코멘트 명세 및 제약조건/인덱스 명명 규칙 준수 여부 검토.

---

## 8. Strategy / Creative Domain ERD (Entity Relationship Diagram)
```mermaid
erJoke
erDiagram
    analysis_runs ||--|| product_strategies : "formulates (1:1)"
    analysis_runs ||--|| creative_briefs : "drafts (1:1)"
    
    product_strategies {
        uuid strategy_id PK
        uuid run_id FK, UK
        jsonb target_segment
        jsonb product_concept
        jsonb core_usps
    }
    
    creative_briefs {
        uuid brief_id PK
        uuid run_id FK, UK
        text hero_copy
        jsonb storyboard
        jsonb thumbnail_guide
    }
```

---

## 9. 산출물 추가 Summary

| 항목 | 개수 |
| --- | --- |
| Tables | 2 |
| Constraints | 6 |
| Indexes | 3 (B-tree 2, GIN 1) |
| Triggers | 0 (생략 명시) |
