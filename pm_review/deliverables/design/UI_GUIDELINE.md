# UI_GUIDELINE.md

# 핵심 UI 가이드라인 (UI Guideline)

본 문서는 **AI Product Intelligence Platform**의 시각적 일관성과 웹 접근성(WCAG 2.1 AA)을 충족하기 위한 디자인 시스템 원칙을 규정한다. 본 가이드는 Tailwind CSS와 shadcn/ui 테마 설정의 기초가 된다.

---

## 1. 그리드 및 여백 시스템 (Grid & Spacing)

### 1.1. 반응형 레이아웃 그리드
* **Desktop (1280px 이상)**: 12 컬럼 그리드, 좌우 여백 `32px` (`px-8`), 컬럼 간격(Gap) `24px` (`gap-6`).
* **Tablet (768px ~ 1023px)**: 8 컬럼 그리드, 좌우 여백 `24px` (`px-6`), 컬럼 간격 `16px` (`gap-4`).
* **Mobile (767px 이하)**: 4 컬럼 그리드 (또는 1열 세로 적재), 좌우 여백 `16px` (`px-4`), 컬럼 간격 `12px` (`gap-3`).

### 1.2. 여백 스케일 (Spacing Scale)
여백은 4의 배수 시스템을 준수한다.
* `4px` (`space-1`) - 컴포넌트 내부 텍스트와 배지 사이 여백
* `8px` (`space-2`) - 카드 내부 헤더와 컨텐츠 사이 여백
* `16px` (`space-4`) - 일반적인 패딩 및 마진 기본값
* `24px` (`space-6`) - 카드와 카드 사이 간격
* `32px` (`space-8`) - 레이아웃 섹션 간의 여백

---

## 2. 타이포그래피 (Typography)

기본 서체는 Google Fonts의 **Inter** (영문/숫자) 및 **Pretendard** (국문)를 혼용하며, 시스템 폰트 스택을 사용한다.

| 토큰명 | 크기 (Rem / Px) | 자간 (Letter-spacing) | 굵기 (Font-weight) | 주로 사용하는 곳 |
|:---|:---|:---|:---|:---|
| `display-1` | `2.25rem` (36px) | `-0.02em` | Bold (700) | 홈 대시보드 타이틀 |
| `h-1` | `1.875rem` (30px) | `-0.02em` | Bold (700) | 상품 상세 타이틀 |
| `h-2` | `1.5rem` (24px) | `-0.019em` | SemiBold (600) | 카드 영역 대제목 |
| `body-large`| `1.125rem` (18px) | `-0.011em` | Regular (400) | 설명 텍스트, 피드 본문 |
| `body-base` | `1.0rem` (16px) | `-0.011em` | Regular (400) | 기본 테이블 텍스트 |
| `caption` | `0.875rem` (14px) | `0em` | Medium (500) | 배지, 타임스탬프, 캡션 |

---

## 3. 웹 접근성 및 대비 표준 (WCAG 2.1 AA)

* **텍스트 대비**: 일반 텍스트는 배경과의 명도비가 **4.5:1 이상**이어야 한다. 큰 텍스트(24px 이상)는 **3:1 이상**이어야 한다.
* **비텍스트 요소**: 버튼, 폼 테두리, 아이콘 등 핵심 UI 구성 요소는 배경 대비 **3:1 이상**이어야 한다.
* **상태 시각화**: Hover, Active, Focus 상태는 단순히 색상 변화뿐만 아니라, 테두리(Outline), 밑줄(Underline), 또는 그림자 효과를 병행하여 색약 사용자도 구분할 수 있도록 렌더링한다.
  - 예: 포커스된 버튼 ➡️ `outline-2 outline-offset-2 outline-indigo-600` 테두리 가이드 강제 적용.
