# DESIGN_TOKEN.md

# 디자인 토큰 명세서 (Design Tokens Specification)

본 문서는 **AI Product Intelligence Platform**의 시각 스타일 속성을 표준화한 디자인 토큰 정의서이다. 이 토큰 정의는 `design-tokens.json`으로 구조화되며, Next.js의 Tailwind CSS 테마 확장 파트에 일대일 매핑된다.

---

## 1. 색상 팔레트 (Color Palette)

우리는 신뢰감 있고 미래지향적인 프리미엄 톤을 제공하기 위해 **슬레이트(Slate)**를 배경 기본값으로 하는 다크 테마 위주로 설계하고, **인디고(Indigo)**와 **에메랄드(Emerald)**를 메인 강조 컬러로 설정한다.

| 카테고리 | 토큰 키 (Tailwind Key) | HSL 값 / 대표 색상 | 설명 |
|:---|:---|:---|:---|
| **배경색 (Background)** | `background` | `hsl(222.2, 84%, 4.9%)` | 메인 레이아웃 다크 배경색 |
| | `card` | `hsl(222.2, 84%, 7.5%)` | 대시보드 카드 배경색 |
| **전경색 (Foreground)** | `foreground` | `hsl(210, 40%, 98%)` | 기본 텍스트 하이라이트색 |
| | `muted-foreground`| `hsl(215.4, 16.3%, 56.9%)` | 설명, 캡션용 연한 회색 |
| **주요 브랜드 (Primary)** | `primary` | `hsl(263.4, 70%, 50.4%)` | 로열 인디고 (기획 시작, 핵심 버튼) |
| **성공/환류 (Success)** | `success` | `hsl(142.1, 76.2%, 36.3%)` | 성과 갱신, S등급, 피드백 완료 배지 |
| **경고/재시도 (Warning)** | `warning` | `hsl(47.9, 95.8%, 53.1%)` | Quota 한도 임계치 도달, Circuit Half-open |
| **위험/취소 (Destructive)** | `destructive` | `hsl(0, 84.2%, 60.2%)` | API 에러, Circuit Open, 삭제 작업 경고 |
| **테두리 (Border)** | `border` | `hsl(217.2, 32.6%, 17.5%)` | 카드 및 입력창 테두리 분할선 |

---

## 2. 타이포그래피 스케일 (Typography Scales)

글꼴 크기와 행간 스택 정의서이다.

* **Base Font Family**: `Inter, Pretendard, sans-serif`
* **Size & Line-Height Scale**:
  - `text-xs`: 크기 `0.75rem` (12px) | 행간 `1rem`
  - `text-sm`: 크기 `0.875rem` (14px) | 행간 `1.25rem`
  - `text-base`: 크기 `1rem` (16px) | 행간 `1.5rem`
  - `text-lg`: 크기 `1.125rem` (18px) | 행간 `1.75rem`
  - `text-xl`: 크기 `1.25rem` (20px) | 행간 `1.75rem`
  - `text-2xl`: 크기 `1.5rem` (24px) | 행간 `2rem`
  - `text-3xl`: 크기 `1.875rem` (30px) | 행간 `2.25rem`

---

## 3. 효과 토큰 (Effects: Radius & Shadow)

컴포넌트의 둥글기 강도와 그림자 입체감 규격이다.

### 3.1. 모서리 둥글기 (Border Radius)
* `radius-sm`: `0.25rem` (4px) - 체크박스, 작은 배지
* `radius-md`: `0.5rem` (8px) - 폼 입력창, 버튼, 작은 팝업
* `radius-lg`: `0.75rem` (12px) - 대시보드 카드 모듈
* `radius-xl`: `1.0rem` (16px) - 메인 모달창, 퀵 가이드 배너

### 3.2. 그림자 및 입체 효과 (Box Shadow)
* `shadow-sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)` - 일반 버튼
* `shadow-md`: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` - 카드
* `shadow-lg`: `0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` - 모달 및 드롭다운 메뉴
