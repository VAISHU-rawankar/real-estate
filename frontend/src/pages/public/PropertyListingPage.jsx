import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  AdjustmentsHorizontalIcon, 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  ChevronDownIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  AdjustmentsVerticalIcon,
  BuildingOfficeIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { useGetPropertiesQuery } from '@store/api/propertyApi';
import PropertyCard from '@components/property/PropertyCard';
import PropertyHero from '@components/property/PropertyHero';
import PropertyCardSkeleton from '@components/property/PropertyCardSkeleton';
import { 
  selectFilters, 
  setFilter, 
  clearFilter, 
  clearAllFilters, 
  setPage, 
  setFiltersFromURL, 
  selectActiveFilterCount 
} from '@store/slices/searchSlice';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const CATEGORIES = [
  { label: 'All Listings', key: 'propertyType', value: '', icon: AdjustmentsVerticalIcon },
  { label: 'Apartments', key: 'propertySubType', value: 'apartment', icon: BuildingOfficeIcon },
  { label: 'Villas', key: 'propertySubType', value: 'villa', icon: HomeIcon },
  { label: 'Commercial', key: 'propertyType', value: 'commercial', icon: BuildingOfficeIcon },
  { label: 'Residential', key: 'propertyType', value: 'residential', icon: HomeIcon },
  { label: 'Land & Plots', key: 'propertyType', value: 'plot', icon: MapPinIcon },
];

export default function PropertyListingPage() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const activeFilterCount = useSelector(selectActiveFilterCount);
  
  const [localLocation, setLocalLocation] = useState(filters.city || '');

  useEffect(() => {
    const urlFilters = {};
    for (const [key, value] of searchParams.entries()) {
      urlFilters[key] = value;
    }
    dispatch(setFiltersFromURL(urlFilters));
  }, [searchParams, dispatch]);

  const queryParams = {
    ...Object.fromEntries(
      Object.entries(filters).filter(([k, v]) => v !== '' && v !== false && !(Array.isArray(v) && v.length === 0) && !['viewMode', 'compareList'].includes(k))
    ),
  };

  const { data, isLoading, isFetching } = useGetPropertiesQuery(queryParams);
  const properties = data?.data || [];
  const meta = data?.meta || {};
  const loading = isLoading || isFetching;

  const handleApplyFilters = () => {
    dispatch(setFilter({ key: 'city', value: localLocation }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Properties — Handpicked Listings | RealEstate</title>
        <meta name="description" content="Browse our handpicked collection of verified properties." />
      </Helmet>

      <PropertyHero />

      <div className="bg-white min-h-screen pb-20 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* ─── Main Content Grid (Sidebar + List) ────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Side: Property Cards */}
            <div className="lg:col-span-9 order-2 lg:order-1">
              <div className="flex justify-between items-center mb-8">
                <p className="text-[14px] font-bold text-[#111111]">
                  <span className="text-[#7C5CFF]">{meta.total || properties.length}+</span> Properties Found
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Sort by:</span>
                  <div className="relative">
                    <select 
                      value={filters.sort || 'newest'}
                      onChange={(e) => dispatch(setFilter({ key: 'sort', value: e.target.value }))}
                      className="appearance-none bg-white border border-gray-100 rounded-2xl px-6 py-2.5 pr-10 text-[12px] font-bold text-[#111111] outline-none shadow-sm focus:border-gray-200"
                    >
                      {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[1,2,3,4,5,6].map(i => <PropertyCardSkeleton key={i} />)}
                </div>
              ) : properties.length === 0 ? (
                <div className="bg-white rounded-[40px] p-24 text-center border border-gray-50 shadow-sm">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MagnifyingGlassIcon className="w-8 h-8 text-gray-200" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#111111] mb-2 uppercase">No properties found</h3>
                  <p className="text-gray-400 font-medium max-w-xs mx-auto">Try adjusting your filters to find more properties matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {properties.map((p, i) => (
                    <PropertyCard key={p._id || i} property={p} index={i} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {meta.pages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-16">
                   <button className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:border-[#111111] hover:text-[#111111] transition-all shadow-sm">
                     ←
                   </button>
                   {[1,2,3,4,5,6,7,8,9,10].slice(0, meta.pages).map(p => (
                     <button 
                       key={p} 
                       onClick={() => dispatch(setPage(p))}
                       className={`w-12 h-12 rounded-full font-bold text-[13px] transition-all ${p === meta.page ? 'bg-[#4F46E5] text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200 shadow-sm'}`}
                     >
                       {p}
                     </button>
                   ))}
                   <button className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:border-[#111111] hover:text-[#111111] transition-all shadow-sm">
                     →
                   </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-3 order-1 lg:order-2 space-y-4 lg:sticky lg:top-24">
              <div className="bg-[#111111] rounded-[24px] p-4 shadow-2xl">
                <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2.5">
                  <h2 className="text-[11px] font-bold text-white uppercase tracking-[0.1em]">Filters</h2>
                  <button 
                    onClick={() => dispatch(clearAllFilters())}
                    className="text-[9px] font-bold text-gray-500 uppercase hover:text-white transition-colors tracking-widest"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Location Filter */}
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em]">Location</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="City..." 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-1.5 text-[11px] font-medium text-white placeholder:text-gray-600 outline-none focus:bg-white/10 transition-all"
                        value={localLocation}
                        onChange={(e) => setLocalLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Property Type Filter */}
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em]">Type</label>
                    <div className="relative">
                      <select 
                        value={filters.propertyType || ''}
                        onChange={(e) => dispatch(setFilter({ key: 'propertyType', value: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-1.5 text-[10px] font-bold text-white outline-none appearance-none cursor-pointer focus:bg-white/10 transition-all uppercase tracking-wider"
                      >
                        <option value="" className="bg-[#111111]">All Types</option>
                        <option value="apartment" className="bg-[#111111]">Apartments</option>
                        <option value="villa" className="bg-[#111111]">Villas</option>
                        <option value="commercial" className="bg-[#111111]">Commercial</option>
                      </select>
                      <ChevronDownIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em]">Budget</label>
                    <div className="px-1">
                      <div className="h-0.5 bg-white/10 rounded-full relative">
                        <div className="absolute left-0 right-0 h-full bg-white rounded-full" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md cursor-pointer" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md cursor-pointer" />
                      </div>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-gray-400">
                      <span>₹20 L</span>
                      <span>₹5 Cr+</span>
                    </div>
                  </div>

                  {/* Rooms Filters */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em]">Beds</label>
                      <div className="relative">
                        <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-1.5 text-[10px] font-bold text-white outline-none appearance-none cursor-pointer focus:bg-white/10">
                          <option className="bg-[#111111]">Any</option>
                          <option className="bg-[#111111]">1+</option>
                          <option className="bg-[#111111]">2+</option>
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em]">Baths</label>
                      <div className="relative">
                        <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-1.5 text-[10px] font-bold text-white outline-none appearance-none cursor-pointer focus:bg-white/10">
                          <option className="bg-[#111111]">Any</option>
                          <option className="bg-[#111111]">1+</option>
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleApplyFilters}
                    className="w-full bg-white hover:bg-gray-100 text-[#111111] font-bold py-2 rounded-lg transition-all text-[10px] uppercase tracking-widest active:scale-95"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>

              {/* Promo Card */}
              <div className="bg-[#111111] rounded-[24px] p-5 text-white relative overflow-hidden shadow-2xl group cursor-pointer aspect-square lg:aspect-auto h-52">
                <div className="absolute inset-0 opacity-40 group-hover:scale-110 transition-transform duration-1000">
                  <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070" className="w-full h-full object-cover" alt="" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="relative z-10 flex flex-col h-full justify-end">
                  <h3 className="text-lg font-display font-bold mb-1.5 uppercase tracking-tight">Rentals</h3>
                  <p className="text-gray-400 text-[10px] font-medium leading-relaxed mb-4 line-clamp-2">Expert rental support for your next home.</p>
                  <button className="bg-white text-[#111111] font-bold text-[9px] px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-all w-fit uppercase tracking-wider group-hover:gap-4">
                    Explore <ArrowRightIcon className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
