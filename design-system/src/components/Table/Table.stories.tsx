import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Table } from './Table';
import type { ColumnDef } from './Table';
import { Badge } from '../Badge/Badge';
import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Button/Button';

// ─── Sample data ──────────────────────────────────────────────

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  plan: 'free' | 'pro' | 'enterprise';
  mrr: number;
  joined: string;
};

const users: User[] = [
  { id: 1, name: 'Alice Tran', email: 'alice@neo.io', role: 'Admin', status: 'active', plan: 'enterprise', mrr: 499, joined: '2024-01-12' },
  { id: 2, name: 'Bob Smith', email: 'bob@company.co', role: 'Editor', status: 'active', plan: 'pro', mrr: 49, joined: '2024-02-08' },
  { id: 3, name: 'Carol Wu', email: 'carol@startup.ai', role: 'Viewer', status: 'pending', plan: 'free', mrr: 0, joined: '2024-03-20' },
  { id: 4, name: 'David Park', email: 'david@acme.com', role: 'Admin', status: 'active', plan: 'enterprise', mrr: 499, joined: '2024-01-05' },
  { id: 5, name: 'Eva Müller', email: 'eva@design.eu', role: 'Editor', status: 'inactive', plan: 'pro', mrr: 49, joined: '2024-04-17' },
  { id: 6, name: 'Frank Diaz', email: 'frank@dev.io', role: 'Viewer', status: 'active', plan: 'free', mrr: 0, joined: '2024-02-28' },
  { id: 7, name: 'Grace Li', email: 'grace@saas.com', role: 'Editor', status: 'active', plan: 'pro', mrr: 49, joined: '2024-05-01' },
  { id: 8, name: 'Hiro Tanaka', email: 'hiro@corp.jp', role: 'Admin', status: 'active', plan: 'enterprise', mrr: 499, joined: '2024-03-10' },
  { id: 9, name: 'Irene Santos', email: 'irene@biz.br', role: 'Viewer', status: 'pending', plan: 'free', mrr: 0, joined: '2024-06-02' },
  { id: 10, name: 'James Cohen', email: 'james@fin.us', role: 'Editor', status: 'active', plan: 'pro', mrr: 49, joined: '2024-04-25' },
  { id: 11, name: 'Kim Nguyen', email: 'kim@agency.vn', role: 'Viewer', status: 'active', plan: 'free', mrr: 0, joined: '2024-05-18' },
  { id: 12, name: 'Lena Brandt', email: 'lena@tech.de', role: 'Admin', status: 'inactive', plan: 'enterprise', mrr: 499, joined: '2024-01-30' },
];

const statusVariant: Record<User['status'], 'success' | 'warning' | 'error'> = {
  active: 'success',
  pending: 'warning',
  inactive: 'error',
};
const planVariant: Record<User['plan'], 'default' | 'brand' | 'info'> = {
  free: 'default',
  pro: 'brand',
  enterprise: 'info',
};

const columns: ColumnDef<User>[] = [
  {
    key: 'name',
    header: 'User',
    sortable: true,
    minWidth: 200,
    renderCell: (_, row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={row.name as string} size="sm" />
        <div>
          <p style={{ margin: 0, fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{row.name as string}</p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{row.email as string}</p>
        </div>
      </div>
    ),
  },
  { key: 'role', header: 'Role', sortable: true },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    renderCell: val => (
      <Badge variant={statusVariant[val as User['status']]} dot size="sm">
        {String(val).charAt(0).toUpperCase() + String(val).slice(1)}
      </Badge>
    ),
  },
  {
    key: 'plan',
    header: 'Plan',
    sortable: true,
    renderCell: val => (
      <Badge variant={planVariant[val as User['plan']]} size="sm">
        {String(val).charAt(0).toUpperCase() + String(val).slice(1)}
      </Badge>
    ),
  },
  {
    key: 'mrr',
    header: 'MRR',
    sortable: true,
    align: 'right',
    renderCell: val => (
      <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500, color: (val as number) > 0 ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
        {(val as number) > 0 ? `$${val}` : '—'}
      </span>
    ),
  },
  { key: 'joined', header: 'Joined', sortable: true },
  {
    key: 'actions',
    header: '',
    sortable: false,
    searchable: false,
    align: 'right',
    renderCell: (_, row) => (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
        <Button size="xs" variant="ghost">Edit</Button>
        <Button size="xs" variant="danger">Remove</Button>
      </div>
    ),
  },
];

// ─── Meta ─────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Components/Table',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

// ─── Stories ──────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Table
        columns={columns}
        data={users}
        rowKey="id"
        sortable
        searchable
        searchPlaceholder="Search users…"
        pageSize={8}
        hoverable
      />
    </div>
  ),
};

export const Sortable: Story = {
  name: 'Sort Only (no search)',
  render: () => (
    <div style={{ padding: 24 }}>
      <Table columns={columns.slice(0, 6)} data={users} rowKey="id" sortable />
    </div>
  ),
};

export const Searchable: Story = {
  name: 'Search Only (no sort)',
  render: () => (
    <div style={{ padding: 24 }}>
      <Table
        columns={columns.slice(0, 6)}
        data={users}
        rowKey="id"
        searchable
        searchPlaceholder="Filter users…"
      />
    </div>
  ),
};

export const WithPagination: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Table
        columns={columns.slice(0, 6)}
        data={users}
        rowKey="id"
        sortable
        searchable
        pageSize={4}
      />
    </div>
  ),
};

export const Striped: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Table
        columns={columns.slice(0, 5)}
        data={users}
        rowKey="id"
        sortable
        striped
      />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Table
        columns={columns.slice(0, 6)}
        data={users}
        rowKey="id"
        sortable
        searchable
        density="compact"
        pageSize={6}
      />
    </div>
  ),
};

export const Spacious: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Table
        columns={columns.slice(0, 5)}
        data={users.slice(0, 5)}
        rowKey="id"
        sortable
        density="spacious"
      />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Table columns={columns.slice(0, 5)} data={[]} rowKey="id" sortable searchable loading pageSize={6} />
    </div>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Table columns={columns.slice(0, 5)} data={[]} rowKey="id" searchable sortable />
    </div>
  ),
};

export const ControlledSort: Story = {
  render: () => {
    const [sortKey, setSortKey] = useState<string>('mrr');
    const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>('desc');
    return (
      <div style={{ padding: 24 }}>
        <p style={{ margin: '0 0 12px', fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
          Controlled sort: <code style={{ color: 'var(--violet-300)' }}>{sortKey} {sortDir}</code>
        </p>
        <Table
          columns={columns.slice(0, 6)}
          data={users}
          rowKey="id"
          sortable
          sortKey={sortKey}
          sortDirection={sortDir}
          onSortChange={(k, d) => { setSortKey(k); setSortDir(d); }}
        />
      </div>
    );
  },
};

export const ClickableRows: Story = {
  render: () => {
    const [selected, setSelected] = useState<number | null>(null);
    return (
      <div style={{ padding: 24 }}>
        {selected !== null && (
          <p style={{ marginBottom: 12, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Clicked: <strong style={{ color: 'var(--violet-300)' }}>{users.find(u => u.id === selected)?.name}</strong>
          </p>
        )}
        <Table
          columns={columns.slice(0, 5)}
          data={users}
          rowKey="id"
          sortable
          onRowClick={row => setSelected(row.id as number)}
        />
      </div>
    );
  },
};

export const CustomEmptyState: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Table
        columns={columns.slice(0, 5)}
        data={[]}
        rowKey="id"
        emptyState={
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <p style={{ color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: 8 }}>No users yet</p>
            <Button variant="primary" size="sm">Invite your first member</Button>
          </div>
        }
      />
    </div>
  ),
};
