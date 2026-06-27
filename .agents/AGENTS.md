# Agent Rules & Guidelines

## PM Review 문서 운영 규칙

### Sprint 종료 시 반드시 수행한다.

모든 Sprint가 완료되면 아래 문서를 항상 최신 상태로 갱신한다.

```
pm_review/
├── REVIEW.md
├── CONTEXT.md
└── DECISIONS.md
```

### REVIEW.md
매 Sprint 종료 시 반드시 갱신한다.
포함 내용:
* Sprint 정보
* 구현 내용
* 변경 파일
* 테스트 결과
* Self Review
* Known Issues

### CONTEXT.md
매 Sprint 종료 시 반드시 갱신한다.
항상 다음 정보를 최신 상태로 유지한다:
* Project Summary
* Current Goal
* Current Progress
* Recent Decisions
* Pending Review
* Next Action
* Current Blockers
* Important Notes

다음 ChatGPT 세션에서 프로젝트를 이어가기 위한 공식 인계 문서로 사용한다.

### DECISIONS.md
프로젝트의 중요한 설계 의사결정을 누적 기록한다.
운영 규칙:
* 기존 내용 삭제 금지
* Sprint별로 계속 추가
* 아키텍처 변경, 기술스택 변경, 정책 변경, 데이터 구조 변경, API 정책 변경, 보안 정책 변경 등 장기적으로 의미 있는 결정만 기록한다.

### PM_REVIEW.md
PM(Project Manager) 전용 문서이다.
Antigravity는 최초 템플릿만 생성하며 내용을 수정하지 않는다.
Sprint 완료 후 ChatGPT(Project Manager)가 코드 리뷰 결과를 기록한다.

### 제출 규칙
Sprint 종료 후 반드시 아래 산출물을 제출한다:
* `backend_review.zip`
* `pm_review/REVIEW.md`
* `pm_review/CONTEXT.md`
* `pm_review/DECISIONS.md`

PM_REVIEW.md는 ChatGPT(Project Manager)가 작성 후 프로젝트에 반영한다.
