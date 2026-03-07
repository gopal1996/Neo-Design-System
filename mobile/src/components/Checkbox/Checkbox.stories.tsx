import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Checkbox } from './Checkbox';
import { colors } from '../../tokens';

const meta: Meta<typeof Checkbox> = {
  title:     'Components/Checkbox',
  component: Checkbox,
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
    label:    'Accept terms and conditions',
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

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true, label: 'Already checked' },
};

export const WithDescription: Story = {
  args: {
    label:       'Marketing emails',
    description: 'Receive updates about new features, product announcements, and offers.',
  },
};

export const WithError: Story = {
  args: {
    label: 'I agree to the terms',
    error: 'You must accept the terms to continue.',
  },
};

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 16, padding: 24, backgroundColor: colors.bgBase }}>
      {(['sm','md','lg'] as const).map(s => (
        <Checkbox key={s} size={s} label={`Size ${s}`} defaultChecked />
      ))}
    </View>
  ),
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Select all (3 of 7)' },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <View style={{ padding: 24, backgroundColor: colors.bgBase }}>
        <Checkbox
          checked={checked}
          onChange={setChecked}
          label={checked ? 'Checked' : 'Unchecked'}
          description="Tap to toggle"
        />
      </View>
    );
  },
};
