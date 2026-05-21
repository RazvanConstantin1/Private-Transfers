import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/lib/routing';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://voltlane.com'),
  title: {
    default: 'VOLTLANE — Premium Electric Transfers in Romania',
    template: '%s | VOLTLANE',
  },
  description:
    '100% electric chauffeur service. Airport transfers, intercity routes & hourly bookings across Romania. English-speaking driver, fixed pricing, no surge.',
  openGraph: {
    type: 'website',
    siteName: 'VOLTLANE',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Nav />
      <main>{children}</main>
      <Footer />
      <Toaster />
    </NextIntlClientProvider>
  );
}
