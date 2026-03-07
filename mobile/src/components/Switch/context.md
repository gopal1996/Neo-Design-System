# Switch

Animated toggle with smooth track color and thumb position transitions. Supports controlled and uncontrolled modes.

## Exports
`Switch`, `SwitchProps`, `SwitchSize`

## Props

| Prop             | Type                | Default | Notes                                   |
|------------------|---------------------|---------|-----------------------------------------|
| `checked`        | `boolean`           | —       | Controlled mode when provided           |
| `defaultChecked` | `boolean`           | `false` | Uncontrolled initial value              |
| `onChange`       | `(v: boolean) => void` | —    |                                         |
| `disabled`       | `boolean`           | `false` | Prevents interaction, 50% opacity       |
| `size`           | `SwitchSize`        | `md`    |                                         |
| `label`          | `string`            | —       | Rendered inline to the right of track  |
| `hint`           | `string`            | —       | Rendered below the row                  |
| `style`          | `ViewStyle`         | —       |                                         |

## Size Map (dp)

| Size | TrackW | TrackH | ThumbSize | ThumbOffset | ThumbTravel |
|------|--------|--------|-----------|-------------|-------------|
| `sm` | 32     | 18     | 12        | 3           | 14          |
| `md` | 44     | 24     | 18        | 3           | 20          |
| `lg` | 56     | 30     | 22        | 4           | 26          |

## Animations
- Track background: `Animated.timing`, 200ms between `neutral700` (off) and `violet500` (on)
- Thumb position: `Animated.timing`, 200ms, `useNativeDriver: false`
- Both use the same `anim` value (0→1)
- `borderRadius` on track = `trackH / 2` (pill), thumb = `thumbSize / 2`

## Accessibility
- `accessibilityRole="switch"`
- `accessibilityState={{ checked: isOn, disabled }}`

## Usage

```tsx
import { Switch } from '@neo/mobile';

// Uncontrolled
<Switch label="Enable notifications" />

// Controlled
const [enabled, setEnabled] = React.useState(false);
<Switch
  checked={enabled}
  onChange={setEnabled}
  label="Dark mode"
  hint="Applies immediately"
/>

// Disabled
<Switch label="Premium feature" disabled />

// Large
<Switch size="lg" label="Master toggle" onChange={handleChange} />
```
