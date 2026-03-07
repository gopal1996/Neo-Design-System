# Neo Mobile — AI Code Generation Context

Use this file as ground truth when generating or modifying React Native code for the Neo mobile design system.

---

## Rules (always apply)

1. **Import from `@neo/mobile`** — never recreate components from scratch
2. **Import tokens from `@neo/mobile`** — `colors`, `spacing`, `radii`, `typography`
3. **Never hardcode hex colors** — always use `colors.*` tokens
4. **Never use inline `style={{ color: '#xxx' }}`** for brand colors — reference tokens
5. **Touch targets ≥ 44×44 dp** — use `hitSlop` export for small elements
6. **Dark-only** — never use white or light backgrounds
7. **Use `React.forwardRef`** for any new form element

---

## Import Pattern

```tsx
import {
  Button, Text, Badge, Avatar, AvatarGroup,
  Card, CardHeader, CardBody, CardFooter,
  Input, Switch, Spinner,
  Tabs, TabPanel,
  Divider,
  Checkbox, Radio,
  AppBar, AppBarBackButton, AppBarAction,
  Banner,
  BottomNavigation,
  FAB,
  DataTable,
  colors, spacing, radii, typography,
} from '@neo/mobile';
```

---

## Component Quick Reference

### Button
```tsx
// Variants: primary | secondary | ghost | danger | success
// Sizes:    xs | sm | md | lg | xl
<Button variant="primary" size="md">Label</Button>
<Button variant="danger" loading={isDeleting}>Delete</Button>
<Button iconLeft={<Icon />} fullWidth>Submit</Button>
```

### Text
```tsx
// Variants: display | h1–h5 | body-lg | body | body-sm | caption | overline | mono
// Colors:   primary | secondary | tertiary | brand | success | warning | error | info
<Text variant="h2">Title</Text>
<Text variant="body" color="secondary">Supporting copy</Text>
<Text variant="overline" color="brand">Section</Text>
```

### Badge
```tsx
// Variants: default | brand | success | warning | error | info | outline
// Sizes:    sm | md | lg
<Badge variant="brand" dot>New</Badge>
<Badge variant="success" size="sm">Active</Badge>
```

### Avatar / AvatarGroup
```tsx
// Sizes:   xs | sm | md | lg | xl | 2xl
// Status:  online | offline | busy | away
<Avatar name="Jane Smith" size="md" status="online" />
<Avatar src={uri} size="lg" />
<AvatarGroup avatars={list} max={4} size="sm" />
```

### Card
```tsx
// Variants: default | elevated | brand | flat
// Padding:  none | sm | md | lg | xl
<Card variant="brand" padding="lg">
  <CardHeader><Text variant="h4">Title</Text></CardHeader>
  <CardBody><Text>Content</Text></CardBody>
  <CardFooter><Button size="sm">Action</Button></CardFooter>
</Card>
<Card interactive onPress={handler} variant="elevated">…</Card>
```

### Input
```tsx
// Sizes: sm | md | lg
<Input label="Email" placeholder="you@example.com" />
<Input label="Password" error="Required" secureTextEntry />
<Input hint="Optional" iconLeft={<SearchIcon />} size="lg" />
```

### Switch
```tsx
// Sizes: sm | md | lg  — supports controlled + uncontrolled
<Switch label="Notifications" onChange={setEnabled} />
<Switch checked={value} onChange={setValue} disabled />
```

### Spinner
```tsx
// Sizes:    xs | sm | md | lg | xl
// Variants: ring | dots | pulse
<Spinner />
<Spinner size="lg" variant="dots" />
<Spinner variant="pulse" color={colors.success} />
```

### Tabs / TabPanel
```tsx
// Variants: line | pill | enclosed
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'details',  label: 'Details', badge: 3 },
];

<Tabs items={tabs} variant="pill" active={tab} onChange={setTab}>
  <TabPanel id="overview"><OverviewScreen /></TabPanel>
  <TabPanel id="details"><DetailsScreen /></TabPanel>
</Tabs>
```

### Divider
```tsx
// Variants:    default | subtle | strong | brand
// Orientation: horizontal | vertical
// Spacing:     sm | md | lg
<Divider />
<Divider label="OR" variant="subtle" />
<Divider orientation="vertical" />
```

### Checkbox
```tsx
// Sizes: sm | md | lg  — supports indeterminate
<Checkbox label="Agree to terms" onChange={setAgreed} />
<Checkbox checked={all} indeterminate={partial} onChange={handleAll} />
```

### Radio
```tsx
// Sizes: sm | md | lg  — cannot be unchecked (use group pattern)
{['a', 'b', 'c'].map(v => (
  <Radio
    key={v}
    label={`Option ${v.toUpperCase()}`}
    value={v}
    checked={selected === v}
    onChange={() => setSelected(v)}
  />
))}
```

### AppBar
```tsx
// Variants: default | transparent | elevated
<AppBar
  title="Profile"
  left={<AppBarBackButton onPress={goBack} />}
  right={
    <AppBarAction
      icon={<BellIcon />}
      onPress={openNotifs}
      accessibilityLabel="Notifications"
      badge={3}
    />
  }
/>
```

### Banner
```tsx
// Variants: info | success | warning | error
<Banner
  variant="error"
  title="Upload Failed"
  description="Please check your connection and try again."
  action={{ label: 'Retry', onPress: retry }}
  onDismiss={() => setVisible(false)}
/>
```

### BottomNavigation
```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { bottom } = useSafeAreaInsets();
const tabs = [
  { id: 'home',   label: 'Home',   icon: (a) => <HomeIcon   color={a ? colors.violet300 : colors.textTertiary} /> },
  { id: 'search', label: 'Search', icon: (a) => <SearchIcon color={a ? colors.violet300 : colors.textTertiary} /> },
  { id: 'profile',label: 'Profile',icon: (a) => <UserIcon   color={a ? colors.violet300 : colors.textTertiary} />, badge: true },
];

<BottomNavigation items={tabs} active={route} onChange={setRoute} safeAreaBottom={bottom} />
```

### FAB
```tsx
// Sizes:    sm | md | lg
// Variants: primary | secondary | surface
// With label → extended (pill) shape
<FAB
  icon={<PlusIcon />}
  label="New Post"
  onPress={createPost}
  accessibilityLabel="Create new post"
  visible={!isScrolling}
/>
```

### DataTable
```tsx
import type { ColumnDef } from '@neo/mobile';

const columns: ColumnDef<User>[] = [
  { key: 'name',   header: 'Name',   sortable: true },
  { key: 'email',  header: 'Email',  sortable: true },
  { key: 'status', header: 'Status',
    renderCell: (v) => <Badge variant="brand">{String(v)}</Badge> },
  { key: 'actions', header: '', sortable: false, searchable: false,
    renderCell: (_, row) => (
      <Button size="xs" variant="ghost" onPress={() => edit(row)}>Edit</Button>
    )},
];

<DataTable
  columns={columns}
  data={users}
  rowKey="id"
  sortable
  searchable
  searchPlaceholder="Search users…"
  pageSize={10}
  striped
  density="comfortable"
  onRowPress={(row) => navigate(row.id)}
/>
```

---

## Tokens Reference

```ts
// Colors (use these, never hardcode)
colors.bgBase        // #000000 — page background
colors.bgElevated    // #0F0F1A — cards
colors.violet500     // #7C3AED — primary brand
colors.violet400     // #8B5CF6 — interactive
colors.violet300     // #A78BFA — active/accents
colors.textPrimary   // #F0F0F8
colors.textSecondary // #9898B3
colors.textTertiary  // #6B6B8A
colors.border        // #2C2C4A
colors.borderFocus   // #8B5CF6
colors.success       // #10B981
colors.warning       // #F59E0B
colors.error         // #EF4444
colors.info          // #06B6D4

// Spacing (dp, 4px grid)
spacing[1]  // 4
spacing[2]  // 8
spacing[3]  // 12
spacing[4]  // 16
spacing[6]  // 24
spacing[8]  // 32

// Radii (dp)
radii.sm    // 4
radii.md    // 8
radii.lg    // 12
radii.xl    // 16
radii.full  // 9999

// Typography
typography.fontWeight.regular   // '400'
typography.fontWeight.medium    // '500'
typography.fontWeight.semibold  // '600'
typography.fontWeight.bold      // '700'
```

---

## Screen Layout Pattern

```tsx
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppBar, AppBarBackButton, BottomNavigation, colors, spacing } from '@neo/mobile';

export function MyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <AppBar
        title="My Screen"
        left={<AppBarBackButton onPress={goBack} />}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen content */}
      </ScrollView>
      <BottomNavigation
        items={tabs}
        active={activeTab}
        onChange={setActiveTab}
        safeAreaBottom={insets.bottom}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.bgBase },
  scroll:  { flex: 1 },
  content: { padding: spacing[4], gap: spacing[4] },
});
```

---

## Do Not

- Never `import { StyleSheet } from 'react-native'` to style with raw hex colors
- Never install a new icon library — use SVG inline or from the Figma payload
- Never use Tailwind or NativeWind
- Never render light backgrounds (`#fff`, `white`, `#f5f5f5`)
- Never use inline `style={{ color: '#7C3AED' }}` — use `colors.violet500`
