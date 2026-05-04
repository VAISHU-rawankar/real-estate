import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useGetShortlistQuery } from '@store/api/userApi';
import PropertyCard from '@components/property/PropertyCard';
import PropertyCardSkeleton from '@components/property/PropertyCardSkeleton';
import { HeartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ShortlistPage() {
  const { data, isLoading } = useGetShortlistQuery();
  const items = data?.data || [];

  return (
    <>
      <Helmet><title>My Shortlist — RealEstate</title></Helmet>
      <div className="bg-[#FAFAFA] min-h-screen py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link to="/properties" className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#7C5CFF] uppercase tracking-wider hover:translate-x-1 transition-transform mb-4 group">
                <ArrowLeftIcon className="w-3.5 h-3.5" />
                Back to Search
              </Link>
              <h1 className="text-2xl md:text-3xl font-display font-semibold text-[#111111] tracking-tight">My Shortlist</h1>
              <p className="text-gray-400 text-sm font-medium mt-2 opacity-80">
                You have saved <span className="text-[#111111] font-semibold">{items.length}</span> luxury properties to your account.
              </p>
            </motion.div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
            </div>
          ) : items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] border border-gray-100 p-16 text-center shadow-sm"
            >
              <div className="w-20 h-20 bg-[#F0EEFF] rounded-[32px] flex items-center justify-center mx-auto mb-8">
                <HeartIcon className="w-8 h-8 text-[#7C5CFF]" />
              </div>
              <h3 className="text-xl font-display font-semibold text-[#111111] mb-2">Your shortlist is empty</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-10 text-sm font-medium opacity-80">
                Explore our curated collection of premium properties and tap the heart icon to save the ones that catch your eye.
              </p>
              <Link to="/properties" className="inline-flex items-center justify-center px-10 py-4 bg-[#111111] text-white font-semibold rounded-2xl hover:bg-[#7C5CFF] transition-all shadow-xl shadow-black/5 uppercase text-[11px] tracking-widest">
                Explore Properties
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item, i) => item.property && (
                <PropertyCard 
                  key={item._id} 
                  property={item.property} 
                  index={i} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
