import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useRegisterMutation } from '@store/api/authApi';
import { useDispatch } from 'react-redux';
import { showToast } from '@store/slices/uiSlice';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const { register: reg, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = async (data) => {
    const { confirmPassword, ...rest } = data;
    try {
      await register(rest).unwrap();
      dispatch(showToast({ type: 'success', message: 'Account created successfully!' }));
      navigate('/dashboard');
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err?.data?.error?.message || 'Registration failed.' }));
    }
  };

  const password = watch('password');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2 className="text-2xl font-display font-bold text-[#1A1A1A] mb-2">Create Account</h2>
      <p className="text-[#666666] text-sm mb-8 font-medium">Join 25,000+ property seekers today</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-1.5">Full Name</label>
          <input type="text" className={`w-full px-4 py-3 rounded-xl bg-white border text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/30 focus:border-[#7C5CFF] transition-all text-sm ${errors.name ? 'border-red-400' : 'border-[#EAE6DF]'}`}
            placeholder="Rajesh Kumar" {...reg('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} />
          {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-1.5">Email Address</label>
          <input type="email" className={`w-full px-4 py-3 rounded-xl bg-white border text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/30 focus:border-[#7C5CFF] transition-all text-sm ${errors.email ? 'border-red-400' : 'border-[#EAE6DF]'}`}
            placeholder="you@example.com" {...reg('email', { required: 'Email is required' })} />
          {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-1.5">Mobile Number</label>
          <div className="flex gap-2">
            <div className="flex items-center px-3 py-3 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF] text-[#1A1A1A]/60 text-sm font-semibold">+91</div>
            <input type="tel" className={`flex-1 px-4 py-3 rounded-xl bg-white border text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/30 focus:border-[#7C5CFF] transition-all text-sm ${errors.phone ? 'border-red-400' : 'border-[#EAE6DF]'}`}
              placeholder="9876543210" {...reg('phone', { pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid Indian mobile number' } })} />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-1.5">Password</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} className={`w-full px-4 py-3 pr-12 rounded-xl bg-white border text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/30 focus:border-[#7C5CFF] transition-all text-sm ${errors.password ? 'border-red-400' : 'border-[#EAE6DF]'}`}
              placeholder="Min. 8 characters" {...reg('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })} />
            <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isLoading} className="w-full py-3 rounded-xl font-bold text-white bg-[#1A1A1A] hover:bg-[#2A2A2A] transition-all disabled:opacity-60 shadow-md hover:shadow-lg mt-4">
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-[#666666] text-sm mt-6 font-medium">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-[#7C5CFF] hover:text-[#6D28D9] font-bold">Sign in</Link>
      </p>
    </motion.div>
  );
}

