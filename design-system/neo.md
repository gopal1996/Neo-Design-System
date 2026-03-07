---
name: neo
description: Load Neo Design System context — Black & Violet, CSS Modules, design tokens, component APIs, Figma MCP flow. Use when building UI for any project that consumes the Neo design system (web or mobile).
---

You are now working with the **Neo Design System**. Apply all rules below for this entire session. Do not deviate from these conventions unless the user explicitly overrides them.

---

# Neo Design System Rules

Black & Violet · Modern SaaS · Web + Mobile

---

## Identity

- **Name:** Neo
- **Palette:** Black (#000000) + Violet (#7C3AED primary) + purple-tinted neutrals
- **Platforms:** Web (React + CSS Modules) and Mobile (React Native)
- **Tone:** Premium, technical, dark-mode-first

---

## Figma MCP Integration

### Required Flow (never skip)

1. Run `get_design_context` for the target node(s)
2. If the response is truncated, run `get_metadata` to map the tree, then re-fetch specific nodes
3. Run `get_screenshot` for visual reference
4. Translate React+Tailwind output → Neo components + CSS Modules (see rules below)
5. Validate final UI against the screenshot for 1:1 visual parity

### Translation Rules

- Replace Tailwind utility classes with CSS Modules referencing CSS custom properties
- Map ALL colors to Neo CSS variables (`var(--violet-500)`, `var(--bg-elevated)`, etc.)
- NEVER hardcode hex values — always use tokens
- Reuse existing Neo components before creating new ones
- Use `var(--font-sans)` / `var(--font-mono)` — never specify raw font stacks

---

## File Structure

```
design-system/
├── src/
│   ├── tokens/
│   │   ├── colors.ts        # JS color tokens
│   │   ├── typography.ts    # JS typography tokens
│   │   ├── spacing.ts       # JS spacing tokens (4px grid)
│   │   ├── radii.ts         # Border radii
│   │   ├── shadows.ts       # Shadow + glow tokens
│   │   ├── breakpoints.ts   # Responsive breakpoints
│   │   ├── native.ts        # React Native tokens (number values)
│   │   └── index.ts
│   ├── styles/
│   │   └── globals.css      # CSS custom properties + resets + utilities
│   ├── components/
│   │   ├── Button/          # Button.tsx + Button.module.css
│   │   ├── Input/
│   │   ├── Badge/
│   │   ├── Card/
│   │   ├── Typography/      # <Text> component
│   │   ├── Avatar/          # Avatar + AvatarGroup
│   │   ├── Switch/
│   │   ├── Tabs/            # Tabs + TabPanel
│   │   ├── Spinner/
│   │   ├── Navigation/      # Sidebar + Topbar
│   │   └── Modal/
│   └── index.ts
```

---

## Component Rules

- IMPORTANT: Always use components from `design-system/src/components/` when available
- New components go in `design-system/src/components/<ComponentName>/`
- Each component directory must contain: `ComponentName.tsx`, `ComponentName.module.css`, `index.ts`
- Export with named export: `export const ComponentName`
- Always use `React.forwardRef` for form elements
- Every interactive element needs `:focus-visible` styles and `aria-*` attributes

### Component Props Pattern

```tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?:    'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
}
```

---

## Styling Rules

- IMPORTANT: Use CSS Modules (`.module.css`) for all component styles
- IMPORTANT: Never hardcode colors — use CSS custom properties from `globals.css`
- CSS variables follow the pattern: `var(--{category}-{scale})` e.g. `var(--violet-500)`, `var(--bg-elevated)`
- Spacing uses `var(--space-{n})` tokens on the 4px grid
- Radii use `var(--radius-{size})` tokens
- Shadows use `var(--shadow-{size})` and `var(--shadow-glow-{size})`
- Transitions use `var(--transition-fast)` (150ms), `var(--transition-base)` (200ms), `var(--transition-slow)` (300ms)
- Z-index uses `var(--z-{layer})` tokens

### Dark Mode

This system is dark-mode-only. Do NOT add light mode variants unless explicitly requested.

---

## Color System

### Primary Palette

| Token               | Hex       | Usage                          |
|---------------------|-----------|--------------------------------|
| `--bg-base`         | #000000   | Page background                |
| `--bg-subtle`       | #08080F   | Sidebar, nav backgrounds       |
| `--bg-elevated`     | #0F0F1A   | Cards, surfaces                |
| `--bg-overlay`      | #13131F   | Modals, overlays               |
| `--bg-muted`        | #1A1A2E   | Secondary surfaces             |
| `--violet-500`      | #7C3AED   | Primary CTA, brand             |
| `--violet-400`      | #8B5CF6   | Hover state, links             |
| `--violet-300`      | #A78BFA   | Active state, accents          |
| `--text-primary`    | #F0F0F8   | Body text                      |
| `--text-secondary`  | #9898B3   | Subtext, labels                |
| `--text-tertiary`   | #6B6B8A   | Placeholder, hints             |
| `--border`          | #2C2C4A   | Default borders                |
| `--border-focus`    | #8B5CF6   | Focus rings                    |

### Semantic Colors

- Success: `var(--success)` #10B981
- Warning: `var(--warning)` #F59E0B
- Error:   `var(--error)`   #EF4444
- Info:    `var(--info)`    #06B6D4

---

## Typography

| Class / Token    | Size    | Weight | Use case              |
|------------------|---------|--------|-----------------------|
| `.text-display`  | clamp   | 800    | Hero headlines        |
| `.text-heading-1`| 2.25rem | 700    | Page titles           |
| `.text-heading-2`| 1.875rem| 700    | Section headings      |
| `.text-heading-3`| 1.5rem  | 600    | Card/panel titles     |
| `.text-heading-4`| 1.25rem | 600    | Widget titles         |
| `.text-body-lg`  | 1.125rem| 400    | Lead body text        |
| `.text-body`     | 1rem    | 400    | Body text             |
| `.text-body-sm`  | 0.875rem| 400    | Secondary body        |
| `.text-caption`  | 0.75rem | 400    | Captions, metadata    |
| `.text-overline` | 0.75rem | 600    | Section labels (caps) |

Use `<Text variant="h1" gradient>` for violet gradient text.

---

## Spacing

Based on 4px grid. Use `var(--space-{n})` tokens.

| Token         | Value |
|---------------|-------|
| `--space-1`   | 4px   |
| `--space-2`   | 8px   |
| `--space-3`   | 12px  |
| `--space-4`   | 16px  |
| `--space-6`   | 24px  |
| `--space-8`   | 32px  |
| `--space-12`  | 48px  |
| `--space-16`  | 64px  |

---

## Available Components

### Button
```tsx
<Button variant="primary" size="md" loading={false} iconLeft={<Icon />}>
  Click me
</Button>
```
Variants: `primary` | `secondary` | `ghost` | `danger` | `success`
Sizes: `xs` | `sm` | `md` | `lg` | `xl`

### Input
```tsx
<Input label="Email" hint="We'll never share it" error="Required" iconLeft={<Icon />} />
```

### Badge
```tsx
<Badge variant="brand" dot>New</Badge>
```
Variants: `default` | `brand` | `success` | `warning` | `error` | `info` | `outline`

### Card
```tsx
<Card variant="default" interactive padding="lg">
  <CardHeader>...</CardHeader>
  <CardBody>...</CardBody>
  <CardFooter>...</CardFooter>
</Card>
```

### Text (Typography)
```tsx
<Text variant="h1" gradient>Build something great</Text>
<Text variant="body" color="secondary">Description here</Text>
```

### Avatar / AvatarGroup
```tsx
<Avatar name="John Doe" size="md" status="online" />
<AvatarGroup avatars={list} max={4} />
```

### Switch
```tsx
<Switch checked={val} onChange={setVal} label="Enable notifications" size="md" />
```

### Tabs
```tsx
<Tabs items={tabs} variant="pill" onChange={setTab}>
  <TabPanel id="overview">...</TabPanel>
</Tabs>
```
Variants: `line` | `pill` | `enclosed`

### Spinner
```tsx
<Spinner size="md" variant="ring" />
```
Variants: `ring` | `dots` | `pulse`

### Sidebar / Topbar
```tsx
<Sidebar items={navItems} logo={<Logo />} footer={<UserProfile />} />
<Topbar left={<Logo />} center={<Search />} right={<Actions />} />
```

### Modal
```tsx
<Modal open={isOpen} onClose={close} title="Confirm" size="md" footer={<Actions />}>
  Content
</Modal>
```

### Table
```tsx
const columns: ColumnDef<User>[] = [
  { key: 'name',   header: 'Name',   sortable: true },
  { key: 'email',  header: 'Email',  sortable: true },
  { key: 'status', header: 'Status', renderCell: (val) => <Badge variant="brand">{val}</Badge> },
  { key: 'actions', header: '', sortable: false, searchable: false,
    renderCell: (_, row) => <Button size="xs" variant="ghost">Edit</Button> },
];

<Table
  columns={columns}
  data={rows}
  rowKey="id"
  sortable
  searchable
  searchPlaceholder="Search users…"
  pageSize={10}
  striped
  density="comfortable"
  onRowClick={(row) => console.log(row)}
/>
```
Props: `sortable` | `searchable` | `pageSize` | `striped` | `hoverable` | `density` (comfortable/compact/spacious) | `loading` | `emptyState` | `onRowClick`

`ColumnDef` supports: `renderCell` (custom cell JSX) | `sortFn` (custom comparator) | `sortable` | `searchable` | `width` | `minWidth` | `align`

Controlled sort: pass `sortKey` + `sortDirection` + `onSortChange` to the Table.

---

## Utility Classes (from globals.css)

```css
.gradient-brand        /* violet gradient fill */
.gradient-brand-subtle /* subtle violet tint background */
.gradient-text         /* violet gradient text */
.gradient-surface      /* dark surface gradient */
.surface               /* standard card surface */
.surface-brand         /* violet-tinted surface */
.glow-sm / .glow-md / .glow-lg  /* violet box-shadow glows */
.animate-fade-in / .animate-fade-up / .animate-scale-in
.skeleton              /* loading skeleton */
.container             /* responsive page container */
```

---

## React Native Rules

- Import tokens from `design-system/src/tokens/native.ts`
- Use `nativeColors`, `nativeSpacing`, `nativeTypography`, `nativeRadii`, `nativeShadows`
- All spacing/size values are plain numbers (dp), not strings
- Minimum touch target: 44×44dp (use `hitSlop` export)
- Use `nativeShadows.glowViolet` for violet glow on iOS (shadow props)
- For Android elevation, use `elevation` from shadow objects

---

## Asset Rules

- IMPORTANT: If Figma MCP returns a localhost URL for images/SVGs, use it directly
- IMPORTANT: Do NOT install new icon packages — use SVG inline or from Figma payload
- Store project assets in `assets/` at the project root

---

## Accessibility

- All interactive elements must be reachable via keyboard
- Use `:focus-visible` (already styled via globals.css)
- Provide `aria-label` for icon-only buttons
- Color contrast: text on backgrounds must meet WCAG AA (4.5:1 minimum)
- `--text-primary` (#F0F0F8) on `--bg-base` (#000000) = 19.7:1 (AAA)
- `--violet-300` (#A78BFA) on `--bg-elevated` (#0F0F1A) = 6.8:1 (AA)

---

## Do Not

- NEVER hardcode hex colors
- NEVER use light backgrounds or white surfaces (dark-only system)
- NEVER install Tailwind unless explicitly instructed
- NEVER create one-off utility components — extend existing ones
- NEVER use inline `style={{}}` for colors — always CSS Modules + tokens
