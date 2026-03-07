import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title:     'Components/Badge',
  component: Badge,
  tags:      ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'brand', 'success', 'warning', 'error', 'info', 'outline'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    dot:  { control: 'boolean' },
    children: { control: 'text' },
  },
  args: { children: 'Badge', variant: 'brand', size: 'md' },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { variant: 'default', children: 'Default' } };
export const Brand:   Story = { args: { variant: 'brand',   children: 'Pro' } };
export const Success: Story = { args: { variant: 'success', children: 'Active' } };
export const Warning: Story = { args: { variant: 'warning', children: 'Pending' } };
export const Error:   Story = { args: { variant: 'error',   children: 'Failed' } };
export const Info:    Story = { args: { variant: 'info',    children: 'Beta' } };
export const Outline: Story = { args: { variant: 'outline', children: 'Draft' } };

export const WithDot: Story = {
  args: { variant: 'success', dot: true, children: 'Online' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="brand">Pro</Badge>
      <Badge variant="success" dot>Active</Badge>
      <Badge variant="warning" dot>Pending</Badge>
      <Badge variant="error" dot>Failed</Badge>
      <Badge variant="info">Beta</Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Badge variant="brand" size="sm">Small</Badge>
      <Badge variant="brand" size="md">Medium</Badge>
      <Badge variant="brand" size="lg">Large</Badge>
    </div>
  ),
};
