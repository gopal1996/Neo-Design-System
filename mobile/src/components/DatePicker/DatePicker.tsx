/**
 * Neo DatePicker — React Native
 *
 * Modes
 *   'date'      Day/month/year grid. Tap a day → closes immediately.
 *   'time'      Time spinner only.
 *   'datetime'  Date + time tabs. Tap Apply to confirm.
 *
 * Extra mobile customisation (beyond desktop parity)
 *   firstDayOfWeek  'sun' | 'mon'
 *   showWeekNumbers  ISO week number column
 *   timeFormat       '12h' | '24h'
 *   markedDates      dots / colour variants on specific dates
 *   quickOptions     preset shortcut chips
 *   renderDay        full custom day-cell render prop
 *   displayFormat    custom trigger display string
 */
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { colors, radii, spacing, typography } from '../../tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DatePickerMode       = 'date' | 'time' | 'datetime';
export type DatePickerSize       = 'sm' | 'md' | 'lg';
export type TimeFormat           = '12h' | '24h';
export type FirstDayOfWeek       = 'sun' | 'mon';
export type MarkedDateVariant    = 'brand' | 'success' | 'warning' | 'error';

export interface MarkedDate {
  /** Render a coloured dot below the day number */
  dot?: boolean;
  /** Dot colour variant */
  variant?: MarkedDateVariant;
  /** Optional tiny label below the dot */
  label?: string;
}

export interface QuickOption {
  label: string;
  /** Return a Date to select, or null to clear */
  getValue: () => Date | null;
}

export interface DayRenderProps {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isWeekend: boolean;
  isCurrentMonth: boolean;
  marked?: MarkedDate;
  onPress: () => void;
}

export interface DatePickerProps {
  // ── Value ─────────────────────────────────────────────────────────────────
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;

  // ── Mode ──────────────────────────────────────────────────────────────────
  mode?: DatePickerMode;
  timeFormat?: TimeFormat;

  // ── Constraints ───────────────────────────────────────────────────────────
  minDate?: Date;
  maxDate?: Date;

  // ── Field UI ──────────────────────────────────────────────────────────────
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  size?: DatePickerSize;
  disabled?: boolean;
  clearable?: boolean;

  // ── Calendar options ──────────────────────────────────────────────────────
  /** First column of the week grid (default 'sun') */
  firstDayOfWeek?: FirstDayOfWeek;
  /** Render weekend day numbers in violet */
  highlightWeekends?: boolean;
  /** Show ISO week number as a leading column */
  showWeekNumbers?: boolean;
  /** Show Today / Clear / Done footer row (default true) */
  showFooter?: boolean;

  // ── Extra customisation ───────────────────────────────────────────────────
  /** Replace the default trigger display string */
  displayFormat?: (date: Date) => string;
  /** Fully custom day-cell renderer */
  renderDay?: (props: DayRenderProps) => React.ReactNode;
  /**
   * Mark specific dates.
   * Key format: 'YYYY-MM-DD' (e.g. '2026-03-25')
   */
  markedDates?: Record<string, MarkedDate>;
  /** Shortcut chips rendered above the calendar */
  quickOptions?: QuickOption[];

  fullWidth?: boolean;
  style?: ViewStyle;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_LONG  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const DAY_SUN = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const DAY_MON = ['Mo','Tu','We','Th','Fr','Sa','Su'];

const VARIANT_DOT: Record<MarkedDateVariant, string> = {
  brand:   colors.violet400,
  success: colors.success,
  warning: colors.warning,
  error:   colors.error,
};

const SIZE_CFG: Record<DatePickerSize, { h: number; fs: number; ph: number }> = {
  sm: { h: 32, fs: 13, ph: spacing[3] },
  md: { h: 40, fs: 14, ph: spacing[4] },
  lg: { h: 48, fs: 16, ph: spacing[4] },
};

// ─── Utilities ────────────────────────────────────────────────────────────────

function toDateKey(d: Date): string {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}

function isDisabled(d: Date, min?: Date, max?: Date): boolean {
  const t = d.getTime();
  const midnight = new Date(d); midnight.setHours(0,0,0,0);
  if (min) { const m = new Date(min); m.setHours(0,0,0,0); if (midnight < m) return true; }
  if (max) { const m = new Date(max); m.setHours(0,0,0,0); if (midnight > m) return true; }
  return false;
}

function isWeekend(d: Date): boolean {
  const dow = d.getDay();
  return dow === 0 || dow === 6;
}

function getISOWeek(d: Date): number {
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  dt.setUTCDate(dt.getUTCDate() + 4 - (dt.getUTCDay() || 7));
  const y = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
  return Math.ceil((((dt.getTime() - y.getTime()) / 86400000) + 1) / 7);
}

/** Build a 2D array of dates (null = empty cell) for the given month */
function buildMonthGrid(year: number, month: number, fdw: FirstDayOfWeek): (Date | null)[][] {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = fdw === 'mon' ? (firstDow + 6) % 7 : firstDow;

  const cells: (Date | null)[] = [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function defaultDisplayFormat(date: Date, mode: DatePickerMode, tf: TimeFormat): string {
  const d   = `${MONTH_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  if (mode === 'date') return d;
  const h24 = date.getHours();
  const min = String(date.getMinutes()).padStart(2, '0');
  if (tf === '24h') return mode === 'time' ? `${String(h24).padStart(2,'0')}:${min}` : `${d}  ${String(h24).padStart(2,'0')}:${min}`;
  const h12 = h24 % 12 || 12;
  const ap  = h24 < 12 ? 'AM' : 'PM';
  return mode === 'time' ? `${h12}:${min} ${ap}` : `${d}  ${h12}:${min} ${ap}`;
}

// ─── Inline icons ─────────────────────────────────────────────────────────────

const ChevronLeft: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: size * 0.5, height: size * 0.5, borderLeftWidth: 1.5, borderBottomWidth: 1.5, borderColor: colors.textSecondary, transform: [{ rotate: '45deg' }] }} />
  </View>
);

const ChevronRight: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: size * 0.5, height: size * 0.5, borderRightWidth: 1.5, borderTopWidth: 1.5, borderColor: colors.textSecondary, transform: [{ rotate: '45deg' }] }} />
  </View>
);

const ChevronUp: React.FC = () => (
  <View style={{ width: 20, height: 16, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 8, height: 8, borderLeftWidth: 1.5, borderTopWidth: 1.5, borderColor: colors.textSecondary, transform: [{ rotate: '45deg' }], marginTop: 3 }} />
  </View>
);

const ChevronDown: React.FC = () => (
  <View style={{ width: 20, height: 16, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 8, height: 8, borderRightWidth: 1.5, borderBottomWidth: 1.5, borderColor: colors.textSecondary, transform: [{ rotate: '45deg' }], marginBottom: 3 }} />
  </View>
);

const CalIcon: React.FC<{ color?: string }> = ({ color = colors.textTertiary }) => (
  <View style={{ width: 16, height: 16 }}>
    <View style={{ position: 'absolute', inset: 0, borderWidth: 1.5, borderRadius: 3, borderColor: color }} />
    <View style={{ position: 'absolute', top: -2, left: 3, width: 2, height: 5, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ position: 'absolute', top: -2, right: 3, width: 2, height: 5, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ position: 'absolute', top: 6, left: 2, right: 2, height: 1, backgroundColor: color }} />
  </View>
);

const XIcon: React.FC<{ size?: number }> = ({ size = 10 }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ position: 'absolute', width: size, height: 1.5, backgroundColor: colors.textTertiary, transform: [{ rotate: '45deg' }] }} />
    <View style={{ position: 'absolute', width: size, height: 1.5, backgroundColor: colors.textTertiary, transform: [{ rotate: '-45deg' }] }} />
  </View>
);

const ClockIcon: React.FC<{ color?: string }> = ({ color = colors.textTertiary }) => (
  <View style={{ width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: color }} />
    <View style={{ position: 'absolute', width: 1.5, height: 5, backgroundColor: color, borderRadius: 1, top: 1, transform: [{ translateY: 2.5 }] }} />
    <View style={{ position: 'absolute', width: 4, height: 1.5, backgroundColor: color, borderRadius: 1, right: 3.5, top: 7 }} />
  </View>
);

// ─── TimeSpinner ──────────────────────────────────────────────────────────────

interface SpinnerProps {
  value: number;
  min: number;
  max: number;
  label: string;
  pad?: boolean;
  onChange: (v: number) => void;
}

const TimeSpinner: React.FC<SpinnerProps> = ({ value, min, max, label, pad = true, onChange }) => {
  const inc = () => onChange(value + 1 > max ? min : value + 1);
  const dec = () => onChange(value - 1 < min ? max : value - 1);

  // Long-press repeat
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRepeat = (fn: () => void) => {
    fn();
    intervalRef.current = setInterval(fn, 120);
  };
  const stopRepeat = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  return (
    <View style={ts.wrap}>
      <Text style={ts.label}>{label}</Text>
      <TouchableOpacity
        onPressIn={() => startRepeat(inc)}
        onPressOut={stopRepeat}
        style={ts.btn}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Increment ${label}`}
      >
        <ChevronUp />
      </TouchableOpacity>
      <View style={ts.valueBox}>
        <Text style={ts.value}>{pad ? String(value).padStart(2, '0') : value}</Text>
      </View>
      <TouchableOpacity
        onPressIn={() => startRepeat(dec)}
        onPressOut={stopRepeat}
        style={ts.btn}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Decrement ${label}`}
      >
        <ChevronDown />
      </TouchableOpacity>
    </View>
  );
};

const ts = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing[1] },
  label: { fontSize: 11, color: colors.textTertiary, fontWeight: typography.fontWeight.medium, textTransform: 'uppercase', letterSpacing: 0.5 },
  btn: { width: 44, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.bgMuted },
  valueBox: { width: 64, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: radii.lg, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border },
  value: { fontSize: 28, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary, includeFontPadding: false },
});

// ─── DaysView ─────────────────────────────────────────────────────────────────

interface DaysViewProps {
  viewDate:          Date;
  selected:          Date | null;
  today:             Date;
  minDate?:          Date;
  maxDate?:          Date;
  firstDayOfWeek:    FirstDayOfWeek;
  highlightWeekends: boolean;
  showWeekNumbers:   boolean;
  markedDates:       Record<string, MarkedDate>;
  renderDay?:        (p: DayRenderProps) => React.ReactNode;
  onSelectDay:       (d: Date) => void;
  onPrevMonth:       () => void;
  onNextMonth:       () => void;
  onClickMonth:      () => void;
  onClickYear:       () => void;
}

const DaysView: React.FC<DaysViewProps> = ({
  viewDate, selected, today, minDate, maxDate,
  firstDayOfWeek, highlightWeekends, showWeekNumbers,
  markedDates, renderDay, onSelectDay,
  onPrevMonth, onNextMonth, onClickMonth, onClickYear,
}) => {
  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const weeks = buildMonthGrid(year, month, firstDayOfWeek);
  const dayNames = firstDayOfWeek === 'mon' ? DAY_MON : DAY_SUN;

  const canPrev = !minDate || new Date(year, month, 1) > new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const canNext = !maxDate || new Date(year, month + 1, 1) <= new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 1);

  return (
    <View style={dv.root}>
      {/* Nav header */}
      <View style={dv.navRow}>
        <TouchableOpacity onPress={onPrevMonth} disabled={!canPrev} style={[dv.navBtn, !canPrev && dv.navBtnDisabled]}>
          <ChevronLeft />
        </TouchableOpacity>
        <View style={dv.navCenter}>
          <TouchableOpacity onPress={onClickMonth} accessibilityRole="button">
            <Text style={dv.navMonth}>{MONTH_LONG[month]}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClickYear} accessibilityRole="button">
            <Text style={dv.navYear}>{year}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onNextMonth} disabled={!canNext} style={[dv.navBtn, !canNext && dv.navBtnDisabled]}>
          <ChevronRight />
        </TouchableOpacity>
      </View>

      {/* Day header row */}
      <View style={dv.dayHeaderRow}>
        {showWeekNumbers && <View style={dv.weekNumCell}><Text style={dv.weekNumHeader}>#</Text></View>}
        {dayNames.map(d => (
          <View key={d} style={dv.dayHeaderCell}>
            <Text style={dv.dayHeaderText}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Weeks */}
      {weeks.map((week, wi) => (
        <View key={wi} style={dv.weekRow}>
          {showWeekNumbers && (
            <View style={dv.weekNumCell}>
              <Text style={dv.weekNumText}>
                {week.find(Boolean) ? getISOWeek(week.find(Boolean)!) : ''}
              </Text>
            </View>
          )}
          {week.map((day, di) => {
            if (!day) return <View key={di} style={dv.dayCell} />;

            const sel      = !!selected && isSameDay(day, selected);
            const isToday  = isSameDay(day, today);
            const disabled = isDisabled(day, minDate, maxDate);
            const weekend  = isWeekend(day);
            const key      = toDateKey(day);
            const marked   = markedDates[key];

            const press = () => { if (!disabled) onSelectDay(day); };

            if (renderDay) {
              return (
                <View key={di} style={dv.dayCell}>
                  {renderDay({ date: day, isSelected: sel, isToday, isDisabled: disabled, isWeekend: weekend, isCurrentMonth: day.getMonth() === month, marked, onPress: press })}
                </View>
              );
            }

            const numColor = disabled
              ? colors.textTertiary
              : sel
                ? '#fff'
                : weekend && highlightWeekends
                  ? colors.violet300
                  : colors.textPrimary;

            return (
              <TouchableOpacity
                key={di}
                onPress={press}
                disabled={disabled}
                activeOpacity={0.7}
                style={[
                  dv.dayCell,
                  sel     && dv.dayCellSelected,
                  isToday && !sel && dv.dayCellToday,
                  disabled && dv.dayCellDisabled,
                ]}
                accessibilityRole="button"
                accessibilityLabel={day.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                accessibilityState={{ selected: sel, disabled }}
              >
                <Text style={[dv.dayNum, { color: numColor }]}>{day.getDate()}</Text>
                {marked?.dot && (
                  <View style={[dv.dot, { backgroundColor: VARIANT_DOT[marked.variant ?? 'brand'] }]} />
                )}
                {marked?.label && (
                  <Text style={[dv.dotLabel, { color: VARIANT_DOT[marked.variant ?? 'brand'] }]}>{marked.label}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const dv = StyleSheet.create({
  root: { paddingHorizontal: spacing[2] },
  navRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing[3] },
  navBtn: { width: 36, height: 36, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgMuted },
  navBtnDisabled: { opacity: 0.3 },
  navCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2] },
  navMonth: { fontSize: 16, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary },
  navYear:  { fontSize: 16, fontWeight: typography.fontWeight.regular,  color: colors.violet400 },
  dayHeaderRow: { flexDirection: 'row', marginBottom: spacing[1] },
  dayHeaderCell: { flex: 1, alignItems: 'center', paddingVertical: spacing[1] },
  dayHeaderText: { fontSize: 11, fontWeight: typography.fontWeight.semibold, color: colors.textTertiary, textTransform: 'uppercase' },
  weekRow: { flexDirection: 'row' },
  weekNumCell: { width: 28, alignItems: 'center', justifyContent: 'center' },
  weekNumHeader: { fontSize: 10, color: colors.textTertiary, fontWeight: typography.fontWeight.semibold },
  weekNumText: { fontSize: 10, color: colors.textTertiary },
  dayCell: { flex: 1, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, margin: 1, gap: 1 },
  dayCellSelected: { backgroundColor: colors.violet500 },
  dayCellToday: { borderWidth: 1.5, borderColor: colors.violet500 },
  dayCellDisabled: { opacity: 0.3 },
  dayNum: { fontSize: 13, fontWeight: typography.fontWeight.medium, includeFontPadding: false },
  dot: { width: 4, height: 4, borderRadius: 2 },
  dotLabel: { fontSize: 8, fontWeight: typography.fontWeight.semibold, includeFontPadding: false },
});

// ─── MonthsView ───────────────────────────────────────────────────────────────

interface MonthsViewProps {
  viewDate:     Date;
  selected:     Date | null;
  minDate?:     Date;
  maxDate?:     Date;
  onSelect:     (month: number) => void;
  onBack:       () => void;
}

const MonthsView: React.FC<MonthsViewProps> = ({ viewDate, selected, minDate, maxDate, onSelect, onBack }) => {
  const year  = viewDate.getFullYear();
  const rows  = [0, 1, 2, 3].map(r => [r * 3, r * 3 + 1, r * 3 + 2]);

  const isMonthDisabled = (m: number) => {
    const firstOfMonth = new Date(year, m, 1);
    const lastOfMonth  = new Date(year, m + 1, 0);
    if (minDate && lastOfMonth < new Date(minDate.getFullYear(), minDate.getMonth(), 1)) return true;
    if (maxDate && firstOfMonth > new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)) return true;
    return false;
  };

  return (
    <View style={mv.root}>
      <View style={mv.header}>
        <TouchableOpacity onPress={onBack} style={mv.backBtn} accessibilityRole="button">
          <ChevronLeft />
          <Text style={mv.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={mv.title}>{year}</Text>
        <View style={{ width: 64 }} />
      </View>
      {rows.map((row, ri) => (
        <View key={ri} style={mv.row}>
          {row.map(m => {
            const sel      = !!selected && selected.getFullYear() === year && selected.getMonth() === m;
            const disabled = isMonthDisabled(m);
            return (
              <TouchableOpacity
                key={m}
                onPress={() => !disabled && onSelect(m)}
                disabled={disabled}
                activeOpacity={0.7}
                style={[mv.cell, sel && mv.cellSelected, disabled && mv.cellDisabled]}
                accessibilityRole="button"
                accessibilityState={{ selected: sel, disabled }}
              >
                <Text style={[mv.cellText, sel && mv.cellTextSelected, disabled && mv.cellTextDisabled]}>
                  {MONTH_SHORT[m]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const mv = StyleSheet.create({
  root: { paddingHorizontal: spacing[2] },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing[4] },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: spacing[1], paddingRight: spacing[2] },
  backText: { fontSize: 13, color: colors.textSecondary },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary },
  row: { flexDirection: 'row', marginBottom: spacing[2] },
  cell: { flex: 1, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radii.lg, marginHorizontal: spacing[1] },
  cellSelected: { backgroundColor: colors.violet500 },
  cellDisabled: { opacity: 0.3 },
  cellText: { fontSize: 14, fontWeight: typography.fontWeight.medium, color: colors.textPrimary },
  cellTextSelected: { color: '#fff' },
  cellTextDisabled: { color: colors.textTertiary },
});

// ─── YearsView ────────────────────────────────────────────────────────────────

interface YearsViewProps {
  viewDate:  Date;
  selected:  Date | null;
  minDate?:  Date;
  maxDate?:  Date;
  onSelect:  (year: number) => void;
  onBack:    () => void;
}

const YearsView: React.FC<YearsViewProps> = ({ viewDate, selected, minDate, maxDate, onSelect, onBack }) => {
  const base = Math.floor(viewDate.getFullYear() / 12) * 12;
  const [pageBase, setPageBase] = useState(base);
  const years = Array.from({ length: 12 }, (_, i) => pageBase + i);
  const rows  = [0, 1, 2, 3].map(r => years.slice(r * 3, r * 3 + 3));

  const isYearDisabled = (y: number) => {
    if (minDate && y < minDate.getFullYear()) return true;
    if (maxDate && y > maxDate.getFullYear()) return true;
    return false;
  };

  return (
    <View style={yv.root}>
      <View style={yv.header}>
        <TouchableOpacity onPress={onBack} style={yv.backBtn} accessibilityRole="button">
          <ChevronLeft />
          <Text style={yv.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={yv.title}>{pageBase}–{pageBase + 11}</Text>
        <View style={yv.pageBtns}>
          <TouchableOpacity onPress={() => setPageBase(b => b - 12)} style={yv.pageBtn}>
            <ChevronLeft size={12} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPageBase(b => b + 12)} style={yv.pageBtn}>
            <ChevronRight size={12} />
          </TouchableOpacity>
        </View>
      </View>
      {rows.map((row, ri) => (
        <View key={ri} style={yv.row}>
          {row.map(y => {
            const sel      = !!selected && selected.getFullYear() === y;
            const disabled = isYearDisabled(y);
            return (
              <TouchableOpacity
                key={y}
                onPress={() => !disabled && onSelect(y)}
                disabled={disabled}
                activeOpacity={0.7}
                style={[yv.cell, sel && yv.cellSelected, disabled && yv.cellDisabled]}
                accessibilityRole="button"
                accessibilityState={{ selected: sel, disabled }}
              >
                <Text style={[yv.cellText, sel && yv.cellTextSelected]}>{y}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const yv = StyleSheet.create({
  root: { paddingHorizontal: spacing[2] },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing[4] },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: spacing[1], paddingRight: spacing[2] },
  backText: { fontSize: 13, color: colors.textSecondary },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary },
  pageBtns: { flexDirection: 'row', gap: spacing[1] },
  pageBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgMuted, borderRadius: radii.md },
  row: { flexDirection: 'row', marginBottom: spacing[2] },
  cell: { flex: 1, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radii.lg, marginHorizontal: spacing[1] },
  cellSelected: { backgroundColor: colors.violet500 },
  cellDisabled: { opacity: 0.3 },
  cellText: { fontSize: 14, fontWeight: typography.fontWeight.medium, color: colors.textPrimary },
  cellTextSelected: { color: '#fff' },
});

// ─── TimeView ─────────────────────────────────────────────────────────────────

interface TimeViewProps {
  hour:       number; // 0–23
  minute:     number;
  timeFormat: TimeFormat;
  onHour:     (h: number) => void;
  onMinute:   (m: number) => void;
}

const TimeView: React.FC<TimeViewProps> = ({ hour, minute, timeFormat, onHour, onMinute }) => {
  const is12h   = timeFormat === '12h';
  const display = is12h ? (hour % 12 || 12) : hour;
  const ampm    = hour < 12 ? 'AM' : 'PM';

  const setHour12 = (h: number) => {
    const h24 = ampm === 'PM' ? (h % 12) + 12 : h % 12;
    onHour(h24);
  };
  const toggleAmPm = () => onHour(hour < 12 ? hour + 12 : hour - 12);

  return (
    <View style={tv.root}>
      <View style={tv.row}>
        <TimeSpinner
          value={is12h ? display : hour}
          min={is12h ? 1 : 0}
          max={is12h ? 12 : 23}
          label="Hour"
          onChange={is12h ? setHour12 : onHour}
        />
        <Text style={tv.colon}>:</Text>
        <TimeSpinner
          value={minute}
          min={0}
          max={59}
          label="Minute"
          onChange={onMinute}
        />
        {is12h && (
          <TouchableOpacity onPress={toggleAmPm} style={tv.ampmBtn} activeOpacity={0.7} accessibilityRole="button">
            <Text style={[tv.ampmText, ampm === 'AM' && tv.ampmActive]}>AM</Text>
            <View style={tv.ampmDivider} />
            <Text style={[tv.ampmText, ampm === 'PM' && tv.ampmActive]}>PM</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const tv = StyleSheet.create({
  root: { paddingHorizontal: spacing[4], paddingVertical: spacing[4] },
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: spacing[3] },
  colon: { fontSize: 28, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary, marginBottom: spacing[2], lineHeight: 32 },
  ampmBtn: { marginBottom: spacing[1], borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, overflow: 'hidden', width: 52 },
  ampmText: { height: 44, textAlign: 'center', textAlignVertical: 'center', fontSize: 14, fontWeight: typography.fontWeight.medium, color: colors.textTertiary, lineHeight: 44 },
  ampmDivider: { height: 1, backgroundColor: colors.border },
  ampmActive: { color: colors.violet300, backgroundColor: 'rgba(124,58,237,0.12)' },
});

// ─── Main DatePicker ──────────────────────────────────────────────────────────

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  defaultValue  = null,
  onChange,
  mode          = 'date',
  timeFormat    = '12h',
  minDate,
  maxDate,
  label,
  placeholder,
  hint,
  error,
  size          = 'md',
  disabled      = false,
  clearable     = true,
  firstDayOfWeek = 'sun',
  highlightWeekends = false,
  showWeekNumbers   = false,
  showFooter        = true,
  displayFormat,
  renderDay,
  markedDates       = {},
  quickOptions,
  fullWidth         = false,
  style,
}) => {
  const cfg = SIZE_CFG[size];

  // ── Value (controlled / uncontrolled) ──
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<Date | null>(defaultValue ?? null);
  const selected: Date | null = isControlled ? (value ?? null) : internal;

  const commit = useCallback((d: Date | null) => {
    if (!isControlled) setInternal(d);
    onChange?.(d);
  }, [isControlled, onChange]);

  // ── Sheet state ──
  const [open, setOpen]           = useState(false);
  const slideAnim                 = useRef(new Animated.Value(0)).current;

  // ── Internal navigation state ──
  type PanelView = 'days' | 'months' | 'years' | 'time';
  const [panelView, setPanelView]   = useState<PanelView>('days');
  const [activeTab, setActiveTab]   = useState<'date' | 'time'>('date');
  const [viewDate, setViewDate]     = useState<Date>(() => selected ?? new Date());

  // Staging value for datetime mode (confirmed only on Apply)
  const [staged, setStaged] = useState<Date | null>(null);

  // Today ref
  const today = useRef(new Date()).current;

  // ── Open / close ──
  const openSheet = useCallback(() => {
    if (disabled) return;
    const base = selected ?? new Date();
    setViewDate(new Date(base.getFullYear(), base.getMonth(), 1));
    setStaged(selected ? new Date(selected) : new Date());
    setPanelView('days');
    setActiveTab(mode === 'time' ? 'time' : 'date');
    setOpen(true);
    Animated.spring(slideAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 12 }).start();
  }, [disabled, selected, mode, slideAnim]);

  const closeSheet = useCallback(() => {
    Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setOpen(false));
  }, [slideAnim]);

  // ── Day selection ──
  const onSelectDay = useCallback((d: Date) => {
    if (mode === 'date') {
      // Preserve time from existing selection or zero it out
      const next = selected
        ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), selected.getHours(), selected.getMinutes())
        : new Date(d.getFullYear(), d.getMonth(), d.getDate());
      commit(next);
      closeSheet();
    } else {
      // datetime — stage the date, keep time from staged
      const s = staged ?? new Date();
      const next = new Date(d.getFullYear(), d.getMonth(), d.getDate(), s.getHours(), s.getMinutes());
      setStaged(next);
      // Auto-switch to time tab
      setActiveTab('time');
    }
  }, [mode, selected, staged, commit, closeSheet]);

  // ── Month/year navigation ──
  const prevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const onSelectMonth = (m: number) => {
    setViewDate(d => new Date(d.getFullYear(), m, 1));
    setPanelView('days');
  };

  const onSelectYear = (y: number) => {
    setViewDate(d => new Date(y, d.getMonth(), 1));
    setPanelView('months');
  };

  // ── Time spinners ──
  const stagedHour   = staged?.getHours()   ?? 0;
  const stagedMinute = staged?.getMinutes() ?? 0;

  const onHour = (h: number) => {
    const s = staged ?? new Date();
    setStaged(new Date(s.getFullYear(), s.getMonth(), s.getDate(), h, s.getMinutes()));
  };
  const onMinute = (m: number) => {
    const s = staged ?? new Date();
    setStaged(new Date(s.getFullYear(), s.getMonth(), s.getDate(), s.getHours(), m));
  };

  // ── Footer actions ──
  const applySelection = () => {
    if (mode === 'date') {
      // Already committed on day tap; close just in case footer is shown
      closeSheet();
    } else {
      // datetime or time
      commit(staged);
      closeSheet();
    }
  };

  const goToday = () => {
    const t = new Date();
    if (mode === 'date') {
      commit(t);
      closeSheet();
    } else {
      setStaged(t);
      setViewDate(new Date(t.getFullYear(), t.getMonth(), 1));
      setActiveTab('date');
      setPanelView('days');
    }
  };

  const clearSelection = () => {
    commit(null);
    closeSheet();
  };

  // ── Trigger display ──
  const triggerText = selected
    ? (displayFormat ? displayFormat(selected) : defaultDisplayFormat(selected, mode, timeFormat))
    : (placeholder ?? (mode === 'time' ? 'Select time' : mode === 'datetime' ? 'Select date & time' : 'Select date'));

  const hasValue     = !!selected;
  const triggerBorder = error ? colors.error : open ? colors.borderFocus : colors.border;
  const triggerBorderW = open && !error ? 1.5 : 1;

  const translateY = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [600, 0] });

  // ── Effective panel view (tab-aware) ──
  const showTimePanel = mode !== 'date' && activeTab === 'time';

  return (
    <View style={[s.wrapper, fullWidth && s.fullWidth, style]}>
      {/* Label */}
      {label != null && <Text style={s.label}>{label}</Text>}

      {/* Trigger */}
      <TouchableOpacity
        onPress={openSheet}
        disabled={disabled}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={label ?? triggerText}
        accessibilityState={{ expanded: open, disabled }}
        style={[
          s.trigger,
          { height: cfg.h, paddingHorizontal: cfg.ph, borderColor: triggerBorder, borderWidth: triggerBorderW },
          disabled && s.triggerDisabled,
        ]}
      >
        <View style={s.triggerIcon}>
          {mode === 'time' ? <ClockIcon color={hasValue ? colors.violet400 : colors.textTertiary} /> : <CalIcon color={hasValue ? colors.violet400 : colors.textTertiary} />}
        </View>
        <Text style={[s.triggerText, { fontSize: cfg.fs }, !hasValue && s.placeholder]} numberOfLines={1}>
          {triggerText}
        </Text>
        {clearable && hasValue && (
          <TouchableOpacity
            onPress={clearSelection}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Clear date"
          >
            <View style={s.clearBtn}><XIcon size={9} /></View>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {error != null && <Text style={s.error} accessibilityRole="alert">{error}</Text>}
      {hint  != null && error == null && <Text style={s.hint}>{hint}</Text>}

      {/* ── Sheet Modal ── */}
      <Modal visible={open} transparent animationType="none" onRequestClose={closeSheet} statusBarTranslucent>
        <TouchableOpacity style={s.backdrop} onPress={closeSheet} activeOpacity={1} accessibilityLabel="Close date picker" />

        <Animated.View style={[s.sheet, { transform: [{ translateY }] }]}>
          {/* Handle */}
          <View style={s.handle} />

          {/* Sheet header */}
          <View style={s.sheetHeader}>
            {label != null && <Text style={s.sheetTitle}>{label}</Text>}
            <View style={{ flex: 1 }} />
            {hasValue && (
              <Text style={s.sheetValue}>
                {displayFormat ? displayFormat(selected!) : defaultDisplayFormat(selected!, mode, timeFormat)}
              </Text>
            )}
            <TouchableOpacity onPress={closeSheet} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={s.closeBtn} accessibilityRole="button" accessibilityLabel="Close">
              <XIcon size={11} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Datetime tabs */}
          {mode === 'datetime' && (
            <View style={s.tabRow}>
              <TouchableOpacity
                style={[s.tabBtn, activeTab === 'date' && s.tabBtnActive]}
                onPress={() => { setActiveTab('date'); setPanelView('days'); }}
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === 'date' }}
              >
                <CalIcon color={activeTab === 'date' ? colors.violet400 : colors.textTertiary} />
                <Text style={[s.tabText, activeTab === 'date' && s.tabTextActive]}>Date</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.tabBtn, activeTab === 'time' && s.tabBtnActive]}
                onPress={() => { setActiveTab('time'); setPanelView('time'); }}
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === 'time' }}
              >
                <ClockIcon color={activeTab === 'time' ? colors.violet400 : colors.textTertiary} />
                <Text style={[s.tabText, activeTab === 'time' && s.tabTextActive]}>Time</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Quick options */}
          {quickOptions && quickOptions.length > 0 && activeTab === 'date' && panelView === 'days' && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.quickScroll} contentContainerStyle={s.quickRow}>
              {quickOptions.map((opt, i) => (
                <TouchableOpacity
                  key={i}
                  style={s.quickChip}
                  onPress={() => {
                    const d = opt.getValue();
                    if (mode === 'date') { commit(d); closeSheet(); }
                    else { setStaged(d); if (d) setViewDate(new Date(d.getFullYear(), d.getMonth(), 1)); }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={s.quickText}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Panel content */}
          <View style={s.panelContent}>
            {!showTimePanel && panelView === 'days' && (
              <DaysView
                viewDate={viewDate}
                selected={mode === 'datetime' ? staged : selected}
                today={today}
                minDate={minDate}
                maxDate={maxDate}
                firstDayOfWeek={firstDayOfWeek}
                highlightWeekends={highlightWeekends}
                showWeekNumbers={showWeekNumbers}
                markedDates={markedDates}
                renderDay={renderDay}
                onSelectDay={onSelectDay}
                onPrevMonth={prevMonth}
                onNextMonth={nextMonth}
                onClickMonth={() => setPanelView('months')}
                onClickYear={() => setPanelView('years')}
              />
            )}
            {!showTimePanel && panelView === 'months' && (
              <MonthsView
                viewDate={viewDate}
                selected={selected}
                minDate={minDate}
                maxDate={maxDate}
                onSelect={onSelectMonth}
                onBack={() => setPanelView('days')}
              />
            )}
            {!showTimePanel && panelView === 'years' && (
              <YearsView
                viewDate={viewDate}
                selected={selected}
                minDate={minDate}
                maxDate={maxDate}
                onSelect={onSelectYear}
                onBack={() => setPanelView('months')}
              />
            )}
            {(showTimePanel || mode === 'time') && (
              <TimeView
                hour={stagedHour}
                minute={stagedMinute}
                timeFormat={timeFormat}
                onHour={onHour}
                onMinute={onMinute}
              />
            )}
          </View>

          {/* Footer */}
          {showFooter && (
            <View style={s.footer}>
              {mode !== 'time' && activeTab !== 'time' && (
                <TouchableOpacity onPress={goToday} style={s.footerGhost} activeOpacity={0.7} accessibilityRole="button">
                  <Text style={s.footerGhostText}>Today</Text>
                </TouchableOpacity>
              )}
              {clearable && hasValue && (
                <TouchableOpacity onPress={clearSelection} style={s.footerGhost} activeOpacity={0.7} accessibilityRole="button">
                  <Text style={s.footerGhostText}>Clear</Text>
                </TouchableOpacity>
              )}
              <View style={{ flex: 1 }} />
              <TouchableOpacity onPress={applySelection} style={s.applyBtn} activeOpacity={0.8} accessibilityRole="button">
                <Text style={s.applyText}>{mode === 'date' ? 'Done' : 'Apply'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </Modal>
    </View>
  );
};

DatePicker.displayName = 'DatePicker';

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  wrapper:  { gap: spacing[1] },
  fullWidth: { width: '100%' },
  label: { fontSize: 14, fontWeight: typography.fontWeight.medium, color: colors.textSecondary, marginBottom: 2 },

  // ── Trigger ──
  trigger: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgElevated, borderRadius: radii.lg, gap: spacing[2], overflow: 'hidden' },
  triggerDisabled: { opacity: 0.45 },
  triggerIcon: { paddingLeft: spacing[1] },
  triggerText: { flex: 1, color: colors.textPrimary, fontWeight: typography.fontWeight.regular, includeFontPadding: false },
  placeholder: { color: colors.textTertiary },
  clearBtn: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.bgMuted, alignItems: 'center', justifyContent: 'center', marginRight: spacing[1] },
  error: { fontSize: 13, color: colors.error, lineHeight: 18 },
  hint:  { fontSize: 13, color: colors.textTertiary, lineHeight: 18 },

  // ── Backdrop / Sheet ──
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.65)' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.bgOverlay,
    borderTopLeftRadius: radii['2xl'], borderTopRightRadius: radii['2xl'],
    borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border,
    paddingBottom: Platform.OS === 'ios' ? spacing[8] : spacing[4],
  },
  handle: { alignSelf: 'center', width: 36, height: 4, borderRadius: radii.full, backgroundColor: colors.neutral700, marginTop: spacing[3], marginBottom: spacing[2] },

  // ── Sheet header ──
  sheetHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing[6], paddingBottom: spacing[3], borderBottomWidth: 1, borderColor: colors.border, gap: spacing[2] },
  sheetTitle:  { fontSize: 16, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary },
  sheetValue:  { fontSize: 13, color: colors.violet400, fontWeight: typography.fontWeight.medium },
  closeBtn:    { width: 28, height: 28, borderRadius: radii.md, backgroundColor: colors.bgMuted, alignItems: 'center', justifyContent: 'center' },

  // ── Datetime tabs ──
  tabRow: { flexDirection: 'row', gap: spacing[2], paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderBottomWidth: 1, borderColor: colors.border },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2], height: 40, borderRadius: radii.lg, backgroundColor: colors.bgMuted, borderWidth: 1, borderColor: 'transparent' },
  tabBtnActive: { backgroundColor: 'rgba(124,58,237,0.12)', borderColor: colors.violet600 },
  tabText: { fontSize: 14, fontWeight: typography.fontWeight.medium, color: colors.textTertiary },
  tabTextActive: { color: colors.violet300 },

  // ── Quick options ──
  quickScroll: { flexGrow: 0, borderBottomWidth: 1, borderColor: colors.border },
  quickRow:    { flexDirection: 'row', gap: spacing[2], paddingHorizontal: spacing[4], paddingVertical: spacing[3] },
  quickChip:   { paddingHorizontal: spacing[3], paddingVertical: spacing[2], borderRadius: radii.full, backgroundColor: colors.bgMuted, borderWidth: 1, borderColor: colors.border },
  quickText:   { fontSize: 13, color: colors.textSecondary, fontWeight: typography.fontWeight.medium },

  // ── Panel content ──
  panelContent: { paddingHorizontal: spacing[2], paddingTop: spacing[3] },

  // ── Footer ──
  footer: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], paddingHorizontal: spacing[4], paddingTop: spacing[3], borderTopWidth: 1, borderColor: colors.border },
  footerGhost: { paddingHorizontal: spacing[3], paddingVertical: spacing[2] },
  footerGhostText: { fontSize: 14, color: colors.textSecondary, fontWeight: typography.fontWeight.medium },
  applyBtn: { height: 40, paddingHorizontal: spacing[6], backgroundColor: colors.violet500, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center' },
  applyText: { fontSize: 14, fontWeight: typography.fontWeight.semibold, color: '#fff', letterSpacing: -0.1 },
});
