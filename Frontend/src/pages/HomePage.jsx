import React from "react";
// Removed Navbar and Footer imports - they are now in MainLayout
import HeroSection from "../components/HeroSection/HeroSection";
import BenefitsSection from "../components/BenefitsSection";
import HowItWorksSection from "../components/HowItWorksSection";
import CertificationsOutcomesSection from "../components/CertificationsOutcomesSection";
import NewsletterSignup from "../components/NewsletterSignup";
import CourseList from "../components/CourseList/CourseList";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CourseList />
      <BenefitsSection />
      <HowItWorksSection />
      <CertificationsOutcomesSection />
      <NewsletterSignup />
    </>
  );
}
