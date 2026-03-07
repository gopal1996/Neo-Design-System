# FAB (Floating Action Button)

Spring-animated floating button with show/hide animation. Supports a standard circular form and an extended pill form (when `label` is provided).

## Exports
`FAB`, `FABProps`, `FABSize`, `FABVariant`

## Props

| Prop                 | Type           | Default     | Notes                                    |
|----------------------|----------------|-------------|------------------------------------------|
| `icon`               | `ReactNode`    | — (required)| Wrapped in a sized View                  |
| `label`              | `string`       | —           | Makes FAB extended (pill shape)          |
| `size`               | `FABSize`      | `md`        |                                          |
| `variant`            | `FABVariant`   | `primary`   |                                          |
| `onPress`            | `() => void`   | — (required)|                                          |
| `visible`            | `boolean`      | `true`      | Spring animates in/out                   |
| `disabled`           | `boolean`      | `false`     | 45% opacity                              |
| `accessibilityLabel` | `string`       | — (required)| Required for icon-only buttons           |
| `style`              | `ViewStyle`    | —           | Applied to the outer animated wrapper    |

## Size Map

| Size | Circular size | Icon size | Label FontSize | Extended height | Extended paddingH |
|------|--------------|-----------|----------------|-----------------|-------------------|
| `sm` | 40           | 18        | 13             | 36              | 14                |
| `md` | 56           | 24        | 14             | 48              | 20                |
| `lg` | 64           | 28        | 15             | 56              | 24                |

## Variants

| Variant     | Background  | Text/Icon color | Shadow color              |
|-------------|-------------|-----------------|---------------------------|
| `primary`   | `violet500` | `#ffffff`       | `rgba(124,58,237,0.5)`    |
| `secondary` | `bgOverlay` | `violet300`     | `rgba(0,0,0,0.3)`         |
| `surface`   | `bgMuted`   | `textSecondary` | `rgba(0,0,0,0.25)`        |

## Animations
- `Animated.spring` on scale: `visible ? 1 : 0` (damping=14, stiffness=180)
- `Animated.timing` on opacity: `visible ? 1 : 0` (200ms)
- Both run in parallel

## Shape
- Circular (no label): `width = height = cfg.size`, `borderRadius = size / 2`
- Extended (with label): `width = undefined` (wraps content), `height = cfg.extended.height`, `borderRadius = radii.full`

## Shadow
- iOS: `shadowOffset: {0, 4}`, `shadowOpacity: 0.4`, `shadowRadius: 8`
- Android: `elevation: 6`

## Positioning

The FAB is not positioned absolutely by default — the consumer must position it:

```tsx
// Typical fixed bottom-right positioning
<View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
  <FAB
    style={{ position: 'absolute', bottom: insets.bottom + 16, right: 16 }}
    icon={<PlusIcon />}
    onPress={create}
    accessibilityLabel="Create new item"
  />
</View>
```

## Usage

```tsx
import { FAB } from '@neo/mobile';

// Standard circular
<FAB
  icon={<PlusIcon />}
  onPress={handleCreate}
  accessibilityLabel="Create new post"
/>

// Extended with label
<FAB
  icon={<PlusIcon />}
  label="New Post"
  size="md"
  onPress={handleCreate}
  accessibilityLabel="Create new post"
/>

// Conditionally visible (hides while scrolling)
<FAB
  icon={<EditIcon />}
  variant="secondary"
  onPress={handleEdit}
  visible={!isScrolling}
  accessibilityLabel="Edit"
/>
```
