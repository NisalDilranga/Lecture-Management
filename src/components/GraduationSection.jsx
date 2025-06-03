import React from "react";
import { motion } from "framer-motion";
import graduationCeremonyImg from "../assets/graduation-ceremony.jpg";

// Floating Particle component
const FloatingParticle = ({ delay, initialX, initialY }) => {
  return (
    <motion.div
      className="absolute"
      initial={{
        x: initialX,
        y: initialY,
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        y: [initialY, initialY - 50, initialY - 20],
        x: [
          initialX,
          initialX + (Math.random() * 40 - 20),
          initialX + (Math.random() * 60 - 30),
        ],
        opacity: [0, 0.7, 0],
        scale: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 4,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2 + 1,
      }}
    >
      <div className="w-3 h-3 bg-[#8B0000]/70 rounded-full" />
    </motion.div>
  );
};

const GraduationSection = () => {
  // Create an array of particles for animation
  const particles = Array.from({ length: 15 }).map((_, index) => ({
    id: index,
    delay: Math.random() * 2,
    initialX: 100 + Math.random() * 400,
    initialY: 100 + Math.random() * 300,
  }));

  return (
    <section id="about" className="py-16 px-4 md:px-20 relative overflow-hidden bg-[#680000]/5">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <pattern
            id="aboutPattern"
            patternUnits="userSpaceOnUse"
            width="20"
            height="20"
            viewBox="0 0 40 40"
          >
            <path d="M20 5L5 20L20 35L35 20L20 5Z" fill="#680000" />
          </pattern>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#aboutPattern)"
          />
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="text-4xl font-bold text-center text-[#680000] mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Our Institution
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Image with animated particles */}
          <motion.div
            className="rounded-lg overflow-hidden shadow-xl relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <img
              src={graduationCeremonyImg}
              alt="Our Campus"
              className="w-full h-auto object-cover rounded-lg"
              style={{ maxHeight: "500px" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#680000]/30 to-transparent rounded-lg"></div>

            {/* Animated floating particles */}
            {particles.map((particle) => (
              <FloatingParticle
                key={particle.id}
                delay={particle.delay}
                initialX={particle.initialX}
                initialY={particle.initialY}
              />
            ))}

            <motion.div
              className="absolute bottom-4 left-0 right-0 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p className="text-white text-xl font-bold px-4 bg-[#680000]/50 py-2 mx-auto w-max rounded-full">
                Excellence in Education Since 1995
              </p>
            </motion.div>
          </motion.div>          {/* Right side - Content */}
          <motion.div
            className="flex flex-col space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.h3
              className="text-2xl font-bold text-[#680000]"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Our Legacy of Excellence
            </motion.h3>
            <motion.p
              className="text-gray-700"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Founded in 1995, Aurora University has established itself as a premier 
              institution dedicated to academic excellence and innovation. Our campus 
              spans over 50 acres of modern facilities designed to provide students 
              with an enriching educational experience in a supportive environment.
            </motion.p>
            <motion.h3
              className="text-2xl font-bold text-[#680000] pt-2"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Our Mission & Values
            </motion.h3>
            <motion.p
              className="text-gray-700"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              We are committed to fostering critical thinking, creativity, and ethical leadership 
              through a comprehensive curriculum taught by distinguished faculty. Our core values 
              of integrity, innovation, inclusivity, and excellence guide everything we do, from 
              classroom teaching to community engagement and groundbreaking research.
            </motion.p>
            {/* Institution Statistics */}
            <motion.div
              className="grid grid-cols-2 gap-4 pt-4 pb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-3 rounded-lg shadow text-center">
                <motion.span
                  className="block text-[#8B0000] text-2xl font-bold"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  30+
                </motion.span>
                <span className="text-sm text-gray-600">Years of Excellence</span>
              </div>
              <div className="bg-white p-3 rounded-lg shadow text-center">
                <motion.span
                  className="block text-[#8B0000] text-2xl font-bold"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  120+
                </motion.span>
                <span className="text-sm text-gray-600">Academic Programs</span>
              </div>
            </motion.div>
            <motion.div
              className="pt-2"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              viewport={{ once: true }}
            >
              <motion.button
                style={{
                  boxShadow: "0 4px 15px rgba(139, 0, 0, 0.4)",
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#a52a2a",
                }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-2 rounded-full bg-[#8B0000]/80 backdrop-blur-sm px-6 py-3 text-white font-medium border border-[#a52a2a]/50"
              >
                Learn More About Us
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GraduationSection;
