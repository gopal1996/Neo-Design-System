# Tooltip — Component AI Context

> Source: `src/components/Tooltip/Tooltip.tsx`

---

## 1. Component Overview

### What it does
`Tooltip` wraps a trigger element and shows a floating label on hover or focus after a configurable delay. It uses absolute positioning relative to an inline wrapper `<span>`. Visibility is managed with local state; the tooltip mounts/unmounts on show/hide. Four placement options control which side the bubble appears on.

### When to use
- Clarifying icon-only buttons (copy, delete, edit icons)
- Revealing the full text of truncated content
- Providing extra context for a UI element without cluttering the layout
- Keyboard shortcut hints

### When NOT to use
- **Rich content (links, buttons, forms)** → tooltips are hover-triggered and inaccessible for complex interaction
- **Error messages** → use `Input error` prop or inline `<Text variant="caption" color="error">`
- **Primary instructional text** → if users need to read it, show it inline
- **Mobile-critical information** → hover tooltips don't work on touch devices; make info always visible

### Related Components
| Component | Relationship |
|---|---|
| `Badge` | Non-interactive status label — alternative to tooltip for status |
| `Button` | Tooltip is commonly wrapped around icon-only `Button` |
| `Modal` | Use Modal for rich/interactive overlay content instead of Tooltip |

---

## 2. Props API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `content` | `React.ReactNode` | — | **Yes** | Text or JSX inside the tooltip bubble |
| `children` | `React.ReactElement` | — | **Yes** | The single trigger element |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | No | Side the tooltip appears on |
| `variant` | `'dark' \| 'brand'` | `'dark'` | No | Color style of the tooltip bubble |
| `delay` | `number` | `300` | No | Milliseconds before tooltip appears on hover |
| `disabled` | `boolean` | `false` | No | Prevents the tooltip from showing |
| `maxWidth` | `number` | `240` | No | Maximum pixel width of the tooltip |

### Most Commonly Used
`content`, `children`, `placement`

### Props That Must Not Be Combined
- `content` as a complex interactive element (buttons, inputs) → tooltip content is not focusable
- `disabled={true}` when the trigger is also `disabled` — tooltip won't show on disabled elements anyway

---

## 3. Variants

| Variant | Background | Border | Shadow | Use case |
|---|---|---|---|---|
| `dark` | `bg-neutral-800` | `border-stroke` | `shadow-lg` | General purpose — most tooltips |
| `brand` | Violet gradient | `border-violet-500` | `shadow-glow-sm` | Feature highlights, pro badges, brand context |

### Placement Animations
| Placement | Animation class |
|---|---|
| `top` | `animate-tooltip-in` (fade + scale from center) |
| `bottom` | `animate-tooltip-in` |
| `left` | `animate-[tooltip-in-x_120ms_ease_forwards]` |
| `right` | `animate-[tooltip-in-x_120ms_ease_forwards]` |

---

## 4. Usage Patterns

### Icon-only button label
```tsx
<Tooltip content="Copy to clipboard">
  <Button variant="ghost" size="sm" aria-label="Copy to clipboard">
    <CopyIcon />
  </Button>
</Tooltip>
```

### Bottom placement
```tsx
<Tooltip content="Opens in new tab" placement="bottom">
  <a href={url} target="_blank">Documentation</a>
</Tooltip>
```

### Brand variant for feature hints
```tsx
<Tooltip content="Pro feature — upgrade to unlock" variant="brand" placement="right">
  <Badge variant="brand">Pro</Badge>
</Tooltip>
```

### Disabled tooltip
```tsx
<Tooltip content="Shortcut: ⌘K" disabled={isMobile}>
  <Button variant="ghost">Search</Button>
</Tooltip>
```

### Longer content with maxWidth
```tsx
<Tooltip content="This action will permanently delete all selected items and cannot be undone." maxWidth={280}>
  <Button variant="danger" size="sm">Delete all</Button>
</Tooltip>
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Use on icon-only buttons — tooltip IS the visible label
<Tooltip content="Delete">
  <Button variant="ghost" aria-label="Delete"><TrashIcon /></Button>
</Tooltip>

// Keep tooltip content short — 1 sentence max
<Tooltip content="Mark as complete">...</Tooltip>

// Use placement="right" or "left" for elements near page edges
<Tooltip content="Help" placement="left">...</Tooltip>
```

### ❌ Don'ts
```tsx
// ❌ Don't put interactive elements inside content
<Tooltip content={<a href="/docs">Learn more</a>}>...</Tooltip>

// ❌ Don't use tooltip for error messages
<Tooltip content="This field is required">
  <Input ... />
</Tooltip>
// → Use Input error prop instead

// ❌ Don't wrap multiple children — Tooltip expects a single React element
<Tooltip content="Label">
  <span>A</span>
  <span>B</span>
</Tooltip>
```

### Common AI Mistakes
1. Passing multiple children — Tooltip wraps exactly one element via `React.cloneElement`
2. Using tooltip for form validation errors — use component `error` props instead
3. Putting interactive content (links, buttons) inside `content` — not keyboard accessible
4. Skipping `aria-label` on icon-only buttons just because Tooltip provides text — Tooltip content is not always accessible

---

## 6. Accessibility

### ARIA Attributes
- Tooltip element: `role="tooltip"`, unique `id` generated per instance
- Trigger element: `aria-describedby={tooltipId}` injected when visible
- When hidden: `aria-describedby` is removed from the trigger

### Keyboard Interaction
| Event | Behavior |
|---|---|
| `focus` on trigger | Shows tooltip after delay |
| `blur` on trigger | Hides tooltip |
| `mouseenter` on trigger | Shows tooltip after delay |
| `mouseleave` on trigger | Hides tooltip |

### Screen Reader Behavior
- Tooltip content is announced as a description when the trigger receives focus
- `role="tooltip"` ensures screen readers associate it with the trigger via `aria-describedby`
- Icon-only buttons still need their own `aria-label` — tooltip description supplements, does not replace it

---

## 7. AI Generation Guide

### Decision Tree
```
Rich/interactive content needed?      → Modal or Popover
Error/validation message?             → Input/component error prop
Primary instructional text?           → Inline Text component
Short contextual hint on hover?       → Tooltip ✅
  Brand/feature highlight?            → variant="brand"
  Near right edge of screen?          → placement="left"
  Near bottom of screen?              → placement="top"
```

### Checklist
- [ ] Exactly one child element
- [ ] `content` is plain text or very simple JSX (no interactive elements)
- [ ] Icon-only triggers still have `aria-label` on the trigger
- [ ] `placement` avoids clipping near screen edges
- [ ] `maxWidth` increased if content is longer than 10 words

### Output Format
```tsx
<Tooltip content="Short description" placement="top" variant="dark">
  <Button variant="ghost" size="sm" aria-label="Short description">
    <Icon />
  </Button>
</Tooltip>
```
