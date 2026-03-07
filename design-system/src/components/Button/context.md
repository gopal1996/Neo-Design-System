# Button — Component AI Context

> Machine-readable context for Claude, Copilot, and Cursor.
> Source: `src/components/Button/Button.tsx`

---

## 1. Component Overview

### What it does
`Button` is the primary interactive trigger for user actions. It renders a `<button>` element with a violet-brand gradient (primary), muted surface variants, or semantic danger/success styles. It supports left/right icon slots and a loading state that shows an inline spinner.

### When to use
- Triggering form submissions, mutations, or navigation actions
- Any user-initiated action that requires a button element
- When you need loading feedback on async operations

### When NOT to use
- **Navigation between pages** → use an `<a>` tag or Next.js `<Link>` styled with `variant="ghost"`
- **Icon-only actions** → wrap a single icon in `Button` and provide `aria-label`; do not omit the label without it
- **Inline text actions** → use a plain `<a>` or `<button>` with `text-violet-400` styling
- **Toggle states (on/off)** → use `Switch` instead

### Related Components
| Component | Relationship |
|---|---|
| `Spinner` | Button renders its own inline spinner when `loading={true}` — do not nest `<Spinner>` inside Button |
| `Modal` | Button is always used in Modal `footer` slots |
| `EmptyState` | Button is used in `action` and `secondaryAction` slots |

---

## 2. Props API

### Full Props Table

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'success'` | `'primary'` | No | Visual style |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | No | Height and font size |
| `loading` | `boolean` | `false` | No | Shows inline spinner; disables interaction |
| `iconLeft` | `React.ReactNode` | `undefined` | No | Icon before the label (hidden when loading) |
| `iconRight` | `React.ReactNode` | `undefined` | No | Icon after the label |
| `fullWidth` | `boolean` | `false` | No | Stretches to fill container width |
| `disabled` | `boolean` | `false` | No | Disables the button natively |
| `children` | `React.ReactNode` | `undefined` | No | Button label — omit only if `aria-label` is set |
| `onClick` | `React.MouseEventHandler<HTMLButtonElement>` | `undefined` | No | Click handler |
| `className` | `string` | `undefined` | No | Extra Tailwind classes merged via `cn()` |
| `...rest` | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | No | All native button attributes are forwarded |

> Button extends `React.ButtonHTMLAttributes<HTMLButtonElement>`, so `type`, `aria-*`, `form`, `name`, and `value` are all valid.

### Most Commonly Used Props
`variant`, `size`, `loading`, `iconLeft`, `onClick`, `children`

### Props That Must Not Be Combined
- `loading={true}` + `iconLeft` → `iconLeft` is automatically hidden during loading; do not pass both and expect both to show
- `disabled={true}` + `loading={true}` → redundant; `loading` already sets `disabled` internally
- `fullWidth` + explicit `w-*` in `className` → will conflict; choose one

---

## 3. Variants

### `primary` (default)
- **Visual:** Violet gradient background, white text, violet border
- **Classes:** `bg-btn-primary border-violet-500 text-white hover:bg-btn-primary-hover hover:border-violet-400`
- **Use when:** Primary CTA — "Save", "Submit", "Create", "Confirm"
- **Rule:** Only one `primary` button should be visible per view section

### `secondary`
- **Visual:** Transparent violet tint background, violet-300 text, brand border
- **Classes:** `bg-violet-500/[.08] border-stroke-brand text-violet-300 hover:bg-violet-500/[.14]`
- **Use when:** Secondary action alongside a primary — "Preview", "Export", "Duplicate"

### `ghost`
- **Visual:** Fully transparent, secondary text, no border — surface appears on hover
- **Classes:** `bg-transparent border-transparent text-content-secondary hover:bg-neutral-800 hover:text-content-primary`
- **Use when:** Tertiary actions, cancel buttons, icon-adjacent controls, nav items

### `danger`
- **Visual:** Red-tinted background, red-light text, red border
- **Classes:** `bg-error/10 border-error/40 text-error-light hover:bg-error/[.18]`
- **Use when:** Destructive actions — "Delete", "Remove", "Revoke"
- **Rule:** Always confirm before triggering the handler; typically paired with a `ghost` cancel button

### `success`
- **Visual:** Green-tinted background, green-light text, green border
- **Classes:** `bg-success/10 border-success/40 text-success-light hover:bg-success/[.18]`
- **Use when:** Positive confirmations — "Approve", "Publish", "Mark complete"

---

## 4. Usage Patterns

### Most Common — Labeled CTA
```tsx
<Button variant="primary" onClick={handleSave}>Save changes</Button>
```

### With Loading State (async action)
```tsx
<Button variant="primary" loading={isSaving} onClick={handleSave}>
  Save changes
</Button>
```
> When `loading` is `true`: spinner replaces `iconLeft`, label remains visible, button is disabled.

### With Icon
```tsx
<Button variant="secondary" iconLeft={<DownloadIcon />}>Export CSV</Button>
<Button variant="ghost" iconRight={<ArrowRightIcon />}>View all</Button>
```

### Icon-Only (no label)
```tsx
<Button variant="ghost" aria-label="Close panel">
  <XIcon />
</Button>
```
> When children is a single icon and no text label, `aria-label` is **mandatory**.

### Advanced — Full Width + Size
```tsx
<Button variant="primary" size="lg" fullWidth loading={isSubmitting}>
  Create account
</Button>
```

### Composition — Inside Modal Footer
```tsx
<Modal
  open={open}
  onClose={close}
  title="Delete workspace"
  footer={
    <>
      <Button variant="ghost" onClick={close}>Cancel</Button>
      <Button variant="danger" loading={isDeleting} onClick={handleDelete}>Delete</Button>
    </>
  }
>
  This action cannot be undone.
</Modal>
```

### Composition — Inside EmptyState
```tsx
<EmptyState
  icon={EmptyStateIcons.folder}
  title="No projects yet"
  action={<Button variant="primary">Create project</Button>}
  secondaryAction={<Button variant="ghost">Import</Button>}
/>
```

---

## 5. Do's and Don'ts

### ✅ Do's

**Use semantic variants — primary for the dominant action:**
```tsx
// One primary, one ghost per action group
<Button variant="primary">Confirm</Button>
<Button variant="ghost">Cancel</Button>
```

**Always provide `aria-label` for icon-only buttons:**
```tsx
<Button variant="ghost" aria-label="Copy link">
  <CopyIcon />
</Button>
```

**Use `loading` for async operations — never disable manually:**
```tsx
<Button variant="primary" loading={isPending} onClick={submit}>
  Submit
</Button>
```

**Use `size="xs"` or `size="sm"` inside dense UI (tables, toolbars):**
```tsx
<Button size="xs" variant="ghost">Edit</Button>
```

---

### ❌ Don'ts

**Never hardcode colors or override variant colors:**
```tsx
// ❌ Wrong — breaks dark-mode tokens
<Button className="bg-purple-600 text-white">Save</Button>

// ✅ Correct
<Button variant="primary">Save</Button>
```

**Never nest a Spinner inside Button:**
```tsx
// ❌ Wrong — Button manages its own loading UI
<Button><Spinner size="xs" /> Saving…</Button>

// ✅ Correct
<Button loading={isSaving}>Saving…</Button>
```

**Never use Button for page navigation without href semantics:**
```tsx
// ❌ Wrong — misleads screen readers and breaks keyboard context
<Button onClick={() => router.push('/home')}>Go home</Button>

// ✅ Correct — use an anchor element
<a href="/home" className="...">Go home</a>
```

**Never omit children and aria-label together:**
```tsx
// ❌ Wrong — invisible to screen readers
<Button variant="ghost"><TrashIcon /></Button>

// ✅ Correct
<Button variant="ghost" aria-label="Delete item"><TrashIcon /></Button>
```

### Common AI Mistakes with Button
1. **Adding `disabled` instead of `loading`** for async states — always prefer `loading`
2. **Using `variant="primary"` for cancel/close actions** — use `ghost` for dismissal
3. **Wrapping Button in another button or anchor** — Button already renders `<button>`; never nest it
4. **Setting `className="w-full"` instead of `fullWidth`** — use the prop
5. **Forgetting `aria-label` on icon-only buttons** — required for accessibility compliance

---

## 6. Accessibility

### ARIA Roles and Attributes
- Renders as `<button>` — inherits native `button` role automatically
- `disabled` attribute is set natively when `disabled` or `loading` is true
- `aria-label` must be provided when there is no visible text label (icon-only)
- `type="button"` should be explicitly set inside `<form>` elements to prevent accidental form submission

### Keyboard Interaction
| Key | Behavior |
|---|---|
| `Tab` | Moves focus to / away from the button |
| `Enter` | Triggers `onClick` |
| `Space` | Triggers `onClick` |
| (when disabled) | Button is removed from tab order, no events fire |

### Focus Styles
- Focus ring is rendered via `:focus-visible` only (not `:focus`) — does not show on mouse click
- All variants apply `focus-visible:shadow-focus-ring` (`0 0 0 3px rgba(139,92,246,0.35)`)
- `danger` and `success` variants use semantic-colored focus rings

### Screen Reader Behavior
- When `loading={true}`: the spinner `<span>` is `aria-hidden="true"` — screen readers see only the button label
- The label (`children`) is always rendered in the DOM regardless of loading state, ensuring the accessible name is stable
- The `disabled` state is communicated natively by the browser

---

## 7. AI Generation Guide

### Step-by-Step Instructions

**Step 1 — Determine the correct variant**
```
Is this the primary/dominant action?          → variant="primary"
Is this a secondary/supporting action?        → variant="secondary"
Is this a cancel, dismiss, or low-emphasis?   → variant="ghost"
Is this a destructive action?                 → variant="danger"
Is this a positive confirmation?              → variant="success"
```

**Step 2 — Determine the correct size**
```
Inside a table cell, toolbar, or tight UI?    → size="xs" or size="sm"
Standard form or modal action?                → size="md" (default)
Prominent CTA, hero section, auth form?       → size="lg" or size="xl"
```

**Step 3 — Check loading requirement**
If the button triggers an async operation (API call, form submit, mutation), add `loading={booleanState}`.

**Step 4 — Check icon requirement**
If an icon is needed: use `iconLeft` or `iconRight` props — do not put icons in `children`.
If there is no text label: add `aria-label`.

**Step 5 — Check token usage**
Never add `className` with color overrides. Only add `className` for layout/spacing adjustments (e.g. `mt-4`, `w-full` — though prefer `fullWidth` prop for full width).

### Token Validation Checklist Before Generating
- [ ] `variant` matches one of: `primary | secondary | ghost | danger | success`
- [ ] `size` matches one of: `xs | sm | md | lg | xl`
- [ ] No hardcoded hex or Tailwind color classes in `className`
- [ ] `aria-label` present if no `children` text
- [ ] `loading` used for async states (not `disabled`)
- [ ] Not nested inside `<a>` or another `<button>`

### Expected Output Format (TSX)
```tsx
import { Button } from '@/design-system';

// Minimal
<Button variant="primary">Label</Button>

// With async state
<Button variant="primary" loading={isPending} onClick={handleAction}>
  Label
</Button>

// With icon
<Button variant="secondary" iconLeft={<Icon />} size="sm">
  Label
</Button>

// Icon only — aria-label required
<Button variant="ghost" size="sm" aria-label="Description">
  <Icon />
</Button>
```

### Prop Defaults (do not repeat these in output unless overriding)
```
variant  → "primary"   (always specify for clarity)
size     → "md"        (omit if md)
loading  → false       (omit if false)
fullWidth→ false       (omit if false)
disabled → false       (omit if false)
```
