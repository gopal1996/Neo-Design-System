import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Textarea, MarkdownRenderer } from './Textarea';
import { colors, spacing, typography } from '../../tokens';

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={s.section}>
    <Text style={s.sectionLabel}>{title}</Text>
    {children}
  </View>
);

// ─── Sample markdown ──────────────────────────────────────────────────────────

const SAMPLE_MD = `# Welcome to Neo Textarea

## Inline formatting

This is **bold**, *italic*, and ***bold italic*** text.
You can also use ~~strikethrough~~ and \`inline code\`.

## Lists

Unordered:
- First item
- Second item
- Third item with **emphasis**

Ordered:
1. Step one
2. Step two
3. Step three

## Blockquote

> Neo is a dark-mode-first design system built on a Black & Violet palette.
> It ships React and React Native components that share a common token layer.

## Code block

\`\`\`typescript
const greet = (name: string) => {
  return \`Hello, \${name}!\`;
};
\`\`\`

## Links

Visit [Neo Design System](https://example.com) for documentation.

---

That's all the supported syntax!`;

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  decorators: [
    Story => (
      <ScrollView
        style={s.screen}
        contentContainerStyle={s.container}
        keyboardShouldPersistTaps="handled"
      >
        <Story />
      </ScrollView>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Textarea>;

// ─── 1. Basic ─────────────────────────────────────────────────────────────────

export const Basic: Story = {
  render: () => {
    const [v, setV] = useState('');
    return (
      <Section title="Basic">
        <Textarea
          label="Description"
          placeholder="Write something…"
          value={v}
          onChangeText={setV}
          hint="Plain textarea with auto-grow"
          fullWidth
        />
      </Section>
    );
  },
};

// ─── 2. Sizes ─────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => {
    const [v, setV] = useState('');
    return (
      <Section title="Sizes">
        <Textarea label="Small"  size="sm" value={v} onChangeText={setV} placeholder="sm…" fullWidth />
        <Textarea label="Medium" size="md" value={v} onChangeText={setV} placeholder="md…" fullWidth />
        <Textarea label="Large"  size="lg" value={v} onChangeText={setV} placeholder="lg…" fullWidth />
      </Section>
    );
  },
};

// ─── 3. minRows / maxRows ────────────────────────────────────────────────────

export const RowControl: Story = {
  render: () => {
    const [v, setV] = useState('');
    return (
      <Section title="minRows / maxRows">
        <Textarea
          label="minRows={2}"
          minRows={2}
          value={v}
          onChangeText={setV}
          placeholder="Minimum 2 rows"
          fullWidth
        />
        <Textarea
          label="minRows={5}"
          minRows={5}
          value={v}
          onChangeText={setV}
          placeholder="Always 5 rows tall"
          fullWidth
        />
        <Textarea
          label="maxRows={4} — scrolls when full"
          minRows={3}
          maxRows={4}
          value={v}
          onChangeText={setV}
          placeholder="Stops growing at 4 rows"
          fullWidth
        />
      </Section>
    );
  },
};

// ─── 4. autoGrow disabled ────────────────────────────────────────────────────

export const FixedHeight: Story = {
  render: () => {
    const [v, setV] = useState('');
    return (
      <Section title="autoGrow={false} — fixed height">
        <Textarea
          label="Fixed 5 rows"
          minRows={5}
          autoGrow={false}
          value={v}
          onChangeText={setV}
          placeholder="Height stays fixed, content scrolls"
          fullWidth
        />
      </Section>
    );
  },
};

// ─── 5. Required ─────────────────────────────────────────────────────────────

export const Required: Story = {
  render: () => {
    const [v, setV] = useState('');
    return (
      <Section title="required">
        <Textarea
          label="Cover letter"
          required
          value={v}
          onChangeText={setV}
          placeholder="Required field — notice the * on the label"
          fullWidth
        />
      </Section>
    );
  },
};

// ─── 6. States ───────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <Section title="States">
      <Textarea
        label="Error state"
        error="This field is required"
        value=""
        onChangeText={() => {}}
        fullWidth
      />
      <Textarea
        label="Disabled"
        editable={false}
        value="You cannot edit this text."
        onChangeText={() => {}}
        fullWidth
      />
      <Textarea
        label="With hint"
        hint="Markdown is supported"
        value=""
        onChangeText={() => {}}
        placeholder="Enter a description…"
        fullWidth
      />
    </Section>
  ),
};

// ─── 7. Character count ───────────────────────────────────────────────────────

export const CharCount: Story = {
  render: () => {
    const [a, setA] = useState('');
    const [b, setB] = useState('');
    const [c, setC] = useState('');
    return (
      <Section title="Character counter">
        <Textarea
          label="Unlimited with counter"
          showCount
          value={a}
          onChangeText={setA}
          placeholder="Characters count up…"
          fullWidth
        />
        <Textarea
          label="maxLength={120}"
          maxLength={120}
          value={b}
          onChangeText={setB}
          placeholder="Stops at 120 characters"
          hint="Counter shown automatically with maxLength"
          fullWidth
        />
        <Textarea
          label="Over the limit style"
          maxLength={20}
          showCount
          value={c}
          onChangeText={setC}
          placeholder="Try typing more than 20 chars"
          fullWidth
        />
      </Section>
    );
  },
};

// ─── 8. Markdown — basic ─────────────────────────────────────────────────────

export const MarkdownBasic: Story = {
  render: () => {
    const [v, setV] = useState('Type **bold**, *italic*, or `code` here.\n\n- List item\n- Another item');
    return (
      <Section title="Markdown mode">
        <Textarea
          label="Notes"
          markdown
          value={v}
          onChangeText={setV}
          placeholder="Write markdown…"
          minRows={4}
          hint="Use the toolbar or type markdown syntax directly. Switch to Preview to see the result."
          fullWidth
        />
      </Section>
    );
  },
};

// ─── 9. Markdown — full sample ────────────────────────────────────────────────

export const MarkdownFull: Story = {
  render: () => {
    const [v, setV] = useState(SAMPLE_MD);
    return (
      <Section title="Markdown — full syntax demo">
        <Textarea
          label="Article"
          markdown
          initialMode="preview"
          value={v}
          onChangeText={setV}
          minRows={6}
          showCount
          hint="Switch to Edit to modify the content"
          fullWidth
        />
      </Section>
    );
  },
};

// ─── 10. Markdown — empty preview ────────────────────────────────────────────

export const MarkdownEmptyPreview: Story = {
  render: () => {
    const [v, setV] = useState('');
    return (
      <Section title="Markdown — empty preview state">
        <Textarea
          label="Bio"
          markdown
          initialMode="preview"
          value={v}
          onChangeText={setV}
          placeholder="Start writing your bio…"
          fullWidth
        />
      </Section>
    );
  },
};

// ─── 11. Markdown — disabled ─────────────────────────────────────────────────

export const MarkdownDisabled: Story = {
  render: () => (
    <Section title="Markdown — disabled (toolbar hidden)">
      <Textarea
        label="Read-only notes"
        markdown
        editable={false}
        value={SAMPLE_MD}
        onChangeText={() => {}}
        minRows={4}
        fullWidth
      />
    </Section>
  ),
};

// ─── 12. Standalone MarkdownRenderer ─────────────────────────────────────────

export const StandaloneRenderer: Story = {
  render: () => (
    <Section title="Standalone MarkdownRenderer">
      <View style={{ backgroundColor: colors.bgElevated, borderRadius: 12, padding: spacing[4], borderWidth: 1, borderColor: colors.border }}>
        <MarkdownRenderer
          text={`## Release notes v2.1\n\n- **New:** Select component with datasource support\n- **New:** Accordion with \`renderHeader\` escape hatch\n- **Fix:** DatePicker week number alignment\n- *Breaking:* \`Button\` size \`'xl'\` now requires explicit width\n\n\`\`\`bash\nnpm install @neo-design-library/mobile@2.1.0\n\`\`\`\n\n> Upgrade guide available on [docs.example.com](https://example.com).`}
        />
      </View>
    </Section>
  ),
};

// ─── 13. All markdown syntax ─────────────────────────────────────────────────

export const AllMarkdownSyntax: Story = {
  render: () => {
    const syntax = [
      { title: 'Bold',           sample: '**bold text**' },
      { title: 'Italic',         sample: '*italic text*' },
      { title: 'Bold italic',    sample: '***bold italic***' },
      { title: 'Strikethrough',  sample: '~~struck~~' },
      { title: 'Inline code',    sample: '`code`' },
      { title: 'Link',           sample: '[label](https://example.com)' },
      { title: 'Heading 1',      sample: '# H1 heading' },
      { title: 'Heading 2',      sample: '## H2 heading' },
      { title: 'Heading 3',      sample: '### H3 heading' },
      { title: 'Blockquote',     sample: '> Quoted text here' },
      { title: 'Bullet list',    sample: '- Item A\n- Item B\n- Item C' },
      { title: 'Ordered list',   sample: '1. Step one\n2. Step two\n3. Step three' },
      { title: 'Code block',     sample: '```js\nconst x = 1;\n```' },
      { title: 'Divider',        sample: '---' },
    ];

    return (
      <Section title="Markdown syntax reference">
        {syntax.map(({ title, sample }) => (
          <View key={title} style={s.syntaxRow}>
            <Text style={s.syntaxTitle}>{title}</Text>
            <View style={s.syntaxPreview}>
              <MarkdownRenderer text={sample} />
            </View>
          </View>
        ))}
      </Section>
    );
  },
};

// ─── 14. Kitchen sink ────────────────────────────────────────────────────────

export const KitchenSink: Story = {
  render: () => {
    const [bio,  setBio]  = useState('');
    const [note, setNote] = useState('## My note\n\nStart editing here.');
    return (
      <>
        <Section title="Required + error + count">
          <Textarea
            label="Bio"
            required
            error="Bio is required"
            maxLength={200}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself…"
            minRows={3}
            maxRows={6}
            fullWidth
          />
        </Section>
        <Section title="Markdown + count + required">
          <Textarea
            label="Release notes"
            required
            markdown
            showCount
            maxLength={2000}
            value={note}
            onChangeText={setNote}
            minRows={5}
            hint="Supports full markdown syntax"
            fullWidth
          />
        </Section>
      </>
    );
  },
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: colors.bgBase },
  container: { padding: spacing[6], gap: spacing[6], paddingBottom: spacing[16] },
  section:   { gap: spacing[4] },
  sectionLabel: {
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  syntaxRow: {
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  syntaxTitle: { fontSize: 11, color: colors.textTertiary, fontWeight: typography.fontWeight.semibold, textTransform: 'uppercase', letterSpacing: 0.5 },
  syntaxPreview: { paddingHorizontal: spacing[2] },
});
