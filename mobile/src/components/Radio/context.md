# Radio

Animated radio button. Cannot be deselected by pressing again — manage group state externally.

## Exports
`Radio`, `RadioProps`, `RadioSize`

## Props

| Prop             | Type                    | Default | Notes                                 |
|------------------|-------------------------|---------|---------------------------------------|
| `checked`        | `boolean`               | —       | Controlled mode when provided         |
| `defaultChecked` | `boolean`               | `false` | Uncontrolled initial value            |
| `onChange`       | `(v: boolean) => void`  | —       | Called with `true` when selected      |
| `label`          | `string`                | —       |                                       |
| `description`    | `string`                | —       | Shown below label when no error       |
| `error`          | `string`                | —       | Overrides description; error color    |
| `size`           | `RadioSize`             | `md`    |                                       |
| `disabled`       | `boolean`               | `false` | 45% opacity; no interaction           |
| `value`          | `string`                | —       | Identifier for group pattern          |
| `style`          | `ViewStyle`             | —       |                                       |

## Size Map (dp)

| Size | Outer | Inner | FontSize |
|------|-------|-------|----------|
| `sm` | 14    | 6     | 13       |
| `md` | 16    | 8     | 14       |
| `lg` | 20    | 10    | 16       |

## Visual States

| State     | Outer border  | Outer background                | Inner dot  |
|-----------|---------------|---------------------------------|------------|
| Unchecked | `borderStrong`| `bgElevated`                    | hidden     |
| Checked   | `violet500`   | `rgba(124,58,237,0.1)`          | `violet500`|
| Error     | `error`       | `bgElevated`                    | hidden     |

## Animations
- `Animated.spring` on inner dot scale (0→1), damping=12, stiffness=160
- `opacity` tied to same `scale` animated value
- 150ms `Animated.timing` on outer border color (not animated — border is static, only inner scale animates)

## Group Pattern

```tsx
const options = ['a', 'b', 'c'];
const [selected, setSelected] = React.useState<string>('a');

{options.map((v) => (
  <Radio
    key={v}
    value={v}
    label={`Option ${v.toUpperCase()}`}
    checked={selected === v}
    onChange={() => setSelected(v)}
  />
))}
```

## Accessibility
- `accessibilityRole="radio"`
- `accessibilityState={{ checked: isChecked, disabled }}`
- Error text: `accessibilityRole="alert"`

## Usage

```tsx
import { Radio } from '@neo/mobile';

<Radio label="Standard" value="standard" checked={plan==='standard'} onChange={() => setPlan('standard')} />
<Radio label="Pro" description="Includes all features" value="pro" checked={plan==='pro'} onChange={() => setPlan('pro')} />
<Radio label="Unavailable" disabled />
```
