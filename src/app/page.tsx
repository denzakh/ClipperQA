import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ContactSection } from "@/components/ContactSection";

const HomePage = () => {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <ServicesSection />
      <ContactSection />
    </main>
  );
};

export default HomePage;
