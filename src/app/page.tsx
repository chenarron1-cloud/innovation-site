import { HeroSection } from "@/components/home/hero-section";
import { DiagnosisSection } from "@/components/home/diagnosis-section";
import { ToolsPreview } from "@/components/home/tools-preview";
import { StepsSection } from "@/components/home/steps-section";
import { WishpoolPreview } from "@/components/home/wishpool-preview";
import { PricingSection } from "@/components/home/pricing-section";
import { WorksPreview } from "@/components/home/works-preview";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CtaSection } from "@/components/home/cta-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "創新先生 Mr. Innovation — AI 創新思維實戰平台",
  description: "這不是教你怎麼問 AI 的網站，而是教你怎麼用創新思維，讓 AI 幫你做出更有差異化成果的網站。上班族、創業者、行銷人必看。",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DiagnosisSection />
      <ToolsPreview />
      <StepsSection />
      <WorksPreview />
      <TestimonialsSection />
      <WishpoolPreview />
      <PricingSection />
      <CtaSection />
    </>
  );
}
