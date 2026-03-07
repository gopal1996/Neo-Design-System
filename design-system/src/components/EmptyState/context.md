# EmptyState — Component AI Context

> Source: `src/components/EmptyState/EmptyState.tsx`

---

## 1. Component Overview

### What it does
`EmptyState` is a centered placeholder shown when a list, table, or data view has no content. It renders a vertically stacked layout with an optional icon, title, description, and up to two action buttons. Includes a set of preset SVG icons via `EmptyStateIcons`.

### When to use
- Zero-data states in lists, tables, and dashboards
- Search/filter results with no matches
- First-time user states (onboarding prompts)
- Error states where data failed to load

### When NOT to use
- **Loading states** → use `Shimmer` or `Spinner`
- **Error messages inside form fields** → use `Input error` prop
- **Small inline "nothing here" text** → use `<Text variant="body-sm" color="tertiary">`
- **Success states after an action** → use a toast or inline confirmation

### Related Components
| Component | Relationship |
|---|---|
| `Table` | Pass to `emptyState` prop on Table |
| `Shimmer` | Loading state alternative |
| `Button` | Used in `action` and `secondaryAction` slots |

---

## 2. Props API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `title` | `string` | — | **Yes** | Primary heading of the empty state |
| `description` | `string` | `undefined` | No | Supporting text below the title |
| `icon` | `React.ReactNode` | `undefined` | No | SVG icon or illustration — use `EmptyStateIcons` presets |
| `action` | `React.ReactNode` | `undefined` | No | Primary action button |
| `secondaryAction` | `React.ReactNode` | `undefined` | No | Secondary action button |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Controls icon size, text size, and padding |
| `variant` | `'default' \| 'brand' \| 'muted'` | `'default'` | No | Icon and title color scheme |
| `className` | `string` | `undefined` | No | Extra classes on the root wrapper |

### Most Commonly Used
`icon`, `title`, `description`, `action`, `size`

### Props That Must Not Be Combined
- `action` + `secondaryAction` as the same button — they are distinct slots
- `size="lg"` inside a `Table` `emptyState` slot — use `size="sm"` for table-embedded empty states

---

## 3. Variants

| Variant | Icon color | Title color | Use case |
|---|---|---|---|
| `default` | `text-content-disabled` | `text-content-primary` | General empty state |
| `brand` | `text-violet-600` | `text-violet-100` | Onboarding, feature prompts, upgrade CTAs |
| `muted` | `text-neutral-700` | `text-content-primary` | Secondary panels, sidebar widgets |

### Size Config
| Size | Padding | Icon | Title font | Description font |
|---|---|---|---|---|
| `sm` | `py-8 px-4` | 40×40px | `text-[0.9375rem]` | `text-[0.8125rem]` |
| `md` | `py-12 px-6` | 56×56px | `text-[1.0625rem]` | `text-sm` |
| `lg` | `py-20 px-8` | 72×72px | `text-xl` | `text-base` |

### Available Icon Presets (`EmptyStateIcons`)
`inbox`, `search`, `data`, `users`, `error`, `folder`

---

## 4. Usage Patterns

### Basic with action
```tsx
<EmptyState
  icon={EmptyStateIcons.inbox}
  title="No messages yet"
  description="When you receive messages, they'll appear here."
  action={<Button variant="primary">Compose message</Button>}
/>
```

### Inside Table emptyState prop
```tsx
<Table
  columns={columns}
  data={filteredRows}
  emptyState={
    <EmptyState
      icon={EmptyStateIcons.search}
      title="No results"
      description="Try adjusting your filters or search term."
      size="sm"
    />
  }
/>
```

### Onboarding (brand variant)
```tsx
<EmptyState
  variant="brand"
  icon={EmptyStateIcons.folder}
  title="Create your first project"
  description="Projects help you organize your work and collaborate with your team."
  action={<Button variant="primary">New project</Button>}
  secondaryAction={<Button variant="ghost">Import existing</Button>}
  size="lg"
/>
```

### Error state
```tsx
<EmptyState
  icon={EmptyStateIcons.error}
  title="Failed to load data"
  description="There was a problem fetching your data. Please try again."
  action={<Button variant="secondary" onClick={refetch}>Retry</Button>}
/>
```

### Minimal (no icon, no action)
```tsx
<EmptyState title="No results found" description="Try a different search term." size="sm" />
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Use size="sm" when embedded in Table or Card
<Table emptyState={<EmptyState size="sm" title="No users" icon={EmptyStateIcons.users} />} />

// Use brand variant for onboarding prompts
<EmptyState variant="brand" title="Get started" action={<Button>Create</Button>} />

// Use EmptyStateIcons presets — don't inline raw SVGs
<EmptyState icon={EmptyStateIcons.search} title="No results" />
```

### ❌ Don'ts
```tsx
// ❌ Don't use EmptyState for loading states — use Shimmer
<EmptyState title="Loading…" />

// ❌ Don't use size="lg" inside Table — too much vertical space
<Table emptyState={<EmptyState size="lg" title="Empty" />} />

// ❌ Don't skip title — it is required
<EmptyState icon={EmptyStateIcons.data} />  // missing required title
```

### Common AI Mistakes
1. Using `EmptyState` for loading — use `Shimmer` or `Spinner`
2. Using `size="lg"` inside `Table`'s `emptyState` — use `size="sm"` there
3. Recreating icons inline instead of using `EmptyStateIcons` presets
4. Omitting `title` — it is the only required prop

---

## 6. Accessibility

### ARIA Roles
- Root renders as a plain `<div>` — no landmark role
- If replacing a data region, wrap in `aria-live="polite"` at the container level so screen readers announce the empty state when it appears

### Screen Reader Behavior
- Title and description are read as paragraph text
- Action buttons are focusable and announced normally
- Icon is decorative (rendered inside a non-interactive div)

---

## 7. AI Generation Guide

### Decision Tree
```
Data is loading?                          → Shimmer / Spinner
Data loaded, list is empty?               → EmptyState ✅
  Inside Table.emptyState slot?           → size="sm"
  Full-page onboarding?                   → size="lg", variant="brand"
  Error/failed to load?                   → EmptyStateIcons.error + retry action
  Search returned no results?             → EmptyStateIcons.search
  List has no items yet?                  → EmptyStateIcons.inbox or relevant icon
```

### Checklist
- [ ] `title` is always provided
- [ ] `size="sm"` when nested inside `Table.emptyState`
- [ ] Icon from `EmptyStateIcons` presets — not raw SVG
- [ ] `action` uses `<Button>` component — not plain `<button>`
- [ ] `variant="brand"` only for onboarding / upsell states

### Output Format
```tsx
<EmptyState
  icon={EmptyStateIcons.inbox}
  title="Nothing here yet"
  description="Items you create will appear here."
  action={<Button variant="primary">Create item</Button>}
  size="md"
/>
```
