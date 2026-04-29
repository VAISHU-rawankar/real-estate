import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  return (
    <>
      <Helmet><title>Contact Us — RealEstate</title></Helmet>
      <div className="page-container py-20">
        <h1 className="section-title text-center mb-4">Get in Touch</h1>
        <p className="section-subtitle mx-auto text-center mb-12">Our property experts are here to help you find your perfect home.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-6">
            {[
              { icon: PhoneIcon, label: 'Call Us', value: '+91 98765 43210' },
              { icon: EnvelopeIcon, label: 'Email', value: 'hello@realestate.com' },
              { icon: MapPinIcon, label: 'Office', value: '123, Bandra West, Mumbai 400050' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-gold-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
                  <p className="text-navy-900 font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card p-8">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input className="input-base" placeholder="Your Name" />
              <input className="input-base" type="email" placeholder="Email Address" />
              <input className="input-base" type="tel" placeholder="Phone Number" />
              <textarea className="input-base h-32 resize-none" placeholder="Your message..." />
              <button type="submit" className="btn-primary btn-md w-full">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
