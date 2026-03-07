# Avatar / AvatarGroup

Circular avatar with image, name-initials fallback, and status indicator. `AvatarGroup` stacks avatars with overlap.

## Exports
`Avatar`, `AvatarGroup`, `AvatarProps`, `AvatarSize`, `AvatarStatus`

## Avatar Props

| Prop     | Type           | Default | Notes                                             |
|----------|----------------|---------|---------------------------------------------------|
| `src`    | `string`       | —       | Image URI; takes priority over `name`             |
| `name`   | `string`       | —       | Generates initials + deterministic violet shade   |
| `size`   | `AvatarSize`   | `md`    |                                                   |
| `status` | `AvatarStatus` | —       | Renders a status dot at bottom-right              |
| `style`  | `ViewStyle`    | —       |                                                   |

## AvatarGroup Props

| Prop      | Type           | Default | Notes                      |
|-----------|----------------|---------|----------------------------|
| `avatars` | `AvatarProps[]`| — (required) |                      |
| `max`     | `number`       | `4`     | Excess shown as "+N" badge |
| `size`    | `AvatarSize`   | `md`    |                            |

## Size Map (dp)

| Size  | px |
|-------|----|
| `xs`  | 24 |
| `sm`  | 32 |
| `md`  | 40 |
| `lg`  | 48 |
| `xl`  | 64 |
| `2xl` | 80 |

Font size: `Math.round(px * 0.34)`. Status dot: `Math.round(px * 0.28)`.

## Status Colors

| Status    | Color       |
|-----------|-------------|
| `online`  | `success` (#10B981) |
| `offline` | `neutral500` (#55556E) |
| `busy`    | `error` (#EF4444) |
| `away`    | `warning` (#F59E0B) |

## Behaviour
- `src` → renders `<Image>`
- No `src`, has `name` → renders initials view with `getColorFromName(name)` (deterministic from `charCodeAt(0) % 5` across violet shades)
- Neither → renders `bgMuted` placeholder
- `borderWidth: 1.5`, `borderColor: border` on all sizes
- `AvatarGroup` overlap: `marginLeft: -Math.round(px * 0.5)` per item; "+N" badge uses `neutral800` bg
- In `AvatarGroup`, individual avatars get `borderWidth: 2, borderColor: bgBase` to create separation

## Usage

```tsx
import { Avatar, AvatarGroup } from '@neo/mobile';

<Avatar name="Jane Smith" size="md" status="online" />
<Avatar src="https://cdn.example.com/avatar.jpg" size="xl" />
<Avatar size="sm" />  {/* placeholder */}

<AvatarGroup
  avatars={[
    { name: 'Alice', status: 'online' },
    { name: 'Bob' },
    { src: 'https://cdn.example.com/carol.jpg', name: 'Carol' },
  ]}
  max={3}
  size="sm"
/>
```
