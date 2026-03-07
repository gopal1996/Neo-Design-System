import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Radio } from './Radio';
import { Text } from '../Text/Text';
import { colors } from '../../tokens';

const meta: Meta<typeof Radio> = {
  title:     'Components/Radio',
  component: Radio,
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
    label:    'Option A',
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

type Story = StoryObj<typeof Radio>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true, label: 'Selected option' },
};

export const WithDescription: Story = {
  args: {
    label:       'Standard plan',
    description: '5 GB storage, up to 3 projects, community support.',
  },
};

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 16, padding: 24, backgroundColor: colors.bgBase }}>
      {(['sm','md','lg'] as const).map(s => (
        <Radio key={s} size={s} label={`Size ${s}`} defaultChecked={s === 'md'} />
      ))}
    </View>
  ),
};

export const RadioGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState<string>('starter');
    const options = [
      { value: 'starter', label: 'Starter',     description: 'Free forever. Up to 2 projects.' },
      { value: 'pro',     label: 'Pro',          description: '$12/mo. Unlimited projects.' },
      { value: 'enterprise', label: 'Enterprise', description: 'Custom pricing. SSO + SLA.' },
    ];
    return (
      <View style={{ gap: 16, padding: 24, backgroundColor: colors.bgBase }}>
        <Text variant="h4">Choose a plan</Text>
        {options.map(opt => (
          <Radio
            key={opt.value}
            label={opt.label}
            description={opt.description}
            checked={selected === opt.value}
            onChange={() => setSelected(opt.value)}
          />
        ))}
      </View>
    );
  },
};
