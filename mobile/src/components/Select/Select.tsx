/**
 * Neo Select — React Native
 *
 * Modes (controlled via props):
 *   Basic select     — default
 *   Multi-select     — multiple
 *   With search      — searchable
 *   Autocomplete     — searchable + freeSolo
 *   Datasource       — dataSource (async API fn)
 *
 * All modes can be combined freely.
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  ActivityIndicator,
  type ViewStyle,
} from 'react-native';
import { colors, spacing, radii, typography } from '../../tokens';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SelectOption {
  label: string;
  value: string | number;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectValue = string | number;

export interface SelectProps {
  /** Static list of options */
  options?: SelectOption[];
  /** Current value — single or array for multiple mode */
  value?: SelectValue | SelectValue[];
  /** Change callback */
  onChange?: (value: SelectValue | SelectValue[]) => void;

  /** Field label rendered above the trigger */
  label?: string;
  /** Trigger placeholder text */
  placeholder?: string;
  /** Helper text below the trigger */
  hint?: string;
  /** Error message (overrides hint) */
  error?: string;

  /** Size variant */
  size?: SelectSize;
  /** Allow selecting multiple options */
  multiple?: boolean;
  /** Filter options by a search query in the sheet */
  searchable?: boolean;
  /**
   * Free-text mode: lets the user type a custom value not in the list.
   * Works together with searchable — displays an "Add" row when the typed
   * value doesn't match any option.
   */
  freeSolo?: boolean;
  /**
   * Async datasource. When provided, options are fetched on every query
   * change (debounced 300 ms). The sheet search bar is shown automatically.
   */
  dataSource?: (query: string) => Promise<SelectOption[]>;

  /** Show a clear (×) button when a value is selected */
  clearable?: boolean;
  /** Maximum number of items that can be selected in multiple mode */
  maxSelected?: number;
  /** Placeholder inside the sheet search bar */
  searchPlaceholder?: string;
  /** Text shown when no options match */
  emptyText?: string;

  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

// ─── Size config ──────────────────────────────────────────────────────────────

const SIZE: Record<
  SelectSize,
  { height: number; fontSize: number; ph: number; chipH: number; chipFs: number }
> = {
  sm: { height: 32, fontSize: 13, ph: spacing[3],  chipH: 20, chipFs: 11 },
  md: { height: 40, fontSize: 14, ph: spacing[4],  chipH: 24, chipFs: 12 },
  lg: { height: 48, fontSize: 16, ph: spacing[4],  chipH: 28, chipFs: 13 },
};

// ─── Internal helpers ─────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function resolveLabel(options: SelectOption[], val: SelectValue): string {
  return options.find(o => o.value === val)?.label ?? String(val);
}

// ─── Inline micro-icons (no external deps) ───────────────────────────────────

const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <View
    style={[
      iconStyles.chevron,
      open && iconStyles.chevronUp,
    ]}
  />
);

const XIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 10,
  color = colors.textTertiary,
}) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={[iconStyles.xLine, { backgroundColor: color, transform: [{ rotate: '45deg' }] }]} />
    <View style={[iconStyles.xLine, { backgroundColor: color, transform: [{ rotate: '-45deg' }] }]} />
  </View>
);

const CheckIcon: React.FC = () => (
  <View style={iconStyles.checkWrap}>
    <View style={iconStyles.checkMark} />
  </View>
);

const MagnifyIcon: React.FC = () => (
  <View style={iconStyles.magnifyWrap}>
    <View style={iconStyles.magnifyCircle} />
    <View style={iconStyles.magnifyHandle} />
  </View>
);

const iconStyles = StyleSheet.create({
  chevron: {
    width: 8,
    height: 8,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: colors.textTertiary,
    transform: [{ rotate: '45deg' }],
    marginTop: -4,
  },
  chevronUp: {
    transform: [{ rotate: '-135deg' }],
    marginTop: 4,
  },
  xLine: {
    position: 'absolute',
    width: 10,
    height: 1.5,
    borderRadius: 1,
  },
  checkWrap: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  checkMark: {
    width: 10,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.violet400,
    transform: [{ rotate: '-45deg' }],
    marginTop: -2,
  },
  magnifyWrap: { width: 16, height: 16 },
  magnifyCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.textTertiary,
  },
  magnifyHandle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 6,
    height: 1.5,
    backgroundColor: colors.textTertiary,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
});

// ─── Main component ───────────────────────────────────────────────────────────

export const Select: React.FC<SelectProps> = ({
  options: staticOptions = [],
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  hint,
  error,
  size = 'md',
  multiple = false,
  searchable = false,
  freeSolo = false,
  dataSource,
  clearable = false,
  maxSelected,
  searchPlaceholder = 'Search…',
  emptyText = 'No options found',
  disabled = false,
  fullWidth = false,
  style,
}) => {
  const cfg = SIZE[size];

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [dsOptions, setDsOptions] = useState<SelectOption[]>([]);
  const [dsLoading, setDsLoading] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const searchRef = useRef<TextInput>(null);
  const debouncedQuery = useDebounce(query, 300);

  // ── Normalise value to array ──
  const selectedValues: SelectValue[] = React.useMemo(() => {
    if (value == null) return [];
    if (multiple) return Array.isArray(value) ? value : [value as SelectValue];
    return Array.isArray(value) ? value.slice(0, 1) : [value as SelectValue];
  }, [value, multiple]);

  // ── Options to show in the list ──
  const allOptions: SelectOption[] = dataSource ? dsOptions : staticOptions;

  const filteredOptions: SelectOption[] = React.useMemo(() => {
    if (dataSource) return allOptions; // server filters
    if ((searchable || freeSolo) && query.length > 0) {
      const q = query.toLowerCase();
      return allOptions.filter(o => o.label.toLowerCase().includes(q));
    }
    return allOptions;
  }, [allOptions, searchable, freeSolo, dataSource, query]);

  // ── Load datasource ──
  useEffect(() => {
    if (!dataSource || !open) return;
    let cancelled = false;
    setDsLoading(true);
    dataSource(debouncedQuery)
      .then(results => { if (!cancelled) { setDsOptions(results); setDsLoading(false); } })
      .catch(() => { if (!cancelled) setDsLoading(false); });
    return () => { cancelled = true; };
  }, [dataSource, debouncedQuery, open]);

  // ── Sheet open / close ──
  const openSheet = useCallback(() => {
    if (disabled) return;
    setQuery('');
    setOpen(true);
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 12,
    }).start();
    // Autofocus search after sheet appears
    if (searchable || freeSolo || dataSource) {
      setTimeout(() => searchRef.current?.focus(), 250);
    }
  }, [disabled, slideAnim, searchable, freeSolo, dataSource]);

  const closeSheet = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setOpen(false);
      setQuery('');
    });
  }, [slideAnim]);

  // ── Select / deselect option ──
  const selectOption = useCallback(
    (opt: SelectOption) => {
      if (opt.disabled) return;
      if (multiple) {
        const curr = Array.isArray(value) ? (value as SelectValue[]) : (value != null ? [value as SelectValue] : []);
        const exists = curr.includes(opt.value);
        let next: SelectValue[];
        if (exists) {
          next = curr.filter(v => v !== opt.value);
        } else {
          if (maxSelected != null && curr.length >= maxSelected) return;
          next = [...curr, opt.value];
        }
        onChange?.(next);
      } else {
        onChange?.(opt.value);
        closeSheet();
      }
    },
    [multiple, value, onChange, maxSelected, closeSheet],
  );

  // ── Confirm free-solo typed value ──
  const confirmFreeSolo = useCallback(() => {
    const trimmed = query.trim();
    if (!freeSolo || !trimmed) return;
    if (multiple) {
      const curr = Array.isArray(value) ? (value as SelectValue[]) : (value != null ? [value as SelectValue] : []);
      if (!curr.includes(trimmed)) onChange?.([...curr, trimmed]);
      setQuery('');
    } else {
      onChange?.(trimmed);
      closeSheet();
    }
  }, [freeSolo, query, multiple, value, onChange, closeSheet]);

  // ── Clear all ──
  const clearAll = useCallback(() => {
    onChange?.(multiple ? [] : (undefined as unknown as SelectValue));
  }, [multiple, onChange]);

  // ── Remove one chip ──
  const removeChip = useCallback(
    (val: SelectValue) => {
      if (!multiple || !Array.isArray(value)) return;
      onChange?.((value as SelectValue[]).filter(v => v !== val));
    },
    [multiple, value, onChange],
  );

  // ── Derived state ──
  const hasValue = selectedValues.length > 0;
  const showSearch = searchable || freeSolo || !!dataSource;
  const showFreeSoloAdd =
    freeSolo &&
    query.trim().length > 0 &&
    !filteredOptions.some(o => o.label.toLowerCase() === query.toLowerCase());

  const triggerBorder = error ? colors.error : open ? colors.borderFocus : colors.border;
  const triggerBorderW = open && !error ? 1.5 : 1;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  // ── Render single option row ──
  const renderItem = useCallback(
    ({ item }: { item: SelectOption }) => {
      const selected = selectedValues.includes(item.value);
      return (
        <TouchableOpacity
          style={[styles.optionRow, item.disabled && styles.optionDisabled]}
          onPress={() => selectOption(item)}
          activeOpacity={0.6}
          accessibilityRole="button"
          accessibilityState={{ selected, disabled: item.disabled }}
        >
          <View style={styles.optionLeft}>
            {item.icon != null && <View style={styles.optionIcon}>{item.icon}</View>}
            <View style={styles.optionTexts}>
              <Text
                style={[
                  styles.optionLabel,
                  selected && styles.optionLabelSelected,
                  item.disabled && styles.optionLabelDisabled,
                ]}
              >
                {item.label}
              </Text>
              {item.description != null && (
                <Text style={styles.optionDesc}>{item.description}</Text>
              )}
            </View>
          </View>
          {selected && <CheckIcon />}
        </TouchableOpacity>
      );
    },
    [selectedValues, selectOption],
  );

  return (
    <View style={[styles.wrapper, fullWidth && styles.fullWidth, style]}>

      {/* ── Field label ── */}
      {label != null && <Text style={styles.label}>{label}</Text>}

      {/* ── Trigger ── */}
      <TouchableOpacity
        onPress={openSheet}
        disabled={disabled}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        accessibilityState={{ expanded: open, disabled }}
        style={[
          styles.trigger,
          {
            minHeight: cfg.height,
            paddingHorizontal: cfg.ph,
            borderColor: triggerBorder,
            borderWidth: triggerBorderW,
            opacity: disabled ? 0.45 : 1,
          },
          multiple && hasValue && styles.triggerWrap,
        ]}
      >
        {/* Multi chips */}
        {multiple && hasValue ? (
          <View style={styles.chipsRow}>
            {selectedValues.map(val => (
              <View key={String(val)} style={[styles.chip, { height: cfg.chipH }]}>
                <Text style={[styles.chipText, { fontSize: cfg.chipFs }]} numberOfLines={1}>
                  {resolveLabel(allOptions, val)}
                </Text>
                <TouchableOpacity
                  onPress={() => removeChip(val)}
                  hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${resolveLabel(allOptions, val)}`}
                >
                  <XIcon size={9} color={colors.violet300} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          /* Single value or placeholder */
          <Text
            style={[
              styles.triggerValue,
              { fontSize: cfg.fontSize },
              !hasValue && styles.triggerPlaceholder,
            ]}
            numberOfLines={1}
          >
            {hasValue ? resolveLabel(allOptions, selectedValues[0]) : placeholder}
          </Text>
        )}

        {/* Right-side actions */}
        <View style={styles.triggerSuffix}>
          {clearable && hasValue && (
            <TouchableOpacity
              onPress={clearAll}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Clear selection"
            >
              <View style={styles.clearBtn}>
                <XIcon size={9} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          )}
          <ChevronIcon open={open} />
        </View>
      </TouchableOpacity>

      {/* ── Field feedback ── */}
      {error != null  && <Text style={styles.errorText} accessibilityRole="alert">{error}</Text>}
      {hint  != null && error == null && <Text style={styles.hintText}>{hint}</Text>}

      {/* ─────────────── Sheet Modal ─────────────── */}
      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={closeSheet}
        statusBarTranslucent
      >
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          onPress={closeSheet}
          activeOpacity={1}
          accessibilityRole="button"
          accessibilityLabel="Close picker"
        />

        {/* Animated sheet */}
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>

          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Sheet header */}
          <View style={styles.sheetHeader}>
            {label != null && (
              <Text style={styles.sheetTitle}>{label}</Text>
            )}
            <View style={{ flex: 1 }} />
            {multiple && hasValue && (
              <Text style={styles.selectedCount}>{selectedValues.length} selected</Text>
            )}
            <TouchableOpacity
              onPress={closeSheet}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <View style={styles.closeBtn}>
                <XIcon size={11} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          {showSearch && (
            <View style={styles.searchRow}>
              <MagnifyIcon />
              <TextInput
                ref={searchRef}
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
                placeholder={searchPlaceholder}
                placeholderTextColor={colors.textTertiary}
                returnKeyType={freeSolo ? 'done' : 'search'}
                onSubmitEditing={freeSolo ? confirmFreeSolo : undefined}
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="never"
              />
              {query.length > 0 && (
                <TouchableOpacity
                  onPress={() => setQuery('')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <XIcon size={10} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Free-solo "Add …" row */}
          {showFreeSoloAdd && (
            <TouchableOpacity
              style={styles.freeSoloRow}
              onPress={confirmFreeSolo}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text style={styles.freeSoloText}>
                Add{' '}
                <Text style={styles.freeSoloValue}>"{query.trim()}"</Text>
              </Text>
            </TouchableOpacity>
          )}

          {/* Datasource loading */}
          {dsLoading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={colors.violet400} />
              <Text style={styles.loadingText}>Loading…</Text>
            </View>
          )}

          {/* Options list */}
          {!dsLoading && (
            <FlatList<SelectOption>
              data={filteredOptions}
              keyExtractor={item => String(item.value)}
              renderItem={renderItem}
              style={styles.list}
              contentContainerStyle={
                filteredOptions.length === 0 ? styles.emptyContainer : undefined
              }
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyText}>{emptyText}</Text>
                </View>
              }
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          )}

          {/* Multi — Done button */}
          {multiple && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.doneBtn}
                onPress={closeSheet}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <Text style={styles.doneBtnText}>
                  Done{selectedValues.length > 0 ? ` (${selectedValues.length})` : ''}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </Modal>
    </View>
  );
};

Select.displayName = 'Select';

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: { gap: spacing[1] },
  fullWidth: { width: '100%' },

  // ── Label ──
  label: {
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: 2,
  },

  // ── Trigger ──
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  triggerWrap: {
    paddingVertical: spacing[2],
    alignItems: 'flex-start',
  },
  triggerValue: {
    flex: 1,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.regular,
    includeFontPadding: false,
  },
  triggerPlaceholder: { color: colors.textTertiary },
  triggerSuffix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingLeft: spacing[2],
  },
  clearBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Chips ──
  chipsRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[2],
    backgroundColor: 'rgba(109,40,217,0.15)',
    borderWidth: 1,
    borderColor: colors.violet600,
    borderRadius: radii.full,
  },
  chipText: {
    color: colors.violet300,
    fontWeight: typography.fontWeight.medium,
    maxWidth: 120,
  },

  // ── Feedback ──
  errorText: { fontSize: 13, color: colors.error, lineHeight: 18 },
  hintText:  { fontSize: 13, color: colors.textTertiary, lineHeight: 18 },

  // ── Backdrop ──
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },

  // ── Sheet ──
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '80%',
    backgroundColor: colors.bgOverlay,
    borderTopLeftRadius: radii['2xl'],
    borderTopRightRadius: radii['2xl'],
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
    paddingBottom: Platform.OS === 'ios' ? spacing[8] : spacing[4],
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.neutral700,
    marginTop: spacing[3],
    marginBottom: spacing[2],
  },

  // ── Sheet header ──
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    borderColor: colors.border,
    gap: spacing[2],
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  selectedCount: {
    fontSize: 12,
    color: colors.violet400,
    fontWeight: typography.fontWeight.medium,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: radii.md,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Search bar ──
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginHorizontal: spacing[4],
    marginTop: spacing[3],
    marginBottom: spacing[1],
    paddingHorizontal: spacing[3],
    height: 40,
    backgroundColor: colors.bgMuted,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    includeFontPadding: false,
    fontWeight: typography.fontWeight.regular,
  },

  // ── Free-solo "Add" row ──
  freeSoloRow: {
    marginHorizontal: spacing[4],
    marginBottom: spacing[2],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: 'rgba(109,40,217,0.08)',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.violet600,
  },
  freeSoloText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  freeSoloValue: {
    color: colors.violet300,
    fontWeight: typography.fontWeight.medium,
  },

  // ── Datasource loading ──
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[8],
  },
  loadingText: { fontSize: 14, color: colors.textSecondary },

  // ── Options list ──
  list: { flexShrink: 1 },
  emptyContainer: { flexGrow: 1 },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[12],
    gap: spacing[2],
  },
  emptyText: { fontSize: 14, color: colors.textTertiary },

  // ── Option row ──
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    minHeight: 44,
    gap: spacing[3],
  },
  optionDisabled: { opacity: 0.4 },
  optionLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  optionIcon: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  optionTexts: { flex: 1 },
  optionLabel: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.regular,
    includeFontPadding: false,
  },
  optionLabelSelected: {
    color: colors.violet300,
    fontWeight: typography.fontWeight.medium,
  },
  optionLabelDisabled: { color: colors.textTertiary },
  optionDesc: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
    lineHeight: 17,
  },

  // ── Footer ──
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  doneBtn: {
    height: 48,
    backgroundColor: colors.violet500,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: typography.fontWeight.semibold,
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
});
