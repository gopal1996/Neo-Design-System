import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Radio, RadioGroup } from './Radio';

const meta: Meta = {
  title: 'Components/Radio',
  tags:  ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState('editor');
    return (
      <RadioGroup name="role" value={val} onChange={setVal} label="Team role">
        <Radio value="admin"  label="Admin"  />
        <Radio value="editor" label="Editor" />
        <Radio value="viewer" label="Viewer" />
      </RadioGroup>
    );
  },
};

export const WithDescription: Story = {
  render: () => {
    const [val, setVal] = useState('pro');
    return (
      <RadioGroup name="plan" value={val} onChange={setVal} label="Select a plan">
        <Radio value="free"       label="Free"       description="Up to 3 projects, 1 user. Great for personal use." />
        <Radio value="pro"        label="Pro"        description="Unlimited projects, up to 10 users. $49/month." />
        <Radio value="enterprise" label="Enterprise" description="Unlimited everything. SSO, SLA, dedicated support." />
      </RadioGroup>
    );
  },
};

export const Horizontal: Story = {
  render: () => {
    const [val, setVal] = useState('monthly');
    return (
      <RadioGroup name="billing" value={val} onChange={setVal} label="Billing cycle" direction="horizontal">
        <Radio value="monthly"  label="Monthly"  />
        <Radio value="yearly"   label="Yearly"   />
      </RadioGroup>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [val, setVal] = useState('b');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {(['sm','md','lg'] as const).map(size => (
          <RadioGroup key={size} name={`size-${size}`} value={val} onChange={setVal} label={`Size: ${size}`}>
            <Radio value="a" label="Option A" size={size} />
            <Radio value="b" label="Option B" size={size} />
          </RadioGroup>
        ))}
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup name="disabled" value="b" label="Disabled group" disabled>
      <Radio value="a" label="Option A" />
      <Radio value="b" label="Option B (selected)" />
      <Radio value="c" label="Option C" />
    </RadioGroup>
  ),
};

export const WithError: Story = {
  render: () => {
    const [val, setVal] = useState('');
    return (
      <RadioGroup name="err" value={val} onChange={setVal} label="Pick a region" error={!val ? 'Please select a region.' : undefined}>
        <Radio value="us-east"  label="US East"   />
        <Radio value="eu-west"  label="EU West"   />
        <Radio value="ap-south" label="AP South"  />
      </RadioGroup>
    );
  },
};

export const PlanSelector: Story = {
  render: () => {
    const [val, setVal] = useState('pro');
    const plans = [
      { value: 'free',       label: 'Free',       price: '$0',   features: ['3 projects', '1 user', '1 GB storage'] },
      { value: 'pro',        label: 'Pro',        price: '$49',  features: ['Unlimited projects', '10 users', '100 GB storage'] },
      { value: 'enterprise', label: 'Enterprise', price: '$499', features: ['Unlimited', 'SSO + SAML', 'Dedicated SLA'] },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 340 }}>
        {plans.map(p => (
          <label key={p.value} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: 12, cursor: 'pointer',
            border: `1px solid ${val === p.value ? 'var(--violet-600)' : 'var(--border)'}`,
            background: val === p.value ? 'rgba(124,58,237,0.08)' : 'var(--bg-elevated)',
            transition: 'border-color 150ms, background 150ms',
          }}>
            <Radio value={p.value} name="plan-card" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{p.label}</span>
                <span style={{ fontWeight: 700, color: val === p.value ? 'var(--violet-300)' : 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{p.price}<span style={{ fontWeight: 400, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>/mo</span></span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {p.features.map(f => <span key={f} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>• {f}</span>)}
              </div>
            </div>
          </label>
        ))}
      </div>
    );
  },
};
