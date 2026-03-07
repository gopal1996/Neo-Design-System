import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Typography';

const meta: Meta<typeof Text> = {
  title:     'Components/Typography',
  component: Text,
  tags:      ['autodocs'],
  argTypes: {
    variant:  { control: 'select', options: ['display','h1','h2','h3','h4','h5','body-lg','body','body-sm','caption','overline','mono'] },
    color:    { control: 'select', options: ['primary','secondary','tertiary','brand','success','warning','error','info'] },
    gradient: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: { children: 'The quick brown fox jumps over the lazy dog', variant: 'body' },
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Body: Story = {};

export const Display: Story = {
  args: { variant: 'display', children: 'Build the future.' },
};

export const GradientDisplay: Story = {
  args: { variant: 'display', children: 'Build the future.', gradient: true },
};

export const Headings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Text variant="display">Display — Ship faster.</Text>
      <Text variant="h1">H1 — Product Analytics</Text>
      <Text variant="h2">H2 — Your workspace</Text>
      <Text variant="h3">H3 — Recent activity</Text>
      <Text variant="h4">H4 — Usage summary</Text>
      <Text variant="h5">H5 — Last 30 days</Text>
    </div>
  ),
};

export const BodyVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
      <Text variant="body-lg">Body LG — Lead text for landing pages and feature descriptions with slightly larger size.</Text>
      <Text variant="body">Body — The standard paragraph style used throughout the application.</Text>
      <Text variant="body-sm">Body SM — Secondary body text, perfect for metadata, descriptions, and supporting info.</Text>
      <Text variant="caption">Caption — Captions, timestamps, and helper labels.</Text>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {(['primary','secondary','tertiary','brand','success','warning','error','info'] as const).map(c => (
        <Text key={c} variant="body" color={c}>{c.charAt(0).toUpperCase() + c.slice(1)} — color variant</Text>
      ))}
    </div>
  ),
};

export const GradientText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Text variant="display" gradient>Ship faster.</Text>
      <Text variant="h1" gradient>Modern infrastructure</Text>
      <Text variant="h2" gradient>Built for scale</Text>
    </div>
  ),
};

export const Overline: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Text variant="overline" color="brand">Section label</Text>
      <Text variant="h2">The headline follows</Text>
    </div>
  ),
};

export const Mono: Story = {
  args: { variant: 'mono', children: 'const nexus = { palette: "violet" };' },
};
