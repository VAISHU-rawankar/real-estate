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
      <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link to="/properties" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#7C5CFF] transition-colors mb-4 group">
                <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Search
              </Link>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-[#111111]">My Shortlist</h1>
              <p className="text-gray-400 font-medium mt-3">
                You have saved <span className="text-[#111111] font-bold">{items.length}</span> luxury properties to your account.
              </p>
            </motion.div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
            </div>
          ) : items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] border border-gray-100 p-16 text-center shadow-sm"
            >
              <div className="w-24 h-24 bg-[#F0EEFF] rounded-[32px] flex items-center justify-center mx-auto mb-8">
                <HeartIcon className="w-10 h-10 text-[#7C5CFF]" />
              </div>
              <h3 className="text-2xl font-display font-bold text-[#111111] mb-3">Your shortlist is empty</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-10 font-medium">
                Explore our curated collection of premium properties and tap the heart icon to save the ones that catch your eye.
              </p>
              <Link to="/properties" className="inline-flex items-center justify-center px-10 py-4 bg-[#111111] text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl shadow-black/10">
                Explore Properties
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
