'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

interface Prediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface PlaceResult {
  address: string;
  lat: number;
  lng: number;
  placeId: string;
}

interface AddressAutocompleteProps {
  id: string;
  placeholder?: string;
  value?: string;
  onSelect: (place: PlaceResult) => void;
  onChange?: (text: string) => void;
  className?: string;
  'aria-label'?: string;
}

export default function AddressAutocomplete({
  id,
  placeholder,
  value,
  onSelect,
  onChange,
  'aria-label': ariaLabel,
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value || '');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [fetching, setFetching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external value changes (e.g. when parent resets form)
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchPredictions = useCallback(async (text: string) => {
    if (text.length < 2) { setPredictions([]); setOpen(false); return; }
    setFetching(true);
    try {
      const res = await fetch(`/api/places-autocomplete?input=${encodeURIComponent(text)}`);
      const data = await res.json();
      setPredictions(data.predictions ?? []);
      setOpen((data.predictions ?? []).length > 0);
      setActiveIndex(-1);
    } catch {
      setPredictions([]);
    } finally {
      setFetching(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
    onChange?.(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(text), 250);
  };

  const selectPrediction = useCallback(async (pred: Prediction) => {
    setInputValue(pred.description);
    setOpen(false);
    setPredictions([]);
    onChange?.(pred.description);
    try {
      const res = await fetch(`/api/places-details?place_id=${pred.place_id}`);
      const detail = await res.json();
      if (detail.geometry?.location) {
        onSelect({
          address: detail.formatted_address || pred.description,
          lat: detail.geometry.location.lat,
          lng: detail.geometry.location.lng,
          placeId: pred.place_id,
        });
        setInputValue(detail.formatted_address || pred.description);
      }
    } catch {
      onSelect({ address: pred.description, lat: 0, lng: 0, placeId: pred.place_id });
    }
  }, [onSelect, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, predictions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      selectPrediction(predictions[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type="text"
          autoComplete="off"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => predictions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          aria-label={ariaLabel || placeholder}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-activedescendant={activeIndex >= 0 ? `${id}-opt-${activeIndex}` : undefined}
          className="w-full px-4 py-3 rounded-xl border text-sm transition-vl focus:outline-none focus:border-[var(--accent-volt)] placeholder:text-[var(--text-muted)]"
          style={{
            background: 'var(--bg-elevated)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
            paddingRight: fetching ? '2.5rem' : undefined,
          }}
        />
        {fetching && (
          <div
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 16,
              height: 16,
              borderRadius: '50%',
              border: '2px solid var(--border)',
              borderTopColor: 'var(--accent-volt)',
              animation: 'acSpin 0.7s linear infinite',
            }}
          />
        )}
      </div>

      {open && predictions.length > 0 && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 50,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            listStyle: 'none',
            margin: 0,
            padding: '4px 0',
          }}
        >
          {predictions.map((pred, i) => (
            <li
              key={pred.place_id}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => { e.preventDefault(); selectPrediction(pred); }}
              onMouseEnter={() => setActiveIndex(i)}
              style={{
                padding: '10px 14px',
                cursor: 'pointer',
                background: i === activeIndex ? 'rgba(126,255,161,0.07)' : 'transparent',
                borderLeft: i === activeIndex ? '2px solid var(--accent-volt)' : '2px solid transparent',
                transition: 'background 0.1s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    {pred.structured_formatting?.main_text || pred.description}
                  </p>
                  {pred.structured_formatting?.secondary_text && (
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                      {pred.structured_formatting.secondary_text}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <style>{`@keyframes acSpin{to{transform:translateY(-50%) rotate(360deg)}}`}</style>
    </div>
  );
}
