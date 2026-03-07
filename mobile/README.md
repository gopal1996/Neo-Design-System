# Neo Design System — Mobile

React Native component library for the Neo Design System.
Black & Violet · Dark-mode-first · Expo

---

## Getting started

```bash
cd mobile
npm install
```

---

## Running Storybook

Storybook in React Native is **not a standalone server** — it's a component rendered inside the Expo app, toggled via an environment variable.

### On iOS Simulator
```bash
npm run storybook:ios
```

### On Android Emulator
```bash
npm run storybook:android
```

### Via Expo Go (scan QR)
```bash
npm run storybook
```

Then open the Expo Go app on your device and scan the QR code.

> The `STORYBOOK_ENABLED=true` env var is set by these scripts (via `cross-env`).
> Without it, `npm start` launches the placeholder app instead.

---

## Running the app (without Storybook)

```bash
npm start          # Expo dev server
npm run ios        # iOS Simulator directly
npm run android    # Android Emulator directly
```

---

## How the toggle works

```
index.js
  ↓ reads Constants.expoConfig.extra.storybookEnabled
  ↓ if 'true'  → loads .storybook/index.ts → StorybookUIRoot
  ↓ if missing → loads App.tsx             → placeholder screen
```

`app.config.js` exposes the env var to Expo:
```js
extra: {
  storybookEnabled: process.env.STORYBOOK_ENABLED,
}
```

---

## Components (17 total)

| Component        | Description                                    |
|------------------|------------------------------------------------|
| `AppBar`         | Top nav bar with left/right slots + back btn   |
| `Avatar`         | Image / initials with status dot               |
| `AvatarGroup`    | Stacked avatars with overflow count            |
| `Badge`          | Status label — 7 variants                     |
| `Banner`         | Inline alert — info/success/warning/error      |
| `BottomNavigation` | Animated tab bar with badge support          |
| `Button`         | 5 variants · 5 sizes · loading state          |
| `Card`           | Surface with Header/Body/Footer slots          |
| `Checkbox`       | Animated check + indeterminate state           |
| `DataTable`      | Sort · search · custom columns · pagination   |
| `Divider`        | Horizontal/vertical separator with label       |
| `FAB`            | Floating action button — standard + extended  |
| `Input`          | TextInput with label, hint, error, focus ring  |
| `Radio`          | Animated radio + radio group pattern          |
| `Spinner`        | ring / dots / pulse                           |
| `Switch`         | Animated toggle — sm / md / lg               |
| `Tabs`           | line / pill / enclosed variants               |
| `Text`           | 12 variants · 8 semantic colors               |

---

## Tokens

```ts
import { colors, spacing, radii, typography, hitSlop } from './src/tokens';
```

---

## Usage in your RN project

```tsx
import { Button, Text, Badge, Card, CardBody } from '@neo/mobile/components';

<Card variant="brand" padding="lg">
  <CardBody>
    <Text variant="h3">Hello, Neo</Text>
    <Badge variant="success" dot>Active</Badge>
    <Button variant="primary" size="md">Get started</Button>
  </CardBody>
</Card>
```
