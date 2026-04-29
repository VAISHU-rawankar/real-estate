import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function SitemapPage() {
  return (
    <>
      <Helmet>
        <title>Sitemap — Navigate RealEstate Platform</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white text-[#1A1A1A]">
        <h1 className="text-3xl md:text-4xl font-display font-semibold tracking-tight mb-8">Sitemap</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm font-bold">
          <div>
            <h2 className="text-[#7C5CFF] text-xs font-semibold tracking-widest uppercase mb-4">Core Pages</h2>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-gray-500 hover:text-[#1A1A1A]">Home</Link>
              <Link to="/properties" className="text-gray-500 hover:text-[#1A1A1A]">Property Listings</Link>
              <Link to="/about" className="text-gray-500 hover:text-[#1A1A1A]">About Us</Link>
              <Link to="/contact" className="text-gray-500 hover:text-[#1A1A1A]">Contact Us</Link>
            </div>
          </div>

          <div>
            <h2 className="text-[#7C5CFF] text-xs font-semibold tracking-widest uppercase mb-4">Legal</h2>
            <div className="flex flex-col gap-2">
              <Link to="/privacy" className="text-gray-500 hover:text-[#1A1A1A]">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-500 hover:text-[#1A1A1A]">Terms & Conditions</Link>
              <Link to="/disclaimer" className="text-gray-500 hover:text-[#1A1A1A]">Disclaimer</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
