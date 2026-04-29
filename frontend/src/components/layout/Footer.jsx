import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

const FOOTER_LINKS = {
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'Channel Partners', href: '/partners/register' },
  ],
  'Properties': [
    { label: 'Residential', href: '/properties?propertyType=residential' },
    { label: 'Commercial', href: '/properties?propertyType=commercial' },
    { label: 'Agricultural', href: '/properties?propertyType=agricultural' },
    { label: 'Plots & Land', href: '/properties?propertyType=plot' },
  ],
  'Cities': [
    { label: 'Mumbai', href: '/properties?city=Mumbai' },
    { label: 'Pune', href: '/properties?city=Pune' },
    { label: 'Bangalore', href: '/properties?city=Bangalore' },
    { label: 'Hyderabad', href: '/properties?city=Hyderabad' },
  ],
  'Legal': [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 pb-16 border-b border-white/10">
        {/* Contact/Brand */}
        <div>
          <span className="font-display font-semibold text-2xl tracking-widest text-[#D4A853] block mb-4">RealEstate</span>
          <p className="text-white/50 text-sm max-w-xs mb-6">
            India's most trusted platform for buying, selling, and renting verified real estate properties.
          </p>
          <a 
            href="mailto:contact@realestate.com" 
            className="text-lg font-display font-medium flex items-center gap-2 hover:text-white/80 transition-colors text-white"
          >
            contact@realestate.com
            <ArrowUpRightIcon className="w-5 h-5 text-[#8C6D45]" />
          </a>
        </div>

        {/* Links Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-white/50 mb-6 uppercase tracking-wider text-xs">{section}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="hover:text-[#8C6D45] text-white/70 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 text-center">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 text-xs text-white/30 border-t border-white/5 pt-8">
          <p>© {new Date().getFullYear()} RealEstate Platform. All rights reserved.</p>
          <p className="text-white/20">RERA Registered | Built with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
