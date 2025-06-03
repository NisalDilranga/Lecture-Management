import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { motion } from 'framer-motion'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

const FooterSection = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Logo and About */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <img src={logo} alt="Aurora University" className="h-16" />
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-400 mb-4"
            >
              Empowering minds through innovative education and research excellence.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex space-x-4"
            >
              <a href="#" className="text-gray-400 hover:text-[#A52A2A] transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#A52A2A] transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#A52A2A] transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#A52A2A] transition-colors">
                <FaLinkedin size={20} />
              </a>
            </motion.div>
          </div>
          
          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full md:w-1/4 mb-8 md:mb-0"
          >
            <h3 className="text-xl font-semibold mb-4 text-[#A52A2A]">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </motion.div>
          
          {/* Programs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-full md:w-1/4 mb-8 md:mb-0"
          >
            <h3 className="text-xl font-semibold mb-4 text-[#A52A2A]">Programs</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Undergraduate Studies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Graduate Programs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Online Learning</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Research Opportunities</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Career Development</a></li>
            </ul>
          </motion.div>
          
          {/* Contact */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-full md:w-1/4"
          >
            <h3 className="text-xl font-semibold mb-4 text-[#A52A2A]">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-[#A52A2A]" />
                <span className="text-gray-400">123 University Ave, Aurora City, AC 10001</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-[#A52A2A]" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-[#A52A2A]" />
                <span className="text-gray-400">info@aurorauniversity.edu</span>
              </li>
            </ul>
          </motion.div>
        </div>
        
        {/* Divider */}
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="h-px bg-gray-700 my-8"
        />
        
        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center text-gray-500 text-sm"
        >
          <p>&copy; {currentYear} Aurora University. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}

export default FooterSection