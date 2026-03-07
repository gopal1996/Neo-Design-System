# Text

Typography component wrapping React Native `Text`. Covers all Neo type scales and semantic colors.

## Exports
`Text`, `TextProps`, `TextVariant`, `TextColor`

## Props

| Prop       | Type          | Default     |
|------------|---------------|-------------|
| `variant`  | `TextVariant` | `body`      |
| `color`    | `TextColor`   | `primary`   |
| `children` | `ReactNode`   | — (required)|
| `style`    | `TextStyle`   | —           |

Passes all `TextProps` to the underlying `<Text>`.

## Variant Styles

| Variant    | FontSize | Weight | LineHeight | LetterSpacing  | Notes                |
|------------|----------|--------|------------|----------------|----------------------|
| `display`  | 48       | 800    | 52         | −2             | Hero headlines       |
| `h1`       | 36       | 700    | 40         | −1.2           | Page titles          |
| `h2`       | 30       | 700    | 36         | −0.8           | Section headings     |
| `h3`       | 24       | 600    | 30         | −0.4           | Card/panel titles    |
| `h4`       | 20       | 600    | 26         | −0.3           | Widget titles        |
| `h5`       | 18       | 600    | 24         | −0.2           | Subsection titles    |
| `body-lg`  | 18       | 400    | 28         | —              | Lead body text       |
| `body`     | 16       | 400    | 24         | —              | Default body copy    |
| `body-sm`  | 14       | 400    | 20         | —              | Secondary body       |
| `caption`  | 12       | 400    | 16         | +0.2           | Captions, metadata   |
| `overline` | 11       | 600    | 16         | +1.2           | Labels (UPPERCASE)   |
| `mono`     | 14       | 400    | —          | —              | Code, monospace font |

## Color Map

| Color       | Token            | Hex       |
|-------------|------------------|-----------|
| `primary`   | `textPrimary`    | `#F0F0F8` |
| `secondary` | `textSecondary`  | `#9898B3` |
| `tertiary`  | `textTertiary`   | `#6B6B8A` |
| `brand`     | `textBrand`      | `#A78BFA` |
| `success`   | `success`        | `#10B981` |
| `warning`   | `warning`        | `#F59E0B` |
| `error`     | `error`          | `#EF4444` |
| `info`      | `info`           | `#06B6D4` |

## Usage

```tsx
import { Text } from '@neo/mobile';

<Text variant="h2">Dashboard</Text>
<Text variant="body" color="secondary">Supporting copy here.</Text>
<Text variant="overline" color="brand">Section Label</Text>
<Text variant="caption" color="tertiary">Last updated 2h ago</Text>
<Text variant="mono" color="primary">const x = 42;</Text>
```
