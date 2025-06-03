import React from "react";
import NavBar from "../components/NavBar";
import { AuroraHero } from "../components/AuroraHero";
import WhyChooseUsSection from "../components/WhyChooseUsSection";
import ContactUsSection from "../components/ContactUsSection";
import AboutUsSection from "../components/AboutUsSection";
import GraduationSection from "../components/GraduationSection";
import { motion } from "framer-motion";
import FooterSection from "../components/FooterSection";
import ImgSlider from "../components/ImgSlider";

const Divider = () => (
  <div className="flex justify-center py-8">
    <motion.div
      className="w-24 h-1 bg-[#A52A2A]/80 rounded-full"
      initial={{ width: 0 }}
      whileInView={{ width: 96 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    />
  </div>
);

const Home = () => {
  return (
    <div className="bg-white min-h-screen">
      <AuroraHero />
      <div className=" bg-white">
        <Divider />
        <WhyChooseUsSection /> <Divider />
        <GraduationSection />
        <Divider />
        <ContactUsSection />
        <Divider />        <AboutUsSection />
        <Divider />
        <ImgSlider />
        <FooterSection/>
      </div>
    </div>
  );
};

export default Home;
