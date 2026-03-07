// ─── Calendar math ────────────────────────────────────────────

export const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
] as const;

export const MONTHS_SHORT = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec',
] as const;

export interface CalendarDay {
  date:          Date;
  dayOfMonth:    number;
  isCurrentMonth:boolean;
  isToday:       boolean;
  isSelected:    boolean;
  isInRange:     boolean;
  isRangeStart:  boolean;
  isRangeEnd:    boolean;
  isDisabled:    boolean;
  isWeekend:     boolean;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** Returns a 6×7 grid of CalendarDay objects for the given month view */
export function buildCalendarGrid(
  viewYear:  number,
  viewMonth: number,
  selected:  Date | null,
  rangeEnd:  Date | null,
  minDate?:  Date,
  maxDate?:  Date,
): CalendarDay[][] {
  const today       = new Date();
  const firstDay    = getFirstDayOfMonth(viewYear, viewMonth);
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const prevMonth   = viewMonth === 0 ? 11 : viewMonth - 1;
  const prevYear    = viewMonth === 0 ? viewYear - 1 : viewYear;
  const daysInPrev  = getDaysInMonth(prevYear, prevMonth);

  const cells: CalendarDay[] = [];

  // Trailing days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = new Date(prevYear, prevMonth, daysInPrev - i);
    cells.push(makeDay(d, false, today, selected, rangeEnd, minDate, maxDate));
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewYear, viewMonth, d);
    cells.push(makeDay(date, true, today, selected, rangeEnd, minDate, maxDate));
  }

  // Leading days for next month
  const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  const nextYear  = viewMonth === 11 ? viewYear + 1 : viewYear;
  let   day       = 1;
  while (cells.length < 42) {
    const date = new Date(nextYear, nextMonth, day++);
    cells.push(makeDay(date, false, today, selected, rangeEnd, minDate, maxDate));
  }

  // Split into weeks
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < 6; i++) weeks.push(cells.slice(i * 7, i * 7 + 7));
  return weeks;
}

function makeDay(
  date:      Date,
  isCurrent: boolean,
  today:     Date,
  selected:  Date | null,
  rangeEnd:  Date | null,
  minDate?:  Date,
  maxDate?:  Date,
): CalendarDay {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const isSelected  = !!selected && isSameDay(d, selected);
  const isToday     = isSameDay(d, today);
  const isDisabled  =
    (!!minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) ||
    (!!maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()));

  const isRangeStart = !!selected && isSameDay(d, selected);
  const isRangeEnd   = !!rangeEnd && isSameDay(d, rangeEnd);
  const isInRange    = !!selected && !!rangeEnd &&
    d > new Date(selected.getFullYear(), selected.getMonth(), selected.getDate()) &&
    d < new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate());

  return {
    date:           d,
    dayOfMonth:     date.getDate(),
    isCurrentMonth: isCurrent,
    isToday,
    isSelected,
    isInRange,
    isRangeStart,
    isRangeEnd,
    isDisabled,
    isWeekend:      d.getDay() === 0 || d.getDay() === 6,
  };
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}

// ─── Formatting ───────────────────────────────────────────────

export function formatDate(date: Date, withTime = false): string {
  const y  = date.getFullYear();
  const m  = String(date.getMonth() + 1).padStart(2, '0');
  const d  = String(date.getDate()).padStart(2, '0');
  if (!withTime) return `${y}-${m}-${d}`;
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

export function formatDisplay(date: Date | null, withTime = false): string {
  if (!date) return '';
  const months = MONTHS_SHORT;
  const d = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  if (!withTime) return d;
  const h  = date.getHours();
  const m  = String(date.getMinutes()).padStart(2, '0');
  const hr = h % 12 || 12;
  const ap = h < 12 ? 'AM' : 'PM';
  return `${d} · ${hr}:${m} ${ap}`;
}

export function parseDate(str: string): Date | null {
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

// ─── Year range helpers ───────────────────────────────────────

export function buildYearRange(centreYear: number): number[] {
  const start = Math.floor(centreYear / 12) * 12;
  return Array.from({ length: 12 }, (_, i) => start + i);
}
