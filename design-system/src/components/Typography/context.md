# Text — Component AI Context

> Source: `src/components/Typography/Typography.tsx`
> Export name: `Text`

---

## 1. Component Overview

### What it does
`Text` maps semantic variant names (`h1`, `body`, `caption`, etc.) to the correct HTML tag, font size, weight, line-height, and letter-spacing. Supports a violet gradient fill via `gradient` and semantic color tokens via `color`. Prevents misuse of raw Tailwind typography classes across the codebase.

### When to use
- Every visible text node that carries semantic meaning (headings, paragraphs, captions, labels)
- When gradient text is needed on headings

### When NOT to use
- **Code blocks** → use `variant="mono"` or a `<pre>` block
- **Table cell values** → use `className="text-sm text-content-primary"` directly on `<td>` (Text adds unnecessary DOM wrapper)
- **Form labels wired to inputs** → use the `label` prop on `Input`, `Checkbox`, `Switch` — those handle `htmlFor` automatically
- **Single-word inline spans with no styling** → plain text nodes are fine

### Related Components
| Component | Relationship |
|---|---|
| `Input` | Has its own `label` prop — do not use `<Text as="label">` to label inputs |
| `EmptyState` | Uses `Text` internally for title/description |
| `Card` | `CardHeader` commonly contains `<Text variant="h4">` |

---

## 2. Props API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `variant` | see Variants table | `'body'` | No | Typography scale — controls size, weight, tracking |
| `color` | `'primary' \| 'secondary' \| 'tertiary' \| 'brand' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | No | Semantic text color token |
| `as` | `'h1'…'h6' \| 'p' \| 'span' \| 'div' \| 'label'` | auto from variant | No | Override the rendered HTML tag |
| `gradient` | `boolean` | `false` | No | Violet gradient fill — overrides `color` when true |
| `children` | `React.ReactNode` | — | **Yes** | Text content |
| `className` | `string` | `undefined` | No | Extra classes merged via `cn()` |
| `id` | `string` | `undefined` | No | Forwarded to the element |
| `htmlFor` | `string` | `undefined` | No | Forwarded when `as="label"` |

### Most Commonly Used
`variant`, `color`, `gradient`, `children`

### Props That Must Not Be Combined
- `gradient={true}` + `color="secondary"` → `gradient` wins; `color` is ignored when gradient is active
- `as="h1"` without `variant="h1"/"display"` → semantic mismatch; HTML tag and visual style should align
- `as="label"` without `htmlFor` → creates an unconnected label

---

## 3. Variants

| Variant | Tag (default) | Size | Weight | Use case |
|---|---|---|---|---|
| `display` | `h1` | clamp(2.25rem→4.5rem) | 800 | Hero headlines, landing page titles |
| `h1` | `h1` | `text-4xl` (2.25rem) | 700 | Page titles |
| `h2` | `h2` | `text-3xl` (1.875rem) | 700 | Section headings |
| `h3` | `h3` | `text-2xl` (1.5rem) | 600 | Card/panel titles |
| `h4` | `h4` | `text-xl` (1.25rem) | 600 | Widget titles, sidebar section labels |
| `h5` | `h5` | `text-lg` (1.125rem) | 600 | Sub-section labels |
| `body-lg` | `p` | `text-lg` | 400 | Lead body text, feature descriptions |
| `body` | `p` | `text-base` | 400 | Default body text |
| `body-sm` | `p` | `text-sm` | 400 | Secondary body, metadata |
| `caption` | `span` | `text-xs` | 400 | Timestamps, footnotes, image captions |
| `overline` | `span` | `text-xs` | 600 | ALL CAPS section labels |
| `mono` | `span` | `text-sm` | 400 | Code snippets, IDs, version numbers |

---

## 4. Usage Patterns

### Page title with gradient
```tsx
<Text variant="h1" gradient>Build something great</Text>
```

### Standard body copy
```tsx
<Text variant="body" color="secondary">
  Manage your team's projects in one place.
</Text>
```

### Overline section label
```tsx
<Text variant="overline" color="brand">Features</Text>
<Text variant="h2">Everything you need</Text>
```

### Caption / metadata
```tsx
<Text variant="caption" color="tertiary">Last updated 2 hours ago</Text>
```

### Tag override — semantic h2 visually styled as h4
```tsx
<Text variant="h4" as="h2">Widget title</Text>
```

### Monospace ID display
```tsx
<Text variant="mono" color="tertiary">txn_a8f3b2c9</Text>
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Use variant for visual scale, as for semantic HTML
<Text variant="h3" as="h2">Section heading</Text>

// Use color prop — never className for text color
<Text variant="body" color="secondary">Description</Text>

// Use gradient for hero headings only
<Text variant="display" gradient>Ship faster</Text>
```

### ❌ Don'ts
```tsx
// ❌ Never use raw Tailwind text classes instead of color prop
<Text variant="body" className="text-neutral-300">...</Text>

// ❌ Never use Text to label form inputs — use the component's label prop
<Text as="label" htmlFor="email">Email</Text>  // bypasses Input's built-in label
<Input label="Email" />  // ✅ correct

// ❌ Never use gradient on body text — reserve for display/h1/h2
<Text variant="body" gradient>Description text</Text>
```

### Common AI Mistakes
1. Using `className="text-gray-400"` instead of `color="secondary"` — always use the `color` prop
2. Setting `gradient` and `color` together — gradient overrides color; omit color when using gradient
3. Using `<Text>` inside table cells — adds unnecessary DOM nesting; use className on `<td>` directly
4. Using `variant="h1"` semantically for every heading on the page — use h1 once per page

---

## 6. Accessibility

### Default Tag Mapping
Each variant renders its semantically correct HTML tag by default. Override with `as` when the visual and semantic roles differ (common in dashboard cards where h4 visuals appear in h2 positions).

### Screen Reader Behavior
- Heading variants produce proper heading landmarks
- `overline` and `caption` render as `<span>` — not landmarks; wrap in a heading if needed
- `gradient` text uses `-webkit-text-fill-color: transparent` which is readable by screen readers

---

## 7. AI Generation Guide

### Decision Tree
```
Hero / landing headline?          → variant="display" gradient
Page title (once per page)?       → variant="h1"
Section heading?                  → variant="h2" or "h3"
Card/widget title?                → variant="h4"
Standard paragraph?               → variant="body"
Secondary/helper text?            → variant="body-sm" color="secondary"
Timestamp / metadata?             → variant="caption" color="tertiary"
Section label (caps)?             → variant="overline" color="brand"
Code / ID?                        → variant="mono"
```

### Checklist
- [ ] `color` prop used instead of `className` for text color
- [ ] `gradient` only on display/h1/h2 variants
- [ ] `as` override used when semantic tag differs from visual variant
- [ ] Not used inside `<td>` cells — use className directly there

### Output Format
```tsx
<Text variant="h3">Title</Text>
<Text variant="body" color="secondary">Description</Text>
<Text variant="caption" color="tertiary">Metadata</Text>
<Text variant="h1" gradient>Hero headline</Text>
```
