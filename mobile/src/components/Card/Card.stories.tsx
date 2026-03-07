import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Card, CardHeader, CardBody, CardFooter } from './Card';
import { Text } from '../Text/Text';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { colors } from '../../tokens';

const meta: Meta<typeof Card> = {
  title:     'Components/Card',
  component: Card,
  tags:      ['autodocs'],
  argTypes: {
    variant:     { control: 'select', options: ['default','elevated','brand','flat'] },
    padding:     { control: 'select', options: ['none','sm','md','lg','xl'] },
    interactive: { control: 'boolean' },
  },
  args: {
    variant:     'default',
    padding:     'md',
    interactive: false,
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

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <Text variant="body" color="secondary">This is a default card with some content.</Text>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 16, backgroundColor: colors.bgBase, padding: 24 }}>
      {(['default','elevated','brand','flat'] as const).map(v => (
        <Card key={v} variant={v} padding="md">
          <Text variant="h4">{v.charAt(0).toUpperCase() + v.slice(1)} Card</Text>
          <Text variant="body-sm" color="secondary" style={{ marginTop: 4 }}>
            Variant: {v}
          </Text>
        </Card>
      ))}
    </View>
  ),
};

export const WithSections: Story = {
  render: () => (
    <Card variant="default" padding="none" style={{ margin: 24 }}>
      <CardHeader>
        <View style={{ flex: 1 }}>
          <Text variant="h4">Project Alpha</Text>
        </View>
        <Badge variant="success" dot>Active</Badge>
      </CardHeader>
      <CardBody>
        <Text variant="body-sm" color="secondary">
          A full-stack dashboard for tracking project metrics, team velocity, and deployment pipelines in real time.
        </Text>
      </CardBody>
      <CardFooter>
        <Button variant="ghost" size="sm">Cancel</Button>
        <Button variant="primary" size="sm">View details</Button>
      </CardFooter>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card variant="default" interactive padding="lg" style={{ margin: 24 }} onPress={() => {}}>
      <Text variant="h4">Tap me</Text>
      <Text variant="body-sm" color="secondary" style={{ marginTop: 4 }}>This card is interactive.</Text>
    </Card>
  ),
};

export const BrandCard: Story = {
  render: () => (
    <Card variant="brand" padding="lg" style={{ margin: 24 }}>
      <Text variant="h3">Neo Pro</Text>
      <Text variant="body" color="secondary" style={{ marginTop: 8 }}>
        Unlock advanced components, priority support, and unlimited projects.
      </Text>
      <View style={{ marginTop: 16 }}>
        <Button variant="primary" size="md">Upgrade now</Button>
      </View>
    </Card>
  ),
};
