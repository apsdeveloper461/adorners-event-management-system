import React, { useState } from 'react';
import { set, useForm } from 'react-hook-form';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import 'tailwindcss/tailwind.css';

const LogIn = () => {
    const navigate=useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${backendUrl}/api/login`, {
        ...data,
        userType: isAdmin ? 'admin' : 'customer'
      });
      console.log(response.data);
      toast.success('Login successful!');
      localStorage.setItem('token', response.data.token);
      setTimeout(() => {

        isAdmin ? navigate('/admin-panel') : navigate('/user-panel');
        }, 1000);
      reset();
    } catch (error) {
        
      toast.error(error?.response?.data || 'Login failed. Please try again.');
      console.error(error,error?.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col items-center justify-center">
      <div className="mb-6 flex">
        <button 
          className={`px-4 py-2 ${!isAdmin ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'} transition-all duration-300`} 
          onClick={() => setIsAdmin(false)}
        >
          Customer
        </button>
        <button 
          className={`px-4 py-2 ${isAdmin ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'} transition-all duration-300`} 
          onClick={() => setIsAdmin(true)}
        >
          Admin
        </button>
      </div>
      <motion.form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Email</label>
          <input 
            type="email" 
            {...register('email', { required: true })} 
            placeholder="Enter your email"
            className="w-full p-2 border border-gray-300 rounded outline-blue-500"
          />
          {errors.email && <span className="text-red-500">This field is required</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Password</label>
          <input 
            type="password" 
            {...register('password', { required: true, minLength: 6 })} 
            placeholder="Enter your password"
            className="w-full p-2 border border-gray-300 rounded outline-blue-500"
          />
          {errors.password && <span className="text-red-500">Password must be at least 6 characters long</span>}
        </div>
        <motion.button 
          type="submit" 
          className="w-full bg-blue-500 p-2 rounded text-white flex items-center justify-center" 
          disabled={isSubmitting}
          whileTap={{ scale: 0.95 }}
        >
          {isSubmitting ? (
            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          ) : 'Log In'}
        </motion.button>
        <div className="mt-4 text-center">
          <span className="text-gray-700">Don't have an account? </span>
          <Link to="/signup" className="text-blue-500">Sign Up</Link>
        </div>
      </motion.form>
    </div>
  );
};

export default LogIn;
