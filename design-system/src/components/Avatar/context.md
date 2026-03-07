# Avatar / AvatarGroup — Component AI Context

> Source: `src/components/Avatar/Avatar.tsx`
> Exports: `Avatar`, `AvatarGroup`

---

## 1. Component Overview

### What it does
`Avatar` renders a circular user representation in three modes: an image (`src`), initials generated from `name` with a deterministic violet-hued background, or a generic fallback icon. Supports a presence `status` dot indicator. `AvatarGroup` stacks multiple avatars with overlap and shows a `+N` overflow count.

### When to use
- User profile pictures throughout the app (nav, comments, tables, cards)
- Team member lists with `AvatarGroup`
- Presence indicators (online, busy, away)

### When NOT to use
- **Company logos or brand icons** → use a plain `<img>` with `rounded-lg`
- **Large hero images** → use a styled `<img>` directly
- **Icon-only indicators without user context** → use an icon with a `Badge`

### Related Components
| Component | Relationship |
|---|---|
| `Badge` | Peer status indicator — Avatar uses a dot, Badge uses text |
| `Topbar` | Avatar commonly placed in the `right` slot |
| `Sidebar` | Avatar used in the `footer` slot for user profile |
| `Table` | Avatar used in `renderCell` for user columns |

---

## 2. Props API

### Avatar Props
| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `src` | `string` | `undefined` | No | Image URL — renders `<img>` when provided |
| `alt` | `string` | `undefined` | No | Alt text for the image; falls back to `name` |
| `name` | `string` | `undefined` | No | Full name for initials and background color generation |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'` | No | Diameter of the avatar circle |
| `status` | `'online' \| 'offline' \| 'busy' \| 'away'` | `undefined` | No | Presence dot overlaid on the bottom-right of the avatar |
| `className` | `string` | `undefined` | No | Extra classes merged via `cn()` |

### AvatarGroup Props
| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `avatars` | `AvatarProps[]` | — | **Yes** | Array of Avatar prop objects |
| `max` | `number` | `4` | No | Max visible avatars before `+N` overflow count |
| `size` | `AvatarSize` | `'md'` | No | Size applied to all avatars in the group |

### Most Commonly Used (Avatar)
`name`, `size`, `status`, `src`

### Priority Rules
- `src` takes priority over `name` — if both are set, image is shown
- `name` takes priority over fallback icon — if name is provided, initials are shown
- No `src` and no `name` → generic user icon fallback

---

## 3. Variants

Avatar has no `variant` prop. Visual modes are determined by which props are provided:

| Mode | Trigger | Visual |
|---|---|---|
| Image | `src` is set | `<img>` fills circle |
| Initials | `name` set, no `src` | 1–2 letter initials, violet-family background |
| Fallback | Neither `src` nor `name` | Generic user SVG icon |

### Status Dot Colors
| Status | Color class |
|---|---|
| `online` | `bg-success` (green) |
| `offline` | `bg-neutral-500` (gray) |
| `busy` | `bg-error` (red) |
| `away` | `bg-warning` (amber) |

### Size Classes
| Size | Dimensions |
|---|---|
| `xs` | `w-6 h-6` |
| `sm` | `w-8 h-8` |
| `md` | `w-10 h-10` |
| `lg` | `w-12 h-12` |
| `xl` | `w-16 h-16` |
| `2xl` | `w-20 h-20` |

---

## 4. Usage Patterns

### Basic with name
```tsx
<Avatar name="Jane Doe" size="md" />
```

### With image and status
```tsx
<Avatar src="/avatars/john.jpg" alt="John" size="lg" status="online" />
```

### In a table cell
```tsx
renderCell: (_, row) => (
  <div className="flex items-center gap-2">
    <Avatar name={row.name} size="sm" />
    <span className="text-content-primary text-sm">{row.name}</span>
  </div>
)
```

### AvatarGroup
```tsx
<AvatarGroup
  avatars={[{ name: 'Alice' }, { name: 'Bob' }, { src: '/carol.jpg' }]}
  max={3}
  size="sm"
/>
```

### In Topbar right slot
```tsx
<Topbar right={
  <Avatar name={user.name} src={user.avatarUrl} size="sm" status="online" />
} />
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Provide name even when src is set — used as alt text fallback
<Avatar src={user.avatarUrl} name={user.name} size="md" />

// Match size to surrounding content density
<Avatar name="JS" size="sm" />  // inside table rows
<Avatar name="JS" size="xl" />  // profile page header

// Use AvatarGroup for team lists — not a manual row of Avatars
<AvatarGroup avatars={team} max={5} />
```

### ❌ Don'ts
```tsx
// ❌ Don't manually stack Avatars with negative margin — use AvatarGroup
<div className="flex -space-x-2">
  <Avatar name="A" />
  <Avatar name="B" />
</div>

// ❌ Don't use Avatar for non-user images
<Avatar src="/company-logo.png" />  // use <img> instead

// ❌ Don't set both src and name expecting initials as fallback on error
// Avatar has no onError handling — provide a valid src or omit it
```

### Common AI Mistakes
1. Manually implementing avatar stacking instead of using `AvatarGroup`
2. Passing `name` as `alt` separately when `name` already becomes the alt text
3. Using `Avatar` for brand logos or product images
4. Forgetting `status` prop is visual only — does not update automatically

---

## 6. Accessibility

### ARIA Attributes
- Image avatars: `alt` is set to `alt ?? name ?? 'avatar'`
- Initials span: `aria-label={name}` is set for screen readers
- Status dot: `aria-label={status}` on the dot element

### Screen Reader Behavior
- Screen reader reads the name or alt text
- Status is announced via `aria-label` on the dot
- Fallback icon is `aria-hidden="true"` — decorative

---

## 7. AI Generation Guide

### Decision Tree
```
User has profile image?           → Avatar with src + name
User has name only?               → Avatar with name (initials auto-generated)
Unknown/anonymous user?           → Avatar with no props (fallback icon)
Multiple users in a list?         → AvatarGroup with avatars array
Showing presence status?          → Add status prop
```

### Checklist
- [ ] `name` provided alongside `src` (fallback alt text)
- [ ] `size` matches surrounding UI density
- [ ] For multiple avatars: use `AvatarGroup`, not manual mapping
- [ ] `status` only used when real-time presence is available

### Output Format
```tsx
<Avatar name="Jane Doe" size="md" status="online" />
<Avatar src="/path/to/img.jpg" name="John" size="lg" />
<AvatarGroup avatars={users.map(u => ({ name: u.name, src: u.avatar }))} max={4} size="sm" />
```
