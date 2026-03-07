# Checkbox — Component AI Context

> Source: `src/components/Checkbox/Checkbox.tsx`

---

## 1. Component Overview

### What it does
`Checkbox` renders a custom-styled checkbox control backed by a visually hidden native `<input type="checkbox">`. Supports checked, indeterminate, error, and disabled states, plus optional label, description, and error message. Uses `React.forwardRef` for ref access. Visual state is controlled via CSS class selectors on the hidden input.

### When to use
- Multi-select lists (select many from many)
- Agreeing to terms or conditions (single checkbox + submit)
- "Select all" patterns with indeterminate state
- Form-driven boolean fields where value is submitted via form

### When NOT to use
- **Immediate toggle (no form submit)** → use `Switch`
- **Single choice from a list** → use `RadioGroup`
- **Filtering (non-form)** → use `Tabs` pill or filter buttons

### Related Components
| Component | Relationship |
|---|---|
| `Switch` | Peer — use Switch for immediate toggles, Checkbox for form booleans |
| `RadioGroup` | Peer — use for single-select; Checkbox for multi-select |
| `Input` | Shares label/error/hint pattern |

---

## 2. Props API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `React.ReactNode` | `undefined` | No | Text label rendered beside the checkbox |
| `description` | `string` | `undefined` | No | Helper text below the label |
| `error` | `string` | `undefined` | No | Error message; replaces description and applies error border |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Size of the checkbox box |
| `indeterminate` | `boolean` | `false` | No | Shows a dash instead of a checkmark (for "select all" partial state) |
| `checked` | `boolean` | `undefined` | No | Controlled checked state |
| `defaultChecked` | `boolean` | `undefined` | No | Initial state for uncontrolled usage |
| `onChange` | `React.ChangeEventHandler<HTMLInputElement>` | `undefined` | No | Standard input change handler |
| `disabled` | `boolean` | `false` | No | Disables the checkbox |
| `id` | `string` | `undefined` | No | Custom id; auto-generated if omitted |
| `...rest` | `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' \| 'type'>` | — | No | All other native input attributes |

### Most Commonly Used
`label`, `checked`, `onChange`, `error`, `indeterminate`

### Props That Must Not Be Combined
- `checked` without `onChange` → controlled but frozen
- `indeterminate={true}` + `checked={true}` → visually ambiguous; indeterminate overrides checkmark rendering
- `error` + `description` → error replaces description visually; avoid setting both

---

## 3. Variants

Checkbox has no `variant` prop. States are visual:

| State | Visual |
|---|---|
| Unchecked | Empty box, `border-stroke-strong` |
| Checked | Violet filled box with white checkmark |
| Indeterminate | Violet filled box with white dash |
| Error | Red border on box |
| Disabled | 45% opacity on wrapper |

### Size Classes
| Size | Box dimensions | Label font |
|---|---|---|
| `sm` | 14×14px | `text-[0.8125rem]` |
| `md` | 16×16px | `text-sm` |
| `lg` | 20×20px | `text-base` |

---

## 4. Usage Patterns

### Controlled single checkbox
```tsx
<Checkbox
  label="I agree to the Terms of Service"
  checked={agreed}
  onChange={e => setAgreed(e.target.checked)}
/>
```

### With description and error
```tsx
<Checkbox
  label="Marketing emails"
  description="Receive product updates and promotions"
  error={errors.marketing}
  checked={marketing}
  onChange={e => setMarketing(e.target.checked)}
/>
```

### Indeterminate "select all"
```tsx
<Checkbox
  label="Select all"
  indeterminate={someSelected && !allSelected}
  checked={allSelected}
  onChange={e => toggleAll(e.target.checked)}
/>
```

### Checkbox list (multi-select)
```tsx
{options.map(opt => (
  <Checkbox
    key={opt.id}
    label={opt.label}
    checked={selected.includes(opt.id)}
    onChange={e => toggle(opt.id, e.target.checked)}
  />
))}
```

### Inside a form
```tsx
<form onSubmit={handleSubmit}>
  <Checkbox name="terms" required label="I accept the terms" />
  <Button type="submit">Continue</Button>
</form>
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Always pair checked with onChange in controlled mode
<Checkbox checked={val} onChange={e => setVal(e.target.checked)} label="Option" />

// Use indeterminate for partial selection in select-all patterns
<Checkbox indeterminate={partial} checked={all} onChange={toggleAll} label="Select all" />

// Use description for context
<Checkbox label="2FA" description="Adds extra security to your account" />
```

### ❌ Don'ts
```tsx
// ❌ Don't use Checkbox for immediate toggles — use Switch
<Checkbox label="Dark mode" onChange={toggleTheme} />  // use Switch

// ❌ Don't use Checkbox for single-choice from multiple options
<Checkbox label="Monthly" />
<Checkbox label="Annually" />  // → use RadioGroup

// ❌ Don't skip label — checkbox has no visual text otherwise
<Checkbox checked={val} onChange={setVal} />  // no label = inaccessible
```

### Common AI Mistakes
1. Using `Checkbox` for immediate settings toggles — use `Switch`
2. Using multiple Checkboxes for single-choice (pick one) — use `RadioGroup`
3. Providing `checked` without `onChange` — frozen state
4. Omitting `label` — required for accessibility

---

## 6. Accessibility

### ARIA Roles
- Renders a native `<input type="checkbox">` (visually hidden, fully accessible)
- `indeterminate` is set via `element.indeterminate` DOM property (not an attribute)
- `error` text has `role="alert"` for immediate screen reader announcement
- Label connected via `htmlFor={inputId}`

### Keyboard Interaction
| Key | Behavior |
|---|---|
| `Tab` | Focuses the checkbox |
| `Space` | Toggles checked state |

### Screen Reader Behavior
- Announced as: *"[Label], checkbox, checked/unchecked/mixed"*
- Indeterminate state reads as "mixed"
- Error is announced immediately via `role="alert"`

---

## 7. AI Generation Guide

### Decision Tree
```
Immediate effect, no form submit?     → Switch
Pick exactly one from a list?         → RadioGroup
Pick many from a list?                → Checkbox group ✅
Single boolean in a form?             → Checkbox ✅
Partial selection state?              → Checkbox with indeterminate ✅
```

### Checklist
- [ ] `label` is always present
- [ ] Controlled mode: both `checked` and `onChange` present
- [ ] Indeterminate: set when a "select all" is partially selected
- [ ] Error: use `error` prop, not manual DOM below the component

### Output Format
```tsx
// Single controlled
<Checkbox label="Accept terms" checked={accepted} onChange={e => setAccepted(e.target.checked)} />

// Multi-select list
{items.map(item => (
  <Checkbox
    key={item.id}
    label={item.label}
    checked={selected.has(item.id)}
    onChange={e => toggle(item.id, e.target.checked)}
  />
))}
```
