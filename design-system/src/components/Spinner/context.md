# Spinner — Component AI Context

> Source: `src/components/Spinner/Spinner.tsx`

---

## 1. Component Overview

### What it does
`Spinner` is a loading indicator that signals an async operation is in progress. It renders three animation styles: a spinning SVG arc ring (`ring`), three bouncing dots (`dots`), and a pulsing filled circle (`pulse`). All variants are inline `<span>` elements with `role="status"` and a visually hidden accessible label.

### When to use
- Full-area or section-level loading states (page load, data fetch)
- Standalone loading indicators separate from buttons
- When `Button`'s built-in `loading` prop is insufficient (e.g. loading a section, not an action)

### When NOT to use
- **Button loading states** → use `Button loading={true}` — it renders its own spinner internally
- **Skeleton/placeholder content** → use `Shimmer` for layout-aware loading states
- **Progress tracking** → Spinner conveys indeterminate progress only

### Related Components
| Component | Relationship |
|---|---|
| `Button` | Has built-in loading spinner — do not nest `<Spinner>` inside `<Button>` |
| `Shimmer` | Layout-aware skeleton alternative to Spinner |

---

## 2. Props API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `variant` | `'ring' \| 'dots' \| 'pulse'` | `'ring'` | No | Animation style |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | No | Bounding box of the spinner |
| `label` | `string` | `'Loading...'` | No | Visually hidden text for screen readers |
| `className` | `string` | `undefined` | No | Extra classes for positioning/color override |

### Most Commonly Used
`size`, `variant`

### Props That Must Not Be Combined
No conflict rules — all props are independent.

---

## 3. Variants

| Variant | Animation | Best for |
|---|---|---|
| `ring` | Rotating SVG arc (partial circle) | General purpose, inline loaders |
| `dots` | Three dots bouncing vertically in sequence | Text-adjacent loaders, chat, streaming |
| `pulse` | Filled circle scaling in/out | Subtle presence indicators, ambient loading |

### Size Classes
| Size | Dimensions |
|---|---|
| `xs` | `w-3 h-3` |
| `sm` | `w-4 h-4` |
| `md` | `w-6 h-6` |
| `lg` | `w-8 h-8` |
| `xl` | `w-12 h-12` |

### Color
All variants inherit `text-violet-400` by default. Override via `className="text-content-secondary"` or any `text-*` utility.

---

## 4. Usage Patterns

### Centered page loader
```tsx
<div className="flex items-center justify-center min-h-[400px]">
  <Spinner size="lg" label="Loading dashboard…" />
</div>
```

### Inline beside text
```tsx
<div className="flex items-center gap-2">
  <Spinner size="sm" />
  <span className="text-content-secondary text-sm">Saving…</span>
</div>
```

### Dots variant for AI/streaming output
```tsx
<Spinner variant="dots" size="md" label="Generating response…" />
```

### Replacing content while loading
```tsx
{isLoading ? (
  <Spinner size="lg" className="mx-auto my-12" />
) : (
  <DataTable data={rows} />
)}
```

### Color override
```tsx
<Spinner size="sm" className="text-content-tertiary" />
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Use Button's loading prop instead for button states
<Button loading={isSaving}>Save</Button>

// Use label to describe the specific operation
<Spinner label="Fetching user data…" />

// Center with flex utilities
<div className="flex justify-center py-12">
  <Spinner size="lg" />
</div>
```

### ❌ Don'ts
```tsx
// ❌ Don't nest Spinner inside Button
<Button><Spinner size="xs" /> Loading</Button>
// → Use Button loading prop

// ❌ Don't use Spinner for layout skeleton — use Shimmer
<Spinner size="xl" />  // replacing a card layout

// ❌ Don't omit label when context is not obvious
<Spinner />  // label defaults to "Loading..." which is acceptable but specific is better
```

### Common AI Mistakes
1. Nesting `<Spinner>` inside `<Button>` — use `loading` prop on Button
2. Using Spinner for layout-aware placeholders — use `Shimmer` components instead
3. Hardcoding color with `className="text-[#7C3AED]"` — use `text-violet-400` or `text-content-*`
4. Forgetting to wrap Spinner in a centering container for full-area loaders

---

## 6. Accessibility

### ARIA Roles
- Renders as `<span role="status">`
- Inner SVG/elements are `aria-hidden="true"`
- Accessible label is in a visually hidden `<span>` inside the component

### Screen Reader Behavior
- Announces the `label` value when the spinner appears (`role="status"` triggers a polite live region update)
- Default label: `"Loading..."` — always provide a specific label for context

### Keyboard Interaction
None — Spinner is non-interactive.

---

## 7. AI Generation Guide

### Decision Tree
```
Loading a button action?                → Button loading={true}
Loading a content area / section?      → Spinner ✅
Loading a full layout skeleton?         → ShimmerCard / ShimmerTable
Streaming / typing indicator?          → Spinner variant="dots"
Ambient/subtle background loading?     → Spinner variant="pulse"
```

### Checklist
- [ ] Not nested inside `<Button>`
- [ ] `label` describes the specific loading operation
- [ ] Wrapped in a centering flex container for full-area use
- [ ] Color uses `text-*` token class if overriding default violet

### Output Format
```tsx
<Spinner size="md" />
<Spinner size="lg" variant="dots" label="Generating…" />
<Spinner size="sm" className="text-content-secondary" />
```
