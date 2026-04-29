import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ShieldCheckIcon, MapPinIcon, StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { BuildingOfficeIcon, HomeIcon, MapIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useGetFeaturedPropertiesQuery } from '@store/api/propertyApi';
import PropertyCard from '@components/property/PropertyCard';
import HeroSearch from '@components/search/HeroSearch';
import PropertyCardSkeleton from '@components/property/PropertyCardSkeleton';

const STATS = [
  { label: 'Properties Listed', value: '10,000+' },
  { label: 'Cities Covered', value: '50+' },
  { label: 'Happy Customers', value: '25,000+' },
  { label: 'Verified Listings', value: '8,500+' },
];

const CATEGORIES = [
  { label: 'Apartments', icon: BuildingOfficeIcon, type: 'apartment', count: '3,200+' },
  { label: 'Villas', icon: HomeIcon, type: 'villa', count: '1,800+' },
  { label: 'Plots', icon: MapIcon, type: 'plot', count: '2,400+' },
  { label: 'Commercial', icon: BuildingOfficeIcon, type: 'commercial', count: '1,600+' },
];

const TESTIMONIALS = [
  { name: 'Rajesh Kumar', city: 'Mumbai', text: 'Found my dream apartment within 2 weeks. The verified listings and transparent process made everything seamless.', rating: 5 },
  { name: 'Priya Sharma', city: 'Pune', text: 'Exceptional service! The team helped us find a RERA-approved property that perfectly matched our budget.', rating: 5 },
  { name: 'Vikram Mehta', city: 'Bangalore', text: 'Best platform for commercial real estate. Professional, reliable, and comprehensive listings.', rating: 5 },
];

export default function HomePage() {
  const { data: featuredData, isLoading: featuredLoading } = useGetFeaturedPropertiesQuery(8);

  const featuredProperties = featuredData?.data || [];

  return (
    <>
      <Helmet>
        <title>RealEstate — Find Your Dream Property in India</title>
        <meta name="description" content="India's most trusted real estate platform. Browse 10,000+ verified properties across 50+ cities. Buy, sell, or rent homes, apartments, villas, and commercial spaces." />
      </Helmet>

      {/* ─── Hero ────────────────────────────────────────────────────── */}
      <section className="relative min-h-[680px] flex items-center">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-navy-900/70" />
          {/* Decorative gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
        </div>

        <div className="page-container relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-400 text-sm font-medium mb-6">
              <CheckBadgeIcon className="w-4 h-4" />
              India's Most Trusted Real Estate Platform
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-6">
              Find Your{' '}
              <span className="text-gradient-gold">Perfect</span>
              {' '}Property
            </h1>
            <p className="text-white/70 text-lg sm:text-xl mb-10 max-w-2xl">
              Search from 10,000+ verified properties across India. Buy, sell, or rent with confidence through our transparent, RERA-compliant platform.
            </p>

            {/* Search */}
            <HeroSearch />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="card-glass rounded-2xl px-5 py-4 text-center">
                <p className="text-2xl font-display font-bold text-gold-400">{stat.value}</p>
                <p className="text-white/60 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Categories ──────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle mx-auto">Explore properties that match your lifestyle and investment goals</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/properties?propertySubType=${cat.type}`}
                  className="group block card p-6 text-center hover-lift"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gold-50 flex items-center justify-center mb-4 group-hover:bg-gold-100 transition-colors">
                    <cat.icon className="w-7 h-7 text-gold-600" />
                  </div>
                  <h3 className="font-display font-semibold text-navy-900 mb-1">{cat.label}</h3>
                  <p className="text-slate-400 text-sm">{cat.count} listings</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Properties ──────────────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Properties</h2>
              <p className="section-subtitle">Handpicked premium listings across India</p>
            </div>
            <Link to="/properties?sort=featured" className="btn-outline btn-md hidden sm:flex gap-2 items-center">
              View All <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredLoading
              ? Array.from({ length: 8 }).map((_, i) => <PropertyCardSkeleton key={i} />)
              : featuredProperties.map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)
            }
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link to="/properties" className="btn-primary btn-lg inline-flex">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Why Us ──────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-subtitle mx-auto">Built on trust, transparency and technology</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: CheckBadgeIcon, title: 'RERA Verified Listings', desc: 'Every listing is checked against RERA registry. Buy with complete legal confidence.', color: 'bg-emerald-50 text-emerald-600' },
              { icon: ShieldCheckIcon, title: 'Zero Brokerage', desc: 'Direct contact with owners and builders. No hidden charges or surprise fees.', color: 'bg-blue-50 text-blue-600' },
              { icon: PhoneIcon, title: '24/7 Expert Support', desc: 'Dedicated relationship managers assist you at every step from search to registration.', color: 'bg-gold-50 text-gold-600' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl ${item.color} flex items-center justify-center mb-5`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-display font-semibold text-xl text-navy-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────────── */}
      <section className="py-16 bg-navy-900">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-white mb-3">What Our Customers Say</h2>
            <p className="text-white/50">Join 25,000+ happy property owners across India</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-glass rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <StarIcon key={j} className="w-4 h-4 text-gold-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-gold-500/10 via-white to-gold-500/5">
        <div className="page-container text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title mb-4">Ready to Find Your Dream Home?</h2>
            <p className="section-subtitle mx-auto mb-10">
              Start your journey with India's most trusted real estate platform. Free registration, no hidden fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/properties" className="btn-primary btn-lg">
                Browse Properties
              </Link>
              <Link to="/contact" className="btn-outline btn-lg">
                Talk to an Expert
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
