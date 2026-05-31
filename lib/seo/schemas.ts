import { SITE } from './config';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    description:
      'Premium electric private transfer service in Bucharest, Romania',
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bucharest',
      addressRegion: 'Bucharest',
      addressCountry: 'RO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 44.4268,
      longitude: 26.1025,
    },
    areaServed: { '@type': 'Country', name: 'Romania' },
    priceRange: '€€€',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    sameAs: [],
  };
}

export function taxiServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    name: 'VOLTLANE Electric Taxi & Transfer',
    description:
      'Premium electric private transfer service from Bucharest Otopeni Airport (OTP) to destinations across Romania. Tesla Model 3, Hyundai Kona Electric, Ford Capri SUV.',
    provider: { '@id': `${SITE.url}/#organization` },
    areaServed: { '@type': 'Country', name: 'Romania' },
    serviceType: [
      'Airport Transfer',
      'Intercity Transfer',
      'Hourly Chauffeur Service',
    ],
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: '48',
      highPrice: '912',
      offerCount: '7',
    },
  };
}

export function routeServiceSchema(params: {
  fromCity: string;
  toCity: string;
  distanceKm: number;
  durationMinutes: number;
  priceFromEur: number;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Private Transfer from ${params.fromCity} to ${params.toCity}`,
    description: params.description,
    provider: { '@id': `${SITE.url}/#organization` },
    serviceType: 'Private Transfer',
    areaServed: [
      { '@type': 'City', name: params.fromCity },
      { '@type': 'City', name: params.toCity },
    ],
    offers: {
      '@type': 'Offer',
      price: params.priceFromEur.toString(),
      priceCurrency: 'EUR',
      url: params.url,
      availability: 'https://schema.org/InStock',
    },
  };
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleSchema(params: {
  title: string;
  description: string;
  publishedAt: string;
  modifiedAt: string;
  author: string;
  image: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.title,
    description: params.description,
    datePublished: params.publishedAt,
    dateModified: params.modifiedAt,
    author: { '@type': 'Person', name: params.author },
    publisher: { '@id': `${SITE.url}/#organization` },
    image: params.image,
    mainEntityOfPage: { '@type': 'WebPage', '@id': params.url },
  };
}
