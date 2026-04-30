import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRightIcon, 
  CalendarIcon, 
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

import { BLOG_POSTS } from '@/data/blogData';

const FEATURED_POST = BLOG_POSTS[0];
const SIDEBAR_POSTS = BLOG_POSTS.slice(1, 5);
const LATEST_ARTICLES = BLOG_POSTS.slice(5, 9);

export default function BlogPage() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Blog & Insights — RealEstate Pro</title>
        <meta name="description" content="Expert real estate advice, market trends, and property investment tips." />
      </Helmet>

      <div className="bg-white min-h-screen">
        {/* ─── Page Hero Section (Dark & Architectural) ─────────────────── */}
        <section className="relative bg-[#111111] h-[500px] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" 
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-110 group-hover:scale-100 transition-transform duration-[3000ms]" 
              alt="Architecture" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 w-full pt-16">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
              <div className="max-w-3xl">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-white/60 text-[11px] font-bold tracking-[0.3em] uppercase mb-6 block"
                >
                  Insights & Intelligence
                </motion.span>
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[48px] sm:text-[64px] lg:text-[80px] font-display font-bold tracking-tight leading-[0.9] text-white uppercase"
                >
                  Expert Real <br /> 
                  Estate Advice
                </motion.h1>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-md lg:pb-4"
              >
                <p className="text-gray-400 text-[15px] leading-relaxed mb-8 font-medium">
                  Stay ahead of the market with our deep dives into industry trends, investment strategies, and home-buying guides. 
                  Authoritative research, delivered weekly.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-[#111111] object-cover" alt="" />
                    ))}
                  </div>
                  <p className="text-[11px] font-bold text-white uppercase tracking-wider">Join 10,000+ Readers</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-24">
          
          {/* ─── Featured & Sidebar Section ────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
            {/* Featured Post */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/blog/${FEATURED_POST.slug}`)}
              className="lg:col-span-8 relative h-[600px] rounded-[32px] overflow-hidden group cursor-pointer shadow-2xl bg-black"
            >
              <img 
                src={FEATURED_POST.image} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80" 
                alt="" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              <div className="absolute top-10 left-10">
                <span className="bg-white text-black text-[10px] font-bold px-5 py-2.5 rounded-full uppercase tracking-widest shadow-xl">
                  Featured
                </span>
              </div>

              <div className="absolute bottom-12 left-12 right-12">
                <span className="text-white/60 text-[11px] font-bold uppercase tracking-[0.3em] mb-4 block">
                  {FEATURED_POST.category}
                </span>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 max-w-2xl leading-[1.1] uppercase tracking-tight">
                  {FEATURED_POST.title}
                </h2>
                
                <div className="flex items-center gap-5">
                  <img src={FEATURED_POST.author.image} className="w-12 h-12 rounded-full object-cover border-2 border-white/20" alt="" />
                  <div className="text-white">
                    <p className="text-[14px] font-bold">{FEATURED_POST.author.name}</p>
                    <p className="text-[11px] text-white/60 font-medium uppercase tracking-wider">{FEATURED_POST.date} • {FEATURED_POST.readTime}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar Posts */}
            <div className="lg:col-span-4 space-y-10">
              <h2 className="text-[12px] font-bold text-black uppercase tracking-[0.2em] mb-4 border-b border-gray-100 pb-4">Top Stories</h2>
              {SIDEBAR_POSTS.map((post, idx) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  className="flex gap-6 group cursor-pointer"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-sm bg-gray-100">
                    <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" alt="" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                      {post.category}
                    </span>
                    <h3 className="text-[15px] font-bold text-[#111111] leading-tight mb-2 group-hover:text-black transition-colors uppercase tracking-tight">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                      <span>{post.date}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ─── Latest Articles Grid ───────────────────────────────────────── */}
          <div className="mb-32">
            <div className="flex justify-between items-center mb-16 border-b border-gray-100 pb-8">
              <h2 className="text-3xl font-display font-bold text-[#111111] uppercase tracking-tight">Latest Intelligence</h2>
              <button className="flex items-center gap-3 text-black text-[12px] font-bold uppercase tracking-widest hover:gap-5 transition-all group">
                Archive <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {LATEST_ARTICLES.map((article, idx) => (
                <motion.div 
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => navigate(`/blog/${article.slug}`)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/5] rounded-[24px] overflow-hidden mb-6 shadow-lg group-hover:shadow-2xl transition-all bg-gray-100">
                    <img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                  </div>
                  <span className="text-black/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block">
                    {article.category}
                  </span>
                  <h3 className="text-[17px] font-bold text-[#111111] mb-4 leading-[1.2] group-hover:text-black transition-colors uppercase tracking-tight">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>{article.date}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ─── Newsletter Section (Premium Black) ────────────────────────── */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-[#111111] rounded-[32px] p-12 lg:p-20 relative overflow-hidden shadow-2xl"
          >
            {/* Architectural Grid Background */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="max-w-xl text-center lg:text-left">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mb-6 block">Intelligence Report</span>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 uppercase tracking-tight leading-[0.95]">
                  The Future of <br /> Real Estate, <br /> In Your Inbox.
                </h2>
                <p className="text-gray-400 text-[16px] font-medium leading-relaxed max-w-sm">
                  Subscribe to receive exclusive market analysis and investment opportunities before they hit the general market.
                </p>
              </div>

              <div className="w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <input 
                    type="email" 
                    placeholder="ENTER YOUR EMAIL" 
                    className="bg-white/5 border border-white/10 rounded-xl px-8 py-5 text-white placeholder:text-white/20 outline-none focus:bg-white/10 focus:border-white/20 transition-all min-w-[320px] font-bold text-[12px] tracking-widest uppercase"
                  />
                  <button className="bg-white hover:bg-gray-100 text-black px-12 py-5 rounded-xl font-bold text-[12px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95">
                    Subscribe
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-4 h-4 text-white/20" />
                    Zero Spam
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-4 h-4 text-white/20" />
                    Unsubscribe Anytime
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
}
