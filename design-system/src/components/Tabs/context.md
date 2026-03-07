# Tabs / TabPanel — Component AI Context

> Source: `src/components/Tabs/Tabs.tsx`
> Exports: `Tabs`, `TabPanel`, `TabItem` (type), `TabsVariant` (type)

---

## 1. Component Overview

### What it does
`Tabs` renders a row of tab buttons that control which `TabPanel` is visible. Uses React Context to share active state between `Tabs` and its `TabPanel` children. Supports controlled and uncontrolled active state, icons, badge counts, disabled tabs, and three visual styles.

### When to use
- Switching between content sections within the same page area
- Segmented views (Overview / Analytics / Settings)
- Filtering data by category when only one category is shown at a time

### When NOT to use
- **Page-level navigation** → use `Sidebar` or `Topbar`
- **Multi-select filtering** → use a checkbox group or `Badge` filter pills
- **Wizard / step flows** → Tabs imply non-linear navigation; use a stepper instead
- **More than 6–7 tabs** → use a dropdown select or sidebar

### Related Components
| Component | Relationship |
|---|---|
| `TabPanel` | Required child — content panels are managed via context |
| `Badge` | Do not use `<Badge>` in tab `label` — use `TabItem.badge` slot |
| `Sidebar` | Page-level nav alternative |

---

## 2. Props API

### Tabs Props
| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `items` | `TabItem[]` | — | **Yes** | Tab definitions array |
| `variant` | `'line' \| 'pill' \| 'enclosed'` | `'line'` | No | Visual style of the tab bar |
| `defaultTab` | `string` | `items[0].id` | No | Initial active tab id (uncontrolled) |
| `active` | `string` | `undefined` | No | Controlled active tab id |
| `onChange` | `(id: string) => void` | `undefined` | No | Fired when active tab changes |
| `children` | `React.ReactNode` | `undefined` | No | `TabPanel` components |
| `className` | `string` | `undefined` | No | Extra classes on the root wrapper |

### TabItem Shape
```ts
interface TabItem {
  id: string;              // unique — used to match TabPanel id
  label: React.ReactNode;  // visible tab label
  icon?: React.ReactNode;  // icon before the label
  badge?: React.ReactNode; // count/status after the label
  disabled?: boolean;      // prevents selection
}
```

### TabPanel Props
| Prop | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | **Yes** | Must match a `TabItem.id` in the parent `Tabs` |
| `children` | `React.ReactNode` | **Yes** | Content shown when this tab is active |

### Most Commonly Used (Tabs)
`items`, `variant`, `onChange`, `children`

### Props That Must Not Be Combined
- `active` without `onChange` → controlled with no update path
- `defaultTab` + `active` → use one mode only
- `TabPanel` outside a `Tabs` context → reads from context; will never render

---

## 3. Variants

| Variant | Tab bar background | Active tab style | Use case |
|---|---|---|---|
| `line` | None — bottom border only | `border-b-violet-500` underline | Default; clean, minimal |
| `pill` | `bg-surface-muted` with border | `bg-violet-500/15` filled pill | Segmented controls, settings pages |
| `enclosed` | `bg-surface-elevated` with border | `bg-surface-overlay` raised card | Tabbed panels that look like folders |

---

## 4. Usage Patterns

### Uncontrolled (most common)
```tsx
<Tabs
  items={[
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'settings', label: 'Settings' },
  ]}
  variant="line"
>
  <TabPanel id="overview"><OverviewContent /></TabPanel>
  <TabPanel id="activity"><ActivityContent /></TabPanel>
  <TabPanel id="settings"><SettingsContent /></TabPanel>
</Tabs>
```

### Controlled
```tsx
<Tabs items={tabs} active={activeTab} onChange={setActiveTab} variant="pill">
  <TabPanel id="members"><MemberList /></TabPanel>
  <TabPanel id="billing"><BillingInfo /></TabPanel>
</Tabs>
```

### With icons and badges
```tsx
const tabs: TabItem[] = [
  { id: 'inbox',    label: 'Inbox',    icon: <InboxIcon />,    badge: 12 },
  { id: 'sent',     label: 'Sent',     icon: <SendIcon /> },
  { id: 'archived', label: 'Archived', icon: <ArchiveIcon />,  disabled: true },
];
<Tabs items={tabs} variant="enclosed">{...}</Tabs>
```

### Tabs without panels (external content control)
```tsx
<Tabs items={tabs} active={view} onChange={setView} variant="pill" />
{view === 'grid' && <GridView />}
{view === 'list' && <ListView />}
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Match TabPanel id to TabItem id exactly
const tabs = [{ id: 'settings', label: 'Settings' }];
<Tabs items={tabs}><TabPanel id="settings">...</TabPanel></Tabs>

// Use badge slot for counts — not a <Badge> inside label
{ id: 'inbox', label: 'Inbox', badge: 5 }

// Use enclosed or pill variant on surfaces with a background
<Card><Tabs variant="enclosed" items={tabs}>...</Tabs></Card>
```

### ❌ Don'ts
```tsx
// ❌ Don't use <TabPanel> outside <Tabs> — it reads from context
<TabPanel id="x">Content</TabPanel>  // never renders

// ❌ Don't put <Badge> in label prop
{ id: 'inbox', label: <span>Inbox <Badge>5</Badge></span> }
// → Use badge prop: { id: 'inbox', label: 'Inbox', badge: 5 }

// ❌ Don't use Tabs for page-level navigation
<Tabs items={[{id:'home', label:'Home'}, {id:'about', label:'About'}]} />
// → Use Sidebar or Topbar instead
```

### Common AI Mistakes
1. Mismatching `TabPanel id` with `TabItem id` — panel never renders
2. Putting `<Badge>` inside tab `label` instead of using the `badge` prop
3. Using `active` without `onChange` — controlled but frozen
4. Not wrapping content in `<TabPanel>` — content always shows regardless of active tab

---

## 6. Accessibility

### ARIA Roles
- Tab bar: `role="tablist"`
- Each tab button: `role="tab"`, `aria-selected`, `aria-disabled`
- Each panel: `role="tabpanel"`

### Keyboard Interaction
| Key | Behavior |
|---|---|
| `Tab` | Moves focus into/out of the tab list |
| `Enter` / `Space` | Activates the focused tab |
| Arrow keys | Not implemented — use Tab to move between tabs |

### Screen Reader Behavior
- Active tab announced as *"[Label], tab, selected"*
- Disabled tabs announced as *"[Label], tab, dimmed"*
- Panel is announced when content changes

---

## 7. AI Generation Guide

### Decision Tree
```
Page-level navigation?                  → Sidebar or Topbar
Switching content sections inline?      → Tabs ✅
  Need counts on tabs?                  → Use TabItem.badge
  Need icons on tabs?                   → Use TabItem.icon
  On a dark card surface?               → variant="enclosed"
  Segmented control style?              → variant="pill"
  Clean minimal style?                  → variant="line"
```

### Checklist
- [ ] Every `TabItem.id` has a matching `<TabPanel id={...}>`
- [ ] Controlled mode: both `active` and `onChange` present
- [ ] Counts use `badge` prop on TabItem — not `<Badge>` in `label`
- [ ] `variant` matches the surrounding surface context

### Output Format
```tsx
const tabs: TabItem[] = [
  { id: 'tab1', label: 'Label 1' },
  { id: 'tab2', label: 'Label 2', badge: 3 },
];

<Tabs items={tabs} variant="line" onChange={setActive}>
  <TabPanel id="tab1">Content 1</TabPanel>
  <TabPanel id="tab2">Content 2</TabPanel>
</Tabs>
```
