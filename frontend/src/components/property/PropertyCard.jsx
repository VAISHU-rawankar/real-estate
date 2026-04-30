import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartIcon as HeartOutline, MapPinIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { addToShortlist as localAdd, removeFromShortlist as localRemove, selectIsShortlisted } from '@store/slices/shortlistSlice';
import { showToast } from '@store/slices/uiSlice';
import { addToCompare, removeFromCompare, selectFilters } from '@store/slices/searchSlice';
import { selectIsAuthenticated } from '@store/slices/authSlice';
import { useAddToShortlistMutation, useRemoveFromShortlistMutation } from '@store/api/userApi';

function formatPrice(price) {
  if (!price) return 'Price on Request';
  if (price >= 10_000_000) return `₹${(price / 10_000_000).toFixed(2)} Cr`;
  if (price >= 100_000) return `₹${(price / 100_000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

export default function PropertyCard({ property, index = 0 }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isShortlisted = useSelector(selectIsShortlisted(property._id));
  
  const [apiAdd, { isLoading: isAdding }] = useAddToShortlistMutation();
  const [apiRemove, { isLoading: isRemoving }] = useRemoveFromShortlistMutation();

  const handleShortlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAuthenticated) {
      try {
        if (isShortlisted) {
          await apiRemove(property._id).unwrap();
          dispatch(localRemove(property._id));
          dispatch(showToast({ type: 'info', message: 'Removed from shortlist' }));
        } else {
          await apiAdd(property._id).unwrap();
          dispatch(localAdd(property._id));
          dispatch(showToast({ type: 'success', message: 'Saved to shortlist!' }));
        }
      } catch (err) {
        dispatch(showToast({ type: 'error', message: 'Failed to update shortlist' }));
      }
    } else {
      if (isShortlisted) {
        dispatch(localRemove(property._id));
        dispatch(showToast({ type: 'info', message: 'Removed from shortlist' }));
      } else {
        dispatch(localAdd(property._id));
        dispatch(showToast({ type: 'success', message: 'Added to local shortlist!' }));
      }
    }
  };

  const FALLBACK_CONFIG = {
    villa: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    ],
    apartment: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    ],
    flat: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    ],
    home: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    ],
    plot: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800',
    ],
    commercial: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800',
    ],
    default: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    ]
  };

  const getType = () => {
    const type = (property.propertySubType || property.propertyType || '').toLowerCase();
    if (type.includes('villa')) return 'villa';
    if (type.includes('apartment') || type.includes('flat')) return 'apartment';
    if (type.includes('plot') || type.includes('land')) return 'plot';
    if (type.includes('commercial') || type.includes('office')) return 'commercial';
    if (type.includes('home') || type.includes('house')) return 'home';
    return 'default';
  };

  const typeKey = getType();
  const imagesForType = FALLBACK_CONFIG[typeKey] || FALLBACK_CONFIG.default;
  
  // Use property ID to pick a consistent image for this property, even across re-renders
  const idSum = property._id ? property._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : index;
  const fallbackImage = imagesForType[idSum % imagesForType.length];
  
  const rawImage = property.images?.[0]?.thumbnailUrl || property.images?.[0]?.url;
  // If the image looks like a placeholder or is missing, use the type-specific premium fallback
  const isPlaceholder = !rawImage || rawImage.includes('photo-1564013799919-ab600027ffc6');
  const image = isPlaceholder ? fallbackImage : rawImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group h-full"
    >
      <Link to={`/properties/${property.slug}`} className="block h-full">
        <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200 h-full flex flex-col">
          
          {/* Image Container */}
          <div className="relative h-[180px] overflow-hidden">
            <img
              src={image}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Sale Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-[#4F46E5] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                {property.listingType === 'rent' ? 'For Rent' : 'Sale'}
              </span>
            </div>

            {/* Heart Icon */}
            <button
              onClick={handleShortlist}
              disabled={isAdding || isRemoving}
              className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
                isShortlisted ? 'bg-white text-indigo-600 shadow-lg' : 'bg-white/90 text-indigo-400 hover:bg-white hover:text-indigo-600 shadow-md'
              }`}
            >
              {isShortlisted ? (
                <HeartSolid className="w-4 h-4" />
              ) : (
                <HeartOutline className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Content Container */}
          <div className="p-5 flex flex-col flex-grow">
            <div className="mb-4">
               <div className="text-[20px] font-display font-bold text-[#111111] mb-1">
                 {property.formattedPrice || formatPrice(property.price)}
               </div>
               <h3 className="text-[14px] font-semibold text-[#111111] leading-tight mb-2 truncate">
                 {property.title}
               </h3>
               <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-medium">
                 <MapPinIcon className="w-3.5 h-3.5" />
                 <span className="truncate">{property.location?.locality}, {property.location?.city}</span>
               </div>
            </div>

            {/* Stats Row */}
            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-gray-400 text-[11px] font-bold uppercase tracking-wider">
               <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                  <span>{property.bedrooms || property.bhkConfig || '2'} Beds</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                  <span>{property.bathrooms || '2'} Baths</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                  <span>{property.carpetArea || '1200'} sqft</span>
               </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
