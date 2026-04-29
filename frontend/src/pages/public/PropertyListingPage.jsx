import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AdjustmentsHorizontalIcon, Squares2X2Icon, ListBulletIcon, FunnelIcon, MapIcon } from '@heroicons/react/24/outline';
import { useGetPropertiesQuery } from '@store/api/propertyApi';
import PropertyCard from '@components/property/PropertyCard';
import PropertyCardSkeleton from '@components/property/PropertyCardSkeleton';
import { selectFilters, setFilter, clearFilter, clearAllFilters, setPage, setViewMode, setFiltersFromURL, selectActiveFilterCount, clearCompare, removeFromCompare } from '@store/slices/searchSlice';
import { toggleFilterDrawer } from '@store/slices/uiSlice';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'most-viewed', label: 'Most Popular' },
];

export default function PropertyListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const activeFilterCount = useSelector(selectActiveFilterCount);

  // Sync URL → Redux on mount
  useEffect(() => {
    const urlFilters = {};
    for (const [key, value] of searchParams.entries()) {
      urlFilters[key] = value;
    }
    dispatch(setFiltersFromURL(urlFilters));
  }, []);

  const queryParams = {
    ...Object.fromEntries(
      Object.entries(filters).filter(([k, v]) => v !== '' && v !== false && !(Array.isArray(v) && v.length === 0) && !['viewMode', 'compareList'].includes(k))
    ),
  };

  const { data, isLoading, isFetching } = useGetPropertiesQuery(queryParams);
  const properties = data?.data || [];
  const meta = data?.meta || {};
  const loading = isLoading || isFetching;

  const handleSortChange = (e) => {
    dispatch(setFilter({ key: 'sort', value: e.target.value }));
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Properties — Browse All Listings | RealEstate</title>
        <meta name="description" content="Browse thousands of verified properties. Filter by location, type, price, and amenities." />
      </Helmet>

      <div className="page-container py-8">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-4 h-4 text-[#7C5CFF] font-extrabold">✦</span>
              <span className="text-[#7C5CFF] text-[10px] font-extrabold tracking-wider uppercase">HANDPICKED LISTINGS</span>
            </div>
            <h1 className="text-3xl sm:text-[44px] font-display font-extrabold text-[#1A1A1A] leading-[1.1]">
              Explore Apartments and <br /> Homes for Sale
            </h1>
            <p className="text-gray-400 text-xs font-semibold mt-2">Discover premium properties in the best locations.</p>
          </div>
          <div className="flex flex-col md:items-end gap-3">
            <p className="text-[#666666] text-xs max-w-xs md:text-right font-medium leading-relaxed">
              Each listing offers exceptional quality, unique features, and prime locations.
            </p>
            <button 
              onClick={() => dispatch(clearAllFilters())}
              className="inline-flex items-center gap-2 bg-[#13131A] hover:bg-[#1A1A24] text-white font-bold text-xs px-6 py-3 rounded-full transition-all duration-300 shadow-md"
            >
              <span>View All Properties</span>
              <span className="text-white">→</span>
            </button>
          </div>
        </div>

        {/* 1st Filter Row: Buy/Rent toggle, Search, All Types, Filters box */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white border border-[#EAE6DF] rounded-[24px] p-4 shadow-sm items-center">
          {/* Buy/Rent Toggle */}
          <div className="flex bg-[#FAF8F5] border border-[#EAE6DF] rounded-full p-1 w-full md:w-auto">
            <button 
              onClick={() => dispatch(setFilter({ key: 'listingType', value: 'sale' }))}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${filters.listingType === 'sale' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-[#666666] hover:text-[#1A1A1A]'}`}
            >
              Buy
            </button>
            <button 
              onClick={() => dispatch(setFilter({ key: 'listingType', value: 'rent' }))}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${filters.listingType === 'rent' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-[#666666] hover:text-[#1A1A1A]'}`}
            >
              Rent
            </button>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2 border border-[#EAE6DF] rounded-full px-4 py-2 flex-1 w-full bg-[#FAF8F5]/30">
            <span className="text-[#666666]">🔍</span>
            <input 
              type="text" 
              placeholder="City or locality..." 
              value={filters.city || ''}
              onChange={(e) => dispatch(setFilter({ key: 'city', value: e.target.value }))}
              className="bg-transparent text-xs font-semibold text-[#1A1A1A] placeholder-gray-400 focus:outline-none w-full"
            />
          </div>

          {/* All Types Dropdown */}
          <select 
            value={filters.propertyType || ''}
            onChange={(e) => dispatch(setFilter({ key: 'propertyType', value: e.target.value }))}
            className="border border-[#EAE6DF] bg-white rounded-full px-6 py-3 text-xs font-bold text-[#1A1A1A] focus:outline-none cursor-pointer w-full md:w-48 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%231A1A1A%22%20stroke-width%3D%222%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_1.5rem_center] bg-no-repeat"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartments</option>
            <option value="villa">Villas</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land & Plots</option>
          </select>

          {/* Filter Drawer Toggle (Black square) */}
          <button 
            onClick={() => dispatch(toggleFilterDrawer())}
            className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white p-3 rounded-2xl flex items-center justify-center transition-colors flex-shrink-0"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 2nd Filter Row: Pill Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-12 overflow-x-auto pb-2 scrollbar-none">
          {[
            { label: 'All Listings', value: '' },
            { label: 'Apartments', value: 'apartment' },
            { label: 'Villas', value: 'villa' },
            { label: 'Commercial', value: 'commercial' },
            { label: 'Residential', value: 'residential' },
            { label: 'Land & Plots', value: 'land' },
          ].map((pill) => {
            const isSel = filters.propertyType === pill.value;
            return (
              <button
                key={pill.label}
                onClick={() => dispatch(setFilter({ key: 'propertyType', value: pill.value }))}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap border flex items-center gap-2 ${
                  isSel 
                    ? 'bg-[#1A1A1A] text-white border-transparent shadow-sm' 
                    : 'bg-white text-[#666666] border-[#EAE6DF] hover:border-gray-300 hover:text-[#1A1A1A]'
                }`}
              >
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Filters Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 items-center">
            <span className="text-xs font-semibold text-[#666666] mr-1">Active Filters:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (!value || ['viewMode', 'page', 'sort', 'compareList'].includes(key)) return null;
              if (Array.isArray(value) && value.length === 0) return null;
              if (value === false) return null;
              
              const label = Array.isArray(value) ? value.join(', ') : value.toString();
              const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

              return (
                <span 
                  key={key} 
                  className="inline-flex items-center gap-1.5 bg-[#FAF8F5] border border-[#EAE6DF] px-3 py-1 rounded-full text-xs font-medium text-[#1A1A1A]"
                >
                  <span className="text-gray-400">{formattedKey}:</span> {label}
                  <button 
                    onClick={() => dispatch(clearFilter(key))}
                    className="text-gray-400 hover:text-red-500 font-bold ml-1 text-sm"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-display font-semibold text-navy-900 mb-2">No Properties Found</h3>
            <p className="text-slate-400 max-w-sm">Try adjusting your filters or search in a different area.</p>
          </div>
        ) : filters.viewMode === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px] items-stretch">
            {/* Left side cards */}
            <div className="lg:col-span-4 flex flex-col gap-4 max-h-[700px] overflow-y-auto pr-2 scrollbar-none">
              {properties.map((p, i) => (
                <PropertyCard key={p._id} property={p} index={i} />
              ))}
            </div>
            
            {/* Right side Google Maps iframe */}
            <div className="lg:col-span-8 rounded-[32px] overflow-hidden border border-[#EAE6DF] h-[500px] lg:h-full min-h-[500px] relative">
              <iframe 
                title="Property Map View"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83611311093!2d77.06889754716766!3d28.527218141019057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1714418641951!5m2!1sen!2sin" 
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        ) : (
          <motion.div
            className={`grid gap-6 ${
              filters.viewMode === 'list'
                ? 'grid-cols-1'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}
          >
            {properties.map((p, i) => (
              <PropertyCard key={p._id} property={p} index={i} />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {meta.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: Math.min(meta.pages, 10) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 flex items-center justify-center border ${
                  page === filters.page
                    ? 'bg-[#1A1A1A] text-white border-transparent shadow-md'
                    : 'bg-white text-[#666666] border-[#EAE6DF] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
        {/* Floating Compare Bar */}
        {filters.compareList && filters.compareList.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white px-6 py-4 rounded-full shadow-2xl z-50 flex items-center gap-6 border border-white/10 backdrop-blur-md">
            <span className="text-xs font-bold tracking-wide">
              {filters.compareList.length} / 4 Properties Selected
            </span>
            <div className="h-4 w-px bg-white/20" />
            <Link 
              to={`/compare?ids=${filters.compareList.join(',')}`}
              className="bg-[#7C5CFF] hover:bg-[#6D28D9] text-white text-xs font-bold px-4 py-2 rounded-full transition-all"
            >
              Compare Now
            </Link>
            <button 
              onClick={() => dispatch(clearCompare())}
              className="text-xs text-gray-400 hover:text-white"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </>
  );
}
