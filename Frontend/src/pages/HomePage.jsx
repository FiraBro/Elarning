import React from "react";
import Navbar from "../components/Navbar";
import Overview from "../components/overview";
import Catagory from "../components/catagory";
import FeaturedCourse from "../components/FeaturedCourse";
import BenefitsSection from "../components/BenefitsSection";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <Overview />
      <Catagory />
      <FeaturedCourse />
      <BenefitsSection />
    </div>
  );
}
