import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Divider } from './Divider';
import { Text } from '../Text/Text';
import { colors } from '../../tokens';

const meta: Meta<typeof Divider> = {
  title:     'Components/Divider',
  component: Divider,
  tags:      ['autodocs'],
  argTypes: {
    variant:     { control: 'select', options: ['default','subtle','strong','brand'] },
    orientation: { control: 'select', options: ['horizontal','vertical'] },
    spacing:     { control: 'select', options: ['sm','md','lg'] },
  },
  args: {
    variant:     'default',
    orientation: 'horizontal',
    spacing:     'md',
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

type Story = StoryObj<typeof Divider>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <View style={{ gap: 0, padding: 24, backgroundColor: colors.bgBase }}>
      {(['default','subtle','strong','brand'] as const).map(v => (
        <View key={v}>
          <Text variant="caption" color="tertiary" style={{ marginBottom: 4 }}>{v}</Text>
          <Divider variant={v} spacing="sm" />
          <View style={{ height: 8 }} />
        </View>
      ))}
    </View>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <View style={{ padding: 24, backgroundColor: colors.bgBase }}>
      <Divider label="or continue with" />
    </View>
  ),
};

export const BrandLabel: Story = {
  render: () => (
    <View style={{ padding: 24, backgroundColor: colors.bgBase }}>
      <Divider variant="brand" label="Neo Pro" />
    </View>
  ),
};

export const LabelAlignments: Story = {
  render: () => (
    <View style={{ gap: 0, padding: 24, backgroundColor: colors.bgBase }}>
      <Divider label="Left aligned"   labelAlign="left"   spacing="sm" />
      <Divider label="Center aligned" labelAlign="center" spacing="sm" />
      <Divider label="Right aligned"  labelAlign="right"  spacing="sm" />
    </View>
  ),
};

export const Vertical: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, height: 40, padding: 24, backgroundColor: colors.bgBase }}>
      <Text variant="body-sm" color="secondary">Edit</Text>
      <Divider orientation="vertical" />
      <Text variant="body-sm" color="secondary">Share</Text>
      <Divider orientation="vertical" />
      <Text variant="body-sm" color="secondary">Delete</Text>
    </View>
  ),
};
