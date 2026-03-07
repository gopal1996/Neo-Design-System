import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Input } from './Input';
import { colors } from '../../tokens';

const meta: Meta<typeof Input> = {
  title:     'Components/Input',
  component: Input,
  tags:      ['autodocs'],
  argTypes: {
    size:     { control: 'select', options: ['sm','md','lg'] },
    editable: { control: 'boolean' },
  },
  args: {
    placeholder: 'Enter text…',
    size:        'md',
    editable:    true,
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

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label:       'Email address',
    placeholder: 'you@example.com',
    hint:        "We'll never share your email.",
  },
};

export const WithError: Story = {
  args: {
    label:       'Password',
    placeholder: '••••••••',
    secureTextEntry: true,
    error:       'Password must be at least 8 characters.',
  },
};

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 16, padding: 24, backgroundColor: colors.bgBase }}>
      {(['sm','md','lg'] as const).map(s => (
        <Input key={s} size={s} label={`Size: ${s}`} placeholder="Enter text…" />
      ))}
    </View>
  ),
};

export const Disabled: Story = {
  args: {
    label:       'Disabled field',
    placeholder: 'Cannot edit',
    editable:    false,
    value:       'Read-only value',
  },
};

export const Search: Story = {
  args: {
    placeholder: 'Search…',
    size:        'md',
  },
};
