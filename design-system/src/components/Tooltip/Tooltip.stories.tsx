import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';

const meta: Meta<typeof Tooltip> = {
  title:     'Components/Tooltip',
  component: Tooltip,
  tags:      ['autodocs'],
  argTypes: {
    placement: { control: 'select', options: ['top','bottom','left','right'] },
    variant:   { control: 'select', options: ['dark','brand'] },
    delay:     { control: 'number' },
    disabled:  { control: 'boolean' },
    content:   { control: 'text' },
  },
  args: { content: 'This is a tooltip', placement: 'top', variant: 'dark' },
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: args => (
    <Tooltip {...args}>
      <Button variant="secondary">Hover me</Button>
    </Tooltip>
  ),
};

export const Brand: Story = {
  args: { variant: 'brand', content: 'Upgrade to Pro' },
  render: args => (
    <Tooltip {...args}>
      <Badge variant="brand">Pro feature</Badge>
    </Tooltip>
  ),
};

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, padding: 60 }}>
      {(['top','bottom','left','right'] as const).map(p => (
        <div key={p} style={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip content={`Placement: ${p}`} placement={p}>
            <Button variant="ghost" size="sm">{p}</Button>
          </Tooltip>
        </div>
      ))}
    </div>
  ),
};

export const WithRichContent: Story = {
  render: () => (
    <Tooltip
      placement="top"
      maxWidth={280}
      content={
        <span>
          <strong style={{ color: '#fff', display: 'block', marginBottom: 4 }}>Keyboard shortcut</strong>
          Press <kbd style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 4, padding: '1px 5px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>⌘ K</kbd> to open the command palette
        </span>
      }
    >
      <Button variant="ghost" size="sm">⌘ K</Button>
    </Tooltip>
  ),
};

export const OnIcons: Story = {
  render: () => {
    const InfoIcon = () => (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 16, height: 16, color: 'var(--text-tertiary)', cursor: 'help' }}>
        <circle cx="10" cy="10" r="8" />
        <path d="M10 9v5M10 7v.5" strokeLinecap="round" />
      </svg>
    );
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>Monthly revenue</span>
          <Tooltip content="Total recurring revenue across all active subscriptions this month.">
            <span tabIndex={0}><InfoIcon /></span>
          </Tooltip>
        </div>
        <Tooltip content="Delete this record permanently" variant="brand" placement="bottom">
          <button style={{ background:'transparent', border:'none', cursor:'pointer', padding: 6, borderRadius: 6, color:'var(--error)', display:'flex' }}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width:16,height:16 }}><path d="M4 6h12M8 6V4h4v2M5 6l1 10h8l1-10" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </Tooltip>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true, content: "You won't see this" },
  render: args => (
    <Tooltip {...args}>
      <Button variant="ghost">Tooltip disabled</Button>
    </Tooltip>
  ),
};
