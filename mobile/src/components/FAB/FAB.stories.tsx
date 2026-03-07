import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { FAB } from './FAB';
import { colors } from '../../tokens';

const PlusIcon = ({ color = '#fff' }: { color?: string }) => (
  <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: '70%', height: 2, backgroundColor: color, borderRadius: 1, position: 'absolute' }} />
    <View style={{ width: 2, height: '70%', backgroundColor: color, borderRadius: 1, position: 'absolute' }} />
  </View>
);

const EditIcon = ({ color = '#fff' }: { color?: string }) => (
  <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color, fontSize: 18, lineHeight: 22 }}>✎</Text>
  </View>
);

const meta: Meta<typeof FAB> = {
  title:     'Components/FAB',
  component: FAB,
  tags:      ['autodocs'],
  argTypes: {
    size:    { control: 'select', options: ['sm','md','lg'] },
    variant: { control: 'select', options: ['primary','secondary','surface'] },
    visible: { control: 'boolean' },
  },
  args: {
    size:               'md',
    variant:            'primary',
    visible:            true,
    accessibilityLabel: 'Create new',
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

type Story = StoryObj<typeof FAB>;

export const Primary: Story = {
  args: {
    icon:               <PlusIcon />,
    variant:            'primary',
    accessibilityLabel: 'Add item',
    onPress:            () => {},
  },
};

export const Extended: Story = {
  args: {
    icon:               <PlusIcon />,
    label:              'New project',
    variant:            'primary',
    accessibilityLabel: 'Create new project',
    onPress:            () => {},
  },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 20, padding: 40, backgroundColor: colors.bgBase, alignItems: 'center', flexWrap: 'wrap' }}>
      <FAB icon={<PlusIcon />}        variant="primary"   onPress={() => {}} accessibilityLabel="Primary" />
      <FAB icon={<PlusIcon color={colors.violet300} />} variant="secondary" onPress={() => {}} accessibilityLabel="Secondary" />
      <FAB icon={<PlusIcon color={colors.textSecondary} />} variant="surface" onPress={() => {}} accessibilityLabel="Surface" />
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 20, padding: 40, backgroundColor: colors.bgBase, alignItems: 'center' }}>
      <FAB icon={<PlusIcon />} size="sm" onPress={() => {}} accessibilityLabel="Small" />
      <FAB icon={<PlusIcon />} size="md" onPress={() => {}} accessibilityLabel="Medium" />
      <FAB icon={<PlusIcon />} size="lg" onPress={() => {}} accessibilityLabel="Large" />
    </View>
  ),
};

export const Positioned: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    return (
      <View style={{ width: '100%', height: 280, backgroundColor: colors.bgElevated, borderRadius: 12 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Tapped {count} times</Text>
        </View>
        <View style={{ position: 'absolute', bottom: 16, right: 16 }}>
          <FAB
            icon={<EditIcon />}
            label="Create"
            onPress={() => setCount(c => c + 1)}
            accessibilityLabel="Create item"
          />
        </View>
      </View>
    );
  },
};
