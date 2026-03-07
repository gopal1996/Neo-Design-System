# @neo-design-library/web

Neo Design System — React component library for modern SaaS products.

**Black & Violet · Dark-only · React + Tailwind**

---

## Installation

```bash
npm install @neo-design-library/web
```

> **Peer dependencies** — React 18+ and React DOM 18+ must already be installed in your project.

---

## Setup

Import the stylesheet once at your app entry point:

```tsx
// main.tsx  |  _app.tsx  |  app/layout.tsx
import '@neo-design-library/web/styles.css';
```

That's it. No Tailwind config required in your project.

---

## Usage

```tsx
import { Button, Card, CardBody, Input, Badge, Text, Avatar, Spinner } from '@neo-design-library/web';

export default function Example() {
  return (
    <Card variant="elevated" padding="lg">
      <Text variant="h3">Welcome back</Text>
      <Text variant="body" color="secondary">Sign in to your account</Text>

      <Input label="Email" placeholder="you@example.com" />
      <Input label="Password" type="password" />

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
| `Input` | Label, hint, error, icon slots — forwardRef |
| `Badge` | Status indicators — default, brand, success, warning, error, info, outline |
| `Card` / `CardHeader` / `CardBody` / `CardFooter` | Surface containers — default, elevated, brand, flat |
| `Text` | Typography scale — display, h1–h5, body-lg, body, body-sm, caption, overline |
| `Avatar` / `AvatarGroup` | Image, initials, placeholder — xs to 2xl, status dot |
| `Switch` | Controlled + uncontrolled — sm, md, lg |
| `Tabs` / `TabPanel` | line, pill, enclosed variants — badge support, disabled tabs |
| `Spinner` | ring, dots, pulse variants — xs to xl |
| `Checkbox` | Indeterminate state, controlled + uncontrolled |
| `Radio` | Group pattern, sm to lg |
| `Divider` | Horizontal + vertical, label, 4 variants |
| `Table` | Sort, search, pagination, custom cells, striped rows |
| `Modal` | Sizes sm–xl, focus trap, backdrop dismiss |
| `Tooltip` | 4 positions, delay, controlled |
| `EmptyState` | Icon, title, description, action slot |
| `Shimmer` | Loading skeleton blocks |
| `DatePicker` | Controlled date selection |
| `Sidebar` / `Topbar` | App navigation shell |

---

## Component API examples

### Button

```tsx
<Button variant="primary" size="md" loading={false} iconLeft={<PlusIcon />}>
  Create project
</Button>
```

`variant`: `primary` | `secondary` | `ghost` | `danger` | `success`
`size`: `xs` | `sm` | `md` | `lg` | `xl`

### Badge

```tsx
<Badge variant="success" dot>Live</Badge>
<Badge variant="warning">Beta</Badge>
```

### Table

```tsx
const columns: ColumnDef<User>[] = [
  { key: 'name',   header: 'Name',   sortable: true },
  { key: 'email',  header: 'Email',  sortable: true },
  { key: 'status', header: 'Status',
    renderCell: (val) => <Badge variant="brand">{String(val)}</Badge> },
  { key: 'actions', header: '', sortable: false, searchable: false,
    renderCell: (_, row) => <Button size="xs" variant="ghost">Edit</Button> },
];

<Table
  columns={columns}
  data={rows}
  rowKey="id"
  sortable
  searchable
  pageSize={10}
  striped
/>
```

### Avatar

```tsx
<Avatar name="Jane Doe" size="md" status="online" />
<AvatarGroup avatars={list} max={4} size="sm" />
```

### Tabs

```tsx
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'analytics', label: 'Analytics', badge: 3 },
  { id: 'settings', label: 'Settings' },
];

<Tabs items={tabs} variant="pill" onChange={setActive}>
  <TabPanel id="overview">...</TabPanel>
  <TabPanel id="analytics">...</TabPanel>
  <TabPanel id="settings">...</TabPanel>
</Tabs>
```

---

## Design tokens

All colors, spacing, and radii are exposed as CSS custom properties from `styles.css`.

```css
/* Colors */
var(--violet-500)       /* #7C3AED — primary brand */
var(--bg-base)          /* #000000 — page background */
var(--bg-elevated)      /* #0F0F1A — cards, surfaces */
var(--text-primary)     /* #F0F0F8 — body text */
var(--text-secondary)   /* #9898B3 — labels, subtext */
var(--border)           /* #2C2C4A — default borders */

/* Spacing (4px grid) */
var(--space-1)  /* 4px */
var(--space-2)  /* 8px */
var(--space-4)  /* 16px */
var(--space-6)  /* 24px */
var(--space-8)  /* 32px */

/* Radii */
var(--radius-sm)   /* 4px */
var(--radius-md)   /* 8px */
var(--radius-lg)   /* 12px */
var(--radius-full) /* 9999px */
```

---

## Storybook

```bash
git clone <repo>
cd design-system
npm install
npm run storybook   # http://localhost:6006
```

---

## License

MIT
