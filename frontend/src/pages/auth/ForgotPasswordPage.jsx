import React from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-[#1A1A1A] mb-4">Reset Password</h2>
      <p className="text-[#666666] text-sm mb-6">Password reset form — implementation pending.</p>
      
      <Link to="/auth/login" className="text-xs font-bold text-[#7C5CFF] hover:text-[#6D28D9] transition-colors">
        Back to Sign In
      </Link>
    </div>
  );
}

