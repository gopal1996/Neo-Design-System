# Card

Surface container. `interactive` mode renders as `TouchableOpacity`. Includes `CardHeader`, `CardBody`, `CardFooter` sub-components.

## Exports
`Card`, `CardHeader`, `CardBody`, `CardFooter`, `CardProps`, `CardVariant`

## Card Props

| Prop          | Type                              | Default     |
|---------------|-----------------------------------|-------------|
| `variant`     | `default\|elevated\|brand\|flat`  | `default`   |
| `interactive` | `boolean`                         | `false`     |
| `padding`     | `none\|sm\|md\|lg\|xl`            | `md`        |
| `children`    | `ReactNode`                       | — (required)|
| `onPress`     | `() => void`                      | —           |
| `style`       | `ViewStyle`                       | —           |

## Variants

| Variant    | Background              | Border                    |
|------------|-------------------------|---------------------------|
| `default`  | `bgElevated` (#0F0F1A)  | `border` (#2C2C4A)        |
| `elevated` | `bgOverlay` (#13131F)   | `border` (#2C2C4A)        |
| `brand`    | `rgba(124,58,237,0.06)` | `rgba(109,40,217,0.30)`   |
| `flat`     | `bgMuted` (#1A1A2E)     | `borderSubtle` (#1E1E35)  |

## Padding Map (dp)

| Value  | dp |
|--------|----|
| `none` | 0  |
| `sm`   | 12 |
| `md`   | 16 |
| `lg`   | 24 |
| `xl`   | 32 |

## Sub-components

All accept `children: ReactNode` and `style?: ViewStyle`.

| Sub-component | Layout details                                                   |
|---------------|------------------------------------------------------------------|
| `CardHeader`  | `flexDirection: row`, `alignItems: center`, `gap: 12`, `paddingTop+paddingHorizontal: 16` |
| `CardBody`    | `padding: 16`                                                    |
| `CardFooter`  | `flexDirection: row`, `alignItems: center`, `gap: 8`, `paddingHorizontal+paddingVertical: 16`, `borderTopWidth: hairlineWidth` in `borderSubtle` |

## Behaviour
- `borderRadius: radii.xl` (16dp), `borderWidth: 1`, `overflow: hidden`
- `interactive={true}` → `TouchableOpacity`, `activeOpacity: 0.8`, `accessibilityRole="button"`
- Padding applies to the root Card; sub-components provide their own inner padding

## Usage

```tsx
import { Card, CardHeader, CardBody, CardFooter, Text, Button } from '@neo/mobile';

<Card>
  <CardHeader>
    <Text variant="h4">Title</Text>
  </CardHeader>
  <CardBody>
    <Text color="secondary">Some content inside the card.</Text>
  </CardBody>
  <CardFooter>
    <Button size="sm" variant="ghost">Cancel</Button>
    <Button size="sm">Confirm</Button>
  </CardFooter>
</Card>

<Card variant="brand" padding="lg">
  <Text variant="h3">Featured</Text>
</Card>

<Card interactive onPress={() => navigate('detail')} variant="elevated">
  <CardBody><Text>Tap me</Text></CardBody>
</Card>
```
