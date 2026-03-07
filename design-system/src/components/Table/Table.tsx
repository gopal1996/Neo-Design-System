import React, { useMemo, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnDef<T> {
  key:         string;
  header:      React.ReactNode;
  renderCell?: (value: unknown, row: T, rowIndex: number) => React.ReactNode;
  sortFn?:     (a: T, b: T) => number;
  sortable?:   boolean;
  searchable?: boolean;
  width?:      string | number;
  minWidth?:   string | number;
  align?:      'left' | 'center' | 'right';
  className?:  string;
}

export interface TableProps<T extends Record<string, unknown>> {
  columns:            ColumnDef<T>[];
  data:               T[];
  rowKey?:            keyof T | ((row: T) => string | number);
  sortable?:          boolean;
  searchable?:        boolean;
  searchPlaceholder?: string;
  pageSize?:          number;
  sortKey?:           string;
  sortDirection?:     SortDirection;
  onSortChange?:      (key: string, direction: SortDirection) => void;
  loading?:           boolean;
  emptyState?:        React.ReactNode;
  striped?:           boolean;
  hoverable?:         boolean;
  density?:           'comfortable' | 'compact' | 'spacious';
  className?:         string;
  onRowClick?:        (row: T, index: number) => void;
}

function getRowKey<T extends Record<string, unknown>>(
  row: T, rowKey: TableProps<T>['rowKey'], index: number,
): string | number {
  if (!rowKey) return index;
  if (typeof rowKey === 'function') return rowKey(row);
  return row[rowKey] as string | number;
}

function defaultSearch<T extends Record<string, unknown>>(
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

function defaultSort<T extends Record<string, unknown>>(
  a: T, b: T, key: string, direction: 'asc' | 'desc', col?: ColumnDef<T>,
): number {
  if (col?.sortFn) {
    const result = col.sortFn(a, b);
    return direction === 'asc' ? result : -result;
  }
  const av = a[key], bv = b[key];
  if (av == null && bv == null) return 0;
  if (av == null) return 1;
  if (bv == null) return -1;
  if (typeof av === 'number' && typeof bv === 'number') {
    return direction === 'asc' ? av - bv : bv - av;
  }
  const as = String(av).toLowerCase(), bs = String(bv).toLowerCase();
  return direction === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as);
}

const densityCells: Record<NonNullable<TableProps<any>['density']>, string> = {
  comfortable: 'px-4 py-3',
  compact:     'px-3 py-2 text-[0.8125rem]',
  spacious:    'px-6 py-4',
};

const SortIcon: React.FC<{ direction: SortDirection; active: boolean }> = ({ direction, active }) => (
  <span
    className={cn(
      'inline-flex items-center w-[14px] h-[14px] opacity-40 transition-opacity duration-150 flex-shrink-0',
      active && 'opacity-100 text-violet-400',
    )}
    aria-hidden="true"
  >
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M8 3L5 7h6L8 3z" fill="currentColor" opacity={active && direction === 'asc' ? 1 : 0.3} />
      <path d="M8 13l3-4H5l3 4z" fill="currentColor" opacity={active && direction === 'desc' ? 1 : 0.3} />
    </svg>
  </span>
);

const SearchBar: React.FC<{
  value: string; onChange: (v: string) => void; placeholder?: string;
}> = ({ value, onChange, placeholder = 'Search…' }) => (
  <div className="relative flex items-center flex-1 max-w-[320px]">
    <span className="absolute left-3 w-4 h-4 text-content-tertiary pointer-events-none flex items-center" aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
    <input
      type="search"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label="Search table"
      className={cn(
        'nx-search-input w-full h-9 bg-surface-muted border border-stroke rounded-lg text-sm text-content-primary outline-none',
        'pl-[calc(0.75rem+16px+0.5rem)] pr-8',
        'transition-all duration-150',
        'focus:border-stroke-focus focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]',
      )}
    />
    {value && (
      <button
        className="absolute right-2 w-5 h-5 flex items-center justify-center bg-transparent border-none rounded-sm text-content-tertiary cursor-pointer p-[2px] transition-colors duration-150 hover:text-content-primary"
        onClick={() => onChange('')}
        aria-label="Clear search"
      >
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M4 4l8 8M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    )}
  </div>
);

const Pagination: React.FC<{
  page: number; pageCount: number; total: number; pageSize: number; onChange: (p: number) => void;
}> = ({ page, pageCount, total, pageSize, onChange }) => {
  const start = (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, total);

  const btnCls = cn(
    'w-7 h-7 flex items-center justify-center bg-transparent border border-transparent rounded-md',
    'text-content-tertiary cursor-pointer p-[6px] transition-all duration-150',
    'hover:enabled:bg-neutral-800 hover:enabled:border-stroke hover:enabled:text-content-primary',
    'disabled:opacity-30 disabled:cursor-not-allowed',
    'focus-visible:outline-2 focus-visible:outline-stroke-focus focus-visible:outline-offset-2',
  );

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-stroke-subtle bg-surface-elevated">
      <span className="text-[0.8125rem] text-content-tertiary">{start}–{end} of {total}</span>
      <div className="flex items-center gap-1">
        <button className={btnCls} onClick={() => onChange(1)} disabled={page === 1} aria-label="First page">
          <svg viewBox="0 0 16 16" fill="none" className="w-full h-full"><path d="M11 4L7 8l4 4M5 4v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button className={btnCls} onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page">
          <svg viewBox="0 0 16 16" fill="none" className="w-full h-full"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span className="text-[0.8125rem] font-medium text-content-secondary min-w-[52px] text-center">{page} / {pageCount}</span>
        <button className={btnCls} onClick={() => onChange(page + 1)} disabled={page === pageCount} aria-label="Next page">
          <svg viewBox="0 0 16 16" fill="none" className="w-full h-full"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button className={btnCls} onClick={() => onChange(pageCount)} disabled={page === pageCount} aria-label="Last page">
          <svg viewBox="0 0 16 16" fill="none" className="w-full h-full"><path d="M5 4l4 4-4 4M11 4v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
};

const SkeletonRows: React.FC<{ cols: number; rows?: number; cellCls: string }> = ({ cols, rows = 5, cellCls }) => (
  <>
    {Array.from({ length: rows }).map((_, ri) => (
      <tr key={ri} className="border-b border-stroke-subtle">
        {Array.from({ length: cols }).map((_, ci) => (
          <td key={ci} className={cellCls}>
            <span
              className="nx-skeleton-cell"
              style={{ width: `${55 + ((ri * 13 + ci * 7) % 35)}%` }}
            />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  sortable      = false,
  searchable    = false,
  searchPlaceholder,
  pageSize,
  sortKey:      controlledSortKey,
  sortDirection: controlledSortDir,
  onSortChange,
  loading       = false,
  emptyState,
  striped       = false,
  hoverable     = true,
  density       = 'comfortable',
  className,
  onRowClick,
}: TableProps<T>) {
  const [query,       setQuery]       = useState('');
  const [internalKey, setInternalKey] = useState<string | null>(null);
  const [internalDir, setInternalDir] = useState<SortDirection>(null);
  const [page,        setPage]        = useState(1);

  const activeSortKey = controlledSortKey ?? internalKey;
  const activeSortDir = controlledSortDir ?? internalDir;

  const handleSort = useCallback((key: string) => {
    let next: SortDirection;
    if (activeSortKey !== key)        next = 'asc';
    else if (activeSortDir === 'asc') next = 'desc';
    else                              next = null;

    if (onSortChange) { onSortChange(key, next); }
    else { setInternalKey(next === null ? null : key); setInternalDir(next); }
    setPage(1);
  }, [activeSortKey, activeSortDir, onSortChange]);

  const handleSearch = useCallback((q: string) => { setQuery(q); setPage(1); }, []);

  const processed = useMemo(() => {
    let rows = data;
    if (searchable && query.trim()) {
      rows = rows.filter(r => defaultSearch(r, query.trim(), columns));
    }
    if (activeSortKey && activeSortDir) {
      const col = columns.find(c => c.key === activeSortKey);
      rows = [...rows].sort((a, b) => defaultSort(a, b, activeSortKey, activeSortDir, col));
    }
    return rows;
  }, [data, query, columns, searchable, activeSortKey, activeSortDir]);

  const pageCount = pageSize ? Math.max(1, Math.ceil(processed.length / pageSize)) : 1;
  const visible   = pageSize ? processed.slice((page - 1) * pageSize, page * pageSize) : processed;
  const colCount  = columns.length;
  const cellCls   = densityCells[density];

  return (
    <div className={cn('flex flex-col bg-surface-elevated border border-stroke rounded-xl overflow-hidden', className)}>
      {searchable && (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-stroke-subtle bg-surface-elevated">
          <SearchBar value={query} onChange={handleSearch} placeholder={searchPlaceholder} />
        </div>
      )}

      <div className="overflow-x-auto w-full">
        <table
          className={cn(
            'w-full border-collapse font-sans text-sm text-content-primary',
            hoverable && 'nx-table-hoverable',
            striped   && 'nx-table-striped',
          )}
          aria-label="Data table"
        >
          <thead className="bg-surface-muted border-b border-stroke">
            <tr>
              {columns.map(col => {
                const isSortable = sortable && col.sortable !== false;
                const isActive   = activeSortKey === col.key;
                return (
                  <th
                    key={col.key}
                    className={cn(
                      'text-xs font-semibold text-content-tertiary tracking-[0.05em] uppercase whitespace-nowrap select-none',
                      cellCls,
                      isSortable && 'cursor-pointer hover:text-content-secondary',
                      isActive   && '!text-violet-300',
                      col.className,
                    )}
                    style={{ width: col.width, minWidth: col.minWidth, textAlign: col.align ?? 'left' }}
                    aria-sort={isActive ? (activeSortDir === 'asc' ? 'ascending' : 'descending') : isSortable ? 'none' : undefined}
                    onClick={isSortable ? () => handleSort(col.key) : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      <span className="flex-1">{col.header}</span>
                      {isSortable && (
                        <SortIcon direction={isActive ? activeSortDir : null} active={isActive && activeSortDir !== null} />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <SkeletonRows cols={colCount} rows={pageSize ?? 5} cellCls={cellCls} />
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="!py-12 !px-6 !text-center">
                  {emptyState ?? (
                    <div className="flex flex-col items-center gap-3">
                      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-content-disabled">
                        <rect x="6" y="6" width="36" height="36" rx="6" stroke="currentColor" strokeWidth="2" />
                        <path d="M16 18h16M16 24h10M16 30h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <p className="text-[0.9375rem] font-semibold text-content-tertiary">No results found</p>
                      {query && (
                        <p className="text-[0.8125rem] text-content-disabled">
                          Try adjusting your search for <strong className="text-content-tertiary font-medium">"{query}"</strong>
                        </p>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              visible.map((row, ri) => (
                <tr
                  key={getRowKey(row, rowKey, (page - 1) * (pageSize ?? 0) + ri)}
                  className={cn(
                    'nx-tr border-b border-stroke-subtle last:border-b-0 transition-colors duration-150',
                    onRowClick && 'cursor-pointer focus-visible:outline-2 focus-visible:outline-stroke-focus focus-visible:outline-offset-[-2px]',
                  )}
                  onClick={onRowClick ? () => onRowClick(row, ri) : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={onRowClick ? e => e.key === 'Enter' && onRowClick(row, ri) : undefined}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className={cn('text-content-primary leading-relaxed align-middle', cellCls, col.className)}
                      style={{ textAlign: col.align ?? 'left' }}
                    >
                      {col.renderCell
                        ? col.renderCell(row[col.key], row, ri)
                        : (row[col.key] as React.ReactNode) ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pageSize && !loading && processed.length > 0 && (
        <Pagination
          page={page}
          pageCount={pageCount}
          total={processed.length}
          pageSize={pageSize}
          onChange={setPage}
        />
      )}
    </div>
  );
}
