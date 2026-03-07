import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Spinner } from './Spinner';
import { colors } from '../../tokens';

const meta: Meta<typeof Spinner> = {
  title:     'Components/Spinner',
  component: Spinner,
  tags:      ['autodocs'],
  argTypes: {
    size:    { control: 'select', options: ['xs','sm','md','lg','xl'] },
    variant: { control: 'select', options: ['ring','dots','pulse'] },
  },
  args: {
    size:    'md',
    variant: 'ring',
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 40, backgroundColor: colors.bgBase, alignItems: 'center', justifyContent: 'center' }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Ring: Story = {
  args: { variant: 'ring', size: 'md' },
};

export const Dots: Story = {
  args: { variant: 'dots', size: 'md' },
};

export const Pulse: Story = {
  args: { variant: 'pulse', size: 'md' },
};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 24, padding: 40, backgroundColor: colors.bgBase, alignItems: 'center', justifyContent: 'center' }}>
      {(['xs','sm','md','lg','xl'] as const).map(s => (
        <Spinner key={s} variant="ring" size={s} />
      ))}
    </View>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 32, padding: 40, backgroundColor: colors.bgBase, alignItems: 'center', justifyContent: 'center' }}>
      <Spinner variant="ring"  size="lg" />
      <Spinner variant="dots"  size="lg" />
      <Spinner variant="pulse" size="lg" />
    </View>
  ),
};
