# Tabs / TabPanel

Horizontally scrollable tab navigator. Manages active state via React Context. `TabPanel` conditionally renders its children.

## Exports
`Tabs`, `TabPanel`, `TabsProps`, `TabItem`, `TabsVariant`

## Tabs Props

| Prop          | Type                        | Default       | Notes                             |
|---------------|-----------------------------|---------------|-----------------------------------|
| `items`       | `TabItem[]`                 | — (required)  | Tab definitions                   |
| `defaultTab`  | `string`                    | `items[0].id` | Uncontrolled initial active tab   |
| `active`      | `string`                    | —             | Controlled mode when provided     |
| `onChange`    | `(id: string) => void`      | —             |                                   |
| `variant`     | `TabsVariant`               | `line`        |                                   |
| `children`    | `ReactNode`                 | —             | Place `TabPanel` components here  |
| `style`       | `ViewStyle`                 | —             |                                   |

## TabItem Shape

```ts
interface TabItem {
  id:        string;
  label:     string;
  badge?:    string | number;  // shown as a small violet pill
  disabled?: boolean;          // opacity 0.4, not pressable
}
```

## TabPanel Props

| Prop       | Type        | Notes                                |
|------------|-------------|--------------------------------------|
| `id`       | `string`    | Must match a `TabItem.id`            |
| `children` | `ReactNode` | Rendered only when this tab is active|

## Variants

| Variant    | Track style                                       | Active tab style                               |
|------------|---------------------------------------------------|------------------------------------------------|
| `line`     | `borderBottomWidth: 1` in `border`               | `borderBottomWidth: 2` in `violet500`          |
| `pill`     | `bgMuted` bg, `borderRadius: xl`, `padding: 4`   | `rgba(124,58,237,0.15)` bg, `radii.lg` radius  |
| `enclosed` | `bgElevated` bg, `borderRadius: xl`, `padding: 4`| `bgOverlay` bg, `radii.md` radius              |

## Behaviour
- `ScrollView horizontal` allows overflow when many tabs exist
- `gap: 2` between tab buttons
- Active text: `textPrimary`; inactive: `textTertiary`
- `accessibilityRole="tab"`, `accessibilityState={{ selected, disabled }}`
- `TabPanel` renders a `<View>` with `paddingTop: 16` when active

## Usage

```tsx
import { Tabs, TabPanel } from '@neo/mobile';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'activity', label: 'Activity', badge: 5 },
  { id: 'settings', label: 'Settings' },
];

// Uncontrolled
<Tabs items={tabs} variant="pill">
  <TabPanel id="overview"><OverviewScreen /></TabPanel>
  <TabPanel id="activity"><ActivityFeed /></TabPanel>
  <TabPanel id="settings"><SettingsForm /></TabPanel>
</Tabs>

// Controlled
const [tab, setTab] = React.useState('overview');
<Tabs items={tabs} variant="enclosed" active={tab} onChange={setTab}>
  <TabPanel id="overview">…</TabPanel>
</Tabs>
```
