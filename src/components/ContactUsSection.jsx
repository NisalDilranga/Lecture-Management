import React from "react";
import { motion } from "framer-motion";

const ContactUsSection = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-20" id="contact-us">
      <div className="container mx-auto px-4">
        {" "}
        <motion.h2
          className="text-[42px] font-bold text-center mb-16 text-[#680000]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Contact Information
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
          {/* Address Card */}{" "}
          <motion.div
            className="bg-[#ecf0f1] rounded-lg shadow-md p-6 flex flex-col items-center text-center cursor-pointer h-full"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(139, 0, 0, 0.2)",
              backgroundColor: "#f8fafc",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-[#680000] mb-4"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </motion.div>
            <motion.h3
              className="text-lg font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              Address
            </motion.h3>{" "}
            <motion.p
              className="mt-2 text-gray-600"
              whileHover={{ color: "#8B0000" }}
            >
              SLIATE, No. 320, T. B. Jayah Mawatha, Colombo 10, Sri Lanka
            </motion.p>
          </motion.div>{" "}
          {/* Phone Card */}{" "}
          <motion.div
            className="bg-[#ecf0f1] rounded-lg shadow-md p-6 flex flex-col items-center text-center cursor-pointer h-full"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(139, 0, 0, 0.2)",
              backgroundColor: "#f8fafc",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <motion.div
              className="text-[#680000] mb-4"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </motion.div>
            <motion.h3
              className="text-lg font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              Phone
            </motion.h3>{" "}
            <motion.p
              className="mt-2 text-gray-600"
              whileHover={{ color: "#8B0000" }}
            >
              +94 11 2698137
            </motion.p>
          </motion.div>{" "}
          {/* Email Card */}{" "}
          <motion.div
            className="bg-[#ecf0f1] rounded-lg shadow-md p-6 flex flex-col items-center text-center cursor-pointer h-full"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(139, 0, 0, 0.2)",
              backgroundColor: "#f8fafc",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <motion.div
              className="text-[#680000] mb-4"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </motion.div>
            <motion.h3
              className="text-lg font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              Email
            </motion.h3>{" "}
            <motion.p
              className="mt-2 text-gray-600"
              whileHover={{ color: "#8B0000" }}
            >
              info@sliate.ac.lk
            </motion.p>
          </motion.div>{" "}
          {/* Website Card */}{" "}
          <motion.div
            className="bg-[#ecf0f1] rounded-lg shadow-md p-6 flex flex-col items-center text-center cursor-pointer h-full"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(139, 0, 0, 0.2)",
              backgroundColor: "#f8fafc",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <motion.div
              className="text-[#680000] mb-4"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 18c1.657 0 3-4.03 3-9s-1.343-9-3-9"
                />
              </svg>
            </motion.div>
            <motion.h3
              className="text-lg font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              Website
            </motion.h3>
            <p className="mt-2 text-gray-600">
              <motion.a
                href="https://www.sliate.ac.lk"
                className="text-[#680000] hover:underline"
                whileHover={{ scale: 1.05, textDecoration: "underline" }}
                transition={{ duration: 0.2 }}
              >
                www.sliate.ac.lk
              </motion.a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactUsSection;
