import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 flex items-center justify-center p-4">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-navy-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-white font-display font-bold text-xl">RealEstate</span>
          </Link>
        </div>

        {/* Card */}
        <div className="card-glass rounded-3xl p-8 shadow-2xl">
          <Outlet />
        </div>

        <p className="text-center text-white/40 text-sm mt-6">
          © {new Date().getFullYear()} RealEstate Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}
