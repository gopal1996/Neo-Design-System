import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Sidebar, Topbar } from './Navigation';
import type { NavItem } from './Navigation';
import { Avatar } from '../Avatar/Avatar';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';

const HomeIcon = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 10L10 3l7 7v7H13v-4h-6v4H3v-7z" strokeLinejoin="round" /></svg>;
const ChartIcon = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 14V9M8 14V6m4 8V4m4 10v-3" strokeLinecap="round" /></svg>;
const UsersIcon = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="7" r="3" /><path d="M2 17c0-3 2.7-5 6-5s6 2 6 5" /><path d="M13 4a3 3 0 010 6M18 17c0-2-1.3-3.7-3-4.5" /></svg>;
const SettingsIcon = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="3" /><path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.2 3.2l1.4 1.4M15.4 15.4l1.4 1.4M3.2 16.8l1.4-1.4M15.4 4.6l1.4-1.4" strokeLinecap="round" /></svg>;
const BillingIcon = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="16" height="12" rx="2" /><path d="M2 9h16M6 13h2M10 13h4" strokeLinecap="round" /></svg>;
const SearchIcon = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="6" /><path d="M13.5 13.5L17 17" strokeLinecap="round" /></svg>;
const BellIcon = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2a6 6 0 016 6v3l2 3H2l2-3V8a6 6 0 016-6z" strokeLinejoin="round" /><path d="M8 16a2 2 0 004 0" /></svg>;

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon />,    active: true },
  { id: 'analytics', label: 'Analytics', icon: <ChartIcon />,  badge: 'New' },
  { id: 'users',     label: 'Users',     icon: <UsersIcon />,  badge: '1.2k' },
  { id: 'billing',   label: 'Billing',   icon: <BillingIcon /> },
  { id: 'settings',  label: 'Settings',  icon: <SettingsIcon /> },
];

const meta: Meta = {
  title:  'Components/Navigation',
  tags:   ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const SidebarDefault: Story = {
  name: 'Sidebar',
  render: () => {
    const [active, setActive] = useState('dashboard');
    const items = navItems.map(i => ({ ...i, active: i.id === active }));
    return (
      <div style={{ height: 500, display: 'flex' }}>
        <Sidebar
          items={items}
          onItemClick={i => setActive(i.id)}
          logo={
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#6D28D9,#8B5CF6)', flexShrink: 0 }} />
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Neo</span>
            </div>
          }
          footer={
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name="Alex Kim" size="sm" status="online" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Alex Kim</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Admin</p>
              </div>
            </div>
          }
        />
        <div style={{ flex: 1, background: 'var(--bg-base)', padding: 24 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Main content area</p>
        </div>
      </div>
    );
  },
};

export const SidebarCollapsed: Story = {
  name: 'Sidebar Collapsed',
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    return (
      <div style={{ height: 500, display: 'flex' }}>
        <Sidebar
          items={navItems}
          collapsed={collapsed}
          logo={
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#6D28D9,#8B5CF6)', flexShrink: 0 }} />
              {!collapsed && <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Neo</span>}
            </div>
          }
        />
        <div style={{ flex: 1, background: 'var(--bg-base)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Button size="sm" variant="secondary" onClick={() => setCollapsed(c => !c)}>
            {collapsed ? 'Expand' : 'Collapse'} sidebar
          </Button>
        </div>
      </div>
    );
  },
};

export const TopbarDefault: Story = {
  name: 'Topbar',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ background: 'var(--bg-base)', minHeight: 200 }}>
      <Topbar
        left={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#6D28D9,#8B5CF6)' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Neo</span>
          </div>
        }
        center={
          <Input
            placeholder="Search…"
            iconLeft={<SearchIcon />}
            style={{ maxWidth: 320, width: '100%' }}
          />
        }
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{ background:'transparent', border:'none', color:'var(--text-tertiary)', cursor:'pointer', padding:8, borderRadius:8, display:'flex', position:'relative' }}>
              <BellIcon />
              <span style={{ position:'absolute', top:6, right:6, width:6, height:6, borderRadius:'50%', background:'var(--error)', border:'1.5px solid var(--bg-subtle)' }} />
            </button>
            <Avatar name="Alex Kim" size="sm" status="online" />
          </div>
        }
      />
    </div>
  ),
};

export const AppShell: Story = {
  name: 'Full App Shell',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-base)' }}>
      <Topbar
        left={<div style={{ display:'flex', alignItems:'center', gap:10 }}><div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#6D28D9,#8B5CF6)' }} /><span style={{ fontWeight:700, color:'var(--text-primary)' }}>Neo</span></div>}
        center={<Input placeholder="Search…" iconLeft={<SearchIcon />} style={{ maxWidth:280, width:'100%' }} />}
        right={<Avatar name="Alex Kim" size="sm" status="online" />}
      />
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        <Sidebar items={navItems} logo={null} footer={null} />
        <main style={{ flex:1, padding:32, overflowY:'auto' }}>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>Page content renders here.</p>
        </main>
      </div>
    </div>
  ),
};
