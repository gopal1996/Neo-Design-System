import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { DataTable, type ColumnDef } from './DataTable';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { colors } from '../../tokens';

/* ── Sample data ── */
interface User {
  id:       number;
  name:     string;
  email:    string;
  role:     string;
  status:   'active' | 'inactive' | 'pending';
  projects: number;
}

const users: User[] = [
  { id: 1, name: 'Alex Kim',       email: 'alex@neo.dev',    role: 'Admin',     status: 'active',   projects: 12 },
  { id: 2, name: 'Sam Chen',       email: 'sam@neo.dev',     role: 'Developer', status: 'active',   projects: 8  },
  { id: 3, name: 'Jordan Lee',     email: 'jordan@neo.dev',  role: 'Designer',  status: 'inactive', projects: 5  },
  { id: 4, name: 'Riley Park',     email: 'riley@neo.dev',   role: 'Developer', status: 'active',   projects: 14 },
  { id: 5, name: 'Casey Morgan',   email: 'casey@neo.dev',   role: 'Manager',   status: 'pending',  projects: 2  },
  { id: 6, name: 'Taylor Swift',   email: 'taylor@neo.dev',  role: 'Developer', status: 'active',   projects: 9  },
  { id: 7, name: 'Morgan Freeman', email: 'morgan@neo.dev',  role: 'Admin',     status: 'active',   projects: 20 },
  { id: 8, name: 'Drew Barrymore', email: 'drew@neo.dev',    role: 'Designer',  status: 'inactive', projects: 3  },
];

const statusVariant: Record<User['status'], 'success' | 'default' | 'warning'> = {
  active:   'success',
  inactive: 'default',
  pending:  'warning',
};

const columns: ColumnDef<User>[] = [
  {
    key:    'name',
    header: 'Name',
    width:  140,
    sortable:   true,
    searchable: true,
  },
  {
    key:    'role',
    header: 'Role',
    width:  110,
    sortable:   true,
    searchable: true,
  },
  {
    key:    'status',
    header: 'Status',
    width:  100,
    sortable:   true,
    searchable: false,
    renderCell: (val) => (
      <Badge variant={statusVariant[val as User['status']]} size="sm" dot>
        {String(val)}
      </Badge>
    ),
  },
  {
    key:    'projects',
    header: 'Projects',
    width:  90,
    align:  'right',
    sortable: true,
    searchable: false,
  },
  {
    key:    'actions',
    header: '',
    width:  80,
    sortable:   false,
    searchable: false,
    renderCell: (_, row) => (
      <Button variant="ghost" size="xs" onPress={() => {}}>Edit</Button>
    ),
  },
];

/* ── Meta ── */

const meta: Meta = {
  title:   'Components/DataTable',
  tags:    ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: colors.bgBase, padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <DataTable<User>
      columns={columns}
      data={users}
      rowKey="id"
      sortable
      searchable
      searchPlaceholder="Search users…"
    />
  ),
};

export const WithPagination: Story = {
  render: () => (
    <DataTable<User>
      columns={columns}
      data={users}
      rowKey="id"
      sortable
      searchable
      pageSize={4}
      searchPlaceholder="Search users…"
    />
  ),
};

export const Striped: Story = {
  render: () => (
    <DataTable<User>
      columns={columns}
      data={users}
      rowKey="id"
      sortable
      striped
      pageSize={5}
    />
  ),
};

export const Compact: Story = {
  render: () => (
    <DataTable<User>
      columns={columns}
      data={users}
      rowKey="id"
      sortable
      searchable
      density="compact"
      pageSize={5}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <DataTable<User>
      columns={columns}
      data={[]}
      rowKey="id"
      loading
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <DataTable<User>
      columns={columns}
      data={[]}
      rowKey="id"
      searchable
    />
  ),
};

export const Clickable: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <View style={{ gap: 12 }}>
        {selected && (
          <Text style={{ color: colors.violet300, fontSize: 13, paddingHorizontal: 4 }}>
            Selected: {selected}
          </Text>
        )}
        <DataTable<User>
          columns={columns.slice(0, 4)}
          data={users}
          rowKey="id"
          sortable
          pageSize={5}
          onRowPress={(row) => setSelected(row.name)}
        />
      </View>
    );
  },
};
