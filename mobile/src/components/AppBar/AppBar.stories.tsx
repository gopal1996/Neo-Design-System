import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { AppBar, AppBarBackButton, AppBarAction } from './AppBar';
import { colors } from '../../tokens';

const BellIcon = () => (
  <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: colors.textSecondary, borderBottomWidth: 0 }} />
    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textSecondary, marginTop: -2 }} />
  </View>
);

const SearchIcon = () => (
  <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: colors.textSecondary }} />
    <View style={{ width: 5, height: 2, backgroundColor: colors.textSecondary, position: 'absolute', bottom: 4, right: 4, transform: [{ rotate: '45deg' }] }} />
  </View>
);

const meta: Meta<typeof AppBar> = {
  title:     'Components/AppBar',
  component: AppBar,
  tags:      ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default','transparent','elevated'] },
  },
  args: {
    title:   'Page Title',
    variant: 'default',
  },
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: colors.bgBase }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof AppBar>;

export const Default: Story = {
  args: { title: 'Dashboard' },
};

export const WithBackButton: Story = {
  args: {
    title: 'Settings',
    left:  <AppBarBackButton onPress={() => {}} />,
  },
};

export const WithActions: Story = {
  args: {
    title: 'Notifications',
    left:  <AppBarBackButton onPress={() => {}} />,
    right: (
      <View style={{ flexDirection: 'row', gap: 4 }}>
        <AppBarAction icon={<SearchIcon />} onPress={() => {}} accessibilityLabel="Search" />
        <AppBarAction icon={<BellIcon />}  onPress={() => {}} accessibilityLabel="Notifications" badge={3} />
      </View>
    ),
  },
};

export const WithSubtitle: Story = {
  args: {
    title:    'Project Alpha',
    subtitle: '12 members · Last updated 2h ago',
    left:     <AppBarBackButton onPress={() => {}} />,
  },
};

export const Elevated: Story = {
  args: {
    title:   'Elevated AppBar',
    variant: 'elevated',
    left:    <AppBarBackButton onPress={() => {}} />,
  },
};

export const Transparent: Story = {
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: colors.violet600 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    title:   'Transparent',
    variant: 'transparent',
    left:    <AppBarBackButton onPress={() => {}} />,
  },
};
