import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function AboutPage() {
  return (
    <>
      <Helmet><title>About Us — RealEstate</title></Helmet>
      <div className="page-container py-20">
        <h1 className="section-title text-center mb-4">About RealEstate Platform</h1>
        <p className="section-subtitle mx-auto text-center mb-12">India's most trusted property marketplace, built on transparency and technology.</p>
        <div className="max-w-3xl mx-auto prose prose-slate text-slate-600 leading-relaxed space-y-6">
          <p>Founded with a vision to make real estate transactions transparent and accessible, RealEstate Platform has grown to become India's most comprehensive property marketplace. We connect buyers, sellers, and renters with verified listings across 50+ cities.</p>
          <p>Our platform is RERA-compliant and features over 10,000 verified properties. We leverage technology to make property search faster, smarter, and more reliable for every Indian.</p>
        </div>
      </div>
    </>
  );
}
