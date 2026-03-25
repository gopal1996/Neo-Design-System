/**
 * Neo Textarea — React Native
 *
 * Features
 *   autoGrow        Expands height as the user types (respects minRows / maxRows)
 *   minRows         Minimum visible rows (default 3)
 *   maxRows         Maximum rows before the field scrolls
 *   required        Appends * to label
 *   showCount       Character counter (auto-enabled when maxLength is set)
 *   label / hint / error / placeholder / disabled
 *
 * Markdown mode (markdown prop)
 *   Toolbar         Bold · Italic · Strikethrough · Inline-code · H1-H3 ·
 *                   Blockquote · Unordered list · Ordered list · Code-block · HR
 *   Preview         Renders the raw markdown text as styled React Native nodes
 *   MarkdownRenderer  Exported standalone — use anywhere you need markdown output
 */
import React, {
  useCallback,
  useRef,
  useState,
  type ComponentRef,
} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { colors, radii, spacing, typography } from '../../tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaMode = 'edit' | 'preview';

export interface TextareaProps
  extends Omit<TextInputProps, 'style' | 'multiline' | 'numberOfLines'> {
  // ── Value ─────────────────────────────────────────────────────────────────
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;

  // ── Field UI ──────────────────────────────────────────────────────────────
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  /** Appends * to the label and sets accessibilityRequired */
  required?: boolean;

  // ── Size & height ─────────────────────────────────────────────────────────
  size?: TextareaSize;
  /** Minimum visible rows (default 3) */
  minRows?: number;
  /** Maximum rows before the field scrolls internally */
  maxRows?: number;
  /** Expand height as content grows (default true) */
  autoGrow?: boolean;

  // ── Limits ────────────────────────────────────────────────────────────────
  maxLength?: number;
  /** Show character counter — auto-enabled when maxLength is provided */
  showCount?: boolean;

  // ── Markdown ──────────────────────────────────────────────────────────────
  /** Enable markdown toolbar + preview toggle */
  markdown?: boolean;
  /** Starting mode when markdown is enabled (default 'edit') */
  initialMode?: TextareaMode;
  /** Called when the user switches between edit and preview */
  onModeChange?: (mode: TextareaMode) => void;

  // ── Layout ────────────────────────────────────────────────────────────────
  fullWidth?: boolean;
  style?: ViewStyle;
  /** Extra style applied directly to the TextInput */
  inputStyle?: TextStyle;
}

// ─── Size config ──────────────────────────────────────────────────────────────

interface SizeCfg {
  fontSize:   number;
  lineH:      number;
  ph:         number;
  pv:         number;
  labelFs:    number;
}

const SIZE: Record<TextareaSize, SizeCfg> = {
  sm: { fontSize: 13, lineH: 20, ph: spacing[3], pv: spacing[2],  labelFs: 13 },
  md: { fontSize: 14, lineH: 22, ph: spacing[4], pv: spacing[3],  labelFs: 14 },
  lg: { fontSize: 16, lineH: 24, ph: spacing[4], pv: spacing[4],  labelFs: 14 },
};

// ─── Markdown parser ──────────────────────────────────────────────────────────

type Span =
  | { t: 'text';          content: string }
  | { t: 'bold';          content: string }
  | { t: 'italic';        content: string }
  | { t: 'bold-italic';   content: string }
  | { t: 'code';          content: string }
  | { t: 'strike';        content: string }
  | { t: 'link';          text: string; url: string };

type Block =
  | { b: 'heading';  level: 1 | 2 | 3; spans: Span[] }
  | { b: 'para';     spans: Span[] }
  | { b: 'quote';    lines: string[] }
  | { b: 'ul';       items: Span[][] }
  | { b: 'ol';       items: Span[][] }
  | { b: 'code';     code: string; lang: string }
  | { b: 'divider' }
  | { b: 'blank' };

const INLINE_RE =
  /(\*\*\*(.+?)\*\*\*)|(\*\*(.+?)\*\*)|(\*(.+?)\*)|(_(.+?)_)|(~~(.+?)~~)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))/gs;

function parseInline(text: string): Span[] {
  const spans: Span[] = [];
  let last = 0;
  INLINE_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = INLINE_RE.exec(text)) !== null) {
    if (m.index > last) spans.push({ t: 'text', content: text.slice(last, m.index) });
    if      (m[1])  spans.push({ t: 'bold-italic', content: m[2] });
    else if (m[3])  spans.push({ t: 'bold',        content: m[4] });
    else if (m[5])  spans.push({ t: 'italic',      content: m[6] });
    else if (m[7])  spans.push({ t: 'italic',      content: m[8] });
    else if (m[9])  spans.push({ t: 'strike',      content: m[10] });
    else if (m[11]) spans.push({ t: 'code',        content: m[12] });
    else if (m[13]) spans.push({ t: 'link',        text: m[14], url: m[15] });
    last = INLINE_RE.lastIndex;
  }
  if (last < text.length) spans.push({ t: 'text', content: text.slice(last) });
  return spans.length ? spans : [{ t: 'text', content: text }];
}

export function parseMarkdown(raw: string): Block[] {
  const lines = raw.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) { code.push(lines[i]); i++; }
      blocks.push({ b: 'code', code: code.join('\n'), lang });
      i++; continue;
    }

    // ATX heading
    const hm = line.match(/^(#{1,3})\s+(.*)/);
    if (hm) {
      blocks.push({ b: 'heading', level: hm[1].length as 1|2|3, spans: parseInline(hm[2]) });
      i++; continue;
    }

    // Setext headings
    if (i + 1 < lines.length) {
      if (/^={2,}$/.test(lines[i + 1])) { blocks.push({ b: 'heading', level: 1, spans: parseInline(line) }); i += 2; continue; }
      if (/^-{2,}$/.test(lines[i + 1]) && line.trim()) { blocks.push({ b: 'heading', level: 2, spans: parseInline(line) }); i += 2; continue; }
    }

    // Horizontal rule
    if (/^(\s*[-*_]){3,}\s*$/.test(line)) { blocks.push({ b: 'divider' }); i++; continue; }

    // Blockquote
    if (line.startsWith('>')) {
      const qlines: string[] = [line.replace(/^>\s?/, '')];
      while (i + 1 < lines.length && lines[i + 1].startsWith('>')) { i++; qlines.push(lines[i].replace(/^>\s?/, '')); }
      blocks.push({ b: 'quote', lines: qlines });
      i++; continue;
    }

    // Unordered list
    if (/^[-*+]\s+/.test(line)) {
      const items: Span[][] = [parseInline(line.replace(/^[-*+]\s+/, ''))];
      while (i + 1 < lines.length && /^[-*+]\s+/.test(lines[i + 1])) { i++; items.push(parseInline(lines[i].replace(/^[-*+]\s+/, ''))); }
      blocks.push({ b: 'ul', items });
      i++; continue;
    }

    // Ordered list
    const olm = line.match(/^(\d+)[.)]\s+(.*)/);
    if (olm) {
      const items: Span[][] = [parseInline(olm[2])];
      let num = parseInt(olm[1], 10) + 1;
      while (i + 1 < lines.length) {
        const nm = lines[i + 1].match(/^(\d+)[.)]\s+(.*)/);
        if (!nm) break;
        i++; items.push(parseInline(nm[2])); num++;
      }
      blocks.push({ b: 'ol', items });
      i++; continue;
    }

    // Blank
    if (!line.trim()) { blocks.push({ b: 'blank' }); i++; continue; }

    // Paragraph
    blocks.push({ b: 'para', spans: parseInline(line) });
    i++;
  }

  return blocks;
}

// ─── MarkdownRenderer ─────────────────────────────────────────────────────────

export interface MarkdownRendererProps {
  text: string;
  style?: ViewStyle;
}

const renderSpans = (spans: Span[]) =>
  spans.map((sp, k) => {
    switch (sp.t) {
      case 'bold':       return <Text key={k} style={mr.bold}>{sp.content}</Text>;
      case 'italic':     return <Text key={k} style={mr.italic}>{sp.content}</Text>;
      case 'bold-italic':return <Text key={k} style={mr.boldItalic}>{sp.content}</Text>;
      case 'code':       return <Text key={k} style={mr.inlineCode}>{sp.content}</Text>;
      case 'strike':     return <Text key={k} style={mr.strike}>{sp.content}</Text>;
      case 'link':       return <Text key={k} style={mr.link}>{sp.text}</Text>;
      default:           return <Text key={k}>{sp.content}</Text>;
    }
  });

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text, style }) => {
  const blocks = parseMarkdown(text);

  return (
    <View style={[mr.root, style]}>
      {blocks.map((block, i) => {
        switch (block.b) {
          case 'heading':
            return (
              <Text key={i} style={[mr.text, mr[`h${block.level}` as 'h1'|'h2'|'h3']]}>
                {renderSpans(block.spans)}
              </Text>
            );

          case 'para':
            return (
              <Text key={i} style={[mr.text, mr.para]}>
                {renderSpans(block.spans)}
              </Text>
            );

          case 'quote':
            return (
              <View key={i} style={mr.quoteBlock}>
                <View style={mr.quoteBorder} />
                <View style={mr.quoteContent}>
                  {block.lines.map((l, li) => (
                    <Text key={li} style={[mr.text, mr.quoteText]}>
                      {renderSpans(parseInline(l))}
                    </Text>
                  ))}
                </View>
              </View>
            );

          case 'ul':
            return (
              <View key={i} style={mr.listBlock}>
                {block.items.map((spans, li) => (
                  <View key={li} style={mr.listItem}>
                    <Text style={mr.bullet}>•</Text>
                    <Text style={[mr.text, mr.listText]}>{renderSpans(spans)}</Text>
                  </View>
                ))}
              </View>
            );

          case 'ol':
            return (
              <View key={i} style={mr.listBlock}>
                {block.items.map((spans, li) => (
                  <View key={li} style={mr.listItem}>
                    <Text style={mr.bullet}>{li + 1}.</Text>
                    <Text style={[mr.text, mr.listText]}>{renderSpans(spans)}</Text>
                  </View>
                ))}
              </View>
            );

          case 'code':
            return (
              <View key={i} style={mr.codeBlock}>
                {block.lang ? <Text style={mr.codeLang}>{block.lang}</Text> : null}
                <Text style={mr.codeText}>{block.code}</Text>
              </View>
            );

          case 'divider':
            return <View key={i} style={mr.hr} />;

          case 'blank':
            return <View key={i} style={mr.blank} />;

          default:
            return null;
        }
      })}
    </View>
  );
};

MarkdownRenderer.displayName = 'MarkdownRenderer';

const mr = StyleSheet.create({
  root: { gap: 2 },
  text: { color: colors.textPrimary, includeFontPadding: false },
  para: { fontSize: 14, lineHeight: 22, fontWeight: typography.fontWeight.regular },
  h1: { fontSize: 22, fontWeight: typography.fontWeight.bold, lineHeight: 30, marginBottom: spacing[1], marginTop: spacing[2] },
  h2: { fontSize: 18, fontWeight: typography.fontWeight.semibold, lineHeight: 26, marginBottom: spacing[1], marginTop: spacing[2] },
  h3: { fontSize: 15, fontWeight: typography.fontWeight.semibold, lineHeight: 22, marginBottom: 2, marginTop: spacing[2] },
  bold:      { fontWeight: typography.fontWeight.bold },
  italic:    { fontStyle: 'italic' },
  boldItalic:{ fontWeight: typography.fontWeight.bold, fontStyle: 'italic' },
  strike:    { textDecorationLine: 'line-through', color: colors.textSecondary },
  link:      { color: colors.violet400, textDecorationLine: 'underline' },
  inlineCode:{
    fontFamily:      'Courier',
    fontSize:        12,
    color:           colors.violet300,
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderRadius:    3,
    paddingHorizontal: 4,
  },
  quoteBlock:  { flexDirection: 'row', marginVertical: 2 },
  quoteBorder: { width: 3, borderRadius: 2, backgroundColor: colors.violet600, marginRight: spacing[3] },
  quoteContent:{ flex: 1 },
  quoteText:   { fontSize: 14, lineHeight: 22, color: colors.textSecondary, fontStyle: 'italic' },
  listBlock:   { gap: spacing[1], marginVertical: 2 },
  listItem:    { flexDirection: 'row', gap: spacing[2] },
  bullet:      { fontSize: 14, color: colors.violet400, fontWeight: typography.fontWeight.semibold, lineHeight: 22, width: 16 },
  listText:    { flex: 1, fontSize: 14, lineHeight: 22 },
  codeBlock:   { backgroundColor: colors.bgMuted, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, padding: spacing[3], marginVertical: 2 },
  codeLang:    { fontSize: 10, color: colors.violet400, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1], textTransform: 'uppercase', letterSpacing: 0.6 },
  codeText:    { fontFamily: 'Courier', fontSize: 12, color: colors.textPrimary, lineHeight: 20 },
  hr:          { height: 1, backgroundColor: colors.border, marginVertical: spacing[3] },
  blank:       { height: spacing[2] },
});

// ─── Toolbar ──────────────────────────────────────────────────────────────────

interface ToolBtn {
  key:    string;
  label:  string;
  title:  string;
  action: (text: string, sel: { start: number; end: number }) => { text: string; cursor: number };
}

function wrapInline(prefix: string, suffix: string, placeholder: string) {
  return (text: string, sel: { start: number; end: number }) => {
    const selected = text.slice(sel.start, sel.end) || placeholder;
    const next     = text.slice(0, sel.start) + prefix + selected + suffix + text.slice(sel.end);
    return { text: next, cursor: sel.start + prefix.length + selected.length + suffix.length };
  };
}

function insertLinePrefix(prefix: string) {
  return (text: string, sel: { start: number; end: number }) => {
    const lineStart = text.lastIndexOf('\n', sel.start - 1) + 1;
    const next      = text.slice(0, lineStart) + prefix + text.slice(lineStart);
    return { text: next, cursor: sel.start + prefix.length };
  };
}

const TOOLBAR_BTNS: ToolBtn[] = [
  { key: 'bold',   label: 'B',   title: 'Bold',           action: wrapInline('**', '**', 'bold') },
  { key: 'italic', label: 'I',   title: 'Italic',         action: wrapInline('*', '*', 'italic') },
  { key: 'strike', label: 'S',   title: 'Strikethrough',  action: wrapInline('~~', '~~', 'text') },
  { key: 'code',   label: '‹›',  title: 'Inline code',    action: wrapInline('`', '`', 'code') },
  { key: 'h1',     label: 'H1',  title: 'Heading 1',      action: insertLinePrefix('# ') },
  { key: 'h2',     label: 'H2',  title: 'Heading 2',      action: insertLinePrefix('## ') },
  { key: 'h3',     label: 'H3',  title: 'Heading 3',      action: insertLinePrefix('### ') },
  { key: 'quote',  label: '❝',   title: 'Blockquote',     action: insertLinePrefix('> ') },
  { key: 'ul',     label: '•—',  title: 'Bullet list',    action: insertLinePrefix('- ') },
  { key: 'ol',     label: '1.',  title: 'Ordered list',   action: insertLinePrefix('1. ') },
  {
    key: 'codeblock', label: '{ }', title: 'Code block',
    action: (text, sel) => {
      const insert = '\n```\ncode\n```\n';
      const next   = text.slice(0, sel.end) + insert + text.slice(sel.end);
      return { text: next, cursor: sel.end + 5 };
    },
  },
  {
    key: 'hr', label: '—', title: 'Horizontal rule',
    action: (text, sel) => {
      const insert = '\n---\n';
      const next   = text.slice(0, sel.end) + insert + text.slice(sel.end);
      return { text: next, cursor: sel.end + insert.length };
    },
  },
];

interface ToolbarProps {
  onAction: (action: ToolBtn['action']) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAction }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={tb.bar}
    contentContainerStyle={tb.content}
    keyboardShouldPersistTaps="always"
  >
    {TOOLBAR_BTNS.map((btn, idx) => (
      <React.Fragment key={btn.key}>
        {/* Separator before block-level groups */}
        {(idx === 4 || idx === 7 || idx === 10) && (
          <View style={tb.sep} />
        )}
        <TouchableOpacity
          style={tb.btn}
          onPress={() => onAction(btn.action)}
          activeOpacity={0.65}
          accessibilityRole="button"
          accessibilityLabel={btn.title}
        >
          <Text style={[
            tb.btnText,
            btn.key === 'bold'   && tb.bold,
            btn.key === 'italic' && tb.italic,
          ]}>
            {btn.label}
          </Text>
        </TouchableOpacity>
      </React.Fragment>
    ))}
  </ScrollView>
);

const tb = StyleSheet.create({
  bar:     { flexGrow: 0, borderTopWidth: 1, borderColor: colors.border, backgroundColor: colors.bgMuted },
  content: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing[2], paddingVertical: spacing[1], gap: 2 },
  sep:     { width: 1, height: 20, backgroundColor: colors.border, marginHorizontal: spacing[1] },
  btn:     { paddingHorizontal: spacing[2], paddingVertical: spacing[2], borderRadius: radii.md, minWidth: 32, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 13, color: colors.textSecondary, fontWeight: typography.fontWeight.medium, includeFontPadding: false },
  bold:    { fontWeight: typography.fontWeight.bold,   color: colors.textPrimary },
  italic:  { fontStyle: 'italic', color: colors.textPrimary },
});

// ─── Textarea ─────────────────────────────────────────────────────────────────

export const Textarea = React.forwardRef<ComponentRef<typeof TextInput>, TextareaProps>(
  (
    {
      value,
      defaultValue,
      onChangeText,
      label,
      placeholder,
      hint,
      error,
      required   = false,
      size       = 'md',
      minRows    = 3,
      maxRows,
      autoGrow   = true,
      maxLength,
      showCount,
      markdown   = false,
      initialMode = 'edit',
      onModeChange,
      fullWidth  = false,
      style,
      inputStyle,
      editable   = true,
      ...rest
    },
    ref,
  ) => {
    const cfg        = SIZE[size];
    const minH       = minRows * cfg.lineH + cfg.pv * 2;
    const maxH       = maxRows ? maxRows * cfg.lineH + cfg.pv * 2 : undefined;

    // ── Value ──
    const isControlled  = value !== undefined;
    const [internal, setInternal] = useState(defaultValue ?? '');
    const currentValue  = isControlled ? (value ?? '') : internal;

    const handleChange  = useCallback((text: string) => {
      if (!isControlled) setInternal(text);
      onChangeText?.(text);
    }, [isControlled, onChangeText]);

    // ── Height ──
    const [height, setHeight] = useState(minH);

    const onContentSize = useCallback(
      (e: { nativeEvent: { contentSize: { height: number } } }) => {
        if (!autoGrow) return;
        const raw = e.nativeEvent.contentSize.height + cfg.pv * 2;
        const clamped = maxH ? Math.min(maxH, raw) : raw;
        setHeight(Math.max(minH, clamped));
      },
      [autoGrow, cfg.pv, minH, maxH],
    );

    // ── Focus ──
    const [focused, setFocused] = useState(false);

    // ── Markdown mode ──
    const [mdMode, setMdMode] = useState<TextareaMode>(initialMode);
    const selectionRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

    const switchMode = (m: TextareaMode) => {
      setMdMode(m);
      onModeChange?.(m);
    };

    const onToolbarAction = useCallback(
      (action: ToolBtn['action']) => {
        const result = action(currentValue, selectionRef.current);
        handleChange(result.text);
      },
      [currentValue, handleChange],
    );

    // ── Derived ──
    const charCount      = currentValue.length;
    const displayCount   = showCount ?? !!maxLength;
    const isOver         = !!maxLength && charCount > maxLength;
    const isDisabled     = !editable;
    const showPreview    = markdown && mdMode === 'preview';
    const borderColor    = error   ? colors.error
                         : focused ? colors.borderFocus
                         :           colors.border;
    const borderWidth    = focused && !error ? 1.5 : 1;

    return (
      <View style={[s.wrapper, fullWidth && s.fullWidth, style]}>

        {/* ── Label row ── */}
        {(label != null || (markdown)) && (
          <View style={s.labelRow}>
            {label != null && (
              <Text style={[s.label, { fontSize: cfg.labelFs }]}>
                {label}
                {required && <Text style={s.required}> *</Text>}
              </Text>
            )}
            {/* Edit / Preview toggle */}
            {markdown && (
              <View style={s.modeTabs}>
                <TouchableOpacity
                  onPress={() => switchMode('edit')}
                  style={[s.modeTab, mdMode === 'edit' && s.modeTabActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: mdMode === 'edit' }}
                >
                  <Text style={[s.modeTabText, mdMode === 'edit' && s.modeTabTextActive]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => switchMode('preview')}
                  style={[s.modeTab, mdMode === 'preview' && s.modeTabActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: mdMode === 'preview' }}
                >
                  <Text style={[s.modeTabText, mdMode === 'preview' && s.modeTabTextActive]}>Preview</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ── Field container ── */}
        <View
          style={[
            s.field,
            { borderColor, borderWidth },
            isDisabled && s.fieldDisabled,
          ]}
        >
          {showPreview ? (
            /* ── Markdown preview ── */
            <ScrollView
              style={[s.preview, { minHeight: minH }]}
              contentContainerStyle={{ padding: cfg.ph, paddingVertical: cfg.pv }}
              showsVerticalScrollIndicator={false}
            >
              {currentValue.trim() ? (
                <MarkdownRenderer text={currentValue} />
              ) : (
                <Text style={[s.previewEmpty, { fontSize: cfg.fontSize }]}>
                  {placeholder ?? 'Nothing to preview yet…'}
                </Text>
              )}
            </ScrollView>
          ) : (
            /* ── Edit mode ── */
            <>
              <TextInput
                ref={ref}
                multiline
                scrollEnabled={!autoGrow || !!maxRows}
                editable={editable}
                value={currentValue}
                onChangeText={handleChange}
                placeholder={placeholder}
                placeholderTextColor={colors.textTertiary}
                maxLength={maxLength}
                onFocus={e => { setFocused(true); rest.onFocus?.(e); }}
                onBlur={e  => { setFocused(false); rest.onBlur?.(e); }}
                onContentSizeChange={onContentSize}
                onSelectionChange={e => { selectionRef.current = e.nativeEvent.selection; }}
                textAlignVertical="top"
                accessibilityLabel={label}
                accessibilityHint={required ? 'Required' : undefined}
                style={[
                  s.input,
                  {
                    fontSize:        cfg.fontSize,
                    lineHeight:      cfg.lineH,
                    paddingHorizontal: cfg.ph,
                    paddingVertical:   cfg.pv,
                    height:          autoGrow ? height : undefined,
                    minHeight:       minH,
                    maxHeight:       maxH,
                  },
                  inputStyle,
                ]}
                {...rest}
              />
              {/* Markdown toolbar */}
              {markdown && !isDisabled && (
                <Toolbar onAction={onToolbarAction} />
              )}
            </>
          )}
        </View>

        {/* ── Footer row ── */}
        {(error != null || hint != null || displayCount) && (
          <View style={s.footer}>
            <View style={s.footerLeft}>
              {error != null && <Text style={s.error} accessibilityRole="alert">{error}</Text>}
              {hint  != null && error == null && <Text style={s.hint}>{hint}</Text>}
            </View>
            {displayCount && (
              <Text style={[s.count, isOver && s.countOver]}>
                {charCount}{maxLength ? ` / ${maxLength}` : ''}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  },
);

Textarea.displayName = 'Textarea';

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  wrapper:   { gap: spacing[1] },
  fullWidth: { width: '100%' },

  // ── Label row ──
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  label:    { fontWeight: typography.fontWeight.medium, color: colors.textSecondary },
  required: { color: colors.error },

  // ── Mode tabs ──
  modeTabs:        { flexDirection: 'row', gap: 2 },
  modeTab:         { paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: radii.md },
  modeTabActive:   { backgroundColor: 'rgba(124,58,237,0.15)' },
  modeTabText:     { fontSize: 12, fontWeight: typography.fontWeight.medium, color: colors.textTertiary },
  modeTabTextActive:{ color: colors.violet300 },

  // ── Field ──
  field: {
    backgroundColor: colors.bgElevated,
    borderRadius:    radii.lg,
    overflow:        'hidden',
  },
  fieldDisabled: { opacity: 0.5 },

  // ── TextInput ──
  input: {
    color:              colors.textPrimary,
    fontWeight:         typography.fontWeight.regular,
    includeFontPadding: false,
  },

  // ── Preview ──
  preview:      { },
  previewEmpty: { color: colors.textTertiary, fontStyle: 'italic' },

  // ── Footer ──
  footer:     { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing[2] },
  footerLeft: { flex: 1 },
  error:      { fontSize: 13, color: colors.error, lineHeight: 18 },
  hint:       { fontSize: 13, color: colors.textTertiary, lineHeight: 18 },
  count:      { fontSize: 12, color: colors.textTertiary, fontWeight: typography.fontWeight.medium, paddingTop: 1 },
  countOver:  { color: colors.error },
});
