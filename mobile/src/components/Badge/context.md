# Badge

Compact status pill. Optionally displays a colored dot before the label.

## Exports
`Badge`, `BadgeProps`, `BadgeVariant`, `BadgeSize`

## Props

| Prop       | Type          | Default   |
|------------|---------------|-----------|
| `variant`  | `BadgeVariant`| `default` |
| `size`     | `BadgeSize`   | `md`      |
| `dot`      | `boolean`     | `false`   |
| `children` | `ReactNode`   | — (required)|
| `style`    | `ViewStyle`   | —         |

## Variants

| Variant   | Background                  | Border                       | Text          |
|-----------|-----------------------------|------------------------------|---------------|
| `default` | `neutral800`                | `border`                     | `textSecondary`|
| `brand`   | `rgba(124,58,237,0.15)`     | `rgba(109,40,217,0.4)`       | `violet200`   |
| `success` | `successBg`                 | `rgba(16,185,129,0.3)`       | `successLt`   |
| `warning` | `warningBg`                 | `rgba(245,158,11,0.3)`       | `warningLt`   |
| `error`   | `errorBg`                   | `rgba(239,68,68,0.3)`        | `errorLt`     |
| `info`    | `infoBg`                    | `rgba(6,182,212,0.3)`        | `infoLt`      |
| `outline` | `transparent`               | `borderStrong`               | `textSecondary`|

## Sizes

| Size | Height | PaddingH | FontSize | DotSize |
|------|--------|----------|----------|---------|
| `sm` | 18     | 6        | 10       | 4       |
| `md` | 22     | 8        | 11       | 5       |
| `lg` | 26     | 10       | 13       | 6       |

## Behaviour
- `borderRadius: radii.full` (pill shape)
- `alignSelf: flex-start` by default
- Font weight: `medium`
- Dot color matches the text color of the variant

## Usage

```tsx
import { Badge } from '@neo/mobile';

<Badge>Default</Badge>
<Badge variant="brand" dot>New</Badge>
<Badge variant="success" size="sm">Active</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="warning" size="lg">Review</Badge>
<Badge variant="outline">Draft</Badge>
```
