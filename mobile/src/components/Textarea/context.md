# Textarea

A multi-line text field with auto-grow, character counting, and an optional markdown mode (toolbar + live preview).

## Basic usage

```tsx
import { Textarea, MarkdownRenderer } from '@neo-design-library/mobile';

// Plain textarea
<Textarea
  label="Description"
  value={text}
  onChangeText={setText}
  placeholder="Write something…"
/>

// Markdown editor
<Textarea
  label="Notes"
  markdown
  value={text}
  onChangeText={setText}
/>

// Standalone markdown renderer (read-only display)
<MarkdownRenderer text={markdownString} />
```

---

## Props

### Value

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Controlled value |
| `defaultValue` | `string` | `''` | Uncontrolled initial value |
| `onChangeText` | `(t: string) => void` | — | Change callback |

### Field UI

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Field label |
| `placeholder` | `string` | — | Input placeholder |
| `hint` | `string` | — | Helper text below the field |
| `error` | `string` | — | Error message (overrides hint) |
| `required` | `boolean` | `false` | Appends * to the label |
| `editable` | `boolean` | `true` | `false` = disabled appearance |

### Size & height

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Font and padding scale |
| `minRows` | `number` | `3` | Minimum visible rows |
| `maxRows` | `number` | — | Rows cap — content scrolls beyond this |
| `autoGrow` | `boolean` | `true` | Expand height as content grows |

### Limits

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxLength` | `number` | — | Hard character limit |
| `showCount` | `boolean` | auto | Show character counter. Auto-enabled when `maxLength` is set |

### Markdown

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `markdown` | `boolean` | `false` | Enable toolbar + Edit/Preview toggle |
| `initialMode` | `'edit' \| 'preview'` | `'edit'` | Starting panel |
| `onModeChange` | `(mode) => void` | — | Called when the user switches panels |

### Layout

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fullWidth` | `boolean` | `false` | 100% width |
| `style` | `ViewStyle` | — | Wrapper style |
| `inputStyle` | `TextStyle` | — | Applied directly to the `TextInput` |

---

## Markdown syntax

| Syntax | Output |
|--------|--------|
| `**text**` | **bold** |
| `*text*` or `_text_` | *italic* |
| `***text***` | ***bold italic*** |
| `` `code` `` | inline code |
| `~~text~~` | ~~strikethrough~~ |
| `[label](url)` | link |
| `# H1`, `## H2`, `### H3` | headings |
| `> text` | blockquote |
| `- item` | unordered list |
| `1. item` | ordered list |
| ` ``` ` … ` ``` ` | fenced code block |
| `---` | horizontal rule |

### Toolbar

The toolbar injects syntax at the current cursor position. If text is selected, inline formatting wraps the selection. Block-level items (H1–H3, blockquote, lists) are inserted at the start of the current line.

---

## MarkdownRenderer

A standalone component that renders a markdown string as styled React Native nodes. Use it wherever you need to display read-only formatted content.

```tsx
<MarkdownRenderer text={markdownString} style={{ padding: 16 }} />
```

Props:

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | Raw markdown string |
| `style` | `ViewStyle` | Outer wrapper style |

---

## Notes

- `autoGrow` uses `onContentSizeChange` under the hood — no fixed height needed.
- When `maxRows` is set, the field scrolls internally after the cap is reached.
- The markdown toolbar is hidden when `editable={false}`.
- In Preview mode, if the content is empty, the `placeholder` string is shown italicised.
- `showCount` turns red when `maxLength` is exceeded (visual feedback only — the TextInput hard-stops at `maxLength`).
