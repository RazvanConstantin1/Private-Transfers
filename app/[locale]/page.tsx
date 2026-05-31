import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { organizationSchema, taxiServiceSchema } from '@/lib/seo/schemas';
import { JsonLd } from '@/components/seo/JsonLd';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import PopularRoutes from '@/components/sections/PopularRoutes';
import Destinations from '@/components/sections/Destinations';
import WhyVoltlane from '@/components/sections/WhyVoltlane';
import FleetShowcase from '@/components/sections/FleetShowcase';
import ContactSection from '@/components/sections/ContactSection';
import FAQ from '@/components/sections/FAQ';
import FinalCTA from '@/components/sections/FinalCTA';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({ pageKey: 'home', locale, path: '/' });
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), taxiServiceSchema()]} />
      <Hero />
      <Services />
      <PopularRoutes />
      <Destinations />
      <WhyVoltlane />
      <FleetShowcase />
      <ContactSection />
      <FAQ />
      <FinalCTA />
    </>
  );
}
