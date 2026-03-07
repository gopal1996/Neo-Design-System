import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabPanel } from './Tabs';
import { Badge } from '../Badge/Badge';

const meta: Meta<typeof Tabs> = {
  title:     'Components/Tabs',
  component: Tabs,
  tags:      ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['line', 'pill', 'enclosed'] },
  },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

const baseTabs = [
  { id: 'overview',  label: 'Overview'  },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings',  label: 'Settings'  },
];

const Content = ({ id }: { id: string }) => (
  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', padding: '4px 0' }}>
    Content for <strong style={{ color: 'var(--text-primary)' }}>{id}</strong> tab.
  </div>
);

export const Line: Story = {
  args: { items: baseTabs, variant: 'line' },
  render: args => (
    <div style={{ width: 480 }}>
      <Tabs {...args}>
        {baseTabs.map(t => <TabPanel key={t.id} id={t.id}><Content id={t.id} /></TabPanel>)}
      </Tabs>
    </div>
  ),
};

export const Pill: Story = {
  args: { items: baseTabs, variant: 'pill' },
  render: args => (
    <div style={{ width: 480 }}>
      <Tabs {...args}>
        {baseTabs.map(t => <TabPanel key={t.id} id={t.id}><Content id={t.id} /></TabPanel>)}
      </Tabs>
    </div>
  ),
};

export const Enclosed: Story = {
  args: { items: baseTabs, variant: 'enclosed' },
  render: args => (
    <div style={{ width: 480 }}>
      <Tabs {...args}>
        {baseTabs.map(t => <TabPanel key={t.id} id={t.id}><Content id={t.id} /></TabPanel>)}
      </Tabs>
    </div>
  ),
};

export const WithIconsAndBadges: Story = {
  render: () => {
    const InboxIcon = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10l2-6h8l2 6H2zM2 10h12v3H2v-3z" strokeLinejoin="round" /></svg>;
    const StarIcon  = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2l1.8 3.6L14 6.3l-3 2.9.7 4.1L8 11.4l-3.7 1.9.7-4.1L2 6.3l4.2-.7L8 2z" strokeLinejoin="round" /></svg>;
    const tabs = [
      { id: 'inbox',    label: 'Inbox',    icon: <InboxIcon />, badge: <Badge variant="error" size="sm">4</Badge> },
      { id: 'starred',  label: 'Starred',  icon: <StarIcon  /> },
      { id: 'archived', label: 'Archived', disabled: true },
    ];
    return (
      <div style={{ width: 480 }}>
        <Tabs items={tabs} variant="pill">
          {tabs.map(t => <TabPanel key={t.id} id={t.id}><Content id={t.id} /></TabPanel>)}
        </Tabs>
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: 480 }}>
      {(['line','pill','enclosed'] as const).map(v => (
        <div key={v}>
          <p style={{ margin: '0 0 12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{v}</p>
          <Tabs items={baseTabs} variant={v}>
            {baseTabs.map(t => <TabPanel key={t.id} id={t.id}><Content id={t.id} /></TabPanel>)}
          </Tabs>
        </div>
      ))}
    </div>
  ),
};
