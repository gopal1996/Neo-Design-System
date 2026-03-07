import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Avatar, AvatarGroup } from './Avatar';
import { colors } from '../../tokens';

const meta: Meta<typeof Avatar> = {
  title:     'Components/Avatar',
  component: Avatar,
  tags:      ['autodocs'],
  argTypes: {
    size:   { control: 'select', options: ['xs','sm','md','lg','xl','2xl'] },
    status: { control: 'select', options: [undefined,'online','offline','busy','away'] },
  },
  args: {
    name:   'Alex Kim',
    size:   'md',
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: colors.bgBase, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const WithStatus: Story = {
  args: { name: 'Alex Kim', status: 'online' },
};

export const AllSizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12, padding: 24, backgroundColor: colors.bgBase }}>
      {(['xs','sm','md','lg','xl','2xl'] as const).map(s => (
        <Avatar key={s} name="Alex Kim" size={s} />
      ))}
    </View>
  ),
};

export const Statuses: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, padding: 24, backgroundColor: colors.bgBase }}>
      <Avatar name="Online"  size="lg" status="online"  />
      <Avatar name="Offline" size="lg" status="offline" />
      <Avatar name="Busy"    size="lg" status="busy"    />
      <Avatar name="Away"    size="lg" status="away"    />
    </View>
  ),
};

export const Group: Story = {
  render: () => (
    <View style={{ padding: 24, backgroundColor: colors.bgBase }}>
      <AvatarGroup
        size="md"
        avatars={[
          { name: 'Alex Kim' },
          { name: 'Sam Chen' },
          { name: 'Jordan Lee' },
          { name: 'Riley Park' },
          { name: 'Casey Morgan' },
          { name: 'Taylor Swift' },
        ]}
        max={4}
      />
    </View>
  ),
};
