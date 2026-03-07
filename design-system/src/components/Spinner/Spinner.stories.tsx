import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title:     'Components/Spinner',
  component: Spinner,
  tags:      ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['ring', 'dots', 'pulse'] },
    size:    { control: 'select', options: ['xs','sm','md','lg','xl'] },
  },
  args: { variant: 'ring', size: 'md' },
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Ring:  Story = { args: { variant: 'ring'  } };
export const Dots:  Story = { args: { variant: 'dots'  } };
export const Pulse: Story = { args: { variant: 'pulse' } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      {(['xs','sm','md','lg','xl'] as const).map(s => <Spinner key={s} size={s} />)}
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['ring','dots','pulse'] as const).map(v => (
        <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', width: 40, textTransform: 'capitalize' }}>{v}</span>
          {(['xs','sm','md','lg','xl'] as const).map(s => <Spinner key={s} variant={v} size={s} />)}
        </div>
      ))}
    </div>
  ),
};

export const InlineWithText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        <Spinner size="sm" /> Loading data…
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        <Spinner size="sm" variant="dots" /> Processing payment…
      </div>
    </div>
  ),
};
