import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AdjustmentsHorizontalIcon, Squares2X2Icon, ListBulletIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useGetPropertiesQuery } from '@store/api/propertyApi';
import PropertyCard from '@components/property/PropertyCard';
import PropertyCardSkeleton from '@components/property/PropertyCardSkeleton';
import { selectFilters, setFilter, setPage, setViewMode, setFiltersFromURL, selectActiveFilterCount } from '@store/slices/searchSlice';
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
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-navy-900">
              {filters.city ? `Properties in ${filters.city}` : 'All Properties'}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {loading ? 'Searching...' : `${meta.total || 0} properties found`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter toggle */}
            <button
              onClick={() => dispatch(toggleFilterDrawer())}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-navy-900 text-sm font-medium hover:border-gold-400 transition-colors"
            >
              <FunnelIcon className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-gold-500 text-white text-xs rounded-full font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={handleSortChange}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-navy-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold-400 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* View mode */}
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => dispatch(setViewMode('grid'))}
                className={`p-2 rounded-lg transition-colors ${filters.viewMode === 'grid' ? 'bg-white shadow-sm text-gold-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => dispatch(setViewMode('list'))}
                className={`p-2 rounded-lg transition-colors ${filters.viewMode === 'list' ? 'bg-white shadow-sm text-gold-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

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
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                  page === filters.page
                    ? 'bg-gold-500 text-white shadow-gold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-gold-400'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
