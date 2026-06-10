import { AboutSection } from "@/components/AboutSection";
import { CapabilitiesSection } from "@/components/CapabilitiesSection";
import { ContactSection } from "@/components/ContactSection";
import { FeaturedWorks } from "@/components/FeaturedWorks";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { InterestsSection } from "@/components/InterestsSection";
import { Navbar } from "@/components/Navbar";
import { StatsSection } from "@/components/StatsSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsSection />
        <FeaturedWorks />
        <AboutSection />
        <CapabilitiesSection />
        <InterestsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
