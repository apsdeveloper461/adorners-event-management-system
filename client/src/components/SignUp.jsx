import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import 'tailwindcss/tailwind.css';

const SignUp = () => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const password = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${backendUrl}/api/signup`, {
        ...data,
        userType: isAdmin ? 'admin' : 'customer'
      });
      toast.success('Signup successful!');
      console.log(response.data);
      reset();
    } catch (error) {

        toast.error(error?.response?.data || 'Signup failed. Please try again.');
      console.error(error);
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
        
      </div>
      <motion.form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Username</label>
          <input 
            type="text" 
            {...register('username', { required: true, minLength: 6 })} 
            placeholder="Enter your username"
            className="w-full p-2 border border-gray-300 rounded outline-blue-500"
          />
          {errors.username && <span className="text-red-500">Username must be at least 6 characters long</span>}
        </div>
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
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Confirm Password</label>
          <input 
            type="password" 
            {...register('confirmPassword', { 
              required: true, 
              validate: value => value === password || "Passwords do not match" 
            })} 
            placeholder="Confirm your password"
            className="w-full p-2 border border-gray-300 rounded outline-blue-500"
          />
          {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
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
          ) : 'Sign Up'}
        </motion.button>
        <div className="mt-4 text-center">
          <span className="text-gray-700">Already have an account? </span>
          <Link to="/login" className="text-blue-500">Log In</Link>
        </div>
      </motion.form>
    </div>
  );
};

export default SignUp;
