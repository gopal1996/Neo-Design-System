# Shimmer — Component AI Context

> Source: `src/components/Shimmer/Shimmer.tsx`
> Exports: `Shimmer`, `ShimmerText`, `ShimmerAvatar`, `ShimmerCard`, `ShimmerTable`, `ShimmerList`

---

## 1. Component Overview

### What it does
`Shimmer` renders an animated skeleton placeholder block that mimics content dimensions during loading. It uses a sweeping gradient animation (`nx-shimmer` CSS class from `globals.css`). Five composite sub-components (`ShimmerText`, `ShimmerAvatar`, `ShimmerCard`, `ShimmerTable`, `ShimmerList`) compose base `Shimmer` blocks into common layout patterns.

### When to use
- Content areas where layout is known but data is loading
- Replacing `Table` content while fetching rows
- Replacing `Card` content during initial page load
- Avatar + name rows in user lists while fetching

### When NOT to use
- **Unknown layout** → use `Spinner` (centered) instead
- **Button loading states** → use `Button loading={true}`
- **Inline text loading** → use `Spinner variant="dots"` beside text
- **After initial load** → once data arrives, replace shimmer with real components

### Related Components
| Component | Relationship |
|---|---|
| `Spinner` | Alternative for indeterminate/unknown layout loading |
| `Table` | `ShimmerTable` mirrors the Table shell visually; also Table has its own `loading` prop |
| `Avatar` | `ShimmerAvatar` mirrors `Avatar` dimensions |
| `Card` | `ShimmerCard` mirrors a standard Card with avatar + text + actions |

---

## 2. Props API

### Shimmer (base)
| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `width` | `string \| number` | `undefined` | No | CSS width (`'100%'`, `200`, `'50%'`) |
| `height` | `string \| number` | `16` | No | Height in pixels or CSS value |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | No | Border radius |
| `className` | `string` | `undefined` | No | Extra classes |

### ShimmerText Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `lines` | `number` | `3` | Number of text lines to render |
| `lastLineWidth` | `string` | `'60%'` | Width of the last (shortest) line |

### ShimmerAvatar Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number` | `40` | Diameter in pixels |

### ShimmerCard Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | `undefined` | Extra classes on the card wrapper |

### ShimmerTable Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `rows` | `number` | `5` | Number of data rows to render |
| `cols` | `number` | `4` | Number of columns to render |

### ShimmerList Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `number` | `4` | Number of list items |
| `avatar` | `boolean` | `true` | Whether to show an avatar circle per item |

---

## 3. Composite Sub-Components

| Component | Renders | Matches |
|---|---|---|
| `ShimmerText` | N lines of varying width | Paragraph text blocks |
| `ShimmerAvatar` | Single circle | `Avatar` component |
| `ShimmerCard` | Avatar + text lines + two action buttons | Standard `Card` with user info |
| `ShimmerTable` | Header row + N data rows × M cols | `Table` component shell |
| `ShimmerList` | N rows of avatar + two text lines | User/item lists |

---

## 4. Usage Patterns

### Replacing a Table while loading
```tsx
{isLoading ? (
  <ShimmerTable rows={8} cols={5} />
) : (
  <Table columns={columns} data={rows} />
)}
```

### Replacing a Card grid
```tsx
{isLoading ? (
  <div className="grid grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => <ShimmerCard key={i} />)}
  </div>
) : (
  <CardGrid items={projects} />
)}
```

### Single skeleton block (custom size)
```tsx
<Shimmer width="100%" height={200} radius="xl" />
```

### Text paragraph placeholder
```tsx
<ShimmerText lines={4} lastLineWidth="40%" />
```

### User list placeholder
```tsx
<ShimmerList items={6} avatar={true} />
```

### Avatar placeholder
```tsx
<ShimmerAvatar size={48} />
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Match shimmer dimensions to the real component they replace
<ShimmerAvatar size={40} />   // replace Avatar size="md" (40px)
<ShimmerTable rows={10} cols={4} />  // replace Table with pageSize=10, 4 columns

// Use ShimmerCard for card grids
{Array.from({ length: 3 }).map((_, i) => <ShimmerCard key={i} />)}

// Conditionally swap shimmer for real content
{loading ? <ShimmerTable rows={5} /> : <Table columns={cols} data={rows} />}
```

### ❌ Don'ts
```tsx
// ❌ Don't use Shimmer for button loading — use Button loading prop
<Shimmer width={100} height={40} />  // replacing a Button

// ❌ Don't use Shimmer when layout is unknown — use Spinner instead
<ShimmerCard />  // shown while you don't know what shape the content will be

// ❌ Don't add aria attributes to Shimmer — it is aria-hidden
// ❌ Don't show Shimmer after data loads — it should unmount immediately
```

### Common AI Mistakes
1. Using `ShimmerTable` to replace a non-Table layout — only use it when the real content is `<Table>`
2. Matching wrong `rows`/`cols` count — should match real Table's `pageSize` and column count
3. Animating Shimmer indefinitely — it should unmount as soon as data is available
4. Using base `Shimmer` where a composite (`ShimmerCard`, `ShimmerList`) would be more accurate

---

## 6. Accessibility

### ARIA
- All `Shimmer` elements have `aria-hidden="true"` — they are purely decorative
- Pair with `aria-live="polite"` on the container so screen readers announce when real content loads
- Provide a visible or `aria-label` loading message at the page/section level

```tsx
<div aria-live="polite" aria-busy={isLoading}>
  {isLoading ? <ShimmerTable rows={5} /> : <Table ... />}
</div>
```

---

## 7. AI Generation Guide

### Decision Tree
```
Know the layout while loading?         → Shimmer composites ✅
Don't know the layout?                 → Spinner (centered)
Loading a table?                       → ShimmerTable (rows=pageSize, cols=columnCount)
Loading a card grid?                   → Array of ShimmerCard
Loading a user list?                   → ShimmerList
Loading an avatar?                     → ShimmerAvatar (size matches Avatar size)
Loading a text paragraph?              → ShimmerText (lines=expected line count)
```

### Checklist
- [ ] Shimmer is conditionally rendered — removed as soon as data arrives
- [ ] `rows` / `cols` match the real Table's `pageSize` and column count
- [ ] `ShimmerAvatar size` matches the real `Avatar` pixel size
- [ ] All shimmer elements are `aria-hidden` (handled automatically)
- [ ] Container has `aria-live="polite"` and `aria-busy={isLoading}`

### Output Format
```tsx
{isLoading ? (
  <ShimmerTable rows={10} cols={4} />
) : (
  <Table columns={columns} data={rows} rowKey="id" sortable />
)}

{isLoading ? (
  <ShimmerList items={5} />
) : (
  <UserList users={users} />
)}
```
