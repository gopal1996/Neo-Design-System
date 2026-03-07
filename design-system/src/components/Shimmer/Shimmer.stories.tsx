import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { Shimmer, ShimmerText, ShimmerAvatar, ShimmerCard, ShimmerTable, ShimmerList } from './Shimmer';

const meta: Meta = {
  title: 'Components/Shimmer',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

export const Base: Story = {
  name: 'Base Shimmer',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <Shimmer width="100%" height={16} radius="md" />
      <Shimmer width="75%" height={16} radius="md" />
      <Shimmer width="50%" height={16} radius="md" />
      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
        <Shimmer width={40} height={40} radius="full" />
        <Shimmer width={80} height={40} radius="lg" />
        <Shimmer width={120} height={40} radius="xl" />
      </div>
    </div>
  ),
};

export const TextBlock: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <ShimmerText lines={4} lastLineWidth="40%" />
    </div>
  ),
};

export const Card: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <ShimmerCard />
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <ShimmerList items={5} avatar />
    </div>
  ),
};

export const Table: Story = {
  render: () => (
    <div style={{ width: '100%' }}>
      <ShimmerTable rows={6} cols={5} />
    </div>
  ),
};

export const AllPresets: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <p style={{ margin: '0 0 12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Card skeleton</p>
        <div style={{ width: 360 }}><ShimmerCard /></div>
      </div>
      <div>
        <p style={{ margin: '0 0 12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>List skeleton</p>
        <div style={{ width: 360 }}><ShimmerList items={4} /></div>
      </div>
      <div>
        <p style={{ margin: '0 0 12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Table skeleton</p>
        <ShimmerTable rows={5} cols={4} />
      </div>
    </div>
  ),
};

export const LoadingTransition: Story = {
  name: 'Loading → Content transition',
  render: () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const t = setInterval(() => setLoading(l => !l), 3000);
      return () => clearInterval(t);
    }, []);

    return (
      <div style={{ width: 360 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Auto-toggles every 3s</p>
          <span style={{
            padding: '2px 8px', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600,
            background: loading ? 'rgba(124,58,237,0.15)' : 'rgba(16,185,129,0.15)',
            color: loading ? 'var(--violet-300)' : 'var(--success)',
          }}>{loading ? 'Loading' : 'Loaded'}</span>
        </div>

        {loading ? (
          <ShimmerCard />
        ) : (
          <div style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 16, padding: 16, animation: 'fadeIn 300ms ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#6D28D9,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.875rem' }}>AK</div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>Alex Kim</p>
                <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>alex@neo.io</p>
              </div>
            </div>
            <p style={{ margin: '0 0 16px', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Leading the product team and driving the roadmap for Q2. Currently focused on the design system and onboarding flow.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(109,40,217,0.3)', color: 'var(--violet-200)', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }}>Message</button>
              <button style={{ padding: '6px 14px', borderRadius: 8, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }}>View profile</button>
            </div>
          </div>
        )}
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }`}</style>
      </div>
    );
  },
};

export const DashboardSkeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Shimmer width="40%" height={12} radius="md" />
            <Shimmer width="60%" height={28} radius="lg" />
            <Shimmer width="35%" height={12} radius="md" />
          </div>
        ))}
      </div>
      {/* main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Shimmer width="30%" height={16} radius="md" />
          <ShimmerTable rows={5} cols={4} />
        </div>
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Shimmer width="40%" height={16} radius="md" />
          <ShimmerList items={5} avatar />
        </div>
      </div>
    </div>
  ),
};
