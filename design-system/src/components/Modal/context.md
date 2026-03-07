# Modal — Component AI Context

> Source: `src/components/Modal/Modal.tsx`

---

## 1. Component Overview

### What it does
`Modal` renders a centered dialog overlay using a React portal-style pattern (mounts into DOM when `open` is true, unmounts when false). It uses the native `<dialog>` element internally, traps focus, and closes on `Escape` key or backdrop click. Supports a structured header (title + description), scrollable body, and sticky footer for actions.

### When to use
- Confirmation dialogs ("Delete this item?")
- Forms that require focus isolation (Edit profile, Create project)
- Detail views that should not break the current page context
- Alerts or warnings that require explicit user acknowledgment

### When NOT to use
- **Toast/snack notifications** → use a toast system (not in this design system yet)
- **Inline expandable content** → use `Tabs` or an accordion
- **Dropdown menus** → use a dropdown (not in this design system yet)
- **Complex multi-step flows** → consider a dedicated page instead
- **Non-blocking information** → use `Tooltip` or `Badge`

### Related Components
| Component | Relationship |
|---|---|
| `Button` | Always used in Modal `footer` slot for actions |
| `Card` | Modal panel is styled similarly but is not a Card; do not nest Card as the modal shell |

---

## 2. Props API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `open` | `boolean` | — | **Yes** | Controls visibility — mount/unmount based on this |
| `onClose` | `() => void` | — | **Yes** | Called on Escape, backdrop click, or close button |
| `title` | `string` | `undefined` | No | Heading rendered in the modal header |
| `description` | `string` | `undefined` | No | Subheading below the title |
| `footer` | `React.ReactNode` | `undefined` | No | Action buttons in the sticky bottom bar |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | No | Max width of the modal panel |
| `closeOnBackdrop` | `boolean` | `true` | No | Whether backdrop click triggers `onClose` |
| `children` | `React.ReactNode` | — | **Yes** | Scrollable body content |
| `className` | `string` | `undefined` | No | Extra classes on the modal panel |

### Most Commonly Used
`open`, `onClose`, `title`, `footer`, `children`

### Props That Must Not Be Combined
- `closeOnBackdrop={false}` without a close button in `footer` — user cannot close the modal
- `size="full"` with `title` and `footer` — works but use `lg` or `xl` for content-rich modals; `full` is for media/full-app dialogs

---

## 3. Variants (size)

| Size | Max width | Use case |
|---|---|---|
| `sm` | 400px | Simple confirmations, alerts |
| `md` | 560px | Forms, most dialogs |
| `lg` | 720px | Complex forms, detail views |
| `xl` | 960px | Rich content, multi-column layouts |
| `full` | calc(100vw - 4rem) | Media viewers, full-screen dialogs |

---

## 4. Usage Patterns

### Confirmation dialog
```tsx
<Modal
  open={isOpen}
  onClose={close}
  size="sm"
  title="Delete project"
  description="This action cannot be undone. All data will be permanently removed."
  footer={
    <>
      <Button variant="ghost" onClick={close}>Cancel</Button>
      <Button variant="danger" loading={isDeleting} onClick={handleDelete}>Delete</Button>
    </>
  }
>
  <p className="text-content-secondary text-sm">Confirm you want to delete <strong>{project.name}</strong>.</p>
</Modal>
```

### Form modal
```tsx
<Modal open={isOpen} onClose={close} title="Edit profile" size="md"
  footer={<><Button variant="ghost" onClick={close}>Cancel</Button><Button loading={isSaving} onClick={save}>Save</Button></>}
>
  <div className="flex flex-col gap-4">
    <Input label="Name" value={name} onChange={e => setName(e.target.value)} />
    <Input label="Email" value={email} type="email" />
  </div>
</Modal>
```

### Controlled visibility
```tsx
const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>Open modal</Button>
<Modal open={open} onClose={() => setOpen(false)} title="Details">...</Modal>
```

### Non-closeable on backdrop
```tsx
<Modal open={open} onClose={close} closeOnBackdrop={false} title="Complete setup"
  footer={<Button onClick={handleComplete}>Finish</Button>}
>
  Required setup steps...
</Modal>
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Always pair open with onClose
<Modal open={isOpen} onClose={() => setIsOpen(false)}>...</Modal>

// Put action buttons in footer — not at the bottom of children
<Modal footer={<><Button variant="ghost">Cancel</Button><Button>Confirm</Button></>}>
  Body content
</Modal>

// Use size="sm" for simple confirmations
<Modal size="sm" title="Are you sure?" footer={...}>...</Modal>
```

### ❌ Don'ts
```tsx
// ❌ Don't put action buttons inside children — use footer prop
<Modal open={open} onClose={close}>
  <p>Are you sure?</p>
  <Button onClick={close}>Cancel</Button>  // ❌ wrong slot
</Modal>

// ❌ Don't skip onClose — user can't close the modal
<Modal open={open}>...</Modal>

// ❌ Don't nest Modal inside Card or another Modal
// ❌ Don't use Modal for non-blocking info — use Tooltip or Badge
```

### Common AI Mistakes
1. Placing `Button` actions inside `children` instead of `footer`
2. Missing `onClose` prop — modal becomes uncloseable
3. Using `Modal` for toast/notification messages
4. Forgetting to gate `open` with state — always use a boolean state variable
5. Not providing `title` on destructive actions — users need context before confirming

---

## 6. Accessibility

### ARIA Roles
- Modal panel: `role="dialog"`, `aria-modal="true"`
- `aria-labelledby` points to the title element (id: `modal-title`) when `title` is provided
- `aria-describedby` points to the description element (id: `modal-desc`) when `description` is provided
- Close button: `aria-label="Close modal"`

### Keyboard Interaction
| Key | Behavior |
|---|---|
| `Escape` | Calls `onClose` |
| `Tab` | Cycles through focusable elements inside the modal |
| `Shift+Tab` | Reverse tab cycle |

### Screen Reader Behavior
- Dialog role and label are announced on open
- Focus is set to the modal panel on open (via `showModal()` on the native `<dialog>` element)
- Background content is inert while modal is open

---

## 7. AI Generation Guide

### Decision Tree
```
Non-blocking info?                   → Tooltip / Badge
Confirmation before destructive act? → Modal size="sm" ✅
Form requiring focus isolation?      → Modal size="md" or "lg" ✅
Media viewer?                        → Modal size="full" ✅
Multi-step flow?                     → Consider separate page
```

### Checklist
- [ ] `open` wired to a boolean state variable
- [ ] `onClose` sets that state to `false`
- [ ] Destructive actions: `title` and `description` always provided
- [ ] Action buttons go in `footer`, not `children`
- [ ] `size` matches the content complexity
- [ ] Cancel button always present in `footer` (unless `closeOnBackdrop` is true and close button is visible)

### Output Format
```tsx
const [open, setOpen] = useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Dialog title"
  description="Optional context."
  size="md"
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
    </>
  }
>
  {/* Body content */}
</Modal>
```
