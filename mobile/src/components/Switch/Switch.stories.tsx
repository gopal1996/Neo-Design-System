import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Switch } from './Switch';
import { colors } from '../../tokens';

const meta: Meta<typeof Switch> = {
  title:     'Components/Switch',
  component: Switch,
  tags:      ['autodocs'],
  argTypes: {
    size:     { control: 'select', options: ['sm','md','lg'] },
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    size:     'md',
    checked:  false,
    disabled: false,
    label:    'Enable notifications',
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

type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true, label: 'Dark mode' },
};

export const WithHint: Story = {
  args: {
    label:   'Marketing emails',
    hint:    'Receive updates about new features and offers.',
    checked: false,
  },
};

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 24, padding: 24, backgroundColor: colors.bgBase }}>
      {(['sm','md','lg'] as const).map(s => (
        <Switch key={s} size={s} label={`Size ${s}`} defaultChecked={s === 'md'} />
      ))}
    </View>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Unavailable option', checked: true },
};

export const Controlled: Story = {
  render: () => {
    const [on, setOn] = useState(false);
    return (
      <View style={{ padding: 24, backgroundColor: colors.bgBase }}>
        <Switch
          checked={on}
          onChange={setOn}
          label={on ? 'Enabled' : 'Disabled'}
          hint="Tap to toggle"
        />
      </View>
    );
  },
};
