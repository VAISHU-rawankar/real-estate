import React from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  ChevronDownIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
  ArrowsPointingOutIcon,
  ArrowRightIcon,
  AdjustmentsVerticalIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { selectFilters, setFilter } from '@store/slices/searchSlice';

const PropertyHero = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const floatingCardVariants = (index) => ({
    hidden: { opacity: 0, scale: 0.8, x: index % 2 === 0 ? 50 : -50, rotate: index % 2 === 0 ? 5 : -5 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      x: 0, 
      rotate: index % 2 === 0 ? 2 : -2,
      transition: { duration: 0.8, delay: 0.4 + (index * 0.2), ease: "backOut" } 
    },
    hover: { 
      y: -10, 
      scale: 1.05, 
      rotate: 0,
      transition: { duration: 0.3 } 
    }
  });

  return (
    <section className="relative bg-[#F7F7F9] h-[650px] flex items-center pt-24 pb-12 overflow-hidden">
      {/* Full-Bleed Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070" 
          className="w-full h-full object-cover" 
          alt="" 
        />
        {/* Lighter, Sharper Premium Overlay */}
        <div className="absolute inset-0 bg-white/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* LEFT SIDE: CONTENT */}
          <motion.div 
            className="lg:w-[65%]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6">
              <span className="text-[#7C5CFF] text-lg">✦</span>
              <span className="text-[#7C5CFF] text-[11px] font-bold tracking-[0.2em] uppercase">HANDPICKED LISTINGS</span>
            </motion.div>
            {/* Heading */}
            <motion.h1 variants={itemVariants} className="text-[44px] md:text-[56px] lg:text-[72px] font-display font-semibold text-[#000000] leading-[1.0] mb-6 uppercase tracking-tight w-full whitespace-nowrap">
              Find spaces that fit <br /> your life perfectly.
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={itemVariants} className="text-gray-600 text-[16px] md:text-[18px] font-medium max-w-xl mb-8 leading-relaxed">
              Explore verified properties for sale or rent in top locations with the best deals.
            </motion.p>

            {/* INTEGRATED SEARCH & TOGGLE */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col md:flex-row items-center gap-4 relative z-20 group max-w-4xl mb-12"
            >
              {/* Toggle Buttons */}
              <div className="flex bg-[#000000] p-1.5 rounded-full border border-[#111111] flex-shrink-0">
                <button 
                  onClick={() => dispatch(setFilter({ key: 'listingType', value: 'sale' }))}
                  className={`px-6 py-2.5 rounded-full text-[12px] font-bold transition-all duration-300 ${filters.listingType === 'sale' ? 'bg-white text-[#000000] shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Buy
                </button>
                <button 
                  onClick={() => dispatch(setFilter({ key: 'listingType', value: 'rent' }))}
                  className={`px-6 py-2.5 rounded-full text-[12px] font-bold transition-all duration-300 ${filters.listingType === 'rent' ? 'bg-white text-[#000000] shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Rent
                </button>
              </div>

              {/* Search Bar */}
              <div className="bg-white rounded-full p-1.5 flex flex-col md:flex-row items-center gap-1 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_15px_45px_rgba(124,92,255,0.08)] transition-all duration-500 flex-1">
                {/* Location */}
                <div className="flex-1 flex items-center gap-3 px-4 h-[44px]">
                  <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="City or locality..." 
                    className="bg-transparent text-[13px] font-semibold placeholder:text-gray-300 outline-none border-none ring-0 focus:ring-0 w-full text-[#111111]"
                    value={filters.city || ''}
                    onChange={(e) => dispatch(setFilter({ key: 'city', value: e.target.value }))}
                  />
                </div>

                <div className="hidden md:block w-px h-6 bg-gray-100" />

                {/* Property Type */}
                <div className="relative px-4 h-[44px] flex items-center min-w-[120px]">
                  <select 
                    className="appearance-none bg-transparent text-[12px] font-bold text-[#111111] outline-none border-none ring-0 focus:ring-0 pr-6 cursor-pointer uppercase tracking-wider w-full"
                    value={filters.propertyType || ''}
                    onChange={(e) => dispatch(setFilter({ key: 'propertyType', value: e.target.value }))}
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartments</option>
                    <option value="villa">Villas</option>
                    <option value="commercial">Commercial</option>
                    <option value="residential">Residential</option>
                    <option value="plot">Land & Plots</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>

                <div className="hidden md:block w-px h-6 bg-gray-100" />

                {/* Budget */}
                <div className="relative px-4 h-[44px] flex items-center min-w-[120px]">
                  <select className="appearance-none bg-transparent text-[12px] font-bold text-[#111111] outline-none border-none ring-0 focus:ring-0 pr-6 cursor-pointer uppercase tracking-wider w-full">
                    <option>Min - Max</option>
                    <option>₹20L - ₹50L</option>
                    <option>₹50L - ₹1Cr</option>
                    <option>₹1Cr - ₹5Cr</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>

                {/* Search Button */}
                <button className="w-[44px] h-[44px] bg-[#111111] text-white flex items-center justify-center rounded-full flex-shrink-0 hover:bg-[#000000] hover:scale-105 transition-all duration-300 shadow-lg active:scale-95">
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
 
          {/* RIGHT SIDE: CARDS */}
          <div className="lg:w-[35%] flex flex-col md:flex-row items-center justify-center gap-8 relative">
            {/* Card 1 */}
            <motion.div 
              variants={floatingCardVariants(0)}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white rounded-[24px] p-4 shadow-[0_30px_60px_rgba(0,0,0,0.06)] w-full md:w-[300px] border border-gray-100/50 cursor-pointer relative z-10"
            >
              <div className="relative rounded-[16px] overflow-hidden mb-4 h-[160px]">
                <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800" className="w-full h-full object-cover" alt="" />
                <div className="absolute top-3 left-3 bg-[#7C5CFF] text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                  FOR SALE
                </div>
              </div>
              
              <div className="px-1">
                <h3 className="text-[16px] font-bold text-[#111111] mb-1 leading-tight">Luxury 3BHK Apartment</h3>
                <p className="text-gray-400 text-[11px] font-medium flex items-center gap-1 mb-4">
                  <MapPinIcon className="w-3 h-3 text-[#7C5CFF]" /> Koramangala, Bengaluru
                </p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Configuration</span>
                    <span className="text-[12px] font-bold text-[#111111]">3BHK Units</span>
                  </div>
                  <div className="w-px h-6 bg-gray-100" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Area</span>
                    <span className="text-[12px] font-bold text-[#111111]">1,850 sqft</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-4 mb-1">
                  <span className="text-[11px] font-bold text-gray-400">Starting Price</span>
                  <p className="text-[#111111] font-extrabold text-[18px]">₹1.52 Cr*</p>
                </div>
                
                <button className="w-full mt-4 py-3 rounded-xl bg-[#111111] text-[11px] font-bold text-white hover:bg-[#7C5CFF] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm">
                  View Details <ArrowRightIcon className="w-3 h-3" />
                </button>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              variants={floatingCardVariants(1)}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white rounded-[24px] p-4 shadow-[0_30px_60px_rgba(0,0,0,0.06)] w-full md:w-[300px] border border-gray-100/50 cursor-pointer relative z-0 md:-ml-12 md:mt-16"
            >
              <div className="relative rounded-[16px] overflow-hidden mb-4 h-[160px]">
                <img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=800" className="w-full h-full object-cover" alt="" />
                <div className="absolute top-3 left-3 bg-[#A78BFA] text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                  FOR RENT
                </div>
              </div>
              
              <div className="px-1">
                <h3 className="text-[16px] font-bold text-[#111111] mb-1 leading-tight">Modern Studio Flat</h3>
                <p className="text-gray-400 text-[11px] font-medium flex items-center gap-1 mb-4">
                  <MapPinIcon className="w-3 h-3 text-[#A78BFA]" /> Indiranagar, Bengaluru
                </p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Type</span>
                    <span className="text-[12px] font-bold text-[#111111]">1BHK Studio</span>
                  </div>
                  <div className="w-px h-6 bg-gray-100" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Area</span>
                    <span className="text-[12px] font-bold text-[#111111]">650 sqft</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-4 mb-1">
                  <span className="text-[11px] font-bold text-gray-400">Monthly Rent</span>
                  <p className="text-[#111111] font-extrabold text-[18px]">₹85,000</p>
                </div>
                
                <button className="w-full mt-4 py-3 rounded-xl border border-gray-100 text-[11px] font-bold text-[#111111] hover:bg-[#7C5CFF] hover:text-white hover:border-[#7C5CFF] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm">
                  View Details <ArrowRightIcon className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PropertyHero;
