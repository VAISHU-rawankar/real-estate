import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact Us — Reach Out to Property Experts | RealEstate</title>
        <meta name="description" content="Have queries regarding residential or commercial properties? Get in touch with our certified real estate advisors today." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white text-[#1A1A1A]">
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-4 h-4 text-[#7C5CFF] font-extrabold">✦</span>
            <span className="text-[#7C5CFF] text-[10px] font-extrabold tracking-wider uppercase">GET IN TOUCH</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-4 text-navy-900">
            Contact Our Advisors
          </h1>
          <p className="text-[#666666] text-xs font-semibold leading-relaxed">
            Our specialized coordinators solve procedural logistics directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-stretch">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8 bg-[#FAF8F5]/30 border border-[#EAE6DF] rounded-[32px] p-8 md:p-10">
            <div>
              <h2 className="text-2xl font-display font-extrabold tracking-tight mb-6">Contact Channels</h2>
              <div className="space-y-6">
                {[
                  { icon: PhoneIcon, label: 'Speak to Experts', value: '+91 99999 88888', desc: 'Available Mon-Sat, 9AM - 7PM' },
                  { icon: EnvelopeIcon, label: 'Email Correspondence', value: 'hello@realestate.com', desc: '24 hour response SLA' },
                  { icon: MapPinIcon, label: 'Corporate Headquarters', value: '7th Floor, DLF Cyber City, Gurugram 122002', desc: 'Visit by appointment' },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-[#EAE6DF] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <item.icon className="w-5 h-5 text-[#7C5CFF]" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#1A1A1A]">{item.label}</p>
                      <p className="text-sm font-bold text-[#7C5CFF] mt-1">{item.value}</p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Google map iframe */}
            <div className="rounded-2xl overflow-hidden border border-[#EAE6DF] h-[200px] relative mt-6">
              <iframe 
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.2233913121413!2d77.08660007507301!3d28.487834791012975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1921935bf259%3A0xe7f9f30bf9f4af!2sDLF%20Cyber%20City%2C%20DLF%20Phase%202%2C%20Sector%2024%2C%20Gurugram%2C%20Haryana%20122022!5e0!3m2!1sen!2sin!4v1714421111111!5m2!1sen!2sin" 
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: Lead Form */}
          <div className="lg:col-span-7 bg-[#1A1A1A] text-white rounded-[32px] p-8 md:p-10 flex flex-col justify-center shadow-xl border border-white/5">
            <h2 className="text-2xl font-display font-extrabold tracking-tight mb-6">Send an Inquiry</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#7C5CFF] font-medium" placeholder="First Name" />
                <input className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#7C5CFF] font-medium" placeholder="Last Name" />
              </div>
              <input className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#7C5CFF] font-medium" placeholder="Your Phone Number" type="tel" />
              <input className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#7C5CFF] font-medium" placeholder="Email Address" type="email" />
              <textarea className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#7C5CFF] font-medium resize-none h-32" placeholder="Describe your requirement (Budget, BHK, Locality)..." />
              
              <button type="submit" className="w-full bg-[#7C5CFF] hover:bg-[#6D28D9] text-white text-xs font-bold py-3.5 rounded-full transition-all duration-300 shadow-md shadow-[#7C5CFF]/20 mt-2">
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
