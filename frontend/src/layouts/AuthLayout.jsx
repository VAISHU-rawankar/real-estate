import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import ToastContainer from '@components/common/ToastContainer';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans antialiased flex items-center justify-center p-4">
      <ToastContainer />
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-[#1A1A1A] font-display font-semibold text-xl tracking-wider">RealEstate</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#EAE6DF] rounded-[24px] p-8 shadow-sm">
          <Outlet />
        </div>

        <p className="text-center text-[#666666] text-sm mt-6 font-medium">
          © {new Date().getFullYear()} RealEstate Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}

