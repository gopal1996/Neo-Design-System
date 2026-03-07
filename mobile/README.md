# @neo-design-library/mobile

Neo Design System — React Native component library for modern SaaS products.

**Black & Violet · Dark-only · React Native + Expo**

---

## Installation

```bash
npm install @neo-design-library/mobile
```

> **Peer dependencies** — React 18+ and React Native 0.73+ must already be installed in your project.

---

## Setup

Import tokens from the package and apply them to your StyleSheet:

```tsx
import { nativeColors, nativeSpacing, nativeTypography, nativeRadii } from '@neo-design-library/mobile';
```

---

## Usage

```tsx
import { Button, Card, Input, Badge, Text, Avatar, Spinner } from '@neo-design-library/mobile';

export default function Example() {
  return (
    <Card variant="elevated" padding="lg">
      <Text variant="h3">Welcome back</Text>
      <Text variant="body" color="secondary">Sign in to your account</Text>

      <Input label="Email" placeholder="you@example.com" />
      <Input label="Password" secureTextEntry />

      <Button variant="primary" size="md" fullWidth>
        Sign in
      </Button>
    </Card>
  );
}
```

---

## Components

| Component | Description |
|-----------|-------------|
| `Button` | Primary, secondary, ghost, danger, success variants — xs to xl sizes |
| `Input` | Label, hint, error, icon slots |
| `Badge` | Status indicators — default, brand, success, warning, error, info, outline |
| `Card` / `CardHeader` / `CardBody` / `CardFooter` | Surface containers |
| `Text` | Typography scale — display, h1–h5, body-lg, body, body-sm, caption, overline |
| `Avatar` / `AvatarGroup` | Image, initials, placeholder — xs to 2xl, status dot |
| `Switch` | Controlled + uncontrolled — sm, md, lg |
| `Tabs` / `TabPanel` | line, pill, enclosed variants |
| `Spinner` | ring, dots, pulse variants — xs to xl |

---

## Design Tokens

All tokens are plain numbers (dp) — no string units.

```ts
import {
  nativeColors,    // { bgBase, bgElevated, violet500, textPrimary, ... }
  nativeSpacing,   // { space1: 4, space2: 8, space4: 16, ... }
  nativeTypography,// { bodySize: 16, h1Size: 36, ... }
  nativeRadii,     // { sm: 4, md: 8, lg: 12, full: 9999 }
  nativeShadows,   // { glowViolet, sm, md, lg }
  hitSlop,         // { top: 10, bottom: 10, left: 10, right: 10 } — 44dp touch targets
} from '@neo-design-library/mobile';
```

### Glow effect (iOS)

```ts
import { nativeShadows } from '@neo-design-library/mobile';

<View style={[styles.card, nativeShadows.glowViolet]} />
```

### Android elevation

```ts
<View style={{ elevation: nativeShadows.md.elevation }} />
```

---

## Claude Code Integration

Installing this package automatically adds a `/neo` skill to Claude Code. In any project, run:

```
/neo
```

This loads the full Neo design system context — tokens, component APIs, Figma MCP flow, and styling rules — into your Claude session.

**Manual install** (if the postinstall didn't run or you don't use npm):

```bash
curl -fsSL https://raw.githubusercontent.com/gopal1996/Neo-Design-System/refs/heads/main/mobile/neo.md \
  -o ~/.claude/skills/neo.md
```

---

## Storybook

```bash
git clone <repo>
cd mobile
npm install
npm run storybook   # opens Expo with Storybook UI
```

---

## License

MIT
