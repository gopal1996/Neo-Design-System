# Card — Component AI Context

> Source: `src/components/Card/Card.tsx`
> Sub-components: `CardHeader`, `CardBody`, `CardFooter`

---

## 1. Component Overview

### What it does
`Card` is a surface container that groups related content on an elevated background. It supports four visual depth variants, configurable padding, and an interactive (clickable) mode with hover lift. Three sub-components — `CardHeader`, `CardBody`, `CardFooter` — provide semantic layout slots.

### When to use
- Grouping related information (user profile, metric, settings section)
- Clickable grid items (project cards, team member tiles)
- Panels inside a dashboard layout

### When NOT to use
- **Full-page layout containers** → use `<div>` with `bg-surface-subtle`
- **Modal dialogs** → use `Modal`
- **Simple key-value rows** → use a plain `<div>` with `border-b border-stroke`
- **Navigation panels** → use `Sidebar`

### Related Components
| Component | Relationship |
|---|---|
| `Modal` | Modal's panel uses card-like styling but is not a Card |
| `Table` | Table has its own card shell — do not wrap Table in Card |
| `EmptyState` | Often placed inside a Card as the empty content state |
| `Button` | Commonly used in `CardFooter` |

---

## 2. Props API

### Card Props
| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `variant` | `'default' \| 'elevated' \| 'brand' \| 'flat'` | `'default'` | No | Visual depth and surface color |
| `interactive` | `boolean` | `false` | No | Adds hover lift, pointer cursor, and focus styles |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | No | Internal padding applied to the card root |
| `onClick` | `React.MouseEventHandler<HTMLDivElement>` | `undefined` | No | Click handler; set `interactive={true}` alongside this |
| `children` | `React.ReactNode` | — | **Yes** | Card content |
| `className` | `string` | `undefined` | No | Extra classes merged via `cn()` |

### Sub-component Props (all three)
| Prop | Type | Required | Description |
|---|---|---|---|
| `children` | `React.ReactNode` | **Yes** | Slot content |
| `className` | `string` | No | Extra classes |

### Most Commonly Used
`variant`, `interactive`, `padding`, `children`

### Props That Must Not Be Combined
- `interactive={true}` without `onClick` — functionally misleading; always pair them
- `padding="none"` with sub-components — sub-components have their own padding; use `padding="none"` when using CardHeader/CardBody/CardFooter
- `padding="lg"` with sub-components — double-padding; always use `padding="none"` when using structured sub-components

---

## 3. Variants

| Variant | Background | Border | Shadow | Use case |
|---|---|---|---|---|
| `default` | `bg-surface-elevated` | `border-stroke` | `shadow-card` | Standard card — most common |
| `elevated` | `bg-surface-overlay` | `border-stroke` | `shadow-lg` | Layered on top of another card or surface |
| `brand` | `bg-violet-500/6` | `border-violet-600/30` | `shadow-card` | Featured item, highlighted content, CTA card |
| `flat` | `bg-surface-muted` | `border-stroke-subtle` | `shadow-none` | Dense layouts, secondary info, table-adjacent |

### Padding Scale
| Value | CSS |
|---|---|
| `none` | `p-0` |
| `sm` | `p-3` (12px) |
| `md` | `p-4` (16px) |
| `lg` | `p-6` (24px) |
| `xl` | `p-8` (32px) |

---

## 4. Usage Patterns

### Simple content card
```tsx
<Card variant="default" padding="lg">
  <p className="text-content-secondary">Content here</p>
</Card>
```

### Structured with sub-components
```tsx
<Card variant="default" padding="none">
  <CardHeader>
    <Text variant="h4">Team Members</Text>
  </CardHeader>
  <CardBody>
    <p className="text-content-secondary">6 active members</p>
  </CardBody>
  <CardFooter>
    <Button size="sm" variant="secondary">Manage</Button>
  </CardFooter>
</Card>
```

### Interactive clickable card
```tsx
<Card variant="default" interactive onClick={() => navigate(`/project/${id}`)}>
  <Text variant="h4">{project.name}</Text>
  <Text variant="body-sm" color="secondary">{project.description}</Text>
</Card>
```

### Brand featured card
```tsx
<Card variant="brand" padding="lg">
  <Badge variant="brand">Pro</Badge>
  <Text variant="h3" className="mt-3">Unlimited access</Text>
  <Button variant="primary" className="mt-4">Upgrade now</Button>
</Card>
```

### Card grid
```tsx
<div className="grid grid-cols-3 gap-4">
  {items.map(item => (
    <Card key={item.id} variant="default" interactive onClick={() => open(item)}>
      <Text variant="h4">{item.title}</Text>
    </Card>
  ))}
</div>
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Use padding="none" when using sub-components to avoid double-padding
<Card padding="none">
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>

// Always pair interactive with onClick
<Card interactive onClick={handleClick}>...</Card>

// Use variant="flat" for secondary/nested cards
<Card variant="flat" padding="sm">
  <Text variant="body-sm">Secondary info</Text>
</Card>
```

### ❌ Don'ts
```tsx
// ❌ Don't combine padding prop and sub-components — double padding
<Card padding="lg">
  <CardBody>Content</CardBody>
</Card>

// ❌ Don't use Card as a full-page layout wrapper
<Card className="min-h-screen">...</Card>

// ❌ Don't wrap Table inside Card — Table has its own shell
<Card><Table columns={...} data={...} /></Card>

// ❌ Don't use interactive without onClick
<Card interactive>...</Card>
```

### Common AI Mistakes
1. Using `padding="lg"` alongside `CardBody` — produces double padding
2. Wrapping `Table` in a `Card` — Table already has border, background, and radius
3. Omitting `interactive` but adding `onClick` — add both
4. Using `elevated` for all cards — reserve it for genuinely layered surfaces

---

## 6. Accessibility

### ARIA Roles
- Default Card renders as `<div>` with no role
- Interactive Card renders with `role="button"` and `tabIndex={0}` automatically
- Interactive Card handles `:focus-visible` outline via `focus-visible:outline-2 focus-visible:outline-stroke-focus`

### Keyboard Interaction (interactive mode)
| Key | Behavior |
|---|---|
| `Tab` | Focuses the card |
| `Enter` | Triggers `onClick` |
| `Space` | Triggers `onClick` |

### Screen Reader Behavior
- Interactive Card is announced as a button — ensure `children` contains a meaningful label or add `aria-label`

---

## 7. AI Generation Guide

### Decision Tree
```
Full dialog overlay?              → Modal
Navigation panel?                 → Sidebar
Data grid with sort/search?       → Table
Grouped content on a surface?     → Card ✅
  Has structured header/footer?   → Use CardHeader + CardBody + CardFooter with padding="none"
  Is clickable?                   → Add interactive + onClick
```

### Checklist
- [ ] If using sub-components: `padding="none"` on Card root
- [ ] If `interactive={true}`: `onClick` is also present
- [ ] Variant matches the visual depth required
- [ ] No manual border or background classes in `className`

### Output Format
```tsx
// Simple
<Card variant="default" padding="lg">Content</Card>

// Structured
<Card variant="default" padding="none">
  <CardHeader><Text variant="h4">Title</Text></CardHeader>
  <CardBody>Body content</CardBody>
  <CardFooter><Button size="sm">Action</Button></CardFooter>
</Card>

// Interactive
<Card variant="default" interactive onClick={handler}>Content</Card>
```
