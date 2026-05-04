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
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

function CompareSlot({ property, onRemove, index, isBest }) {
  if (!property) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[28px] flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
          <PlusIcon className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-[13px] text-gray-400 font-semibold tracking-tight">Select a property</p>
      </div>
    );
  }

  const p = property.property || property;

  return (
    <div className={`bg-white border rounded-[32px] shadow-sm overflow-hidden relative group transition-all duration-500 ${isBest ? 'ring-2 ring-[#7C5CFF] border-transparent shadow-xl scale-[1.02]' : 'border-gray-100'}`}>
      {isBest && (
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-[#7C5CFF] text-white text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg animate-pulse">
            Best Deal
          </span>
        </div>
      )}
      
      <button
        onClick={() => onRemove(index)}
        className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/90 backdrop-blur-md hover:bg-rose-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all shadow-sm opacity-0 group-hover:opacity-100"
      >
        <TrashIcon className="w-4 h-4" />
      </button>

      {/* Image */}
      <div className="h-44 overflow-hidden relative">
        <img
          src={p?.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'}
          alt={p?.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Title */}
      <div className="p-5">
        <Link to={`/properties/${p?.slug}`} className="text-[15px] font-semibold text-[#111111] hover:text-[#7C5CFF] transition-colors line-clamp-1 font-display tracking-tight">
          {p?.title}
        </Link>
        <p className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5 mt-1 opacity-70">
          <MapPinIcon className="w-3.5 h-3.5 text-[#7C5CFF]" />
          {p?.location?.city || 'N/A'}, {p?.location?.state || ''}
        </p>
      </div>

      {/* Specs */}
      <div className="px-5 pb-6 space-y-4">
        <CompareRow icon={CurrencyRupeeIcon} label="Price" value={p?.price ? `₹${(p.price / 100000).toFixed(1)}L` : 'N/A'} />
        <CompareRow icon={HomeIcon} label="Type" value={p?.propertyType || 'N/A'} />
        <CompareRow icon={ArrowsPointingOutIcon} label="Area" value={p?.area ? `${p.area} sqft` : 'N/A'} />
        <CompareRow label="Bedrooms" value={p?.bedrooms || 'N/A'} />
        <CompareRow label="Bathrooms" value={p?.bathrooms || 'N/A'} />
        <CompareRow label="Parking" value={p?.parking ? 'Available' : 'No'} highlight={p?.parking} />
        <CompareRow label="Furnished" value={p?.furnishing || 'N/A'} />
        <CompareRow label="Floor" value={p?.floor || 'N/A'} />
      </div>
    </div>
  );
}

function CompareRow({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex items-center justify-between text-[11px] border-b border-gray-50 pb-2.5 last:border-0">
      <span className="text-gray-400 font-semibold flex items-center gap-2 uppercase tracking-widest text-[9px]">
        {Icon && <Icon className="w-3.5 h-3.5 text-gray-300" />}
        {label}
      </span>
      <span className={`font-semibold ${highlight === false ? 'text-rose-500' : highlight === true ? 'text-emerald-500' : 'text-[#111111]'}`}>
        {value}
      </span>
    </div>
  );
}

export default function ComparePage() {
  const { data, isLoading } = useGetShortlistQuery();
  const shortlist = data?.data || [];

  const [selected, setSelected] = useState([null, null, null]);
  const [bestId, setBestId] = useState(null);

  const handleSelect = (idx, propertyItem) => {
    setSelected(prev => {
      const next = [...prev];
      next[idx] = propertyItem;
      return next;
    });
    setBestId(null);
  };

  const handleRemove = (idx) => {
    setSelected(prev => {
      const next = [...prev];
      next[idx] = null;
      return next;
    });
    setBestId(null);
  };

  const handleCompare = () => {
    const valid = selected.filter(Boolean);
    if (valid.length < 2) return;

    // Simple score: Lowest Price per SqFt is the "Best Deal"
    let winner = null;
    let minScore = Infinity;

    valid.forEach(item => {
      const p = item.property || item;
      if (p.price && p.area) {
        const score = p.price / p.area;
        if (score < minScore) {
          minScore = score;
          winner = item._id;
        }
      }
    });

    // Fallback to lowest price if no area available
    if (!winner) {
      valid.forEach(item => {
        const p = item.property || item;
        if (p.price && p.price < minScore) {
          minScore = p.price;
          winner = item._id;
        }
      });
    }

    setBestId(winner);
  };

  return (
    <>
      <Helmet><title>Compare Properties — RealEstate</title></Helmet>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#7C5CFF]/10 rounded-2xl flex items-center justify-center shadow-sm">
              <ArrowsRightLeftIcon className="w-6 h-6 text-[#7C5CFF]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-semibold text-[#111111] tracking-tight">Compare Properties</h1>
              <p className="text-[13px] text-gray-400 font-medium opacity-80 mt-1">Side-by-side analysis of your top saved picks</p>
            </div>
          </div>
          
          <button 
            onClick={handleCompare}
            disabled={selected.filter(Boolean).length < 2}
            className="px-10 py-4 bg-[#111111] text-white font-semibold rounded-[20px] text-[12px] uppercase tracking-widest hover:bg-[#7C5CFF] transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-black/10 active:scale-95"
          >
            Find Best Deal
          </button>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[32px] border border-gray-100 p-5 animate-pulse h-[500px]" />
            ))}
          </div>
        )}

        {!isLoading && shortlist.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-[40px] py-24 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mb-6">
              <BuildingOfficeIcon className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-display font-semibold text-[#111111] mb-2">No properties to compare</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto mb-10 font-medium opacity-70">Save some luxury properties first, then use this tool to find the perfect one.</p>
            <Link
              to="/properties"
              className="px-12 py-4 bg-[#111111] text-white rounded-2xl text-[12px] font-semibold uppercase tracking-widest hover:bg-[#7C5CFF] transition-all shadow-xl shadow-black/5"
            >
              Start Searching
            </Link>
          </div>
        )}

        {!isLoading && shortlist.length > 0 && (
          <>
            {/* Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[0, 1, 2].map(idx => (
                <div key={idx} className="relative group">
                  <select
                    value={selected[idx]?._id || ''}
                    onChange={e => {
                      const item = shortlist.find(s => s._id === e.target.value);
                      handleSelect(idx, item || null);
                    }}
                    className="w-full pl-6 pr-12 py-4 rounded-[20px] border border-gray-100 text-[13px] font-semibold outline-none focus:border-[#7C5CFF] bg-white transition-all appearance-none cursor-pointer group-hover:border-[#7C5CFF]/30 shadow-sm text-[#111111]"
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
                  <ChevronRightIcon className="w-4 h-4 text-gray-300 absolute right-6 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none group-hover:text-[#7C5CFF] transition-colors" />
                </div>
              ))}
            </div>

            {/* Compare Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {[0, 1, 2].map(idx => (
                <CompareSlot 
                  key={idx} 
                  property={selected[idx]} 
                  onRemove={handleRemove} 
                  index={idx} 
                  isBest={selected[idx]?._id === bestId}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
