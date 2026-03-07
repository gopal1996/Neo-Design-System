# Table — Component AI Context

> Source: `src/components/Table/Table.tsx`

---

## 1. Component Overview

### What it does
`Table` is a full-featured data table with client-side sort, search, and pagination. It accepts typed column definitions and a data array. Columns can have custom cell renderers. The component handles all sort/search/page state internally (uncontrolled) or externally (controlled sort). Includes skeleton loading rows and a default empty state.

### When to use
- Displaying lists of records (users, orders, projects, transactions)
- When sort, search, or pagination is needed
- When custom cell rendering (badges, avatars, action buttons) is required

### When NOT to use
- **Simple key-value pairs** → use a `<dl>` or description list
- **2–5 rows with no interaction** → use a plain `<div>` list
- **Hierarchical tree data** → Table has no tree/expand row support
- **Virtualized massive datasets (10k+ rows)** → Table renders all rows; add virtualization externally

### Related Components
| Component | Relationship |
|---|---|
| `Badge` | Commonly used in `renderCell` for status columns |
| `Avatar` | Commonly used in `renderCell` for user columns |
| `Button` | Commonly used in `renderCell` for action columns |
| `Shimmer` | `ShimmerTable` is an alternative to `loading` prop for layout-aware skeletons |
| `EmptyState` | Can be passed to `emptyState` prop for branded empty states |

---

## 2. Props API

### TableProps
| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `columns` | `ColumnDef<T>[]` | — | **Yes** | Column definitions |
| `data` | `T[]` | — | **Yes** | Row data array |
| `rowKey` | `keyof T \| (row: T) => string \| number` | `undefined` | No | Unique row identifier — index used if omitted |
| `sortable` | `boolean` | `false` | No | Enables sort headers on all columns (individual `sortable: false` overrides per column) |
| `searchable` | `boolean` | `false` | No | Renders a search bar; filters via string match on searchable columns |
| `searchPlaceholder` | `string` | `'Search…'` | No | Placeholder for the search input |
| `pageSize` | `number` | `undefined` | No | Enables pagination; rows per page |
| `sortKey` | `string` | `undefined` | No | Controlled sort column key |
| `sortDirection` | `'asc' \| 'desc' \| null` | `undefined` | No | Controlled sort direction |
| `onSortChange` | `(key: string, dir: SortDirection) => void` | `undefined` | No | Controlled sort callback |
| `loading` | `boolean` | `false` | No | Shows skeleton rows |
| `emptyState` | `React.ReactNode` | built-in | No | Custom empty content |
| `striped` | `boolean` | `false` | No | Alternating row backgrounds |
| `hoverable` | `boolean` | `true` | No | Row highlight on hover |
| `density` | `'comfortable' \| 'compact' \| 'spacious'` | `'comfortable'` | No | Cell padding |
| `onRowClick` | `(row: T, index: number) => void` | `undefined` | No | Makes rows clickable |
| `className` | `string` | `undefined` | No | Extra classes on the outer wrapper |

### ColumnDef Shape
```ts
interface ColumnDef<T> {
  key: string;                                              // maps to row[key]
  header: React.ReactNode;                                  // column heading
  renderCell?: (value: unknown, row: T, index: number) => React.ReactNode;
  sortFn?: (a: T, b: T) => number;                         // custom comparator
  sortable?: boolean;                                       // false to disable for this column
  searchable?: boolean;                                     // false to exclude from search
  width?: string | number;
  minWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
}
```

### Most Commonly Used
`columns`, `data`, `rowKey`, `sortable`, `searchable`, `pageSize`, `renderCell` (in ColumnDef)

### Props That Must Not Be Combined
- `sortKey` + `sortDirection` without `onSortChange` → controlled sort with no update path
- `loading={true}` + non-empty `data` → skeleton rows hide real data; ensure `loading` is only true when data is absent/stale

---

## 3. Variants

Table has no `variant` prop. Visual options via props:

| Option | Prop | Effect |
|---|---|---|
| Striped rows | `striped={true}` | Alternating row tints |
| Dense | `density="compact"` | Tighter cell padding (`px-3 py-2`) |
| Spacious | `density="spacious"` | Looser padding (`px-6 py-4`) |
| No row hover | `hoverable={false}` | Removes row highlight |
| Clickable rows | `onRowClick` | Adds cursor + focus outline to rows |

---

## 4. Usage Patterns

### Basic sortable table
```tsx
const columns: ColumnDef<User>[] = [
  { key: 'name',  header: 'Name',  sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'status', header: 'Status',
    renderCell: (v) => <Badge variant={v === 'active' ? 'success' : 'default'}>{v as string}</Badge> },
  { key: 'actions', header: '', sortable: false, searchable: false,
    renderCell: (_, row) => <Button size="xs" variant="ghost">Edit</Button> },
];

<Table columns={columns} data={users} rowKey="id" sortable searchable pageSize={10} />
```

### Loading state
```tsx
<Table columns={columns} data={[]} loading={isLoading} pageSize={5} />
```

### Custom empty state
```tsx
<Table
  columns={columns}
  data={filteredRows}
  emptyState={
    <EmptyState icon={EmptyStateIcons.search} title="No results" size="sm" />
  }
/>
```

### Controlled sort (server-side)
```tsx
<Table
  columns={columns}
  data={rows}
  sortable
  sortKey={sort.key}
  sortDirection={sort.dir}
  onSortChange={(key, dir) => setSort({ key, dir })}
/>
```

### Clickable rows
```tsx
<Table columns={columns} data={projects} rowKey="id"
  onRowClick={(row) => navigate(`/projects/${row.id}`)} />
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Always set rowKey for stable React keys
<Table rowKey="id" ... />

// Use renderCell for custom content
{ key: 'status', header: 'Status', renderCell: (v) => <Badge>{v}</Badge> }

// Disable sort on action columns
{ key: 'actions', header: '', sortable: false, searchable: false, renderCell: ... }
```

### ❌ Don'ts
```tsx
// ❌ Don't wrap Table in Card — Table has its own shell
<Card><Table ... /></Card>

// ❌ Don't use loading={true} when data is populated
<Table data={rows} loading={true} />  // hides real data

// ❌ Don't hardcode column widths in pixels for all columns — let table auto-size
// Only set width on action/icon columns that need pinning

// ❌ Don't use Table for < 5 rows with no interaction — use a div list
```

### Common AI Mistakes
1. Wrapping Table in a Card — produces double border/background
2. Using `loading` without emptying `data` — skeleton rows overlay real content
3. Forgetting `sortable: false, searchable: false` on action columns
4. Not setting `rowKey` — React uses array index, causing flicker on sort
5. Passing `renderCell` that returns a string — must return `React.ReactNode`

---

## 6. Accessibility

### ARIA Roles
- `<table>` with `aria-label="Data table"`
- `<th>` with `aria-sort="ascending" | "descending" | "none"` when sortable
- Clickable rows: `tabIndex={0}`, `role` is implicit from `<tr>`

### Keyboard Interaction
| Key | Behavior |
|---|---|
| `Tab` | Navigates sort headers and action cells |
| `Enter` / `Space` | Activates sort header or row click |
| Screen reader | Column sort state announced via `aria-sort` |

---

## 7. AI Generation Guide

### Column Definition Checklist
- [ ] `key` matches a property name in the data type `T`
- [ ] `renderCell` returns `React.ReactNode` (not a plain string)
- [ ] Action columns have `sortable: false, searchable: false`
- [ ] `header` is a short string (not long sentences)

### Table Props Checklist
- [ ] `rowKey` set to a unique field (e.g. `"id"`)
- [ ] `sortable` enabled only when data volume justifies it
- [ ] `pageSize` set when data can exceed 20+ rows
- [ ] Not wrapped in `<Card>`

### Output Format
```tsx
const columns: ColumnDef<MyType>[] = [
  { key: 'name',    header: 'Name',   sortable: true },
  { key: 'status',  header: 'Status', renderCell: (v) => <Badge>{v as string}</Badge> },
  { key: 'actions', header: '',       sortable: false, searchable: false,
    renderCell: (_, row) => <Button size="xs" variant="ghost">Edit</Button> },
];

<Table
  columns={columns}
  data={rows}
  rowKey="id"
  sortable
  searchable
  pageSize={10}
  density="comfortable"
/>
```
