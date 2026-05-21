'use client';

import { useLocale } from 'next-intl';

export default function ContactSection() {
  const locale = useLocale();
  const isRo = locale === 'ro';

  const whatsappNumber = '40700000000'; // replace with real number
  const phoneNumber = '+40 700 000 000'; // replace with real number
  const email = 'hello@voltlane.ro';

  const whatsappMessage = encodeURIComponent(
    isRo
      ? 'Bună ziua, aș dori să solicit un transfer personalizat.'
      : 'Hello, I would like to request a custom transfer.'
  );

  return (
    <section className="py-14 md:py-24 px-4 md:px-6" aria-labelledby="contact-heading">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <span
            className="inline-block text-xs font-600 uppercase tracking-widest mb-4"
            style={{ color: 'var(--accent-volt)', fontFamily: 'var(--font-jetbrains)' }}
          >
            {isRo ? 'Contact' : 'Contact'}
          </span>
          <h2
            id="contact-heading"
            className="font-display text-4xl md:text-5xl font-300 tracking-tight mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            {isRo ? 'Cerere ' : 'Custom '}{' '}
            <em className="not-italic font-400" style={{ color: 'var(--accent-volt)' }}>
              {isRo ? 'personalizată?' : 'request?'}
            </em>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            {isRo
              ? 'Ai nevoie de un itinerariu special, un transfer de grup sau ai o întrebare? Scrie-ne direct.'
              : "Need a special itinerary, group transfer, or have a question? Reach out directly."}
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center text-center p-8 rounded-2xl border transition-vl hover:border-[rgba(126,255,161,0.3)] hover:bg-[rgba(126,255,161,0.03)]"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-2xl transition-vl group-hover:scale-110"
              style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.2)' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" style={{ color: '#25D366' }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <h3 className="font-500 text-base mb-2" style={{ color: 'var(--text-primary)' }}>
              WhatsApp
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              {isRo ? 'Răspuns rapid, disponibil 24/7' : 'Quick reply, available 24/7'}
            </p>
            <span
              className="text-sm font-600 transition-vl group-hover:underline"
              style={{ color: 'var(--accent-volt)' }}
            >
              {isRo ? 'Deschide chat →' : 'Open chat →'}
            </span>
          </a>

          {/* Phone */}
          <a
            href={`tel:${whatsappNumber}`}
            className="group flex flex-col items-center text-center p-8 rounded-2xl border transition-vl hover:border-[rgba(229,198,135,0.3)] hover:bg-[rgba(229,198,135,0.03)]"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-2xl transition-vl group-hover:scale-110"
              style={{ background: 'rgba(229,198,135,0.1)', border: '1px solid rgba(229,198,135,0.2)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7" style={{ color: 'var(--accent-gold)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <h3 className="font-500 text-base mb-2" style={{ color: 'var(--text-primary)' }}>
              {isRo ? 'Telefon' : 'Phone'}
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              {isRo ? 'Luni–Duminică, 06:00–23:00' : 'Mon–Sun, 06:00–23:00'}
            </p>
            <span
              className="text-sm font-600 transition-vl group-hover:underline"
              style={{ color: 'var(--accent-gold)' }}
            >
              {phoneNumber}
            </span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${email}?subject=${encodeURIComponent(isRo ? 'Cerere personalizată' : 'Custom transfer request')}`}
            className="group flex flex-col items-center text-center p-8 rounded-2xl border transition-vl hover:border-[rgba(126,255,161,0.3)] hover:bg-[rgba(126,255,161,0.03)]"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-vl group-hover:scale-110"
              style={{ background: 'rgba(126,255,161,0.08)', border: '1px solid rgba(126,255,161,0.15)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7" style={{ color: 'var(--accent-volt)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h3 className="font-500 text-base mb-2" style={{ color: 'var(--text-primary)' }}>
              Email
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              {isRo ? 'Răspundem în max. 2 ore' : 'We reply within 2 hours'}
            </p>
            <span
              className="text-sm font-600 transition-vl group-hover:underline"
              style={{ color: 'var(--accent-volt)' }}
            >
              {email}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
