# Neo Design System — AI Context

> This file is machine-readable context for AI tools (Claude, Copilot, Cursor).
> Reference it when generating, editing, or reviewing components in this codebase.

---

## 1. System Overview

### Purpose
Neo is a dark-mode-first, production-grade design system built for modern SaaS and dashboard products. It provides a consistent set of React components, design tokens, and styling conventions that ensure visual coherence and accessibility across all surfaces.

### Tech Stack
| Layer | Technology |
|---|---|
| UI framework | React 18+ with TypeScript |
| Styling | Tailwind CSS v3 (utility-first, no CSS-in-JS) |
| Class composition | `cn()` utility — `clsx` + `tailwind-merge` |
| Component docs | Storybook (React + Vite) |
| Token format | `tokens.json` (W3C DTCG spec) |
| Component registry | `registry.json` (AI-readable component manifest) |

### Target Projects
- SaaS web applications (dashboard, settings, admin panels)
- Internal tooling and data-heavy interfaces
- React-based single-page and Next.js applications

### Design Identity
- **Palette:** Black (`#000000`) + Violet (`#7C3AED`) + purple-tinted neutrals
- **Mode:** Dark only — no light mode variants
- **Font:** Inter (UI), JetBrains Mono (code/numeric)
- **Tone:** Premium, technical, high-contrast

---

## 2. Naming Conventions

### Components
- All components use **PascalCase**: `Button`, `AvatarGroup`, `DatePicker`
- Compound sub-components are named `ParentSub`: `CardHeader`, `CardBody`, `CardFooter`
- Each component lives in its own directory: `src/components/ComponentName/`

### Files Per Component Directory
```
src/components/Button/
├── Button.tsx          # Component implementation
├── Button.module.css   # CSS Modules (if non-Tailwind styles are needed)
└── index.ts            # Re-export: export * from './Button'
```

### CSS Classes
- **Always** use Tailwind semantic token classes — never raw hex values or inline styles for color
- Use `cn()` to compose conditional classes: `cn('base-classes', condition && 'conditional-class')`
- Color classes follow the pattern: `text-content-{level}`, `bg-surface-{level}`, `border-stroke-{modifier}`
- **Never** write `text-[#A78BFA]` or `bg-[#000000]` — always use the token class

### Props
| Prop | Convention | Examples |
|---|---|---|
| Visual style | `variant` | `'primary' \| 'secondary' \| 'ghost'` |
| Physical size | `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` |
| State flag | plain boolean | `loading`, `disabled`, `interactive` |
| Event handlers | `on` + PascalCase | `onClick`, `onChange`, `onClose` |
| Slot content | descriptive noun | `iconLeft`, `iconRight`, `footer`, `children` |
| String content | descriptive noun | `label`, `hint`, `error`, `placeholder` |

---

## 3. Component Patterns

### Structure: Base + Variant Maps
Components use **plain Tailwind with `cn()`** — no CVA or BEM. Variants are stored in typed record maps above the component:

```tsx
// ✅ Correct pattern
const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-btn-primary border-violet-500 text-white hover:bg-btn-primary-hover',
  secondary: 'bg-violet-500/[.08] border-stroke-brand text-violet-300',
  ghost:     'bg-transparent border-transparent text-content-secondary',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[0.8125rem]',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...rest }, ref) => (
    <button
      ref={ref}
      className={cn('inline-flex items-center ...', variantClasses[variant], sizeClasses[size], className)}
      {...rest}
    />
  )
);
```

### Compound Components
Compound sub-components (e.g. `Card`) are exported from the same file and share the parent's module CSS:

```tsx
export const Card: React.FC<CardProps> = ({ ... }) => <div className={cn(...)}>{children}</div>;
export const CardHeader: React.FC<...> = ({ children, className }) => <div className={cn('px-4 pt-4', className)}>{children}</div>;
export const CardBody: React.FC<...>   = ({ children, className }) => <div className={cn('p-4', className)}>{children}</div>;
export const CardFooter: React.FC<...> = ({ children, className }) => <div className={cn('px-4 pb-4 border-t border-stroke-subtle', className)}>{children}</div>;
```

### Form Elements
All form inputs use `React.forwardRef` so consumers can attach refs:

```tsx
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ ... }, ref) => (
  <input ref={ref} ... />
));
Input.displayName = 'Input';
```

### Context-Based Components
Components like `Tabs` and `RadioGroup` use React Context to share state with children:

```tsx
const TabsCtx = createContext<TabsContextValue>({ active: '', setActive: () => undefined });

export const Tabs = ({ items, children, ... }) => (
  <TabsCtx.Provider value={{ active, setActive }}>
    <div>{/* tab buttons */}</div>
    {children}
  </TabsCtx.Provider>
);

export const TabPanel = ({ id, children }) => {
  const { active } = useContext(TabsCtx);
  if (active !== id) return null;
  return <div role="tabpanel">{children}</div>;
};
```

### Do's and Don'ts

**DO**
```tsx
// ✅ Use semantic color tokens
<p className="text-content-secondary">Helper text</p>

// ✅ Compose classes with cn()
className={cn('base', isActive && 'text-violet-300', className)}

// ✅ Use token classes for backgrounds
<div className="bg-surface-elevated border border-stroke rounded-xl">

// ✅ Use forwardRef for all form elements
export const Input = React.forwardRef<HTMLInputElement, InputProps>(...)

// ✅ Export named (not default)
export const Button = ...
```

**DON'T**
```tsx
// ❌ Never hardcode hex colors in className
<p className="text-[#9898B3]">text</p>

// ❌ Never use inline style for colors
<div style={{ color: '#7C3AED' }}>

// ❌ Never use Tailwind light-mode backgrounds
<div className="bg-white text-gray-900">

// ❌ Never create one-off wrapper components for single uses
// ❌ Never use default exports
export default Button;

// ❌ Never skip aria attributes on interactive elements
<button onClick={toggle} />  // missing aria-label or visible label
```

---

## 4. Token Usage Rules

### Reference Files
- **`tokens.json`** — W3C DTCG-format source of truth for all token values
- **`tailwind.config.ts`** — Maps tokens into Tailwind utility classes
- **`src/styles/globals.css`** — Declares CSS custom properties (`--violet-500`, `--bg-elevated`, etc.)

### Color Decision Guide

| Situation | Use |
|---|---|
| Body / paragraph text | `text-content-primary` |
| Labels, captions, subtext | `text-content-secondary` |
| Placeholders, disabled hints | `text-content-tertiary` |
| Disabled UI text | `text-content-disabled` |
| Violet brand text | `text-content-brand` |
| Page background | `bg-surface-base` |
| Sidebar / nav background | `bg-surface-subtle` |
| Cards, panels | `bg-surface-elevated` |
| Modals, dropdowns | `bg-surface-overlay` |
| Secondary surfaces | `bg-surface-muted` |
| Default border | `border-stroke` |
| Subtle divider | `border-stroke-subtle` |
| Emphasized border | `border-stroke-strong` |
| Brand-tinted border | `border-stroke-brand` |
| Focus ring border | `border-stroke-focus` |
| Primary CTA, brand | `violet-500` (`#7C3AED`) |
| Hover state | `violet-400` (`#8B5CF6`) |
| Active / accent | `violet-300` (`#A78BFA`) |
| Success state | `text-success`, `bg-success-bg` |
| Warning state | `text-warning`, `bg-warning-bg` |
| Error state | `text-error`, `bg-error-bg` |
| Info state | `text-info`, `bg-info-bg` |

### When to Use Raw Scale vs Semantic Tokens
- **Semantic tokens first:** `text-content-*`, `bg-surface-*`, `border-stroke-*` for all standard UI
- **Raw scale for one-offs:** `violet-500/20`, `neutral-700`, `violet-600/30` for opacity variants, gradients, and states not covered by semantic tokens
- **Never raw hex** in any className or style attribute

### Spacing
- All spacing uses Tailwind's default 4px grid: `p-1` = 4px, `p-2` = 8px, `p-4` = 16px, `p-6` = 24px
- Do not use arbitrary spacing values like `p-[13px]` — round to the nearest grid step
- Exceptions: pixel-precise alignment of icon/label combos (e.g. `pl-[calc(0.75rem+1rem+0.5rem)]`)

### Typography
- **Never** specify raw font stacks in className — use `font-sans` or `font-mono`
- Use `<Text>` component for all semantic text (headings, body, captions)
- Use Tailwind text size utilities (`text-sm`, `text-base`, `text-lg`) only inside component internal class maps, not in application code
- Gradient text: use `<Text gradient>` — never recreate the gradient manually

### Shadows & Glows
- Custom shadow tokens: `shadow-card`, `shadow-card-hover`, `shadow-glow-sm/md/lg`, `shadow-focus-ring`
- Use `shadow-focus-ring` for all keyboard focus states on interactive elements
- Use `shadow-glow-sm` for hover states on violet brand elements

### Animations
- Available: `animate-fade-in`, `animate-fade-up`, `animate-scale-in`, `animate-dp-in`, `animate-tooltip-in`, `animate-bounce-dot`, `animate-pulse-circle`, `animate-shimmer-sweep`, `animate-skeleton-pulse`, `animate-glow-pulse`
- Use `animate-spin` (Tailwind default) for loading spinners
- Use `animate-fade-in` for panels/modals entering the DOM
- Use `animate-scale-in` for dialogs and popovers

---

## 5. AI Usage Guide

### How to Generate a New Component

**Step 1 — Check registry.json first**
Before creating anything, check `registry.json` to confirm no existing component covers the use case. Prefer extending an existing component over creating a new one.

**Step 2 — Read the relevant source files**
```
src/components/Button/Button.tsx   ← pattern reference for interactive elements
src/components/Input/Input.tsx     ← pattern reference for form elements
src/components/Card/Card.tsx       ← pattern reference for surface containers
tokens.json                        ← token names and values
tailwind.config.ts                 ← available Tailwind classes
```

**Step 3 — Follow the mandatory structure**
Every new component must:
1. Define a TypeScript interface for props (extend HTML element attributes when relevant)
2. Define variant and size record maps above the component
3. Use `cn()` to compose classes
4. Use `React.forwardRef` if it wraps a form element
5. Include `aria-*` attributes on all interactive elements
6. Include `:focus-visible` styling (provided by `shadow-focus-ring` or `outline-stroke-focus`)
7. Export as a named export — never default export

**Step 4 — Use only these color classes**
```
text-content-{primary|secondary|tertiary|disabled|brand}
bg-surface-{base|subtle|elevated|overlay|muted}
border-stroke-{default|subtle|strong|brand|focus}
text-{success|warning|error|info}
bg-{success|warning|error|info}-bg
violet-{300|400|500|600|700}
neutral-{600|700|800|900}
```

### Example: Prompt Pattern for Generating a Component

```
Generate a Neo design system component for [COMPONENT NAME].

Context files to reference:
- ai-context.md (conventions and rules)
- registry.json (existing components — do not duplicate)
- tokens.json (token values)
- src/components/Button/Button.tsx (pattern reference)

Requirements:
- Props: [list props with types and defaults]
- Variants: [list variants]
- Sizes: [list sizes if applicable]

Rules to follow:
- Use cn() for class composition
- Use semantic color tokens only (text-content-*, bg-surface-*, border-stroke-*)
- No hardcoded hex values
- No inline style for colors
- Add aria-* attributes to all interactive elements
- Export as named export
- File goes in src/components/[ComponentName]/[ComponentName].tsx
```

### Component Anatomy Reference
```tsx
import React from 'react';
import { cn } from '../../utils/cn';

// 1. Types
export type ComponentVariant = 'default' | 'brand';
export type ComponentSize = 'sm' | 'md' | 'lg';

export interface ComponentProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  children: React.ReactNode;
  className?: string;
}

// 2. Variant/size maps
const variantClasses: Record<ComponentVariant, string> = {
  default: 'bg-surface-elevated border-stroke text-content-primary',
  brand:   'bg-violet-500/[.08] border-stroke-brand text-violet-200',
};

const sizeClasses: Record<ComponentSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-6 py-4 text-lg',
};

// 3. Component
export const Component: React.FC<ComponentProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className,
}) => (
  <div
    className={cn(
      'rounded-xl border transition-all duration-150',
      variantClasses[variant],
      sizeClasses[size],
      className,
    )}
  >
    {children}
  </div>
);
```

---

## 6. Contribution Rules

### Adding a New Component

1. **Confirm it doesn't exist** — check `registry.json` and `src/components/`
2. **Create the directory:** `src/components/ComponentName/`
3. **Create required files:**

```
src/components/ComponentName/
├── ComponentName.tsx        # Required — component implementation
├── ComponentName.module.css # Required only if custom keyframes/styles needed
└── index.ts                 # Required — re-export
```

4. **Add to the barrel export** in `src/components/index.ts`:
```ts
export * from './ComponentName';
```

5. **Add to `registry.json`** — document name, description, filePath, variants, props, examples, tags

6. **Add to `tokens.json`** if the component introduces new token values

### Required Files Checklist
| File | Required | Purpose |
|---|---|---|
| `ComponentName.tsx` | Yes | Component logic and JSX |
| `index.ts` | Yes | Public re-export |
| `ComponentName.module.css` | Only if needed | Non-Tailwind styles (e.g. custom keyframes, pseudo-elements) |
| `ComponentName.stories.tsx` | Yes | Storybook stories with all variants and sizes shown |

### Story Requirements
Each story file must include:
- A `Default` story showing the most common usage
- A story per variant
- A story per size
- An interactive story if the component has state
- Proper `args` and `argTypes` for Storybook controls

```tsx
// ComponentName.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ComponentName>;

export const Default: Story = { args: { variant: 'default', size: 'md' } };
export const Brand: Story   = { args: { variant: 'brand' } };
```

### Prop Documentation Rules
- Every prop must have a JSDoc comment explaining its purpose
- Use TypeScript union types — not `string` — for constrained values
- Always define defaults in the destructuring signature, not in a `defaultProps` object

### Accessibility Checklist
- [ ] All interactive elements have `aria-label` or visible label
- [ ] Keyboard navigation works (`Tab`, `Enter`, `Space`, `Escape` where relevant)
- [ ] Focus styles use `:focus-visible` (via `shadow-focus-ring` or `outline-stroke-focus`)
- [ ] Color is never the sole means of conveying information
- [ ] Dynamic content uses `role="alert"` or `aria-live` where needed
- [ ] Images and icon-only buttons have `aria-label` or `aria-hidden="true"`

### What Not to Add
- Do not add new components that duplicate existing ones
- Do not introduce new color values not present in `tokens.json`
- Do not add Tailwind plugins or new config extensions without updating `tokens.json`
- Do not create one-off utility components — generalize or extend existing ones
- Do not add light-mode styles unless explicitly instructed

---

## Quick Reference Cheatsheet

```
COLORS          text-content-{primary|secondary|tertiary|disabled|brand}
                bg-surface-{base|subtle|elevated|overlay|muted}
                border-stroke / border-stroke-{subtle|strong|brand|focus}
                text-{success|warning|error|info}

VIOLET SCALE    violet-{300|400|500|600|700|800|900}
NEUTRAL SCALE   neutral-{600|700|800|900}

SHADOWS         shadow-card  shadow-card-hover
                shadow-glow-{sm|md|lg}
                shadow-focus-ring  shadow-focus-ring-error

ANIMATIONS      animate-fade-in  animate-fade-up  animate-scale-in
                animate-dp-in  animate-tooltip-in  animate-spin
                animate-bounce-dot  animate-pulse-circle

RADIUS          rounded-sm(2px) rounded(4px) rounded-md(6px)
                rounded-lg(8px) rounded-xl(12px) rounded-2xl(16px)
                rounded-3xl(24px) rounded-full(9999px)

SPACING         p-1(4px) p-2(8px) p-3(12px) p-4(16px) p-6(24px)
                p-8(32px) p-12(48px) p-16(64px)

Z-INDEX         z-[100](dropdown) z-[200](topbar) z-[400](modal) z-[600](tooltip)

FONTS           font-sans  font-mono
TRANSITIONS     duration-150(fast) duration-200(base) duration-300(slow)
```
