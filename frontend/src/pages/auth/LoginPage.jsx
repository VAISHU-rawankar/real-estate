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
      await login(data).unwrap();
      dispatch(showToast({ type: 'success', message: 'Welcome back!' }));
      navigate(returnUrl, { replace: true });
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err?.data?.error?.message || 'Login failed. Please try again.' }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2 className="text-2xl font-display font-bold text-white mb-2">Welcome back</h2>
      <p className="text-white/50 text-sm mb-8">Sign in to continue your property journey</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Email Address</label>
          <input
            type="email"
            autoComplete="email"
            className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all text-sm ${errors.email ? 'border-red-400' : 'border-white/20'}`}
            placeholder="you@example.com"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-sm font-medium text-white/70">Password</label>
            <Link to="/auth/forgot-password" className="text-gold-400 hover:text-gold-300 text-sm">Forgot?</Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all text-sm ${errors.password ? 'border-red-400' : 'border-white/20'}`}
              placeholder="Your password"
              {...register('password', { required: 'Password is required' })}
            />
            <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #D4A853, #E8B84B)' }}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-white/50 text-sm mt-6">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-gold-400 hover:text-gold-300 font-medium">Create one</Link>
      </p>
    </motion.div>
  );
}
