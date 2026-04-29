import React from 'react';
import { Link } from 'react-router-dom';

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
    { label: 'Nashik', href: '/properties?city=Nashik' },
  ],
  'Legal': [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="page-container pt-16 pb-10">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4A853, #E8B84B)' }}>
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="font-display font-bold text-xl">RealEstate</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              India's most trusted platform for buying, selling, and renting verified real estate properties across 50+ cities.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {['Twitter', 'LinkedIn', 'Instagram'].map((s) => (
                <a key={s} href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors text-xs font-medium">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">{section}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-white/40 hover:text-gold-400 text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} RealEstate Platform. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            RERA Registered | Built with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
