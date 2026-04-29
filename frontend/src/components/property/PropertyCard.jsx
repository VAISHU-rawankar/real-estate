import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartIcon as HeartOutline, MapPinIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { addToShortlist, removeFromShortlist, selectIsShortlisted } from '@store/slices/shortlistSlice';
import { showToast } from '@store/slices/uiSlice';
import { addToCompare, removeFromCompare, selectFilters } from '@store/slices/searchSlice';

function formatPrice(price) {
  if (!price) return 'Price on Request';
  if (price >= 10_000_000) return `₹${(price / 10_000_000).toFixed(2)} Cr`;
  if (price >= 100_000) return `₹${(price / 100_000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

export default function PropertyCard({ property, index = 0 }) {
  const dispatch = useDispatch();
  const isShortlisted = useSelector(selectIsShortlisted(property._id));
  const { compareList } = useSelector(selectFilters);
  const isCompared = compareList?.includes(property._id);

  const handleShortlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isShortlisted) {
      dispatch(removeFromShortlist(property._id));
      dispatch(showToast({ type: 'info', message: 'Removed from shortlist' }));
    } else {
      dispatch(addToShortlist(property._id));
      dispatch(showToast({ type: 'success', message: 'Added to shortlist!' }));
    }
  };

  const image = property.images?.[0]?.thumbnailUrl || property.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/properties/${property.slug}`} className="block group">
        <div className="bg-white rounded-[24px] border border-[#EAE6DF] overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#D4A853]/30">
          {/* Image */}
          <div className="relative h-[220px] overflow-hidden">
            <img
              src={image}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Soft Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-[#FAF8F5]/90 backdrop-blur-md text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm border border-[#EAE6DF] uppercase tracking-wider">
                {property.listingType}
              </span>
              {property.isFeatured && (
                <span className="bg-[#FAF8F5]/90 backdrop-blur-md text-[#1A1A1A] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm border border-[#EAE6DF]">
                  <StarIcon className="w-3.5 h-3.5 text-[#D4A853]" /> Featured
                </span>
              )}
            </div>

            {/* Shortlist button */}
            <button
              onClick={handleShortlist}
              className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 bg-white/80 text-[#1A1A1A] hover:bg-white hover:text-red-500 shadow-sm ${
                isShortlisted ? 'text-red-500' : ''
              }`}
            >
              {isShortlisted ? <HeartSolid className="w-4 h-4" /> : <HeartOutline className="w-4 h-4" />}
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex justify-between items-start gap-2 mb-2">
              <span className="text-xl font-display font-bold text-[#1A1A1A]">
                {property.formattedPrice || formatPrice(property.price)}
              </span>
              {property.listingType === 'rent' && (
                <span className="text-xs text-[#666666] self-center -ml-1">/ month</span>
              )}
            </div>

            <h3 className="font-display font-semibold text-[#1A1A1A] text-base mb-2 group-hover:text-[#8C6D45] transition-colors truncate">
              {property.title}
            </h3>

            <div className="flex items-center gap-1 text-[#666666] text-xs mb-4">
              <MapPinIcon className="w-4 h-4 flex-shrink-0 text-gray-400" />
              <span className="truncate">{property.location?.locality}, {property.location?.city}</span>
            </div>

            {/* Specs */}
            <div className="flex items-center gap-4 pt-4 border-t border-[#EAE6DF] text-xs font-medium text-[#1A1A1A]">
              {property.bhkConfig && (
                <div className="flex items-center gap-1">
                  <span className="uppercase">{property.bhkConfig}</span>
                </div>
              )}
              {property.carpetArea && (
                <div className="flex items-center gap-1 text-[#666666]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EAE6DF]" />
                  <span>{property.carpetArea} sqft</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1 text-[#666666]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EAE6DF]" />
                  <span>{property.bathrooms} Bath</span>
                </div>
              )}
              <span className="ml-auto text-[#666666] text-xxs font-semibold uppercase bg-[#FAF8F5] border border-[#EAE6DF] px-2 py-0.5 rounded-md">
                {property.propertyType}
              </span>
            </div>

            {/* Contact expert and compare trigger rows */}
            <div className="mt-4 flex gap-2">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/contact?property=${property.slug}`;
                }}
                className="w-full bg-[#7C5CFF] hover:bg-[#6D28D9] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm shadow-[#7C5CFF]/20"
              >
                Contact Expert
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isCompared) {
                    dispatch(removeFromCompare(property._id));
                    dispatch(showToast({ type: 'info', message: 'Removed from comparison list' }));
                  } else {
                    dispatch(addToCompare(property._id));
                    dispatch(showToast({ type: 'success', message: 'Added to comparison list!' }));
                  }
                }}
                className={`px-3 rounded-xl border transition-all text-xs font-bold ${
                  isCompared 
                    ? 'bg-purple-100 border-purple-300 text-purple-700' 
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                {isCompared ? 'Added' : 'Compare'}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
