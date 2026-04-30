import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  ChevronDownIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  CalendarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useCreateEnquiryMutation } from '@store/api/leadApi';
import { showToast } from '@store/slices/uiSlice';

const CONTACT_METHODS = [
  { 
    title: 'Call Us', 
    value: '+91 98765 43210', 
    desc: 'Mon - Sat, 9:00 AM - 7:00 PM', 
    icon: PhoneIcon 
  },
  { 
    title: 'Email Us', 
    value: 'hello@realestatepro.com', 
    desc: 'We reply within 24 hours', 
    icon: EnvelopeIcon 
  },
  { 
    title: 'Visit Us', 
    value: 'Sector 62, Noida, UP', 
    desc: 'Business Park, 201301', 
    icon: MapPinIcon 
  },
  { 
    title: 'Meeting', 
    value: 'Schedule Consultation', 
    desc: 'with our experts', 
    icon: CalendarIcon 
  },
];

const FAQS = [
  { q: 'How can I list my property?', a: 'You can list your property by creating an account and navigating to the "Post Property" section in your dashboard.' },
  { q: 'Are the properties verified?', a: 'Yes, every property listed on our platform undergoes a multi-step verification process by our expert team.' },
  { q: 'Is there any booking or hidden fee?', a: 'No, we believe in complete transparency. There are no hidden fees or extra charges beyond what is mentioned.' },
  { q: 'How can I schedule a site visit?', a: 'Once you find a property you like, click on "Contact Expert" or call our helpline to coordinate a convenient time for a visit.' },
  { q: 'How can I contact customer support?', a: 'You can reach us via the contact form on this page, email us directly, or call our support helpline.' },
];

export default function ContactPage() {
  const dispatch = useDispatch();
  const [activeFaq, setActiveFaq] = useState(null);
  const [createEnquiry, { isLoading }] = useCreateEnquiryMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return dispatch(showToast({ type: 'error', message: 'Please fill all required fields' }));
    }

    try {
      await createEnquiry({
        name: formData.name,
        email: formData.email,
        phone: 'Not provided',
        propertyId: null,
        message: `${formData.subject ? `[${formData.subject}] ` : ''}${formData.message}`
      }).unwrap();

      dispatch(showToast({ type: 'success', message: 'Message sent! Admin will review it shortly.' }));
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      dispatch(showToast({ type: 'error', message: err.data?.message || 'Failed to send message' }));
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — Reach Out to Property Experts | RealEstate</title>
        <meta name="description" content="Have queries regarding residential or commercial properties? Get in touch with our certified real estate advisors today." />
      </Helmet>

      <div className="bg-white min-h-screen pt-4 md:pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Hero Section */}
          <div className="max-w-6xl mx-auto text-center mb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[#7C5CFF] text-[10px] font-bold tracking-widest uppercase mb-4 block">CONTACT US</span>
              <h1 className="text-[42px] sm:text-[54px] lg:text-[72px] font-display font-semibold tracking-tight leading-[0.95] text-[#111111] uppercase mb-8 whitespace-nowrap">
                We'd love to hear from you.
              </h1>
              <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
                Have a question or need assistance? Our team is here to help you find the perfect property. Get in touch with us today.
              </p>
            </motion.div>
          </div>

          {/* Form & Map Section (Boxed Form over Full Background Image) */}
          <section className="py-5 md:pt-6 md:pb-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-2xl relative z-10 min-h-[550px] flex flex-col">
              
              <div className="relative flex-grow group">
                {/* Background Image - Full Section */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070" 
                    className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105"
                    alt="Property background"
                  />
                </div>

                <div className="relative z-10 w-full px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  
                  {/* Left: Boxed Form (Solid White) */}
                  <div className="lg:col-span-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-[32px] shadow-2xl border border-white/20"
                    >
                      <span className="inline-block px-4 py-1 rounded-full bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 text-[#7C5CFF] text-[10px] font-bold tracking-widest uppercase mb-6">
                        GET IN TOUCH
                      </span>
                      <h2 className="text-3xl md:text-4xl font-display font-semibold text-[#111111] leading-tight mb-8 uppercase">
                        Let's start a <br /> conversation.
                      </h2>
                      
                      <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            placeholder="Your Name"
                            required
                            className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-[#111111] focus:outline-none focus:border-[#7C5CFF] focus:bg-white transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                          <input 
                            type="email" 
                            placeholder="Email Address"
                            required
                            className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-[#111111] focus:outline-none focus:border-[#7C5CFF] focus:bg-white transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Subject"
                          required
                          className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-[#111111] focus:outline-none focus:border-[#7C5CFF] focus:bg-white transition-all"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                        <textarea 
                          rows={3} 
                          placeholder="Tell us about your project..."
                          required
                          className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-[#111111] focus:outline-none focus:border-[#7C5CFF] focus:bg-white transition-all resize-none"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                        <button 
                          type="submit" 
                          disabled={isLoading}
                          className="w-full md:w-auto px-10 py-4 bg-[#111111] hover:bg-black text-white font-bold rounded-full transition-all shadow-xl flex items-center justify-center gap-3 group"
                        >
                          <span>{isLoading ? 'Sending...' : 'Send Message'}</span>
                          <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </form>
                    </motion.div>
                  </div>

                  {/* Right: Floating Map Card */}
                  <div className="lg:col-span-6 flex justify-center lg:justify-end">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="w-full max-w-sm bg-white/90 backdrop-blur-md border border-white/20 rounded-[32px] p-2 shadow-2xl"
                    >
                      <div className="rounded-[28px] overflow-hidden h-[280px] relative">
                         <iframe 
                            title="office-location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.56201026042!2d77.3614216!3d28.6129124!2m3!1f0!2f0!3f0!3m2!i1024!2i768!4f13.1!3m3!1m2!1s0x390ce56193740941%3A0xc03a303883a3038!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1714470000000!5m2!1sen!2sin" 
                            className="w-full h-full border-none"
                            allowFullScreen="" 
                            loading="lazy" 
                         />
                      </div>
                      <div className="p-5 text-center">
                        <h4 className="text-lg font-bold text-[#111111] mb-1">Visit Our Office</h4>
                        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider">Sector 62, Noida, UP 201301</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Combined Bottom Info Bar */}
              <div className="border-t border-gray-100 px-8 md:px-12 py-8 bg-white/95 backdrop-blur-sm relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {CONTACT_METHODS.map((method, idx) => (
                    <motion.div
                      key={method.title}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#7C5CFF] group-hover:border-transparent transition-all shadow-sm">
                        <method.icon className="w-4 h-4 text-[#111111]/60 group-hover:text-white" />
                      </div>
                      <div>
                        <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{method.title}</h3>
                        <p className="text-[13px] font-display font-bold text-[#111111]">{method.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <div className="mb-24">
             <div className="text-center mb-16">
               <span className="text-[#7C5CFF] text-[10px] font-bold tracking-widest uppercase mb-3 block">FAQ</span>
               <h2 className="text-4xl font-display font-bold text-[#111111] mb-3">Frequently Asked Questions</h2>
               <p className="text-gray-400 text-sm font-semibold">Here are some common questions we get asked.</p>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
               <div className="lg:col-span-7 space-y-5">
                 {FAQS.map((faq, idx) => (
                   <div key={idx} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                     <button 
                       onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                       className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                     >
                       <span className="text-base font-bold text-[#111111]">{faq.q}</span>
                       <PlusIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeFaq === idx ? 'rotate-45 text-[#7C5CFF]' : ''}`} />
                     </button>
                     <AnimatePresence>
                       {activeFaq === idx && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           transition={{ duration: 0.3 }}
                           className="px-8 pb-6"
                         >
                           <p className="text-sm text-gray-500 leading-relaxed font-medium">{faq.a}</p>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 ))}
               </div>
               <div className="lg:col-span-5 relative rounded-[40px] overflow-hidden shadow-xl aspect-[4/3] lg:aspect-auto lg:h-[460px]">
                 <img 
                   src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070" 
                   alt="Modern house architecture" 
                   className="w-full h-full object-cover"
                 />
               </div>
             </div>
          </div>

          {/* Final CTA Section */}
          <div className="bg-[#111111] rounded-[48px] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-40">
              <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974" className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            </div>
            
            <div className="relative z-10 max-w-xl">
              <span className="text-[#7C5CFF] text-[10px] font-bold tracking-widest uppercase mb-4 block">READY TO GET STARTED?</span>
              <h2 className="text-[32px] sm:text-[42px] font-display font-bold text-white mb-6 leading-tight">Let's find your <br /> dream home together.</h2>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">Our experts are here to help you every step of the way.</p>
            </div>
            <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
              <Link to="/properties" className="flex-1 md:flex-none inline-flex items-center justify-center px-10 py-4.5 bg-[#111111] text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg shadow-black/10">
                Browse Properties →
              </Link>
              <button className="flex-1 md:flex-none inline-flex items-center justify-center px-10 py-4.5 bg-white/5 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/10 transition-all text-white">
                Talk to an Expert
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
