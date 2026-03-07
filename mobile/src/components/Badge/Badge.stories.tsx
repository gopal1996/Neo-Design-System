import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Badge } from './Badge';
import { colors } from '../../tokens';

const meta: Meta<typeof Badge> = {
  title:     'Components/Badge',
  component: Badge,
  tags:      ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default','brand','success','warning','error','info','outline'] },
    size:    { control: 'select', options: ['sm','md','lg'] },
    dot:     { control: 'boolean' },
  },
  args: {
    variant:  'default',
    size:     'md',
    dot:      false,
    children: 'Badge',
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

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 10, padding: 24, backgroundColor: colors.bgBase, flexDirection: 'row', flexWrap: 'wrap' }}>
      {(['default','brand','success','warning','error','info','outline'] as const).map(v => (
        <Badge key={v} variant={v}>{v}</Badge>
      ))}
    </View>
  ),
};

export const WithDot: Story = {
  render: () => (
    <View style={{ gap: 10, padding: 24, backgroundColor: colors.bgBase, flexDirection: 'row', flexWrap: 'wrap' }}>
      {(['default','brand','success','warning','error','info'] as const).map(v => (
        <Badge key={v} variant={v} dot>{v}</Badge>
      ))}
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 10, padding: 24, backgroundColor: colors.bgBase, flexDirection: 'row', alignItems: 'center' }}>
      {(['sm','md','lg'] as const).map(s => (
        <Badge key={s} variant="brand" size={s}>{s.toUpperCase()}</Badge>
      ))}
    </View>
  ),
};

export const Brand: Story = {
  args: { variant: 'brand', children: 'Neo Pro', dot: true },
};
