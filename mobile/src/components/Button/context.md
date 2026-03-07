# Button

Interactive touchable element. Extends `TouchableOpacityProps`. Uses `React.forwardRef`.

## Exports
`Button`, `ButtonProps`, `ButtonVariant`, `ButtonSize`

## Props

| Prop        | Type                                         | Default     | Notes                          |
|-------------|----------------------------------------------|-------------|--------------------------------|
| `variant`   | `primary\|secondary\|ghost\|danger\|success` | `primary`   |                                |
| `size`      | `xs\|sm\|md\|lg\|xl`                         | `md`        |                                |
| `loading`   | `boolean`                                    | `false`     | Shows `ActivityIndicator`      |
| `iconLeft`  | `ReactNode`                                  | —           | Sized to match the size token  |
| `iconRight` | `ReactNode`                                  | —           |                                |
| `fullWidth` | `boolean`                                    | `false`     | Sets `width: '100%'`           |
| `disabled`  | `boolean`                                    | `false`     | Also set by `loading`          |
| `children`  | `ReactNode`                                  | —           |                                |
| `style`     | `ViewStyle`                                  | —           |                                |

## Size Map

| Size | Height | PaddingH | FontSize | IconSize |
|------|--------|----------|----------|----------|
| `xs` | 28     | 10       | 11       | 12       |
| `sm` | 32     | 12       | 13       | 14       |
| `md` | 40     | 16       | 14       | 16       |
| `lg` | 48     | 20       | 16       | 18       |
| `xl` | 56     | 24       | 17       | 20       |

## Variant Colors

| Variant     | Background                  | Border                      | Text              |
|-------------|-----------------------------|-----------------------------|-------------------|
| `primary`   | `violet500`                 | `violet500`                 | `#FFFFFF`         |
| `secondary` | `rgba(124,58,237,0.10)`     | `violet600`                 | `violet300`       |
| `ghost`     | `transparent`               | `transparent`               | `textSecondary`   |
| `danger`    | `rgba(239,68,68,0.10)`      | `rgba(239,68,68,0.4)`       | `errorLt`         |
| `success`   | `rgba(16,185,129,0.10)`     | `rgba(16,185,129,0.4)`      | `successLt`       |

## Behaviour
- Disabled or loading → `opacity: 0.4`, `disabled={true}` on `TouchableOpacity`
- `activeOpacity: 0.75`
- `borderRadius: radii.lg` (12dp)
- `borderWidth: 1`
- Label: `fontWeight: semibold`, `letterSpacing: -0.1`

## Usage

```tsx
import { Button } from '@neo/mobile';

<Button>Save</Button>
<Button variant="secondary" size="sm">Cancel</Button>
<Button variant="danger" loading={isDeleting}>Delete</Button>
<Button variant="ghost" iconLeft={<ChevronIcon />}>Back</Button>
<Button fullWidth size="lg">Continue</Button>
```
