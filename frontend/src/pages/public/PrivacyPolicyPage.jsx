import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | RealEstate Platform</title>
        <meta name="description" content="Read our privacy policy about how we collect, store, and utilize user information securely." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white text-[#1A1A1A]">
        <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-6">Privacy Policy</h1>
        <p className="text-[#666666] text-xs font-semibold mb-8">Last Updated: April 2026</p>

        <div className="space-y-6 text-sm text-[#666666] leading-relaxed font-medium">
          <p>We respect individual personal safety. This policy governs how customer contact info interacts with site APIs appropriately.</p>
          <h2 className="text-xl font-display font-extrabold text-[#1A1A1A] mt-8">1. Information We Collect</h2>
          <p>We log analytical credentials securely inside localized databases protecting multi-step validations thoroughly.</p>
        </div>
      </div>
    </>
  );
}
