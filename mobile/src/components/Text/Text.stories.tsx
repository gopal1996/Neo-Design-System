import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Text } from './Text';
import { colors } from '../../tokens';

const meta: Meta<typeof Text> = {
  title:     'Components/Text',
  component: Text,
  tags:      ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['display','h1','h2','h3','h4','h5','body-lg','body','body-sm','caption','overline','mono'],
    },
    color: {
      control: 'select',
      options: ['primary','secondary','tertiary','brand','success','warning','error','info'],
    },
  },
  args: {
    variant:  'body',
    color:    'primary',
    children: 'The quick brown fox jumps over the lazy dog',
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

type Story = StoryObj<typeof Text>;

export const Default: Story = {};

export const Headings: Story = {
  render: () => (
    <View style={{ gap: 20, backgroundColor: colors.bgBase, padding: 24 }}>
      {(['display','h1','h2','h3','h4','h5'] as const).map(v => (
        <Text key={v} variant={v}>{v} — Neo Design System</Text>
      ))}
    </View>
  ),
};

export const BodyVariants: Story = {
  render: () => (
    <View style={{ gap: 12, backgroundColor: colors.bgBase, padding: 24 }}>
      {(['body-lg','body','body-sm','caption','overline','mono'] as const).map(v => (
        <Text key={v} variant={v}>{v}: The quick brown fox jumps over the lazy dog.</Text>
      ))}
    </View>
  ),
};

export const Colors: Story = {
  render: () => (
    <View style={{ gap: 10, backgroundColor: colors.bgBase, padding: 24 }}>
      {(['primary','secondary','tertiary','brand','success','warning','error','info'] as const).map(c => (
        <Text key={c} variant="body" color={c}>{c} — sample text</Text>
      ))}
    </View>
  ),
};
