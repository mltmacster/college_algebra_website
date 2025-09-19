
'use client';

import { Navigation } from './navigation';
import { HeroSection } from './hero-section';
import { ModulesPreview } from './modules-preview';
import { FeaturesSection } from './features-section';
import { BadgeShowcase } from './badge-showcase';
import { AITutorSection } from './ai-tutor-section';
import { FooterSection } from './footer-section';

export function ClientHomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSection />
        <ModulesPreview />
        <FeaturesSection />
        <BadgeShowcase />
        <AITutorSection />
      </main>
      <FooterSection />
    </div>
  );
}
