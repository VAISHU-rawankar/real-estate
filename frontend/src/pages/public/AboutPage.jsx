import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  UsersIcon, 
  MapIcon, 
  CheckCircleIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  ChatBubbleLeftRightIcon,
  RocketLaunchIcon,
  ArrowRightIcon,
  PlayIcon,
  GlobeAltIcon,
  LightBulbIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const STATS = [
  { label: 'Properties', value: '10,000+', desc: 'Verified & Listed', icon: BuildingOfficeIcon },
  { label: 'Happy Customers', value: '25,000+', desc: 'Across India', icon: UsersIcon },
  { label: 'Cities', value: '50+', desc: 'Wide Coverage', icon: MapIcon },
  { label: 'Satisfaction Rate', value: '98%', desc: 'From Our Clients', icon: CheckCircleIcon },
];

const FEATURES = [
  { title: 'Verified Listings', desc: 'Every property is verified for authenticity and accuracy.', icon: ShieldCheckIcon },
  { title: 'No Hidden Fees', desc: 'What you see is what you pay. Complete transparency.', icon: BanknotesIcon },
  { title: 'Expert Guidance', desc: 'Our real estate experts help you make the right decision.', icon: ChatBubbleLeftRightIcon },
  { title: 'Fast & Easy Process', desc: 'Seamless property search and hassle-free experience.', icon: RocketLaunchIcon },
];

const TEAM = [
  { name: 'Rohit Sharma', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', linkedin: '#' },
  { name: 'Priya Mehta', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', linkedin: '#' },
  { name: 'Ankit Verma', role: 'Head of Sales', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', linkedin: '#' },
  { name: 'Neha Kapoor', role: 'Head of Marketing', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', linkedin: '#' },
];

const VALUES = [
  { title: 'Our Mission', desc: 'To empower people to find, buy, and rent homes with trust, transparency, and ease.', icon: RocketLaunchIcon },
  { title: 'Our Vision', desc: "To become India's most trusted real estate platform, driven by innovation.", icon: GlobeAltIcon },
  { title: 'Our Values', desc: 'Transparency, Trust, Customer First, and Commitment to Excellence.', icon: LightBulbIcon },
];

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us — Our Story & Mission | RealEstate</title>
        <meta name="description" content="Discover our journey, mission, and the dedicated team behind India's most trusted real estate platform." />
      </Helmet>

      <div className="bg-white min-h-screen pb-24 overflow-hidden">
        {/* ─── 1. HERO SECTION (Full-Width Background) ────────────────────────────── */}
        <section className="relative overflow-hidden mb-24 min-h-[600px] flex items-start">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070" 
              className="w-full h-full object-cover"
              alt="Modern luxury house"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent md:via-white/85" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-10 pb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl"
            >
              <span className="text-[#7C5CFF] text-[11px] font-display font-bold tracking-[0.2em] uppercase mb-6 block">ABOUT US</span>
              <h1 className="text-[42px] sm:text-[54px] lg:text-[72px] font-display font-semibold leading-[0.95] text-[#111111] mb-10 uppercase tracking-tight">
                Building <br /> 
                more than properties. <br />
                We build trust.
              </h1>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-12 max-w-xl font-medium">
                RealEstatePro is a modern real estate platform dedicated to helping people find, buy, and rent properties with confidence.
              </p>
              
              <div className="flex flex-wrap items-center gap-6">
                <Link 
                  to="/properties" 
                  className="px-12 py-5 bg-[#111111] text-white font-bold rounded-2xl hover:bg-black transition-all shadow-2xl shadow-black/20 text-sm group flex items-center"
                >
                  Explore Properties 
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

          {/* ─── 2. STATS OVERLAY CARD ────────────────────────────────────────────── */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[40px] p-8 md:p-12 shadow-card-hover border border-gray-50 flex flex-wrap justify-between gap-8 mb-32 relative z-10"
          >
            {STATS.map((stat, idx) => (
              <div key={stat.label} className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-[#7C5CFF] group-hover:bg-[#7C5CFF] group-hover:text-white transition-all duration-300">
                  <stat.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-display font-bold text-[#111111]">{stat.value}</p>
                  <p className="text-[10px] font-display font-bold text-[#111111] uppercase tracking-widest mb-0.5">{stat.label}</p>
                  <p className="text-[10px] text-gray-400 font-semibold">{stat.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* ─── 3. OUR STORY SECTION ───────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
             <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-[40px] overflow-hidden shadow-xl aspect-square"
            >
              <img 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070" 
                alt="Modern living room" 
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#7C5CFF] text-[11px] font-bold tracking-[0.2em] uppercase mb-4 block">OUR STORY</span>
              <h2 className="text-4xl sm:text-[48px] font-display font-bold text-[#111111] leading-[1.1] mb-8 uppercase">
                A better way to <br /> find your home
              </h2>
              <div className="space-y-6 text-gray-500 text-base leading-relaxed mb-12 font-medium">
                <p>
                  We started with a simple mission — to make real estate transparent, smarter, and hassle-free. Our journey began when we realized how difficult it was to find reliable property information.
                </p>
                <p>
                  Through technology and trusted partnerships, we bring you the best properties with complete clarity and support at every step. We don't just list properties, <span className="text-[#7C5CFF] font-bold">we build relationships.</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {VALUES.map((v) => (
                  <div key={v.title} className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#7C5CFF]">
                       <v.icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-display font-bold text-[#111111] text-sm">{v.title}</h4>
                    <p className="text-[12px] text-gray-400 leading-snug font-medium">{v.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>



          {/* ─── 5. TEAM SECTION ─────────────────────────────────────────────────── */}
          <section className="mb-32">
            <div className="text-center mb-16">
              <span className="text-[#7C5CFF] text-[11px] font-bold tracking-[0.2em] uppercase mb-4 block">MEET OUR TEAM</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-[#111111] uppercase">The people behind RealEstate Pro</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {TEAM.map((member, idx) => (
                <motion.div 
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="bg-white border border-gray-100 rounded-[40px] p-6 text-center transition-all duration-300 hover:shadow-xl hover:border-transparent">
                    <div className="w-full aspect-square rounded-[32px] overflow-hidden mb-8 relative">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-[#7C5CFF]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-[#111111] mb-1">{member.name}</h3>
                    <p className="text-[11px] text-gray-400 font-display font-bold uppercase tracking-widest mb-6">{member.role}</p>
                    
                    <div className="flex justify-center gap-3">
                      <a href={member.linkedin} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-purple-50 hover:text-[#7C5CFF] transition-all">
                        <span className="text-sm font-bold italic">in</span>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-purple-50 hover:text-[#7C5CFF] transition-all">
                        <span className="text-sm font-bold">𝕏</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>


          {/* Final CTA Section */}
          <div className="bg-[#111111] rounded-[48px] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-40">
              <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974" className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            </div>
            
            <div className="relative z-10 max-w-xl">
              <span className="text-[#7C5CFF] text-[10px] font-bold tracking-widest uppercase mb-4 block">READY TO GET STARTED?</span>
              <h2 className="text-[32px] sm:text-[42px] font-display font-bold text-white mb-6 leading-tight uppercase">Let's find your <br /> dream home together.</h2>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">Our experts are here to help you every step of the way.</p>
            </div>
            <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
              <Link to="/properties" className="flex-1 md:flex-none inline-flex items-center justify-center px-10 py-4.5 bg-[#111111] text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg shadow-black/10">
                Browse Properties →
              </Link>
              <Link to="/contact" className="flex-1 md:flex-none inline-flex items-center justify-center px-10 py-4.5 bg-white/5 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/10 transition-all text-white">
                Talk to an Expert
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
