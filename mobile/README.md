# Neo Design System — Mobile

React Native component library for the Neo Design System.
Black & Violet · Dark-mode-first · Expo

---

## Components

| Component   | Description                                   |
|-------------|-----------------------------------------------|
| `Button`    | Pressable with 5 variants and 5 sizes         |
| `Text`      | Typography with 12 variants and 8 colors      |
| `Badge`     | Status labels with 7 variants                 |
| `Avatar`    | Image / initials with status indicator        |
| `AvatarGroup` | Stacked avatar row with overflow count      |
| `Card`      | Surface container with header/body/footer     |
| `Input`     | Text field with label, hint, error states     |
| `Switch`    | Animated toggle with Animated API             |
| `Spinner`   | Loading indicator — ring, dots, pulse         |
| `Tabs`      | Horizontal tabs — line, pill, enclosed        |
| `Divider`   | Horizontal/vertical separator with label      |
| `Checkbox`  | Animated checkbox with indeterminate state    |
| `Radio`     | Animated radio button + radio group pattern   |

---

## Getting started

```bash
cd mobile
npm install
```

## Run Storybook

```bash
npm start   # Expo dev server with Storybook
```

Storybook is the default entry point (`index.js`). It runs on-device via Expo Go or a simulator.

---

## Tokens

All tokens live in `src/tokens/index.ts`:

```ts
import { colors, spacing, radii, typography, hitSlop } from '@neo/mobile/tokens';
```

---

## Usage

```tsx
import { Button, Text, Badge, Card } from '@neo/mobile/components';

<Card variant="brand" padding="lg">
  <Text variant="h3">Hello, Neo</Text>
  <Badge variant="success" dot>Active</Badge>
  <Button variant="primary" size="md">Get started</Button>
</Card>
```
