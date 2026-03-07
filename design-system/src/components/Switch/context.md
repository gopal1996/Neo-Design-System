# Switch — Component AI Context

> Source: `src/components/Switch/Switch.tsx`

---

## 1. Component Overview

### What it does
`Switch` is a toggle control for binary on/off state. It renders a styled `<button role="switch">` (not a native checkbox) with an animated thumb. Supports controlled and uncontrolled modes, a visible label, and hint text. The checked state applies a violet gradient track with a subtle glow.

### When to use
- Enabling/disabling features, settings, or notifications
- Any immediate toggle that does not require form submission to take effect
- Preference toggles (Dark mode, Email notifications, Auto-save)

### When NOT to use
- **Multiple selections from a list** → use `Checkbox` group
- **Single confirmation with a form submit** → use `Checkbox` with a submit `Button`
- **Choice between multiple options** → use `RadioGroup`
- **Filtering data** → use `Tabs` with pill variant

### Related Components
| Component | Relationship |
|---|---|
| `Checkbox` | Peer — use Checkbox when inside a form with submission; Switch for immediate effect |
| `RadioGroup` | Peer — use RadioGroup for mutually exclusive options |

---

## 2. Props API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `checked` | `boolean` | `undefined` | No | Controlled checked state |
| `defaultChecked` | `boolean` | `undefined` | No | Initial state for uncontrolled usage |
| `onChange` | `(checked: boolean) => void` | `undefined` | No | Callback with the new boolean value |
| `disabled` | `boolean` | `false` | No | Disables the switch and reduces opacity |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Physical size of the track and thumb |
| `label` | `string` | `undefined` | No | Visible text label beside the switch |
| `hint` | `string` | `undefined` | No | Helper text below the switch |
| `id` | `string` | `undefined` | No | Custom id for the button; auto-generated if omitted |
| `className` | `string` | `undefined` | No | Extra classes merged via `cn()` |

### Most Commonly Used
`checked`, `onChange`, `label`, `size`

### Props That Must Not Be Combined
- `checked` without `onChange` → controlled input with no update path; always pair them
- `defaultChecked` + `checked` → use one mode (controlled or uncontrolled), not both

---

## 3. Variants

Switch has no `variant` prop. States are visual only:

| State | Track color | Thumb |
|---|---|---|
| Unchecked | `bg-neutral-700` | White, at left |
| Checked | `bg-gradient-brand` + violet glow | White, animated to right |
| Disabled | 50% opacity on wrapper | No interaction |

### Size Dimensions
| Size | Track | Thumb |
|---|---|---|
| `sm` | `w-8 h-[18px]` | 12×12px |
| `md` | `w-11 h-6` | 18×18px |
| `lg` | `w-14 h-[30px]` | 22×22px |

---

## 4. Usage Patterns

### Controlled
```tsx
const [enabled, setEnabled] = useState(false);
<Switch checked={enabled} onChange={setEnabled} label="Enable notifications" />
```

### Uncontrolled
```tsx
<Switch defaultChecked={true} label="Dark mode" />
```

### With hint text
```tsx
<Switch
  checked={autoSave}
  onChange={setAutoSave}
  label="Auto-save"
  hint="Changes are saved every 30 seconds"
/>
```

### Disabled (always on)
```tsx
<Switch checked={true} disabled label="Always encrypted" hint="Cannot be disabled on this plan" />
```

### Small size in a settings list
```tsx
<div className="flex items-center justify-between py-3 border-b border-stroke">
  <div>
    <Text variant="body-sm">Email digests</Text>
    <Text variant="caption" color="tertiary">Weekly summary of your activity</Text>
  </div>
  <Switch size="sm" checked={digest} onChange={setDigest} />
</div>
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Always pair checked with onChange in controlled mode
<Switch checked={val} onChange={setVal} label="Notifications" />

// Use hint to explain the effect of toggling
<Switch label="Two-factor auth" hint="Adds an extra layer of security" />

// Use size="sm" in dense settings panels
<Switch size="sm" checked={v} onChange={setV} />
```

### ❌ Don'ts
```tsx
// ❌ Don't use Switch inside a <form> expecting onChange to submit data
// Switch fires onChange immediately — use Checkbox for form-driven booleans

// ❌ Don't provide checked without onChange
<Switch checked={true} label="Feature" />  // frozen state

// ❌ Don't use Switch for multi-select scenarios
<Switch label="Option A" />
<Switch label="Option B" />
// → Use <Checkbox> group instead
```

### Common AI Mistakes
1. Using `Switch` inside a form that requires submit — use `Checkbox` instead
2. Passing `checked={true}` without `onChange` — the switch appears on but cannot toggle
3. Using `Switch` for mutually exclusive choices — use `RadioGroup`
4. Adding `onClick` instead of `onChange` — Switch exposes `onChange(checked: boolean)`, not a click event

---

## 6. Accessibility

### ARIA Roles
- Renders as `<button role="switch">`
- `aria-checked` is set to the `checked` value
- `disabled` is set natively on the button element

### Keyboard Interaction
| Key | Behavior |
|---|---|
| `Tab` | Focuses the switch |
| `Space` | Toggles the switch |
| `Enter` | Toggles the switch |

### Screen Reader Behavior
- Announced as: *"[Label], switch, on/off"*
- State change is announced immediately via `aria-checked` update
- Label `<label>` is connected to the button via `htmlFor={switchId}`

---

## 7. AI Generation Guide

### Decision Tree
```
Immediate effect (no form submit)?           → Switch ✅
Inside a form requiring explicit submit?     → Checkbox
Multiple options, pick many?                 → Checkbox group
Multiple options, pick one?                  → RadioGroup
```

### Checklist
- [ ] If controlled: both `checked` and `onChange` are present
- [ ] If uncontrolled: only `defaultChecked` (not both)
- [ ] `label` provided (or ensure surrounding context is descriptive)
- [ ] Not used inside a `<form>` for submission-driven values

### Output Format
```tsx
// Controlled
<Switch checked={isEnabled} onChange={setIsEnabled} label="Feature name" />

// With hint
<Switch
  checked={isEnabled}
  onChange={setIsEnabled}
  label="Feature name"
  hint="Describe the impact of this toggle"
  size="md"
/>
```
