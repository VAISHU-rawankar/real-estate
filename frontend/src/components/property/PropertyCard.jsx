import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartIcon as HeartOutline, MapPinIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { addToShortlist, removeFromShortlist, selectIsShortlisted } from '@store/slices/shortlistSlice';
import { showToast } from '@store/slices/uiSlice';

function formatPrice(price) {
  if (!price) return 'Price on Request';
  if (price >= 10_000_000) return `₹${(price / 10_000_000).toFixed(2)} Cr`;
  if (price >= 100_000) return `₹${(price / 100_000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

function PropertyBadge({ status, isFeatured }) {
  if (isFeatured) return (
    <span className="badge bg-gold-gradient text-white">
      <StarIcon className="w-3 h-3" /> Featured
    </span>
  );
  if (status === 'sold') return <span className="badge badge-red">Sold</span>;
  if (status === 'rented') return <span className="badge badge-navy">Rented</span>;
  if (status === 'under-construction') return <span className="badge badge-yellow">Under Construction</span>;
  return null;
}

export default function PropertyCard({ property, index = 0 }) {
  const dispatch = useDispatch();
  const isShortlisted = useSelector(selectIsShortlisted(property._id));

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
        <div className="card overflow-hidden hover-lift">
          {/* Image */}
          <div className="relative overflow-hidden h-52">
            <img
              src={image}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <PropertyBadge status={property.status} isFeatured={property.isFeatured} />
              {property.reraApproved && (
                <span className="badge bg-emerald-500 text-white">
                  <CheckBadgeIcon className="w-3 h-3" /> RERA
                </span>
              )}
            </div>

            {/* Shortlist button */}
            <button
              onClick={handleShortlist}
              className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                isShortlisted
                  ? 'bg-red-500 text-white shadow-lg scale-110'
                  : 'bg-white/80 text-slate-500 hover:bg-white hover:text-red-500 hover:scale-110'
              }`}
            >
              {isShortlisted
                ? <HeartSolid className="w-4 h-4" />
                : <HeartOutline className="w-4 h-4" />}
            </button>

            {/* Price */}
            <div className="absolute bottom-3 left-3">
              <span className="text-white font-display font-bold text-xl drop-shadow-lg">
                {property.formattedPrice || formatPrice(property.price)}
              </span>
              {property.listingType === 'rent' && (
                <span className="text-white/80 text-sm ml-1">/mo</span>
              )}
            </div>

            {/* Listing type */}
            <div className="absolute bottom-3 right-3">
              <span className="badge bg-navy-900/80 text-white capitalize">
                {property.listingType}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-display font-semibold text-navy-900 text-sm line-clamp-2 mb-2 group-hover:text-gold-600 transition-colors">
              {property.title}
            </h3>

            <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
              <MapPinIcon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{property.location?.locality}, {property.location?.city}</span>
            </div>

            {/* Specs */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              {property.bhkConfig && (
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-navy-900 uppercase">{property.bhkConfig}</span>
                </div>
              )}
              {property.carpetArea && (
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
                  <span>{property.carpetArea} sqft</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="text-slate-500 text-xs">
                  {property.bathrooms} Bath
                </div>
              )}
              {property.propertyType && (
                <span className="ml-auto text-xs text-slate-400 capitalize">{property.propertyType}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
