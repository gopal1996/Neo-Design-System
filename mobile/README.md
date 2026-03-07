# @neo-design-library/mobile

Neo Design System — React Native component library for modern mobile apps.

**Black & Violet · Dark-only · Expo SDK 52 · React Native**

---

## Installation

```bash
npx expo install @neo-design-library/mobile
```

Install required peer dependencies:

```bash
npx expo install \
  react-native-safe-area-context \
  react-native-reanimated \
  react-native-gesture-handler \
  react-native-svg
```

---

## Setup

Wrap your root component with `SafeAreaProvider`:

```tsx
// App.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <YourApp />
    </SafeAreaProvider>
  );
}
```

---

## Usage

```tsx
import { View } from 'react-native';
import { Button, Card, CardBody, Input, Badge, Text, colors } from '@neo-design-library/mobile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Screen() {
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgBase, padding: 16, paddingTop: top }}>
      <Text variant="h3">Welcome back</Text>
      <Text variant="body" color="secondary">Sign in to your account</Text>

      <Input label="Email" placeholder="you@example.com" />

      <Button variant="primary" size="md" onPress={() => {}}>
        Sign in
      </Button>
    </View>
  );
}
```

---

## Components

| Component | Description |
|-----------|-------------|
| `Button` | primary, secondary, ghost, danger, success — xs to xl, loading state |
| `Text` | display, h1–h5, body-lg, body, body-sm, caption, overline, mono |
| `Badge` | default, brand, success, warning, error, info, outline — sm to lg, dot |
| `Avatar` / `AvatarGroup` | Image, initials, placeholder — xs to 2xl, status dot, overflow stack |
| `Card` / `CardHeader` / `CardBody` / `CardFooter` | default, elevated, brand, flat |
| `Input` | Label, hint, error, icon slots — sm to lg, forwardRef |
| `Switch` | Controlled + uncontrolled — sm, md, lg |
| `Spinner` | ring, dots, pulse — xs to xl |
| `Tabs` / `TabPanel` | line, pill, enclosed — badge, disabled tabs |
| `Checkbox` | Indeterminate, controlled + uncontrolled — sm to lg |
| `Radio` | Cannot deselect — group pattern — sm to lg |
| `Divider` | Horizontal + vertical, label, 4 variants |
| `AppBar` | default, transparent, elevated — status bar aware, back + action slots |
| `Banner` | info, success, warning, error — title, dismiss, 2 actions |
| `BottomNavigation` | Spring animation, badge, safe area aware |
| `FAB` | primary, secondary, surface — sm to lg, extended (pill) form |
| `DataTable` | Sort, search, pagination, custom cells, striped rows |

---

## Component API examples

### Button

```tsx
import { Button } from '@neo-design-library/mobile';

<Button variant="primary" size="md" onPress={handlePress}>
  Get started
</Button>

<Button variant="ghost" size="sm" loading={isLoading} onPress={handlePress}>
  Cancel
</Button>
```

`variant`: `primary` | `secondary` | `ghost` | `danger` | `success`
`size`: `xs` | `sm` | `md` | `lg` | `xl`

### AppBar

```tsx
import { AppBar } from '@neo-design-library/mobile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { top } = useSafeAreaInsets();

<AppBar
  title="Settings"
  safeAreaTop={top}
  onBack={() => navigation.goBack()}
/>
```

### BottomNavigation

```tsx
import { BottomNavigation, colors } from '@neo-design-library/mobile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { bottom } = useSafeAreaInsets();
const [active, setActive] = React.useState('home');

const tabs = [
  { id: 'home',    label: 'Home',    icon: (a) => <HomeIcon color={a ? colors.violet300 : colors.textTertiary} /> },
  { id: 'explore', label: 'Explore', icon: (a) => <SearchIcon color={a ? colors.violet300 : colors.textTertiary} /> },
  { id: 'profile', label: 'Profile', icon: (a) => <UserIcon color={a ? colors.violet300 : colors.textTertiary} />, badge: 2 },
];

<BottomNavigation
  items={tabs}
  active={active}
  onChange={setActive}
  safeAreaBottom={bottom}
/>
```

### FAB

```tsx
import { FAB } from '@neo-design-library/mobile';

<FAB
  icon={<PlusIcon />}
  onPress={handleCreate}
  visible={!isScrolling}
  style={{ position: 'absolute', bottom: insets.bottom + 16, right: 16 }}
  accessibilityLabel="Create new item"
/>
```

### DataTable

```tsx
import { DataTable } from '@neo-design-library/mobile';
import type { ColumnDef } from '@neo-design-library/mobile';

const columns: ColumnDef<User>[] = [
  { key: 'name',   header: 'Name',   sortable: true, width: 140 },
  { key: 'email',  header: 'Email',  sortable: true, width: 200 },
  { key: 'status', header: 'Status', width: 100,
    renderCell: (v) => <Badge variant="brand">{String(v)}</Badge> },
];

<DataTable
  columns={columns}
  data={users}
  rowKey="id"
  sortable
  searchable
  pageSize={10}
  striped
  loading={isFetching}
/>
```

---

## Design tokens

```tsx
import { colors, spacing, radii, typography } from '@neo-design-library/mobile';

// Colors
colors.bgBase        // '#000000' — screen background
colors.bgElevated    // '#0F0F1A' — cards, surfaces
colors.violet500     // '#7C3AED' — primary brand
colors.violet300     // '#A78BFA' — active states
colors.textPrimary   // '#F0F0F8' — body text
colors.textSecondary // '#9898B3' — labels, subtext
colors.border        // '#2C2C4A' — default borders
colors.success       // '#10B981'
colors.warning       // '#F59E0B'
colors.error         // '#EF4444'

// Spacing — 4px grid, plain dp numbers
spacing[1]  // 4
spacing[2]  // 8
spacing[4]  // 16
spacing[6]  // 24
spacing[8]  // 32

// Radii (dp)
radii.sm    // 4
radii.md    // 8
radii.lg    // 12
radii.xl    // 16
radii.full  // 9999
```

---

## Storybook (development)

Storybook runs inside the Expo app, toggled by an environment variable:

```bash
cd mobile
npm install

npm run storybook          # Expo Go (scan QR)
npm run storybook:ios      # iOS Simulator
npm run storybook:android  # Android Emulator
```

---

## Key rules

- Always pass `safeAreaTop` / `safeAreaBottom` from `useSafeAreaInsets()` to `AppBar` and `BottomNavigation`
- Never hardcode colors — use `colors.*` tokens
- Minimum touch target: 44×44 dp

---

## License

MIT
