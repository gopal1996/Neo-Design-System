import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Select, type SelectOption, type SelectValue } from './Select';
import { colors, spacing, typography } from '../../tokens';

// ─── Sample data ──────────────────────────────────────────────────────────────

const FRAMEWORKS: SelectOption[] = [
  { label: 'React Native', value: 'rn', description: 'Meta · cross-platform' },
  { label: 'Flutter', value: 'flutter', description: 'Google · Dart' },
  { label: 'Expo', value: 'expo', description: 'Expo team · managed workflow' },
  { label: 'Capacitor', value: 'cap', description: 'Ionic · web-based' },
  { label: 'NativeScript', value: 'ns', description: 'Progress · JS native' },
  { label: 'Kotlin Multiplatform', value: 'kmp', description: 'JetBrains · Kotlin' },
  { label: 'Swift UI', value: 'swiftui', description: 'Apple · iOS only', disabled: true },
];

const ROLES: SelectOption[] = [
  { label: 'Admin', value: 'admin', description: 'Full access' },
  { label: 'Editor', value: 'editor', description: 'Can edit content' },
  { label: 'Viewer', value: 'viewer', description: 'Read-only' },
  { label: 'Billing', value: 'billing', description: 'Manage billing only' },
  { label: 'Developer', value: 'dev', description: 'API & integrations' },
];

const COUNTRIES: SelectOption[] = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'gb' },
  { label: 'Canada', value: 'ca' },
  { label: 'Australia', value: 'au' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Japan', value: 'jp' },
  { label: 'India', value: 'in' },
  { label: 'Brazil', value: 'br' },
  { label: 'Singapore', value: 'sg' },
];

// Simulated API call (300ms latency)
async function fetchUsers(query: string): Promise<SelectOption[]> {
  await new Promise(r => setTimeout(r, 400));
  const users: SelectOption[] = [
    { label: 'Alice Johnson', value: 'alice', description: 'alice@example.com' },
    { label: 'Bob Martinez', value: 'bob', description: 'bob@example.com' },
    { label: 'Carol Williams', value: 'carol', description: 'carol@example.com' },
    { label: 'Dan Chen', value: 'dan', description: 'dan@example.com' },
    { label: 'Eva Müller', value: 'eva', description: 'eva@example.com' },
    { label: 'Frank Okafor', value: 'frank', description: 'frank@example.com' },
    { label: 'Grace Kim', value: 'grace', description: 'grace@example.com' },
  ];
  const q = query.toLowerCase();
  return q ? users.filter(u => u.label.toLowerCase().includes(q) || u.description!.includes(q)) : users;
}

// ─── Story wrapper ────────────────────────────────────────────────────────────

const Wrap: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={s.section}>
    <Text style={s.sectionLabel}>{title}</Text>
    {children}
  </View>
);

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  decorators: [
    Story => (
      <ScrollView
        style={s.screen}
        contentContainerStyle={s.container}
        keyboardShouldPersistTaps="handled"
      >
        <Story />
      </ScrollView>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Select>;

// ─── Stories ──────────────────────────────────────────────────────────────────

/** 1. Basic single select */
export const Basic: Story = {
  render: () => {
    const [val, setVal] = useState<SelectValue | undefined>();
    return (
      <Wrap title="Basic Select">
        <Select
          label="Framework"
          placeholder="Choose a framework"
          options={FRAMEWORKS}
          value={val}
          onChange={v => setVal(v as SelectValue)}
          hint="Pick the mobile framework you use"
          clearable
          fullWidth
        />
      </Wrap>
    );
  },
};

/** 2. Size variants */
export const Sizes: Story = {
  render: () => {
    const [sm, setSm] = useState<SelectValue | undefined>();
    const [md, setMd] = useState<SelectValue | undefined>();
    const [lg, setLg] = useState<SelectValue | undefined>();
    return (
      <Wrap title="Sizes">
        <Select label="Small" size="sm" options={ROLES} value={sm} onChange={v => setSm(v as SelectValue)} fullWidth />
        <Select label="Medium" size="md" options={ROLES} value={md} onChange={v => setMd(v as SelectValue)} fullWidth />
        <Select label="Large" size="lg" options={ROLES} value={lg} onChange={v => setLg(v as SelectValue)} fullWidth />
      </Wrap>
    );
  },
};

/** 3. Multi-select */
export const MultiSelect: Story = {
  render: () => {
    const [vals, setVals] = useState<SelectValue[]>([]);
    return (
      <Wrap title="Multi-Select">
        <Select
          label="Roles"
          placeholder="Assign roles…"
          options={ROLES}
          value={vals}
          onChange={v => setVals(v as SelectValue[])}
          multiple
          clearable
          hint="Select one or more roles for this user"
          fullWidth
        />
      </Wrap>
    );
  },
};

/** 4. Multi-select with max cap */
export const MultiSelectMaxThree: Story = {
  render: () => {
    const [vals, setVals] = useState<SelectValue[]>([]);
    return (
      <Wrap title="Multi-Select (max 3)">
        <Select
          label="Tags"
          placeholder="Add tags…"
          options={FRAMEWORKS}
          value={vals}
          onChange={v => setVals(v as SelectValue[])}
          multiple
          maxSelected={3}
          hint="You can select up to 3 tags"
          fullWidth
        />
      </Wrap>
    );
  },
};

/** 5. Select with search */
export const WithSearch: Story = {
  render: () => {
    const [val, setVal] = useState<SelectValue | undefined>();
    return (
      <Wrap title="Select with Search">
        <Select
          label="Country"
          placeholder="Search a country…"
          options={COUNTRIES}
          value={val}
          onChange={v => setVal(v as SelectValue)}
          searchable
          searchPlaceholder="Type to filter countries"
          clearable
          fullWidth
        />
      </Wrap>
    );
  },
};

/** 6. Multi + search */
export const MultiWithSearch: Story = {
  render: () => {
    const [vals, setVals] = useState<SelectValue[]>([]);
    return (
      <Wrap title="Multi-Select with Search">
        <Select
          label="Countries"
          placeholder="Select countries…"
          options={COUNTRIES}
          value={vals}
          onChange={v => setVals(v as SelectValue[])}
          multiple
          searchable
          clearable
          fullWidth
        />
      </Wrap>
    );
  },
};

/** 7. Autocomplete (free-solo) */
export const Autocomplete: Story = {
  render: () => {
    const [val, setVal] = useState<SelectValue | undefined>();
    return (
      <Wrap title="Autocomplete (freeSolo)">
        <Select
          label="Tech Stack"
          placeholder="Type or choose…"
          options={FRAMEWORKS}
          value={val}
          onChange={v => setVal(v as SelectValue)}
          searchable
          freeSolo
          clearable
          hint="Type any custom value or pick from suggestions"
          fullWidth
        />
      </Wrap>
    );
  },
};

/** 8. Autocomplete multi */
export const AutocompleteMulti: Story = {
  render: () => {
    const [vals, setVals] = useState<SelectValue[]>([]);
    return (
      <Wrap title="Autocomplete Multi">
        <Select
          label="Skills"
          placeholder="Add skills…"
          options={FRAMEWORKS}
          value={vals}
          onChange={v => setVals(v as SelectValue[])}
          multiple
          searchable
          freeSolo
          clearable
          hint="Pick from suggestions or add custom tags"
          fullWidth
        />
      </Wrap>
    );
  },
};

/** 9. Datasource (API-driven) */
export const Datasource: Story = {
  render: () => {
    const [val, setVal] = useState<SelectValue | undefined>();
    return (
      <Wrap title="Datasource Select (API)">
        <Select
          label="Assign User"
          placeholder="Search users…"
          value={val}
          onChange={v => setVal(v as SelectValue)}
          dataSource={fetchUsers}
          searchPlaceholder="Search by name or email"
          clearable
          hint="Results are fetched from the API as you type"
          fullWidth
        />
      </Wrap>
    );
  },
};

/** 10. Datasource multi */
export const DatasourceMulti: Story = {
  render: () => {
    const [vals, setVals] = useState<SelectValue[]>([]);
    return (
      <Wrap title="Datasource Multi (API)">
        <Select
          label="Team Members"
          placeholder="Add members…"
          value={vals}
          onChange={v => setVals(v as SelectValue[])}
          dataSource={fetchUsers}
          multiple
          searchPlaceholder="Search users…"
          clearable
          fullWidth
        />
      </Wrap>
    );
  },
};

/** 11. States */
export const States: Story = {
  render: () => (
    <Wrap title="States">
      <Select label="Error state" options={ROLES} error="This field is required" fullWidth />
      <Select label="Disabled state" options={ROLES} value="editor" disabled fullWidth />
      <Select label="With hint" options={ROLES} hint="Choose carefully" fullWidth />
    </Wrap>
  ),
};

/** 12. All modes at once */
export const AllModes: Story = {
  render: () => {
    const [single, setSingle] = useState<SelectValue | undefined>();
    const [multi, setMulti] = useState<SelectValue[]>([]);
    const [search, setSearch] = useState<SelectValue | undefined>();
    const [auto, setAuto] = useState<SelectValue | undefined>();
    const [ds, setDs] = useState<SelectValue | undefined>();
    return (
      <>
        <Wrap title="Single">
          <Select label="Framework" options={FRAMEWORKS} value={single}
            onChange={v => setSingle(v as SelectValue)} clearable fullWidth />
        </Wrap>
        <Wrap title="Multi">
          <Select label="Roles" options={ROLES} value={multi} multiple
            onChange={v => setMulti(v as SelectValue[])} clearable fullWidth />
        </Wrap>
        <Wrap title="With Search">
          <Select label="Country" options={COUNTRIES} value={search} searchable
            onChange={v => setSearch(v as SelectValue)} clearable fullWidth />
        </Wrap>
        <Wrap title="Autocomplete">
          <Select label="Stack" options={FRAMEWORKS} value={auto} searchable freeSolo
            onChange={v => setAuto(v as SelectValue)} clearable fullWidth />
        </Wrap>
        <Wrap title="API Datasource">
          <Select label="User" value={ds} dataSource={fetchUsers}
            onChange={v => setDs(v as SelectValue)} clearable fullWidth />
        </Wrap>
      </>
    );
  },
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgBase },
  container: { padding: spacing[6], gap: spacing[6], paddingBottom: spacing[16] },
  section: { gap: spacing[4] },
  sectionLabel: {
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing[1],
  },
});
