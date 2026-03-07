# Input

Text input field with label, hint, error, and optional icon slots. Uses `React.forwardRef`. Extends `TextInputProps`.

## Exports
`Input`, `InputProps`, `InputSize`

## Props

| Prop        | Type          | Default  | Notes                                    |
|-------------|---------------|----------|------------------------------------------|
| `label`     | `string`      | —        | Rendered above the input row             |
| `hint`      | `string`      | —        | Shown below when no error                |
| `error`     | `string`      | —        | Overrides hint; triggers error state     |
| `size`      | `InputSize`   | `md`     |                                          |
| `iconLeft`  | `ReactNode`   | —        | Absolutely positioned, 40dp wide         |
| `iconRight` | `ReactNode`   | —        | Absolutely positioned, 40dp wide         |
| `fullWidth` | `boolean`     | `false`  | Sets `width: '100%'`                     |
| `editable`  | `boolean`     | `true`   | `false` → 50% opacity, non-interactive   |
| `style`     | `ViewStyle`   | —        | Applied to the outer wrapper             |

All `TextInputProps` (e.g. `placeholder`, `secureTextEntry`, `keyboardType`, `onChangeText`) pass through.

## Size Map

| Size | Height | FontSize | PaddingH |
|------|--------|----------|----------|
| `sm` | 32     | 13       | 12       |
| `md` | 40     | 14       | 16       |
| `lg` | 48     | 16       | 16       |

When an icon is present, `paddingLeft` (or `paddingRight`) is increased by 24dp to avoid text overlapping the icon.

## Visual States

| State    | Border color    | Border width |
|----------|-----------------|--------------|
| Default  | `border`        | 1            |
| Focused  | `borderFocus`   | 1.5          |
| Error    | `error`         | 1            |
| Disabled | `border`        | 1 (+ 50% opacity) |

- Background: `bgElevated`
- `borderRadius: radii.lg` (12dp)
- Placeholder color: `textTertiary`
- Text color: `textPrimary`
- Label: `fontSize: 14`, `fontWeight: medium`, `color: textSecondary`
- Hint / Error: `fontSize: 13`, `lineHeight: 18`

## Usage

```tsx
import { Input } from '@neo/mobile';

<Input label="Email" placeholder="you@example.com" keyboardType="email-address" />

<Input
  label="Password"
  error="Password is required"
  secureTextEntry
/>

<Input
  label="Search"
  hint="Search by name or email"
  iconLeft={<SearchIcon />}
  size="lg"
/>

<Input
  label="Read-only"
  value="Cannot edit this"
  editable={false}
/>
```
