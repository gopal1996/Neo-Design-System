# Sidebar / Topbar — Component AI Context

> Source: `src/components/Navigation/Navigation.tsx`
> Exports: `Sidebar`, `Topbar`, `NavItem` (type), `SidebarProps`, `TopbarProps`

---

## 1. Component Overview

### Sidebar
Vertical navigation panel rendered as a `<nav>` element. Items are rendered as links (`<a>`) when `href` is provided or as `<button>` otherwise. Supports nested child items, icon slots, badge counts, active state, disabled state, collapsible mode (icon-only), and a footer slot.

### Topbar
Sticky horizontal header bar with three flex zones: `left`, `center`, `right`. Used as the page-level navigation header, typically at the top of a dashboard layout.

### When to use
- **Sidebar:** App-level page navigation in dashboard/SaaS layouts
- **Topbar:** Global header with logo, search, and user actions

### When NOT to use
- **Sidebar:** For within-page section navigation → use `Tabs`
- **Topbar:** For secondary toolbar actions → use a `<div>` toolbar with `Button` components
- **Sidebar:** For mobile-first navigation → Sidebar is desktop-oriented

### Related Components
| Component | Relationship |
|---|---|
| `Tabs` | Within-page navigation alternative |
| `Avatar` | Commonly placed in Sidebar `footer` and Topbar `right` |
| `Button` | Used in Topbar `right` for actions |

---

## 2. Props API

### Sidebar Props
| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `items` | `NavItem[]` | — | **Yes** | Navigation item definitions |
| `logo` | `React.ReactNode` | `undefined` | No | Logo/wordmark in the top section |
| `footer` | `React.ReactNode` | `undefined` | No | Content in the bottom section (user profile, settings) |
| `collapsed` | `boolean` | `false` | No | Collapses to 64px wide icon-only mode |
| `onItemClick` | `(item: NavItem) => void` | `undefined` | No | Click handler for nav items |
| `className` | `string` | `undefined` | No | Extra classes |

### NavItem Shape
```ts
interface NavItem {
  id: string;
  label: string;
  href?: string;        // renders as <a> when set
  icon?: React.ReactNode;
  badge?: string | number;  // count displayed on the right
  active?: boolean;    // marks item as currently selected
  disabled?: boolean;
  children?: NavItem[]; // nested sub-items (one level deep)
}
```

### Topbar Props
| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `left` | `React.ReactNode` | `undefined` | No | Left zone (logo, breadcrumbs) |
| `center` | `React.ReactNode` | `undefined` | No | Center zone (search bar) |
| `right` | `React.ReactNode` | `undefined` | No | Right zone (actions, avatar) |
| `className` | `string` | `undefined` | No | Extra classes |

### Most Commonly Used
**Sidebar:** `items`, `logo`, `footer`, `onItemClick`
**Topbar:** `left`, `right`

### Props That Must Not Be Combined
- Sidebar `collapsed={true}` without `icon` on nav items — items will show nothing in collapsed mode
- Topbar `center` with very long content — center zone competes with left/right for space

---

## 3. Variants

### Sidebar States
| State | Visual |
|---|---|
| Expanded | `w-60` (240px), full label text visible |
| Collapsed | `w-16` (64px), icon only, label hidden, `title` tooltip on hover |

### NavItem States
| State | Classes |
|---|---|
| Default | `text-content-tertiary hover:bg-neutral-800 hover:text-content-secondary` |
| Active | `bg-violet-500/12 border-violet-600/30 text-violet-300` |
| Disabled | `opacity-40 cursor-not-allowed` |

---

## 4. Usage Patterns

### Basic Sidebar
```tsx
const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/', icon: <DashIcon />, active: true },
  { id: 'projects',  label: 'Projects',  href: '/projects', icon: <FolderIcon />, badge: 3 },
  { id: 'settings',  label: 'Settings',  href: '/settings', icon: <GearIcon /> },
];

<Sidebar
  items={navItems}
  logo={<Logo />}
  footer={<Avatar name={user.name} size="sm" status="online" />}
  onItemClick={item => router.push(item.href!)}
/>
```

### Collapsible Sidebar
```tsx
const [collapsed, setCollapsed] = useState(false);
<Sidebar items={navItems} collapsed={collapsed} logo={<Logo />} />
```

### Nested items
```tsx
const navItems: NavItem[] = [
  {
    id: 'analytics', label: 'Analytics', icon: <ChartIcon />,
    children: [
      { id: 'overview',  label: 'Overview',  href: '/analytics' },
      { id: 'reports',   label: 'Reports',   href: '/analytics/reports' },
    ],
  },
];
```

### Topbar
```tsx
<Topbar
  left={<Logo />}
  center={<Input placeholder="Search…" iconLeft={<SearchIcon />} className="w-[320px]" />}
  right={
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm">Docs</Button>
      <Avatar name={user.name} size="sm" />
    </div>
  }
/>
```

### Combined layout
```tsx
<div className="flex h-screen">
  <Sidebar items={navItems} logo={<Logo />} />
  <div className="flex-1 flex flex-col overflow-hidden">
    <Topbar left={<Breadcrumbs />} right={<UserMenu />} />
    <main className="flex-1 overflow-y-auto p-6">{children}</main>
  </div>
</div>
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Set active on the current route's NavItem
{ id: 'dashboard', label: 'Dashboard', active: pathname === '/' }

// Provide icon on all items for collapsed mode to work
{ id: 'settings', label: 'Settings', icon: <GearIcon />, href: '/settings' }

// Use href for navigation items so they render as <a>
{ id: 'projects', label: 'Projects', href: '/projects', icon: <FolderIcon /> }
```

### ❌ Don'ts
```tsx
// ❌ Don't use Sidebar for within-page section switching — use Tabs
<Sidebar items={[{ id: 'overview' }, { id: 'settings' }]} />

// ❌ Don't omit icon when using collapsed mode
{ id: 'users', label: 'Users' }  // collapsed shows nothing

// ❌ Don't manage active state with CSS — use the active prop on NavItem
<a href="/" className="text-violet-300">Dashboard</a>  // outside the system
```

### Common AI Mistakes
1. Using Sidebar for within-page navigation — use `Tabs`
2. Omitting `icon` on NavItems when `collapsed` mode is used
3. Not setting `active` on the current route item
4. Using `Button` instead of `href` on NavItem for navigation links — use `href` for `<a>` semantics
5. Nesting Topbar inside the Sidebar — they are siblings in the layout

---

## 6. Accessibility

### Sidebar
- Renders as `<nav aria-label="Main navigation">`
- Items with `href` render as `<a>` — proper link semantics
- Items without `href` render as `<button>` — proper button semantics
- Active item: no `aria-current` set — add via `NavItem` if needed for screen readers

### Topbar
- Renders as `<header>` — page landmark
- `z-[200]` ensures it stays above content
- `backdrop-blur-md` for visual depth

### Keyboard Interaction
| Key | Behavior |
|---|---|
| `Tab` | Cycles through all nav items and slots |
| `Enter` | Activates link/button |
| `Space` | Activates button-type nav items |

---

## 7. AI Generation Guide

### Decision Tree
```
App-level page navigation?            → Sidebar ✅
Global header (logo + search + user)? → Topbar ✅
Within-page sections?                 → Tabs
Mobile navigation?                    → Custom (Sidebar is desktop-only)
```

### Sidebar Checklist
- [ ] Each item has a unique `id`
- [ ] Items with navigation have `href`
- [ ] Items without `href` have `onItemClick` handling on `Sidebar`
- [ ] Active item marked with `active: true` (match to current route)
- [ ] Icons provided when `collapsed` mode is used

### Topbar Checklist
- [ ] Renders as `<header>` sibling to main content (not inside Sidebar)
- [ ] Logo in `left`, user actions in `right`
- [ ] Search bar in `center` if applicable

### Output Format
```tsx
// Sidebar
<Sidebar
  items={[
    { id: 'home', label: 'Home', href: '/', icon: <HomeIcon />, active: true },
    { id: 'users', label: 'Users', href: '/users', icon: <UsersIcon />, badge: 12 },
  ]}
  logo={<Logo />}
  footer={<Avatar name="Jane Doe" size="sm" />}
/>

// Topbar
<Topbar
  left={<Logo />}
  right={<Avatar name="Jane Doe" size="sm" />}
/>
```
