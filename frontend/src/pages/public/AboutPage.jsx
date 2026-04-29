import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us — Our Story & Mission | RealEstate</title>
        <meta name="description" content="Discover our journey, mission, and the dedicated team behind India's most trusted real estate platform." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white text-[#1A1A1A]">
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-4 h-4 text-[#7C5CFF] font-semibold">✦</span>
            <span className="text-[#7C5CFF] text-[10px] font-semibold tracking-wider uppercase">OUR JOURNEY</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight mb-4 text-navy-900">
            About Our Company
          </h1>
          <p className="text-[#666666] text-xs font-semibold leading-relaxed">
            Revolutionizing the property ecosystem through clarity, modern tech, and premium designs.
          </p>
        </div>

        {/* Company Story & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="rounded-[32px] overflow-hidden shadow-xl border border-[#EAE6DF] h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800" 
              alt="Our Story" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-semibold tracking-tight">Our Mission & Vision</h2>
            <p className="text-[#666666] leading-relaxed text-sm font-medium">
              Founded with the explicit goal of establishing unmatched transparency within real estate markets, we serve as the vital link connecting elite architectural concepts with eager residents.
            </p>
            <p className="text-[#666666] leading-relaxed text-sm font-medium">
              By applying data integrity analytics directly into asset assessments, customers retain absolute safety while sourcing prime locations across growing metropolitan hubs.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="border border-[#EAE6DF] rounded-2xl p-6 bg-[#FAF8F5]/30">
                <span className="block text-3xl font-display font-semibold text-[#7C5CFF]">10K+</span>
                <span className="block text-xs font-bold mt-1 text-[#1A1A1A]">Active Listings</span>
              </div>
              <div className="border border-[#EAE6DF] rounded-2xl p-6 bg-[#FAF8F5]/30">
                <span className="block text-3xl font-display font-semibold text-[#7C5CFF]">50+</span>
                <span className="block text-xs font-bold mt-1 text-[#1A1A1A]">Indian Cities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-display font-semibold tracking-tight">Meet Our Experts</h2>
          <p className="text-[#666666] text-xs font-semibold mt-2">Driven professionals navigating complex residential scopes.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: 'Anant Kamal', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400' },
            { name: 'Riya Sharma', role: 'Chief Architect', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
            { name: 'Rohit Verma', role: 'Head of Sales', image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400' },
            { name: 'Sarah Khan', role: 'Customer Success', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400' },
          ].map((member) => (
            <div key={member.name} className="group flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-[#EAE6DF] shadow-md transition-all group-hover:scale-[1.03] group-hover:border-[#7C5CFF] mb-4">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-base font-display font-semibold text-[#1A1A1A]">{member.name}</h3>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
