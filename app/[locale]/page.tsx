import type { Metadata } from 'next';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import PopularRoutes from '@/components/sections/PopularRoutes';
import Destinations from '@/components/sections/Destinations';
import WhyVoltlane from '@/components/sections/WhyVoltlane';
import FleetShowcase from '@/components/sections/FleetShowcase';
import ContactSection from '@/components/sections/ContactSection';
import FAQ from '@/components/sections/FAQ';
import FinalCTA from '@/components/sections/FinalCTA';

export const metadata: Metadata = {
  title: 'VOLTLANE — Premium Electric Transfers in Romania',
  description:
    '100% electric chauffeur service for airport transfers, intercity routes & hourly bookings across Romania. English-speaking driver. Fixed pricing. No surge.',
};

export default function HomePage() {
  return (
    <>
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
