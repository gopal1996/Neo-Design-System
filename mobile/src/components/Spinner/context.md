# Spinner

Loading indicator in three animation styles. Accessible via `accessibilityRole="progressbar"`.

## Exports
`Spinner`, `SpinnerProps`, `SpinnerSize`, `SpinnerVariant`

## Props

| Prop      | Type             | Default        | Notes                          |
|-----------|------------------|----------------|--------------------------------|
| `size`    | `SpinnerSize`    | `md`           |                                |
| `variant` | `SpinnerVariant` | `ring`         |                                |
| `color`   | `string`         | `violet400`    | Any valid RN color string      |
| `style`   | `ViewStyle`      | —              | Applied to the container view  |

## Size Map (dp, square container)

| Size | px |
|------|----|
| `xs` | 12 |
| `sm` | 16 |
| `md` | 24 |
| `lg` | 32 |
| `xl` | 48 |

## Variants

### `ring`
Rotating arc using `Animated.loop` + `Easing.linear` (800ms). Stroke width = `Math.max(2, Math.round(size * 0.1))`. Track color = `${color}30` (12% opacity).

### `dots`
Three bouncing dots with staggered delays (0ms, 120ms, 240ms). Each dot `Math.max(4, Math.round(size * 0.3))` dp. Uses `translateY` to bounce upward.

### `pulse`
Single circle that scales 1→1.5→1 and fades 0.8→0.2→0.8 in 700ms loop. Uses `Animated.parallel`.

## Accessibility
- `accessibilityRole="progressbar"`
- `accessibilityLabel="Loading"`

## Usage

```tsx
import { Spinner } from '@neo/mobile';
import { colors } from '@neo/mobile';

<Spinner />
<Spinner size="xl" />
<Spinner variant="dots" size="md" />
<Spinner variant="pulse" color={colors.success} />
<Spinner variant="ring" size="sm" color={colors.textSecondary} />
```
