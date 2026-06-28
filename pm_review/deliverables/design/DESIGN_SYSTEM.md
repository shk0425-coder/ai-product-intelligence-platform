# DESIGN_SYSTEM.md

# 디자인 시스템 가이드라인 (Design System Guidelines)

본 문서는 Tailwind CSS와 **shadcn/ui** 컴포넌트 프레임워크를 기반으로 본 플랫폼의 디자인 시스템 구성 요소와 규칙을 명시한다.

---

## 1. 테마 적용 및 확장 (Tailwind CSS Configuration)

프론트엔드 프로젝트의 `tailwind.config.js` 설정 파일에 디자인 토큰(`design-tokens.json`) 값을 주입하는 표준 방식이다.

```javascript
// tailwind.config.js 예제 구성
const { colors, borderRadius, boxShadow, typography } = require('./design/tokens/design-tokens.json');

module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: colors.border,
        input: colors.input,
        ring: colors.ring,
        background: colors.background,
        foreground: colors.foreground,
        primary: {
          DEFAULT: colors.primary.default,
          foreground: colors.primary.foreground,
        },
        success: {
          DEFAULT: colors.success.default,
          foreground: colors.success.foreground,
        },
        warning: {
          DEFAULT: colors.warning.default,
          foreground: colors.warning.foreground,
        },
        destructive: {
          DEFAULT: colors.destructive.default,
          foreground: colors.destructive.foreground,
        },
        card: {
          DEFAULT: colors.card,
          foreground: colors.foreground,
        }
      },
      borderRadius: {
        lg: borderRadius.lg,
        md: borderRadius.md,
        sm: borderRadius.sm,
      },
      boxShadow: {
        sm: boxShadow.sm,
        md: boxShadow.md,
        lg: boxShadow.lg,
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

---

## 2. shadcn/ui 컴포넌트 매핑 표준

우리는 기본 UI 구성을 위해 다음 10가지 핵심 shadcn/ui 컴포넌트를 차용하고 커스터마이징을 수행한다.

1. **Button (`/components/ui/button.tsx`)**
   - Variant: `default` (Primary Indigo), `secondary` (Slate Neutral), `outline`, `destructive`, `ghost`.
   - Hover transition: `transition-all duration-200 ease-in-out active:scale-95`.
2. **Card (`/components/ui/card.tsx`)**
   - 대시보드의 기본 단위를 격리하는 요소.
   - Style: `bg-card text-card-foreground border border-border shadow-md rounded-lg p-6`.
3. **Dialog / Modal (`/components/ui/dialog.tsx`)**
   - 상세 분석 모달, 확인 폼 등에 적용.
   - Style: `rounded-xl shadow-lg border border-border bg-card max-w-lg`.
4. **Table (`/components/ui/table.tsx`)**
   - 상품 목록, 감사 로그 등의 대량 데이터 표현용.
   - Style: `w-full border-collapse text-left text-sm`.
5. **Tabs (`/components/ui/tabs.tsx`)**
   - 상품 내부 화면(분석/기획/성과) 전환용.
   - Style: `bg-muted rounded-md p-1 grid w-full`.
6. **Progress (`/components/ui/progress.tsx`)**
   - 수집률, Quota 사용량 표시용.
   - Style: `bg-muted rounded-full overflow-hidden h-2`.
7. **Badge (`/components/ui/badge.tsx`)**
   - S~D 등급, Severity 표시용.
   - Variant: `success` (S/A등급), `warning` (B/C등급), `destructive` (D등급).
8. **Toast (`/components/ui/use-toast.ts`)**
   - 완료 알림, 경고 토스트.
9. **Dropdown Menu (`/components/ui/dropdown-menu.tsx`)**
   - 워크스페이스 스위처, 정렬 필터.
10. **Tooltip (`/components/ui/tooltip.tsx`)**
    - 마우스 오버 시 AI 추천 근거, Quota 세부 수치 설명 제공.
