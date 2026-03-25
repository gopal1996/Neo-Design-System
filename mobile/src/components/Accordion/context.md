# Accordion

Animated collapsible panels for React Native. Smooth height animation, four visual variants, and deep customisation at both the group and item level.

## Basic usage

```tsx
import { Accordion, AccordionItem } from '@neo-design-library/mobile';

<Accordion>
  <AccordionItem id="q1" title="What is Neo?">
    <Text>Neo is a dark-mode-first React Native design system.</Text>
  </AccordionItem>
  <AccordionItem id="q2" title="How do I install it?">
    <Text>npm install @neo-design-library/mobile</Text>
  </AccordionItem>
</Accordion>
```

---

## Accordion props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'separated' \| 'bordered' \| 'ghost'` | `'default'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Scales header height, font, padding, icon |
| `multiple` | `boolean` | `false` | Allow many panels open simultaneously |
| `defaultOpen` | `string[]` | `[]` | Uncontrolled initial open IDs |
| `openIds` | `string[]` | — | Controlled open IDs |
| `onChange` | `(ids: string[]) => void` | — | Called when open set changes |
| `iconPlacement` | `'left' \| 'right' \| 'none'` | `'right'` | Default expand icon position for all items |
| `icon` | `ReactNode` | chevron | Replace the default chevron for all items |
| `divider` | `boolean` | true for default/bordered | Show dividers between items |
| `style` | `ViewStyle` | — | Container style override |

---

## AccordionItem props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` *(required)* | `string` | — | Unique identifier |
| `title` *(required)* | `string \| ReactNode` | — | Header title — string for simple, ReactNode for custom layout |
| `subtitle` | `string` | — | Secondary line below the title |
| `badge` | `string \| number` | — | Violet pill badge next to the title |
| `headerLeft` | `ReactNode` | — | Leading icon/avatar slot in the header |
| `iconPlacement` | `'left' \| 'right' \| 'none'` | inherits parent | Override icon placement for this item |
| `icon` | `ReactNode` | inherits parent | Override expand icon for this item |
| `renderHeader` | `(props) => ReactNode` | — | Full render-prop escape hatch for the entire header row |
| `disabled` | `boolean` | `false` | Prevent expansion |
| `defaultOpen` | `boolean` | `false` | Uncontrolled initial open state for this item |
| `contentPadding` | `boolean` | `true` | Toggle default padding in the content area |
| `style` | `ViewStyle` | — | Root wrapper style |
| `headerStyle` | `ViewStyle` | — | Header row style |
| `contentStyle` | `ViewStyle` | — | Content wrapper style |

---

## Variants

```tsx
<Accordion variant="default">   // Contained card, dividers between items
<Accordion variant="separated"> // Each item is its own card (gap between)
<Accordion variant="bordered">  // Contained, heavier 1.5px border
<Accordion variant="ghost">     // No background, no border — pure layout
```

---

## Icon customisation

```tsx
// Move chevron to the left
<Accordion iconPlacement="left">

// Remove expand indicator entirely
<Accordion iconPlacement="none">

// Replace the default chevron for all items
<Accordion icon={<PlusIcon />}>

// Override per-item
<AccordionItem id="x" icon={<StarIcon />} iconPlacement="left">
```

The custom icon is wrapped in an `Animated.View` that rotates 180° on open — design your icon to look correct at 0° (closed) and 180° (open).

---

## renderHeader escape hatch

When `renderHeader` is provided, the built-in header layout is bypassed entirely. You receive `{ isOpen, toggle, disabled }` and are responsible for calling `toggle()` on press. The content area below is still animated by the Accordion.

```tsx
<AccordionItem
  id="custom"
  title="ignored"
  renderHeader={({ isOpen, toggle }) => (
    <TouchableOpacity onPress={toggle} style={myHeaderStyle}>
      <Text>{isOpen ? 'Collapse' : 'Expand'}</Text>
    </TouchableOpacity>
  )}
>
  <Text>Content is still animated</Text>
</AccordionItem>
```

---

## Controlled mode

```tsx
const [openIds, setOpenIds] = useState<string[]>(['faq-1']);

<Accordion multiple openIds={openIds} onChange={setOpenIds}>
  <AccordionItem id="faq-1" title="…">…</AccordionItem>
  <AccordionItem id="faq-2" title="…">…</AccordionItem>
</Accordion>
```

---

## Notes

- Height animation measures actual content height via `onLayout` — no `maxHeight` hacks, so the animation is always exact.
- `defaultOpen` on both `Accordion` and `AccordionItem` only takes effect once at mount (uncontrolled).
- `multiple={false}` (default) collapses the current panel before opening a new one.
- The `ghost` variant works well inside existing `Card` or drawer components.
