# Input — Component AI Context

> Source: `src/components/Input/Input.tsx`

---

## 1. Component Overview

### What it does
`Input` is a styled text field that wraps a native `<input>` with a label, hint, error message, icon slots, and text addons. Uses `React.forwardRef` so consumers can attach refs directly to the underlying `<input>`.

### When to use
- Any text-entry field in a form (email, password, search, URL, name, etc.)
- When you need a label + error + hint in a single controlled unit

### When NOT to use
- **Multiline text** → use a `<textarea>` styled separately
- **Date selection** → use `DatePicker`
- **Boolean toggle** → use `Switch` or `Checkbox`
- **Option selection** → use `RadioGroup` or a `<select>`

### Related Components
| Component | Relationship |
|---|---|
| `DatePicker` | Uses Input-like trigger internally — do not nest Input inside DatePicker |
| `Checkbox` / `Radio` | Peer form elements — share label/error/hint patterns |
| `Button` | Commonly placed beside Input for search or inline submit |

---

## 2. Props API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | `undefined` | No | Label rendered above the input with `htmlFor` wired automatically |
| `hint` | `string` | `undefined` | No | Helper text below; hidden when `error` is present |
| `error` | `string` | `undefined` | No | Error message below; replaces hint and applies error border color |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Controls height and font size |
| `iconLeft` | `React.ReactNode` | `undefined` | No | Icon inside left edge of the field (non-interactive) |
| `iconRight` | `React.ReactNode` | `undefined` | No | Icon inside right edge of the field (non-interactive) |
| `addonLeft` | `string` | `undefined` | No | Static text prefix attached to the left border (e.g. `https://`) |
| `addonRight` | `string` | `undefined` | No | Static text suffix attached to the right border |
| `fullWidth` | `boolean` | `false` | No | Stretches the wrapper to fill container |
| `disabled` | `boolean` | `false` | No | Disables input and reduces opacity |
| `placeholder` | `string` | `undefined` | No | Native placeholder text |
| `...rest` | `React.InputHTMLAttributes<HTMLInputElement>` | — | No | All native input attributes forwarded (type, value, onChange, etc.) |

### Most Commonly Used
`label`, `placeholder`, `value`, `onChange`, `error`, `hint`

### Props That Must Not Be Combined
- `addonLeft` + `iconLeft` → left side conflict; use one or the other
- `addonRight` + `iconRight` → right side conflict; use one or the other
- `error` + `hint` → error wins; hint is hidden when error is set

---

## 3. Variants

Input has no `variant` prop. State is communicated through props:

| State | Visual change | Trigger |
|---|---|---|
| Default | `border-stroke`, violet focus ring | No props |
| Error | `border-error`, red focus ring, error text below | `error="..."` |
| Disabled | 50% opacity, `cursor-not-allowed` | `disabled={true}` |
| With addon | Fused text prefix/suffix, rounded corners adjust | `addonLeft` / `addonRight` |
| With icon | Left/right padding auto-adjusted for icon | `iconLeft` / `iconRight` |

### Size Classes
| Size | Height | Font |
|---|---|---|
| `sm` | `h-8` | `text-[0.8125rem]` |
| `md` | `h-10` | `text-sm` |
| `lg` | `h-12` | `text-base` |

---

## 4. Usage Patterns

### Basic labeled field
```tsx
<Input label="Email" placeholder="you@example.com" hint="We'll never share it." />
```

### Controlled with error
```tsx
<Input
  label="Password"
  type="password"
  value={password}
  onChange={e => setPassword(e.target.value)}
  error={errors.password}
/>
```

### With icon
```tsx
<Input label="Search" iconLeft={<SearchIcon />} placeholder="Search users…" />
```

### With addon (URL field)
```tsx
<Input label="Website" addonLeft="https://" placeholder="example.com" />
```

### Ref forwarding
```tsx
const ref = useRef<HTMLInputElement>(null);
<Input ref={ref} label="Name" />
```

### Inside a form
```tsx
<form onSubmit={handleSubmit}>
  <Input label="Email" name="email" type="email" required />
  <Button type="submit">Continue</Button>
</form>
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Always wire label — never use a floating placeholder as a label substitute
<Input label="Full name" placeholder="Jane Doe" />

// Use error prop for validation — not custom elements below the input
<Input label="Email" error="Invalid email address" value={email} />

// Use fullWidth in form layouts
<Input label="Username" fullWidth />
```

### ❌ Don'ts
```tsx
// ❌ Never style the border color manually — use error prop
<Input className="border-red-500" />

// ❌ Never put an interactive element (button) in iconLeft/iconRight
// Those slots are pointer-events-none — use addonRight for interactive suffixes
<Input iconRight={<button>Send</button>} />

// ❌ Never skip label for accessibility — use aria-label if labelless
<Input placeholder="Search…" />   // ❌ no label
<Input aria-label="Search" placeholder="Search…" />  // ✅
```

### Common AI Mistakes
1. Adding both `addonLeft` and `iconLeft` — left slot conflict
2. Using `className` to override border colors instead of `error` prop
3. Forgetting to pass `type="password"` for password fields
4. Placing a `<button>` inside `iconRight` — those spans are `pointer-events-none`
5. Using `size` to mean visual weight — it controls height only

---

## 6. Accessibility

### ARIA Attributes
- `label` is connected to the `<input>` via auto-generated `id` / `htmlFor`
- `error` message is rendered with `role="alert"` for immediate SR announcement
- `disabled` maps to native `disabled` attribute

### Keyboard Interaction
| Key | Behavior |
|---|---|
| `Tab` | Focuses the input |
| Any char | Types into the input natively |
| `Escape` | Native browser behavior (clears some input types) |

### Screen Reader Behavior
- Label is read when input receives focus
- Error message with `role="alert"` is announced immediately when it appears
- Hint text is not announced on focus — use `aria-describedby` manually if needed

---

## 7. AI Generation Guide

### Decision Tree
```
Needs date?           → Use DatePicker
Needs multiline?      → Use <textarea> (no system component yet)
Needs boolean?        → Use Switch or Checkbox
Otherwise             → Use Input
```

### Checklist Before Generating
- [ ] `label` or `aria-label` is present
- [ ] `type` is set appropriately (`text`, `email`, `password`, `search`, `url`, `number`)
- [ ] Error state uses `error` prop, not `className`
- [ ] No interactive elements inside `iconLeft` / `iconRight`
- [ ] `addonLeft` and `iconLeft` are not both set

### Output Format
```tsx
<Input
  label="Field label"
  placeholder="Placeholder"
  value={value}
  onChange={e => setValue(e.target.value)}
  error={errorMessage}
  hint="Helper text"
  size="md"
/>
```
