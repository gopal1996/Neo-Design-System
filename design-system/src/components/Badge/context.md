# Badge — Component AI Context

> Source: `src/components/Badge/Badge.tsx`

---

## 1. Component Overview

### What it does
`Badge` is a compact, non-interactive label used to communicate status, category, or count. It renders as an inline `<span>` with a pill shape and semantic color variants. Optionally shows a leading dot indicator.

### When to use
- Status labels (Active, Pending, Failed, Archived)
- Category or tier tags (Pro, Free, Beta)
- Count indicators when not a primary metric

### When NOT to use
- **Interactive filtering** → use `Tabs` with pill variant
- **Large counts or primary metrics** → use a `<Text>` heading
- **Dismissible tags** → Badge has no close/remove action; build a custom tag component
- **Navigation items** → use Sidebar item `badge` prop

### Related Components
| Component | Relationship |
|---|---|
| `Table` | `renderCell` in Table columns commonly returns `<Badge>` |
| `Tabs` | Tab items have a built-in badge slot — do not put `<Badge>` inside tab label |
| `Sidebar` | NavItem `badge` prop renders its own count pill — do not use `<Badge>` |

---

## 2. Props API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `variant` | `'default' \| 'brand' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'outline'` | `'default'` | No | Semantic color scheme |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Height and font size |
| `dot` | `boolean` | `false` | No | Shows a small filled circle before the label |
| `children` | `React.ReactNode` | — | **Yes** | Badge label text |
| `className` | `string` | `undefined` | No | Extra classes merged via `cn()` |

### Most Commonly Used
`variant`, `children`, `dot`

### Props That Must Not Be Combined
- `dot={true}` on a single-character badge looks cramped — avoid on size `sm` with short labels

---

## 3. Variants

| Variant | Background | Border | Text | Use case |
|---|---|---|---|---|
| `default` | `bg-neutral-800` | `border-stroke` | `text-content-secondary` | Neutral state, archived, inactive |
| `brand` | `bg-violet-500/15` | `border-violet-600/40` | `text-violet-200` | New features, brand tags, Pro tier |
| `success` | `bg-success-bg` | `border-success/30` | `text-success-light` | Active, published, approved, online |
| `warning` | `bg-warning-bg` | `border-warning/30` | `text-warning-light` | Pending, expiring, needs attention |
| `error` | `bg-error-bg` | `border-error/30` | `text-error-light` | Failed, rejected, error, blocked |
| `info` | `bg-info-bg` | `border-info/30` | `text-info-light` | Informational, in-progress, beta |
| `outline` | `bg-transparent` | `border-stroke-strong` | `text-content-secondary` | Subtle label on elevated surfaces |

### Size Classes
| Size | Height | Font |
|---|---|---|
| `sm` | `h-[18px]` | `text-[0.6875rem]` |
| `md` | `h-[22px]` | `text-xs` |
| `lg` | `h-[26px]` | `text-[0.8125rem]` |

---

## 4. Usage Patterns

### Basic status badge
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="error">Failed</Badge>
```

### With dot indicator
```tsx
<Badge variant="success" dot>Online</Badge>
<Badge variant="warning" dot>Pending review</Badge>
```

### Small size in dense UI
```tsx
<Badge variant="brand" size="sm">New</Badge>
```

### Inside Table renderCell
```tsx
const columns = [
  {
    key: 'status',
    header: 'Status',
    renderCell: (value) => (
      <Badge variant={value === 'active' ? 'success' : 'error'}>{value}</Badge>
    ),
  },
];
```

### Multiple badges in a row
```tsx
<div className="flex items-center gap-2">
  <Badge variant="brand">Pro</Badge>
  <Badge variant="info">Beta</Badge>
</div>
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Match variant to semantic meaning
<Badge variant="error">Expired</Badge>
<Badge variant="success">Verified</Badge>

// Use dot for presence/status indicators
<Badge variant="success" dot>Active</Badge>

// Use size="sm" inside tight table cells
<Badge variant="warning" size="sm">Review</Badge>
```

### ❌ Don'ts
```tsx
// ❌ Never add onClick — Badge is non-interactive
<Badge onClick={filter}>Active</Badge>

// ❌ Never hardcode colors in className
<Badge className="bg-purple-500 text-white">Pro</Badge>

// ❌ Never put long strings in a badge — it wraps awkwardly
<Badge>This is a very long status description</Badge>
```

### Common AI Mistakes
1. Making Badge interactive with `onClick` — it has no hover/focus states for interaction
2. Using `default` variant for success/error states — use semantic variants
3. Putting badges inside Tabs `label` prop — use the built-in `badge` slot on `TabItem`
4. Using `size="lg"` everywhere — match size to the surrounding text density

---

## 6. Accessibility

### ARIA Attributes
- Badge renders as `<span>` — no interactive role
- For status that changes dynamically, wrap in `aria-live="polite"` at the container level
- Color is not the sole conveyor of meaning — the text label always describes the state

### Screen Reader Behavior
- Read as inline text in document flow
- `dot` indicator is `aria-hidden="true"` — the label carries all meaning

---

## 7. AI Generation Guide

### Decision Tree
```
Is it interactive (clickable/filterable)?    → Use Tabs pill variant
Is it a count inside a nav item?             → Use Sidebar badge prop
Is it dismissible?                           → Custom component needed
Is it a status / category label?             → Use Badge ✅
```

### Checklist
- [ ] Variant matches the semantic meaning of the content
- [ ] No `onClick` attached
- [ ] Label text is short (1–3 words)
- [ ] No color overrides in `className`

### Output Format
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning" dot size="sm">Pending</Badge>
```
