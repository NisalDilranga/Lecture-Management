import React from "react";
import { motion } from "framer-motion";
import aboutImage from "../assets/about.jpg";

const AboutUsSection = () => {
  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-b from-white to-[#680000]/5 px-4 md:px-0"
    >
      <div className="container mx-auto">
        <motion.h2
          className="text-5xl font-bold text-center text-[#680000] mb-12 relative before:content-[''] before:absolute before:w-24 before:h-1 before:bg-[#680000]/70 before:-bottom-4 before:left-1/2 before:-translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Us
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-white p-8 md:p-10 rounded-lg shadow-xl border border-gray-100">
              <motion.p
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <span className="font-semibold text-[#680000] text-xl">
                  Sri Lanka Institute of Advanced Technological Education
                  (SLIATE)
                </span>{" "}
                is committed to providing high-quality educational
                opportunities. We strive to prepare our students for successful
                careers by offering comprehensive programs taught by experienced
                professionals.
              </motion.p>

              <motion.p
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Our lecturer management system ensures that we maintain a
                talented pool of educators who bring real-world experience and
                academic excellence to our classrooms.
              </motion.p>

              <motion.p
                className="text-gray-700 mb-8 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                We believe in continuous improvement, innovation in teaching
                methodologies, and creating an environment where both students
                and faculty can thrive.
              </motion.p>

              <motion.div
                className="flex justify-start mt-8"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
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
                  className="flex items-center gap-2 rounded-full bg-[#8B0000]/90 backdrop-blur-sm px-8 py-3 text-white font-medium border border-[#a52a2a]/50 transition-all duration-300"
                >
                  Learn More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <img
                src={aboutImage}
                alt="SLIATE Campus"
                className="rounded-lg shadow-xl object-cover h-[500px] w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-[#680000] text-white p-6 rounded-lg shadow-lg max-w-xs hidden md:block">
                <p className="font-semibold text-xl mb-2">
                  Excellence in Education
                </p>
                <p className="text-sm opacity-80">
                  Join our community of learners and educators committed to
                  academic excellence and innovation.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, staggerChildren: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#680000] hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-[#680000]/10 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#680000]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Quality Education
            </h3>
            <p className="text-gray-600">
              Providing top-tier education with experienced faculty members and
              modern facilities.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#680000] hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-[#680000]/10 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#680000]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Career Readiness
            </h3>
            <p className="text-gray-600">
              Preparing students for successful careers through practical
              education and industry partnerships.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#680000] hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-[#680000]/10 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#680000]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Community Focus
            </h3>
            <p className="text-gray-600">
              Building a supportive learning community where students and
              faculty can collaborate and grow together.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUsSection;
