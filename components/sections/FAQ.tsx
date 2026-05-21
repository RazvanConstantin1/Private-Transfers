'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function FAQ() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = t.raw('items') as { q: string; a: string }[];

  return (
    <section className="py-14 md:py-24 px-4 md:px-6" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 md:mb-14 text-center">
          <span
            className="inline-block text-xs font-600 uppercase tracking-widest mb-4"
            style={{ color: 'var(--accent-volt)', fontFamily: 'var(--font-jetbrains)' }}
          >
            {t('eyebrow')}
          </span>
          <h2
            id="faq-heading"
            className="font-display text-4xl md:text-5xl font-300 tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('title')}{' '}
            <em className="not-italic font-400" style={{ color: 'var(--accent-volt)' }}>
              {t('titleAccent')}
            </em>
          </h2>
        </div>

        {/* Accordion */}
        <div className="divide-y" style={{ borderColor: 'var(--border-soft)' }}>
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} style={{ borderColor: 'var(--border-soft)' }}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-start justify-between gap-4 py-5 text-left transition-vl"
                >
                  <span
                    className="text-base font-500 leading-snug"
                    style={{ color: isOpen ? 'var(--accent-volt)' : 'var(--text-primary)', transition: 'color 0.2s' }}
                  >
                    {item.q}
                  </span>
                  <span
                    className="flex-shrink-0 mt-0.5 transition-transform duration-200"
                    style={{
                      color: 'var(--text-muted)',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      display: 'inline-block',
                      fontSize: 22,
                      lineHeight: 1,
                    }}
                    aria-hidden
                  >
                    +
                  </span>
                </button>

                {/* Answer panel */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.25s ease',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <p
                      className="pb-5 text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
