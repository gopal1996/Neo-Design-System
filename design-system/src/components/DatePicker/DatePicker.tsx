import React, {
  useState, useRef, useEffect, useCallback, useId,
} from 'react';
import { cn } from '../../utils/cn';
import {
  DAYS_OF_WEEK, MONTHS, MONTHS_SHORT,
  buildCalendarGrid, buildYearRange,
  formatDisplay, isSameDay,
} from './datepicker.utils';

export type DatePickerMode = 'date' | 'datetime';
export type DatePickerView = 'days' | 'months' | 'years';
export type DatePickerSize = 'sm' | 'md' | 'lg';

export interface DatePickerProps {
  value?:             Date | null;
  defaultValue?:      Date | null;
  onChange?:          (date: Date | null) => void;
  mode?:              DatePickerMode;
  placeholder?:       string;
  minDate?:           Date;
  maxDate?:           Date;
  disabled?:          boolean;
  clearable?:         boolean;
  label?:             string;
  hint?:              string;
  error?:             string;
  size?:              DatePickerSize;
  id?:                string;
  className?:         string;
  showFooter?:        boolean;
  highlightWeekends?: boolean;
}

const CalIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <rect x="1.5" y="2.5" width="13" height="12" rx="2" />
    <path d="M1.5 6.5h13M5 1.5v2M11 1.5v2" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-full h-full">
    <circle cx="8" cy="8" r="6.5" />
    <path d="M8 4.5V8l2.5 2" />
  </svg>
);
const ChevLeft = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M10 4L6 8l4 4" />
  </svg>
);
const ChevRight = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M6 4l4 4-4 4" />
  </svg>
);
const DblChevLeft = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M9 4L5 8l4 4M13 4L9 8l4 4" />
  </svg>
);
const DblChevRight = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M7 4l4 4-4 4M3 4l4 4-4 4" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
    <path d="M4 4l8 8M12 4L4 12" />
  </svg>
);

const navBtnCls = cn(
  'flex items-center justify-center w-7 h-7 bg-transparent border border-transparent rounded-md',
  'text-content-tertiary cursor-pointer p-[5px] flex-shrink-0',
  'transition-all duration-150',
  'hover:text-content-primary hover:bg-neutral-800 hover:border-stroke',
  'focus-visible:outline-2 focus-visible:outline-stroke-focus focus-visible:outline-offset-2',
);

interface TimePickerProps {
  hours: number; minutes: number; onChange: (h: number, m: number) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ hours, minutes, onChange }) => {
  const isAm = hours < 12;
  const hr12 = hours % 12 || 12;

  const setHour12  = (h: number) => { const h24 = isAm ? h % 12 : (h % 12) + 12; onChange(h24, minutes); };
  const setMinute  = (m: number) => onChange(hours, m);
  const toggleAm   = () => onChange(isAm ? hours + 12 : hours - 12, minutes);

  const arrowCls = cn(
    'w-6 h-[18px] bg-transparent border-none text-content-tertiary cursor-pointer text-[0.625rem]',
    'rounded-sm flex items-center justify-center transition-all duration-150',
    'hover:text-violet-300 hover:bg-neutral-700',
  );

  return (
    <div className="flex items-center gap-3 px-2 py-1">
      <span className="w-[14px] h-[14px] text-content-tertiary flex-shrink-0"><ClockIcon /></span>
      <div className="flex items-center gap-2 flex-1">
        {/* Hour */}
        <div className="flex flex-col items-center gap-[2px]">
          <button className={arrowCls} onClick={() => setHour12((hr12 % 12) + 1)} aria-label="Increase hour">▲</button>
          <input
            type="number" min={1} max={12} value={String(hr12).padStart(2, '0')}
            onChange={e => { const v = parseInt(e.target.value); if (v >= 1 && v <= 12) setHour12(v); }}
            className="nx-time-input w-11 h-8 text-center bg-surface-muted border border-stroke rounded-md text-content-primary font-mono text-base font-semibold outline-none transition-all duration-150 focus:border-stroke-focus focus:shadow-[0_0_0_2px_rgba(139,92,246,0.2)]"
            aria-label="Hour"
          />
          <button className={arrowCls} onClick={() => setHour12(hr12 === 1 ? 12 : hr12 - 1)} aria-label="Decrease hour">▼</button>
        </div>

        <span className="text-lg font-bold text-content-tertiary leading-none">:</span>

        {/* Minute */}
        <div className="flex flex-col items-center gap-[2px]">
          <button className={arrowCls} onClick={() => setMinute((minutes + 1) % 60)} aria-label="Increase minute">▲</button>
          <input
            type="number" min={0} max={59} value={String(minutes).padStart(2, '0')}
            onChange={e => { const v = parseInt(e.target.value); if (v >= 0 && v <= 59) setMinute(v); }}
            className="nx-time-input w-11 h-8 text-center bg-surface-muted border border-stroke rounded-md text-content-primary font-mono text-base font-semibold outline-none transition-all duration-150 focus:border-stroke-focus focus:shadow-[0_0_0_2px_rgba(139,92,246,0.2)]"
            aria-label="Minute"
          />
          <button className={arrowCls} onClick={() => setMinute(minutes === 0 ? 59 : minutes - 1)} aria-label="Decrease minute">▼</button>
        </div>

        {/* AM/PM */}
        <button
          className="h-8 px-2 bg-surface-muted border border-stroke rounded-md text-content-secondary text-xs font-semibold cursor-pointer tracking-[0.04em] transition-all duration-150 hover:text-violet-300 hover:border-stroke-brand hover:bg-violet-500/[.08]"
          onClick={toggleAm}
          aria-label="Toggle AM/PM"
        >
          {isAm ? 'AM' : 'PM'}
        </button>
      </div>
    </div>
  );
};

const gridCellCls = cn(
  'flex items-center justify-center w-9 h-9 rounded-lg border border-transparent',
  'bg-transparent cursor-pointer font-sans text-sm font-normal text-content-primary leading-none',
  'transition-all duration-150',
  'hover:enabled:bg-neutral-700 hover:enabled:text-content-primary',
  'focus-visible:outline-2 focus-visible:outline-stroke-focus focus-visible:outline-offset-2',
  'disabled:opacity-[.28] disabled:cursor-not-allowed disabled:hover:bg-transparent',
);

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  defaultValue      = null,
  onChange,
  mode              = 'date',
  placeholder,
  minDate,
  maxDate,
  disabled          = false,
  clearable         = true,
  label,
  hint,
  error,
  size              = 'md',
  id,
  className,
  showFooter        = true,
  highlightWeekends = false,
}) => {
  const uid     = useId();
  const inputId = id ?? uid;

  const isControlled = value !== undefined;
  const [internal,  setInternal]  = useState<Date | null>(defaultValue);
  const selected    = isControlled ? (value ?? null) : internal;

  const today = new Date();
  const [open,      setOpen]      = useState(false);
  const [view,      setView]      = useState<DatePickerView>('days');
  const [viewYear,  setViewYear]  = useState(() => (selected ?? today).getFullYear());
  const [viewMonth, setViewMonth] = useState(() => (selected ?? today).getMonth());
  const [yearPage,  setYearPage]  = useState(() => (selected ?? today).getFullYear());
  const [tempHours, setTempHours] = useState(() => selected?.getHours()   ?? 0);
  const [tempMins,  setTempMins]  = useState(() => selected?.getMinutes() ?? 0);

  const rootRef    = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  useEffect(() => {
    if (selected) {
      setViewYear(selected.getFullYear());
      setViewMonth(selected.getMonth());
      setTempHours(selected.getHours());
      setTempMins(selected.getMinutes());
    }
  }, [selected]);

  const commit = useCallback((date: Date | null) => {
    if (!isControlled) setInternal(date);
    onChange?.(date);
    if (date && mode === 'date') setOpen(false);
  }, [isControlled, onChange, mode]);

  const handleDayClick = (date: Date) => {
    const d = new Date(date);
    if (mode === 'datetime') { d.setHours(tempHours); d.setMinutes(tempMins); }
    commit(d);
  };

  const handleApply = () => {
    if (!selected) return;
    const d = new Date(selected);
    d.setHours(tempHours); d.setMinutes(tempMins);
    commit(d); setOpen(false);
  };

  const handleClear = () => { commit(null); setOpen(false); };
  const handleToday = () => {
    const d = new Date();
    if (mode === 'datetime') { d.setHours(tempHours); d.setMinutes(tempMins); }
    commit(d); setViewYear(d.getFullYear()); setViewMonth(d.getMonth());
  };

  const prevMonth    = () => { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); } else setViewMonth(m => m - 1); };
  const nextMonth    = () => { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); } else setViewMonth(m => m + 1); };
  const prevYear     = () => setViewYear(y => y - 1);
  const nextYear     = () => setViewYear(y => y + 1);
  const prevYearPage = () => setYearPage(y => y - 12);
  const nextYearPage = () => setYearPage(y => y + 12);
  const selectMonth  = (m: number) => { setViewMonth(m); setView('days'); };
  const selectYear   = (y: number) => { setViewYear(y); setView('months'); };

  const weeks      = buildCalendarGrid(viewYear, viewMonth, selected, null, minDate, maxDate);
  const years      = buildYearRange(yearPage);
  const displayVal = formatDisplay(selected, mode === 'datetime');
  const ph         = placeholder ?? (mode === 'datetime' ? 'Select date & time' : 'Select date');

  const sizeH: Record<DatePickerSize, string> = { sm: 'h-8', md: 'h-10', lg: 'h-12' };
  const sizeFontField: Record<DatePickerSize, string> = { sm: 'text-[0.8125rem]', md: 'text-sm', lg: 'text-base' };

  const headerBtnCls = cn(
    'bg-transparent border-none cursor-pointer font-sans text-[0.9375rem] font-bold text-content-primary',
    'px-2 py-1 rounded-md leading-none transition-all duration-150',
    'hover:bg-neutral-800 hover:text-violet-300',
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        'flex flex-col gap-1 relative',
        disabled && 'opacity-45 pointer-events-none',
        className,
      )}
    >
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-content-secondary leading-[1.4]">
          {label}
        </label>
      )}

      <div
        className={cn(
          'flex items-center bg-surface-elevated border border-stroke rounded-lg',
          'transition-all duration-150 relative cursor-pointer',
          'hover:border-stroke-strong',
          open  && '!border-stroke-focus shadow-[0_0_0_3px_rgba(139,92,246,0.18)]',
          error && '!border-error',
          open && error && 'shadow-[0_0_0_3px_rgba(239,68,68,0.18)]',
          sizeH[size],
        )}
      >
        <span className="flex items-center w-4 h-4 text-content-tertiary flex-shrink-0 ml-3">
          <CalIcon />
        </span>
        <input
          ref={inputRef}
          id={inputId}
          readOnly
          value={displayVal}
          placeholder={ph}
          disabled={disabled}
          onClick={() => !disabled && setOpen(o => !o)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); !disabled && setOpen(o => !o); }}}
          className={cn(
            'nx-dp-input flex-1 bg-transparent border-none outline-none text-content-primary cursor-pointer',
            'px-3 whitespace-nowrap overflow-hidden text-ellipsis',
            sizeFontField[size],
          )}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={label ?? ph}
        />
        {clearable && selected && !disabled && (
          <button
            className="flex items-center justify-center w-5 h-5 rounded-sm bg-transparent border-none text-content-tertiary cursor-pointer flex-shrink-0 mr-2 p-[2px] transition-all duration-150 hover:text-content-primary hover:bg-neutral-700"
            onClick={handleClear}
            aria-label="Clear date"
            tabIndex={-1}
          >
            <XIcon />
          </button>
        )}
      </div>

      {error && <p className="text-[0.8125rem] text-error leading-[1.4]" role="alert">{error}</p>}
      {hint && !error && <p className="text-[0.8125rem] text-content-tertiary leading-[1.4]">{hint}</p>}

      {open && (
        <div
          className="absolute top-[calc(100%+6px)] left-0 z-[100] bg-surface-overlay border border-stroke-strong rounded-2xl shadow-xl p-3 min-w-[288px] select-none animate-dp-in"
          style={{ boxShadow: '0 20px 25px -5px rgba(0,0,0,0.8), 0 8px 10px -6px rgba(0,0,0,0.4), 0 0 0 1px rgba(109,40,217,0.12)' }}
          role="dialog"
          aria-label="Date picker"
          aria-modal="false"
        >
          {/* ── Days view ── */}
          {view === 'days' && (
            <>
              <div className="flex items-center justify-between gap-1 pt-1 pb-3 border-b border-stroke-subtle mb-3">
                <button className={navBtnCls} onClick={prevYear}  aria-label="Previous year"><DblChevLeft /></button>
                <button className={navBtnCls} onClick={prevMonth} aria-label="Previous month"><ChevLeft /></button>
                <div className="flex items-center gap-1 flex-1 justify-center">
                  <button className={headerBtnCls} onClick={() => setView('months')} aria-label="Pick month">
                    {MONTHS[viewMonth]}
                  </button>
                  <button className={headerBtnCls} onClick={() => { setYearPage(viewYear); setView('years'); }} aria-label="Pick year">
                    {viewYear}
                  </button>
                </div>
                <button className={navBtnCls} onClick={nextMonth} aria-label="Next month"><ChevRight /></button>
                <button className={navBtnCls} onClick={nextYear}  aria-label="Next year"><DblChevRight /></button>
              </div>

              <div className="grid grid-cols-7 gap-[2px] mb-1" role="row">
                {DAYS_OF_WEEK.map(d => (
                  <div key={d} className="text-center text-[0.6875rem] font-semibold text-content-tertiary tracking-[0.05em] py-1" role="columnheader" aria-label={d}>
                    {d}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-[2px]" role="grid" aria-label={`${MONTHS[viewMonth]} ${viewYear}`}>
                {weeks.map((week, wi) => (
                  <div key={wi} className="grid grid-cols-7 gap-[2px]" role="row">
                    {week.map((day, di) => (
                      <button
                        key={di}
                        role="gridcell"
                        disabled={day.isDisabled}
                        onClick={() => !day.isDisabled && handleDayClick(day.date)}
                        aria-label={day.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        aria-selected={day.isSelected}
                        aria-pressed={day.isSelected}
                        className={cn(
                          gridCellCls,
                          !day.isCurrentMonth && 'text-content-disabled',
                          highlightWeekends && day.isWeekend && !day.isSelected && 'text-violet-300',
                          day.isToday && !day.isSelected && 'border-stroke-focus text-violet-300 font-semibold',
                          day.isInRange && 'bg-violet-500/10 rounded-none text-violet-200',
                          (day.isRangeStart || day.isRangeEnd) && '!bg-violet-500/20',
                          day.isSelected && [
                            '!bg-gradient-brand !text-white font-bold !border-transparent',
                            'shadow-[0_2px_8px_rgba(124,58,237,0.4)]',
                            'hover:enabled:!bg-gradient-to-br hover:enabled:from-violet-500 hover:enabled:to-violet-400',
                          ],
                        )}
                      >
                        {day.dayOfMonth}
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              {mode === 'datetime' && (
                <>
                  <hr className="border-0 border-t border-stroke-subtle my-3" />
                  <TimePicker hours={tempHours} minutes={tempMins} onChange={(h, m) => { setTempHours(h); setTempMins(m); }} />
                </>
              )}

              {showFooter && (
                <div className="flex items-center gap-2 pt-3 border-t border-stroke-subtle mt-3">
                  <button
                    className="h-[30px] px-3 bg-transparent border border-stroke rounded-md text-content-secondary text-[0.8125rem] font-medium cursor-pointer transition-all duration-150 hover:text-content-primary hover:border-stroke-strong hover:bg-neutral-800"
                    onClick={handleToday}
                  >
                    Today
                  </button>
                  {clearable && selected && (
                    <button
                      className="h-[30px] px-3 bg-transparent border border-stroke rounded-md text-content-secondary text-[0.8125rem] font-medium cursor-pointer transition-all duration-150 hover:text-content-primary hover:border-stroke-strong hover:bg-neutral-800"
                      onClick={handleClear}
                    >
                      Clear
                    </button>
                  )}
                  {mode === 'datetime' && selected && (
                    <button
                      className="ml-auto h-[30px] px-4 bg-gradient-brand border border-violet-500 rounded-md text-white text-[0.8125rem] font-semibold cursor-pointer transition-all duration-150 hover:bg-btn-primary-hover hover:shadow-glow-sm"
                      onClick={handleApply}
                    >
                      Apply
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* ── Month view ── */}
          {view === 'months' && (
            <>
              <div className="flex items-center justify-between gap-1 pt-1 pb-3 border-b border-stroke-subtle mb-3">
                <button className={navBtnCls} onClick={prevYear} aria-label="Previous year"><ChevLeft /></button>
                <button className={headerBtnCls} onClick={() => { setYearPage(viewYear); setView('years'); }}>{viewYear}</button>
                <button className={navBtnCls} onClick={nextYear} aria-label="Next year"><ChevRight /></button>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2">
                {MONTHS_SHORT.map((m, i) => {
                  const isSelected = selected && selected.getMonth() === i && selected.getFullYear() === viewYear;
                  const isNow      = today.getMonth() === i && today.getFullYear() === viewYear;
                  return (
                    <button
                      key={m}
                      onClick={() => selectMonth(i)}
                      aria-label={MONTHS[i]}
                      aria-pressed={!!isSelected}
                      className={cn(
                        'flex items-center justify-center h-10 rounded-lg border border-transparent',
                        'bg-transparent font-sans text-sm font-medium text-content-secondary cursor-pointer',
                        'transition-all duration-150 hover:bg-neutral-700 hover:text-content-primary',
                        isNow && !isSelected && 'border-stroke-focus text-violet-300 font-semibold',
                        isSelected && '!bg-gradient-brand !text-white font-bold !border-transparent shadow-[0_2px_8px_rgba(124,58,237,0.35)] hover:!bg-btn-primary-hover',
                      )}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ── Year view ── */}
          {view === 'years' && (
            <>
              <div className="flex items-center justify-between gap-1 pt-1 pb-3 border-b border-stroke-subtle mb-3">
                <button className={navBtnCls} onClick={prevYearPage} aria-label="Previous years"><ChevLeft /></button>
                <span className="text-sm font-semibold text-content-secondary flex-1 text-center">
                  {years[0]} – {years[years.length - 1]}
                </span>
                <button className={navBtnCls} onClick={nextYearPage} aria-label="Next years"><ChevRight /></button>
              </div>
              <div className="grid grid-cols-3 gap-2 py-2">
                {years.map(y => {
                  const isSelected = selected && selected.getFullYear() === y;
                  const isNow      = today.getFullYear() === y;
                  return (
                    <button
                      key={y}
                      onClick={() => selectYear(y)}
                      aria-label={String(y)}
                      aria-pressed={!!isSelected}
                      className={cn(
                        'flex items-center justify-center h-10 rounded-lg border border-transparent',
                        'bg-transparent font-sans text-sm font-medium text-content-secondary cursor-pointer',
                        'transition-all duration-150 hover:bg-neutral-700 hover:text-content-primary',
                        isNow && !isSelected && 'border-stroke-focus text-violet-300 font-semibold',
                        isSelected && '!bg-gradient-brand !text-white font-bold !border-transparent shadow-[0_2px_8px_rgba(124,58,237,0.35)] hover:!bg-btn-primary-hover',
                      )}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
