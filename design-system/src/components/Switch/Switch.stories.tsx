import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title:     'Components/Switch',
  component: Switch,
  tags:      ['autodocs'],
  argTypes: {
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    label:    { control: 'text' },
    hint:     { control: 'text' },
  },
  args: { size: 'md' },
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: args => {
    const [on, setOn] = useState(false);
    return <Switch {...args} checked={on} onChange={setOn} />;
  },
};

export const WithLabel: Story = {
  render: args => {
    const [on, setOn] = useState(true);
    return <Switch {...args} checked={on} onChange={setOn} label="Enable notifications" />;
  },
};

export const WithHint: Story = {
  render: args => {
    const [on, setOn] = useState(false);
    return (
      <Switch
        {...args}
        checked={on}
        onChange={setOn}
        label="Marketing emails"
        hint="Receive weekly product updates and tips."
      />
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [sm, setSm] = useState(true);
    const [md, setMd] = useState(true);
    const [lg, setLg] = useState(true);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Switch size="sm" checked={sm} onChange={setSm} label="Small" />
        <Switch size="md" checked={md} onChange={setMd} label="Medium" />
        <Switch size="lg" checked={lg} onChange={setLg} label="Large" />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Switch disabled checked={false} label="Disabled off" />
      <Switch disabled checked={true}  label="Disabled on"  />
    </div>
  ),
};

export const SettingsGroup: Story = {
  render: () => {
    const [state, setState] = useState({ emails: true, push: false, sms: true, marketing: false });
    const toggle = (k: keyof typeof state) => setState(s => ({ ...s, [k]: !s[k] }));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: 360 }}>
        {([
          { key: 'emails',    label: 'Email notifications',  hint: 'Security alerts and account updates' },
          { key: 'push',      label: 'Push notifications',   hint: 'Browser push for real-time alerts' },
          { key: 'sms',       label: 'SMS alerts',           hint: 'Critical alerts via text message' },
          { key: 'marketing', label: 'Marketing emails',     hint: 'Weekly tips and product news' },
        ] as const).map((item, i, arr) => (
          <div key={item.key} style={{
            padding: '16px',
            borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{item.label}</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{item.hint}</p>
            </div>
            <Switch checked={state[item.key]} onChange={() => toggle(item.key)} />
          </div>
        ))}
      </div>
    );
  },
};
