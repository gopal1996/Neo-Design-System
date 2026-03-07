# DatePicker — Component AI Context

> Source: `src/components/DatePicker/DatePicker.tsx`

---

## 1. Component Overview

### What it does
`DatePicker` is a full-featured date and datetime picker with a dropdown calendar panel. It supports three views: day grid, month grid, and year grid. Navigation between views is done by clicking the month/year headings. Supports controlled and uncontrolled modes, min/max date bounds, an optional time picker (12-hour AM/PM), clearable selection, and Today/Clear/Apply footer buttons. The calendar panel uses absolute positioning and is z-indexed to 100.

### When to use
- Form fields requiring a specific date (due date, birth date, scheduled date)
- Datetime fields for event scheduling
- Date range-bound inputs (minDate, maxDate constraints)

### When NOT to use
- **Relative time selection** ("In 3 days", "Next week") → use a custom select
- **Year-only selection** → use a plain `<select>` for year
- **Date ranges (start → end)** → DatePicker selects a single date; build a range picker separately
- **Free-text date entry** → DatePicker is calendar-based only

### Related Components
| Component | Relationship |
|---|---|
| `Input` | DatePicker uses an Input-like trigger internally — do not wrap in `<Input>` |
| `Modal` | For date selection in a modal, render `DatePicker` inside the modal `children` |

---

## 2. Props API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `value` | `Date \| null` | `undefined` | No | Controlled selected date |
| `defaultValue` | `Date \| null` | `null` | No | Initial value for uncontrolled usage |
| `onChange` | `(date: Date \| null) => void` | `undefined` | No | Called when selection changes |
| `mode` | `'date' \| 'datetime'` | `'date'` | No | Adds a time picker when `'datetime'` |
| `placeholder` | `string` | `'Select date'` / `'Select date & time'` | No | Trigger input placeholder |
| `minDate` | `Date` | `undefined` | No | Earliest selectable date — earlier dates are disabled |
| `maxDate` | `Date` | `undefined` | No | Latest selectable date — later dates are disabled |
| `disabled` | `boolean` | `false` | No | Disables the entire picker |
| `clearable` | `boolean` | `true` | No | Shows a clear button and "Clear" footer action |
| `label` | `string` | `undefined` | No | Label above the trigger input |
| `hint` | `string` | `undefined` | No | Helper text below the input |
| `error` | `string` | `undefined` | No | Error message below the input |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Height of the trigger input |
| `showFooter` | `boolean` | `true` | No | Shows Today / Clear / Apply buttons in the panel |
| `highlightWeekends` | `boolean` | `false` | No | Renders weekend day numbers in violet |
| `id` | `string` | `undefined` | No | Custom id for the input |
| `className` | `string` | `undefined` | No | Extra classes on the root wrapper |

### Most Commonly Used
`value`, `onChange`, `label`, `mode`, `minDate`, `maxDate`

### Props That Must Not Be Combined
- `value` without `onChange` → controlled but frozen; always pair them
- `defaultValue` + `value` → choose one mode (controlled or uncontrolled)
- `showFooter={false}` on `mode="datetime"` → Apply button is in the footer; hiding footer means the time picker has no confirm action — avoid this combination
- `clearable={false}` + `required` → consistent (non-clearable required field is valid)

---

## 3. Variants

DatePicker has two modes, not visual variants:

| Mode | Calendar panel | Extra UI |
|---|---|---|
| `date` | Day/month/year grids | Panel closes on day click |
| `datetime` | Day/month/year grids + time picker | Apply button required to confirm; panel stays open after day click |

### Size (trigger input height)
| Size | Height |
|---|---|
| `sm` | `h-8` |
| `md` | `h-10` |
| `lg` | `h-12` |

### Calendar Views
1. **Days** — default; 7-column grid with month navigation
2. **Months** — click the month heading; 3-column month grid
3. **Years** — click the year heading; 3-column year grid (12 years per page)

---

## 4. Usage Patterns

### Controlled date picker
```tsx
const [date, setDate] = useState<Date | null>(null);
<DatePicker label="Due date" value={date} onChange={setDate} />
```

### Datetime mode
```tsx
<DatePicker
  label="Schedule event"
  mode="datetime"
  value={datetime}
  onChange={setDatetime}
  minDate={new Date()}
/>
```

### Min/max bounds
```tsx
<DatePicker
  label="Appointment"
  value={date}
  onChange={setDate}
  minDate={new Date()}
  maxDate={addMonths(new Date(), 3)}
/>
```

### Non-clearable required field
```tsx
<DatePicker
  label="Birth date"
  value={dob}
  onChange={setDob}
  clearable={false}
  maxDate={new Date()}
  error={errors.dob}
/>
```

### Uncontrolled
```tsx
<DatePicker label="Start date" defaultValue={new Date()} onChange={console.log} />
```

### Inside a Modal
```tsx
<Modal open={open} onClose={close} title="Schedule">
  <DatePicker label="Date & time" mode="datetime" value={dt} onChange={setDt} />
</Modal>
```

---

## 5. Do's and Don'ts

### ✅ Do's
```tsx
// Always pair value with onChange in controlled mode
<DatePicker value={date} onChange={setDate} label="Due date" />

// Use minDate={new Date()} to prevent past date selection
<DatePicker label="Expiry" value={d} onChange={setD} minDate={new Date()} />

// Use error prop for validation — not a manual Text component below
<DatePicker label="Date" value={d} onChange={setD} error={errors.date} />
```

### ❌ Don'ts
```tsx
// ❌ Don't wrap DatePicker in Input — it has its own trigger input
<Input label="Date" value={...} />  // for date fields, use DatePicker

// ❌ Don't use showFooter={false} with mode="datetime"
<DatePicker mode="datetime" showFooter={false} />  // no Apply button

// ❌ Don't use value without onChange — the picker becomes unresponsive
<DatePicker value={someDate} label="Date" />

// ❌ Don't use DatePicker for date range selection — it selects a single date
```

### Common AI Mistakes
1. Using `<Input type="date">` instead of `DatePicker` — Input has no calendar UI
2. Setting `value` without `onChange` — controlled but unresponsive
3. Using `showFooter={false}` with `mode="datetime"` — Apply button is in the footer
4. Wrapping DatePicker in an `<Input>` — DatePicker already has its own trigger

---

## 6. Accessibility

### ARIA Roles
- Trigger input: `aria-haspopup="dialog"`, `aria-expanded={open}`, `aria-label`
- Calendar panel: `role="dialog"`, `aria-label="Date picker"`, `aria-modal="false"`
- Day grid: `role="grid"` with `role="gridcell"` on day buttons
- Column headers: `role="columnheader"`
- Selected day: `aria-selected`, `aria-pressed`

### Keyboard Interaction
| Key | Behavior |
|---|---|
| `Enter` / `Space` on trigger | Opens / closes calendar |
| `Escape` | Closes calendar |
| `Tab` | Navigates month/year navigation buttons and day cells |
| `Enter` on day | Selects date; closes panel (date mode) |
| Mouse click outside | Closes calendar |

### Screen Reader Behavior
- Each day button has `aria-label` with full date string (e.g., "Monday, March 10, 2025")
- Selected state announced via `aria-selected` and `aria-pressed`
- Disabled days announced as disabled buttons

---

## 7. AI Generation Guide

### Decision Tree
```
Single date selection?               → DatePicker mode="date" ✅
Date + time selection?               → DatePicker mode="datetime" ✅
Date range (start + end)?            → Two DatePicker instances (no range component)
Year only?                           → <select> with year options
Relative time ("Next week")?         → Custom select
```

### Checklist
- [ ] Controlled: both `value` and `onChange` present
- [ ] `mode="datetime"` + `showFooter={true}` (default) — never disable footer in datetime mode
- [ ] `minDate` set when past dates are invalid
- [ ] `error` prop used for validation messages (not a separate `<Text>`)
- [ ] Not wrapped inside `<Input>`
- [ ] `label` always provided

### Output Format
```tsx
// Date only
<DatePicker
  label="Due date"
  value={date}
  onChange={setDate}
  minDate={new Date()}
/>

// Datetime
<DatePicker
  label="Schedule"
  mode="datetime"
  value={datetime}
  onChange={setDatetime}
  minDate={new Date()}
  error={errors.datetime}
/>
```
