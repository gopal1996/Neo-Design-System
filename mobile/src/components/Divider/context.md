# Divider

Visual separator line, horizontal or vertical, with optional centered label.

## Exports
`Divider`, `DividerProps`, `DividerVariant`, `DividerOrientation`

## Props

| Prop          | Type                              | Default        |
|---------------|-----------------------------------|----------------|
| `variant`     | `default\|subtle\|strong\|brand`  | `default`      |
| `orientation` | `horizontal\|vertical`            | `horizontal`   |
| `label`       | `string`                          | —              |
| `labelAlign`  | `left\|center\|right`             | `center`       |
| `spacing`     | `sm\|md\|lg`                      | `md`           |
| `style`       | `ViewStyle`                       | —              |

## Variant Colors

| Variant   | Line color      | Label color     |
|-----------|-----------------|-----------------|
| `default` | `border`        | `textTertiary`  |
| `subtle`  | `borderSubtle`  | `textTertiary`  |
| `strong`  | `borderStrong`  | `textSecondary` |
| `brand`   | `violet700`     | `violet300`     |

## Spacing (vertical margin, dp)

| Value | dp |
|-------|----|
| `sm`  | 12 |
| `md`  | 16 |
| `lg`  | 24 |

## Behaviour
- Horizontal line: `height: StyleSheet.hairlineWidth`, `width: '100%'`
- Vertical line: `width: StyleSheet.hairlineWidth`, `alignSelf: 'stretch'` — requires fixed-height parent
- With `label`: `flexDirection: row` with flex lines on each side (or 24dp stub for left/right-aligned)
- `label` text: `fontSize: 12`, `fontWeight: medium`, `letterSpacing: 0.3`
- `accessibilityRole="separator"`

## Usage

```tsx
import { Divider } from '@neo/mobile';

<Divider />

<Divider label="OR" />
<Divider label="OR" variant="subtle" spacing="lg" />

<Divider label="Filters" labelAlign="left" variant="strong" />

<Divider variant="brand" />

{/* Vertical — wrap in a fixed-height row */}
<View style={{ flexDirection: 'row', height: 24, alignItems: 'center' }}>
  <Text>Left</Text>
  <Divider orientation="vertical" />
  <Text>Right</Text>
</View>
```
