'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const DESTINATIONS = [
  {
    slug: 'sinaia',
    image: '/destinations/sinaia.jpg',
    distanceKm: 125,
    name: { en: 'Sinaia', ro: 'Sinaia' },
    tag: { en: 'Mountain Resort', ro: 'Stațiune Montană' },
    description: {
      en: 'Home to the magnificent Peleș Castle — one of the most beautiful royal residences in Europe. Nestled in the Bucegi Mountains, Sinaia blends royal history with alpine scenery perfect for year-round visits.',
      ro: 'Castelul Peleș, una dintre cele mai frumoase reședințe regale din Europa, te așteaptă. Cuibărită în Munții Bucegi, Sinaia îmbină istoria regală cu peisaje alpine de vis, perfecte pentru orice sezon.',
    },
  },
  {
    slug: 'brasov',
    image: '/destinations/brasov.jpg',
    distanceKm: 166,
    name: { en: 'Brașov', ro: 'Brașov' },
    tag: { en: 'Medieval City', ro: 'Oraș Medieval' },
    description: {
      en: 'A perfectly preserved medieval city surrounded by the Carpathian Mountains. Wander the cobblestone streets of the old town, visit the Gothic Black Church, and enjoy panoramic views from Tampa mountain.',
      ro: 'Un oraș medieval impecabil conservat, înconjurat de Carpați. Plimbă-te pe străzile pietruite ale centrului vechi, vizitează Biserica Neagră gotică și bucură-te de priveliști panoramice de pe Muntele Tâmpa.',
    },
  },
  {
    slug: 'bran',
    image: '/destinations/bran.jpg',
    distanceKm: 175,
    name: { en: 'Bran Castle', ro: 'Castelul Bran' },
    tag: { en: "Dracula's Castle", ro: 'Castelul lui Dracula' },
    description: {
      en: "The legendary castle associated with Bram Stoker's Dracula. This 14th-century fortress perched dramatically on a cliff is Romania's most visited monument and one of Eastern Europe's most iconic landmarks.",
      ro: 'Castelul legendar asociat cu Dracula al lui Bram Stoker. Această fortăreață din secolul XIV, cocoțată dramatic pe o stâncă, este cel mai vizitat monument din România și una dintre cele mai iconice atracții din Europa de Est.',
    },
  },
  {
    slug: 'constanta',
    image: '/destinations/constanta.jpg',
    distanceKm: 225,
    name: { en: 'Constanța', ro: 'Constanța' },
    tag: { en: 'Black Sea Coast', ro: 'Coasta Mării Negre' },
    description: {
      en: "Romania's oldest continuously inhabited city and main Black Sea port. Discover ancient Roman ruins, the stunning Art Nouveau Casino, and the long sandy beaches of the Romanian Riviera stretching toward Mamaia.",
      ro: 'Cel mai vechi oraș locuit continuu din România și principalul port la Marea Neagră. Descoperă ruinele romane antice, cazinoul Art Nouveau și plajele întinse ale Rivierei Românești spre Mamaia.',
    },
  },
  {
    slug: 'sibiu',
    image: '/destinations/sibiu.jpg',
    distanceKm: 280,
    name: { en: 'Sibiu', ro: 'Sibiu' },
    tag: { en: 'European Capital of Culture', ro: 'Capitală Culturală Europeană' },
    description: {
      en: "One of Romania's best-preserved medieval cities and a former European Capital of Culture. Sibiu's three interconnected squares, fortified towers, and the famous Liars' Bridge make it an unmissable destination.",
      ro: 'Unul dintre cele mai bine conservate orașe medievale din România și fostă Capitală Culturală Europeană. Cele trei piețe interconectate, turnurile de apărare și celebrul Pod al Minciunilor îl fac de neratat.',
    },
  },
];

export default function Destinations() {
  const locale = useLocale();
  const isRo = locale === 'ro';

  return (
    <section className="py-14 md:py-24 px-4 md:px-6" aria-labelledby="destinations-heading">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <span
            className="inline-block text-xs font-600 uppercase tracking-widest mb-4"
            style={{ color: 'var(--accent-volt)', fontFamily: 'var(--font-jetbrains)' }}
          >
            {isRo ? 'Destinații Populare' : 'Popular Destinations'}
          </span>
          <h2
            id="destinations-heading"
            className="font-display text-4xl md:text-5xl font-300 tracking-tight mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            {isRo ? 'România, la' : 'Romania, within'}{' '}
            <em className="not-italic font-400" style={{ color: 'var(--accent-volt)' }}>
              {isRo ? 'câteva ore distanță.' : 'a few hours.'}
            </em>
          </h2>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            {isRo
              ? 'Toate destinațiile sunt în limita a 300 km de București — prețuri fixe, fără surprize la final.'
              : 'All destinations within 300 km of Bucharest — fixed prices, no surprises on arrival.'}
          </p>
        </div>

        {/* Destination cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATIONS.map((dest, i) => (
            <div
              key={dest.slug}
              className="group rounded-2xl overflow-hidden border transition-vl hover:border-[rgba(126,255,161,0.3)]"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={dest.image}
                  alt={dest.name[isRo ? 'ro' : 'en']}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  priority={i < 2}
                />
                {/* Overlay gradient */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(10,10,11,0.7) 0%, transparent 50%)' }}
                />
                {/* Distance badge */}
                <div
                  className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-600"
                  style={{
                    background: 'rgba(10,10,11,0.75)',
                    backdropFilter: 'blur(8px)',
                    color: 'var(--accent-volt)',
                    border: '1px solid rgba(126,255,161,0.2)',
                    fontFamily: 'var(--font-jetbrains)',
                  }}
                >
                  {dest.distanceKm} km
                </div>
                {/* Tag badge */}
                <div
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs"
                  style={{
                    background: 'rgba(10,10,11,0.7)',
                    backdropFilter: 'blur(8px)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {dest.tag[isRo ? 'ro' : 'en']}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3
                  className="font-display text-xl font-400 mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {dest.name[isRo ? 'ro' : 'en']}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {dest.description[isRo ? 'ro' : 'en']}
                </p>
                <Link
                  href={`/${locale}/booking`}
                  className="inline-flex items-center gap-1.5 text-sm font-600 transition-vl hover:gap-2.5"
                  style={{ color: 'var(--accent-volt)' }}
                >
                  {isRo ? 'Rezervă transfer' : 'Book transfer'} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
