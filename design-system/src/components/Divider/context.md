# Divider — Component AI Context

> Source: `src/components/Divider/Divider.tsx`

---

## 1. Component Overview

### What it does
`Divider` renders a horizontal `<hr>` or vertical inline separator. Horizontal dividers can optionally display a centered, left-aligned, or right-aligned text label. Four color variants match the stroke token scale. A `spacing` prop controls vertical margin.

### When to use
- Separating content sections within a card, form, or list
- Visual break between action groups in a footer or toolbar
- "OR" / "AND" text separators in authentication flows
- Section boundaries in settings pages

### When NOT to use
- **Between every list item** → use `border-b border-stroke` on list items directly
- **As page-level section breaks** → use adequate spacing (`py-12`) instead
- **Structural layout separation** → use CSS Grid/Flex gaps

### Related Components
| Component | Relationship |
|---|---|
| `Card` | `CardFooter` already has a top border — do not add `<Divider>` before it |
| `Modal` | Modal footer already has a top border — do not add `<Divider>` |

---

## 2. Props API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | No | Line direction |
| `variant` | `'default' \| 'subtle' \| 'strong' \| 'brand'` | `'default'` | No | Line color using stroke tokens |
| `label` | `React.ReactNode` | `undefined` | No | Text shown inside a horizontal divider |
| `labelAlign` | `'left' \| 'center' \| 'right'` | `'center'` | No | Horizontal position of the label |
| `spacing` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Vertical margin (`my-3`, `my-4`, `my-6`) |
| `className` | `string` | `undefined` | No | Extra classes |

### Most Commonly Used
`variant`, `label`, `spacing`

### Props That Must Not Be Combined
- `orientation="vertical"` + `label` → label is only rendered for horizontal dividers; vertical ignores label
- `orientation="vertical"` + `spacing` → spacing applies vertical margin; irrelevant for inline vertical dividers
- `labelAlign` without `label` → has no effect

---

## 3. Variants

| Variant | Color | Use case |
|---|---|---|
| `default` | `border-stroke` / `bg-stroke` (`#2C2C4A`) | Standard section break |
| `subtle` | `border-stroke-subtle` (`#1E1E35`) | De-emphasized, dense layouts |
| `strong` | `border-stroke-strong` (`#3D3D5C`) | Emphasized section boundary |
| `brand` | `border-violet-700` (`#5B21B6`) | Brand-tinted feature separators |

### Spacing Scale
| Value | CSS | Pixels |
|---|---|---|
| `sm` | `my-3` | 12px top + 12px bottom |
| `md` | `my-4` | 16px top + 16px bottom |
| `lg` | `my-6` | 24px top + 24px bottom |

---

## 4. Usage Patterns

### Plain horizontal divider
```tsx
<Divider />
```

### With "OR" label (auth flows)
```tsx
<Divider label="OR" />
```

### Left-aligned label
```tsx
<Divider label="Advanced settings" labelAlign="left" variant="subtle" />
```

### Brand variant
```tsx
<Divider variant="brand" label="Pro features" spacing="lg" />
```

### Vertical (inline separator)
```tsx
<div className="flex items-center gap-3">
  <Button variant="ghost">Edit</Button>
  <Divider orientation="vertical" variant="subtle" />
  <Button variant="ghost">Duplicate</Button>
</div>
```

### Inside a form section
```tsx
<div className="flex flex-col gap-4">
  <Input label="Name" />
  <Input label="Email" />
  <Divider label="Security" labelAlign="left" spacing="sm" />
  <Input label="Password" type="password" />
</div>
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Use between logical form sections
<Input label="Name" />
<Divider spacing="sm" />
<Input label="Password" type="password" />

// Use orientation="vertical" between inline actions
<div className="flex items-center">
  <Button variant="ghost">Edit</Button>
  <Divider orientation="vertical" />
  <Button variant="ghost">Delete</Button>
</div>

// Use label="OR" for auth flow separators
<Divider label="OR" />
```

### ❌ Don'ts
```tsx
// ❌ Don't use Divider between every list item — use border-b on the items
{items.map(item => (
  <>
    <ListItem key={item.id} />
    <Divider />  // ❌
  </>
))}

// ❌ Don't use Divider before CardFooter or Modal footer — those already have borders
<Card>
  <CardBody>Content</CardBody>
  <Divider />       {/* ❌ redundant */}
  <CardFooter>...</CardFooter>
</Card>

// ❌ Don't use label with vertical orientation — it is ignored
<Divider orientation="vertical" label="Section" />
```

### Common AI Mistakes
1. Adding `<Divider>` before `CardFooter` or Modal footer — creates double border
2. Using `<Divider>` between every list item — use CSS border on the elements instead
3. Setting `label` on a vertical `Divider` — not rendered

---

## 6. Accessibility

### ARIA Roles
- Horizontal: `<hr role="separator">` or `<div role="separator">` with label
- Vertical: `<span role="separator" aria-orientation="vertical">`

### Screen Reader Behavior
- Horizontal dividers are announced as separators
- Label text is read as part of the separator announcement
- Vertical dividers are announced as vertical separators

---

## 7. AI Generation Guide

### Decision Tree
```
Between list items?                   → Use border-b border-stroke on elements
Before CardFooter?                    → CardFooter already has border — skip Divider
Between form sections?                → Divider ✅
Auth "OR" separator?                  → <Divider label="OR" /> ✅
Between inline action buttons?        → <Divider orientation="vertical" /> ✅
```

### Checklist
- [ ] Not placed before `CardFooter` or Modal footer (double border)
- [ ] `label` only on `orientation="horizontal"`
- [ ] `spacing` adjusted to match surrounding content density

### Output Format
```tsx
<Divider />
<Divider label="OR" />
<Divider label="Advanced" labelAlign="left" variant="subtle" spacing="sm" />
<Divider orientation="vertical" />
```
