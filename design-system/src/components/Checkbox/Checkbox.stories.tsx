import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title:     'Components/Checkbox',
  component: Checkbox,
  tags:      ['autodocs'],
  argTypes: {
    size:          { control: 'select', options: ['sm','md','lg'] },
    disabled:      { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    label:         { control: 'text' },
    description:   { control: 'text' },
    error:         { control: 'text' },
  },
  args: { label: 'Checkbox label', size: 'md' },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: args => {
    const [checked, setChecked] = useState(false);
    return <Checkbox {...args} checked={checked} onChange={e => setChecked(e.target.checked)} />;
  },
};

export const Checked: Story = {
  args: { checked: true, label: 'Checked' },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Partial selection' },
};

export const WithDescription: Story = {
  render: args => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={e => setChecked(e.target.checked)}
        label="Accept terms & conditions"
        description="By checking this you agree to our terms of service and privacy policy."
      />
    );
  },
};

export const WithError: Story = {
  args: { label: 'I agree to the terms', error: 'You must accept the terms to continue.' },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox disabled label="Disabled unchecked" />
      <Checkbox disabled checked label="Disabled checked" />
      <Checkbox disabled indeterminate label="Disabled indeterminate" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => {
    const [sm, setSm] = useState(true);
    const [md, setMd] = useState(true);
    const [lg, setLg] = useState(true);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Checkbox size="sm" checked={sm} onChange={e => setSm(e.target.checked)} label="Small" />
        <Checkbox size="md" checked={md} onChange={e => setMd(e.target.checked)} label="Medium" />
        <Checkbox size="lg" checked={lg} onChange={e => setLg(e.target.checked)} label="Large" />
      </div>
    );
  },
};

export const SelectAll: Story = {
  render: () => {
    const items = ['Dashboard access', 'Analytics', 'Billing management', 'User management'];
    const [selected, setSelected] = useState<string[]>(['Dashboard access']);
    const allSelected  = selected.length === items.length;
    const someSelected = selected.length > 0 && !allSelected;

    const toggle = (item: string) =>
      setSelected(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 280 }}>
        <Checkbox
          label="Select all permissions"
          checked={allSelected}
          indeterminate={someSelected}
          onChange={() => setSelected(allSelected ? [] : [...items])}
        />
        <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(item => (
            <Checkbox
              key={item}
              label={item}
              size="sm"
              checked={selected.includes(item)}
              onChange={() => toggle(item)}
            />
          ))}
        </div>
      </div>
    );
  },
};
