import React from "react";
import Navbar from "../components/Navbar/Navbar";
import HeroSection from "../components/HeroSection/HeroSection";
import BenefitsSection from "../components/BenefitsSection";
import HowItWorksSection from "../components/HowItWorksSection";
import CertificationsOutcomesSection from "../components/CertificationsOutcomesSection";
import NewsletterSignup from "../components/NewsletterSignup";
import Footer from "../components/Footer/Footer";
import CourseList from "../components/CourseList/CourseList";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CourseList />
      <BenefitsSection />
      <HowItWorksSection />
      <CertificationsOutcomesSection />
      <NewsletterSignup />
      <Footer />
    </div>
  );
}
