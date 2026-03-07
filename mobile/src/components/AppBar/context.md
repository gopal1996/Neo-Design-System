# AppBar

Top navigation bar with left/right slots, centered title/subtitle, and status bar awareness.

## Exports
`AppBar`, `AppBarBackButton`, `AppBarAction`, `AppBarProps`, `AppBarVariant`

## AppBar Props

| Prop          | Type                                | Default    | Notes                                    |
|---------------|-------------------------------------|------------|------------------------------------------|
| `title`       | `string`                            | — (required)|                                         |
| `subtitle`    | `string`                            | —          |                                          |
| `left`        | `ReactNode`                         | —          | Use `AppBarBackButton`                   |
| `right`       | `ReactNode`                         | —          | Use one or more `AppBarAction`           |
| `variant`     | `default\|transparent\|elevated`    | `default`  |                                          |
| `safeAreaTop` | `number`                            | auto       | Falls back to `StatusBar.currentHeight` on Android, 0 on iOS |
| `style`       | `ViewStyle`                         | —          |                                          |

## Variants

| Variant       | Background  | Border bottom    | Shadow |
|---------------|-------------|------------------|--------|
| `default`     | `bgSubtle`  | `border` (hairline) | No  |
| `transparent` | transparent | none             | No     |
| `elevated`    | `bgOverlay` | `border` (hairline) | Yes  |

## AppBarBackButton Props

| Prop      | Type        | Default      | Notes                          |
|-----------|-------------|--------------|--------------------------------|
| `onPress` | `() => void`| — (required) |                                |
| `label`   | `string`    | `'Go back'`  | accessibilityLabel fallback    |

Renders a 40×40dp circular touch target with an inline chevron-left icon made from two View rectangles.

## AppBarAction Props

| Prop                 | Type              | Notes                                 |
|----------------------|-------------------|---------------------------------------|
| `icon`               | `ReactNode`       | Wrapped in 24×24dp View               |
| `onPress`            | `() => void`      |                                       |
| `accessibilityLabel` | `string`          | Required for icon-only buttons        |
| `badge`              | `boolean\|number` | `true`=dot, number=count (capped 99+) |

## Layout
- `flexDirection: row`, `alignItems: center`, `minHeight: 56`
- `paddingHorizontal: 16`, `paddingBottom: 12`
- `paddingTop`: `safeAreaTop + spacing[2]`
- Left/right slots: `minWidth: 40`, `flexDirection: row`
- Center: `flex: 1`, `alignItems: center`, `pointerEvents: none`
- Title: `fontSize: 17`, `fontWeight: semibold`, `letterSpacing: -0.3`
- Subtitle: `fontSize: 12`, `fontWeight: regular`, `color: textSecondary`

## Notes
- Pass `safeAreaTop={insets.top}` (from `useSafeAreaInsets()`) on iOS for notch/Dynamic Island support
- On Android, `StatusBar.currentHeight` is used automatically
- For `transparent` variant on top of scrollable content, manage status bar style via `expo-status-bar`

## Usage

```tsx
import { AppBar, AppBarBackButton, AppBarAction } from '@neo/mobile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { top } = useSafeAreaInsets();

// Back navigation
<AppBar
  title="Settings"
  safeAreaTop={top}
  left={<AppBarBackButton onPress={() => navigation.goBack()} />}
/>

// With actions + badge
<AppBar
  title="Inbox"
  subtitle="3 unread"
  safeAreaTop={top}
  left={<AppBarBackButton onPress={goBack} />}
  right={
    <AppBarAction
      icon={<BellIcon />}
      onPress={openNotifications}
      accessibilityLabel="Notifications"
      badge={3}
    />
  }
/>

// Transparent over hero image
<AppBar title="Photo" variant="transparent" safeAreaTop={top} left={<AppBarBackButton onPress={goBack} />} />
```
