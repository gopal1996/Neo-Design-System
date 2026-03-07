import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarGroup } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title:     'Components/Avatar',
  component: Avatar,
  tags:      ['autodocs'],
  argTypes: {
    size:   { control: 'select', options: ['xs','sm','md','lg','xl','2xl'] },
    status: { control: 'select', options: [undefined,'online','offline','busy','away'] },
    name:   { control: 'text' },
    src:    { control: 'text' },
  },
  args: { name: 'Jordan Lee', size: 'md' },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Initials: Story = {};

export const WithImage: Story = {
  args: {
    src:  'https://i.pravatar.cc/150?img=12',
    alt:  'User avatar',
    name: undefined,
  },
};

export const WithStatus: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar name="Alex Kim"   size="lg" status="online"  />
      <Avatar name="Sam Rivera" size="lg" status="busy"    />
      <Avatar name="Morgan Lee" size="lg" status="away"    />
      <Avatar name="Jamie Doe"  size="lg" status="offline" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Avatar name="A B" size="xs" />
      <Avatar name="A B" size="sm" />
      <Avatar name="A B" size="md" />
      <Avatar name="A B" size="lg" />
      <Avatar name="A B" size="xl" />
      <Avatar name="A B" size="2xl" />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup
      size="md"
      max={4}
      avatars={[
        { name: 'Alice Tran' },
        { name: 'Bob Smith' },
        { name: 'Carol Wu' },
        { name: 'David Park' },
        { name: 'Eva Müller' },
        { name: 'Frank Diaz' },
      ]}
    />
  ),
};

export const Placeholder: Story = {
  args: { name: undefined, src: undefined },
};
