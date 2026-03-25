# Select

A bottom-sheet picker for React Native. Supports five composable modes via props — no separate components needed.

## Modes

| Mode | Props |
|------|-------|
| Basic select | *(default)* |
| Multi-select | `multiple` |
| Searchable | `searchable` |
| Autocomplete | `searchable` + `freeSolo` |
| API datasource | `dataSource` |

All modes are combinable (e.g. `multiple + searchable + dataSource`).

## Basic usage

```tsx
import { Select } from '@neo-design-library/mobile';

// Single
<Select
  label="Framework"
  options={[
    { label: 'React Native', value: 'rn' },
    { label: 'Flutter',      value: 'flutter' },
  ]}
  value={val}
  onChange={v => setVal(v as string)}
/>

// Multi
<Select
  label="Roles"
  options={roleOptions}
  value={vals}           // string[]
  onChange={v => setVals(v as string[])}
  multiple
/>

// Searchable
<Select
  label="Country"
  options={countryOptions}
  value={val}
  onChange={v => setVal(v as string)}
  searchable
/>

// Autocomplete — free text + suggestions
<Select
  label="Tags"
  options={suggestions}
  value={val}
  onChange={v => setVal(v as string)}
  searchable
  freeSolo
/>

// API datasource
<Select
  label="Assign User"
  value={val}
  onChange={v => setVal(v as string)}
  dataSource={async (query) => {
    const res = await api.users.search(query);
    return res.map(u => ({ label: u.name, value: u.id, description: u.email }));
  }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption[]` | `[]` | Static option list |
| `value` | `SelectValue \| SelectValue[]` | — | Controlled value |
| `onChange` | `(v) => void` | — | Change callback |
| `label` | `string` | — | Field label |
| `placeholder` | `string` | `'Select an option'` | Trigger placeholder |
| `hint` | `string` | — | Helper text |
| `error` | `string` | — | Error message |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `multiple` | `boolean` | `false` | Multi-select mode |
| `searchable` | `boolean` | `false` | Search bar in sheet |
| `freeSolo` | `boolean` | `false` | Allow custom typed values |
| `dataSource` | `(query: string) => Promise<SelectOption[]>` | — | Async option loader |
| `clearable` | `boolean` | `false` | Show clear button |
| `maxSelected` | `number` | — | Cap for multi mode |
| `searchPlaceholder` | `string` | `'Search…'` | Search input placeholder |
| `emptyText` | `string` | `'No options found'` | Empty state text |
| `disabled` | `boolean` | `false` | Disable the trigger |
| `fullWidth` | `boolean` | `false` | 100% width |
| `style` | `ViewStyle` | — | Wrapper style override |

## SelectOption

```ts
interface SelectOption {
  label:        string;
  value:        string | number;
  description?: string;      // Subtitle below label
  disabled?:    boolean;
  icon?:        React.ReactNode;
}
```

## Notes

- **Datasource**: the `dataSource` function is called on mount (empty query) and on every debounced (300 ms) query change. Implement server-side filtering inside the function.
- **freeSolo**: when the user types a value that doesn't match any option label, an `Add "…"` row appears. Pressing it or tapping the keyboard's Done key confirms the custom value.
- **Multi + clearable**: the clear button removes all chips at once. Individual chips have their own × button.
- The sheet uses a `Modal` with a spring slide-up animation and a scrim backdrop. Safe-area bottom padding is applied on iOS automatically.
