import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { colors, radii, spacing, typography } from '../../tokens';

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnDef<T> {
  key:          string;
  header:       string;
  renderCell?:  (value: unknown, row: T, index: number) => React.ReactNode;
  sortFn?:      (a: T, b: T) => number;
  sortable?:    boolean;
  searchable?:  boolean;
  width?:       number;
  align?:       'left' | 'center' | 'right';
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns:            ColumnDef<T>[];
  data:               T[];
  rowKey:             keyof T | ((row: T) => string | number);
  sortable?:          boolean;
  searchable?:        boolean;
  searchPlaceholder?: string;
  pageSize?:          number;
  striped?:           boolean;
  density?:           'compact' | 'comfortable' | 'spacious';
  loading?:           boolean;
  emptyState?:        React.ReactNode;
  onRowPress?:        (row: T, index: number) => void;
  style?:             ViewStyle;
}

const DEFAULT_COL_WIDTH = 120;

const densityPad: Record<NonNullable<DataTableProps<any>['density']>, { v: number; h: number }> = {
  compact:     { v: spacing[2], h: spacing[3] },
  comfortable: { v: spacing[3], h: spacing[4] },
  spacious:    { v: spacing[4], h: spacing[6] },
};

function getRowKey<T extends Record<string, unknown>>(
  row: T, rowKey: DataTableProps<T>['rowKey'], index: number,
): string | number {
  if (typeof rowKey === 'function') return rowKey(row);
  return (row[rowKey] as string | number) ?? index;
}

function defaultSearchFn<T extends Record<string, unknown>>(
  row: T, query: string, columns: ColumnDef<T>[],
): boolean {
  const q = query.toLowerCase();
  return columns.some(col => {
    if (col.searchable === false) return false;
    const val = row[col.key];
    if (val == null) return false;
    return String(val).toLowerCase().includes(q);
  });
}

function defaultSortFn<T extends Record<string, unknown>>(
  a: T, b: T, key: string, dir: 'asc' | 'desc', col?: ColumnDef<T>,
): number {
  if (col?.sortFn) {
    const r = col.sortFn(a, b);
    return dir === 'asc' ? r : -r;
  }
  const av = a[key], bv = b[key];
  if (av == null && bv == null) return 0;
  if (av == null) return 1;
  if (bv == null) return -1;
  if (typeof av === 'number' && typeof bv === 'number') {
    return dir === 'asc' ? av - bv : bv - av;
  }
  const as = String(av).toLowerCase(), bs = String(bv).toLowerCase();
  return dir === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as);
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

const SortChevrons: React.FC<{ direction: SortDirection; active: boolean }> = ({ direction, active }) => (
  <View style={{ gap: 2, marginLeft: 4 }}>
    <View style={[
      styles.chevron, styles.chevronUp,
      active && direction === 'asc' ? { backgroundColor: colors.violet400 } : { backgroundColor: colors.textDisabled },
    ]} />
    <View style={[
      styles.chevron, styles.chevronDown,
      active && direction === 'desc' ? { backgroundColor: colors.violet400 } : { backgroundColor: colors.textDisabled },
    ]} />
  </View>
);

const SearchBar: React.FC<{
  value:       string;
  onChange:    (v: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder = 'Search…' }) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.searchRow, focused && styles.searchRowFocused]}>
      {/* search icon */}
      <View style={styles.searchIcon}>
        <View style={styles.searchCircle} />
        <View style={styles.searchHandle} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.searchInput}
        returnKeyType="search"
        clearButtonMode="while-editing"
        accessibilityLabel="Search table"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChange('')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Clear search"
        >
          <Text style={styles.clearBtn}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const Pagination: React.FC<{
  page:      number;
  pageCount: number;
  total:     number;
  pageSize:  number;
  onChange:  (p: number) => void;
}> = ({ page, pageCount, total, pageSize, onChange }) => {
  const start = (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, total);

  return (
    <View style={styles.pagination}>
      <Text style={styles.paginationInfo}>{start}–{end} of {total}</Text>
      <View style={styles.paginationBtns}>
        <TouchableOpacity
          onPress={() => onChange(1)}
          disabled={page === 1}
          style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
          accessibilityLabel="First page"
        >
          <Text style={styles.pageBtnTxt}>«</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onChange(page - 1)}
          disabled={page === 1}
          style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
          accessibilityLabel="Previous page"
        >
          <Text style={styles.pageBtnTxt}>‹</Text>
        </TouchableOpacity>
        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorTxt}>{page} / {pageCount}</Text>
        </View>
        <TouchableOpacity
          onPress={() => onChange(page + 1)}
          disabled={page === pageCount}
          style={[styles.pageBtn, page === pageCount && styles.pageBtnDisabled]}
          accessibilityLabel="Next page"
        >
          <Text style={styles.pageBtnTxt}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onChange(pageCount)}
          disabled={page === pageCount}
          style={[styles.pageBtn, page === pageCount && styles.pageBtnDisabled]}
          accessibilityLabel="Last page"
        >
          <Text style={styles.pageBtnTxt}>»</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  sortable          = false,
  searchable        = false,
  searchPlaceholder,
  pageSize,
  striped           = false,
  density           = 'comfortable',
  loading           = false,
  emptyState,
  onRowPress,
  style,
}: DataTableProps<T>) {
  const [query,       setQuery]       = useState('');
  const [sortKey,     setSortKey]     = useState<string | null>(null);
  const [sortDir,     setSortDir]     = useState<SortDirection>(null);
  const [page,        setPage]        = useState(1);

  const pad = densityPad[density];

  const handleSort = useCallback((key: string) => {
    let next: SortDirection;
    if (sortKey !== key)       next = 'asc';
    else if (sortDir === 'asc') next = 'desc';
    else                       next = null;
    setSortKey(next === null ? null : key);
    setSortDir(next);
    setPage(1);
  }, [sortKey, sortDir]);

  const handleSearch = useCallback((q: string) => { setQuery(q); setPage(1); }, []);

  const processed = useMemo(() => {
    let rows = data;
    if (searchable && query.trim()) {
      rows = rows.filter(r => defaultSearchFn(r, query.trim(), columns));
    }
    if (sortKey && sortDir) {
      const col = columns.find(c => c.key === sortKey);
      rows = [...rows].sort((a, b) => defaultSortFn(a, b, sortKey, sortDir, col));
    }
    return rows;
  }, [data, query, columns, searchable, sortKey, sortDir]);

  const pageCount = pageSize ? Math.max(1, Math.ceil(processed.length / pageSize)) : 1;
  const visible   = pageSize ? processed.slice((page - 1) * pageSize, page * pageSize) : processed;

  return (
    <View style={[styles.root, style]}>
      {/* Search bar */}
      {searchable && (
        <View style={styles.searchContainer}>
          <SearchBar value={query} onChange={handleSearch} placeholder={searchPlaceholder} />
        </View>
      )}

      {/* Table */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tableScroll}
        contentContainerStyle={styles.tableContent}
      >
        <View>
          {/* Header row */}
          <View style={styles.headerRow}>
            {columns.map(col => {
              const colSortable = sortable && col.sortable !== false;
              const isActive    = sortKey === col.key;
              const colW        = col.width ?? DEFAULT_COL_WIDTH;

              return (
                <TouchableOpacity
                  key={col.key}
                  disabled={!colSortable}
                  onPress={colSortable ? () => handleSort(col.key) : undefined}
                  style={[
                    styles.headerCell,
                    { width: colW, paddingVertical: pad.v, paddingHorizontal: pad.h },
                    col.align === 'center' && { justifyContent: 'center' },
                    col.align === 'right'  && { justifyContent: 'flex-end' },
                  ]}
                  activeOpacity={colSortable ? 0.7 : 1}
                >
                  <Text
                    style={[
                      styles.headerText,
                      isActive && styles.headerTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {col.header}
                  </Text>
                  {colSortable && (
                    <SortChevrons direction={isActive ? sortDir : null} active={isActive && sortDir !== null} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Body */}
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 480 }}
          >
            {loading ? (
              <View style={styles.emptyContainer}>
                <ActivityIndicator color={colors.violet400} size="large" />
              </View>
            ) : visible.length === 0 ? (
              <View style={styles.emptyContainer}>
                {emptyState ?? (
                  <>
                    <Text style={styles.emptyIcon}>⊟</Text>
                    <Text style={styles.emptyTitle}>No results found</Text>
                    {query ? (
                      <Text style={styles.emptySubtitle}>Try adjusting your search for "{query}"</Text>
                    ) : null}
                  </>
                )}
              </View>
            ) : (
              visible.map((row, ri) => {
                const isStriped = striped && ri % 2 === 1;
                const rowBg     = isStriped ? colors.bgMuted : 'transparent';
                const isLast    = ri === visible.length - 1;

                return (
                  <TouchableOpacity
                    key={getRowKey(row, rowKey, (page - 1) * (pageSize ?? 0) + ri)}
                    onPress={onRowPress ? () => onRowPress(row, ri) : undefined}
                    disabled={!onRowPress}
                    activeOpacity={0.7}
                    style={[
                      styles.dataRow,
                      { backgroundColor: rowBg },
                      !isLast && styles.dataRowBorder,
                    ]}
                    accessibilityRole={onRowPress ? 'button' : undefined}
                  >
                    {columns.map(col => {
                      const colW  = col.width ?? DEFAULT_COL_WIDTH;
                      const value = row[col.key];

                      return (
                        <View
                          key={col.key}
                          style={[
                            styles.dataCell,
                            { width: colW, paddingVertical: pad.v, paddingHorizontal: pad.h },
                            col.align === 'center' && { alignItems: 'center' },
                            col.align === 'right'  && { alignItems: 'flex-end' },
                          ]}
                        >
                          {col.renderCell ? (
                            col.renderCell(value, row, ri)
                          ) : (
                            <Text style={styles.cellText} numberOfLines={1}>
                              {value != null ? String(value) : '—'}
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Pagination */}
      {pageSize && !loading && processed.length > 0 && (
        <Pagination
          page={page}
          pageCount={pageCount}
          total={processed.length}
          pageSize={pageSize}
          onChange={setPage}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.bgElevated,
    borderRadius:    radii.xl,
    borderWidth:     StyleSheet.hairlineWidth,
    borderColor:     colors.border,
    overflow:        'hidden',
  },
  searchContainer: {
    padding:         spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
    backgroundColor:   colors.bgElevated,
  },
  searchRow: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               spacing[2],
    backgroundColor:   colors.bgMuted,
    borderRadius:      radii.lg,
    borderWidth:       1,
    borderColor:       colors.border,
    paddingHorizontal: spacing[3],
    height:            36,
  },
  searchRowFocused: {
    borderColor: colors.borderFocus,
  },
  searchIcon: { position: 'relative', width: 14, height: 14 },
  searchCircle: {
    position:     'absolute',
    top:          0,
    left:         0,
    width:        10,
    height:       10,
    borderRadius: 5,
    borderWidth:  1.5,
    borderColor:  colors.textTertiary,
  },
  searchHandle: {
    position:     'absolute',
    bottom:       0,
    right:        0,
    width:        5,
    height:       1.5,
    borderRadius: 1,
    backgroundColor: colors.textTertiary,
    transform:    [{ rotate: '45deg' }],
  },
  searchInput: {
    flex:               1,
    fontSize:           13,
    color:              colors.textPrimary,
    includeFontPadding: false,
    height:             36,
  },
  clearBtn: {
    fontSize: 12,
    color:    colors.textTertiary,
  },
  tableScroll: { flexGrow: 0 },
  tableContent: {},
  headerRow: {
    flexDirection:     'row',
    backgroundColor:   colors.bgMuted,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerCell: {
    flexDirection: 'row',
    alignItems:    'center',
    flexShrink:    0,
  },
  headerText: {
    fontSize:           11,
    fontWeight:         typography.fontWeight.semibold,
    color:              colors.textTertiary,
    letterSpacing:      0.6,
    textTransform:      'uppercase',
    includeFontPadding: false,
  },
  headerTextActive: { color: colors.violet300 },
  chevron: {
    width:        0,
    height:       0,
    borderLeftWidth:  4,
    borderRightWidth: 4,
    borderLeftColor:  'transparent',
    borderRightColor: 'transparent',
  },
  chevronUp:   { borderBottomWidth: 4, borderBottomColor: colors.textDisabled },
  chevronDown: { borderTopWidth: 4,    borderTopColor:    colors.textDisabled },
  dataRow: {
    flexDirection: 'row',
  },
  dataRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
  },
  dataCell: {
    flexShrink:    0,
    justifyContent: 'center',
  },
  cellText: {
    fontSize:           13,
    color:              colors.textPrimary,
    includeFontPadding: false,
    lineHeight:         18,
  },
  emptyContainer: {
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: spacing[12],
    gap:            spacing[2],
  },
  emptyIcon: {
    fontSize: 40,
    color:    colors.textDisabled,
  },
  emptyTitle: {
    fontSize:   15,
    fontWeight: typography.fontWeight.semibold,
    color:      colors.textTertiary,
  },
  emptySubtitle: {
    fontSize: 13,
    color:    colors.textDisabled,
    textAlign: 'center',
    paddingHorizontal: spacing[6],
  },
  pagination: {
    flexDirection:      'row',
    alignItems:         'center',
    justifyContent:     'space-between',
    paddingHorizontal:  spacing[4],
    paddingVertical:    spacing[3],
    borderTopWidth:     StyleSheet.hairlineWidth,
    borderTopColor:     colors.borderSubtle,
    backgroundColor:    colors.bgElevated,
  },
  paginationInfo: {
    fontSize: 12,
    color:    colors.textTertiary,
    includeFontPadding: false,
  },
  paginationBtns: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
  },
  pageBtn: {
    width:          28,
    height:         28,
    borderRadius:   radii.md,
    alignItems:     'center',
    justifyContent: 'center',
    borderWidth:    1,
    borderColor:    colors.border,
    backgroundColor: colors.bgMuted,
  },
  pageBtnDisabled: { opacity: 0.3 },
  pageBtnTxt: {
    fontSize:           14,
    color:              colors.textSecondary,
    includeFontPadding: false,
    lineHeight:         16,
  },
  pageIndicator: {
    paddingHorizontal: spacing[3],
    height:            28,
    borderRadius:      radii.md,
    alignItems:        'center',
    justifyContent:    'center',
    backgroundColor:   colors.bgMuted,
    borderWidth:       1,
    borderColor:       colors.border,
  },
  pageIndicatorTxt: {
    fontSize:           12,
    fontWeight:         typography.fontWeight.medium,
    color:              colors.textSecondary,
    includeFontPadding: false,
  },
});
