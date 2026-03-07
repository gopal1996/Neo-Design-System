# RadioGroup / Radio — Component AI Context

> Source: `src/components/Radio/Radio.tsx`
> Exports: `RadioGroup`, `Radio`

---

## 1. Component Overview

### What it does
`RadioGroup` is a `<fieldset>` container that provides a shared name, controlled value, and onChange via React Context to all `Radio` children. `Radio` renders a custom-styled native `<input type="radio">` with an optional label and description. Selection is mutually exclusive — only one Radio can be checked at a time within a group.

### When to use
- Single selection from 2–6 options that are all visible simultaneously
- Plan/tier selection (Free, Pro, Enterprise)
- Preference selection (Monthly, Annually)
- Any form field where exactly one option must be chosen

### When NOT to use
- **More than 6–8 options** → use a `<select>` dropdown
- **Multi-select** → use `Checkbox` group
- **Immediate toggle** → use `Switch`
- **Filtering data views** → use `Tabs` with pill variant

### Related Components
| Component | Relationship |
|---|---|
| `Checkbox` | Peer — multi-select alternative; same visual size system |
| `Switch` | Peer — immediate binary toggle |
| `Tabs` | Alternative for non-form view switching |

---

## 2. Props API

### RadioGroup Props
| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `name` | `string` | — | **Yes** | HTML name attribute shared by all Radio children |
| `value` | `string` | `undefined` | No | Controlled selected value |
| `onChange` | `(value: string) => void` | `undefined` | No | Callback with the new selected value |
| `label` | `string` | `undefined` | No | `<legend>` group label rendered above the options |
| `error` | `string` | `undefined` | No | Error message below the group |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Size applied to all Radio children (overridable per Radio) |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | No | Layout direction of the options |
| `disabled` | `boolean` | `false` | No | Disables all Radio children |
| `children` | `React.ReactNode` | — | **Yes** | `Radio` components |
| `className` | `string` | `undefined` | No | Extra classes on the fieldset |

### Radio Props
| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `string` | — | **Yes** | The value this option represents |
| `label` | `React.ReactNode` | `undefined` | No | Text label beside the radio circle |
| `description` | `string` | `undefined` | No | Helper text below the label |
| `disabled` | `boolean` | `undefined` | No | Disables only this option (overrides group) |
| `size` | `'sm' \| 'md' \| 'lg'` | `undefined` | No | Overrides group size for this option |
| `className` | `string` | `undefined` | No | Extra classes |

### Most Commonly Used (RadioGroup)
`name`, `value`, `onChange`, `label`, `children`

### Props That Must Not Be Combined
- `value` on RadioGroup without `onChange` → controlled but frozen
- `disabled` on both group and individual Radio → redundant; group-level disables all

---

## 3. Variants

RadioGroup has no `variant` prop. Layout is controlled by `direction`:

| Direction | Layout | Use case |
|---|---|---|
| `vertical` | Stack, `flex-col gap-2` | Default; most forms |
| `horizontal` | Row, `flex-row flex-wrap gap-4` | Short labels, compact settings |

### Radio States
| State | Visual |
|---|---|
| Unchecked | Empty circle, `border-stroke-strong` |
| Checked | Violet border + violet filled inner dot |
| Disabled | 45% opacity |
| Focus | Violet outline ring |

---

## 4. Usage Patterns

### Controlled vertical group
```tsx
<RadioGroup name="plan" value={plan} onChange={setPlan} label="Select your plan">
  <Radio value="free"       label="Free"       description="Up to 3 projects" />
  <Radio value="pro"        label="Pro"         description="$12/mo — unlimited projects" />
  <Radio value="enterprise" label="Enterprise"  description="Custom pricing" />
</RadioGroup>
```

### Horizontal layout
```tsx
<RadioGroup name="billing" value={billing} onChange={setBilling} direction="horizontal">
  <Radio value="monthly"  label="Monthly" />
  <Radio value="annually" label="Annually" />
</RadioGroup>
```

### With error
```tsx
<RadioGroup name="role" value={role} onChange={setRole} label="Role" error={errors.role}>
  <Radio value="admin"  label="Admin" />
  <Radio value="member" label="Member" />
  <Radio value="viewer" label="Viewer" />
</RadioGroup>
```

### One option disabled
```tsx
<RadioGroup name="tier" value={tier} onChange={setTier}>
  <Radio value="free" label="Free" />
  <Radio value="pro"  label="Pro" />
  <Radio value="enterprise" label="Enterprise" disabled description="Contact sales" />
</RadioGroup>
```

### Inside a form
```tsx
<form onSubmit={handleSubmit}>
  <RadioGroup name="gender" value={gender} onChange={setGender} label="Gender">
    <Radio value="male"   label="Male" />
    <Radio value="female" label="Female" />
    <Radio value="other"  label="Prefer not to say" />
  </RadioGroup>
  <Button type="submit">Continue</Button>
</form>
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Always provide name on RadioGroup — required for HTML semantics
<RadioGroup name="plan" value={plan} onChange={setPlan}>...</RadioGroup>

// Use description on Radio for pricing/tier context
<Radio value="pro" label="Pro" description="$12/mo" />

// Use horizontal for binary choices
<RadioGroup direction="horizontal" name="billing">
  <Radio value="monthly" label="Monthly" />
  <Radio value="annually" label="Annually" />
</RadioGroup>
```

### ❌ Don'ts
```tsx
// ❌ Don't use Radio outside RadioGroup — name/value/onChange won't work
<Radio value="option" label="Standalone" />  // never works alone

// ❌ Don't use RadioGroup for multi-select
// Each selection replaces the previous — use Checkbox for multi-select

// ❌ Don't use RadioGroup for more than ~6 options — use a <select>

// ❌ Don't skip name — RadioGroup name is required
<RadioGroup value={v} onChange={setV}>...</RadioGroup>  // missing name
```

### Common AI Mistakes
1. Using `Radio` outside `RadioGroup` — it has no name/onChange without context
2. Using RadioGroup for multi-select — it only supports single selection
3. Using RadioGroup for more than 6–7 options — too much vertical space; use `<select>`
4. Missing `name` prop on `RadioGroup` — required for HTML form semantics

---

## 6. Accessibility

### ARIA Roles
- `RadioGroup` renders as `<fieldset>` with `<legend>` for the group label
- Each `Radio` renders a native `<input type="radio">` (visually hidden) — fully accessible
- `error` has `role="alert"`
- Label connected via `htmlFor={uid}`

### Keyboard Interaction
| Key | Behavior |
|---|---|
| `Tab` | Focuses the radio group (first item) |
| `Arrow Up/Down` | Cycles through options within the group |
| `Arrow Left/Right` | Cycles through options (horizontal layout) |
| `Space` | Selects the focused option |

### Screen Reader Behavior
- Group label announced via `<legend>`
- Each option announced as: *"[Label], radio button, [checked/unchecked], [N] of [total]"*
- Error announced via `role="alert"` when it appears

---

## 7. AI Generation Guide

### Decision Tree
```
More than 6 options?                   → <select> dropdown
Multi-select (pick many)?              → Checkbox group
Single-select (pick one), ≤6 options?  → RadioGroup ✅
Immediate toggle (no submit)?          → Switch
Binary A/B choice?                     → RadioGroup direction="horizontal" ✅
```

### Checklist
- [ ] `name` is always present on `RadioGroup`
- [ ] Controlled mode: both `value` and `onChange` present on `RadioGroup`
- [ ] All `Radio` children have unique `value` strings
- [ ] `Radio` never rendered outside `RadioGroup`
- [ ] ≤ 6 options — otherwise switch to `<select>`

### Output Format
```tsx
<RadioGroup name="unique-name" value={selected} onChange={setSelected} label="Group label">
  <Radio value="a" label="Option A" description="Optional helper" />
  <Radio value="b" label="Option B" />
  <Radio value="c" label="Option C" disabled />
</RadioGroup>
```
