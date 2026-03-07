import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Banner } from './Banner';
import { colors } from '../../tokens';

const meta: Meta<typeof Banner> = {
  title:     'Components/Banner',
  component: Banner,
  tags:      ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info','success','warning','error'] },
  },
  args: {
    variant:     'info',
    description: 'This is an informational banner with useful context.',
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

type Story = StoryObj<typeof Banner>;

export const Info: Story = {
  args: {
    variant:     'info',
    title:       'New update available',
    description: 'Version 3.2.0 includes performance improvements and bug fixes.',
  },
};

export const Success: Story = {
  args: {
    variant:     'success',
    title:       'Payment confirmed',
    description: 'Your subscription has been activated. Enjoy all Pro features.',
  },
};

export const Warning: Story = {
  args: {
    variant:     'warning',
    title:       'Storage almost full',
    description: 'You have used 90% of your 5 GB storage. Upgrade to avoid disruptions.',
  },
};

export const Error: Story = {
  args: {
    variant:     'error',
    title:       'Sync failed',
    description: 'Could not connect to the server. Check your connection and retry.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 16, padding: 24, backgroundColor: colors.bgBase }}>
      <Banner variant="info"    title="Info"    description="An informational message for the user." />
      <Banner variant="success" title="Success" description="Your changes have been saved successfully." />
      <Banner variant="warning" title="Warning" description="This action may have unintended consequences." />
      <Banner variant="error"   title="Error"   description="Something went wrong. Please try again." />
    </View>
  ),
};

export const WithActions: Story = {
  args: {
    variant:     'warning',
    title:       'Storage almost full',
    description: 'You have used 90% of your 5 GB storage.',
    action:          { label: 'Upgrade', onPress: () => {} },
    secondaryAction: { label: 'Dismiss', onPress: () => {} },
  },
};

export const Dismissible: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);
    if (!visible) return (
      <View style={{ padding: 24, backgroundColor: colors.bgBase }} />
    );
    return (
      <View style={{ padding: 24, backgroundColor: colors.bgBase }}>
        <Banner
          variant="info"
          title="Tip"
          description="You can dismiss this banner by pressing the close button."
          onDismiss={() => setVisible(false)}
        />
      </View>
    );
  },
};
