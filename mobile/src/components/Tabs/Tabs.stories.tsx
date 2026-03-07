import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Tabs, TabPanel } from './Tabs';
import { Text } from '../Text/Text';
import { colors } from '../../tokens';

const tabItems = [
  { id: 'overview',  label: 'Overview' },
  { id: 'analytics', label: 'Analytics', badge: 'New' },
  { id: 'settings',  label: 'Settings' },
];

const meta: Meta<typeof Tabs> = {
  title:     'Components/Tabs',
  component: Tabs,
  tags:      ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['line','pill','enclosed'] },
  },
  args: {
    variant: 'line',
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: colors.bgBase }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Line: Story = {
  render: () => (
    <View style={{ backgroundColor: colors.bgBase, padding: 24 }}>
      <Tabs items={tabItems} variant="line">
        <TabPanel id="overview">
          <Text variant="body" color="secondary">Overview content goes here.</Text>
        </TabPanel>
        <TabPanel id="analytics">
          <Text variant="body" color="secondary">Analytics dashboard content.</Text>
        </TabPanel>
        <TabPanel id="settings">
          <Text variant="body" color="secondary">Settings panel content.</Text>
        </TabPanel>
      </Tabs>
    </View>
  ),
};

export const Pill: Story = {
  render: () => (
    <View style={{ backgroundColor: colors.bgBase, padding: 24 }}>
      <Tabs items={tabItems} variant="pill">
        <TabPanel id="overview">
          <Text variant="body" color="secondary">Overview content goes here.</Text>
        </TabPanel>
        <TabPanel id="analytics">
          <Text variant="body" color="secondary">Analytics dashboard content.</Text>
        </TabPanel>
        <TabPanel id="settings">
          <Text variant="body" color="secondary">Settings panel content.</Text>
        </TabPanel>
      </Tabs>
    </View>
  ),
};

export const Enclosed: Story = {
  render: () => (
    <View style={{ backgroundColor: colors.bgBase, padding: 24 }}>
      <Tabs items={tabItems} variant="enclosed">
        <TabPanel id="overview">
          <Text variant="body" color="secondary">Overview content goes here.</Text>
        </TabPanel>
        <TabPanel id="analytics">
          <Text variant="body" color="secondary">Analytics dashboard content.</Text>
        </TabPanel>
        <TabPanel id="settings">
          <Text variant="body" color="secondary">Settings panel content.</Text>
        </TabPanel>
      </Tabs>
    </View>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [active, setActive] = useState('overview');
    return (
      <View style={{ backgroundColor: colors.bgBase, padding: 24 }}>
        <Tabs items={tabItems} variant="pill" active={active} onChange={setActive}>
          <TabPanel id="overview">
            <Text variant="body" color="secondary">Overview content.</Text>
          </TabPanel>
          <TabPanel id="analytics">
            <Text variant="body" color="secondary">Analytics content.</Text>
          </TabPanel>
          <TabPanel id="settings">
            <Text variant="body" color="secondary">Settings content.</Text>
          </TabPanel>
        </Tabs>
      </View>
    );
  },
};
