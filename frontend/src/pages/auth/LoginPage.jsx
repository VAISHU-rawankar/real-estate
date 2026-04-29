import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useLoginMutation } from '@store/api/authApi';
import { useDispatch } from 'react-redux';
import { showToast } from '@store/slices/uiSlice';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  const [login, { isLoading }] = useLoginMutation();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();
      if (res?.data?.require2FA || res?.require2FA) {
        const email = res?.data?.email || res?.email;
        dispatch(showToast({ type: 'success', message: 'OTP sent for 2FA verification.' }));
        navigate(`/auth/verify-otp?email=${encodeURIComponent(email)}`, { replace: true });
      } else {
        dispatch(showToast({ type: 'success', message: 'Welcome back!' }));
        const finalUrl = res?.data?.user?.role === 'admin' ? '/admin' : returnUrl;
        navigate(finalUrl, { replace: true });
      }
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err?.data?.error?.message || 'Login failed. Please try again.' }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2 className="text-2xl font-display font-bold text-[#1A1A1A] mb-2">Welcome back</h2>
      <p className="text-[#666666] text-sm mb-8 font-medium">Sign in to continue your property journey</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-1.5">Email Address</label>
          <input
            type="email"
            autoComplete="email"
            className={`w-full px-4 py-3 rounded-xl bg-white border text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/30 focus:border-[#7C5CFF] transition-all text-sm ${errors.email ? 'border-red-400' : 'border-[#EAE6DF]'}`}
            placeholder="you@example.com"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]/70">Password</label>
            <Link to="/auth/forgot-password" className="text-[#7C5CFF] hover:text-[#6D28D9] text-xs font-bold transition-colors">Forgot?</Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`w-full px-4 py-3 pr-12 rounded-xl bg-white border text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/30 focus:border-[#7C5CFF] transition-all text-sm ${errors.password ? 'border-red-400' : 'border-[#EAE6DF]'}`}
              placeholder="Your password"
              {...register('password', { required: 'Password is required' })}
            />
            <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-bold text-white bg-[#1A1A1A] hover:bg-[#2A2A2A] transition-all duration-200 disabled:opacity-60 shadow-md hover:shadow-lg mt-2"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-[#666666] text-sm mt-6 font-medium">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-[#7C5CFF] hover:text-[#6D28D9] font-bold">Create one</Link>
      </p>
    </motion.div>
  );
}

