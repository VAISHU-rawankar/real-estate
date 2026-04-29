import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useVerifyAdmin2FAMutation, useSendOTPMutation } from '@store/api/authApi';
import { useDispatch } from 'react-redux';
import { showToast } from '@store/slices/uiSlice';

export default function OTPVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = searchParams.get('email');
  
  const [verifyAdmin2FA, { isLoading }] = useVerifyAdmin2FAMutation();
  const [sendOTP, { isLoading: isResending }] = useSendOTPMutation();
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (!email) {
      navigate('/auth/login', { replace: true });
    }
  }, [email, navigate]);

  const onSubmit = async (data) => {
    try {
      await verifyAdmin2FA({ email, code: data.code }).unwrap();
      dispatch(showToast({ type: 'success', message: 'Admin login successful!' }));
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err?.data?.error?.message || 'Verification failed. Please try again.' }));
    }
  };

  const handleResend = async () => {
    try {
      await sendOTP({ contact: email, contactType: 'email', type: 'admin-2fa' }).unwrap();
      dispatch(showToast({ type: 'success', message: 'OTP resent successfully!' }));
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err?.data?.error?.message || 'Failed to resend OTP.' }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2 className="text-2xl font-display font-bold text-[#1A1A1A] mb-2">Verify OTP</h2>
      <p className="text-[#666666] text-sm mb-8 font-medium">Enter the 6-digit code sent to your email: <span className="text-[#1A1A1A] font-bold">{email}</span></p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-1.5">6-Digit Code</label>
          <input
            type="text"
            className={`w-full px-4 py-3 rounded-xl bg-white border text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/30 focus:border-[#7C5CFF] transition-all text-sm ${errors.code ? 'border-red-400' : 'border-[#EAE6DF]'}`}
            placeholder="123456"
            maxLength={6}
            {...register('code', { required: 'OTP is required', length: { value: 6, message: 'Must be 6 digits' } })}
          />
          {errors.code && <p className="text-red-500 text-xs mt-1 font-medium">{errors.code.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-bold text-white bg-[#1A1A1A] hover:bg-[#2A2A2A] transition-all duration-200 disabled:opacity-60 shadow-md hover:shadow-lg mt-2"
        >
          {isLoading ? 'Verifying...' : 'Verify & Continue'}
        </button>
      </form>

      <div className="text-center mt-6">
        <button 
          onClick={handleResend}
          disabled={isResending}
          className="text-[#7C5CFF] hover:text-[#6D28D9] font-bold text-sm disabled:opacity-50 transition-colors"
        >
          {isResending ? 'Resending...' : 'Resend OTP'}
        </button>
      </div>
    </motion.div>
  );
}

