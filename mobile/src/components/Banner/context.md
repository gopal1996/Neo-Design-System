# Banner

Inline alert/notification strip with icon, title, description, up to two action links, and an optional dismiss button.

## Exports
`Banner`, `BannerProps`, `BannerVariant`, `BannerAction`

## Props

| Prop              | Type           | Default  | Notes                                     |
|-------------------|----------------|----------|-------------------------------------------|
| `variant`         | `BannerVariant`| `info`   |                                           |
| `title`           | `string`       | —        | Optional bold heading                     |
| `description`     | `string`       | — (required) |                                       |
| `icon`            | `ReactNode`    | auto     | Overrides the built-in variant icon       |
| `action`          | `BannerAction` | —        | Primary link action                       |
| `secondaryAction` | `BannerAction` | —        | Secondary link action                     |
| `onDismiss`       | `() => void`   | —        | Renders ✕ button in top-right             |
| `style`           | `ViewStyle`    | —        |                                           |

```ts
interface BannerAction {
  label:   string;
  onPress: () => void;
}
```

## Variants

| Variant   | Background | Border                     | Icon bg                    | Title color | Action color |
|-----------|------------|----------------------------|----------------------------|-------------|--------------|
| `info`    | `infoBg`   | `rgba(6,182,212,0.25)`     | `rgba(6,182,212,0.15)`     | `infoLt`    | `infoLt`     |
| `success` | `successBg`| `rgba(16,185,129,0.25)`    | `rgba(16,185,129,0.15)`    | `successLt` | `successLt`  |
| `warning` | `warningBg`| `rgba(245,158,11,0.25)`    | `rgba(245,158,11,0.15)`    | `warningLt` | `warningLt`  |
| `error`   | `errorBg`  | `rgba(239,68,68,0.25)`     | `rgba(239,68,68,0.15)`     | `errorLt`   | `errorLt`    |

## Built-in Icons (16×16dp)
- `info` — circle with "i"
- `success` — circle with checkmark L
- `warning` — "!" character
- `error` — circle with "✕"

All use inline View compositions (no icon library required).

## Layout
- `flexDirection: row`, `alignItems: flex-start`, `gap: 12`, `padding: 16`
- `borderRadius: radii.lg` (12dp), `borderWidth: 1`
- Icon wrap: 32×32dp, `borderRadius: radii.md` (8dp)
- Content: `flex: 1`, `gap: 4`
- Actions row: `flexDirection: row`, `gap: 16`, `marginTop: 8`
- Description: `fontWeight: regular`, title: `fontWeight: semibold`, both `fontSize: 14`
- `accessibilityRole="alert"`

## Usage

```tsx
import { Banner } from '@neo/mobile';

// Basic
<Banner description="Your session will expire in 5 minutes." />

// With title and dismiss
<Banner
  variant="success"
  title="Saved!"
  description="Your changes have been saved successfully."
  onDismiss={() => setVisible(false)}
/>

// With actions
<Banner
  variant="error"
  title="Upload Failed"
  description="Could not connect to the server."
  action={{ label: 'Retry', onPress: handleRetry }}
  secondaryAction={{ label: 'Dismiss', onPress: handleDismiss }}
/>

// Custom icon
<Banner
  variant="warning"
  description="Storage is almost full."
  icon={<CloudIcon />}
  action={{ label: 'Manage', onPress: openStorage }}
/>
```
