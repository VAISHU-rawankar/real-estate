import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useGetShortlistQuery } from '@store/api/userApi';
import PropertyCard from '@components/property/PropertyCard';
import PropertyCardSkeleton from '@components/property/PropertyCardSkeleton';
import { HeartIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function ShortlistPage() {
  const { data, isLoading } = useGetShortlistQuery();
  const items = data?.data || [];

  return (
    <>
      <Helmet><title>My Shortlist — RealEstate</title></Helmet>
      <div className="page-container py-10">
        <h1 className="section-title mb-2">Shortlisted Properties</h1>
        <p className="text-slate-400 mb-8">{items.length} property(ies) saved</p>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <HeartIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-xl text-navy-900 mb-2">No Properties Shortlisted</h3>
            <p className="text-slate-400 mb-6">Start browsing and save properties you love.</p>
            <Link to="/properties" className="btn-primary btn-md">Browse Properties</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => item.property && <PropertyCard key={item._id} property={item.property} index={i} />)}
          </div>
        )}
      </div>
    </>
  );
}
