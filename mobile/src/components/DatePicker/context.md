# DatePicker

Full-featured date, time, and datetime picker for React Native. Opens as a bottom-sheet modal with day/month/year grid navigation, a time spinner, and deep customisation hooks.

## Modes

| Mode | Behaviour |
|------|-----------|
| `date` (default) | Day/month/year grids. Tapping a day fires `onChange` and closes immediately. |
| `time` | Time spinner only. Apply confirms. |
| `datetime` | Date + Time tabs. Apply confirms the combined value. |

## Basic usage

```tsx
import { DatePicker } from '@neo-design-library/mobile';

// Date
const [date, setDate] = useState<Date | null>(null);
<DatePicker label="Due date" value={date} onChange={setDate} />

// Time
<DatePicker label="Reminder" mode="time" value={time} onChange={setTime} />

// Date + time
<DatePicker label="Schedule" mode="datetime" value={dt} onChange={setDt} />
```

---

## Props

### Value

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| null` | — | Controlled selected date |
| `defaultValue` | `Date \| null` | `null` | Uncontrolled initial value |
| `onChange` | `(d: Date \| null) => void` | — | Change callback |

### Mode & formatting

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'date' \| 'time' \| 'datetime'` | `'date'` | Picker mode |
| `timeFormat` | `'12h' \| '24h'` | `'12h'` | Clock format |
| `displayFormat` | `(d: Date) => string` | — | Custom trigger display string |

### Constraints

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `minDate` | `Date` | — | Earliest selectable date |
| `maxDate` | `Date` | — | Latest selectable date |

### Field UI

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label above the trigger |
| `placeholder` | `string` | auto | Trigger placeholder |
| `hint` | `string` | — | Helper text |
| `error` | `string` | — | Error message |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Trigger height |
| `disabled` | `boolean` | `false` | Disable the field |
| `clearable` | `boolean` | `true` | Show a clear button |

### Calendar options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `firstDayOfWeek` | `'sun' \| 'mon'` | `'sun'` | First column in the week grid |
| `highlightWeekends` | `boolean` | `false` | Render weekend numbers in violet |
| `showWeekNumbers` | `boolean` | `false` | Add ISO week number column |
| `showFooter` | `boolean` | `true` | Show Today / Clear / Done footer |

### Customisation

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `renderDay` | `(props: DayRenderProps) => ReactNode` | — | Full custom day-cell renderer |
| `markedDates` | `Record<'YYYY-MM-DD', MarkedDate>` | `{}` | Dots / variants on specific dates |
| `quickOptions` | `QuickOption[]` | — | Shortcut chips above the calendar |

---

## markedDates

```ts
interface MarkedDate {
  dot?:     boolean;                                     // show a coloured dot
  variant?: 'brand' | 'success' | 'warning' | 'error';  // dot colour
  label?:   string;                                      // tiny label below dot
}

// Usage:
markedDates={{
  '2026-03-10': { dot: true, variant: 'success' },
  '2026-03-15': { dot: true, variant: 'error' },
}}
```

---

## quickOptions

```ts
interface QuickOption {
  label: string;
  getValue: () => Date | null;  // return null to clear
}

const opts: QuickOption[] = [
  { label: 'Today',     getValue: () => new Date() },
  { label: 'Yesterday', getValue: () => addDays(new Date(), -1) },
  { label: 'Clear',     getValue: () => null },
];
```

---

## renderDay

Full render-prop to replace the default day cell. You receive:

```ts
interface DayRenderProps {
  date:           Date;
  isSelected:     boolean;
  isToday:        boolean;
  isDisabled:     boolean;
  isWeekend:      boolean;
  isCurrentMonth: boolean;
  marked?:        MarkedDate;
  onPress:        () => void;   // call this to confirm the selection
}
```

```tsx
<DatePicker
  renderDay={({ date, isSelected, onPress }) => (
    <TouchableOpacity onPress={onPress} style={myStyle(isSelected)}>
      <Text>{date.getDate()}</Text>
    </TouchableOpacity>
  )}
/>
```

---

## displayFormat

```tsx
// ISO
displayFormat={d => d.toISOString().slice(0, 10)}

// DD/MM/YYYY
displayFormat={d =>
  `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}
```

---

## Uncontrolled

```tsx
<DatePicker
  label="Start date"
  defaultValue={new Date()}
  onChange={d => console.log(d)}
/>
```

---

## datetime mode — important note

`showFooter={false}` should **not** be used with `mode="datetime"` — there is no way to confirm the selection without the Apply button.

## Notes

- The sheet slides up with a spring animation and a scrim backdrop.
- Day/month/year views are reached by tapping the respective heading in the nav bar.
- In `datetime` mode, tapping a day auto-switches to the Time tab.
- Time spinner supports long-press repeating (hold the button to scroll quickly).
- Safe-area bottom padding is applied on iOS automatically.
