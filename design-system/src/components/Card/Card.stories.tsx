import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter } from './Card';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';

const meta: Meta<typeof Card> = {
  title:     'Components/Card',
  component: Card,
  tags:      ['autodocs'],
  argTypes: {
    variant:     { control: 'select', options: ['default', 'elevated', 'brand', 'flat'] },
    padding:     { control: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'] },
    interactive: { control: 'boolean' },
  },
  args: { variant: 'default', padding: 'md' },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: args => (
    <Card {...args} style={{ width: 320 }}>
      <CardHeader>
        <div>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Card Title</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>Subtitle text</p>
        </div>
        <Badge variant="brand">New</Badge>
      </CardHeader>
      <CardBody>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
          Card body content goes here. This is a standard surface for grouping related information.
        </p>
      </CardBody>
      <CardFooter>
        <Button variant="ghost" size="sm">Cancel</Button>
        <Button variant="primary" size="sm">Confirm</Button>
      </CardFooter>
    </Card>
  ),
};

export const Elevated: Story = {
  args: { variant: 'elevated' },
  render: args => (
    <Card {...args} style={{ width: 320, padding: 24 }}>
      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Elevated card with deeper shadow.</p>
    </Card>
  ),
};

export const Brand: Story = {
  args: { variant: 'brand' },
  render: args => (
    <Card {...args} style={{ width: 320, padding: 24 }}>
      <p style={{ fontWeight: 600, color: 'var(--violet-200)', marginBottom: 8 }}>Pro Plan</p>
      <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>Violet-tinted brand surface for highlights, CTAs, and featured content.</p>
    </Card>
  ),
};

export const Interactive: Story = {
  args: { interactive: true },
  render: args => (
    <div style={{ display: 'flex', gap: 16 }}>
      {['Analytics', 'Billing', 'Settings'].map(name => (
        <Card key={name} {...args} style={{ width: 160, padding: 20, cursor: 'pointer' }}>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{name}</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>Click me</p>
        </Card>
      ))}
    </div>
  ),
};

export const MetricCards: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {[
        { label: 'Monthly Revenue', value: '$48,200', change: '+12.5%', positive: true },
        { label: 'Active Users',    value: '8,342',   change: '+4.1%',  positive: true },
        { label: 'Churn Rate',      value: '2.3%',    change: '-0.4%',  positive: false },
      ].map(m => (
        <Card key={m.label} style={{ width: 200 }} padding="lg">
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>{m.label}</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.03em' }}>{m.value}</p>
          <Badge variant={m.positive ? 'success' : 'error'} dot>{m.change}</Badge>
        </Card>
      ))}
    </div>
  ),
};
