import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function DisclaimerPage() {
  return (
    <>
      <Helmet>
        <title>Legal Disclaimer | RealEstate Platform</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white text-[#1A1A1A]">
        <h1 className="text-3xl md:text-4xl font-display font-semibold tracking-tight mb-6">Disclaimer</h1>
        <div className="space-y-6 text-sm text-[#666666] leading-relaxed font-medium">
          <p>Pricing estimates depend fully on offline owner agreements. Final figures adapt directly to closing constraints.</p>
        </div>
      </div>
    </>
  );
}
