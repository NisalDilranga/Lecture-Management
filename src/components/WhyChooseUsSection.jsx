import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiUsers, FiTrendingUp, FiBook } from 'react-icons/fi';

const WhyChooseUsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: '0px 10px 20px rgba(139, 0, 0, 0.1)',
      transition: { duration: 0.3 }
    }
  };

  const features = [
    {
      icon: <FiClock size={40} className="text-amber-500" />,
      title: "Flexible Hours",
      description: "Teach when it fits your schedule and lifestyle."
    },
    {
      icon: <FiUsers size={40} className="text-amber-500" />,
      title: "Supportive Team",
      description: "Work in a helpful, positive academic environment."
    },
    {
      icon: <FiTrendingUp size={40} className="text-amber-500" />,
      title: "Career Growth",
      description: "Develop your skills and grow professionally with us."
    },
    {
      icon: <FiBook size={40} className="text-amber-500" />,
      title: "Modern Resources",
      description: "Access up-to-date tools and teaching materials."
    }
  ];

  return (
    <section className="py-16 bg-[#fefaf1] px-20">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center text-gray-800 mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Why Choose Us?
        </motion.h2>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
              variants={itemVariants}
              whileHover="hover"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;