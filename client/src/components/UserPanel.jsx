import React from 'react';
import { motion } from 'framer-motion';
import 'tailwindcss/tailwind.css';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaIdCard, FaPhoneAlt } from 'react-icons/fa';
import scheduling from '../assets/scheduling.jpg';
import mainImg from '../assets/event.avif';
import support from '../assets/support.jpg';
import catering from '../assets/catering.jpg';
import booking from '../assets/booking.jpg';
import entertain from '../assets/entertain.jpg';
import photography from '../assets/photo.jpg';

const services = [
  { title: 'Event Scheduling', image: scheduling },
  { title: 'Venue Booking', image: booking },
  { title: 'Catering Services', image: catering },
  { title: 'Entertainment', image: entertain },
  { title: 'Photography', image: photography },
  { title: '24/7 Support', image: support },
];

const UserPanel = () => {
  const scrollToContact = () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToServices = () => {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col items-center justify-center">
      <nav className="absolute top-0 w-full text-black p-4">
        <div className="max-w-6xl ml-10 flex items-center">
          <div className="flex items-center space-x-2 mt-1">
            <img src="../../public/logo.webp" alt="Logo" className="h-20 w-30" />
          </div>
        </div>
      </nav>
      <div className="flex flex-col md:flex-row items-center justify-center w-full bg-white min-h-screen mb-8">
 
        <div className="w-full md:w-1/2 h-full flex flex-col justify-center p-8 md:pr-20 bg-white md:mt-0 mt-20">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Event Management System
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-justify mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Organize and manage your events effortlessly. From small gatherings to large conferences, we have you covered. Explore our services and see how we can help make your event a success.
          </motion.p>
          <div className="flex  flex-row items-center space-y-0 space-x-4 ml-4">
            <motion.button
              className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              onClick={scrollToContact}
            >
              Contact Us
            </motion.button>
            <motion.button
              className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              onClick={scrollToServices}
            >
              Learn More
            </motion.button>
          </div>
        </div>
               <div className="w-full md:w-1/2 h-full">
          <img src={mainImg} alt="Main" className="w-full h-full object-cover" />
        </div>
      </div>
      <motion.div
        id="services"
        className="w-full max-w-6xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Our Services</h2>
        <hr className="border-t-2 border-gray-300 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white text-black p-6 rounded-lg shadow-lg">
              <img src={service.image} alt={service.title} className="w-full h-48 object-cover rounded-t-lg mb-4" />
              <h3 className="text-xl font-semibold">{service.title}</h3>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div
        id="contact"
        className="w-full max-w-6xl text-center bg-white text-black p-8 rounded-lg shadow-lg mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="flex flex-col items-center gap-2">
            <FaEnvelope className="text-2xl mb-2" />
            <a href='mailto:theadorners123@gmail.com' target='_blank' className="mb-2">theadorners123@gmail.com</a>
            <FaPhoneAlt className="text-2xl mb-2" />
            <p className="mb-2">+92 301 4860300</p>
          </div>
          <div className="flex flex-col items-center">
            <FaMapMarkerAlt className="text-3xl mb-2" />
            <p className="mb-2">The Adorners Inc.</p>
            <p className="mb-2">E-522 Model Colony, Walton Road Lahore Cantt, Lahore</p>
            <FaIdCard className="text-3xl mb-2" />
            <p className="mb-2">NTN: 123456789</p>
          </div>
        </div>
        <div className="mt-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13604.94370861619!2d74.3587475!3d31.5203695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1634567890123!5m2!1sen!2s"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </motion.div>
      <footer className="w-full bg-white text-black p-4 shadow-lg mt-8">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 <strong>The Adorners Inc.</strong> All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserPanel;
