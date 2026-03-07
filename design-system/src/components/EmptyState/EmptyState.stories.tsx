import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState, EmptyStateIcons } from './EmptyState';
import { Button } from '../Button/Button';

const meta: Meta<typeof EmptyState> = {
  title:     'Components/EmptyState',
  component: EmptyState,
  tags:      ['autodocs'],
  argTypes: {
    size:    { control: 'select', options: ['sm','md','lg'] },
    variant: { control: 'select', options: ['default','brand','muted'] },
    title:   { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    title:       'Nothing here yet',
    description: 'Get started by creating your first item.',
    size:        'md',
    variant:     'default',
  },
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: { icon: EmptyStateIcons.data },
};

export const WithAction: Story = {
  args: {
    icon:    EmptyStateIcons.inbox,
    title:   'Your inbox is empty',
    description: 'When you receive messages they will appear here.',
    action:  <Button variant="primary" size="sm">Invite teammates</Button>,
  },
};

export const WithTwoActions: Story = {
  args: {
    icon:        EmptyStateIcons.folder,
    title:       'No projects yet',
    description: 'Create your first project to get started with Neo.',
    action:      <Button variant="primary" size="sm">New project</Button>,
    secondaryAction: <Button variant="ghost" size="sm">Import existing</Button>,
  },
};

export const SearchEmpty: Story = {
  args: {
    icon:        EmptyStateIcons.search,
    title:       'No results found',
    description: 'Try adjusting your search or filter to find what you\'re looking for.',
    action:      <Button variant="secondary" size="sm">Clear filters</Button>,
  },
};

export const ErrorState: Story = {
  args: {
    icon:        EmptyStateIcons.error,
    title:       'Something went wrong',
    description: 'We couldn\'t load your data. Please try again.',
    action:      <Button variant="primary" size="sm">Retry</Button>,
    secondaryAction: <Button variant="ghost" size="sm">Contact support</Button>,
  },
};

export const NoUsers: Story = {
  args: {
    icon:        EmptyStateIcons.users,
    title:       'No team members',
    description: 'Invite your team to collaborate on projects together.',
    action:      <Button variant="primary" size="sm">Invite member</Button>,
    variant:     'brand',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {(['sm','md','lg'] as const).map(size => (
        <div key={size} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <p style={{ margin: '16px 24px 0', fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Size: {size}</p>
          <EmptyState
            size={size}
            icon={EmptyStateIcons.data}
            title="No data available"
            description="Data will appear here once it's created."
            action={<Button variant="primary" size="sm">Add data</Button>}
          />
        </div>
      ))}
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: 16, overflow: 'hidden', width: 480,
    }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Recent activity</span>
        <Button variant="ghost" size="xs">View all</Button>
      </div>
      <EmptyState
        size="sm"
        icon={EmptyStateIcons.inbox}
        title="No activity yet"
        description="Actions taken in your workspace will appear here."
      />
    </div>
  ),
};
