import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { setFilter } from '@store/slices/searchSlice';

const LISTING_TYPES = ['sale', 'rent', 'lease'];
const CITIES = ['Mumbai', 'Pune', 'Bangalore', 'Hyderabad', 'Delhi', 'Chennai', 'Nashik'];

export default function HeroSearch() {
  const [activeTab, setActiveTab] = useState('sale');
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ listingType: activeTab });
    if (keyword) params.set('keyword', keyword);
    dispatch(setFilter({ key: 'listingType', value: activeTab }));
    if (keyword) dispatch(setFilter({ key: 'keyword', value: keyword }));
    navigate(`/properties?${params.toString()}`);
  };

  const handleCityClick = (city) => {
    dispatch(setFilter({ key: 'city', value: city }));
    navigate(`/properties?city=${encodeURIComponent(city)}&listingType=${activeTab}`);
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Tabs */}
      <div className="flex gap-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 w-fit mb-4">
        {LISTING_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
              activeTab === type
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {type === 'sale' ? 'Buy' : type === 'rent' ? 'Rent' : 'Lease'}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by city, locality, or project..."
              className="flex-1 py-4 text-navy-900 placeholder-slate-400 focus:outline-none text-sm bg-transparent"
            />
          </div>
          <button type="submit" className="m-2 btn-primary btn-md px-6 py-3 rounded-xl whitespace-nowrap">
            Search
          </button>
        </div>
      </form>

      {/* Quick city links */}
      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-white/50 text-sm self-center">Popular:</span>
        {CITIES.slice(0, 5).map((city) => (
          <button
            key={city}
            onClick={() => handleCityClick(city)}
            className="text-white/70 hover:text-gold-400 text-sm font-medium transition-colors hover:underline"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
