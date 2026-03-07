# DataTable

Full-featured data table with horizontal scroll, sorting, client-side search, pagination, striped rows, and custom cell rendering.

## Exports
`DataTable`, `DataTableProps`, `ColumnDef`, `SortDirection`

## Props

| Prop                | Type                                    | Default        | Notes                              |
|---------------------|-----------------------------------------|----------------|------------------------------------|
| `columns`           | `ColumnDef<T>[]`                        | — (required)   |                                    |
| `data`              | `T[]`                                   | — (required)   |                                    |
| `rowKey`            | `keyof T \| ((row: T) => string\|number)`| — (required)  | Stable React key                   |
| `sortable`          | `boolean`                               | `false`        | Enables header click-to-sort       |
| `searchable`        | `boolean`                               | `false`        | Shows search bar above table       |
| `searchPlaceholder` | `string`                                | `'Search…'`    |                                    |
| `pageSize`          | `number`                                | —              | Enables pagination; omit for all-rows |
| `striped`           | `boolean`                               | `false`        | Alternating row background (`bgMuted`) |
| `density`           | `compact\|comfortable\|spacious`        | `comfortable`  |                                    |
| `loading`           | `boolean`                               | `false`        | Replaces body with `ActivityIndicator` |
| `emptyState`        | `ReactNode`                             | built-in       | Custom empty state                 |
| `onRowPress`        | `(row: T, index: number) => void`       | —              | Makes rows pressable               |
| `style`             | `ViewStyle`                             | —              |                                    |

## ColumnDef Shape

```ts
interface ColumnDef<T> {
  key:         string;
  header:      string;
  renderCell?: (value: unknown, row: T, index: number) => ReactNode;
  sortFn?:     (a: T, b: T) => number;   // custom comparator (sign preserved for asc, negated for desc)
  sortable?:   boolean;                   // default: true when table sortable=true
  searchable?: boolean;                   // default: true when table searchable=true
  width?:      number;                    // default: 120dp
  align?:      'left' | 'center' | 'right';
}
```

## Density Padding

| Density       | Vertical | Horizontal |
|---------------|----------|------------|
| `compact`     | 8        | 12         |
| `comfortable` | 12       | 16         |
| `spacious`    | 16       | 24         |

## Sorting
- Cycle per column: `asc → desc → none`
- Sort state: `sortKey` + `sortDir` (local state)
- Multi-column sort not supported — each click resets to the clicked column
- Default sort: string `.localeCompare`, number arithmetic; override with `sortFn`
- Changing sort resets to page 1

## Search
- Full-text across all searchable columns
- Case-insensitive `String(val).toLowerCase().includes(query)`
- `col.searchable = false` excludes that column
- Searching resets to page 1

## Pagination
- First / Prev / Next / Last buttons
- Disabled state at boundary pages (30% opacity)
- Shows "start–end of total" range

## Layout
- Root: `bgElevated`, `borderRadius: radii.xl`, `borderWidth: hairlineWidth`, `overflow: hidden`
- Body: vertical `ScrollView`, `maxHeight: 480`
- Header row: `bgMuted`, `borderBottomWidth: hairlineWidth`
- Header text: `fontSize: 11`, `fontWeight: semibold`, `textTransform: uppercase`, `letterSpacing: 0.6`
- Active header: `violet300`
- Cell text: `fontSize: 13`, `color: textPrimary`
- Row border: `borderBottomWidth: hairlineWidth` in `borderSubtle` (except last row)
- Default column width: 120dp

## Usage

```tsx
import { DataTable } from '@neo/mobile';
import type { ColumnDef } from '@neo/mobile';
import { Badge, Button } from '@neo/mobile';

interface User {
  id:     number;
  name:   string;
  email:  string;
  status: string;
  role:   string;
}

const columns: ColumnDef<User>[] = [
  { key: 'name',   header: 'Name',   sortable: true, width: 140 },
  { key: 'email',  header: 'Email',  sortable: true, width: 200 },
  { key: 'status', header: 'Status', width: 100,
    renderCell: (v) => <Badge variant="brand">{String(v)}</Badge> },
  { key: 'role',   header: 'Role',   sortable: false, width: 100 },
  { key: 'actions',header: '',       sortable: false, searchable: false, width: 80,
    renderCell: (_, row) => (
      <Button size="xs" variant="ghost" onPress={() => editUser(row)}>Edit</Button>
    )},
];

<DataTable
  columns={columns}
  data={users}
  rowKey="id"
  sortable
  searchable
  searchPlaceholder="Search users…"
  pageSize={10}
  striped
  density="comfortable"
  loading={isFetching}
  onRowPress={(row) => navigation.push('UserDetail', { id: row.id })}
/>
```
