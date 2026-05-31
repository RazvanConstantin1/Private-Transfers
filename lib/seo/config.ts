export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  noindex?: boolean;
  canonical?: string;
}

export const SITE = {
  name: 'VOLTLANE',
  url: 'https://voltlane.com',
  defaultLocale: 'en',
  locales: ['en', 'ro'] as const,
  twitter: '@voltlane',
  email: 'hello@voltlane.com',
  phone: '+40700000000',
  whatsapp: '40700000000',
} as const;

export const SEO_DEFAULTS: Record<string, Record<string, SeoConfig>> = {
  home: {
    en: {
      title: 'Bucharest Airport Transfer & Private Driver | VOLTLANE Electric Taxi',
      description:
        'Private transfer from Bucharest Otopeni Airport (OTP) and intercity routes across Romania. 100% electric fleet, English-speaking driver, fixed prices from €130. Book online — no surge fees.',
      keywords: [
        'bucharest airport transfer',
        'private taxi bucharest',
        'otopeni transfer',
        'electric taxi bucharest',
        'tesla transfer romania',
        'english speaking driver bucharest',
      ],
    },
    ro: {
      title: 'Transfer Aeroport București Otopeni & Șofer Privat | VOLTLANE Electric',
      description:
        'Transfer privat de la Aeroportul București Otopeni (OTP) și curse intercity în toată România. Flotă 100% electrică, prețuri fixe de la 130€. Rezervare online — fără surge.',
      keywords: [
        'transfer aeroport bucuresti',
        'taxi otopeni',
        'transfer privat romania',
        'sofer privat bucuresti',
      ],
    },
  },
  'airport-transfers': {
    en: {
      title: 'Bucharest Otopeni Airport Transfer (OTP) | Tesla Electric Taxi | VOLTLANE',
      description:
        'Pre-booked private airport transfer from Bucharest Henri Coandă (OTP) to city center, hotels, or intercity destinations. Tesla & EV fleet. English driver. Flight tracking. Fixed price from €48.',
      keywords: [
        'bucharest otopeni airport transfer',
        'otp airport taxi',
        'henri coanda airport transfer',
        'electric airport transfer bucharest',
        'bucharest airport to city center',
      ],
    },
    ro: {
      title: 'Transfer Aeroport Otopeni București (OTP) | VOLTLANE',
      description:
        'Transfer aeroport privat de la București Henri Coandă (OTP) către centrul orașului, hoteluri sau alte destinații. Mașini electrice. Șofer profesionist. Tracking zbor. Preț fix de la 48€.',
    },
  },
  intercity: {
    en: {
      title: 'Private Transfers from Bucharest to All Romanian Cities | VOLTLANE',
      description:
        'Door-to-door private transfers from Bucharest to Brașov, Sinaia, Sibiu, Constanța, Cluj, Iași, Bran Castle. Fixed prices, electric vehicles, English-speaking drivers.',
      keywords: [
        'intercity transfer romania',
        'bucharest to brasov private transfer',
        'bucharest to sinaia',
        'romania private driver',
        'private transfer bucharest',
      ],
    },
    ro: {
      title: 'Curse Intercity din București | Transfer Privat România | VOLTLANE',
      description:
        'Transferuri private door-to-door din București către Brașov, Sinaia, Sibiu, Constanța, Cluj, Iași și Castelul Bran. Prețuri fixe, mașini electrice.',
    },
  },
  hourly: {
    en: {
      title: 'Hire a Private Driver by the Hour in Bucharest | VOLTLANE',
      description:
        'Hourly chauffeur service in Bucharest. Perfect for business meetings, city tours, multi-stop trips. From €60/hour. English-speaking driver, Tesla & EV fleet.',
      keywords: [
        'private driver bucharest hourly',
        'chauffeur bucharest',
        'tour driver bucharest',
        'english speaking driver romania',
        'private driver bucharest tourist',
      ],
    },
    ro: {
      title: 'Șofer Privat cu Ora în București | VOLTLANE',
      description:
        'Șofer privat la oră în București pentru întâlniri de afaceri, tururi, deplasări multiple. De la 60€/oră. Flotă electrică.',
    },
  },
  fleet: {
    en: {
      title: 'Our Electric Fleet — Tesla Model 3, Hyundai Kona, Ford Capri | VOLTLANE',
      description:
        'Three premium electric vehicles for every journey: Hyundai Kona Electric (efficient), Tesla Model 3 Long Range (signature), Ford Capri (spacious SUV). All maintained to highest standards.',
      keywords: [
        'tesla taxi bucharest',
        'electric vehicle transfer romania',
        'ev chauffeur bucharest',
        'tesla transfer bucharest',
        'electric taxi bucharest',
      ],
    },
    ro: {
      title: 'Flota Electrică VOLTLANE | Tesla, Hyundai Kona, Ford Capri',
      description:
        'Trei mașini electrice premium pentru fiecare călătorie. Tesla Model 3, Hyundai Kona Electric, Ford Capri SUV.',
    },
  },
  about: {
    en: {
      title: "About VOLTLANE — Romania's First All-Electric Chauffeur Service",
      description:
        'Founded in Bucharest to bring premium electric chauffeur service to Romania. English-speaking drivers, transparent pricing, sustainable transport. Learn our story.',
      keywords: [
        'voltlane bucharest',
        'electric chauffeur romania',
        'sustainable transport bucharest',
        'english speaking driver bucharest',
      ],
    },
    ro: {
      title: 'Despre VOLTLANE | Primul Serviciu de Șofer Privat 100% Electric din România',
      description:
        'Fondat în București pentru a aduce serviciul de șofer privat electric premium în România. Șoferi vorbitori de engleză, prețuri transparente, transport sustenabil.',
    },
  },
  contact: {
    en: {
      title: 'Contact VOLTLANE | Custom Transfer Requests | Bucharest',
      description:
        'Need a custom itinerary, group transfer, or have a question? Reach VOLTLANE on WhatsApp, email, or phone. We reply within 2 hours.',
    },
    ro: {
      title: 'Contact VOLTLANE | Cereri Transferuri Personalizate',
      description:
        'Pentru itinerar personalizat, transfer de grup sau întrebări — contactează VOLTLANE prin WhatsApp, email sau telefon.',
    },
  },
  blog: {
    en: {
      title: 'VOLTLANE Travel Notes — Romania Transfer & Travel Guides',
      description:
        'Guides, tips, and insights for traveling Romania by private transfer. Airport transport, day trips to Bran Castle, EV charging, and more.',
      keywords: [
        'romania travel guide',
        'bucharest travel tips',
        'transylvania day trips',
        'romania private transfer guide',
      ],
    },
    ro: {
      title: 'VOLTLANE Travel Notes — Ghiduri de Călătorie România',
      description:
        'Ghiduri, sfaturi și informații pentru călătorii în România cu transfer privat. Transport aeroport, excursii la Castelul Bran, încărcare EV și altele.',
    },
  },
};
