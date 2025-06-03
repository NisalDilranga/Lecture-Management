import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Import images from main assets
import about from '../assets/about.jpg';
import graduationCeremony from '../assets/graduation-ceremony.jpg';
import graduation from '../assets/graduation.jpg';

// Import images from temp folder (locations/campuses)
import anmpara from '../assets/temp/Anmpara.jpg';
import badulla from '../assets/temp/Badulla.jpeg';
import dehiwala from '../assets/temp/Dehiwala.jpg';
import gampaha from '../assets/temp/gampaha.jpg';
import jaffna from '../assets/temp/jaffna.jpg';
import kandy from '../assets/temp/kandy.jpg';
import kegalla from '../assets/temp/kegalla.jpg';
import labuduwa from '../assets/temp/Labuduwa.jpg';
import nawalapitya from '../assets/temp/Nawalapitya.jpeg';
import rathnapura from '../assets/temp/Rathnapura.jpg';
import kurunegala from '../assets/temp/urunagala.jpg';

const ImgSlider = ({ autoSlide = true, autoSlideInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const slides = [

    { image: kandy, title: 'Kandy ', description: 'Our campus in the heart of Kandy' },
    { image: jaffna, title: 'Jaffna ', description: 'Northern province education center' },
    { image: gampaha, title: 'Gampaha ', description: 'Serving the Western province' },
    { image: badulla, title: 'Badulla ', description: 'Uva province education hub' },
    { image: dehiwala, title: 'Dehiwala ', description: 'Colombo suburban center' },
    { image: kegalla, title: 'Kegalle ', description: 'Sabaragamuwa province facility' },
    { image: labuduwa, title: 'Labuduwa ', description: 'Southern province education center' },
    { image: nawalapitya, title: 'Nawalapitiya', description: 'Central highlands education hub' },
    { image: rathnapura, title: 'Ratnapura ', description: 'Gem city campus' },
    { image: kurunegala, title: 'Kurunegala ', description: 'North Western province center' },
    { image: anmpara, title: 'Ampara ', description: 'Eastern province education facility' }
  ];

  const prev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const next = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    let slideInterval;
    
    if (autoSlide) {
      slideInterval = setInterval(() => {
        next();
      }, autoSlideInterval);
    }
    
    return () => clearInterval(slideInterval);
  }, [currentIndex, autoSlide, autoSlideInterval]);

  return (
    <div className="relative overflow-hidden  flex justify-center items-center mb-6">
      <div className="relative h-[500px] md:h-[400px] w-[60%] mx-auto">
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img 
              src={slides[currentIndex].image} 
              alt={slides[currentIndex].title}
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold mb-4 text-center"
              >
                {slides[currentIndex].title}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl text-center max-w-2xl"
              >
                {slides[currentIndex].description}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <button 
        onClick={prev}
        className="absolute left-[100px] top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <FaArrowLeft />
      </button>
      <button 
        onClick={next}
        className="absolute right-[100px] top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <FaArrowRight />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentIndex === index ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImgSlider;