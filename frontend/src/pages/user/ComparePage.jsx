import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetShortlistQuery } from '@store/api/userApi';
import {
  ArrowsRightLeftIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  HomeIcon,
  ArrowsPointingOutIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

function CompareSlot({ property, onRemove, index }) {
  if (!property) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center py-16 px-4 text-center">
        <PlusIcon className="w-10 h-10 text-gray-300 mb-2" />
        <p className="text-sm text-gray-400 font-medium">Select a property</p>
      </div>
    );
  }

  const p = property.property || property;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden relative group">
      <button
        onClick={() => onRemove(index)}
        className="absolute top-3 right-3 z-10 w-7 h-7 bg-white/90 hover:bg-red-50 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
      >
        <TrashIcon className="w-4 h-4" />
      </button>

      {/* Image */}
      <img
        src={p?.images?.[0]?.url || 'https://via.placeholder.com/300x180?text=Property'}
        alt={p?.title}
        className="w-full h-40 object-cover"
      />

      {/* Title */}
      <div className="p-4">
        <Link to={`/properties/${p?.slug}`} className="font-bold text-[#111111] text-sm hover:text-[#7C5CFF] transition-colors line-clamp-1">
          {p?.title}
        </Link>
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
          <MapPinIcon className="w-3.5 h-3.5" />
          {p?.location?.city || 'N/A'}, {p?.location?.state || ''}
        </p>
      </div>

      {/* Specs */}
      <div className="px-4 pb-4 space-y-3">
        <CompareRow icon={CurrencyRupeeIcon} label="Price" value={p?.price ? `₹${(p.price / 100000).toFixed(1)}L` : 'N/A'} />
        <CompareRow icon={HomeIcon} label="Type" value={p?.propertyType || 'N/A'} />
        <CompareRow icon={ArrowsPointingOutIcon} label="Area" value={p?.area ? `${p.area} sq.ft` : 'N/A'} />
        <CompareRow label="Bedrooms" value={p?.bedrooms || 'N/A'} />
        <CompareRow label="Bathrooms" value={p?.bathrooms || 'N/A'} />
        <CompareRow label="Parking" value={p?.parking ? '✓' : '✗'} highlight={p?.parking} />
        <CompareRow label="Furnished" value={p?.furnishing || 'N/A'} />
        <CompareRow label="Floor" value={p?.floor || 'N/A'} />
        <CompareRow label="Listed" value={p?.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'} />
      </div>
    </div>
  );
}

function CompareRow({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
      <span className="text-gray-400 text-xs font-medium flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </span>
      <span className={`font-semibold text-xs ${highlight === false ? 'text-red-400' : highlight === true ? 'text-green-500' : 'text-[#111111]'}`}>
        {value}
      </span>
    </div>
  );
}

export default function ComparePage() {
  const { data, isLoading } = useGetShortlistQuery();
  const shortlist = data?.data || [];

  const [selected, setSelected] = useState([null, null, null]);

  const handleSelect = (idx, propertyItem) => {
    setSelected(prev => {
      const next = [...prev];
      next[idx] = propertyItem;
      return next;
    });
  };

  const handleRemove = (idx) => {
    setSelected(prev => {
      const next = [...prev];
      next[idx] = null;
      return next;
    });
  };

  const availableProperties = shortlist.filter(
    item => !selected.some(s => s && (s._id === item._id))
  );

  return (
    <>
      <Helmet><title>Compare Properties — RealEstate</title></Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#7C5CFF]/10 rounded-xl flex items-center justify-center">
            <ArrowsRightLeftIcon className="w-5 h-5 text-[#7C5CFF]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111111]">Compare Properties</h1>
            <p className="text-sm text-gray-400">Select up to 3 saved properties to compare side by side</p>
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-96" />
            ))}
          </div>
        )}

        {!isLoading && shortlist.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BuildingOfficeIcon className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-lg font-bold text-gray-400 mb-2">No saved properties</h3>
            <p className="text-sm text-gray-400 mb-6">Save some properties first, then compare them here.</p>
            <Link
              to="/properties"
              className="px-6 py-2.5 bg-[#111111] text-white rounded-full text-sm font-semibold hover:bg-[#7C5CFF] transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        )}

        {!isLoading && shortlist.length > 0 && (
          <>
            {/* Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[0, 1, 2].map(idx => (
                <select
                  key={idx}
                  value={selected[idx]?._id || ''}
                  onChange={e => {
                    const item = shortlist.find(s => s._id === e.target.value);
                    handleSelect(idx, item || null);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-[#7C5CFF] bg-white transition-all"
                >
                  <option value="">— Select Property {idx + 1} —</option>
                  {shortlist.map(item => {
                    const p = item.property || item;
                    return (
                      <option key={item._id} value={item._id} disabled={selected.some(s => s?._id === item._id)}>
                        {p?.title || 'Unknown Property'}
                      </option>
                    );
                  })}
                </select>
              ))}
            </div>

            {/* Compare Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map(idx => (
                <CompareSlot key={idx} property={selected[idx]} onRemove={handleRemove} index={idx} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
