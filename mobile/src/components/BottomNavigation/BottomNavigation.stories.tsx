import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { BottomNavigation } from './BottomNavigation';
import { colors } from '../../tokens';

/* Simple SVG-free icon components using Views */
const HomeIcon    = (active: boolean) => <IconDot active={active} char="⌂" />;
const ChartIcon   = (active: boolean) => <IconDot active={active} char="↑" />;
const UsersIcon   = (active: boolean) => <IconDot active={active} char="◉" />;
const SettingsIcon = (active: boolean) => <IconDot active={active} char="⚙" />;

const IconDot = ({ active, char }: { active: boolean; char: string }) => (
  <Text style={{ fontSize: 22, color: active ? colors.violet300 : colors.textTertiary, lineHeight: 24, includeFontPadding: false } as any}>
    {char}
  </Text>
);

const navItems = [
  { id: 'home',     label: 'Home',     icon: HomeIcon },
  { id: 'analytics',label: 'Analytics', icon: ChartIcon, badge: 'New' as string },
  { id: 'users',    label: 'Users',    icon: UsersIcon,  badge: 3 },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

const meta: Meta<typeof BottomNavigation> = {
  title:     'Components/BottomNavigation',
  component: BottomNavigation,
  tags:      ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: colors.bgBase }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof BottomNavigation>;

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('home');
    return (
      <BottomNavigation
        items={navItems}
        active={active}
        onChange={setActive}
      />
    );
  },
};

export const WithBadges: Story = {
  render: () => {
    const [active, setActive] = useState('analytics');
    return (
      <BottomNavigation
        items={navItems}
        active={active}
        onChange={setActive}
      />
    );
  },
};

export const AppShell: Story = {
  render: () => {
    const [active, setActive] = useState('home');
    const pages: Record<string, string> = {
      home:      'Home — Dashboard',
      analytics: 'Analytics — Charts',
      users:     'Users — Team',
      settings:  'Settings — Preferences',
    };
    return (
      <View style={{ backgroundColor: colors.bgBase, height: 400 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.textSecondary, fontSize: 16 }}>{pages[active]}</Text>
        </View>
        <BottomNavigation
          items={navItems}
          active={active}
          onChange={setActive}
        />
      </View>
    );
  },
};
