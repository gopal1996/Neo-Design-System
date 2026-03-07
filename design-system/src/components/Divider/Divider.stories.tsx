import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';
import { Button } from '../Button/Button';

const meta: Meta<typeof Divider> = {
  title:     'Components/Divider',
  component: Divider,
  tags:      ['autodocs'],
  argTypes: {
    variant:     { control: 'select', options: ['default','subtle','strong','brand'] },
    orientation: { control: 'select', options: ['horizontal','vertical'] },
    labelAlign:  { control: 'select', options: ['left','center','right'] },
    spacing:     { control: 'select', options: ['sm','md','lg'] },
    label:       { control: 'text' },
  },
  args: { variant: 'default', spacing: 'md' },
  decorators: [Story => <div style={{ width: 400, padding: 24 }}><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof Divider>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {(['default','subtle','strong','brand'] as const).map(v => (
        <div key={v}>
          <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{v}</p>
          <Divider variant={v} />
        </div>
      ))}
    </div>
  ),
};

export const WithLabel: Story = {
  args: { label: 'or continue with' },
};

export const LabelAlignments: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <Divider label="Left aligned"   labelAlign="left"   />
      <Divider label="Center aligned" labelAlign="center" />
      <Divider label="Right aligned"  labelAlign="right"  />
    </div>
  ),
};

export const BrandLabel: Story = {
  args: { variant: 'brand', label: 'Neo Pro' },
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 40 }}>
      <Button variant="ghost" size="sm">Edit</Button>
      <Divider orientation="vertical" />
      <Button variant="ghost" size="sm">Duplicate</Button>
      <Divider orientation="vertical" />
      <Button variant="ghost" size="sm">Delete</Button>
    </div>
  ),
};

export const InForm: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: 320 }}>
      <Button variant="ghost" fullWidth style={{ border: '1px solid var(--border)', justifyContent: 'center', height: 40, borderRadius: 8 }}>
        Continue with Google
      </Button>
      <Divider label="or" spacing="md" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button variant="primary" fullWidth>Sign up with email</Button>
      </div>
    </div>
  ),
};
