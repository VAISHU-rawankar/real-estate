import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { 
  ArrowRightIcon, 
  StarIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  PhoneIcon
} from '@heroicons/react/24/solid';
import { 
  BuildingOfficeIcon, 
  HomeIcon, 
  MapIcon,
  UsersIcon,
  ArrowUpRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
  HeartIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useGetFeaturedPropertiesQuery, useGetPropertiesQuery } from '@store/api/propertyApi';
import { useGetCmsContentQuery } from '@store/api/cmsApi';
import PropertyCard from '@components/property/PropertyCard';
import HeroSearch from '@components/search/HeroSearch';
import PropertyCardSkeleton from '@components/property/PropertyCardSkeleton';

const STATS = [
  { label: 'Properties Listed', value: '10,000+' },
  { label: 'Cities Covered', value: '50+', dark: true },
  { label: 'Happy Customers', value: '25,000+' },
  { label: 'Verified Listings', value: '8,500+' },
];

const CATEGORIES = [
  { 
    label: 'Apartments', 
    type: 'apartment', 
    desc: 'Perfect blend of comfort, style, and urban accessibility for professionals and families.', 
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070' 
  },
  { 
    label: 'Villas', 
    type: 'villa', 
    desc: 'Experience pure luxury, wide green environments, and spacious architectural setups.', 
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070' 
  },
  { 
    label: 'Plots', 
    type: 'plot', 
    desc: 'Invest securely and build your tailored architecture right from scratch.', 
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074' 
  },
  { 
    label: 'Commercial', 
    type: 'commercial', 
    desc: 'Strategic locations engineered seamlessly for optimal customer conversion footprints.', 
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073' 
  },
];

const TESTIMONIALS_ROW1 = [
  { name: 'Sophie Moore', role: 'Head of marketing', text: 'Found my dream apartment within 2 weeks. The verified listings made everything seamless.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120' },
  { name: 'Sophie More', role: 'CTO of Lambda', text: 'I love how user-friendly this app is! It\'s so easy to find RERA-approved properties.', rating: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=120' },
  { name: 'Adam Gwadyr', role: 'Entrepreneur', text: 'This app has saved me so much time and stress! Professional, reliable, and smooth.', rating: 5, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120' },
  { name: 'Annie Deway', role: 'Designer', text: 'Intuitive and customizable. Direct contact with owners helps avoid surprise brokerage fees.', rating: 5, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120' },
];

const TESTIMONIALS_ROW2 = [
  { name: 'Michel O Neill', role: 'Head of Sales', text: 'I don\'t know how I ever lived without this app! I love how I can filter properties.', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120' },
  { name: 'Bard De Costa', role: 'Investor', text: 'Virtual tours saved me so much time. Great platform for exploring commercial spaces.', rating: 5, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120' },
  { name: 'Ella Moridin', role: 'Product designer', text: 'Highly recommended to all my friends! Best platform to negotiate property deals.', rating: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120' },
  { name: 'Mary Cath', role: 'Solo-Entrepreneur', text: 'Simple yet so powerful. Managing listings and inquiries is an absolute breeze.', rating: 5, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=120' },
];

const TESTIMONIALS_ROW3 = [
  { name: 'Johana Smith', role: 'Founder', text: 'Makes it easy for me to stay on top of the real estate market. Truly exceptional service.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120' },
  { name: 'Vikram Mehta', role: 'Bangalore', text: 'Comprehensive data listings help map prices. No hidden agendas or inflated quotes.', rating: 5, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120' },
  { name: 'Rajesh Kumar', role: 'Mumbai', text: 'Unmatched customer responsiveness. The RERA legal checks gave me immense reassurance.', rating: 5, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120' },
  { name: 'Neha Gupta', role: 'Delhi', text: 'Fast onboarding and clean layouts. Highly recommend the rental support agents.', rating: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120' },
];

const WHY_US = [
  { icon: CheckBadgeIcon, title: 'RERA Verified Listings', desc: 'Every listing is checked against RERA registry. Buy with complete legal confidence.' },
  { icon: ShieldCheckIcon, title: 'Zero Brokerage', desc: 'Direct contact with owners and builders. No hidden charges or surprise fees.' },
  { icon: PhoneIcon, title: '24/7 Expert Support', desc: 'Dedicated relationship managers assist you at every step from search to registration.' },
];

// Constant mappings for filters and sorts
const EXPLORE_CATEGORY_FILTERS = {
  'All Listings': {},
  'Apartments': { propertySubType: 'apartment' },
  'Luxury': { isFeatured: true },
  'Villas': { propertySubType: 'villa' },
  'Commercial': { propertyType: 'commercial' },
  'Newly-built': { ageOfProperty: 'new' },
  'Rentals': { listingType: 'rent' },
  'Residential': { propertyType: 'residential' },
  'Land & Plots': { propertyType: 'plot' }
};

const RECENT_CATEGORY_FILTERS = {
  'All': {},
  'Residential': { propertyType: 'residential' },
  'Commercial': { propertyType: 'commercial' },
  'Plots': { propertyType: 'plot' }
};

const RECENT_SORT_MAPPING = {
  'Newest First': 'newest',
  'Price: Low to High': 'price-asc',
  'Price: High to Low': 'price-desc'
};

export default function HomePage() {
  const { data: featuredData, isLoading: featuredLoading } = useGetFeaturedPropertiesQuery(12);
  const featuredPropertiesRaw = featuredData?.data || [];
  const featuredProperties = [...featuredPropertiesRaw].sort((a, b) => {
    const aHasImg = a.images && a.images.length > 0 && a.images[0]?.url;
    const bHasImg = b.images && b.images.length > 0 && b.images[0]?.url;
    if (aHasImg && !bHasImg) return -1;
    if (!aHasImg && bHasImg) return 1;
    return 0;
  });

  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Listings');
  const [searchType, setSearchType] = useState('sale');
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(1);
  const [recentCategory, setRecentCategory] = useState('All');
  const [recentSort, setRecentSort] = useState('Newest First');
  const [searchPropType, setSearchPropType] = useState('');

  // Fetch CMS Content
  const { data: cmsDataRaw } = useGetCmsContentQuery('home');
  const cmsContent = cmsDataRaw?.data?.home || {};
  const heroContent = cmsContent?.hero?.content || {};

  // Dynamic Queries with memoized params
  const exploreParams = React.useMemo(() => ({
    ...EXPLORE_CATEGORY_FILTERS[selectedCategory],
    limit: 4,
    sort: 'newest'
  }), [selectedCategory]);

  const { data: exploreData, isLoading: exploreLoading } = useGetPropertiesQuery(exploreParams);

  const recentParams = React.useMemo(() => ({
    ...RECENT_CATEGORY_FILTERS[recentCategory],
    sort: RECENT_SORT_MAPPING[recentSort],
    limit: 6
  }), [recentCategory, recentSort]);

  const { data: recentSectionData, isLoading: recentSectionLoading } = useGetPropertiesQuery(recentParams);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    let query = `?listingType=${searchType}`;
    if (searchKeyword.trim()) query += `&keyword=${encodeURIComponent(searchKeyword.trim())}`;
    if (searchPropType) query += `&propertyType=${searchPropType}`;
    navigate(`/properties${query}`);
  };

  return (
    <div className="bg-[#FAF8F5] text-[#1A1A1A] font-sans antialiased overflow-x-hidden">
      <Helmet>
        <title>NestQuest — Find Your Dream Home</title>
        <meta name="description" content="Welcome to NestQuest, where luxury meets lifestyle. Search for the perfect home that suits your budget." />
      </Helmet>      {/* ─── Hero Section (First Fold) ─────────────────────────────────── */}
      <section className="bg-white pt-2 md:pt-4 pb-4 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-14 mb-6">
          {/* Left: Massive Heading */}
          <div className="lg:flex-[1.2]">
            <h1 className="text-[42px] sm:text-[54px] lg:text-[72px] font-display font-semibold tracking-tight leading-[0.95] text-[#111111] uppercase" dangerouslySetInnerHTML={{ __html: heroContent.title || 'Find Your <br /> Perfect Home' }} />
          </div>

          {/* Right: Integrated Search Unit */}
          <div className="lg:flex-[0.8] flex flex-col gap-4">
            <p className="text-[#666666] text-[15px] leading-relaxed max-w-md">
              {heroContent.description || 'We offer over 10,000 apartments for every request. You are guaranteed to be able to find an apartment that suits you.'}
            </p>
            
            <div className="flex flex-col gap-1.5">
              {/* Buy/Rent Toggle */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSearchType('sale')}
                  className={`px-5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 ${
                    searchType === 'sale' 
                      ? 'bg-[#111111] text-white shadow-lg' 
                      : 'bg-white border border-[#EAE6DF] text-[#666666] hover:text-[#111111] hover:border-[#111111]'
                  }`}
                >
                  Buy
                </button>
                <button 
                  onClick={() => setSearchType('rent')}
                  className={`px-5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 ${
                    searchType === 'rent' 
                      ? 'bg-[#111111] text-white shadow-lg' 
                      : 'bg-white border border-[#EAE6DF] text-[#666666] hover:text-[#111111] hover:border-[#111111]'
                  }`}
                >
                  Rent
                </button>
              </div>

              {/* Precise Search Box */}
              <form onSubmit={handleHeroSearch} className="w-full bg-white border border-[#EAE6DF] rounded-[14px] overflow-hidden shadow-sm p-0.5 flex items-center gap-1.5">
                <div className="flex-1 flex items-center gap-3 px-3">
                  <MagnifyingGlassIcon className="w-3.5 h-3.5 text-[#999999]" />
                  <input 
                    type="text" 
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="City or locality..."
                    className="w-full bg-transparent border-0 outline-0 text-[12px] font-medium placeholder:text-[#999999] text-[#111111] py-1.5"
                  />
                </div>
                
                <div className="h-5 w-px bg-[#EAE6DF] hidden sm:block" />
                
                <div className="relative hidden sm:block">
                  <select 
                    value={searchPropType}
                    onChange={(e) => setSearchPropType(e.target.value)}
                    className="bg-transparent text-[11px] font-bold border-0 outline-0 text-[#111111] px-4 py-1.5 cursor-pointer appearance-none pr-8"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-[#111111] pointer-events-none" />
                </div>

                <button 
                  type="submit" 
                  className="w-9 h-9 rounded-[9px] bg-[#111111] hover:bg-black text-white flex items-center justify-center transition-all flex-shrink-0 active:scale-95 shadow-md"
                >
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Hero Image Container */}
        <div className="max-w-7xl mx-auto relative px-0">
          <div className="relative rounded-[40px] overflow-hidden min-h-[300px] lg:h-[480px] border border-gray-50 shadow-2xl">
            <img 
              src={heroContent.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"} 
              alt="Luxury modern architectural residence" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
            />
          </div>
        </div>
      </section>

      {/* ─── Second Fold: Explore & Discover Section ────────────────────────────── */}
      <section className="pt-4 md:pt-6 pb-8 md:pb-10 bg-[#FAF8F5]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Top Row: Heading and Description */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-4 h-4 text-[#7C5CFF] font-semibold">⊞</span>
                <span className="text-[#7C5CFF] text-xxs font-semibold tracking-wider uppercase">HANDPICKED LISTINGS</span>
              </div>
              <h2 className="text-3xl sm:text-[44px] font-display font-semibold text-[#1A1A1A] leading-[1.1] uppercase">
                Explore Apartments and Homes for Sale
              </h2>
              <p className="text-gray-400 text-xs font-semibold mt-2">Discover premium properties in the best locations.</p>
            </div>
            <div className="flex flex-col md:items-end gap-3">
              <p className="text-[#666666] text-xs max-w-xs md:text-right font-medium leading-relaxed">
                Each listing offers exceptional quality, unique features, and prime locations.
              </p>
              <Link 
                to="/properties" 
                className="inline-flex items-center gap-2 bg-[#13131A] hover:bg-[#1A1A24] text-white font-bold text-xs px-6 py-3 rounded-full transition-all duration-300 shadow-md"
              >
                <span>View All Properties</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2.5 mb-4 overflow-x-auto pb-2 scrollbar-none">
            {[
              { label: 'All Listings', filter: {} },
              { label: 'Apartments', filter: { propertySubType: 'apartment' } },
              { label: 'Luxury', filter: { isFeatured: true } },
              { label: 'Villas', filter: { propertySubType: 'villa' } },
              { label: 'Commercial', filter: { propertyType: 'commercial' } },
              { label: 'Newly-built', filter: { ageOfProperty: 'new' } },
              { label: 'Rentals', filter: { listingType: 'rent' } },
              { label: 'Residential', filter: { propertyType: 'residential' } },
              { label: 'Land & Plots', filter: { propertyType: 'plot' } },
            ].map((pill) => {
              const isSel = selectedCategory === pill.label;
              return (
                <button
                  key={pill.label}
                  onClick={() => {
                    setSelectedCategory(pill.label);
                  }}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap border ${
                    isSel 
                      ? 'bg-[#7C5CFF] text-white border-transparent shadow-md shadow-[#7C5CFF]/20' 
                      : 'bg-white text-[#666666] border-gray-100 hover:border-gray-300 hover:text-[#1A1A1A]'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          {/* Dynamic Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {exploreLoading ? (
              Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            ) : exploreData?.data?.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-200">
                <BuildingOfficeIcon className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">No {selectedCategory.toLowerCase()} available at the moment.</p>
              </div>
            ) : (
              exploreData?.data?.map((p, i) => (
                <PropertyCard key={p._id} property={p} index={i} />
              ))
            )}
          </div>
        </div>
      </section>



      {/* ─── Stats Section ──────────────────────────────────────────── */}
      <section className="py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-[30px] overflow-hidden h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070" 
              alt="Luxury Home" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl sm:text-5xl font-display font-semibold tracking-tight text-[#1A1A1A] leading-[1.1] mb-4 uppercase">
              Your Trusted Real <br /> Estate Advisors
            </h2>
            <p className="text-[#666666] mb-12 max-w-md text-sm leading-relaxed">
              Browse 10,000+ verified properties across 50+ cities. Buy, sell, or rent homes, apartments, villas, and commercial spaces.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {STATS.map((stat) => (
                <div 
                  key={stat.label} 
                  className={`p-8 rounded-[24px] shadow-sm hover:shadow-md transition-all duration-300 ${stat.dark ? 'bg-[#1A1A1A] text-white' : 'bg-white border border-[#EAE6DF]'}`}
                >
                  <p className="text-4xl font-display font-bold tracking-tight mb-2">{stat.value}</p>
                  <p className={`text-xs font-semibold tracking-wide uppercase ${stat.dark ? 'text-white/70' : 'text-[#666666]'}`}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Categories Section ───────────────────────────────────────── */}
      <section className="py-10 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Search & Messaging */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <div className="flex items-center gap-2 bg-[#F3E8FF] text-[#6B21A8] text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              <HomeIcon className="w-4 h-4" />
              <span>10,000+ Homes Available</span>
            </div>
            
            <h2 className="text-5xl sm:text-6xl font-display font-semibold tracking-tight text-[#1A1A1A] leading-[0.95] mb-6 uppercase">
              Find Your <br /> Perfect Home
            </h2>
            
            <p className="text-[#666666] text-sm font-medium mb-8 max-w-md leading-relaxed">
              We offer over 10,000 apartments for every request. You are guaranteed to find a home that suits you.
            </p>

            {/* Toggle Buy / Rent */}
            <div className="flex items-center bg-[#FAF8F5] border border-[#EAE6DF] rounded-full p-1 mb-6 gap-2">
              <button 
                onClick={() => setSearchType('sale')}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${searchType === 'sale' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-[#666666] hover:text-[#1A1A1A]'}`}
              >
                Buy
              </button>
              <button 
                onClick={() => setSearchType('rent')}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${searchType === 'rent' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-[#666666] hover:text-[#1A1A1A]'}`}
              >
                Rent
              </button>
            </div>

            {/* Inline search box */}
            <form onSubmit={handleHeroSearch} className="w-full max-w-md flex items-center bg-[#FAF8F5] border border-[#EAE6DF] rounded-2xl overflow-hidden shadow-sm p-1.5 gap-2">
              <div className="flex-1 flex items-center gap-2 px-3">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="City or locality..."
                  className="w-full bg-transparent border-0 outline-0 text-sm placeholder:text-[#999999] text-[#1A1A1A]"
                />
              </div>
              
              <select 
                value={searchPropType}
                onChange={(e) => setSearchPropType(e.target.value)}
                className="bg-transparent text-xs font-bold border-0 outline-0 text-[#1A1A1A] px-2 cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
              </select>

              <button 
                type="submit" 
                className="w-10 h-10 rounded-xl bg-[#1A1A1A] hover:bg-[#333333] text-white flex items-center justify-center transition-colors flex-shrink-0"
              >
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4 w-full">
            {CATEGORIES.map((cat, i) => {
              const isActive = activeCategoryIdx === i;
              
              return (
                <div 
                  key={cat.label}
                  onMouseEnter={() => setActiveCategoryIdx(i)}
                  onClick={() => setActiveCategoryIdx(i)}
                  className={`relative border border-[#EAE6DF] rounded-[24px] overflow-hidden transition-all duration-500 ease-in-out cursor-pointer shadow-sm hover:shadow-md ${isActive ? 'bg-white h-[220px] border-2 border-[#FAF8F5] shadow-md' : 'bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] h-[100px]'}`}
                >
                  {/* Expanded Content View (Fades in when active) */}
                  <div className={`absolute inset-0 p-8 flex flex-row items-center justify-between transition-opacity duration-500 ease-in-out ${isActive ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}>
                    <div className="flex flex-col items-start max-w-[55%]">
                      <div className="w-10 h-10 rounded-full bg-[#F3E8FF] text-[#6B21A8] flex items-center justify-center mb-3">
                        <HomeIcon className="w-5 h-5" />
                      </div>
                      <h3 className="text-2xl font-display font-semibold text-[#1A1A1A] mb-2">{cat.label}</h3>
                      <p className="text-[#666666] text-xs leading-relaxed mb-4">{cat.desc}</p>
                      <Link 
                        to={`/properties?propertySubType=${cat.type}&listingType=${searchType}`}
                        className="inline-flex items-center gap-1 text-[#6B21A8] text-xs font-bold hover:underline"
                      >
                        Explore {cat.label} <ArrowRightIcon className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="absolute top-0 right-0 bottom-0 left-[45%] overflow-hidden rounded-l-[50px]">
                      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
                      <img 
                        src={cat.image} 
                        alt={cat.label} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Collapsed Content View (Fades in when inactive) */}
                  <div className={`absolute inset-0 p-4 flex flex-row items-center justify-between transition-opacity duration-500 ease-in-out ${!isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'}`}>
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-white text-[#1A1A1A] flex items-center justify-center shadow-sm flex-shrink-0">
                        <BuildingOfficeIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#1A1A1A]">{cat.label}</h3>
                        <p className="text-[#666666] text-xs mt-0.5 truncate max-w-[250px]">{cat.desc}</p>
                      </div>
                    </div>

                    <div className="relative h-full w-[150px] overflow-hidden rounded-l-[30px] flex items-center justify-end">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] to-transparent z-10" />
                      <img 
                        src={cat.image} 
                        alt={cat.label} 
                        className="w-full h-full object-cover opacity-60" 
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-[#1A1A1A] flex items-center justify-center shadow-sm z-20">
                        <ArrowRightIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>



      {/* ─── Recently Added Listings Section ────────────────────────── */}
      <section className="py-10 md:py-12 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 bg-[#0B0B0F] rounded-2xl p-2 sm:p-4 border border-[#1F1F2A] shadow-2xl relative z-10">
          
          {/* Upper Split Hero Block */}
          <div className="relative w-full rounded-2xl overflow-hidden min-h-[210px] flex items-center mb-6 border border-white/5 group shadow-inner">
            {/* Background Image */}
            <img 
              src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070" 
              alt="Recently Added" 
              className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-[2000ms]"
            />
            {/* Dark Overlay Left */}
            <div className="absolute inset-y-0 left-0 w-full md:w-3/5 bg-gradient-to-r from-[#0B0B0F] via-[#0B0B0F]/90 to-transparent z-10" />

            {/* Left Content */}
            <div className="relative z-20 p-5 md:p-8 max-w-xl">
              <span className="text-[#7C5CFF] text-xs font-semibold tracking-wider uppercase bg-[#7C5CFF]/10 px-3 py-1 rounded-full border border-[#7C5CFF]/20">
                JUST IN
              </span>
              <h2 className="text-3xl md:text-[42px] font-display font-semibold tracking-tight text-white leading-[1.1] mt-4 mb-4 uppercase">
                Recently Added <br /> Properties
              </h2>
              <p className="text-gray-400 text-sm font-medium mb-4 max-w-sm leading-relaxed">
                Explore the latest residential and commercial spaces added today.
              </p>
              <Link 
                to="/properties" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7C5CFF] to-[#A855F7] hover:from-[#6D28D9] hover:to-[#9333EA] text-white font-bold text-xs px-6 py-3 rounded-full transition-all duration-300 shadow-lg shadow-[#7C5CFF]/25 hover:shadow-[#7C5CFF]/40 hover:scale-[1.02]"
              >
                <span>Browse All Listings</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            {/* Floating 10k+ Badge */}
            <div className="absolute bottom-4 right-4 bg-[#13131A]/70 backdrop-blur-md text-white p-4 rounded-xl shadow-xl flex flex-col items-start gap-1.5 max-w-[160px] z-20 border border-white/10 hidden md:flex hover:bg-[#13131A]/90 transition-all duration-300">
              <div className="w-7 h-7 rounded-full bg-[#7C5CFF]/20 flex items-center justify-center border border-[#7C5CFF]/30">
                <HomeIcon className="w-3.5 h-3.5 text-[#7C5CFF]" />
              </div>
              <span className="text-2xl font-display font-semibold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">10,000+</span>
              <span className="text-gray-400 text-[9px] font-semibold leading-relaxed">New listings added every month</span>
            </div>
          </div>

          {/* Filter and Sorting Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/5 pb-4 mb-6">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'All' },
                { label: 'Residential' },
                { label: 'Commercial' },
                { label: 'Plots' },
              ].map((pill) => {
                const isSel = recentCategory === pill.label;
                return (
                  <button
                    key={pill.label}
                    onClick={() => setRecentCategory(pill.label)}
                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${
                      isSel 
                        ? 'bg-gradient-to-r from-[#7C5CFF] to-[#A855F7] text-white border-transparent shadow-lg shadow-[#7C5CFF]/30' 
                        : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end md:self-auto text-white">
              <span className="text-xs font-semibold text-gray-500">Sort by:</span>
              <select
                value={recentSort}
                onChange={(e) => setRecentSort(e.target.value)}
                className="bg-white/5 border border-white/5 text-xs font-bold text-gray-300 px-4 py-2.5 rounded-full cursor-pointer focus:outline-none focus:border-[#7C5CFF]/50 shadow-sm transition-colors duration-300 hover:bg-white/10"
              >
                <option value="Newest First">Newest First</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
            {recentSectionLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/5 rounded-[20px] h-[240px] animate-pulse border border-white/5" />
              ))
            ) : recentSectionData?.data?.length === 0 ? (
              <div className="col-span-full py-10 text-center text-gray-500 italic">
                No recent listings found for this category.
              </div>
            ) : (
              recentSectionData?.data?.map((p) => (
                <Link 
                  key={p._id} 
                  to={`/properties/${p.slug}`}
                  className="bg-white rounded-[20px] overflow-hidden shadow-xl flex flex-col border border-gray-100 hover:-translate-y-2 hover:shadow-2xl group transition-all duration-500"
                >
                  {/* Top half: Image */}
                  <div className="h-[120px] relative overflow-hidden">
                    <img 
                      src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=600'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt="" 
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {p.listingType}
                    </div>
                  </div>

                  {/* Bottom half: Content */}
                  <div className="p-3.5 flex flex-col flex-1 justify-between text-[#0B0B0F]">
                    <div>
                      <span className="text-sm font-display font-semibold leading-tight text-[#0B0B0F] group-hover:text-[#7C5CFF] transition-colors duration-300">
                        {p.formattedPrice || `₹${p.price?.toLocaleString('en-IN')}`}
                      </span>
                      <h3 className="text-[10px] font-bold truncate mt-1 text-[#1A1A1A]">
                        {p.title}
                      </h3>
                      <p className="text-[9px] text-gray-500 flex items-center gap-1 mt-1 font-medium truncate">
                        <span className="text-[#7C5CFF]">📍</span>
                        <span>{p.location?.city || 'India'}</span>
                      </p>
                    </div>

                    <div className="border-t border-gray-100 pt-2 mt-3 flex items-center text-[9px] text-gray-600 font-semibold justify-between">
                      <span>{p.carpetArea ? `${p.carpetArea} sqft` : '—'}</span>
                      <span>{p.bhkConfig || p.propertyType}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

        </div>
      </section>



      {/* ─── Expert Services Section ────────────────────────────────── */}
      <section className="py-10 md:py-12 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
            <h2 className="text-4xl sm:text-5xl font-display font-semibold text-[#1A1A1A] leading-tight max-w-4xl uppercase tracking-tight">
              Expert Services for <br />
              Buyers, Sellers, and Investors
            </h2>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 max-w-md lg:justify-end">
              {['Commercial', 'Property', 'House', 'Store', 'Apartments'].map((tag) => (
                <span 
                  key={tag} 
                  className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase border transition-all duration-300 cursor-default ${
                    tag === 'Property' 
                      ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-md' 
                      : 'bg-white border-[#EAE6DF] text-[#666666] hover:border-[#7C5CFF] hover:text-[#7C5CFF]'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {/* Column 1 (Buy a home) */}
            <div className="flex flex-col gap-4">
              <div className="rounded-[24px] overflow-hidden aspect-[16/10] w-full shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600" 
                  alt="Modern House with pool" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold text-[#1A1A1A] mb-1">Buy a home</h3>
                <p className="text-[#666666] text-xs leading-relaxed mb-3">
                  Find your place with an immersive photo experience and the most listings, including
                </p>
                <Link 
                  to="/properties?listingType=sale" 
                  className="inline-flex items-center gap-1 bg-[#FAF8F5] hover:bg-[#EAE6DF] border border-[#EAE6DF] text-[#1A1A1A] text-[10px] font-bold px-4 py-2 rounded-full transition-colors shadow-sm"
                >
                  View Details <ArrowUpRightIcon className="w-3.5 h-3.5 text-gray-500" />
                </Link>
              </div>
            </div>

            {/* Column 2 (Selling a home) */}
            <div className="flex flex-col-reverse md:flex-col gap-4 md:pb-6">
              <div>
                <h3 className="text-xl font-display font-semibold text-[#1A1A1A] mb-1">Selling a home</h3>
                <p className="text-[#666666] text-xs leading-relaxed mb-3">
                  No matter what path you take to sell your home, we can help you navigate a successful sale.
                </p>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-1 bg-[#FAF8F5] hover:bg-[#EAE6DF] border border-[#EAE6DF] text-[#1A1A1A] text-[10px] font-bold px-4 py-2 rounded-full transition-colors shadow-sm"
                >
                  View Details <ArrowUpRightIcon className="w-3.5 h-3.5 text-gray-500" />
                </Link>
              </div>
              <div className="rounded-[24px] overflow-hidden aspect-[16/10] w-full shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600" 
                  alt="Luxury Villa" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Column 3 (Rent a home) */}
            <div className="flex flex-col gap-4">
              <div className="relative rounded-[24px] overflow-hidden aspect-[16/10] w-full shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600" 
                  alt="Smart Home" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap gap-1">
                  {['Smart Home', 'Property'].map((tag, idx) => (
                    <span key={idx} className="bg-black/40 backdrop-blur-sm text-white text-[8px] font-medium px-1.5 py-0.5 rounded shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold text-[#1A1A1A] mb-1">Rent a home</h3>
                <p className="text-[#666666] text-xs leading-relaxed mb-3">
                  We're creating a seamless online experience – from shopping on the largest rental network
                </p>
                <Link 
                  to="/properties?listingType=rent" 
                  className="inline-flex items-center gap-1 bg-[#5A3825] hover:bg-[#4A2E1F] text-white text-[10px] font-bold px-4 py-2 rounded-full transition-colors shadow-md"
                >
                  View Details <ArrowUpRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials Section ───────────────────────────────────── */}
      <section className="py-10 md:py-12 bg-[#FAF8F5]/30 overflow-hidden w-screen relative left-1/2 -translate-x-1/2">
        <style>{`
          @keyframes marqueeLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marqueeRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-marquee-left {
            animation: marqueeLeft 35s linear infinite;
          }
          .animate-marquee-right {
            animation: marqueeRight 40s linear infinite;
          }
          .animate-marquee-left:hover, .animate-marquee-right:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center mb-16">
          <div className="inline-flex items-center bg-[#FAF8F5] border border-[#EAE6DF] rounded-full px-5 py-1.5 text-xs font-bold text-[#1A1A1A] mb-4 shadow-sm">
            They already love our products 😍
          </div>
          <h2 className="text-4xl sm:text-[52px] font-display font-semibold text-[#1A1A1A] tracking-tight leading-[1.1] uppercase">
            See what our users say about us
          </h2>
        </div>

        <div className="flex flex-col gap-0 max-w-[100vw]">
          {/* Row 1: Left moving */}
          <div className="relative flex overflow-hidden">
            <div className="flex gap-0 animate-marquee-left whitespace-nowrap py-0">
              {[...TESTIMONIALS_ROW1, ...TESTIMONIALS_ROW1].map((t, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[24px] border border-[#EAE6DF] shadow-sm w-[380px] flex-shrink-0 flex flex-col justify-between hover:border-[#8C6D45]/40 hover:shadow-md transition-all duration-300">
                  <div>
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <StarIcon key={j} className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                      ))}
                    </div>
                    <p className="text-sm text-[#1A1A1A] leading-relaxed mb-6 font-medium whitespace-normal">
                      "{t.text}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 mt-auto">
                    <div className="flex items-center gap-3">
                      <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-[#EAE6DF]" />
                      <span className="font-bold text-sm text-[#1A1A1A]">{t.name}</span>
                    </div>
                    <span className="text-xs text-[#666666] font-semibold">{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Right moving */}
          <div className="relative flex overflow-hidden">
            <div className="flex gap-0 animate-marquee-right whitespace-nowrap py-0">
              {[...TESTIMONIALS_ROW2, ...TESTIMONIALS_ROW2].map((t, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[24px] border border-[#EAE6DF] shadow-sm w-[380px] flex-shrink-0 flex flex-col justify-between hover:border-[#8C6D45]/40 hover:shadow-md transition-all duration-300">
                  <div>
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <StarIcon key={j} className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                      ))}
                    </div>
                    <p className="text-sm text-[#1A1A1A] leading-relaxed mb-6 font-medium whitespace-normal">
                      "{t.text}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 mt-auto">
                    <div className="flex items-center gap-3">
                      <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-[#EAE6DF]" />
                      <span className="font-bold text-sm text-[#1A1A1A]">{t.name}</span>
                    </div>
                    <span className="text-xs text-[#666666] font-semibold">{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA / Contact Section ────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-12 py-10 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto bg-[#0B0B0F] rounded-2xl overflow-hidden relative border border-[#1F1F2A] shadow-2xl flex items-center min-h-[350px]">
          {/* Background Image */}
          <img 
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070" 
            alt="Dream Home CTA" 
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-y-0 left-0 w-full md:w-3/5 bg-gradient-to-r from-[#0B0B0F] via-[#0B0B0F]/90 to-transparent z-10" />

          {/* Content */}
          <div className="relative z-20 p-6 md:p-12 max-w-xl text-left">
            <h2 className="text-3xl md:text-[42px] font-display font-semibold tracking-tight text-white leading-[1.1] mb-4 uppercase">
              Ready to Find Your <br />
              <span className="text-[#7C5CFF]">Dream Home?</span>
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm font-medium leading-relaxed mb-8 max-w-sm">
              Start your journey with India's most trusted real estate platform. Free registration, no hidden fees.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link 
                to="/properties" 
                className="bg-gradient-to-r from-[#7C5CFF] to-[#A855F7] hover:from-[#6D28D9] hover:to-[#9333EA] text-white font-bold text-xs px-7 py-3.5 rounded-full transition-all duration-300 shadow-lg shadow-[#7C5CFF]/25 hover:shadow-[#7C5CFF]/40 hover:scale-[1.02]"
              >
                Browse Properties
              </Link>
              <Link 
                to="/contact" 
                className="border border-white/20 hover:border-white/40 text-white font-bold text-xs px-7 py-3.5 rounded-full hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
