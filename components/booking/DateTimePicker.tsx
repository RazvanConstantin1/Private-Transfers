'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, parse, isValid, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  id?: string;
  value: string; // "YYYY-MM-DDTHH:mm" or ""
  onChange: (value: string) => void;
  min?: string;  // "YYYY-MM-DDTHH:mm"
  placeholder?: string;
  hasError?: boolean;
}

function parseValue(value: string): { date: Date | null; hour: number; minute: number } {
  if (!value) return { date: null, hour: 10, minute: 0 };
  const d = new Date(value);
  if (!isValid(d)) return { date: null, hour: 10, minute: 0 };
  return { date: startOfDay(d), hour: d.getHours(), minute: d.getMinutes() };
}

function toISO(date: Date, hour: number, minute: number): string {
  const d = new Date(date);
  d.setHours(hour, minute, 0, 0);
  return format(d, "yyyy-MM-dd'T'HH:mm");
}

export default function DateTimePicker({
  id,
  value,
  onChange,
  min,
  placeholder = 'Select date & time',
  hasError = false,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { date, hour, minute } = parseValue(value);
  const minDate = min ? startOfDay(new Date(min)) : startOfDay(new Date());
  const minHour = (() => {
    if (!min || !date) return 0;
    const minD = new Date(min);
    if (format(date, 'yyyy-MM-dd') === format(minD, 'yyyy-MM-dd')) return minD.getHours();
    return 0;
  })();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleDaySelect = useCallback((day: Date | undefined) => {
    if (!day) return;
    const newHour = Math.max(hour, minHour);
    onChange(toISO(day, newHour, minute));
  }, [hour, minute, minHour, onChange]);

  const handleHourChange = useCallback((h: number) => {
    if (!date) return;
    onChange(toISO(date, h, minute));
  }, [date, minute, onChange]);

  const handleMinuteChange = useCallback((m: number) => {
    if (!date) return;
    onChange(toISO(date, hour, m));
  }, [date, hour, onChange]);

  const displayValue = date
    ? `${format(date, 'd MMM yyyy')} · ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    : '';

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-vl focus:outline-none focus:border-[var(--accent-volt)] focus:ring-1 focus:ring-[var(--accent-volt)]',
          open && 'border-[var(--accent-volt)] ring-1 ring-[var(--accent-volt)]'
        )}
        style={{
          background: 'var(--bg-elevated)',
          borderColor: hasError ? '#ef4444' : open ? 'var(--accent-volt)' : 'var(--border)',
          color: displayValue ? 'var(--text-primary)' : 'var(--text-muted)',
        }}
      >
        {/* Calendar icon */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span className="flex-1">{displayValue || placeholder}</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className={cn('transition-transform shrink-0', open && 'rotate-180')} style={{ color: 'var(--text-muted)' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Popover */}
      {open && (
        <div
          className="absolute left-0 top-[calc(100%+6px)] z-50 rounded-2xl border shadow-2xl overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', minWidth: 280 }}
        >
          {/* Calendar */}
          <DayPicker
            mode="single"
            selected={date ?? undefined}
            onSelect={handleDaySelect}
            disabled={{ before: minDate }}
            weekStartsOn={1}
            showOutsideDays={false}
            classNames={{
              root: 'p-3',
              months: 'flex flex-col',
              month: 'flex flex-col gap-3',
              month_caption: 'flex items-center justify-center h-8 relative',
              caption_label: 'text-sm font-600',
              nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
              button_previous: 'h-8 w-8 flex items-center justify-center rounded-lg transition-vl hover:bg-[var(--bg-elevated)]',
              button_next: 'h-8 w-8 flex items-center justify-center rounded-lg transition-vl hover:bg-[var(--bg-elevated)]',
              weekdays: 'flex',
              weekday: 'flex-1 text-center text-xs py-1',
              weeks: 'flex flex-col gap-1',
              week: 'flex',
              day: 'flex-1 aspect-square flex items-center justify-center',
              day_button: cn(
                'w-8 h-8 rounded-lg text-xs font-500 transition-vl hover:bg-[var(--bg-elevated)] disabled:opacity-30 disabled:cursor-not-allowed'
              ),
              selected: 'bg-[var(--accent-volt)] text-[#0A0A0B] rounded-lg font-600',
              today: 'font-600',
              outside: 'opacity-0 pointer-events-none',
              disabled: 'opacity-30 cursor-not-allowed',
            }}
            styles={{
              caption_label: { color: 'var(--text-primary)' },
              weekday: { color: 'var(--text-muted)' },
            }}
          />

          {/* Time picker */}
          <div
            className="flex items-center gap-3 px-3 pb-3 border-t pt-3"
            style={{ borderColor: 'var(--border-soft)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Time</span>

            {/* Hour */}
            <select
              value={hour}
              onChange={(e) => handleHourChange(Number(e.target.value))}
              disabled={!date}
              className="flex-1 px-2 py-1.5 rounded-lg border text-sm text-center transition-vl focus:outline-none focus:border-[var(--accent-volt)] disabled:opacity-40"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              {Array.from({ length: 24 }, (_, i) => i)
                .filter((h) => h >= minHour)
                .map((h) => (
                  <option key={h} value={h}>{String(h).padStart(2, '0')}</option>
                ))}
            </select>

            <span style={{ color: 'var(--text-muted)' }}>:</span>

            {/* Minute */}
            <select
              value={minute}
              onChange={(e) => handleMinuteChange(Number(e.target.value))}
              disabled={!date}
              className="flex-1 px-2 py-1.5 rounded-lg border text-sm text-center transition-vl focus:outline-none focus:border-[var(--accent-volt)] disabled:opacity-40"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              {[0, 15, 30, 45].map((m) => (
                <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
              ))}
            </select>

            {/* Confirm */}
            <button
              type="button"
              disabled={!date}
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-600 transition-vl hover:opacity-90 disabled:opacity-40"
              style={{ background: 'var(--accent-volt)', color: '#0A0A0B' }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
