import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Badge } from '../Badge/Badge';

const meta: Meta<typeof Modal> = {
  title:     'Components/Modal',
  component: Modal,
  tags:      ['autodocs'],
  argTypes: {
    size:             { control: 'select', options: ['sm','md','lg','xl','full'] },
    closeOnBackdrop:  { control: 'boolean' },
  },
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Modal>;

const Trigger = ({ label, children }: { label: string; children: (open: boolean, setOpen: (v: boolean) => void) => React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding: 60 }}>
      <Button onClick={() => setOpen(true)}>{label}</Button>
      {children(open, setOpen)}
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <Trigger label="Open modal">
      {(open, setOpen) => (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm action"
          description="Are you sure you want to proceed? This action cannot be undone."
          footer={
            <>
              <Button variant="ghost"   onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
            </>
          }
        >
          <p style={{ color:'var(--text-secondary)', fontSize:'0.875rem', lineHeight:1.6 }}>
            Deleting this resource will permanently remove all associated data including analytics, configurations, and user assignments. Make sure you have exported any data you need.
          </p>
        </Modal>
      )}
    </Trigger>
  ),
};

export const Danger: Story = {
  render: () => (
    <Trigger label="Delete workspace">
      {(open, setOpen) => (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Delete workspace"
          description="This will permanently delete your workspace and all data within it."
          footer={
            <>
              <Button variant="ghost"  onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => setOpen(false)}>Delete workspace</Button>
            </>
          }
        >
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ background:'var(--error-bg)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'var(--radius-lg)', padding:16, display:'flex', gap:12 }}>
              <span style={{ color:'var(--error)', fontSize:'1.125rem' }}>⚠</span>
              <p style={{ color:'var(--error-lt)', fontSize:'0.875rem', margin:0, lineHeight:1.5 }}>
                All projects, members, integrations, and billing data will be lost forever.
              </p>
            </div>
            <Input label="Type your workspace name to confirm" placeholder="my-workspace" />
          </div>
        </Modal>
      )}
    </Trigger>
  ),
};

export const Form: Story = {
  render: () => (
    <Trigger label="Invite member">
      {(open, setOpen) => (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Invite team member"
          description="They'll receive an email invitation to join your workspace."
          footer={
            <>
              <Button variant="ghost"   onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Send invite</Button>
            </>
          }
        >
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <Input label="Email address" placeholder="colleague@company.com" type="email" />
            <div>
              <p style={{ margin:'0 0 8px', fontSize:'0.875rem', fontWeight:500, color:'var(--text-secondary)' }}>Role</p>
              <div style={{ display:'flex', gap:8 }}>
                {['Viewer','Editor','Admin'].map(r => (
                  <button key={r} style={{
                    padding:'8px 16px', borderRadius:'var(--radius-lg)', border:'1px solid var(--border)',
                    background: r === 'Editor' ? 'rgba(124,58,237,0.12)' : 'transparent',
                    borderColor: r === 'Editor' ? 'var(--border-brand)' : 'var(--border)',
                    color: r === 'Editor' ? 'var(--violet-200)' : 'var(--text-secondary)',
                    cursor:'pointer', fontFamily:'var(--font-sans)', fontSize:'0.875rem',
                  }}>{r}</button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </Trigger>
  ),
};

export const Sizes: Story = {
  render: () => {
    const [size, setSize] = useState<'sm'|'md'|'lg'|'xl'>('md');
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:60, gap:12 }}>
        {(['sm','md','lg','xl'] as const).map(s => (
          <Button key={s} variant={size===s?'primary':'secondary'} size="sm" onClick={() => { setSize(s); setOpen(true); }}>
            {s.toUpperCase()}
          </Button>
        ))}
        <Modal open={open} onClose={() => setOpen(false)} title={`${size.toUpperCase()} Modal`} size={size} footer={<Button variant="primary" onClick={()=>setOpen(false)}>Close</Button>}>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>This is a <strong style={{color:'var(--text-primary)'}}>{size}</strong> modal.</p>
        </Modal>
      </div>
    );
  },
};
