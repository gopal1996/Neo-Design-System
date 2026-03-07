import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Button } from './Button';
import { colors } from '../../tokens';

const meta: Meta<typeof Button> = {
  title:     'Components/Button',
  component: Button,
  tags:      ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary','secondary','ghost','danger','success'] },
    size:    { control: 'select', options: ['xs','sm','md','lg','xl'] },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    variant:  'primary',
    size:     'md',
    loading:  false,
    fullWidth: false,
    children: 'Click me',
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: colors.bgBase, alignItems: 'center' }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete' },
};

export const Success: Story = {
  args: { variant: 'success', children: 'Confirm' },
};

export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Loading...' },
};

export const FullWidth: Story = {
  args: { variant: 'primary', fullWidth: true, children: 'Full Width' },
};

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 12, alignItems: 'flex-start' }}>
      {(['xs','sm','md','lg','xl'] as const).map(size => (
        <Button key={size} variant="primary" size={size}>{size.toUpperCase()}</Button>
      ))}
    </View>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 10, alignItems: 'flex-start' }}>
      {(['primary','secondary','ghost','danger','success'] as const).map(v => (
        <Button key={v} variant={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
      ))}
    </View>
  ),
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: 'Disabled' },
};
