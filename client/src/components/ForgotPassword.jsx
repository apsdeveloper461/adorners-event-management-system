import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { motion } from 'framer-motion';
import 'tailwindcss/tailwind.css';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/forgot-password', data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col items-center justify-center">
      <motion.form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input 
            type="email" 
            {...register('email', { required: true })} 
            className="w-full p-2 bg-gray-200 rounded"
          />
          {errors.email && <span className="text-red-500">This field is required</span>}
        </div>
        <button type="submit" className="w-full bg-blue-500 p-2 rounded text-white">Reset Password</button>
      </motion.form>
    </div>
  );
};

export default ForgotPassword;
