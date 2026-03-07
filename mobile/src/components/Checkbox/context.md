# Checkbox

Animated checkbox with spring scale + color transition. Supports indeterminate state. Controlled and uncontrolled modes.

## Exports
`Checkbox`, `CheckboxProps`, `CheckboxSize`

## Props

| Prop             | Type                    | Default | Notes                                    |
|------------------|-------------------------|---------|------------------------------------------|
| `checked`        | `boolean`               | —       | Controlled mode when provided            |
| `defaultChecked` | `boolean`               | `false` | Uncontrolled initial value               |
| `onChange`       | `(v: boolean) => void`  | —       |                                          |
| `label`          | `string`                | —       |                                          |
| `description`    | `string`                | —       | Shown below label when no error          |
| `error`          | `string`                | —       | Shown below; overrides description       |
| `size`           | `CheckboxSize`          | `md`    |                                          |
| `disabled`       | `boolean`               | `false` | 45% opacity                              |
| `indeterminate`  | `boolean`               | `false` | Renders dash marker instead of checkmark |
| `style`          | `ViewStyle`             | —       |                                          |

## Size Map (dp)

| Size | Box | FontSize | BorderRadius |
|------|-----|----------|--------------|
| `sm` | 14  | 13       | `radii.xs` (2) |
| `md` | 16  | 14       | `radii.sm` (4) |
| `lg` | 20  | 16       | `radii.md` (8) |

## Visual States

| State           | Border color   | Background        |
|-----------------|----------------|-------------------|
| Unchecked       | `borderStrong` | `bgElevated`      |
| Checked         | `violet500`    | `violet500` (animated) |
| Indeterminate   | `violet500`    | `violet500` (animated) |
| Error           | `error`        | `bgElevated`      |

## Animations
- `Animated.spring` on scale (0→1), damping=12, stiffness=160
- `Animated.timing` on bg color (bgElevated→violet500), 150ms
- Both run in parallel on `isChecked || indeterminate` change

## Checkmark
Pure RN View: two rectangles rotated 45° forming an L-shape, white color.
Indeterminate: single horizontal dash (white, `height: 2`, `borderRadius: 1`).

## Accessibility
- `accessibilityRole="checkbox"`
- `accessibilityState={{ checked: isChecked, disabled }}`
- Error text: `accessibilityRole="alert"`

## Usage

```tsx
import { Checkbox } from '@neo/mobile';

<Checkbox label="I agree to the terms" onChange={setAgreed} />

<Checkbox
  label="Select all"
  checked={allSelected}
  indeterminate={someSelected}
  onChange={handleSelectAll}
/>

<Checkbox
  label="Accept"
  error="You must accept the terms to continue"
/>

<Checkbox
  label="Premium feature"
  description="Only available on paid plans"
  disabled
/>
```
