# BottomNavigation

Fixed bottom tab bar with animated active indicator, spring-scaled icons, and badge support.

## Exports
`BottomNavigation`, `BottomNavigationProps`, `BottomNavItem`

## Props

| Prop             | Type                   | Default | Notes                                       |
|------------------|------------------------|---------|---------------------------------------------|
| `items`          | `BottomNavItem[]`      | — (required) |                                        |
| `active`         | `string`               | — (required) | ID of currently active tab             |
| `onChange`       | `(id: string) => void` | — (required) |                                        |
| `safeAreaBottom` | `number`               | `0`     | Pass `useSafeAreaInsets().bottom`           |
| `style`          | `ViewStyle`            | —       |                                             |

## BottomNavItem Shape

```ts
interface BottomNavItem {
  id:     string;
  label:  string;
  icon:   (active: boolean) => ReactNode;   // change color based on active state
  badge?: string | number | boolean;        // see badge behaviour below
}
```

## Badge Behaviour

| Badge value     | Renders                  |
|-----------------|--------------------------|
| `true`          | 8dp red dot              |
| `number > 0`    | Red pill with count (99+ capped) |
| `false` / `undefined` | Nothing           |

Badge position: `top: -2, right: -4` on the icon wrapper.

## Animations (per tab item)
- `Animated.spring` on icon scale: active=1, inactive=0.85 (damping=15, stiffness=200)
- `Animated.timing` on indicator opacity: active=1, inactive=0 (150ms)
- Label color: `Animated.timing` interpolated between `textTertiary` (inactive) and `violet300` (active)
- Active indicator: 24dp wide × 3dp tall violet bar, `borderRadius: full`, above the icon

## Layout
- `flexDirection: row`, `accessibilityRole="tablist"`
- Background: `bgSubtle`, `borderTopWidth: hairlineWidth` in `border`
- iOS shadow: `shadowOffset {0, -2}`, `shadowOpacity: 0.08`, `shadowRadius: 8`
- Android: `elevation: 8`
- Each tab: `flex: 1`, `alignItems: center`, `gap: 4`
- Label: `fontSize: 10`, `fontWeight: medium`

## Icon Color Pattern

The `icon` prop receives `active: boolean` — use it to swap colors:

```tsx
icon: (active) => (
  <HomeIcon
    color={active ? colors.violet300 : colors.textTertiary}
    width={22}
    height={22}
  />
)
```

## Usage

```tsx
import { BottomNavigation } from '@neo/mobile';
import { colors } from '@neo/mobile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { bottom } = useSafeAreaInsets();

const tabs: BottomNavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: (a) => <HomeIcon color={a ? colors.violet300 : colors.textTertiary} />,
  },
  {
    id: 'explore',
    label: 'Explore',
    icon: (a) => <SearchIcon color={a ? colors.violet300 : colors.textTertiary} />,
  },
  {
    id: 'notifications',
    label: 'Alerts',
    icon: (a) => <BellIcon color={a ? colors.violet300 : colors.textTertiary} />,
    badge: 4,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: (a) => <UserIcon color={a ? colors.violet300 : colors.textTertiary} />,
  },
];

const [active, setActive] = React.useState('home');

<BottomNavigation items={tabs} active={active} onChange={setActive} safeAreaBottom={bottom} />
```
