import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";
import graduationImg from "../assets/graduation.jpg";
import NavBar from "./NavBar";
import ApplicationModal from "./ApplicationModal";

// New color scheme based on the SLIATE design
const COLORS_TOP = ["#8B0000", "#A52A2A", "#B22222", "#8B0000"];

export const AuroraHero = () => {
  const color = useMotionValue(COLORS_TOP[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative flex flex-col h-screen">
      <NavBar />

      {/* Background image container */}
      <div className="relative flex-1">
        {/* Background image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${graduationImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.7)",
          }}
        ></div>

        {/* Content section */}
        <div className="relative z-10 flex justify-center items-center h-full px-4">
          <div className="flex flex-col items-center text-center max-w-4xl">
            <span className="mb-3 inline-block px-3 py-1.5 text-sm text-white">
              Beta Now Live!
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6">
              Launch Your Next
              <br />
              Career Chapter Here
            </h1>
            <p className="mb-8 max-w-2xl text-white text-base md:text-lg opacity-90">
      We welcome professionals and academics. Easily apply to teach, share expertise, and inspire students. Browse openings and join us today!
            </p>
            <motion.button
              onClick={handleOpenModal}
              style={{
                boxShadow: "0 4px 15px rgba(139, 0, 0, 0.5)",
              }}
              whileHover={{
                scale: 1.05,
                backgroundColor: "#a52a2a",
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="group flex items-center gap-2 rounded-full bg-[#8B0000]/80 backdrop-blur-sm px-6 py-3 text-white font-medium border border-[#a52a2a]/50"
            >
              Apply Now
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
        </div>

        {/* Stars overlay with lower z-index than content */}
        <div className="absolute inset-0 z-5 opacity-20">
          <Canvas>
            <Stars radius={50} count={1500} factor={4} fade speed={1} />
          </Canvas>
        </div>
      </div>
      
      {/* Application Modal */}
      <ApplicationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};