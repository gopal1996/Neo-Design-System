import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { DatePicker, type DayRenderProps, type QuickOption } from './DatePicker';
import { colors, radii, spacing, typography } from '../../tokens';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={s.section}>
    <Text style={s.sectionLabel}>{title}</Text>
    {children}
  </View>
);

function addDays(base: Date, n: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

const now = new Date();

// ─── Quick option presets ─────────────────────────────────────────────────────

const DEFAULT_QUICK: QuickOption[] = [
  { label: 'Today',     getValue: () => new Date() },
  { label: 'Yesterday', getValue: () => addDays(new Date(), -1) },
  { label: 'In 7 days', getValue: () => addDays(new Date(), 7) },
  { label: 'In 30 days',getValue: () => addDays(new Date(), 30) },
  { label: 'Clear',     getValue: () => null },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  decorators: [
    Story => (
      <ScrollView style={s.screen} contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        <Story />
      </ScrollView>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

// ─── 1. Basic date ────────────────────────────────────────────────────────────

export const BasicDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <Section title="Basic date">
        <DatePicker
          label="Due date"
          value={date}
          onChange={setDate}
          clearable
          fullWidth
          hint="Tap to open the calendar"
        />
      </Section>
    );
  },
};

// ─── 2. Time-only ─────────────────────────────────────────────────────────────

export const TimeOnly: Story = {
  render: () => {
    const [t, setT] = useState<Date | null>(null);
    return (
      <Section title="Time only">
        <DatePicker
          label="Reminder time"
          mode="time"
          value={t}
          onChange={setT}
          hint="Hours and minutes only"
          fullWidth
        />
        <DatePicker
          label="24-hour format"
          mode="time"
          timeFormat="24h"
          value={t}
          onChange={setT}
          fullWidth
        />
      </Section>
    );
  },
};

// ─── 3. Date + time ───────────────────────────────────────────────────────────

export const DateTime: Story = {
  render: () => {
    const [dt, setDt] = useState<Date | null>(null);
    return (
      <Section title="Date & time">
        <DatePicker
          label="Schedule event"
          mode="datetime"
          value={dt}
          onChange={setDt}
          hint="Choose a date then switch to the Time tab"
          clearable
          fullWidth
        />
        <DatePicker
          label="24h clock"
          mode="datetime"
          timeFormat="24h"
          value={dt}
          onChange={setDt}
          fullWidth
        />
      </Section>
    );
  },
};

// ─── 4. Sizes ─────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => {
    const [d, setD] = useState<Date | null>(null);
    return (
      <Section title="Sizes">
        <DatePicker label="Small"  size="sm" value={d} onChange={setD} fullWidth />
        <DatePicker label="Medium" size="md" value={d} onChange={setD} fullWidth />
        <DatePicker label="Large"  size="lg" value={d} onChange={setD} fullWidth />
      </Section>
    );
  },
};

// ─── 5. Min / Max bounds ──────────────────────────────────────────────────────

export const MinMaxBounds: Story = {
  render: () => {
    const [d, setD] = useState<Date | null>(null);
    return (
      <Section title="Min / Max date bounds">
        <DatePicker
          label="Appointment (next 30 days only)"
          value={d}
          onChange={setD}
          minDate={now}
          maxDate={addDays(now, 30)}
          hint="Dates outside the range are disabled"
          fullWidth
        />
        <DatePicker
          label="Past dates only"
          value={d}
          onChange={setD}
          maxDate={addDays(now, -1)}
          fullWidth
        />
      </Section>
    );
  },
};

// ─── 6. States ───────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <Section title="States">
      <DatePicker label="Error"    value={null} onChange={() => {}} error="Date is required"  fullWidth />
      <DatePicker label="Disabled" value={now}  onChange={() => {}} disabled                  fullWidth />
      <DatePicker label="With hint" value={null} onChange={() => {}} hint="Pick any date"     fullWidth />
    </Section>
  ),
};

// ─── 7. firstDayOfWeek ────────────────────────────────────────────────────────

export const FirstDayOfWeek: Story = {
  render: () => {
    const [d, setD] = useState<Date | null>(null);
    return (
      <Section title="First day of week">
        <DatePicker label="Sun first (default)" value={d} onChange={setD} firstDayOfWeek="sun" fullWidth />
        <DatePicker label="Mon first"           value={d} onChange={setD} firstDayOfWeek="mon" fullWidth />
      </Section>
    );
  },
};

// ─── 8. Highlight weekends + week numbers ─────────────────────────────────────

export const CalendarOptions: Story = {
  render: () => {
    const [d, setD] = useState<Date | null>(null);
    return (
      <Section title="Calendar options">
        <DatePicker
          label="Highlight weekends"
          value={d}
          onChange={setD}
          highlightWeekends
          fullWidth
        />
        <DatePicker
          label="ISO week numbers"
          value={d}
          onChange={setD}
          showWeekNumbers
          fullWidth
        />
        <DatePicker
          label="Both"
          value={d}
          onChange={setD}
          highlightWeekends
          showWeekNumbers
          fullWidth
        />
      </Section>
    );
  },
};

// ─── 9. Marked dates ──────────────────────────────────────────────────────────

export const MarkedDates: Story = {
  render: () => {
    const [d, setD] = useState<Date | null>(null);
    const year  = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const marks: Record<string, { dot: boolean; variant: 'brand' | 'success' | 'warning' | 'error' }> = {
      [`${year}-${month}-03`]: { dot: true, variant: 'success' },
      [`${year}-${month}-07`]: { dot: true, variant: 'error' },
      [`${year}-${month}-14`]: { dot: true, variant: 'warning' },
      [`${year}-${month}-21`]: { dot: true, variant: 'brand' },
      [`${year}-${month}-25`]: { dot: true, variant: 'success' },
    };
    return (
      <Section title="Marked dates (dots)">
        <DatePicker
          label="Calendar with events"
          value={d}
          onChange={setD}
          markedDates={marks}
          hint="Dots indicate events on those days"
          fullWidth
        />
      </Section>
    );
  },
};

// ─── 10. Quick options ────────────────────────────────────────────────────────

export const QuickOptions: Story = {
  render: () => {
    const [d, setD] = useState<Date | null>(null);
    return (
      <Section title="Quick option shortcuts">
        <DatePicker
          label="Select date"
          value={d}
          onChange={setD}
          quickOptions={DEFAULT_QUICK}
          hint="Shortcuts appear above the calendar"
          clearable
          fullWidth
        />
      </Section>
    );
  },
};

// ─── 11. Custom display format ────────────────────────────────────────────────

export const CustomDisplayFormat: Story = {
  render: () => {
    const [d, setD] = useState<Date | null>(now);
    return (
      <Section title="Custom displayFormat">
        <DatePicker
          label="ISO format"
          value={d}
          onChange={setD}
          displayFormat={dt => dt.toISOString().slice(0, 10)}
          fullWidth
        />
        <DatePicker
          label="Full locale string"
          value={d}
          onChange={setD}
          displayFormat={dt => dt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          fullWidth
        />
        <DatePicker
          label="DD/MM/YYYY"
          value={d}
          onChange={setD}
          displayFormat={dt => `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`}
          fullWidth
        />
      </Section>
    );
  },
};

// ─── 12. renderDay ────────────────────────────────────────────────────────────

export const CustomRenderDay: Story = {
  render: () => {
    const [d, setD] = useState<Date | null>(null);
    const busyDays = new Set([3, 8, 15, 22]);

    const customDay = ({ date, isSelected, isDisabled, isToday, onPress }: DayRenderProps) => {
      const busy = busyDays.has(date.getDate()) && date.getMonth() === now.getMonth();
      return (
        <TouchableOpacity
          onPress={onPress}
          disabled={isDisabled}
          activeOpacity={0.7}
          style={{
            flex: 1,
            aspectRatio: 1,
            margin: 1,
            borderRadius: radii.md,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isSelected
              ? colors.violet500
              : isToday
                ? 'rgba(124,58,237,0.15)'
                : 'transparent',
            borderWidth: isToday && !isSelected ? 1 : 0,
            borderColor: colors.violet500,
            opacity: isDisabled ? 0.3 : 1,
          }}
        >
          <Text style={{ fontSize: 13, color: isSelected ? '#fff' : colors.textPrimary, fontWeight: '500' }}>
            {date.getDate()}
          </Text>
          {busy && (
            <Text style={{ fontSize: 7, color: isSelected ? 'rgba(255,255,255,0.8)' : colors.warning, fontWeight: '700', letterSpacing: 0.5 }}>
              BUSY
            </Text>
          )}
        </TouchableOpacity>
      );
    };

    return (
      <Section title="Custom renderDay (busy labels)">
        <DatePicker
          label="Team calendar"
          value={d}
          onChange={setD}
          renderDay={customDay}
          hint="Busy days show a BUSY label"
          fullWidth
        />
      </Section>
    );
  },
};

// ─── 13. No footer ────────────────────────────────────────────────────────────

export const NoFooter: Story = {
  render: () => {
    const [d, setD] = useState<Date | null>(null);
    return (
      <Section title="showFooter={false}">
        <DatePicker
          label="No footer — tap day to select"
          value={d}
          onChange={setD}
          showFooter={false}
          hint="The sheet closes immediately on day tap"
          fullWidth
        />
      </Section>
    );
  },
};

// ─── 14. Uncontrolled ────────────────────────────────────────────────────────

export const Uncontrolled: Story = {
  render: () => (
    <Section title="Uncontrolled (defaultValue)">
      <DatePicker
        label="Start date"
        defaultValue={now}
        onChange={d => console.log('changed:', d)}
        fullWidth
      />
    </Section>
  ),
};

// ─── 15. Kitchen sink ─────────────────────────────────────────────────────────

export const KitchenSink: Story = {
  render: () => {
    const [date, setDate]   = useState<Date | null>(null);
    const [dt,   setDt]     = useState<Date | null>(null);
    const [time, setTime]   = useState<Date | null>(null);

    const year  = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const marks = {
      [`${year}-${month}-10`]: { dot: true, variant: 'brand'   as const },
      [`${year}-${month}-18`]: { dot: true, variant: 'success' as const },
      [`${year}-${month}-24`]: { dot: true, variant: 'error'   as const },
    };

    return (
      <>
        <Section title="Date with all features">
          <DatePicker
            label="Date"
            value={date}
            onChange={setDate}
            minDate={addDays(now, -60)}
            maxDate={addDays(now, 60)}
            highlightWeekends
            showWeekNumbers
            firstDayOfWeek="mon"
            markedDates={marks}
            quickOptions={DEFAULT_QUICK}
            clearable
            hint="Weekends highlighted, ISO week numbers shown, quick shortcuts available"
            fullWidth
          />
        </Section>
        <Section title="Date & time">
          <DatePicker
            label="Event date & time"
            mode="datetime"
            timeFormat="12h"
            value={dt}
            onChange={setDt}
            minDate={now}
            quickOptions={[
              { label: 'Now',        getValue: () => new Date() },
              { label: 'Tomorrow noon', getValue: () => { const d = addDays(new Date(), 1); d.setHours(12, 0); return d; } },
            ]}
            clearable
            fullWidth
          />
        </Section>
        <Section title="Time only (24h)">
          <DatePicker
            label="Alarm time"
            mode="time"
            timeFormat="24h"
            value={time}
            onChange={setTime}
            fullWidth
          />
        </Section>
      </>
    );
  },
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: colors.bgBase },
  container: { padding: spacing[6], gap: spacing[6], paddingBottom: spacing[16] },
  section:   { gap: spacing[4] },
  sectionLabel: {
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
