import React from "react";
import { motion } from "framer-motion";

const AboutUsSection = () => {
  return (
    <section className="py-16 bg-[#680000]/5 px-4 md:px-20">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center text-[#680000] mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Us
        </motion.h2>

        <motion.div
          className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {" "}
          <motion.p
            className="text-gray-700 mb-6"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="font-semibold text-[#680000]">
              Sri Lanka Institute of Advanced Technological Education (SLIATE)
            </span>{" "}
            is committed to providing high-quality educational opportunities. We
            strive to prepare our students for successful careers by offering
            comprehensive programs taught by experienced professionals.
          </motion.p>
          <motion.p
            className="text-gray-700 mb-6"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Our lecturer management system ensures that we maintain a talented
            pool of educators who bring real-world experience and academic
            excellence to our classrooms.
          </motion.p>{" "}
          <motion.p
            className="text-gray-700 mb-8"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            We believe in continuous improvement, innovation in teaching
            methodologies, and creating an environment where both students and
            faculty can thrive.
          </motion.p>
          <motion.div
            className="flex justify-center"
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
              className="flex items-center gap-2 rounded-full bg-[#8B0000]/80 backdrop-blur-sm px-6 py-3 text-white font-medium border border-[#a52a2a]/50"
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUsSection;
