import React, { useState } from 'react';
import { motion } from 'framer-motion';
import 'tailwindcss/tailwind.css';
import { FaBars, FaTimes, FaCalendarAlt, FaImages, FaFileInvoice, FaBox, FaBook } from 'react-icons/fa';
import { CiLogout } from "react-icons/ci";
import { NavLink } from 'react-router-dom';

const Navbar = ({ toggleMenu }) => {
  return (
    <div className="w-full sticky top-0 bg-blue-800 text-white p-4 flex justify-between items-center z-50">
      <h1 className="text-xl font-semibold">Admin Panel</h1>
      <button onClick={toggleMenu} className="md:hidden">
        <FaBars />
      </button>
    </div>
  );
};

const Sidebar = ({ isOpen, toggleMenu }) => {
  return (
    <motion.div 
      className={`fixed z-10  w-full md:w-64 bg-white shadow-lg shadow-slate-300 p-4 h-full ${isOpen ? 'block' : 'hidden'} `}
      initial={{ x: -200 }}
      animate={{ x: isOpen || window.innerWidth >= 768 ? 0 : -200 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Menu</h2>
        <button onClick={toggleMenu} className="md:hidden">
          <FaTimes className="text-black" />
        </button>
      </div>
      <ul>
        <li className="mb-2">
          <NavLink 
            to="/admin-panel/events" 
            className="flex items-center p-2 rounded hover:bg-blue-100" 
            activeClassName="bg-blue-500 text-white"
          >
            <FaCalendarAlt className="mr-2" /> Event Record
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink 
            to="/admin-panel/gallery" 
            className="flex items-center p-2 rounded hover:bg-blue-100" 
            activeClassName="bg-blue-500 text-white"
          >
            <FaImages className="mr-2" /> Gallery
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink 
            to="/admin-panel/invoice" 
            className="flex items-center p-2 rounded hover:bg-blue-100" 
            activeClassName="bg-blue-500 text-white"
          >
            <FaFileInvoice className="mr-2" /> Invoice Generate
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink 
            to="/admin-panel/inventory" 
            className="flex items-center p-2 rounded hover:bg-blue-100" 
            activeClassName="bg-blue-500 text-white"
          >
            <FaBox className="mr-2" /> Inventory
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink 
            to="/admin-panel/ledger" 
            className="flex items-center p-2 rounded hover:bg-blue-100" 
            activeClassName="bg-blue-500 text-white"
          >
            <FaBook className="mr-2" /> Ledger
          </NavLink>
        </li>
        <li className="mb-2">
          <div 
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';

            }
          }
            className="flex items-center p-2 rounded hover:bg-blue-100 cursor-pointer" 
            activeClassName="bg-blue-500 text-white"
          >
            <CiLogout className="mr-2" /> Logout
          </div>
        </li>
      </ul>
    </motion.div>
  );
};

const AdminPanel = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar toggleMenu={toggleMenu} />
      <div className="flex flex-1 relative h-full ">
        <Sidebar isOpen={isOpen} toggleMenu={toggleMenu} />
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:ml-64  overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
