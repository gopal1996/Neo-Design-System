# Neo Mobile Design System

**Platform:** React Native (Expo SDK 52)
**Package:** `@neo/mobile`
**Color mode:** Dark-only · **Grid:** 4px · **Brand:** Black + Violet (#7C3AED)

---

## Documentation Index

| File | Contents |
|------|----------|
| [`tokens.json`](./tokens.json) | Machine-readable token definitions (colors, spacing, radii, typography) |
| [`registry.json`](./registry.json) | Machine-readable component registry (props, variants, examples) |
| [`ai-context.md`](./ai-context.md) | Code generation guide — import patterns, copy-paste snippets, do-not rules |
| [`context.md`](./context.md) | This file — system overview and component index |

### Component Context Files

Each component folder contains its own `context.md` with full API details, size/variant tables, and usage examples.

| Component | File |
|-----------|------|
| AppBar | [`src/components/AppBar/context.md`](./src/components/AppBar/context.md) |
| Avatar / AvatarGroup | [`src/components/Avatar/context.md`](./src/components/Avatar/context.md) |
| Badge | [`src/components/Badge/context.md`](./src/components/Badge/context.md) |
| Banner | [`src/components/Banner/context.md`](./src/components/Banner/context.md) |
| BottomNavigation | [`src/components/BottomNavigation/context.md`](./src/components/BottomNavigation/context.md) |
| Button | [`src/components/Button/context.md`](./src/components/Button/context.md) |
| Card | [`src/components/Card/context.md`](./src/components/Card/context.md) |
| Checkbox | [`src/components/Checkbox/context.md`](./src/components/Checkbox/context.md) |
| DataTable | [`src/components/DataTable/context.md`](./src/components/DataTable/context.md) |
| Divider | [`src/components/Divider/context.md`](./src/components/Divider/context.md) |
| FAB | [`src/components/FAB/context.md`](./src/components/FAB/context.md) |
| Input | [`src/components/Input/context.md`](./src/components/Input/context.md) |
| Radio | [`src/components/Radio/context.md`](./src/components/Radio/context.md) |
| Spinner | [`src/components/Spinner/context.md`](./src/components/Spinner/context.md) |
| Switch | [`src/components/Switch/context.md`](./src/components/Switch/context.md) |
| Tabs / TabPanel | [`src/components/Tabs/context.md`](./src/components/Tabs/context.md) |
| Text | [`src/components/Text/context.md`](./src/components/Text/context.md) |

---

## Token Summary

Full definitions in [`tokens.json`](./tokens.json) and `src/tokens/index.ts`.

### Key Color Tokens

| Token              | Value     | Usage                    |
|--------------------|-----------|--------------------------|
| `colors.bgBase`    | `#000000` | Screen background         |
| `colors.bgElevated`| `#0F0F1A` | Cards, input fields       |
| `colors.violet500` | `#7C3AED` | Primary brand / CTA       |
| `colors.violet400` | `#8B5CF6` | Interactive elements      |
| `colors.violet300` | `#A78BFA` | Active states, accents    |
| `colors.textPrimary`| `#F0F0F8`| Body copy                 |
| `colors.textSecondary`| `#9898B3`| Labels, subtext          |
| `colors.border`    | `#2C2C4A` | Default borders           |
| `colors.success`   | `#10B981` | Success semantic          |
| `colors.warning`   | `#F59E0B` | Warning semantic          |
| `colors.error`     | `#EF4444` | Error semantic            |
| `colors.info`      | `#06B6D4` | Info semantic             |

### Spacing (4px grid, dp)

`spacing[1]=4` · `spacing[2]=8` · `spacing[3]=12` · `spacing[4]=16` · `spacing[6]=24` · `spacing[8]=32` · `spacing[12]=48`

### Radii (dp)

`radii.sm=4` · `radii.md=8` · `radii.lg=12` · `radii.xl=16` · `radii.full=9999`

---

## Component Overview

| Component | Variants | Sizes | Notes |
|-----------|----------|-------|-------|
| Button | primary / secondary / ghost / danger / success | xs–xl | forwardRef, loading state |
| Text | display / h1–h5 / body-lg / body / body-sm / caption / overline / mono | — | 8 color options |
| Badge | default / brand / success / warning / error / info / outline | sm–lg | dot indicator |
| Avatar | — | xs–2xl | Image, initials, placeholder; status dot |
| AvatarGroup | — | xs–2xl | Overlap stack, "+N" overflow |
| Card | default / elevated / brand / flat | padding: none–xl | CardHeader/Body/Footer sub-components |
| Input | — | sm–lg | forwardRef, focus/error/disabled states |
| Switch | — | sm–lg | Controlled + uncontrolled |
| Spinner | ring / dots / pulse | xs–xl | `progressbar` a11y role |
| Tabs | line / pill / enclosed | — | TabPanel, badge, disabled tabs |
| Divider | default / subtle / strong / brand | — | Horizontal + vertical, label |
| Checkbox | — | sm–lg | Indeterminate, controlled + uncontrolled |
| Radio | — | sm–lg | Cannot deselect; use group pattern |
| AppBar | default / transparent / elevated | — | Status bar aware, back + action sub-components |
| Banner | info / success / warning / error | — | 2 actions, dismiss, custom icon |
| BottomNavigation | — | — | Spring animation, badge, safe area |
| FAB | primary / secondary / surface | sm–lg | Extended (pill) form with label |
| DataTable | — | — | Sort, search, pagination, custom cells |

---

## File Structure

```
mobile/
├── src/
│   ├── tokens/index.ts            # colors, spacing, radii, typography, hitSlop
│   ├── index.ts                   # public barrel export
│   └── components/
│       ├── AppBar/
│       │   ├── AppBar.tsx
│       │   ├── AppBar.stories.tsx
│       │   ├── index.ts
│       │   └── context.md         ← component-specific docs
│       ├── Avatar/ …
│       ├── Badge/ …
│       ├── Banner/ …
│       ├── BottomNavigation/ …
│       ├── Button/ …
│       ├── Card/ …
│       ├── Checkbox/ …
│       ├── DataTable/ …
│       ├── Divider/ …
│       ├── FAB/ …
│       ├── Input/ …
│       ├── Radio/ …
│       ├── Spinner/ …
│       ├── Switch/ …
│       ├── Tabs/ …
│       └── Text/ …
├── .rnstorybook/                  # Storybook v10 config
├── tokens.json                    # Machine-readable tokens
├── registry.json                  # Machine-readable component registry
├── ai-context.md                  # AI code generation guide
└── context.md                     # This file
```

---

## Accessibility

- All interactive elements have `accessibilityRole`
- Form controls use `accessibilityState` (`checked`, `disabled`, `selected`)
- Icon-only buttons require `accessibilityLabel`
- Error messages use `accessibilityRole="alert"`
- Minimum touch target: 44×44 dp — use exported `hitSlop` for smaller elements

---

## Storybook

```bash
cd mobile
npm run storybook             # start on device/simulator
npm run storybook:ios
npm run storybook:android
npm run storybook-generate    # regenerate story index after adding stories
```

Config: `.rnstorybook/` · Version: `@storybook/react-native` v10 · Stories: `src/components/**/*.stories.tsx`

---

## Key Rules

- Import only from `@neo/mobile` — never recreate components
- Never hardcode hex colors — use `colors.*` tokens
- Never use light/white backgrounds — dark-only system
- Always pass `safeAreaBottom` / `safeAreaTop` from `useSafeAreaInsets()`
- Minimum touch target: 44×44 dp
