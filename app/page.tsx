import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/landing/hero-section'
import { SpecializationsSection } from '@/components/landing/specializations-section'
import { FeaturedDoctors } from '@/components/landing/featured-doctors'
import { HowItWorks } from '@/components/landing/how-it-works'
import { CTASection } from '@/components/landing/cta-section'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <SpecializationsSection />
        <FeaturedDoctors />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
