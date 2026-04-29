import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function TermsAndConditionsPage() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | RealEstate Platform</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white text-[#1A1A1A]">
        <h1 className="text-3xl md:text-4xl font-display font-semibold tracking-tight mb-6">Terms & Conditions</h1>
        <div className="space-y-6 text-sm text-[#666666] leading-relaxed font-medium">
          <p>By entering data parameters, parties consent fully to asset distribution rules mapped securely.</p>
        </div>
      </div>
    </>
  );
}
