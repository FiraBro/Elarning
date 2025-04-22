import React from "react";
import Navbar from "../components/Navbar";
import Overview from "../components/overview";
import Catagory from "../components/catagory";
import FeaturedCourse from "../components/FeaturedCourse";
import BenefitsSection from "../components/BenefitsSection";
import HowItWorksSection from "../components/HowItWorksSection";
import CertificationsOutcomesSection from "../components/CertificationsOutcomesSection";
import NewsletterSignup from "../components/NewsletterSignup";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <Overview />
      <Catagory />
      <FeaturedCourse />
      <BenefitsSection />
      <HowItWorksSection />
      <CertificationsOutcomesSection />
      <NewsletterSignup />
    </div>
  );
}
