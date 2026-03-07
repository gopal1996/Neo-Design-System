import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker } from './DatePicker';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';

const meta: Meta<typeof DatePicker> = {
  title:     'Components/DatePicker',
  component: DatePicker,
  tags:      ['autodocs'],
  argTypes: {
    mode:      { control: 'select', options: ['date', 'datetime'] },
    size:      { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled:  { control: 'boolean' },
    clearable: { control: 'boolean' },
    showFooter:{ control: 'boolean' },
    highlightWeekends: { control: 'boolean' },
    label:     { control: 'text' },
    hint:      { control: 'text' },
    error:     { control: 'text' },
    placeholder: { control: 'text' },
  },
  args: { mode: 'date', size: 'md', clearable: true, showFooter: true },
  decorators: [Story => <div style={{ padding: 24, minHeight: 380 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

// ─── Basic ────────────────────────────────────────────────────

export const DateOnly: Story = {
  name: 'Date Only',
  render: args => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 280 }}>
        <DatePicker
          {...args}
          label="Select date"
          placeholder="Pick a date"
          value={date}
          onChange={setDate}
        />
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', margin: 0 }}>
          Selected: <strong style={{ color: 'var(--text-secondary)' }}>{date?.toDateString() ?? 'None'}</strong>
        </p>
      </div>
    );
  },
};

export const DateTime: Story = {
  name: 'Date + Time',
  render: args => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
        <DatePicker
          {...args}
          mode="datetime"
          label="Schedule date & time"
          placeholder="Pick date & time"
          value={date}
          onChange={setDate}
        />
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', margin: 0 }}>
          Selected: <strong style={{ color: 'var(--text-secondary)' }}>{date?.toLocaleString() ?? 'None'}</strong>
        </p>
      </div>
    );
  },
};

// ─── Controlled ───────────────────────────────────────────────

export const ControlledDate: Story = {
  name: 'Controlled — Programmatic Navigation',
  render: () => {
    const [date, setDate] = useState<Date | null>(new Date(2025, 5, 15)); // Jun 15 2025

    const presets = [
      { label: 'Today',      date: new Date() },
      { label: 'Yesterday',  date: (() => { const d = new Date(); d.setDate(d.getDate()-1); return d; })() },
      { label: 'Last week',  date: (() => { const d = new Date(); d.setDate(d.getDate()-7); return d; })() },
      { label: 'Last month', date: (() => { const d = new Date(); d.setMonth(d.getMonth()-1); return d; })() },
      { label: 'Q1 start',   date: new Date(new Date().getFullYear(), 0, 1) },
    ];

    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ margin: '0 0 4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Presets</p>
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => setDate(p.date)}
              style={{
                padding: '8px 14px', borderRadius: 8, textAlign: 'left', cursor: 'pointer',
                background: date && p.date.toDateString() === date.toDateString()
                  ? 'rgba(124,58,237,0.12)' : 'transparent',
                border: `1px solid ${date && p.date.toDateString() === date.toDateString()
                  ? 'var(--border-brand)' : 'var(--border)'}`,
                color: date && p.date.toDateString() === date.toDateString()
                  ? 'var(--violet-200)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                transition: 'all 150ms ease',
              }}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setDate(null)}
            style={{ padding: '8px 14px', borderRadius: 8, cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)', color: 'var(--error)', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}
          >
            Clear
          </button>
        </div>

        <div style={{ width: 280 }}>
          <DatePicker
            label="Date"
            value={date}
            onChange={setDate}
            showFooter
            clearable
          />
          {date && (
            <div style={{ marginTop: 12, padding: 12, background: 'var(--bg-muted)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>ISO string</p>
              <p style={{ margin: '4px 0 0', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--violet-300)' }}>{date.toISOString()}</p>
            </div>
          )}
        </div>
      </div>
    );
  },
};

// ─── Min / Max constraints ────────────────────────────────────

export const WithMinMaxDate: Story = {
  name: 'Min & Max Constraints',
  render: () => {
    const today   = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5);
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);
    const [date, setDate] = useState<Date | null>(today);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 300 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Badge variant="info"    size="sm">Min: {minDate.toLocaleDateString()}</Badge>
          <Badge variant="warning" size="sm">Max: {maxDate.toLocaleDateString()}</Badge>
        </div>
        <DatePicker
          label="Allowed window: ±5 / +14 days"
          value={date}
          onChange={setDate}
          minDate={minDate}
          maxDate={maxDate}
          hint="Only dates within the permitted range are selectable."
        />
      </div>
    );
  },
};

// ─── Past only / Future only ──────────────────────────────────

export const PastDatesOnly: Story = {
  name: 'Past Dates Only',
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div style={{ width: 280 }}>
        <DatePicker
          label="Date of birth"
          placeholder="Select past date"
          value={date}
          onChange={setDate}
          maxDate={new Date()}
          hint="Cannot select future dates."
        />
      </div>
    );
  },
};

export const FutureDatesOnly: Story = {
  name: 'Future Dates Only',
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div style={{ width: 280 }}>
        <DatePicker
          label="Renewal date"
          placeholder="Select future date"
          value={date}
          onChange={setDate}
          minDate={new Date()}
          hint="Cannot select past dates."
        />
      </div>
    );
  },
};

// ─── Sizes ────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => {
    const [d1, setD1] = useState<Date | null>(null);
    const [d2, setD2] = useState<Date | null>(null);
    const [d3, setD3] = useState<Date | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 300 }}>
        <DatePicker size="sm" label="Small"  value={d1} onChange={setD1} placeholder="Small (sm)"  />
        <DatePicker size="md" label="Medium" value={d2} onChange={setD2} placeholder="Medium (md)" />
        <DatePicker size="lg" label="Large"  value={d3} onChange={setD3} placeholder="Large (lg)"  />
      </div>
    );
  },
};

// ─── States ───────────────────────────────────────────────────

export const WithError: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div style={{ width: 280 }}>
        <DatePicker
          label="Start date"
          value={date}
          onChange={setDate}
          error={!date ? 'Start date is required.' : undefined}
          placeholder="Required field"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Locked date', placeholder: 'Cannot be changed' },
  render: args => (
    <div style={{ width: 280 }}>
      <DatePicker {...args} value={new Date(2025, 3, 20)} />
    </div>
  ),
};

export const WithoutFooter: Story = {
  name: 'No Footer',
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div style={{ width: 280 }}>
        <DatePicker label="Quick pick" value={date} onChange={setDate} showFooter={false} />
      </div>
    );
  },
};

export const WithWeekends: Story = {
  name: 'Highlighted Weekends',
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div style={{ width: 280 }}>
        <DatePicker
          label="Pick any day"
          value={date}
          onChange={setDate}
          highlightWeekends
          hint="Weekends are highlighted in violet."
        />
      </div>
    );
  },
};

// ─── Month/Year navigation ────────────────────────────────────

export const PastMonthNavigation: Story = {
  name: 'Jump to Past Month/Year',
  render: () => {
    const [date, setDate] = useState<Date | null>(null);
    const currentYear  = new Date().getFullYear();

    const quarters = [
      { label: `Q1 ${currentYear}`,   date: new Date(currentYear, 0,  1) },
      { label: `Q2 ${currentYear}`,   date: new Date(currentYear, 3,  1) },
      { label: `Q3 ${currentYear}`,   date: new Date(currentYear, 6,  1) },
      { label: `Q4 ${currentYear}`,   date: new Date(currentYear, 9,  1) },
      { label: `Q1 ${currentYear-1}`, date: new Date(currentYear-1, 0, 1) },
      { label: `Q2 ${currentYear-1}`, date: new Date(currentYear-1, 3, 1) },
    ];

    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 140 }}>
          <p style={{ margin: '0 0 8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Jump to quarter</p>
          {quarters.map(q => (
            <Button
              key={q.label}
              size="xs"
              variant={date && q.date.getMonth() === date.getMonth() && q.date.getFullYear() === date.getFullYear() ? 'primary' : 'ghost'}
              onClick={() => setDate(q.date)}
              fullWidth
            >
              {q.label}
            </Button>
          ))}
        </div>
        <div style={{ width: 280 }}>
          <DatePicker
            label="Report period start"
            value={date}
            onChange={setDate}
            placeholder="Select start of quarter"
            hint="Click month/year in header to navigate quickly."
          />
        </div>
      </div>
    );
  },
};

// ─── Date + Time with preset times ───────────────────────────

export const ScheduleWithTime: Story = {
  name: 'Schedule with Time Presets',
  render: () => {
    const [date, setDate] = useState<Date | null>(null);

    const timePresets = [
      { label: '9:00 AM',  h: 9,  m: 0  },
      { label: '12:00 PM', h: 12, m: 0  },
      { label: '3:00 PM',  h: 15, m: 0  },
      { label: '5:30 PM',  h: 17, m: 30 },
      { label: '9:00 PM',  h: 21, m: 0  },
    ];

    const setTime = (h: number, m: number) => {
      const d = date ? new Date(date) : new Date();
      d.setHours(h); d.setMinutes(m); d.setSeconds(0);
      setDate(d);
    };

    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ width: 300 }}>
          <DatePicker
            mode="datetime"
            label="Meeting time"
            value={date}
            onChange={setDate}
            placeholder="Schedule a meeting"
            minDate={new Date()}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 100 }}>
          <p style={{ margin: '0 0 8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick times</p>
          {timePresets.map(p => {
            const isActive = date && date.getHours() === p.h && date.getMinutes() === p.m;
            return (
              <Button
                key={p.label}
                size="xs"
                variant={isActive ? 'primary' : 'ghost'}
                onClick={() => setTime(p.h, p.m)}
                fullWidth
              >
                {p.label}
              </Button>
            );
          })}
        </div>
      </div>
    );
  },
};

// ─── Form usage ───────────────────────────────────────────────

export const InForm: Story = {
  name: 'In a Form',
  render: () => {
    const [start, setStart] = useState<Date | null>(null);
    const [end,   setEnd]   = useState<Date | null>(null);

    const isValid = !!start && !!end && end >= start;

    return (
      <div style={{ width: 360, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Create campaign</h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Set the campaign start and end dates.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <DatePicker
            label="Start date"
            value={start}
            onChange={setStart}
            minDate={new Date()}
            placeholder="Campaign begins"
          />
          <DatePicker
            label="End date"
            value={end}
            onChange={setEnd}
            minDate={start ?? new Date()}
            placeholder="Campaign ends"
            error={start && end && end < start ? 'End must be after start date.' : undefined}
          />
        </div>

        {start && end && isValid && (
          <div style={{ padding: 12, background: 'var(--success-bg)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 8 }}>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--success-lt)' }}>
              Duration: <strong>{Math.round((end.getTime() - start.getTime()) / 86400000)} days</strong>
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" size="sm" fullWidth>Cancel</Button>
          <Button variant="primary" size="sm" fullWidth disabled={!isValid}>Launch campaign</Button>
        </div>
      </div>
    );
  },
};

// ─── All modes side by side ────────────────────────────────────

export const AllModes: Story = {
  name: 'All Modes',
  render: () => {
    const [d1, setD1] = useState<Date | null>(null);
    const [d2, setD2] = useState<Date | null>(null);

    return (
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ width: 280 }}>
          <p style={{ margin: '0 0 10px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date only</p>
          <DatePicker mode="date"     label="Date"      value={d1} onChange={setD1} />
        </div>
        <div style={{ width: 300 }}>
          <p style={{ margin: '0 0 10px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date + Time</p>
          <DatePicker mode="datetime" label="Date & Time" value={d2} onChange={setD2} />
        </div>
      </div>
    );
  },
};
